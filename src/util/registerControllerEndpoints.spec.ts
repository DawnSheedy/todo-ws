import { Controller } from "../types/Controller";
import { registerControllerEndpoints } from "./registerControllerEndpoints";

describe("Controller Endpoint Registration", () => {
  it("Should register provided items", () => {
    const router = {
      get: jest.fn(),
      param: jest.fn(),
      use: jest.fn(),
    } as any;

    const testController: Controller = {
      paramHandlers: [{ param: "testParam", handler: () => {} }],
      endpoints: [
        {
          path: "/test",
          method: "GET",
          middleware: [() => {}],
          handler: () => {},
        },
        {
          path: "/test2",
          subController: { endpoints: [] },
        },
      ],
    };

    registerControllerEndpoints(router, testController);

    expect(router.get).toHaveBeenCalledWith(
      "/test",
      testController.endpoints[0].middleware![0],
      testController.endpoints[0].handler
    );

    expect(router.param).toHaveBeenCalledWith(
      "testParam",
      testController.paramHandlers![0].handler
    );

    expect(router.use).toHaveBeenCalled();
  });
});
