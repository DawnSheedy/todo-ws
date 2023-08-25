import { RepetitionType } from "../schema/Task";
import {
  determineNextDueDate,
  getClosestDayWithSameTimeNotPassed,
  getLastDayOfMonth,
  getNextInstanceOfDateInYear,
  getNextInstanceOfMonthDay,
  getNextInstanceOfWeekDay,
} from "./determineNextDueDate";

const checkDayAndMonth = (date: Date, day: number, month: number) => {
  expect(date.getUTCDate()).toEqual(day);
  expect(date.getUTCMonth()).toEqual(month - 1);
};

describe("determine next due date", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2010-12-15T12:00:00"));
  });

  describe("Get last day of month", () => {
    it("should return number representing the last day of a month", () => {
      expect(getLastDayOfMonth(new Date())).toEqual(31);
    });
  });

  describe("Get next instance of date in year", () => {
    it("Should return date in current year if its not past yet", () => {
      const date = new Date("2010-12-15T13:00:00");
      const resolvedDate = getNextInstanceOfDateInYear(date);
      expect(resolvedDate.getUTCFullYear()).toEqual(2010);
      checkDayAndMonth(resolvedDate, 15, 12);
    });

    it("Should return date in next year if its past", () => {
      const date = new Date("2010-12-15T11:00:00");
      const resolvedDate = getNextInstanceOfDateInYear(date);
      expect(resolvedDate.getUTCFullYear()).toEqual(2011);
      checkDayAndMonth(resolvedDate, 15, 12);
    });
  });

  describe("Get next instance of weekday", () => {
    it("should get next possible date where date is in current week", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [-1, 0, 10, 4];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 16, 12);
    });

    it("should get next possible date where date is in next week", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [-1, 0];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 19, 12);
    });

    it("should get next possible date where date is in next week", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [3];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 22, 12);
    });

    it("should get next possible date where first possible date is next week", () => {
      jest.setSystemTime(new Date("2010-12-18T11:00:00"));
      const date = new Date("2010-12-15T10:00:00");
      const days = [0];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 19, 12);
    });

    it("should get next possible date where date is in current week and current day is not disqualified", () => {
      const date = new Date("2010-12-15T13:00:00");
      const days = [-1, 0, 10, 4];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 16, 12);
    });

    it("should get next possible date where date is in next week and current day is not disqualified", () => {
      const date = new Date("2010-12-15T13:00:00");
      const days = [-1, 0];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 19, 12);
    });

    it("should get next possible date where current day is not disqualified", () => {
      const date = new Date("2010-12-15T13:00:00");
      const days = [3];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 15, 12);
    });

    it("should get next possible date where first possible date is next week and current day is not disqualified", () => {
      jest.setSystemTime(new Date("2010-12-18T11:00:00"));
      const date = new Date("2010-12-15T12:00:00");
      const days = [0];
      const resolvedDate = getNextInstanceOfWeekDay(date, days);
      checkDayAndMonth(resolvedDate, 19, 12);
    });
  });

  describe("get closest day with same time not past", () => {
    it("should return tomorrow if the time is already past", () => {
      const date = getClosestDayWithSameTimeNotPassed(
        new Date("2010-12-15T11:00:00")
      );
      checkDayAndMonth(date, 16, 12);
    });

    it("should return today if the time is not past", () => {
      const date = getClosestDayWithSameTimeNotPassed(
        new Date("2010-12-15T13:00:00")
      );
      checkDayAndMonth(date, 15, 12);
    });
  });

  describe("get next day in month", () => {
    it("should return next specified day in month where original time is still in future", () => {
      const date = new Date("2010-12-15T10:00:00");
      const days = [0, 18];
      const resolvedDate = getNextInstanceOfMonthDay(date, days);
      checkDayAndMonth(resolvedDate, 19, 12);
    });

    it("should return same day if specified if original time is still in future", () => {
      const date = new Date("2010-12-15T13:00:00");
      const days = [0, 14];
      const resolvedDate = getNextInstanceOfMonthDay(date, days);
      checkDayAndMonth(resolvedDate, 15, 12);
    });

    it("should flatten days past last day of month down to last day", () => {
      const date = new Date("2010-12-15T10:00:00");
      const days = [0, 51, 200];
      const resolvedDate = getNextInstanceOfMonthDay(date, days);
      checkDayAndMonth(resolvedDate, 31, 12);
    });

    it("should go next month if it has to", () => {
      const date = new Date("2010-12-15T10:00:00");
      const days = [0];
      const resolvedDate = getNextInstanceOfMonthDay(date, days);
      checkDayAndMonth(resolvedDate, 1, 1);
    });
  });

  describe("Determine next due date", () => {
    it("should return undefined if no due date set", () => {
      expect(determineNextDueDate()).toEqual(undefined);
    });

    it("should return original date if no repeat mode set", () => {
      const date = new Date("2010-12-10T10:00:00");
      expect(determineNextDueDate(date)).toEqual(date);
    });

    it("should use day repetition mode if specified", () => {
      const date = new Date("2010-12-10T10:00:00");
      const resolved = determineNextDueDate(date, RepetitionType.Day);
      checkDayAndMonth(resolved!, 16, 12);
    });

    it("should use year repetition mode if specified", () => {
      const date = new Date("2010-12-10T10:00:00");
      const resolved = determineNextDueDate(date, RepetitionType.Year);
      expect(resolved?.getUTCFullYear()).toEqual(2011);
      checkDayAndMonth(resolved!, 10, 12);
    });

    it("should use week repetition mode if specified", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [-1, 0];
      const resolved = determineNextDueDate(date, RepetitionType.Week, days);
      checkDayAndMonth(resolved!, 19, 12);
    });

    it("should return undefined if no days provided", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days: number[] = [];
      const resolved = determineNextDueDate(date, RepetitionType.Week, days);
      expect(resolved).toBeUndefined();
    });

    it("should use month repetition mode if specified", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [18];
      const resolved = determineNextDueDate(date, RepetitionType.Month, days);
      checkDayAndMonth(resolved!, 19, 12);
    });

    it("should return undefined if no days provided (month)", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days: number[] = [];
      const resolved = determineNextDueDate(date, RepetitionType.Month, days);
      expect(resolved).toBeUndefined();
    });

    it("should return same time as original date on returned date", () => {
      const date = new Date("2010-12-10T10:00:00");
      const resolved = determineNextDueDate(date, RepetitionType.Day);
      expect(resolved?.getUTCHours()).toEqual(date.getUTCHours());
      expect(resolved?.getUTCMinutes()).toEqual(date.getUTCMinutes());
    });

    it("should return undefined if next due date is past repetition end date", () => {
      const date = new Date("2010-12-15T11:00:00");
      const days = [18];
      const resolved = determineNextDueDate(
        date,
        RepetitionType.Month,
        days,
        new Date("2010-12-17T11:00:00")
      );
      expect(resolved).toBeUndefined();
    });
  });
});
