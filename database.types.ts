export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string;
          club_id: number | null;
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          address: string;
          club_id?: number | null;
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          address?: string;
          club_id?: number | null;
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      club_groups: {
        Row: {
          address_id: number;
          club_id: number;
          created_at: string;
          day: string;
          end_time: string;
          id: number;
          max_occupancy: number;
          once_in_number_of_weeks: number;
          start_time: string;
        };
        Insert: {
          address_id: number;
          club_id: number;
          created_at?: string;
          day: string;
          end_time: string;
          id?: number;
          max_occupancy: number;
          once_in_number_of_weeks?: number;
          start_time: string;
        };
        Update: {
          address_id?: number;
          club_id?: number;
          created_at?: string;
          day?: string;
          end_time?: string;
          id?: number;
          max_occupancy?: number;
          once_in_number_of_weeks?: number;
          start_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_group_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_group_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      clubs: {
        Row: {
          category_id: number | null;
          contact_person: string;
          created_at: string;
          email: string;
          id: number;
          image: string | null;
          name: string;
          phone: string;
        };
        Insert: {
          category_id?: number | null;
          contact_person: string;
          created_at?: string;
          email: string;
          id?: number;
          image?: string | null;
          name: string;
          phone: string;
        };
        Update: {
          category_id?: number | null;
          contact_person?: string;
          created_at?: string;
          email?: string;
          id?: number;
          image?: string | null;
          name?: string;
          phone?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clubs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      group_trainings: {
        Row: {
          club_id: number | null;
          created_at: string;
          end_timestamp: string;
          group_id: number | null;
          id: number;
          max_occupancy: number;
          start_timestamp: string;
        };
        Insert: {
          club_id?: number | null;
          created_at?: string;
          end_timestamp: string;
          group_id?: number | null;
          id?: number;
          max_occupancy: number;
          start_timestamp: string;
        };
        Update: {
          club_id?: number | null;
          created_at?: string;
          end_timestamp?: string;
          group_id?: number | null;
          id?: number;
          max_occupancy?: number;
          start_timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_trainings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_trainings_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      history_events: {
        Row: {
          created_at: string;
          event: string;
          group_id: number;
          id: number;
          training_id: number;
        };
        Insert: {
          created_at?: string;
          event: string;
          group_id: number;
          id?: number;
          training_id: number;
        };
        Update: {
          created_at?: string;
          event?: string;
          group_id?: number;
          id?: number;
          training_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "history_events_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "history_events_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "group_trainings";
            referencedColumns: ["id"];
          },
        ];
      };
      join_group_requests: {
        Row: {
          comments: string | null;
          created_at: string;
          group_id: number;
          id: number;
          is_accepted: boolean;
          is_rejected: boolean;
          user_id: number;
        };
        Insert: {
          comments?: string | null;
          created_at?: string;
          group_id: number;
          id?: number;
          is_accepted?: boolean;
          is_rejected?: boolean;
          user_id: number;
        };
        Update: {
          comments?: string | null;
          created_at?: string;
          group_id?: number;
          id?: number;
          is_accepted?: boolean;
          is_rejected?: boolean;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "join_group_requests_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "join_group_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      join_training_requests: {
        Row: {
          comments: string | null;
          created_at: string;
          id: number;
          is_accepted: boolean;
          is_rejected: boolean;
          training_id: number;
          user_id: number;
        };
        Insert: {
          comments?: string | null;
          created_at?: string;
          id?: number;
          is_accepted?: boolean;
          is_rejected?: boolean;
          training_id: number;
          user_id: number;
        };
        Update: {
          comments?: string | null;
          created_at?: string;
          id?: number;
          is_accepted?: boolean;
          is_rejected?: boolean;
          training_id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "join_training_requests_group_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "join_training_requests_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "group_trainings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "join_training_requests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notices: {
        Row: {
          created_at: string;
          group_id: number | null;
          id: number;
          notice: string;
          training_id: number | null;
        };
        Insert: {
          created_at?: string;
          group_id?: number | null;
          id?: number;
          notice: string;
          training_id?: number | null;
        };
        Update: {
          created_at?: string;
          group_id?: number | null;
          id?: number;
          notice?: string;
          training_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "notices_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notices_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "group_trainings";
            referencedColumns: ["id"];
          },
        ];
      };
      promo_codes: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          is_used: boolean;
          is_used_time: string | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          is_used?: boolean;
          is_used_time?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          is_used?: boolean;
          is_used_time?: string | null;
        };
        Relationships: [];
      };
      trainers_groups: {
        Row: {
          club_group_id: number;
          created_at: string;
          id: number;
          trainer_id: number;
        };
        Insert: {
          club_group_id: number;
          created_at?: string;
          id?: number;
          trainer_id: number;
        };
        Update: {
          club_group_id?: number;
          created_at?: string;
          id?: number;
          trainer_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trainers_groups_club_group_id_fkey1";
            columns: ["club_group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainers_groups_user_id_fkey";
            columns: ["trainer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      trainers_trainings: {
        Row: {
          created_at: string;
          id: number;
          trainer_id: number;
          training_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          trainer_id: number;
          training_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          trainer_id?: number;
          training_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trainers_trainings_training_id_fkey1";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "group_trainings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainers_trainings_user_id_fkey";
            columns: ["trainer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          club_id: number | null;
          created_at: string;
          email: string;
          first_name: string;
          id: number;
          is_trainer: boolean;
          last_name: string;
          phone: string;
          profile_image: string | null;
          userId: string;
        };
        Insert: {
          club_id?: number | null;
          created_at?: string;
          email: string;
          first_name: string;
          id?: number;
          is_trainer?: boolean;
          last_name: string;
          phone: string;
          profile_image?: string | null;
          userId: string;
        };
        Update: {
          club_id?: number | null;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: number;
          is_trainer?: boolean;
          last_name?: string;
          phone?: string;
          profile_image?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      users_groups: {
        Row: {
          club_group_id: number;
          created_at: string;
          id: number;
          user_id: number;
        };
        Insert: {
          club_group_id: number;
          created_at?: string;
          id?: number;
          user_id: number;
        };
        Update: {
          club_group_id?: number;
          created_at?: string;
          id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trainers_groups_club_group_id_fkey";
            columns: ["club_group_id"];
            isOneToOne: false;
            referencedRelation: "club_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainers_groups_trainer_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users_trainings: {
        Row: {
          created_at: string;
          id: number;
          marked_absent: boolean | null;
          marked_absent_timestamp: string | null;
          promo_code_id: number | null;
          training_id: number;
          user_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          marked_absent?: boolean | null;
          marked_absent_timestamp?: string | null;
          promo_code_id?: number | null;
          training_id: number;
          user_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          marked_absent?: boolean | null;
          marked_absent_timestamp?: string | null;
          promo_code_id?: number | null;
          training_id?: number;
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "trainers_trainings_trainer_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trainers_trainings_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "group_trainings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "users_trainings_promo_code_id_fkey";
            columns: ["promo_code_id"];
            isOneToOne: false;
            referencedRelation: "promo_codes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof (
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (
    & DefaultSchema["Tables"]
    & DefaultSchema["Views"]
  ) ? (
      & DefaultSchema["Tables"]
      & DefaultSchema["Views"]
    )[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Insert: infer I;
  } ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][
    TableName
  ] extends {
    Update: infer U;
  } ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
