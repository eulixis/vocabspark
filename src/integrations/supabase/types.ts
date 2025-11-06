export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          dialogue: Json
          difficulty: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          dialogue: Json
          difficulty: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          dialogue?: Json
          difficulty?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      daily_content: {
        Row: {
          content_date: string
          content_ids: string[]
          content_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_date: string
          content_ids: string[]
          content_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_date?: string
          content_ids?: string[]
          content_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          created_at: string | null
          date: string
          games_played_today: number | null
          id: string
          phrasal_verbs_learned_today: number | null
          updated_at: string | null
          user_id: string
          words_learned_today: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          games_played_today?: number | null
          id?: string
          phrasal_verbs_learned_today?: number | null
          updated_at?: string | null
          user_id: string
          words_learned_today?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          games_played_today?: number | null
          id?: string
          phrasal_verbs_learned_today?: number | null
          updated_at?: string | null
          user_id?: string
          words_learned_today?: number | null
        }
        Relationships: []
      }
      game_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: string
          game_type: string
          id: string
          options: Json
          question: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty: string
          game_type: string
          id?: string
          options: Json
          question: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: string
          game_type?: string
          id?: string
          options?: Json
          question?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          description: string
          difficulty: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          difficulty: string
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          difficulty?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      phrasal_verbs: {
        Row: {
          created_at: string | null
          difficulty: string
          example: string
          id: string
          translation: string
          verb: string
        }
        Insert: {
          created_at?: string | null
          difficulty: string
          example: string
          id?: string
          translation: string
          verb: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string
          example?: string
          id?: string
          translation?: string
          verb?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          premium_plan: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          premium_plan?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          premium_plan?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          created_at: string | null
          current_streak: number | null
          games_completed: number | null
          id: string
          level_progress: number | null
          phrasal_verbs_learned: number | null
          subscription_tier: string | null
          total_study_days: number | null
          updated_at: string | null
          user_id: string
          words_learned: number | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          games_completed?: number | null
          id?: string
          level_progress?: number | null
          phrasal_verbs_learned?: number | null
          subscription_tier?: string | null
          total_study_days?: number | null
          updated_at?: string | null
          user_id: string
          words_learned?: number | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          games_completed?: number | null
          id?: string
          level_progress?: number | null
          phrasal_verbs_learned?: number | null
          subscription_tier?: string | null
          total_study_days?: number | null
          updated_at?: string | null
          user_id?: string
          words_learned?: number | null
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          created_at: string | null
          difficulty: string
          example: string | null
          id: string
          pronunciation: string | null
          translation: string
          word: string
        }
        Insert: {
          created_at?: string | null
          difficulty: string
          example?: string | null
          id?: string
          pronunciation?: string | null
          translation: string
          word: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string
          example?: string | null
          id?: string
          pronunciation?: string | null
          translation?: string
          word?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
