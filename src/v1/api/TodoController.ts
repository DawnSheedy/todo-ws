import { Controller } from "../../types/Controller";

export const TodoController: Controller = {
  name: "Todo Controller",
  endpoints: [
    {
      name: "Status",
      path: "/status",
      handler: (_req, res) => res.sendStatus(200),
    },
  ],
};
