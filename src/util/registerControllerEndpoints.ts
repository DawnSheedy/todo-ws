import { Router } from "express";
import { Controller, MethodTypes } from "../types/Controller";

const endpointMap: Record<MethodTypes, keyof Router> = {
  GET: "get",
  PATCH: "patch",
  POST: "post",
  DELETE: "delete",
};

/**
 * Given a router and controller. Register all relevant endpoints and subcontrollers.
 * @param router
 * @param controller
 */
export const registerControllerEndpoints = (
  router: Router,
  controller: Controller,
  prefix = ""
) => {
  controller.name = controller.name ?? "Unnamed Controller";

  console.log(`${prefix}┃ ▏▎▍ Registering ${controller.name} ▍▎▏`);

  controller.paramHandlers?.forEach((paramHandler) => {
    console.log(
      `${prefix}┣━ Registering param handler for ${paramHandler.param}!`
    );

    router.param(paramHandler.param, paramHandler.handler);
  });

  controller.endpoints.forEach((endpoint) => {
    endpoint.name = endpoint.name ?? "Unnamed Endpoint";
    endpoint.method = endpoint.method ?? "GET";
    endpoint.path = endpoint.path ?? "/";
    endpoint.middleware = endpoint.middleware ?? [];

    if (endpoint.handler) {
      console.log(
        `${prefix}┣━ [${endpoint.method} → ${endpoint.path}] Registering ${endpoint.name}`
      );

      endpoint.middleware?.forEach((handler) => {
        console.log(
          `${prefix}┣━━ [${handler.name} → ${endpoint.path}] Registering Middleware`
        );
      });

      (router[endpointMap[endpoint.method]] as any)(
        endpoint.path,
        ...(endpoint.middleware ?? []),
        endpoint.handler
      );
    }
    if (endpoint.subController) {
      const newPrefix = `${prefix}┃`;
      console.log(
        `${prefix}┣┓ [CONTROLLER → ${endpoint.path}] Preparing Router for Subcontroller\n${newPrefix}┃`
      );

      const newRouter = Router();
      endpoint.middleware?.forEach((middleware) => newRouter.use(middleware));
      registerControllerEndpoints(newRouter, endpoint.subController, newPrefix);
      router.use(endpoint.path, newRouter);
    }
  });
};
