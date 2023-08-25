import { Router } from "express";
import { Controller } from "../../types/Controller";
import { registerControllerEndpoints } from "../../util/registerControllerEndpoints";

const router = Router();

const v1Controller: Controller = {
  name: "v1 Api Controller",
  endpoints: [],
};

registerControllerEndpoints(router, v1Controller);

export { router as v1Api };
