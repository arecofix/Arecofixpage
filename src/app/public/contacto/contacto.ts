import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', Validators.required],
    message: ['', Validators.required],
    terms: [false, Validators.requiredTrue]
  });

  isLoading = false;
  showSuccess = false;
  showError = false;

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.showSuccess = false;
    this.showError = false;

    const formData = this.contactForm.value;

    // Formspree endpoint
    this.http.post('https://formspree.io/f/mpwrwebv', formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess = true;
        this.contactForm.reset();
      },
      error: (err) => {
        console.error('Error sending form:', err);
        this.isLoading = false;
        this.showError = true;
      }
    });
  }
}