import { describe, expect, test } from "@jest/globals";
import { normalizeReading, validateReading } from "./reading.controller.js";

const validReading = {
  readingDate: "2026-10-15",
  slot: "after_lunch",
  value: 118,
};

describe("reading validation", () => {
  test("accepts a valid reading and boundary glucose values", () => {
    expect(validateReading(validReading, "2026-10-15")).toEqual({});
    expect(
      validateReading({ ...validReading, value: 40 }, "2026-10-15"),
    ).toEqual({});
    expect(
      validateReading({ ...validReading, value: 600 }, "2026-10-15"),
    ).toEqual({});
  });

  test("requires a glucose value", () => {
    expect(
      validateReading({ ...validReading, value: "" }, "2026-10-15").value,
    ).toBe("Please enter a glucose value.");
  });

  test.each([39, 601, 118.5, "abc"])(
    "rejects invalid glucose value %s",
    (value) => {
      expect(
        validateReading({ ...validReading, value }, "2026-10-15").value,
      ).toBe("Value must be between 40 and 600 mg/dl.");
    },
  );

  test("rejects future and impossible dates", () => {
    expect(
      validateReading(
        { ...validReading, readingDate: "2026-10-16" },
        "2026-10-15",
      ).readingDate,
    ).toBe("Date cannot be in the future.");
    expect(
      validateReading(
        { ...validReading, readingDate: "2026-02-30" },
        "2026-10-15",
      ).readingDate,
    ).toBe("Please select a valid date.");
  });

  test("rejects an unsupported slot", () => {
    expect(
      validateReading({ ...validReading, slot: "bedtime" }, "2026-10-15").slot,
    ).toBe("Please select a valid time slot.");
  });

  test("normalizes date alias and string fields", () => {
    expect(
      normalizeReading({
        date: " 2026-10-15 ",
        slot: " after_lunch ",
        value: 118,
      }),
    ).toEqual(validReading);
  });
});
