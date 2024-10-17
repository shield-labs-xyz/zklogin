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
    payload_json: [u8; JWT_PAYLOAD_JSON_MAX_LEN], // TODO: get payload_json from header_and_payload
    signature_limbs: [Field; 18],
    salt: Field,
    // hash(jwt.sub, salt)
    account_id: pub Field,
    jwt_iat: pub u64,
    jwt_aud: pub [u8; jwt::JWT_AUD_MAX_LEN],
    // temporary owner address
    jwt_nonce: pub [u8; jwt::JWT_NONCE_LEN],
    public_key_limbs: pub [Field; 18],
    public_key_redc_limbs: pub [Field; 18],
) {
    jwt::assert_verify_jwt::<JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN, JWT_PAYLOAD_JSON_MAX_LEN, JWT_PAYLOAD_MAX_LEN>(
        header_and_payload,
        payload_json,
        public_key_limbs,
        public_key_redc_limbs,
        signature_limbs
    );

    jwt::assert_verify_jwt_payload(payload_json, account_id, salt, jwt_iat, jwt_aud, jwt_nonce);
}
