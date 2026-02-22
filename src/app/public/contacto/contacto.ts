import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CONTACTO_CONTENT, ContactoContent } from './contacto.content';

@Component({
    selector: 'app-contacto',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    AsyncPipe
],
    templateUrl: './contacto.html',
    styleUrls: ['./contacto.scss']
})
export class ContactoComponent implements OnInit {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    public preferencesService = inject(PreferencesService);
    private seoService = inject(SeoService);

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

    contactoContent = CONTACTO_CONTENT;

    content$: Observable<ContactoContent>;

    constructor() {
        this.content$ = this.preferencesService.language$.pipe(
            map(lang => this.contactoContent[lang])
        );
    }

    ngOnInit() {
        this.seoService.setPageData({
            title: 'Contacto',
            description: 'Ponte en contacto con nosotros. Estamos listos para escuchar tu idea y convertirla en realidad. Whatsapp, Email y Redes Sociales.',
            imageUrl: 'assets/img/branding/og-contact.jpg'
        });
    }

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