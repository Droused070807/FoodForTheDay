const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchData = async (date: string, meal?: string): Promise<unknown> => {
  const url = new URL(`${API_URL}/api/menu`);
  url.searchParams.set('date', date);
  if (meal) {
    url.searchParams.set('meal', meal);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Backend failed to fetch menu data' }));
    throw new Error(error.error || `HTTP error! status: ${res.status}`);
  }

  return await res.json();
};
