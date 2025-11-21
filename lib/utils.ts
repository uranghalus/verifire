import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const pageNumbers: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // Tampilkan semua page jika total pages sedikit
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Logic untuk ellipsis
    if (currentPage <= 3) {
      // Di awal: 1, 2, 3, 4, ..., last
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Di akhir: 1, ..., last-3, last-2, last-1, last
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Di tengah: 1, ..., current-1, current, current+1, ..., last
      pageNumbers.push(1);
      pageNumbers.push('...');
      pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      pageNumbers.push(currentPage + 1);
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return pageNumbers;
}
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
