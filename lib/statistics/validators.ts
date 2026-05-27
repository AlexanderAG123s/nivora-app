/**
 * Extracts an array of numbers from a raw string input.
 * Supports comma, space, and newline separated values.
 */
export function extractNumbers(rawInput: string): number[] {
  if (!rawInput || rawInput.trim() === "") return [];

  // Replace newlines and commas with spaces, then split by whitespace
  const tokens = rawInput.replace(/[\n,]/g, " ").split(/\s+/);
  
  const numbers: number[] = [];
  for (const token of tokens) {
    if (token.trim() === "") continue;
    const num = Number(token);
    if (!isNaN(num)) {
      numbers.push(num);
    }
  }

  return numbers;
}

/**
 * Validates if the dataset is suitable for statistical analysis.
 */
export function isValidDataset(data: number[]): boolean {
  return Array.isArray(data) && data.length > 0;
}
