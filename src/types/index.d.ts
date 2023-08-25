import { UserIdentity } from "@dawnsheedy/ds-auth-lib";
import { Document, Model, ObjectId } from "mongoose";
import { IUser } from "../schema/User";
import { IPermission } from "../schema/Permission";
import { IAppConfigEntry } from "../schema/AppConfigEntry";

export {};

declare global {
  namespace Express {
    export interface Request {
      identity?: UserIdentity;
      user?: Omit<Document<unknown, {}, IUser> & IUser, "permissions"> & {
        permissions: IPermission[];
      };
      appParam?: Document<unknown, {}, IAppConfigEntry> & IAppConfigEntry;
    }
  }
}
