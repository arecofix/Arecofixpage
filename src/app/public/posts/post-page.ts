import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, OnDestroy, Inject, DOCUMENT } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Post, PostComment } from '@app/features/posts/domain/entities/post.entity';
import { PostService } from '@app/features/posts/application/post.service';
import { AuthService } from '@app/core/services/auth.service';
import { ContactService } from '@app/core/services/contact.service';
import { ReservationCalendar } from '@app/public/reservation/reservation-calendar';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-post-page',
    standalone: true,
    imports: [RouterLink, DatePipe, CommonModule, FormsModule, ReservationCalendar],
    templateUrl: './post-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPage implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private postService = inject(PostService);
    private cdr = inject(ChangeDetectorRef);
    private titleService = inject(Title);
    private metaService = inject(Meta);
    private auth = inject(AuthService);
    private contactService = inject(ContactService);
    private document = inject(DOCUMENT);

    post: Post | null = null;
    loading = true;
    error: string | null = null;
    currentSlug: string | null = null;
    private jsonLdScript: HTMLScriptElement | null = null;

    // Contact Form Data
    contactName = '';
    contactPhone = '';
    contactMessage = '';
    sendingContact = false;

    // Comments State
    comments: PostComment[] = [];
    newCommentName = '';
    newCommentText = '';
    submittingComment = false;

    async ngOnInit() {
        this.route.paramMap.subscribe(async params => {
            const slug = params.get('slug');
            if (slug) {
                await this.loadPost(slug);
            }
        });
    }

    ngOnDestroy() {
        this.removeJsonLd();
    }

    async loadPost(slug: string) {
        try {
            this.loading = true;
            this.error = null;
            this.post = await this.postService.getPostBySlug(slug);
            this.currentSlug = slug;

            if (this.post) {
                this.handleSeo(this.post, slug);
                await this.loadComments(this.post.id);
            } else {
                if (slug.includes('tcnico')) {
                    const correctedSlug = slug.replace('tcnico', 'tecnico');
                    this.post = await this.postService.getPostBySlug(correctedSlug);
                    if (this.post) {
                        this.handleSeo(this.post, correctedSlug);
                        await this.loadComments(this.post.id);
                        return;
                    }
                }
                this.error = 'Entrada no encontrada';
            }
        } catch (e: any) {
            this.error = 'Error al cargar la entrada';
        } finally {
            this.loading = false;
            this.cdr.markForCheck();
        }
    }

    handleSeo(post: Post, slug: string) {
        const isLandingPage = slug === 'servicio-tecnico-de-celulares-en-marcos-paz';

        if (isLandingPage) {
            // Optimized SEO for Landing Page
            this.titleService.setTitle('Servicio Técnico de Celulares en Marcos Paz | Arecofix - Reparación en el Acto');
            
            this.metaService.updateTag({ 
                name: 'description', 
                content: 'Reparación de celulares en Marcos Paz. Cambio de módulo, batería y pin de carga en el acto. Especialistas en iPhone, Samsung y Motorola. ¡Pedí tu presupuesto GRATIS!' 
            });

            this.metaService.updateTag({
                name: 'keywords',
                content: 'servicio tecnico celulares marcos paz, reparacion celulares, cambio pantalla iphone, arreglo samsung, cambio bateria celular, marcos paz, motorola, xiaomi, lg'
            });

            // Open Graph (Social)
            this.metaService.updateTag({ property: 'og:title', content: 'Reparación de Celulares en Marcos Paz | Arecofix' });
            this.metaService.updateTag({ property: 'og:description', content: 'Servicio técnico especializado. Reparamos iPhone, Samsung, Motorola y más en el acto. ¡Tu celular en las mejores manos!' });
            this.metaService.updateTag({ property: 'og:image', content: `${environment.baseUrl}/assets/img/repair/1.jpg` });
            this.metaService.updateTag({ property: 'og:url', content: `${environment.baseUrl}/posts/servicio-tecnico-de-celulares-en-marcos-paz` });
            this.metaService.updateTag({ property: 'og:type', content: 'website' });

            this.injectJsonLd();
        } else {
            // Standard Blog SEO
            this.titleService.setTitle(`${post.title} | Arecofix`);
            if (post.meta_description) {
                this.metaService.updateTag({ name: 'description', content: post.meta_description });
            }
            if (post.meta_title) {
                this.metaService.updateTag({ name: 'title', content: post.meta_title });
            }

            // Open Graph (Social)
            const postImage = post.image || 'assets/img/branding/og-services.png';
            let absoluteImageUrl = postImage;
            if (postImage && !postImage.startsWith('http') && postImage !== '_' && postImage !== 'null' && !postImage.startsWith('assets/')) {
                const encodedPath = postImage.split('/').map((s: string) => encodeURIComponent(s)).join('/');
                absoluteImageUrl = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
            } else if (!postImage.startsWith('http')) {
                absoluteImageUrl = `${environment.baseUrl}/${postImage.startsWith('/') ? postImage.substring(1) : postImage}`;
            }

            this.metaService.updateTag({ property: 'og:title', content: post.title });
            this.metaService.updateTag({ property: 'og:description', content: post.meta_description || post.content.substring(0, 160) });
            this.metaService.updateTag({ property: 'og:image', content: absoluteImageUrl });
            this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
            this.metaService.updateTag({ property: 'og:image:height', content: '630' });
            this.metaService.updateTag({ property: 'og:url', content: `${environment.baseUrl}/posts/${slug}` });
            this.metaService.updateTag({ property: 'og:type', content: 'article' });
        }
    }

    injectJsonLd() {
        this.removeJsonLd(); // Clean up first
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "MobilePhoneStore",
            "name": "Arecofix - Servicio Técnico de Celulares",
            "image": `${environment.baseUrl}/assets/img/cursos/local.webp`,
            "description": "Servicio técnico especializado en reparación de celulares en Marcos Paz. Cambio de pantallas, baterías y micro-soldadura.",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sarmiento 2050", // Placeholder address
                "addressLocality": "Marcos Paz",
                "addressRegion": "Buenos Aires",
                "postalCode": "1727",
                "addressCountry": "AR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-34.77", // Placeholder
                "longitude": "-58.83" // Placeholder
            },
            "url": environment.baseUrl,
            "telephone": "+5491125960900",
            "priceRange": "$$",
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    "opens": "09:00",
                    "closes": "20:00"
                }
            ],
            "sameAs": [
                "https://www.instagram.com/arecofix",
                "https://www.facebook.com/arecofix"
            ]
        };

        this.jsonLdScript = this.document.createElement('script');
        this.jsonLdScript.type = 'application/ld+json';
        this.jsonLdScript.text = JSON.stringify(schema);
        this.document.head.appendChild(this.jsonLdScript);
    }

    removeJsonLd() {
        if (this.jsonLdScript) {
            this.document.head.removeChild(this.jsonLdScript);
            this.jsonLdScript = null;
        }
    }

    async sendContactForm() {
        if (!this.contactName || !this.contactPhone || !this.contactMessage) {
            alert('Por favor completa todos los campos');
            return;
        }

        this.sendingContact = true;
        this.cdr.markForCheck();

        try {
            // Save to DB via tenant-aware service
            await this.contactService.createMessage({
                name: this.contactName,
                phone: this.contactPhone,
                email: 'web-contact@arecofix.com', // Placeholder
                subject: 'Consulta desde Landing Servicio Técnico',
                message: this.contactMessage
            });

            alert('¡Consulta enviada con éxito! Te responderemos a la brevedad.');
            this.contactName = '';
            this.contactPhone = '';
            this.contactMessage = '';
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Ocurrió un error al enviar el mensaje. Por favor intenta por WhatsApp.');
        } finally {
            this.sendingContact = false;
            this.cdr.markForCheck();
        }
    }

    async loadComments(postId: string) {
        try {
            this.comments = await this.postService.getComments(postId);
        } catch (error) {
            console.error('Error loading comments', error);
        } finally {
            this.cdr.markForCheck();
        }
    }

    async submitComment() {
        if (!this.newCommentName.trim() || !this.newCommentText.trim() || !this.post) return;

        this.submittingComment = true;
        this.cdr.markForCheck();

        try {
            const newComment = await this.postService.addComment(
                this.post.id,
                this.newCommentName,
                this.newCommentText
            );
            // Append locally to avoid full reload
            this.comments = [...this.comments, newComment];
            this.newCommentName = '';
            this.newCommentText = '';
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('No se pudo enviar el comentario. Intenta nuevamente más tarde.');
        } finally {
            this.submittingComment = false;
            this.cdr.markForCheck();
        }
    }
}
