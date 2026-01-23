import { Observable } from 'rxjs';
import { Repair, CreateRepairDto, UpdateRepairDto } from '../entities/repair.entity';

export abstract class RepairRepository {
    abstract getById(id: string): Observable<Repair>;
    abstract getAll(limit?: number, offset?: number): Observable<Repair[]>;
    abstract create(repair: CreateRepairDto): Observable<Repair>;
    abstract update(id: string, repair: UpdateRepairDto): Observable<void>;
    abstract delete(id: string): Observable<void>;
    abstract getByTrackingCode(code: string): Observable<Repair>;
    abstract uploadImage(file: File): Promise<string>;
}
