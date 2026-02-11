type EventItem = {
  date?: string;
};

function parseDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function sortEventsByDate<T extends EventItem>(items: T[]) {
  const now = new Date();

  const upcoming: { item: T; date: Date }[] = [];
  const past: { item: T; date: Date }[] = [];
  const undated: T[] = [];

  for (const item of items) {
    const date = parseDate(item.date);
    if (!date) {
      undated.push(item);
      continue;
    }
    if (date >= now) {
      upcoming.push({ item, date });
    } else {
      past.push({ item, date });
    }
  }

  upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
  past.sort((a, b) => b.date.getTime() - a.date.getTime());

  return [...upcoming.map((entry) => entry.item), ...past.map((entry) => entry.item), ...undated];
}
