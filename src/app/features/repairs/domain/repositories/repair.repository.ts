import { Observable } from 'rxjs';
import { Repair, CreateRepairDto, UpdateRepairDto } from '../entities/repair.entity';

export abstract class RepairRepository {
    abstract getById(id: string): Observable<Repair | null>;
    abstract getAll(options?: { column?: string; ascending?: boolean; select?: string }): Observable<Repair[]>;
    abstract getRepairs(limit?: number, offset?: number, branchId?: string): Observable<Repair[]>;
    abstract create(repair: CreateRepairDto): Observable<Repair>;
    abstract update(id: string, repair: Partial<Repair>): Observable<Repair>;
    abstract delete(id: string): Observable<void>;
    abstract getByTrackingCode(code: string): Observable<Repair | null>;
    abstract uploadImage(file: File): Promise<string>;
    abstract getAdminList(params: { branch_id?: string, includeOrphans?: boolean, limit?: number, offset?: number, searchTerm?: string }): Observable<Repair[]>;
    abstract getWorkshopSummary(branch_id?: string, includeOrphans?: boolean, month?: number, year?: number): Observable<any>;
}
