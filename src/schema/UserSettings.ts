import { Schema, Types, model } from "mongoose";

export enum ColorThemeType {
  Dark = "dark",
  Light = "light",
  System = "system",
}

export interface IUserSettings {
  userId: string;
  userTheme: "dark" | "light" | "system";
  enablePushNotifications: boolean;
  clearAfterDays: number;
}

const userSettingsSchema = new Schema<IUserSettings>({
  userId: { type: String, required: true, unique: true, index: true },
  userTheme: { type: String, required: true, default: ColorThemeType.Light },
  enablePushNotifications: { type: Boolean, required: true, default: false },
  clearAfterDays: { type: Number, required: true, default: 30 },
});

const UserSettings = model<IUserSettings>("UserSettings", userSettingsSchema);

export { UserSettings };
