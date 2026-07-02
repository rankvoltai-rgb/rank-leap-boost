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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          revoked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_hits: {
        Row: {
          bucket: string
          hits: number
          window_start: string
        }
        Insert: {
          bucket: string
          hits?: number
          window_start: string
        }
        Update: {
          bucket?: string
          hits?: number
          window_start?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          ai_signal: number
          body: string
          competition: string | null
          created_at: string
          description: string
          id: string
          keyword: string | null
          notes: string
          queue_position: number | null
          scheduled_date: string | null
          seo_score: number
          status: Database["public"]["Enums"]["blog_status"]
          tags: string[]
          title: string
          traffic_estimate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_signal?: number
          body?: string
          competition?: string | null
          created_at?: string
          description?: string
          id?: string
          keyword?: string | null
          notes?: string
          queue_position?: number | null
          scheduled_date?: string | null
          seo_score?: number
          status?: Database["public"]["Enums"]["blog_status"]
          tags?: string[]
          title: string
          traffic_estimate?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_signal?: number
          body?: string
          competition?: string | null
          created_at?: string
          description?: string
          id?: string
          keyword?: string | null
          notes?: string
          queue_position?: number | null
          scheduled_date?: string | null
          seo_score?: number
          status?: Database["public"]["Enums"]["blog_status"]
          tags?: string[]
          title?: string
          traffic_estimate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_settings: {
        Row: {
          audience: string
          autopilot_enabled: boolean
          brand_voice: string
          created_at: string
          id: string
          last_autopilot_run: string | null
          status_online: boolean
          tone: string
          updated_at: string
          user_id: string
          weekly_cadence: number
          writing_style: string
        }
        Insert: {
          audience?: string
          autopilot_enabled?: boolean
          brand_voice?: string
          created_at?: string
          id?: string
          last_autopilot_run?: string | null
          status_online?: boolean
          tone?: string
          updated_at?: string
          user_id: string
          weekly_cadence?: number
          writing_style?: string
        }
        Update: {
          audience?: string
          autopilot_enabled?: boolean
          brand_voice?: string
          created_at?: string
          id?: string
          last_autopilot_run?: string | null
          status_online?: boolean
          tone?: string
          updated_at?: string
          user_id?: string
          weekly_cadence?: number
          writing_style?: string
        }
        Relationships: []
      }
      credit_accounts: {
        Row: {
          created_at: string
          credits_total: number
          credits_used: number
          id: string
          period_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_total?: number
          credits_used?: number
          id?: string
          period_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_total?: number
          credits_used?: number
          id?: string
          period_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount_cents: number
          created_at: string
          credits: number
          id: string
          package: string
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          credits: number
          id?: string
          package: string
          status?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          credits?: number
          id?: string
          package?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      keywords: {
        Row: {
          created_at: string
          id: string
          intent: string | null
          name: string
          search_volume: number
          source: Database["public"]["Enums"]["keyword_source"]
          tag: string | null
          traffic_estimate: number
          trend: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intent?: string | null
          name: string
          search_volume?: number
          source?: Database["public"]["Enums"]["keyword_source"]
          tag?: string | null
          traffic_estimate?: number
          trend?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intent?: string | null
          name?: string
          search_volume?: number
          source?: Database["public"]["Enums"]["keyword_source"]
          tag?: string | null
          traffic_estimate?: number
          trend?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          brand_name: string | null
          created_at: string
          id: string
          product_description: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          brand_name?: string | null
          created_at?: string
          id?: string
          product_description?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          brand_name?: string | null
          created_at?: string
          id?: string
          product_description?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string
          product_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_article_credit: { Args: { _user_id: string }; Returns: boolean }
      hit_rate_limit: {
        Args: { p_bucket: string; p_window_start: string }
        Returns: number
      }
      refund_article_credit: { Args: { _user_id: string }; Returns: undefined }
      reset_article_credits: {
        Args: { _period_end: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      blog_status: "opportunity" | "scheduled" | "generating" | "finished"
      keyword_source: "library" | "discovered"
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
    Enums: {
      blog_status: ["opportunity", "scheduled", "generating", "finished"],
      keyword_source: ["library", "discovered"],
    },
  },
} as const
