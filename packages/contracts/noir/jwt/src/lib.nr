use rsa::{rsa::verify_sha256_pkcs1v15, types::RBN2048};
use bignum::{params::BigNumParams, RuntimeBigNum};

// TODO: use official noir base64 library when it supports base64url
mod noir_base64;

// Note: keep in sync with JS
// TODO(security): if sub is too long, account is lost
global JWT_SUB_MAX_LEN: u32 = 64; // UUID is 36 chars but we add some buffer to be safe
// Note: keep in sync with JS
// TODO(security): if aud is too long, account is lost
global JWT_AUD_MAX_LEN: u32 = 256;
// Note: keep in sync with JS
global JWT_NONCE_LEN: u32 = 64; // 32 bytes

pub fn assert_verify_jwt<
    let HeaderAndPayloadMaxLen: u32,
    let PayloadJsonMaxLen: u32,
    let PayloadJsonBase64MaxLen: u32
>(
    header_and_payload: BoundedVec<u8, HeaderAndPayloadMaxLen>,
    // padded with spaces, so JSON parser can parse it
    payload_json_padded: [u8; PayloadJsonMaxLen],
    pubkey_limbs: [Field; 18],
    pubkey_redc_limbs: [Field; 18],
    signature: [Field; 18]
) {
    assert_payloads_match::<HeaderAndPayloadMaxLen, PayloadJsonMaxLen, PayloadJsonBase64MaxLen>(header_and_payload, payload_json_padded);

    // Verify RSA signature
    let hash = std::hash::sha256_var(header_and_payload.storage, header_and_payload.len() as u64);
    let params: BigNumParams<18, 2048> =
        BigNumParams::new(false, pubkey_limbs, pubkey_redc_limbs);
    let signature: RBN2048 = RBN2048::from_array(params, signature);
    let result = verify_sha256_pkcs1v15(hash, signature, 65537);
    assert(result, "jwt verification failed: signature");
}

pub fn assert_verify_jwt_payload<let N: u32>(payload_json_padded: [u8; N], account_id: Field, salt: Field, expected_jwt_iat: u64, expected_jwt_nonce: [u8; JWT_NONCE_LEN]) {
    // TODO(security): haystack size should be based on N
    assert(N <= 1024, "payload_json length must be less than 1024");
    let haystack: string_search::StringBody1024 = string_search::StringBody::new(payload_json_padded, payload_json_padded.len());

    {
        // verify "account_id"
        let jwt_sub: [u8; JWT_SUB_MAX_LEN] = extract_jwt_payload_field_str(haystack, "sub");
        let jwt_aud: [u8; JWT_AUD_MAX_LEN] = extract_jwt_payload_field_str(haystack, "aud");
        let data = nodash::pack_bytes(jwt_sub).concat(nodash::pack_bytes(jwt_aud)).concat([salt]);
        let hash = std::hash::pedersen_hash(data);
        assert(hash == account_id, f"account_id mismatch: expected {account_id}, got {hash}");
    }

    {
        // verify "jwt.nonce"
        let jwt_nonce: [u8; JWT_NONCE_LEN] = extract_jwt_payload_field_str(haystack, "nonce");
        assert(jwt_nonce == expected_jwt_nonce, f"jwt.nonce mismatch: expected {expected_jwt_nonce}, got {jwt_nonce}");
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
        assert(expected_jwt_iat == iat, "jwt.iat mismatch");
    }
}

fn extract_jwt_payload_field_str<let N: u32, let H: u32>(haystack: string_search::StringBody1024, needle_text: str<H>) -> [u8; N] {
    // `needle` -> `"needle": "`
    let needle_text = "\"".as_bytes().concat(needle_text.as_bytes()).concat("\":\"".as_bytes());

    let needle: string_search::SubString32 = string_search::SubString::new(needle_text, needle_text.len());
    let (result, match_position) = haystack.substring_match(needle);
    assert(result, "jwt field not found");
    let mut data = [0 as u8; N];
    let mut stop = false;
    for i in 0..N {
        let chr = haystack.body[match_position + needle_text.len() + i];
        if chr == "\"".as_bytes()[0] {
            stop = true;
        }
        if !stop {
            data[i] = chr;
        }
    }
    assert(stop | (haystack.body[match_position + needle_text.len() + N] == "\"".as_bytes()[0]), "jwt field is too long");
    data
}

fn assert_payloads_match<let N: u32, let M: u32, let M2: u32>(header_and_payload: BoundedVec<u8, N>, payload_json_padded: [u8; M]) {
    assert(M2 == nodash::div_ceil(M, 3) * 4, "payload_json_padded length mismatch");
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

    global pubkey_limbs: [Field; 18] = [0x9d9b7ab520532396758488b2100155, 0x87ff0f733247ea1ae377d26bdd60aa, 0x55e1805ec2babe74ebadb5de3c29a7, 0x4131e289b5519e562dff8935a669e2, 0xe974f2f0179abc0cc837efb26a9d5d, 0x72f158dfb2a2ba0fd881d8742426ec, 0x7e56e9182ef83caea0a45cfdaba45a, 0xc2b9b23f6684f0442257dbb8a37291, 0xfc0ecae4fe9f8be5c52a91edd59db2, 0x3ba9bd0376ade89881c7bafa2b36de, 0x3548bec7032b97739300f7fd72769b, 0x6a5b4b975ccf938c5e63ee41d57c7c, 0x4fabc9dbb6a9157f91a87adaff6e66, 0x303d705edf9cae022cd91f57f332b6, 0x1834cc2b65d9d2cab6dd210ba58cad, 0x43b9c3ca0df606d243d4c442794829, 0x5239e9f174adc5871d580714b1eb98, 0xe1];
    global pubkey_redc_limbs: [Field; 18] = [0x1e7578875458139006e47aac5c17fb, 0x249a5affa65fe288cb0df8ab6548be, 0xc29ec9b115f3132ff5fb71e744fba3, 0xbde4d1e1b2e894dd482277dc14aba5, 0x675f382edc2e53fabb2c785f0dd7e8, 0x8af86434e50f50ddfc9b46ce2c8990, 0xbaf8f36a4caec8a61d14be456599d3, 0x4ac14c9865afb8da5ab36b76e6d651, 0x2be72e03504024bbc777e0a1e9d16d, 0x249a0c4d673705ab5ad1757a225fea, 0x0300712f5005899fffeb1289f9ef4b, 0x73eb759f585e597acb40bfbf59efed, 0xe070a169f35358c7ead1df56d02d4b, 0x5657e0c005b6bca107abd9024b4dd1, 0xe6da2103c7938911ca44a5e641c541, 0xc98e9e1235394e0eb2b87143fd42c3, 0xdb1c76abaf095069edf0ea5248ef95, 0x0122];
    global signature_limbs: [Field; 18] = [ 0xabf49b8204494364afed7815aae9ba, 0x8888b30c7c97cdc0db80766909eba6, 0x5bd07a0786375af02d5f8e9cf9e0bb, 0xb5b1f36ae1cd61952109a814129827, 0xbd011faeecf1eb1ea383e81e1b424e, 0xdb819268100bedf9bb00ceae0c074a, 0x0eaeb846fc824d344bba37468c316d, 0x9123576355f3f5e896ea786a86ce8a, 0x1b9d1c8c412149b3c82e6498a732a9, 0x3d8cbd4f7856947f02ff19e8c478d0, 0x1d3f1389db68a6d6168d9e8104e742, 0x134d7ca6427322a9f62176146be4dc, 0x072d9968d8070f0612a7a781eb3cd0, 0x29a01c7d38758d3cb1ab0a45f9f3e7, 0xa92f67bad1f1995d9e72c23bfa469d, 0x9139299fb1abcc7c45a0305a92a454, 0x6f7998d04ba5abf002a11808d0de0e, 0x42 ];
    global header_base64url: [u8; 102] = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1MGY2ZTcwZWY0YjU0OGE1ZmQ5MTQyZWVjZDFmYjhmNTRkY2U5ZWUiLCJ0eXAiOiJKV1QifQ".as_bytes();
    global payload_base64url: [u8; 774] = "eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2OTgxMDk0NzQ4MDUtbnZmZzloaDMxa2ptYjZtbW41MWQ0b2lvbWJncjNzM3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2OTgxMDk0NzQ4MDUtbnZmZzloaDMxa2ptYjZtbW41MWQ0b2lvbWJncjNzM3YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTYzMjIyNTIzMjA3NTUyMTgyMjIiLCJlbWFpbCI6ImJhc2UuZW1haWwud2FsbGV0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiVzZWN2NmdURjVVhNeTNqWHNpbmRTZyIsIm5vbmNlIjoiZDhkQTZCRjI2OTY0YUY5RDdlRWQ5ZTAzRTUzNDE1RDM3YUE5NjA0NSIsIm5hbWUiOiJUZXN0IEdtYWlsIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0pVa3FXYVpVMUtxX1RKMU5tak9XWUtBZ1VSc2txUl9IX21FbXVIQmVGRklCSHhWUT1zOTYtYyIsImdpdmVuX25hbWUiOiJUZXN0IiwiZmFtaWx5X25hbWUiOiJHbWFpbCIsImlhdCI6MTcyOTIwNDM2NiwiZXhwIjoxNzI5MjA3OTY2fQ".as_bytes();
    global payload_json_padded: [u8; 580] = "{\"iss\":\"https://accounts.google.com\",\"azp\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"aud\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"sub\":\"116322252320755218222\",\"email\":\"base.email.wallet@gmail.com\",\"email_verified\":true,\"at_hash\":\"W6V7cfuDcUXMy3jXsindSg\",\"nonce\":\"d8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\"name\":\"Test Gmail\",\"picture\":\"https://lh3.googleusercontent.com/a/ACg8ocJUkqWaZU1Kq_TJ1NmjOWYKAgURskqR_H_mEmuHBeFFIBHxVQ=s96-c\",\"given_name\":\"Test\",\"family_name\":\"Gmail\",\"iat\":1729204366,\"exp\":1729207966}".as_bytes();

    #[test]
    fn test_jwt() {
            assert_verify_jwt::<877, 580, 776>(
                concat_header_and_payload::<102, 774>(
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
        let iat = 1729204366;
        let sub = "116322252320755218222".as_bytes().pad_end::<crate::JWT_SUB_MAX_LEN>(0);
        let aud = "698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com".as_bytes().pad_end::<crate::JWT_AUD_MAX_LEN>(0);
        let account_id = std::hash::pedersen_hash(nodash::pack_bytes(sub).concat(nodash::pack_bytes(aud)).concat([salt]));
        let payload_json_padded = "{\"iss\":\"https://accounts.google.com\",\"azp\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"aud\":\"698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com\",\"sub\":\"116322252320755218222\",\"email\":\"base.email.wallet@gmail.com\",\"email_verified\":true,\"at_hash\":\"W6V7cfuDcUXMy3jXsindSg\",\"nonce\":\"000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045\",\"name\":\"Test Gmail\",\"picture\":\"https://lh3.googleusercontent.com/a/ACg8ocJUkqWaZU1Kq_TJ1NmjOWYKAgURskqR_H_mEmuHBeFFIBHxVQ=s96-c\",\"given_name\":\"Test\",\"family_name\":\"Gmail\",\"iat\":1729204366,\"exp\":1729207966}".as_bytes();
        assert_verify_jwt_payload(payload_json_padded, account_id, salt, iat, ["0".as_bytes()[0]; 24].concat("d8dA6BF26964aF9D7eEd9e03E53415D37aA96045".as_bytes()));
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
