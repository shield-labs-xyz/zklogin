struct Base64UrlDecodeBE {
    table: [u8; 64]
}
impl Base64UrlDecodeBE {
    fn new() -> Self {
        Base64UrlDecodeBE {
            table: [
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,// 0-25 (A-Z)
                97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,// 26-51 (a-z)
                48, 49, 50, 51, 52, 53, 54, 55, 56, 57,// 52-61
                45,// 62 // xxx: changed to "-" because of base64url
                95// 63 // xxx: changed to "_" because of base64url
            ]
        }
    }

    fn get(self, idx: Field) -> u8 {
        self.table[idx]
    }
}

/**
 * @brief Take an array of base64 values and convert into ASCII values
 **/
pub fn base64url_decode_elements<let InputElements: u32>(input: [u8; InputElements]) -> [u8; InputElements] {
    // for some reason, if the lookup table is not defined in a struct, access costs are expensive and ROM tables aren't being used :/
    let mut Base64Decoder = Base64UrlDecodeBE::new();

    let mut result: [u8; InputElements] = [0; InputElements];

    for i in 0..InputElements {
        result[i] = Base64Decoder.get(input[i] as Field);
    }
    result
}

/**
 * @brief Take an array of packed base64 encoded bytes and convert into ASCII
 **/
pub fn base64url_decode<let InputBytes: u32, let OutputElements: u32>(input: [u8; InputBytes]) -> [u8; OutputElements] {
    //  let decoded: [u8; InputBytes] = base64url_decode_elements(input);
    // 240 bits fits 40 6-bit chunks and 30 8-bit chunks
    // we pack 40 base64 values into a field element and convert into 30 bytes
    // TODO: once we support arithmetic ops on generics, derive OutputBytes from InputBytes
    let mut result: [u8; OutputElements] = [0; OutputElements];
    let BASE64_ELEMENTS_PER_CHUNK: u32 = 40;
    let BYTES_PER_CHUNK: u32 = 30;
    let num_chunks = (InputBytes / BYTES_PER_CHUNK) + (InputBytes % BYTES_PER_CHUNK != 0) as u32;

    for i in 0..num_chunks - 1 {
        let mut slice: Field = 0;
        for j in 0..BYTES_PER_CHUNK {
            slice *= 256;
            slice += input[i * BYTES_PER_CHUNK + j] as Field;
        }

        let slice_base64_chunks: [u8; 40] = slice.to_be_radix(64);
        for j in 0..BASE64_ELEMENTS_PER_CHUNK {
            result[i * BASE64_ELEMENTS_PER_CHUNK + j] = slice_base64_chunks[j];
        }
    }

    let bytes_in_final_chunk = InputBytes - ((num_chunks - 1) * BYTES_PER_CHUNK);

    let mut slice: Field = 0;
    for j in 0..bytes_in_final_chunk {
        slice *= 256;
        slice += input[(num_chunks - 1) * BYTES_PER_CHUNK + j] as Field;
    }
    for _ in bytes_in_final_chunk..BYTES_PER_CHUNK {
        slice *= 256;
    }

    // TODO: check is it cheaper to use a constant value in `to_be_bytes` or can we use `bytes_in_final_chunk`?
    let slice_base64_chunks: [u8; 40] = slice.to_be_radix(64);

    let num_elements_in_final_chunk = OutputElements - ((num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK);
    for i in 0..num_elements_in_final_chunk {
        result[(num_chunks - 1) * BASE64_ELEMENTS_PER_CHUNK + i] = slice_base64_chunks[i];
    }
    base64url_decode_elements(result)
}
