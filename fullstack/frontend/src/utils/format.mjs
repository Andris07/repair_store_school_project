export function formatPrice(value)
{
  if (value === null || value === undefined || value === ``) return ``;
  return `${Number(value).toLocaleString('hu-HU')} Ft`;
}

export function formatDuration(minutes)
{
  if (!minutes) return ``;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} perc`;
  return m ? `${h} óra ${m} perc` : `${h} óra`;
}
