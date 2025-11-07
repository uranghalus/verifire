import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getPageNumbers(current: number, total: number) {
  const delta = 2;
  const pages: (number | '...')[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);

  if (left > 2) pages.push('...');

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < total - 1) pages.push('...');

  if (total > 1) pages.push(total);

  return pages;
}
