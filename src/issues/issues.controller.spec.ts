import { IssuesController } from "./issues.controller";

describe("IssuesController — list identity", () => {
  const service = {
    listIssues: jest.fn(),
  };
  let controller: IssuesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new IssuesController(service as any);
  });

  it("uses the authenticated user's ID for personalized hand-raise state", () => {
    controller.list("12", "34", {
      id: 567,
      role: "voter",
    } as any);

    expect(service.listIssues).toHaveBeenCalledWith(12, 34, 567);
  });

  it("does not request user-specific state for anonymous callers", () => {
    controller.list("12", "34");

    expect(service.listIssues).toHaveBeenCalledWith(12, 34, undefined);
  });
});
