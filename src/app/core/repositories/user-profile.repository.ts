import { Observable } from 'rxjs';
import { UserProfile } from '@app/shared/interfaces/user.interface';

export abstract class UserProfileRepository {
  abstract getProfile(id: string): Observable<UserProfile | null>;
  abstract updateProfile(id: string, profile: Partial<UserProfile>): Observable<UserProfile>;
}
