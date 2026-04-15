export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          club_id: number | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          address: string
          club_id?: number | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          address?: string
          club_id?: number | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      club_groups: {
        Row: {
          address_id: number
          club_id: number
          created_at: string
          day: string
          end_time: string
          id: number
          level: number
          max_occupancy: number
          once_in_number_of_weeks: number
          start_time: string
        }
        Insert: {
          address_id: number
          club_id: number
          created_at?: string
          day: string
          end_time: string
          id?: number
          level?: number
          max_occupancy: number
          once_in_number_of_weeks?: number
          start_time: string
        }
        Update: {
          address_id?: number
          club_id?: number
          created_at?: string
          day?: string
          end_time?: string
          id?: number
          level?: number
          max_occupancy?: number
          once_in_number_of_weeks?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_group_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_group_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category_id: number | null
          contact_person: string
          created_at: string
          email: string
          id: number
          image: string | null
          name: string
          phone: string
        }
        Insert: {
          category_id?: number | null
          contact_person: string
          created_at?: string
          email: string
          id?: number
          image?: string | null
          name: string
          phone: string
        }
        Update: {
          category_id?: number | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: number
          image?: string | null
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      group_trainings: {
        Row: {
          club_id: number | null
          created_at: string
          end_timestamp: string
          group_id: number | null
          id: number
          level: number | null
          max_occupancy: number
          start_timestamp: string
        }
        Insert: {
          club_id?: number | null
          created_at?: string
          end_timestamp: string
          group_id?: number | null
          id?: number
          level?: number | null
          max_occupancy: number
          start_timestamp: string
        }
        Update: {
          club_id?: number | null
          created_at?: string
          end_timestamp?: string
          group_id?: number | null
          id?: number
          level?: number | null
          max_occupancy?: number
          start_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_trainings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_trainings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      history_events: {
        Row: {
          created_at: string
          event: string
          event_type: string
          from_id: number | null
          group_id: number | null
          id: number
          to_id: number | null
          training_id: number | null
        }
        Insert: {
          created_at?: string
          event: string
          event_type: string
          from_id?: number | null
          group_id?: number | null
          id?: number
          to_id?: number | null
          training_id?: number | null
        }
        Update: {
          created_at?: string
          event?: string
          event_type?: string
          from_id?: number | null
          group_id?: number | null
          id?: number
          to_id?: number | null
          training_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "history_events_from_id_fkey"
            columns: ["from_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_events_to_id_fkey"
            columns: ["to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_events_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "group_trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      join_group_requests: {
        Row: {
          club_group_id: number
          comments: string | null
          created_at: string
          id: number
          is_accepted: boolean
          is_rejected: boolean
          user_id: number
        }
        Insert: {
          club_group_id: number
          comments?: string | null
          created_at?: string
          id?: number
          is_accepted?: boolean
          is_rejected?: boolean
          user_id: number
        }
        Update: {
          club_group_id?: number
          comments?: string | null
          created_at?: string
          id?: number
          is_accepted?: boolean
          is_rejected?: boolean
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "join_group_requests_group_id_fkey"
            columns: ["club_group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_group_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      join_training_requests: {
        Row: {
          comments: string | null
          created_at: string
          id: number
          is_accepted: boolean
          is_rejected: boolean
          training_id: number
          user_id: number
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: number
          is_accepted?: boolean
          is_rejected?: boolean
          training_id: number
          user_id: number
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: number
          is_accepted?: boolean
          is_rejected?: boolean
          training_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "join_training_requests_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "group_trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_training_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          notice: string
          training_id: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          group_id?: number | null
          id?: number
          notice: string
          training_id?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          notice?: string
          training_id?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "group_trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_read: boolean | null
          message: string | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_read?: boolean | null
          message?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          id: number
          is_used: boolean
          is_used_time: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          is_used?: boolean
          is_used_time?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          is_used?: boolean
          is_used_time?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          id: number
          role: string
        }
        Insert: {
          created_at?: string
          id?: number
          role?: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: string
        }
        Relationships: []
      }
      trainers_groups: {
        Row: {
          club_group_id: number
          created_at: string
          id: number
          trainer_id: number
        }
        Insert: {
          club_group_id: number
          created_at?: string
          id?: number
          trainer_id: number
        }
        Update: {
          club_group_id?: number
          created_at?: string
          id?: number
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainers_groups_club_group_id_fkey1"
            columns: ["club_group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainers_groups_user_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers_trainings: {
        Row: {
          created_at: string
          id: number
          trainer_id: number
          training_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          trainer_id: number
          training_id: number
        }
        Update: {
          created_at?: string
          id?: number
          trainer_id?: number
          training_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainers_trainings_training_id_fkey1"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "group_trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainers_trainings_user_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          club_id: number | null
          created_at: string
          email: string
          first_name: string
          id: number
          is_club_admin: boolean | null
          is_trainer: boolean
          last_name: string
          phone: string
          profile_image: string | null
          user_id: string
        }
        Insert: {
          club_id?: number | null
          created_at?: string
          email: string
          first_name: string
          id?: number
          is_club_admin?: boolean | null
          is_trainer?: boolean
          last_name: string
          phone: string
          profile_image?: string | null
          user_id: string
        }
        Update: {
          club_id?: number | null
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          is_club_admin?: boolean | null
          is_trainer?: boolean
          last_name?: string
          phone?: string
          profile_image?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      users_groups: {
        Row: {
          club_group_id: number
          created_at: string
          id: number
          is_active: boolean
          updated_at: string | null
          user_id: number
        }
        Insert: {
          club_group_id: number
          created_at?: string
          id?: number
          is_active?: boolean
          updated_at?: string | null
          user_id: number
        }
        Update: {
          club_group_id?: number
          created_at?: string
          id?: number
          is_active?: boolean
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainers_groups_club_group_id_fkey"
            columns: ["club_group_id"]
            isOneToOne: false
            referencedRelation: "club_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainers_groups_trainer_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_trainings: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          marked_absent: boolean | null
          marked_absent_timestamp: string | null
          promo_code_id: number | null
          training_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          marked_absent?: boolean | null
          marked_absent_timestamp?: string | null
          promo_code_id?: number | null
          training_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          marked_absent?: boolean | null
          marked_absent_timestamp?: string | null
          promo_code_id?: number | null
          training_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "trainers_trainings_trainer_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainers_trainings_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "group_trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_trainings_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_join_group_request: {
        Args: {
          request_id: number
        }
        Returns: number
      }
      accept_join_training_request: {
        Args: {
          request_id: number
        }
        Returns: number
      }
      create_group_trainings: {
        Args: {
          _group_id: number
          _club_id: number
          _from_date: string
          _till_date: string
          _start_time: string
          _end_time: string
          _max_occupancy: number
          _level: number
          _once_in_number_of_weeks: number
        }
        Returns: undefined
      }
      create_trainings: {
        Args: {
          _group_id: number
          _from_date: string
          _till_date: string
        }
        Returns: undefined
      }
      create_trainings_batch: {
        Args: {
          _trainings: Json
        }
        Returns: undefined
      }
      refresh_trainings_with_users: {
        Args: {
          _group_id: number
          _from_date: string
          _till_date: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

