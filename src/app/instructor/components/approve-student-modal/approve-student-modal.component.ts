import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificatesService } from '@app/features/courses/application/services/certificates.service';

@Component({
  selector: 'app-approve-student-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <dialog [id]="modalId" class="modal" [class.modal-open]="isOpen()">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Emitir Certificado</h3>
        <p class="py-4 text-sm text-gray-500">
          Por favor, verifica o ingresa los datos del alumno antes de generar el certificado. 
          Una vez generado, no se podr modificar.
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          
          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">Nombre Completo (Como aparecer en el certificado)</span>
            </label>
            <input type="text" formControlName="studentName" class="input input-bordered w-full" />
            <label class="label" *ngIf="form.get('studentName')?.invalid && form.get('studentName')?.touched">
              <span class="label-text-alt text-error">Requerido</span>
            </label>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label">
              <span class="label-text">DNI del Alumno</span>
            </label>
            <input type="text" formControlName="studentDni" class="input input-bordered w-full" placeholder="Ej: 12345678" />
            <label class="label" *ngIf="form.get('studentDni')?.invalid && form.get('studentDni')?.touched">
              <span class="label-text-alt text-error">Requerido</span>
            </label>
          </div>

          <div class="form-control w-full mb-6">
            <label class="label">
              <span class="label-text">Email del Alumno</span>
            </label>
            <input type="email" formControlName="studentEmail" class="input input-bordered w-full" placeholder="Ej: alumno@email.com" />
            <label class="label" *ngIf="form.get('studentEmail')?.invalid && form.get('studentEmail')?.touched">
              <span class="label-text-alt text-error">Email vlido es requerido</span>
            </label>
          </div>

          <div class="modal-action">
            <button type="button" class="btn" (click)="close()" [disabled]="isGenerating()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid || isGenerating()">
              <span *ngIf="isGenerating()" class="loading loading-spinner"></span>
              {{ isGenerating() ? 'Generando...' : 'Emitir Certificado' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" (click)="close()">
        <button>close</button>
      </form>
    </dialog>
  `
})
export class ApproveStudentModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly certificatesService = inject(CertificatesService);

  @Input() modalId = 'approve-student-modal';
  @Output() onApproved = new EventEmitter<{ certificateId: string; pdfUrl: string }>();
  @Output() onClosed = new EventEmitter<void>();

  isOpen = signal<boolean>(false);
  isGenerating = this.certificatesService.isGenerating;

  // Data to hold context
  currentCourseId = '';
  currentCourseName = '';
  currentEnrollmentId = '';

  form = this.fb.nonNullable.group({
    studentName: ['', [Validators.required, Validators.minLength(3)]],
    studentDni: ['', [Validators.required]],
    studentEmail: ['', [Validators.required, Validators.email]]
  });

  open(data: {
    enrollmentId?: string;
    courseId: string;
    courseName: string;
    studentName: string;
    studentEmail: string;
    studentDni?: string;
  }) {
    this.currentEnrollmentId = data.enrollmentId || '';
    this.currentCourseId = data.courseId;
    this.currentCourseName = data.courseName;

    this.form.patchValue({
      studentName: data.studentName,
      studentDni: data.studentDni || '',
      studentEmail: data.studentEmail
    });

    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.form.reset();
    this.onClosed.emit();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const values = this.form.getRawValue();

    const result = await this.certificatesService.approveStudentAndGenerateCertificate({
      courseId: this.currentCourseId,
      courseName: this.currentCourseName,
      studentEmail: values.studentEmail,
      studentName: values.studentName,
      studentDni: values.studentDni,
      enrollmentId: this.currentEnrollmentId || undefined
    });

    if (result.success && result.certificateId && result.pdfUrl) {
      this.onApproved.emit({ certificateId: result.certificateId, pdfUrl: result.pdfUrl });
      this.close();
    } else {
      alert('Error al generar el certificado: ' + JSON.stringify(result.error));
    }
  }
}
