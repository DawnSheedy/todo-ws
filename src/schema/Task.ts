import { Schema, model } from "mongoose";

export enum TaskUrgency {
  Low = 0,
  Minor = 1,
  Neutral = 2,
  Major = 3,
  Critical = 4,
}

export enum RepetitionType {
  Year = "year",
  Month = "month",
  Week = "week",
  Day = "day",
}

export interface ITask {
  userId: string;
  /**
   * Title of todo
   */
  title: string;
  /**
   * Description of todo (optional)
   */
  description?: string;
  /**
   * Urgency of task.
   */
  urgency: TaskUrgency;
  /**
   * Original due date and next due date of todo (optional)
   * For repeating, this will be the next due date
   */
  dueDate?: Date;
  nextDue?: Date;
  /**
   * Repeat mode of todo (optional)
   */
  repeatMode?: RepetitionType;
  /**
   * Expiration of repetition (optional, not setting never expires)
   */
  repeatExpiration?: Date;
  /**
   * Days to repeat on, used for 'month' and 'year' repeatmodes
   * Array of days to repeat on. For month this would probably be a single day.
   *
   * If a month doesn't have the specified day (too high, it will be due on the last day of the month)
   *
   * For week, this could be the days of the week (0-6)
   */
  repetitionDays?: number[];
  /**
   * Array of dates the task was completed on. For non-repeating tasks this will only contain one date
   */
  completed?: Date[];
}

const taskSchema = new Schema<ITask>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  urgency: { type: Number, required: true, default: TaskUrgency.Neutral },
  dueDate: { type: Date },
  nextDue: { type: Date, index: true },
  repeatMode: { type: String },
  repeatExpiration: { type: Date },
  repetitionDays: { type: [Number] },
  completed: { type: [Date] },
});

const Task = model<ITask>("Task", taskSchema);

export { Task };
