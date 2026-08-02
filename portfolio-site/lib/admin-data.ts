/**
 * lib/admin-data.ts
 * Generic CRUD helpers for the admin panel — server-side only.
 */

import { readJsonFile, writeJsonFile } from "@/lib/data";

export function addItem<T extends { id: string; order: number }>(
  filename: string,
  item: T
): T[] {
  const items = readJsonFile<T[]>(filename);
  const maxOrder = items.length > 0 ? Math.max(...items.map((i: T) => i.order)) : 0;
  const newItem = { ...item, order: maxOrder + 1 };
  items.push(newItem);
  writeJsonFile(filename, items);
  return items;
}

export function updateItem<T extends { id: string }>(
  filename: string,
  id: string,
  updates: Partial<T>
): T[] {
  const items = readJsonFile<T[]>(filename);
  const idx = items.findIndex((i: T) => i.id === id);
  if (idx === -1) throw new Error(`Item ${id} not found in ${filename}`);
  items[idx] = { ...items[idx], ...updates };
  writeJsonFile(filename, items);
  return items;
}

export function deleteItem<T extends { id: string }>(
  filename: string,
  id: string
): T[] {
  const items = readJsonFile<T[]>(filename);
  const filtered = items.filter((i: T) => i.id !== id);
  if (filtered.length === items.length) throw new Error(`Item ${id} not found`);
  writeJsonFile(filename, filtered);
  return filtered;
}

export function reorderItems<T extends { id: string; order: number }>(
  filename: string,
  orderedIds: string[]
): T[] {
  const items = readJsonFile<T[]>(filename);
  orderedIds.forEach((id: string, index: number) => {
    const item = items.find((i: T) => i.id === id);
    if (item) item.order = index + 1;
  });
  items.sort((a: T, b: T) => a.order - b.order);
  writeJsonFile(filename, items);
  return items;
}

export function toggleFeatured<T extends { id: string; featured: boolean }>(
  filename: string,
  id: string
): T[] {
  const items = readJsonFile<T[]>(filename);
  const item = items.find((i: T) => i.id === id);
  if (!item) throw new Error(`Item ${id} not found`);
  item.featured = !item.featured;
  writeJsonFile(filename, items);
  return items;
}
