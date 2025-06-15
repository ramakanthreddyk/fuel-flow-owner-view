export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employee_station_assignments: {
        Row: {
          assigned_at: string
          id: string
          role: string | null
          station_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          role?: string | null
          station_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          role?: string | null
          station_id?: string
          user_id?: string
        }
        Relationships: []
      }
      fuel_prices: {
        Row: {
          date: string
          fuel_type: string
          id: string
          price: number
          station_id: string
        }
        Insert: {
          date?: string
          fuel_type: string
          id?: string
          price: number
          station_id: string
        }
        Update: {
          date?: string
          fuel_type?: string
          id?: string
          price?: number
          station_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_prices_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      nozzles: {
        Row: {
          fuel_type: string
          id: string
          label: string
          pump_id: string | null
        }
        Insert: {
          fuel_type: string
          id?: string
          label: string
          pump_id?: string | null
        }
        Update: {
          fuel_type?: string
          id?: string
          label?: string
          pump_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nozzles_pump_id_fkey"
            columns: ["pump_id"]
            isOneToOne: false
            referencedRelation: "pumps"
            referencedColumns: ["id"]
          },
        ]
      }
      ocr_readings: {
        Row: {
          confirmed_sale_id: string | null
          created_at: string
          extracted_reading: number | null
          id: string
          image_url: string | null
          nozzle_id: string
          recorded_at: string
          station_id: string
          uploaded_by: string | null
        }
        Insert: {
          confirmed_sale_id?: string | null
          created_at?: string
          extracted_reading?: number | null
          id?: string
          image_url?: string | null
          nozzle_id: string
          recorded_at: string
          station_id: string
          uploaded_by?: string | null
        }
        Update: {
          confirmed_sale_id?: string | null
          created_at?: string
          extracted_reading?: number | null
          id?: string
          image_url?: string | null
          nozzle_id?: string
          recorded_at?: string
          station_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ocr_readings_confirmed_sale_id_fkey"
            columns: ["confirmed_sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_readings_nozzle_id_fkey"
            columns: ["nozzle_id"]
            isOneToOne: false
            referencedRelation: "nozzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocr_readings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          name: string | null
          role: string
        }
        Insert: {
          email?: string | null
          id: string
          name?: string | null
          role?: string
        }
        Update: {
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
      pumps: {
        Row: {
          deleted_at: string | null
          id: string
          label: string
          station_id: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          label: string
          station_id?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          label?: string
          station_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pumps_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          created_at: string
          cumulative_reading: number
          fuel_price: number
          id: string
          nozzle_id: string
          previous_reading: number
          price_per_litre: number | null
          reading_id: string | null
          recorded_at: string
          sale_volume: number
          station_id: string
          status: Database["public"]["Enums"]["sale_status"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          cumulative_reading: number
          fuel_price: number
          id?: string
          nozzle_id: string
          previous_reading: number
          price_per_litre?: number | null
          reading_id?: string | null
          recorded_at: string
          sale_volume: number
          station_id: string
          status?: Database["public"]["Enums"]["sale_status"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          cumulative_reading?: number
          fuel_price?: number
          id?: string
          nozzle_id?: string
          previous_reading?: number
          price_per_litre?: number | null
          reading_id?: string | null
          recorded_at?: string
          sale_volume?: number
          station_id?: string
          status?: Database["public"]["Enums"]["sale_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_nozzle_id_fkey"
            columns: ["nozzle_id"]
            isOneToOne: false
            referencedRelation: "nozzles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      submission_logs: {
        Row: {
          action: string | null
          created_at: string
          id: string
          payload: Json | null
          user_id: string
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          user_id: string
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          payload?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      tank_refills: {
        Row: {
          fuel_type: string
          id: string
          litres: number
          notes: string | null
          refill_datetime: string
          station_id: string
          user_id: string
        }
        Insert: {
          fuel_type: string
          id?: string
          litres: number
          notes?: string | null
          refill_datetime?: string
          station_id: string
          user_id: string
        }
        Update: {
          fuel_type?: string
          id?: string
          litres?: number
          notes?: string | null
          refill_datetime?: string
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tank_refills_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_entries: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          station_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          station_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          station_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_entries_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          brand: string | null
          created_at: string
          display_name: string | null
          phone_number: string | null
          plan: Database["public"]["Enums"]["plan_type"]
          station_id: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          display_name?: string | null
          phone_number?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          station_id?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          display_name?: string | null
          phone_number?: string | null
          plan?: Database["public"]["Enums"]["plan_type"]
          station_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          deleted_at: string | null
          email: string
          id: string
          name: string
          password: string
        }
        Insert: {
          deleted_at?: string | null
          email: string
          id?: string
          name: string
          password: string
        }
        Update: {
          deleted_at?: string | null
          email?: string
          id?: string
          name?: string
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      sales_sum_last_7_days: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "superadmin" | "owner" | "employee" | "user"
      plan_type: "basic" | "premium"
      profile_role: "superadmin" | "admin" | "user"
      sale_status: "draft" | "final"
      user_role: "superadmin" | "owner" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "superadmin", "owner", "employee", "user"],
      plan_type: ["basic", "premium"],
      profile_role: ["superadmin", "admin", "user"],
      sale_status: ["draft", "final"],
      user_role: ["superadmin", "owner", "employee"],
    },
  },
} as const
