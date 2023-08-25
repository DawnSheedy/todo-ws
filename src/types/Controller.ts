import { RequestHandler } from "express";

export type MethodTypes = "GET" | "POST" | "PATCH" | "DELETE"

export interface ControllerEndpoint {
  name?: string;
  path?: string;
  method?: MethodTypes;
  middleware?: RequestHandler[];
  handler?: RequestHandler;
  subController?: Controller;
}

export interface ParamHandler {
  param: string;
  handler: RequestHandler;
}

export interface Controller {
  name?: string;
  paramHandlers?: ParamHandler[];
  endpoints: ControllerEndpoint[];
}
