import { Component, inject, OnInit } from '@angular/core';
import { PreferencesService } from '../../shared/services/preferences.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, CreateMessageDto } from '@app/core/services/contact.service';
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
    private contactService = inject(ContactService);
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

        const msg: CreateMessageDto = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message
        };

        this.contactService.createMessage(msg).then(({ error }) => {
            this.isLoading = false;
            if (error) {
                console.error('Error sending form:', error);
                this.showError = true;
            } else {
                this.showSuccess = true;
                this.contactForm.reset();
            }
        }).catch(err => {
            console.error('Error sending form:', err);
            this.isLoading = false;
            this.showError = true;
        });
    }
}