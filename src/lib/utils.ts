import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a JavaScript Date object into an ICS compliant UTC date-time string.
 * Example: 20240704T140000Z
 * @param date The Date object to format.
 * @returns ICS compliant date-time string.
 */
export function formatToICSDateString(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Escapes special characters in a string for ICS description.
 * Newlines are replaced with \n, commas with \, , backslashes with \\.
 * @param text The string to escape.
 * @returns Escaped string for ICS.
 */
export function escapeICSDescription(text: string): string {
  return text
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/\n/g, '\\n')  // Escape newlines
    .replace(/,/g, '\\,')   // Escape commas
    .replace(/;/g, '\\;');  // Escape semicolons
}

/**
 * Escapes a field for CSV format.
 * If the field contains a comma, double quote, or newline, it's enclosed in double quotes.
 * Existing double quotes within the field are doubled.
 * @param field The string to escape.
 * @returns Escaped string for CSV.
 */
export function escapeCsvField(field: string | number | undefined | null): string {
  if (field === null || field === undefined) {
    return '';
  }
  const stringField = String(field);
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  return stringField;
}
