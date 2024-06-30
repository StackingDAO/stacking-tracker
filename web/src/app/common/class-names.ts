import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).sort().join(' ');
}

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
