export interface StorageAdapter {
  initDatabase(): Promise<void>;
  saveToLocal(tableName: string, payload: any, operation: string): Promise<{ local: boolean, success: boolean }>;
  getPendingData(): Promise<any[]>;
  deletePendingData(id: number): Promise<void>;
  clearAllPending(): Promise<void>;
}
