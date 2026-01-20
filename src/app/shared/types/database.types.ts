export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string | null
          email: string | null
          phone: string | null
          subject: string | null
          message: string | null
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          subject?: string | null
          message?: string | null
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          subject?: string | null
          message?: string | null
          is_read?: boolean
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          order_number: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_address: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          subtotal: number
          tax: number
          discount: number
          total_amount: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          order_number: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          subtotal: number
          tax?: number
          discount?: number
          total_amount: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          order_number?: string
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          customer_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          subtotal?: number
          tax?: number
          discount?: number
          total_amount?: number
          notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          created_at: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin' | 'staff'
          first_name: string | null
          last_name: string | null
        }
        Insert: {
          id: string
          email: string
          role?: 'user' | 'admin' | 'staff'
          first_name?: string | null
          last_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin' | 'staff'
          first_name?: string | null
          last_name?: string | null
        }
      }
    }
  }
}
