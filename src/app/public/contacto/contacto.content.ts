
export interface ContactoContent {
    title: string;
    subtitle: string;
    intro: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailError: string;
    phoneLabel: string;
    phonePlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    subjectOptions: { value: string; label: string }[];
    messageLabel: string;
    messagePlaceholder: string;
    messageError: string;
    termsText: string;
    termsLink: string;
    privacyLink: string;
    submitButton: string;
    sendingMessage: string;
    successMessage: string;
    errorMessage: string;
    contactInfoTitle: string;
    addressLabel: string;
    addressValue: string;
    phoneInfoLabel: string;
    phoneInfoValue: string;
    phoneInfoHours: string;
    emailInfoLabel: string;
    emailInfoValue: string;
    supportLabel: string;
    supportValue: string;
    socialTitle: string;
}

export const CONTACTO_CONTENT: { en: ContactoContent; es: ContactoContent } = {
    es: {
        title: 'Contacto',
        subtitle: 'Contáctanos',
        intro: 'Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte y responderemos lo antes posible.',
        formTitle: 'Envía un mensaje',
        nameLabel: 'Nombre *',
        namePlaceholder: 'Tu nombre completo',
        nameError: 'Por favor ingresa tu nombre',
        emailLabel: 'Correo electrónico *',
        emailPlaceholder: 'tu@email.com',
        emailError: 'Por favor ingresa un email válido',
        phoneLabel: 'Teléfono',
        phonePlaceholder: '+54 11 1234-5678',
        subjectLabel: 'Asunto *',
        subjectPlaceholder: 'Selecciona un asunto',
        subjectOptions: [
            { value: 'Consulta general', label: 'Consulta general' },
            { value: 'Soporte técnico', label: 'Soporte técnico' },
            { value: 'Información de ventas', label: 'Información de ventas' },
            { value: 'Oportunidades de trabajo', label: 'Oportunidades de trabajo' },
            { value: 'Otro', label: 'Otro' }
        ],
        messageLabel: 'Mensaje *',
        messagePlaceholder: 'Escribe tu mensaje aquí...',
        messageError: 'Por favor escribe tu mensaje',
        termsText: 'Acepto los',
        termsLink: 'términos y condiciones',
        privacyLink: 'política de privacidad',
        submitButton: 'Enviar mensaje',
        sendingMessage: 'Enviando mensaje...',
        successMessage: '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
        errorMessage: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.',
        contactInfoTitle: 'Información de contacto',
        addressLabel: 'Dirección',
        addressValue: 'Jorge Newbery 69, Marcos paz, Buenos Aires, Argentina',
        phoneInfoLabel: 'Teléfono',
        phoneInfoValue: '+54 11 2596-0900',
        phoneInfoHours: 'Lunes a Viernes de 9:00 a 18:00',
        emailInfoLabel: 'Correo electrónico',
        emailInfoValue: 'Respuesta en menos de 24 horas',
        supportLabel: 'Soporte',
        supportValue: 'Asistencia técnica especializada',
        socialTitle: 'Síguenos en redes'
    },
    en: {
        title: 'Contact',
        subtitle: 'Contact Us',
        intro: 'If you have any questions or need help, do not hesitate to contact us. We are here to help and will respond as soon as possible.',
        formTitle: 'Send a message',
        nameLabel: 'Name *',
        namePlaceholder: 'Your full name',
        nameError: 'Please enter your name',
        emailLabel: 'Email *',
        emailPlaceholder: 'you@email.com',
        emailError: 'Please enter a valid email',
        phoneLabel: 'Phone',
        phonePlaceholder: '+54 11 1234-5678',
        subjectLabel: 'Subject *',
        subjectPlaceholder: 'Select a subject',
        subjectOptions: [
            { value: 'General Inquiry', label: 'General Inquiry' },
            { value: 'Technical Support', label: 'Technical Support' },
            { value: 'Sales Information', label: 'Sales Information' },
            { value: 'Job Opportunities', label: 'Job Opportunities' },
            { value: 'Other', label: 'Other' }
        ],
        messageLabel: 'Message *',
        messagePlaceholder: 'Write your message here...',
        messageError: 'Please write your message',
        termsText: 'I accept the',
        termsLink: 'terms and conditions',
        privacyLink: 'privacy policy',
        submitButton: 'Send message',
        sendingMessage: 'Sending message...',
        successMessage: 'Message sent successfully! We will contact you soon.',
        errorMessage: 'There was an error sending the message. Please try again later.',
        contactInfoTitle: 'Contact Information',
        addressLabel: 'Address',
        addressValue: 'Jorge Newbery 69, Marcos Paz, Buenos Aires, Argentina',
        phoneInfoLabel: 'Phone',
        phoneInfoValue: '+54 11 2596-0900',
        phoneInfoHours: 'Monday to Friday from 9:00 to 18:00',
        emailInfoLabel: 'Email',
        emailInfoValue: 'Response in less than 24 hours',
        supportLabel: 'Support',
        supportValue: 'Specialized technical assistance',
        socialTitle: 'Follow us on social media'
    }
};
