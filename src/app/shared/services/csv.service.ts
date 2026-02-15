import { Injectable } from '@angular/core';

export interface CsvImportResult<T> {
  data: Partial<T>[];
  errors: number;
}

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  constructor() {}

  async parse<T>(file: File, parser: (values: string[], headers: string[]) => T | null): Promise<CsvImportResult<T>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const csv = e.target?.result as string;
          if (!csv) {
            reject(new Error('Empty file'));
            return;
          }
          
          const lines = csv.split(/\r\n|\n/);
          const headers = lines[0].split(',').map(h => h.trim());
          
          const data: Partial<T>[] = [];
          let errorCount = 0;

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = this.parseLine(line);
            
            if (values.length !== headers.length) {
              console.warn(`Skipping line ${i + 1}: Column count mismatch`);
              errorCount++;
              continue;
            }

            const item = parser(values, headers);
            if (item) {
              data.push(item);
            } else {
              errorCount++;
            }
          }

          resolve({ data, errors: errorCount });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  exportToCsv<T>(data: T[], filename: string, headers: (keyof T | string)[]): void {
    if (!data.length) return;

    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        return headers.map(header => {
          const value = (item as any)[header];
          const safeValue = value === undefined || value === null ? '' : value;
          
          if (typeof safeValue === 'string' && (safeValue.includes(',') || safeValue.includes('"') || safeValue.includes('\n'))) {
            return `"${safeValue.replace(/"/g, '""')}"`;
          }
          return safeValue;
        }).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private parseLine(line: string): string[] {
    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue);
    return values;
  }
}
