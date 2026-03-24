import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate reading time from text
 */
export function calculateReadingTime(
  text: string,
  wpm: number = 200,
): { minutes: number; words: number } {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / wpm);
  return { minutes, words };
}

/**
 * Get statistics for selected text
 */
export function getSelectionStats(text: string): {
  characters: number;
  words: number;
  lines: number;
} {
  if (!text || text.trim().length === 0) {
    return { characters: 0, words: 0, lines: 0 };
  }

  const characters = text.length;
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const lines = text.split("\n").length;

  return { characters, words, lines };
}
