// TODO(security): if header length is too long, account is lost
// Note: keep in sync with JS
global JWT_HEADER_MAX_LEN: u32 = 256;
// TODO(security): if payload length is too long, account is lost
// Note: keep in sync with JS
comptime global JWT_PAYLOAD_JSON_MAX_LEN: u32 = 768;
// Note: keep in sync with JS
global JWT_PAYLOAD_MAX_LEN: u32 = comptime { nodash::div_ceil(JWT_PAYLOAD_JSON_MAX_LEN, 3) * 4 };

fn main(
    header_and_payload: BoundedVec<u8, JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN>,
    payload_json: [u8; JWT_PAYLOAD_JSON_MAX_LEN],
    signature_limbs: [Field; 18],
    // TODO(security): use hash(jwt_sub, salt)
    jwt_sub: pub str<31>,
    pubkey_limbs: pub [Field; 18],
    pubkey_redc_limbs: pub [Field; 18],
) {
    let verification = jwt::verify_jwt::<JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN, JWT_PAYLOAD_JSON_MAX_LEN, JWT_PAYLOAD_MAX_LEN>(
        header_and_payload,
        payload_json,
        pubkey_limbs,
        pubkey_redc_limbs,
        signature_limbs
    );
    assert(verification, "jwt verification failed: signature");

    assert(jwt::verify_jwt_payload(payload_json, jwt_sub), "jwt payload verification failed");
}
