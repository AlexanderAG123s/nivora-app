import { extractNumbers } from "./validators";

export type DatasetData = number[] | Record<string, number>[];

export interface Dataset {
  type: "1D" | "2D";
  columns: string[];
  data: DatasetData;
}

/**
 * Parses a CSV string and determines if it is 1D or 2D.
 */
export function parseCSV(fileContent: string): Dataset {
  const lines = fileContent.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  
  if (lines.length > 1) {
    // Check if it's a real multi-column CSV
    const firstLineTokens = lines[0].split(',').map(t => t.trim());
    if (firstLineTokens.length > 1 && isNaN(Number(firstLineTokens[0]))) {
      // It has a header and multiple columns
      const columns = firstLineTokens;
      const data: Record<string, number>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const tokens = lines[i].split(',');
        const row: Record<string, number> = {};
        let hasValidNumber = false;
        for (let j = 0; j < columns.length; j++) {
          const num = Number(tokens[j]);
          if (!isNaN(num)) {
            row[columns[j]] = num;
            hasValidNumber = true;
          }
        }
        if (hasValidNumber) data.push(row);
      }
      
      if (data.length > 0) {
        return { type: "2D", columns, data };
      }
    }
  }

  // Fallback to 1D
  const numbers = extractNumbers(fileContent);
  return {
    type: "1D",
    columns: ["Valor"],
    data: numbers
  };
}

/**
 * Safely extracts a 1D array of numbers from the dataset.
 */
export function get1DArray(dataset: Dataset): number[] {
  if (dataset.type === "1D") {
    return dataset.data as number[];
  } else {
    // If 2D, extract the first numeric column for 1D fallback
    const cols = dataset.columns;
    const firstCol = cols.length > 0 ? cols[0] : "";
    const arr = (dataset.data as Record<string, number>[]).map(row => row[firstCol]).filter(val => typeof val === 'number' && !isNaN(val));
    return arr;
  }
}
