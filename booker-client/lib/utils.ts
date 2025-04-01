import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateByDayOfWeek(
  dayOfWeek: number,
  month: number,
  year: number,
): Date {
  // Create a date for the first day of the specified month
  // Note: month parameter is 1-12, but Date constructor uses 0-11
  const firstDayOfMonth = new Date(year, month - 1, 1);

  // Get the day of the week for the first day of the month (0-6)
  const firstDayOfWeekInMonth = firstDayOfMonth.getDay();

  // Calculate days to add to reach the desired day of week
  let daysToAdd = dayOfWeek - firstDayOfWeekInMonth;

  // If the result is negative, add 7 to get to the next occurrence
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  // Create the target date by adding the calculated days
  const targetDate = new Date(year, month - 1, 1 + daysToAdd);

  return targetDate;
}
