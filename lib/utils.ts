import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number) {
  if (isNaN(num)) {
    return "0"
  }

  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateInput?: string | Date): string {
  if (!dateInput) return "No definida";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}