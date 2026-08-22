import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@app/core/services/supabase.service';
import { TenantService } from '@app/core/services/tenant.service';

export interface Certificate {
  id: string;
  course_id: string;
  tenant_id: string;
  email: string;
  student_dni: string;
  student_name: string;
  pdf_url: string;
  issued_at: string;
  course?: { title: string; image_url: string };
}

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {
  private readonly supabase = inject(SupabaseService).getClient();
  private readonly tenantService = inject(TenantService);
  
  public isGenerating = signal<boolean>(false);

  /**
   * Approves a student and generates a certificate via Edge Function.
   */
  async approveStudentAndGenerateCertificate(data: {
    courseId: string;
    studentName: string;
    studentDni: string;
    studentEmail: string;
    courseName: string;
    enrollmentId?: string; // Optional: To mark enrollment as completed
  }): Promise<{ success: boolean; certificateId?: string; pdfUrl?: string; error?: any }> {
    try {
      this.isGenerating.set(true);
      const tenantId = this.tenantService.getTenantId();

      // Call Edge Function
      const { data: result, error } = await this.supabase.functions.invoke('generate-certificate', {
        body: { ...data, tenantId }
      });

      if (error) throw error;
      
      // Optionally mark enrollment as confirmed/completed in DB
      if (data.enrollmentId) {
        await this.supabase
          .from('course_enrollments')
          .update({ status: 'confirmed' })
          .eq('id', data.enrollmentId);
      }

      return { success: true, certificateId: result.certificateId, pdfUrl: result.pdfUrl };
    } catch (err) {
      console.error('Error generating certificate:', err);
      return { success: false, error: err };
    } finally {
      this.isGenerating.set(false);
    }
  }

  /**
   * Gets all certificates for a specific student email
   */
  async getStudentCertificates(email: string): Promise<Certificate[]> {
    const tenantId = this.tenantService.getTenantId();
    const { data, error } = await this.supabase
      .from('course_certificates')
      .select(`
        *,
        course:courses(title, image_url)
      `)
      .eq('tenant_id', tenantId)
      .eq('email', email)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }
    return data as any as Certificate[];
  }

  /**
   * Validates a certificate by its ID (Public method)
   */
  async validateCertificate(id: string): Promise<Certificate | null> {
    const { data, error } = await this.supabase
      .from('course_certificates')
      .select(`
        *,
        course:courses(title)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error validating certificate:', error);
      return null;
    }
    return data as any as Certificate;
  }

  /**
   * Revokes (deletes) a certificate by courseId and studentEmail
   */
  async revokeCertificate(courseId: string, studentEmail: string): Promise<boolean> {
    const tenantId = this.tenantService.getTenantId();
    
    // 1. Get the certificate to know the file name to delete from storage (optional but recommended)
    const { data: cert } = await this.supabase
      .from('course_certificates')
      .select('pdf_url')
      .eq('course_id', courseId)
      .eq('email', studentEmail)
      .eq('tenant_id', tenantId)
      .single();

    if (cert && cert.pdf_url) {
      // The filename is usually the last part of the URL (e.g., 8chars.pdf)
      const urlParts = cert.pdf_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (fileName.endsWith('.pdf')) {
        await this.supabase.storage.from('academy_certificates').remove([fileName]);
      }
    }

    // 2. Delete from database
    const { error } = await this.supabase
      .from('course_certificates')
      .delete()
      .eq('course_id', courseId)
      .eq('email', studentEmail)
      .eq('tenant_id', tenantId);

    if (error) {
      console.error('Error revoking certificate:', error);
      return false;
    }
    
    return true;
  }
}
