// copied from https://github.com/vlayer-xyz/noir-base64 and fixed

global MAX_INPUT_LEN = 800;
global MAX_RESULT_LEN = 1400;

pub fn encode_str<let N: u32, let M: u32>(input: str<N>, mut result: [u8; M]) -> [u8; M] {
    encode(as_bytes(input), result, false)
}

pub fn encode<let N: u32, let M: u32>(input: [u8; N], mut result: [u8; M], url_safe: bool) -> [u8; M] {
    assert(N as u32 <= MAX_INPUT_LEN, "input is too long. Max input length is 600");
    assert(base64_calculate_length(input) == M);

    let mut max_input = [0; MAX_INPUT_LEN];
    let mut max_result = [0; MAX_RESULT_LEN];
    if (N as u32 <= MAX_INPUT_LEN) {
        for i in 0..input.len() {
            max_input[i] = input[i];
        }
        for i in 0..((N as u32 + 2) / 3) {
            let chunk = if i * 3 + 2 < N as u32 {
                convert_chunk([max_input[i * 3], max_input[i * 3 + 1], max_input[i * 3 + 2]], url_safe)
            } else if i * 3 + 1 < N as u32 {
                convert_chunk([max_input[i * 3], max_input[i * 3 + 1]], url_safe)
            } else {
                convert_chunk([max_input[i * 3]], url_safe)
            };
            for j in 0..4 {
                max_result[i * 4 + j] = chunk[j];
            }
        }

        for i in 0..result.len() {
            result[i] = max_result[i];
        }
    }
    result
}

fn convert_chunk<let N: u32>(input: [u8; N], url_safe: bool) -> [u8; 4] {
    let input_len : u32 = input.len() as u32;
    assert(input_len > 0 & input_len <= 3, "convert_chunk only accepts arrays of length 1, 2 and 3");
    let mut result = [64; 4];

    let input0_first6 = input[0] >> 2;
    let input0_last2 = (input[0] << 6) >> 2;

    result[0] = input0_first6;
    result[1] = input0_last2;
    if input_len > 1 {
        let input1_first4 = input[1] >> 4;
        let input1_last4 = (input[1] << 4) >> 2;

        result[1] += input1_first4;
        result[2] = input1_last4;

        if input_len > 2 {
            let input2_first2 = input[2] >> 6;
            let input2_last6 = (input[2] << 2) >> 2;

            result[2] += input2_first2;
            result[3] = input2_last6;
        }
    }
    for i in 0..4 {
        result[i] = convert_base64_number(result[i], url_safe);
    }
    result
}

fn base64_calculate_length<let N: u32>(input: [u8; N]) -> u32 {
    let remainder: u32 = (input.len() as u32) % 3;
    4 * (input.len() as u32 / 3 + if remainder == 0 { 0 } else { 1 })
}

fn convert_base64_number(n: u8, url_safe: bool) -> u8 {
    if n >= 0 & n <= 25 {
        n + 65
    } else if n >= 26 & n <= 51 {
        n + 71
    }
    else if n == 52 { 48 }
    else if n == 53 { 49 }
    else if n == 54 { 50 }
    else if n == 55 { 51 }
    else if n == 56 { 52 }
    else if n == 57 { 53 }
    else if n == 58 { 54 }
    else if n == 59 { 55 }
    else if n == 60 { 56 }
    else if n == 61 { 57 }
    else if n == 62 {
        if url_safe { 45 } else { 43 }
    }
    else if n == 63 {
        if url_safe { 95 } else { 47 }
    } else if n == 64 { 61}
    else {
        assert(false, "convert_base64_number only accepts numbers between 0 and 64");
        0
    }
}

pub fn as_byte(s: str<1>) -> u8 {
    s.as_bytes()[0]
}

pub fn as_bytes<let N: u32>(s: str<N>) -> [u8; N] {
    let lookup: [u8; 256] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
        90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
        120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
        150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179,
        180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
        210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
        240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255
    ];
    s.as_bytes().map(|x| lookup[x])
}
