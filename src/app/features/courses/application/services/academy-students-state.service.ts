import { Injectable, inject, signal } from '@angular/core';
import { AcademyStudentsRepository } from '../../infrastructure/academy-students.repository';

export interface AcademyStudent {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  phone: string;
  role: string;
  enrolled_courses_count: number;
  certificates_count: number;
}

@Injectable({ providedIn: 'root' })
export class AcademyStudentsStateService {
  private repository = inject(AcademyStudentsRepository);

  readonly students = signal<AcademyStudent[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async loadStudents() {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const data = await this.repository.getStudents();
      this.students.set(data as AcademyStudent[]);
    } catch (e: any) {
      this.error.set(e.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateLocalDni(userId: string, newDni: string) {
    this.students.update(students => 
      students.map(s => s.user_id === userId ? { ...s, dni: newDni } : s)
    );
  }
}
