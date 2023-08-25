import { RepetitionType } from "../schema/Task";

/**
 * Calculate the next due date for a task given the configuration
 * @param originalDate
 * @param repeatMode
 * @param repeatExpiration
 * @param repetitionDays
 */
export const determineNextDueDate = (
  originalDate?: Date,
  repeatMode?: RepetitionType,
  repetitionDays?: number[],
  repeatExpiration?: Date
): Date | undefined => {
  // No original date set, no next due date.
  if (!originalDate) return undefined;

  let nextDate = undefined;

  if (!repeatMode) nextDate = originalDate;

  // If repeat mode is day, set
  if (repeatMode === RepetitionType.Day) {
    nextDate = getClosestDayWithSameTimeNotPassed(originalDate);
  }

  // If repeat mode is year, take the original date and set it to this year
  if (repeatMode === RepetitionType.Year) {
    nextDate = getNextInstanceOfDateInYear(originalDate);
  }

  if (
    repeatMode === RepetitionType.Week &&
    repetitionDays &&
    repetitionDays.length > 0
  ) {
    nextDate = getNextInstanceOfWeekDay(originalDate, repetitionDays);
  }

  if (
    repeatMode === RepetitionType.Month &&
    repetitionDays &&
    repetitionDays.length > 0
  ) {
    nextDate = getNextInstanceOfMonthDay(originalDate, repetitionDays);
  }

  if (!nextDate) {
    return nextDate;
  }

  // apply time of original date to next instance
  nextDate.setUTCHours(originalDate.getUTCHours());
  nextDate.setUTCMinutes(originalDate.getUTCMinutes());

  if (repeatExpiration && nextDate > repeatExpiration) {
    return undefined;
  }

  return nextDate;
};

/**
 * Given a date, give the last day of the month.
 * @param date
 * @returns
 */
export const getLastDayOfMonth = (date: Date) => {
  const newDate = new Date(date);
  newDate.setUTCMonth(newDate.getUTCMonth() + 1);
  newDate.setUTCDate(0);
  return newDate.getUTCDate();
};

/**
 * Given a date and an array of days, get the next possible day of the month that is in the future.
 * @param date
 * @param possibleDays
 * @returns
 */
export const getNextInstanceOfMonthDay = (
  date: Date,
  possibleDays: number[]
) => {
  possibleDays.sort();
  const lastDay = getLastDayOfMonth(date);
  // Increment all values to account for javascript indexing days at 1
  // Flatten out last days to last day of month
  possibleDays = possibleDays.map((day) =>
    day + 1 > lastDay ? lastDay : day + 1
  );
  const excludeToday = checkIfTimeOnDateIsPast(date);
  const minDay = new Date().getUTCDate() + (excludeToday ? 1 : 0);
  // Find next day, if none available make it the first of next month
  let nextDay = possibleDays.find((n) => n >= minDay);
  let isNextMonth = false;
  if (!nextDay) {
    isNextMonth = true;
    nextDay = possibleDays[0];
  }
  const newDate = new Date();
  if (isNextMonth) {
    newDate.setUTCMonth(newDate.getUTCMonth() + 1);
  }
  newDate.setUTCDate(nextDay);
  return newDate;
};

/**
 * Given an array of numbers, sort them and return only the ones that are valid days of the week.
 * @param days
 * @returns
 */
export const preparePossibleDaysOfWeek = (days: number[]) => {
  const newDays = days.filter((n) => 0 <= n && n <= 6);
  newDays.sort();
  return newDays;
};

/**
 * Given a date and a set of possible week days
 * Return a date representing the next occurrence of the same time
 * on one of the available days.
 * @param date
 * @param rawPossibleDays
 */
export const getNextInstanceOfWeekDay = (
  date: Date,
  rawPossibleDays: number[]
) => {
  const now = new Date();
  const excludeToday = checkIfTimeOnDateIsPast(date);
  let dayOffset = excludeToday ? 1 : 0;
  let todaysDayOfWeek = now.getUTCDay() + dayOffset;
  if (todaysDayOfWeek > 6) {
    todaysDayOfWeek = 0;
  }
  const possibleDays = preparePossibleDaysOfWeek(rawPossibleDays);
  let nextDay = possibleDays.find((n) => n >= todaysDayOfWeek);
  let nextDayOffset = 0;
  if (nextDay === undefined) {
    nextDay = possibleDays[0];
    nextDayOffset = 7;
  }
  let daysTilNextDay = nextDayOffset + nextDay - todaysDayOfWeek + dayOffset;
  const newDate = new Date(now);
  newDate.setUTCDate(newDate.getUTCDate() + daysTilNextDay);
  return newDate;
};

/**
 * Given a date, get the next occurrence of the same date/time
 * With minimum year being this year. If date is past this year, next year.s
 * @param date
 * @returns
 */
export const getNextInstanceOfDateInYear = (date: Date) => {
  const now = new Date();
  const nextDate = new Date(date);
  nextDate.setUTCFullYear(now.getUTCFullYear());
  // if date is already passed, bump it by a years
  if (nextDate < now) {
    nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
  }
  return nextDate;
};

/**
 * Returns true if the time on a given date is in the past if it was today.
 * Ie. true if current time is 10:00 and date is for 9:59 last tuesday
 * @param date
 * @returns
 */
export const checkIfTimeOnDateIsPast = (date: Date) => {
  const now = new Date();
  return (
    now.getUTCHours() >= date.getUTCHours() &&
    now.getUTCMinutes() >= date.getUTCMinutes()
  );
};

/**
 * Given a date, return today if time on date is in the future, otherwise, tomorrow
 * @param date
 * @returns
 */
export const getClosestDayWithSameTimeNotPassed = (date: Date) => {
  const newDate = new Date();
  const timeIsPast = checkIfTimeOnDateIsPast(date);
  let offset = 0;
  if (timeIsPast) {
    offset = 1;
  }
  newDate.setUTCDate(newDate.getUTCDate() + offset);
  return newDate;
};
