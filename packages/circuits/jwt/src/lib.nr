use noir_rsa::bignum::BigNum;
use noir_rsa::bignum::runtime_bignum::BigNumInstance;
use noir_rsa::bignum::fields::Params2048;
use noir_rsa::rsa::RSA;

// TODO: use official noir base64 library when it supports base64url
mod noir_base64;

// Note: keep in sync with JS
global JWT_SUB_MAX_LEN: u32 = 64; // UUID is 36 chars but we add some buffer to be safe

global PUBKEY_LIMBS_LEN: u32 = 18;
global SIGNATURE_LIMBS_LEN: u32 = 18;

type BN2048 = BigNum<18, Params2048>;
global rsa = RSA::<BN2048, BigNumInstance<18, Params2048>, 256> {};

pub fn assert_verify_jwt<
    let HeaderAndPayloadMaxLen: u32,
    let PayloadJsonMaxLen: u32,
    let PayloadJsonBase64MaxLen: u32
>(
    header_and_payload: BoundedVec<u8, HeaderAndPayloadMaxLen>,
    // padded with spaces, so JSON parser can parse it
    payload_json_padded: [u8; PayloadJsonMaxLen],
    pubkey_limbs: [Field; PUBKEY_LIMBS_LEN],
    pubkey_redc_limbs: [Field; PUBKEY_LIMBS_LEN],
    signature: [Field; SIGNATURE_LIMBS_LEN]
) {
    let signature: BN2048 = BigNum::from_array(signature);
    let pubkey: BigNumInstance<18, Params2048> = BigNumInstance::new(pubkey_limbs, pubkey_redc_limbs);

    assert_payloads_match::<HeaderAndPayloadMaxLen, PayloadJsonMaxLen, PayloadJsonBase64MaxLen>(header_and_payload, payload_json_padded);

    let hash = std::hash::sha256_var(header_and_payload.storage, header_and_payload.len() as u64);
    let result = rsa.verify_sha256_pkcs1v15(pubkey, hash, signature, 65537);
    assert(result, "jwt verification failed: signature");
}

pub fn assert_verify_jwt_payload<let N: u32>(payload_json_padded: [u8; N], account_id: Field, salt: Field, block_timestamp_seconds: u64, jwt_valid_for_seconds: u64) {
    // TODO(security): haystack size should be based on N
    let haystack: string_search::StringBody1024 = string_search::StringBody::new(payload_json_padded, payload_json_padded.len());

    {
        // verify "jwt.sub"
        let needle_text = "\"sub\":\"".as_bytes();
        let needle: string_search::SubString32 = string_search::SubString::new(needle_text, needle_text.len());
        let (result, match_position) = haystack.substring_match(needle);
        assert(result, "jwt.sub not found");
        let mut data = [0 as Field; JWT_SUB_MAX_LEN + 1];
        let mut stop = false;
        for i in 0..JWT_SUB_MAX_LEN {
            let chr = payload_json_padded[match_position + needle_text.len() + i];
            if chr == "\"".as_bytes()[0] {
                stop = true;
            }
            if !stop {
                data[i] = chr as Field;
            }
        }
        assert(stop, "jwt.sub is too long");
        data[data.len() - 1] = salt;
        let hash = std::hash::pedersen_hash(data);
        assert(hash == account_id, "jwt.sub mismatch");
    }

    {
        // verify "jwt.iat"
        let needle_text = "\"iat\":".as_bytes();
        let needle: string_search::SubString32 = string_search::SubString::new(needle_text, needle_text.len());
        let (result, match_position) = haystack.substring_match(needle);
        assert(result, "jwt.iat not found");
        let mut data = [0 as u8; 20];
        let mut stop = false;
        for i in 0..20 {
            let chr = payload_json_padded[match_position + needle_text.len() + i];
            if chr == ",".as_bytes()[0] {
                stop = true;
            }
            if !stop {
                data[i] = chr;
            }
        }
        assert(stop, "jwt.iat is too long");
        let iat = nodash::str_to_u64(data);
        assert(iat + jwt_valid_for_seconds >= block_timestamp_seconds, "jwt.iat is too old");
    }
}

fn assert_payloads_match<let N: u32, let M: u32, let M2: u32>(header_and_payload: BoundedVec<u8, N>, payload_json_padded: [u8; M]) {
    let from_index = unsafe {
        let dot_index = find_dot(header_and_payload.storage);
        assert(header_and_payload.storage[dot_index] == ".".as_bytes()[0], "dot not found");
        dot_index + 1
    };

    // noir team switched it up, decode is encode
    let encoded: [u8; M2] = noir_base64::base64url_decode(payload_json_padded);

    for i in 0..M2 {
        let j = from_index + i;
        // TODO(security): assert that the rest of the json payload is empty
        if j < header_and_payload.len() - 1 {
            assert(header_and_payload.storage[j] == encoded[i], "payload mismatch");
        }
    }
}

unconstrained fn find_dot<let N: u32>(input: [u8; N]) -> u32 {
    let mut result = 0;
    let mut found = false;
    for i in 0..N {
        if (input[i] == ".".as_bytes()[0]) {
            result = i;
            found = true;
            break;
        }
    }
    assert(found, "dot not found");
    result
}


mod tests {
    use crate::{assert_verify_jwt, assert_verify_jwt_payload};

    global pubkey_limbs = [0x9d9b7ab520532396758488b2100155, 0x87ff0f733247ea1ae377d26bdd60aa, 0x55e1805ec2babe74ebadb5de3c29a7, 0x4131e289b5519e562dff8935a669e2, 0xe974f2f0179abc0cc837efb26a9d5d, 0x72f158dfb2a2ba0fd881d8742426ec, 0x7e56e9182ef83caea0a45cfdaba45a, 0xc2b9b23f6684f0442257dbb8a37291, 0xfc0ecae4fe9f8be5c52a91edd59db2, 0x3ba9bd0376ade89881c7bafa2b36de, 0x3548bec7032b97739300f7fd72769b, 0x6a5b4b975ccf938c5e63ee41d57c7c, 0x4fabc9dbb6a9157f91a87adaff6e66, 0x303d705edf9cae022cd91f57f332b6, 0x1834cc2b65d9d2cab6dd210ba58cad, 0x43b9c3ca0df606d243d4c442794829, 0x5239e9f174adc5871d580714b1eb98, 0xe1];
    global pubkey_redc_limbs = [0x1e7578875458139006e47aac5c17fb, 0x249a5affa65fe288cb0df8ab6548be, 0xc29ec9b115f3132ff5fb71e744fba3, 0xbde4d1e1b2e894dd482277dc14aba5, 0x675f382edc2e53fabb2c785f0dd7e8, 0x8af86434e50f50ddfc9b46ce2c8990, 0xbaf8f36a4caec8a61d14be456599d3, 0x4ac14c9865afb8da5ab36b76e6d651, 0x2be72e03504024bbc777e0a1e9d16d, 0x249a0c4d673705ab5ad1757a225fea, 0x0300712f5005899fffeb1289f9ef4b, 0x73eb759f585e597acb40bfbf59efed, 0xe070a169f35358c7ead1df56d02d4b, 0x5657e0c005b6bca107abd9024b4dd1, 0xe6da2103c7938911ca44a5e641c541, 0xc98e9e1235394e0eb2b87143fd42c3, 0xdb1c76abaf095069edf0ea5248ef95, 0x0122];
    global signature_limbs = [ 0xdeb3d9e65c83f099ba81c195e73ad7, 0x1725bb0cfac4a0f8f7cf4bbc7f60e3, 0x76fb0313811acf9331691a447b94c9, 0xaeccb30ac938820bf948921aa9564d, 0x4430a40bd11210fce1fbe0480b99f4, 0x8ee312afa4787b642c278922067888, 0x561872bef836caf62ad8f24d9bd1d8, 0xee5789802ead0220cec1bd9cdfa529, 0x7808ec1e395f2bd3171d98d90b3b41, 0x798138822157416099ad8855e02387, 0xbcb57fa754dba33c6151af53ea6e6d, 0x38bcf4e006a066d24b58015ac1f46f, 0xde8f69f2139e80977548e6f2c1155c, 0xb27594239d0354231ab2ac7c46f24c, 0x6fc9f8969fd33cce7bfca5aa90065c, 0x2351e1ecd318054dedeaca5590a2ac, 0x0e24ace8dce77296e141f782d8365c, 0x68 ];
    global header_base64url: [u8; 102] = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1MGY2ZTcwZWY0YjU0OGE1ZmQ5MTQyZWVjZDFmYjhmNTRkY2U5ZWUiLCJ0eXAiOiJKV1QifQ".as_bytes();
    global payload_base64url: [u8; 706] = "eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2OTgxMDk0NzQ4MDUtbnZmZzloaDMxa2ptYjZtbW41MWQ0b2lvbWJncjNzM3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2OTgxMDk0NzQ4MDUtbnZmZzloaDMxa2ptYjZtbW41MWQ0b2lvbWJncjNzM3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTYzMjIyNTIzMjA3NTUyMTgyMjIiLCJlbWFpbCI6ImJhc2UuZW1haWwud2FsbGV0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiOThzUV9PbWxRazVwaWRtc3dTMTE0dyIsIm5hbWUiOiJUZXN0IEdtYWlsIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pVa3FXYVpVMUtxX1RKMU5tak9XWUtBZ1VSc2txUl9IX21FbXVIQmVGRklCSHhWUT1zOTYtYyIsImdpdmVuX25hbWUiOiJUZXN0IiwiZmFtaWx5X25hbWUiOiJHbWFpbCIsImlhdCI6MTcyODc5NjM0NiwiZXhwIjoxNzI4Nzk5OTQ2fQ".as_bytes();
    global payload_json_padded: [u8; 529] = "{\"iss\":\"https://accounts.google.com\",\"azp\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"aud\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"sub\":\"116322252320755218222\",\"email\":\"base.email.wallet@gmail.com\",\"email_verified\":true,\"at_hash\":\"98sQ_OmlQk5pidmswS114w\",\"name\":\"Test Gmail\",\"picture\":\"https://lh3.googleusercontent.com/a/ACg8ocJUkqWaZU1Kq_TJ1NmjOWYKAgURskqR_H_mEmuHBeFFIBHxVQ=s96-c\",\"given_name\":\"Test\",\"family_name\":\"Gmail\",\"iat\":1728796346,\"exp\":1728799946}".as_bytes();

    #[test]
    fn test_jwt() {
            assert_verify_jwt::<809, 529, 708>(
                concat_header_and_payload::<102, 706>(
                    BoundedVec::from_array(header_base64url),
                    BoundedVec::from_array(payload_base64url)
                ),
                payload_json_padded,
                pubkey_limbs,
                pubkey_redc_limbs,
                signature_limbs
        );
    }

    #[test]
    fn test_jwt_payload() {
        let salt = 123;
        let account_id = 0x161cf12a6f018200f9492d0fbbdf3b8f20665708b3f69ba1ab4dd2c71725dd5f;
        assert_verify_jwt_payload(payload_json_padded, account_id, salt, 1689968000, 99999999);
    }


    fn concat_header_and_payload<let H: u32, let P: u32>(
        header: BoundedVec<u8, H>,
        payload: BoundedVec<u8, P>
    ) -> BoundedVec<u8, H + 1 + P> {
        let mut concated = BoundedVec { storage: [0; H + 1 + P], len: 0 };
        for i in 0..H {
            if i < header.len() {
                concated.push(header.get(i));
            }
        }
        concated.push(".".as_bytes()[0]);
        for i in 0..P {
            if i < payload.len() {
                concated.push(payload.get(i));
            }
        }
        concated
    }
}
