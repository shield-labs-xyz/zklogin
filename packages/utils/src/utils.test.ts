import { describe, expect, test } from "vitest";
import { utils } from "./index.js";

describe(utils.arrayPadEnd, () => {
  test("pads array", () => {
    expect(utils.arrayPadEnd([1, 2, 3], 5, 0)).toEqual([1, 2, 3, 0, 0]);
    expect(utils.arrayPadEnd([1, 2, 3], 5, 1)).toEqual([1, 2, 3, 1, 1]);
    expect(utils.arrayPadEnd([1, 2, 3], 5, 2)).toEqual([1, 2, 3, 2, 2]);
  });
});
