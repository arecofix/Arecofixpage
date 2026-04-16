import { Injectable, inject } from '@angular/core';
import { StructuredLoggerService } from '@app/core/infrastructure/logging/structured-logger.service';

// Type-safe CSV export interface
export interface CsvExportable {
  [key: string]: string | number | boolean | null | undefined;
}

// Extended interface for entities with specific properties
export interface CsvExportableEntity extends CsvExportable {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: string;
  brand_id?: string;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sku?: string;
  barcode?: string;
}

export interface CsvImportResult<T> {
  data: Partial<T>[];
  errors: number;
}

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  private logger = inject(StructuredLoggerService);

  /**
   * Export data to CSV with proper type safety
   */
  exportToCsv<T extends CsvExportable>(
    data: T[], 
    filename: string, 
    headers?: (keyof T)[]
  ): void {
    try {
      if (!data || data.length === 0) {
        this.logger.warn('CsvService', 'No data to export');
        return;
      }

      // Use provided headers or extract from first item
      const csvHeaders = headers || (Object.keys(data[0]) as (keyof T)[]);
      
      const csvContent = this.buildCsvContent(data, csvHeaders);
      this.downloadCsv(csvContent, filename);
      
      this.logger.info('CsvService', 'CSV exported successfully', { 
        filename, 
        recordCount: data.length 
      });
    } catch (error) {
      this.logger.error('CsvService', 'Failed to export CSV', error as Error);
      throw error;
    }
  }

  /**
   * Parse CSV file with type safety
   */
  async parse<T>(
    file: File, 
    parser: (values: string[], headers: string[]) => T | null
  ): Promise<CsvImportResult<T>> {
    const endTimer = this.logger.startTimer('CsvService', 'parseCsv');
    
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
              this.logger.warn('CsvService', `Skipping line ${i + 1}: Column count mismatch`);
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

          endTimer();
          this.logger.info('CsvService', 'CSV parsed successfully', { 
            recordCount: data.length,
            errors: errorCount
          });
          
          resolve({ data, errors: errorCount });
        } catch (error) {
          endTimer();
          this.logger.error('CsvService', 'Failed to parse CSV', error as Error);
          reject(error);
        }
      };

      reader.onerror = () => {
        endTimer();
        this.logger.error('CsvService', 'File read error');
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  private buildCsvContent<T extends CsvExportable>(
    data: T[], 
    headers: (keyof T)[]
  ): string {
    const csvContent = [
      headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...data.map(item => {
        return headers.map(header => {
          const value = item[header];
          const safeValue = value === undefined || value === null ? '' : String(value);
          
          // Escape commas, quotes, and newlines
          if (safeValue.includes(',') || safeValue.includes('"') || safeValue.includes('\n')) {
            return `"${safeValue.replace(/"/g, '""')}"`;
          }
          return safeValue;
        }).join(',');
      })
    ].join('\n');

    return csvContent;
  }

  private downloadCsv(csvContent: string, filename: string): void {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
}
