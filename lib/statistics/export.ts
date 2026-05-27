import { BinData } from "./charts";

export function exportFrequencyToCSV(bins: BinData[], filename = "frecuencias.csv") {
  if (!bins || bins.length === 0) return;
  
  const headers = ["Intervalo de Clase", "Frecuencia", "Frecuencia Relativa", "Frecuencia Acumulada"];
  const rows = bins.map(bin => [
    bin.rangeStr,
    bin.frequency.toString(),
    bin.relative,
    bin.cumulative.toString()
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
