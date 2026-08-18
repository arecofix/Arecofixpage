/**
 * Supabase public schema types (subset).
 * Regenerate with: npx supabase gen types typescript --project-id <id>
 */
import type { DbOrderStatus } from '@app/features/orders/domain/value-objects/order-status.vo';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          tenant_id: string;
          branch_id: string | null;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          tenant_id?: string;
          branch_id?: string | null;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          is_read?: boolean;
        };
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          branch_id: string | null;
          order_number: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          shipping_address: Json | null;
          status: DbOrderStatus;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          total_amount: number;
          payment_method: string | null;
          payment_proof_url: string | null;
          invoice_url: string | null;
          invoice_generated: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['orders']['Row']>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      order_items: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          product_id: string | null;
          course_id: string | null;
          product_name: string | null;
          product_sku: string | null;
          quantity: number;
          unit_price: number;
          cost_price: number;
          subtotal: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['order_items']['Row']>;
        Update: Partial<Database['public']['Tables']['order_items']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string | null;
          repair_id: string | null;
          customer_id: string | null;
          origin: 'sale' | 'order' | 'manual' | 'repair';
          items: Json;
          total_amount: number;
          issued_at: string;
        };
        Insert: Partial<Database['public']['Tables']['invoices']['Row']>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          role: 'user' | 'admin' | 'staff' | 'super_admin' | 'tenant_owner' | 'technician';
          address: string | null;
          dni: string | null;
          cuit_cuil: string | null;
          branch_id: string | null;
          tenant_id: string | null;
          deleted_at: string | null;
          is_guest: boolean;
          referral_code: string | null;
          points: number;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']>;
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
    };
  };
}
