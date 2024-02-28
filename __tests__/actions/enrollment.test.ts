import {
  getEnrollmentInfo,
  getMoreEnrollmentInfo,
} from "@/app/actions/enrollment";

describe("test getEnrollmentInfo", () => {
  it("should return any empty array", async () => {
    const res = await getEnrollmentInfo({
      departmentCode: "INVALID",
      number: "1A",
    });
    expect(res).toHaveLength(0);
  });
  it("should return a non-empty array", async () => {
    const res = await getEnrollmentInfo({
      departmentCode: "CSE",
      number: "30",
    });
    expect(res).not.toHaveLength(0);
    const firstOffering = res[0];
    expect(firstOffering.instructor).not.toHaveLength(0);
    expect(firstOffering.term).toBeDefined();
    expect(firstOffering.term.catalogYear).not.toHaveLength(0);
    expect(firstOffering.term.title).not.toHaveLength(0);
  });
});

describe("test getMoreEnrollmentInfo", () => {
  it("should return an empty array", async () => {
    const res = await getMoreEnrollmentInfo({
      departmentCode: "INVALID",
      number: "1A",
    });
    expect(res).toHaveLength(0);
  });
  it("should return a non empty array", async () => {
    const res = await getMoreEnrollmentInfo({
      departmentCode: "CSE",
      number: "30",
    });
    expect(res).not.toHaveLength(0);
    const firstOffering = res[0];
    Object.keys(firstOffering).forEach((key) => {
      if (key === "term") return;
      expect(key).not.toHaveLength(0);
    });
  });
});
