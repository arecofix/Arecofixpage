import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isLoading = false;
  formSubmitted = false;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.formSubmitted = false;
    this.formError = '';

    const formData = new FormData();
    Object.keys(this.contactForm.value).forEach(key => {
      formData.append(key, this.contactForm.value[key]);
    });

    // Cambia esta URL por tu endpoint de Formspree
    this.http.post('https://formspree.io/f/mpwrwebv', formData, {
      headers: {
        'Accept': 'application/json'
      }
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.formSubmitted = true;
        this.contactForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        this.formError = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
        console.error('Error:', error);
      }
    });
  }
}