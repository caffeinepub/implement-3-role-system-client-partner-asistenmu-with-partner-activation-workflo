// Convert backend Time (bigint nanoseconds) to JavaScript Date
export function timeToDate(time: bigint): Date {
  return new Date(Number(time) / 1_000_000);
}

// Convert JavaScript Date to backend Time (bigint nanoseconds)
export function dateToTime(date: Date): bigint {
  return BigInt(date.getTime() * 1_000_000);
}

// Format Time for display (e.g., "Jan 15, 2026")
export function formatTime(time: bigint): string {
  const date = timeToDate(time);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format Time for date input (YYYY-MM-DD)
export function formatTimeForInput(time: bigint): string {
  const date = timeToDate(time);
  return date.toISOString().split('T')[0];
}
