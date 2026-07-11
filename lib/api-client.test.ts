import { describe, expect, test } from "vitest";
import {
  isPaginatedResult,
  unwrapListData,
  type PaginatedResponse,
} from "@/lib/api-client";

describe("api-client list helpers", () => {
  test("unwrapListData handles arrays", () => {
    expect(unwrapListData(["a", "b"])).toEqual(["a", "b"]);
  });

  test("unwrapListData handles paginated responses", () => {
    const paginated: PaginatedResponse<string> = {
      items: ["x"],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    };
    expect(unwrapListData(paginated)).toEqual(["x"]);
    expect(isPaginatedResult(paginated)).toBe(true);
  });
});
