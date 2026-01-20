import { Observable } from 'rxjs';
import { CrmMessage } from '../entities/crm-message.entity';

export abstract class MessageRepository {
    abstract saveMessage(message: CrmMessage): Observable<void>;
    abstract getMessages(): Observable<CrmMessage[]>;
}
