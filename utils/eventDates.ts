type EventItem = {
  date?: string;
};

function toDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export function sortByDateAsc<T extends EventItem>(items: T[]) {
  return [...items].sort((a, b) => {
    const da = toDate(a.date);
    const db = toDate(b.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da.getTime() - db.getTime();
  });
}

export function getTodayEvents<T extends EventItem>(items: T[], now = new Date()) {
  return items.filter((item) => {
    const d = toDate(item.date);
    return d ? isSameDay(d, now) : false;
  });
}

export function getWeekendEvents<T extends EventItem>(items: T[], now = new Date()) {
  const today = startOfDay(now);
  const day = today.getDay(); // 0 Sun - 6 Sat
  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  const weekendStart = startOfDay(saturday);
  const weekendEnd = endOfDay(sunday);

  return items.filter((item) => {
    const d = toDate(item.date);
    return d ? d >= weekendStart && d <= weekendEnd : false;
  });
}

export function getUpcomingEvents<T extends EventItem>(items: T[], now = new Date()) {
  const today = startOfDay(now);
  return items.filter((item) => {
    const d = toDate(item.date);
    return d ? d >= today : false;
  });
}
