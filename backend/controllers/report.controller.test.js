import { describe, expect, test } from "@jest/globals";
import { getReportRange, validateReportRequest } from "./report.controller.js";

describe("report date ranges", () => {
  test("builds a daily range", () =>
    expect(getReportRange("daily", "2026-10-15")).toEqual({
      startDate: "2026-10-15",
      endDate: "2026-10-15",
    }));
  test("builds a month-to-date range", () =>
    expect(getReportRange("month-to-date", "2026-10-15")).toEqual({
      startDate: "2026-10-01",
      endDate: "2026-10-15",
    }));
  test("builds the complete previous month", () =>
    expect(getReportRange("previous-month", "2026-10-15")).toEqual({
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    }));
  test("handles January when calculating the previous month", () =>
    expect(getReportRange("previous-month", "2026-01-10")).toEqual({
      startDate: "2025-12-01",
      endDate: "2025-12-31",
    }));
  test("rejects invalid types, dates and future dates", () => {
    expect(validateReportRequest("weekly", "2026-10-15", "2026-10-15")).toBe(
      "Please select a valid report type.",
    );
    expect(validateReportRequest("daily", "2026-02-30", "2026-10-15")).toBe(
      "Please select a valid date.",
    );
    expect(validateReportRequest("daily", "2026-10-16", "2026-10-15")).toBe(
      "Date cannot be in the future.",
    );
  });
});
