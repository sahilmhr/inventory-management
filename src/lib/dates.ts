export function toDateInputValue(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium"
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isWithin(value: string, start?: Date, end?: Date) {
  const timestamp = new Date(value).getTime();

  if (start && timestamp < start.getTime()) {
    return false;
  }

  if (end && timestamp > end.getTime()) {
    return false;
  }

  return true;
}

export function resolvePeriodRange(period: "day" | "week" | "month" | "custom" | "all", startDate?: string, endDate?: string) {
  const now = new Date();

  if (period === "all") {
    return {};
  }

  if (period === "day") {
    return { start: startOfDay(now), end: endOfDay(now) };
  }

  if (period === "week") {
    return { start: startOfWeek(now), end: endOfDay(now) };
  }

  if (period === "month") {
    return { start: startOfMonth(now), end: endOfDay(now) };
  }

  return {
    start: startDate ? startOfDay(new Date(startDate)) : undefined,
    end: endDate ? endOfDay(new Date(endDate)) : undefined
  };
}
