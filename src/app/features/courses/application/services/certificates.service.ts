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
  status?: 'valid' | 'revoked';
  pdf_url: string;
  issued_at: string;
  course?: { title: string; image_url?: string; slug?: string };
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
        course:courses(title, image_url, slug)
      `)
      .eq('tenant_id', tenantId)
      .eq('email', email)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      return [];
    }
    return (data || []) as any as Certificate[];
  }

  /**
   * Admin: Gets all certificates in the system with course title and student details.
   */
  async getAllCertificatesAdmin(): Promise<Certificate[]> {
    const { data, error } = await this.supabase
      .from('course_certificates')
      .select(`
        id,
        course_id,
        tenant_id,
        email,
        student_dni,
        student_name,
        status,
        pdf_url,
        issued_at,
        course:courses(id, title, slug, image_url)
      `)
      .order('issued_at', { ascending: false });

    if (error) {
      console.error('[CertificatesService] Error fetching admin certificates:', error);
      return [];
    }
    return (data || []) as any as Certificate[];
  }

  /**
   * Validates a certificate by its ID using secure public RPC.
   * Exposes ONLY safe non-sensitive data (student name, course title, instructor, issue date, status).
   */
  async getPublicCertificateData(id: string): Promise<{
    success: boolean;
    certificate_id?: string;
    student_name?: string;
    course_title?: string;
    instructor_name?: string;
    issued_at?: string;
    status?: string;
    pdf_url?: string;
    is_valid?: boolean;
    message?: string;
  } | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_public_certificate_data', {
        p_cert_id: id
      });

      if (error) {
        console.warn('[CertificatesService] RPC error fetching public certificate:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('[CertificatesService] Exception fetching public certificate:', err);
      return null;
    }
  }

  /**
   * Validates a certificate by its ID (Public method)
   */
  async validateCertificate(id: string): Promise<Certificate | null> {
    const publicData = await this.getPublicCertificateData(id);
    if (!publicData || !publicData.success) {
      return null;
    }
    return {
      id: publicData.certificate_id || id,
      course_id: '',
      tenant_id: '',
      email: '',
      student_dni: '',
      student_name: publicData.student_name || '',
      status: (publicData.status as any) || 'valid',
      pdf_url: publicData.pdf_url || `/api/academy/certificates/${id}/pdf`,
      issued_at: publicData.issued_at || '',
      course: {
        title: publicData.course_title || '',
        image_url: ''
      }
    };
  }

  /**
   * Admin: Revokes an issued certificate by ID with 1 click.
   * Immediately invalidates public QR verification.
   */
  async revokeCertificateById(certId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('admin_revoke_certificate', {
        p_cert_id: certId,
        p_reason: reason || 'Revocado por el administrador'
      });

      if (error) {
        // Fallback to direct table update if RPC not present in environment
        const { error: updateErr } = await this.supabase
          .from('course_certificates')
          .update({ status: 'revoked', updated_at: new Date().toISOString() })
          .eq('id', certId);

        if (updateErr) {
          return { success: false, error: updateErr.message };
        }
        return { success: true };
      }

      return { success: data?.success ?? true };
    } catch (err: any) {
      console.error('[CertificatesService] Failed to revoke certificate:', err);
      return { success: false, error: err?.message || 'Error inesperado al revocar' };
    }
  }

  /**
   * Admin: Reactivates a previously revoked certificate.
   */
  async reactivateCertificateById(certId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.rpc('admin_reactivate_certificate', {
        p_cert_id: certId
      });

      if (error) {
        const { error: updateErr } = await this.supabase
          .from('course_certificates')
          .update({ status: 'valid', updated_at: new Date().toISOString() })
          .eq('id', certId);

        if (updateErr) {
          return { success: false, error: updateErr.message };
        }
        return { success: true };
      }

      return { success: data?.success ?? true };
    } catch (err: any) {
      console.error('[CertificatesService] Failed to reactivate certificate:', err);
      return { success: false, error: err?.message || 'Error inesperado al reactivar' };
    }
  }

  /**
   * Legacy method for backwards compatibility
   */
  async revokeCertificate(courseId: string, studentEmail: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('course_certificates')
      .select('id')
      .eq('course_id', courseId)
      .eq('email', studentEmail)
      .maybeSingle();

    if (data?.id) {
      const res = await this.revokeCertificateById(data.id);
      return res.success;
    }
    return false;
  }
}

