/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchOrganizations({
  page = 1,
  limit = 10,
  search = '',
  sort = 'createdAt:desc',
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    sort,
  });
  const res = await fetch(`/api/organizations?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed fetching organizations');
  return res.json(); // { data, meta }
}

export async function createOrganization(data: any) {
  const res = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function updateOrganization(id: string, data: any) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function deleteOrganization(id: string) {
  const res = await fetch(`/api/organizations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function getOrganization(id: string) {
  const res = await fetch(`/api/organizations/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed fetching organization');
  return res.json();
}
