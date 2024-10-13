use noir_rsa::bignum::BigNum;
use noir_rsa::bignum::runtime_bignum::BigNumInstance;
use noir_rsa::bignum::fields::Params2048;
use noir_rsa::rsa::RSA;
use json_parser::JSON1kb::JSON;

// TODO: use official noir base64 library
mod base64;

global PUBKEY_LIMBS_LEN: u32 = 18;
global SIGNATURE_LIMBS_LEN: u32 = 18;

type BN2048 = BigNum<18, Params2048>;
global rsa = RSA::<BN2048, BigNumInstance<18, Params2048>, 256> {};

pub fn verify_jwt<
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
) -> bool {
    let signature: BN2048 = BigNum::from_array(signature);
    let pubkey: BigNumInstance<18, Params2048> = BigNumInstance::new(pubkey_limbs, pubkey_redc_limbs);

    payloads_match::<HeaderAndPayloadMaxLen, PayloadJsonMaxLen, PayloadJsonBase64MaxLen>(header_and_payload, payload_json_padded);

    let hash = std::hash::sha256_var(header_and_payload.storage, header_and_payload.len() as u64);
    rsa.verify_sha256_pkcs1v15(pubkey, hash, signature, 65537)
}

pub fn verify_jwt_payload<let N: u32>(payload_json_padded: [u8; N], sub_expected: str<31>) -> bool {
    let parsed = JSON::parse_json(payload_json_padded);
    let sub_field: BoundedVec<u8, 31> = parsed.get_string_unchecked("sub".as_bytes());

    // TODO(security): validate `iat` or `exp`
    let sub_expected = sub_expected.as_bytes();
    sub_expected == sub_field.storage
}

fn payloads_match<let N: u32, let M: u32, let M2: u32>(header_and_payload: BoundedVec<u8, N>, payload_json_padded: [u8; M]) {
    let from_index = unsafe {
        let dot_index = find_dot(header_and_payload.storage);
        assert(header_and_payload.storage[dot_index] == ".".as_bytes()[0], "dot not found");
        dot_index + 1
    };

    let encoded: [u8; M2] = crate::base64::encode(payload_json_padded, [0; M2], true);

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

pub fn concat_header_and_payload<let H: u32, let P: u32, let L: u32>(
    header: BoundedVec<u8, H>,
    payload: BoundedVec<u8, P>
) -> BoundedVec<u8, L> {
    assert_eq(L, H + 1 + P, "concat length does not match");
    let mut concated = BoundedVec { storage: [0; L], len: 0 };
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
