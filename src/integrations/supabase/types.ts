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
          published_at: string | null
          published_url: string | null
          published_url_source: string | null
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
          published_at?: string | null
          published_url?: string | null
          published_url_source?: string | null
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
          published_at?: string | null
          published_url?: string | null
          published_url_source?: string | null
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
      exchange_blocks: {
        Row: {
          created_at: string
          domain: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          reason?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      exchange_credit_accounts: {
        Row: {
          balance: number
          created_at: string
          escrowed: number
          id: string
          lifetime_earned: number
          lifetime_spent: number
          period_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          escrowed?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          period_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          escrowed?: number
          id?: string
          lifetime_earned?: number
          lifetime_spent?: number
          period_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exchange_ledger: {
        Row: {
          balance_after: number
          created_at: string
          credits: number
          id: string
          kind: Database["public"]["Enums"]["exchange_ledger_kind"]
          note: string
          placement_id: string | null
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          credits: number
          id?: string
          kind: Database["public"]["Enums"]["exchange_ledger_kind"]
          note?: string
          placement_id?: string | null
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          credits?: number
          id?: string
          kind?: Database["public"]["Enums"]["exchange_ledger_kind"]
          note?: string
          placement_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_ledger_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "exchange_placements"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_link_checks: {
        Row: {
          checked_at: string
          detail: string
          http_status: number | null
          id: string
          outcome: string
          placement_id: string
          rel_value: string | null
          url: string
        }
        Insert: {
          checked_at?: string
          detail?: string
          http_status?: number | null
          id?: string
          outcome: string
          placement_id: string
          rel_value?: string | null
          url?: string
        }
        Update: {
          checked_at?: string
          detail?: string
          http_status?: number | null
          id?: string
          outcome?: string
          placement_id?: string
          rel_value?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_link_checks_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "exchange_placements"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_placements: {
        Row: {
          anchor_used: string
          consecutive_failures: number
          end_reason: string | null
          ended_at: string | null
          escrow_credits: number
          expires_at: string
          host_blog_id: string | null
          host_site_id: string
          host_url: string | null
          host_url_source: string | null
          host_user_id: string
          id: string
          last_checked_at: string | null
          live_at: string | null
          match_score: number | null
          placed_at: string | null
          requester_site_id: string
          requester_user_id: string
          reserved_at: string
          status: Database["public"]["Enums"]["exchange_placement_status"]
          target_id: string
          target_url: string
        }
        Insert: {
          anchor_used: string
          consecutive_failures?: number
          end_reason?: string | null
          ended_at?: string | null
          escrow_credits?: number
          expires_at?: string
          host_blog_id?: string | null
          host_site_id: string
          host_url?: string | null
          host_url_source?: string | null
          host_user_id: string
          id?: string
          last_checked_at?: string | null
          live_at?: string | null
          match_score?: number | null
          placed_at?: string | null
          requester_site_id: string
          requester_user_id: string
          reserved_at?: string
          status?: Database["public"]["Enums"]["exchange_placement_status"]
          target_id: string
          target_url: string
        }
        Update: {
          anchor_used?: string
          consecutive_failures?: number
          end_reason?: string | null
          ended_at?: string | null
          escrow_credits?: number
          expires_at?: string
          host_blog_id?: string | null
          host_site_id?: string
          host_url?: string | null
          host_url_source?: string | null
          host_user_id?: string
          id?: string
          last_checked_at?: string | null
          live_at?: string | null
          match_score?: number | null
          placed_at?: string | null
          requester_site_id?: string
          requester_user_id?: string
          reserved_at?: string
          status?: Database["public"]["Enums"]["exchange_placement_status"]
          target_id?: string
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_placements_host_blog_id_fkey"
            columns: ["host_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_placements_host_site_id_fkey"
            columns: ["host_site_id"]
            isOneToOne: false
            referencedRelation: "exchange_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_placements_requester_site_id_fkey"
            columns: ["requester_site_id"]
            isOneToOne: false
            referencedRelation: "exchange_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_placements_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "exchange_targets"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_sites: {
        Row: {
          authority_score: number
          blocked_categories: string[]
          created_at: string
          domain: string
          id: string
          is_house: boolean
          live_hosted_count: number
          lost_hosted_count: number
          max_links_per_article: number
          max_links_per_period: number
          niche: string | null
          opted_in: boolean
          paid_active: boolean
          paid_checked_at: string | null
          referred_by_site_id: string | null
          reputation: number
          status: Database["public"]["Enums"]["exchange_site_status"]
          tier: number
          topic_tags: string[]
          updated_at: string
          user_id: string
          verified_at: string | null
          verify_attempts: number
          verify_method:
            | Database["public"]["Enums"]["exchange_verify_method"]
            | null
          verify_token: string
        }
        Insert: {
          authority_score?: number
          blocked_categories?: string[]
          created_at?: string
          domain: string
          id?: string
          is_house?: boolean
          live_hosted_count?: number
          lost_hosted_count?: number
          max_links_per_article?: number
          max_links_per_period?: number
          niche?: string | null
          opted_in?: boolean
          paid_active?: boolean
          paid_checked_at?: string | null
          referred_by_site_id?: string | null
          reputation?: number
          status?: Database["public"]["Enums"]["exchange_site_status"]
          tier?: number
          topic_tags?: string[]
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verify_attempts?: number
          verify_method?:
            | Database["public"]["Enums"]["exchange_verify_method"]
            | null
          verify_token?: string
        }
        Update: {
          authority_score?: number
          blocked_categories?: string[]
          created_at?: string
          domain?: string
          id?: string
          is_house?: boolean
          live_hosted_count?: number
          lost_hosted_count?: number
          max_links_per_article?: number
          max_links_per_period?: number
          niche?: string | null
          opted_in?: boolean
          paid_active?: boolean
          paid_checked_at?: string | null
          referred_by_site_id?: string | null
          reputation?: number
          status?: Database["public"]["Enums"]["exchange_site_status"]
          tier?: number
          topic_tags?: string[]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verify_attempts?: number
          verify_method?:
            | Database["public"]["Enums"]["exchange_verify_method"]
            | null
          verify_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_sites_referred_by_site_id_fkey"
            columns: ["referred_by_site_id"]
            isOneToOne: false
            referencedRelation: "exchange_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_targets: {
        Row: {
          active: boolean
          anchors: string[]
          created_at: string
          id: string
          last_placed_at: string | null
          live_count: number
          max_new_links_per_month: number
          priority: number
          queued_since: string
          site_id: string
          topic_tags: string[]
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          active?: boolean
          anchors: string[]
          created_at?: string
          id?: string
          last_placed_at?: string | null
          live_count?: number
          max_new_links_per_month?: number
          priority?: number
          queued_since?: string
          site_id: string
          topic_tags?: string[]
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          active?: boolean
          anchors?: string[]
          created_at?: string
          id?: string
          last_placed_at?: string | null
          live_count?: number
          max_new_links_per_month?: number
          priority?: number
          queued_since?: string
          site_id?: string
          topic_tags?: string[]
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_targets_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "exchange_sites"
            referencedColumns: ["id"]
          },
        ]
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
      reddit_credit_accounts: {
        Row: {
          balance: number
          created_at: string
          id: string
          lifetime_spent: number
          period_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_spent?: number
          period_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          lifetime_spent?: number
          period_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reddit_drafts: {
        Row: {
          body: string
          compliance: Json
          compliance_pass: boolean
          created_at: string
          credits_spent: number
          edited_body: string | null
          id: string
          model: string
          opportunity_id: string
          regen_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          compliance?: Json
          compliance_pass?: boolean
          created_at?: string
          credits_spent?: number
          edited_body?: string | null
          id?: string
          model?: string
          opportunity_id: string
          regen_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          compliance?: Json
          compliance_pass?: boolean
          created_at?: string
          credits_spent?: number
          edited_body?: string | null
          id?: string
          model?: string
          opportunity_id?: string
          regen_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_drafts_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "reddit_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_ledger: {
        Row: {
          balance_after: number
          created_at: string
          credits: number
          draft_id: string | null
          id: string
          kind: Database["public"]["Enums"]["reddit_ledger_kind"]
          note: string
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          credits: number
          draft_id?: string | null
          id?: string
          kind: Database["public"]["Enums"]["reddit_ledger_kind"]
          note?: string
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          credits?: number
          draft_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["reddit_ledger_kind"]
          note?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_ledger_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "reddit_drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_opportunities: {
        Row: {
          blocked_reason: string | null
          breakdown: Json
          channel: string
          dismiss_reason: string
          first_seen_at: string
          id: string
          last_scored_at: string
          matched_keyword: string
          score: number
          status: Database["public"]["Enums"]["reddit_opportunity_status"]
          sweep_id: string | null
          thread_id: string
          user_id: string
        }
        Insert: {
          blocked_reason?: string | null
          breakdown?: Json
          channel?: string
          dismiss_reason?: string
          first_seen_at?: string
          id?: string
          last_scored_at?: string
          matched_keyword?: string
          score?: number
          status?: Database["public"]["Enums"]["reddit_opportunity_status"]
          sweep_id?: string | null
          thread_id: string
          user_id: string
        }
        Update: {
          blocked_reason?: string | null
          breakdown?: Json
          channel?: string
          dismiss_reason?: string
          first_seen_at?: string
          id?: string
          last_scored_at?: string
          matched_keyword?: string
          score?: number
          status?: Database["public"]["Enums"]["reddit_opportunity_status"]
          sweep_id?: string | null
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_opportunities_sweep_id_fkey"
            columns: ["sweep_id"]
            isOneToOne: false
            referencedRelation: "reddit_sweeps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_opportunities_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "reddit_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_replies: {
        Row: {
          confirmed_at: string | null
          consecutive_failures: number
          draft_id: string | null
          id: string
          last_checked_at: string | null
          opportunity_id: string
          permalink: string | null
          posted_at: string
          reddit_comment_id: string | null
          removed_at: string | null
          score: number | null
          status: Database["public"]["Enums"]["reddit_reply_status"]
          thread_id: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          consecutive_failures?: number
          draft_id?: string | null
          id?: string
          last_checked_at?: string | null
          opportunity_id: string
          permalink?: string | null
          posted_at?: string
          reddit_comment_id?: string | null
          removed_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["reddit_reply_status"]
          thread_id: string
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          consecutive_failures?: number
          draft_id?: string | null
          id?: string
          last_checked_at?: string | null
          opportunity_id?: string
          permalink?: string | null
          posted_at?: string
          reddit_comment_id?: string | null
          removed_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["reddit_reply_status"]
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_replies_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "reddit_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_replies_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "reddit_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reddit_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "reddit_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_reply_checks: {
        Row: {
          checked_at: string
          detail: string
          id: string
          outcome: string
          reply_id: string
          score: number | null
        }
        Insert: {
          checked_at?: string
          detail?: string
          id?: string
          outcome: string
          reply_id: string
          score?: number | null
        }
        Update: {
          checked_at?: string
          detail?: string
          id?: string
          outcome?: string
          reply_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reddit_reply_checks_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "reddit_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_settings: {
        Row: {
          allow_subreddits: string[]
          created_at: string
          deny_subreddits: string[]
          disclosure_line: string
          enabled: boolean
          keywords_per_sweep: number
          last_sweep_at: string | null
          max_links_per_reply: number
          niche: string | null
          paid_active: boolean
          paid_checked_at: string | null
          sweep_count: number
          sweep_enabled: boolean
          tone: string
          topic_tags: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_subreddits?: string[]
          created_at?: string
          deny_subreddits?: string[]
          disclosure_line?: string
          enabled?: boolean
          keywords_per_sweep?: number
          last_sweep_at?: string | null
          max_links_per_reply?: number
          niche?: string | null
          paid_active?: boolean
          paid_checked_at?: string | null
          sweep_count?: number
          sweep_enabled?: boolean
          tone?: string
          topic_tags?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_subreddits?: string[]
          created_at?: string
          deny_subreddits?: string[]
          disclosure_line?: string
          enabled?: boolean
          keywords_per_sweep?: number
          last_sweep_at?: string | null
          max_links_per_reply?: number
          niche?: string | null
          paid_active?: boolean
          paid_checked_at?: string | null
          sweep_count?: number
          sweep_enabled?: boolean
          tone?: string
          topic_tags?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reddit_subreddits: {
        Row: {
          allows_self_promo: boolean | null
          created_at: string
          id: string
          name: string
          over_18: boolean
          promo_banned: boolean
          public_description: string
          rules: Json
          rules_checked_at: string | null
          rules_source: string
          subscribers: number | null
          title: string
          topic_tags: string[]
          updated_at: string
        }
        Insert: {
          allows_self_promo?: boolean | null
          created_at?: string
          id?: string
          name: string
          over_18?: boolean
          promo_banned?: boolean
          public_description?: string
          rules?: Json
          rules_checked_at?: string | null
          rules_source?: string
          subscribers?: number | null
          title?: string
          topic_tags?: string[]
          updated_at?: string
        }
        Update: {
          allows_self_promo?: boolean | null
          created_at?: string
          id?: string
          name?: string
          over_18?: boolean
          promo_banned?: boolean
          public_description?: string
          rules?: Json
          rules_checked_at?: string | null
          rules_source?: string
          subscribers?: number | null
          title?: string
          topic_tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      reddit_sweeps: {
        Row: {
          ai_checks: number
          cost_usd: number
          error: string
          finished_at: string | null
          id: string
          keywords_used: string[]
          opportunities_created: number
          reddit_queries: number
          serp_queries: number
          started_at: string
          status: Database["public"]["Enums"]["reddit_sweep_status"]
          threads_seen: number
          trigger: string
          user_id: string
        }
        Insert: {
          ai_checks?: number
          cost_usd?: number
          error?: string
          finished_at?: string | null
          id?: string
          keywords_used?: string[]
          opportunities_created?: number
          reddit_queries?: number
          serp_queries?: number
          started_at?: string
          status?: Database["public"]["Enums"]["reddit_sweep_status"]
          threads_seen?: number
          trigger?: string
          user_id: string
        }
        Update: {
          ai_checks?: number
          cost_usd?: number
          error?: string
          finished_at?: string | null
          id?: string
          keywords_used?: string[]
          opportunities_created?: number
          reddit_queries?: number
          serp_queries?: number
          started_at?: string
          status?: Database["public"]["Enums"]["reddit_sweep_status"]
          threads_seen?: number
          trigger?: string
          user_id?: string
        }
        Relationships: []
      }
      reddit_thread_ai_citations: {
        Row: {
          checked_at: string
          cited: boolean
          engine: Database["public"]["Enums"]["reddit_ai_engine"]
          id: string
          query: string
          snippet: string
          thread_id: string
        }
        Insert: {
          checked_at?: string
          cited: boolean
          engine: Database["public"]["Enums"]["reddit_ai_engine"]
          id?: string
          query: string
          snippet?: string
          thread_id: string
        }
        Update: {
          checked_at?: string
          cited?: boolean
          engine?: Database["public"]["Enums"]["reddit_ai_engine"]
          id?: string
          query?: string
          snippet?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_thread_ai_citations_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "reddit_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_thread_serp: {
        Row: {
          checked_at: string
          country: string
          device: string
          id: string
          position: number
          query: string
          thread_id: string
        }
        Insert: {
          checked_at?: string
          country?: string
          device?: string
          id?: string
          position: number
          query: string
          thread_id: string
        }
        Update: {
          checked_at?: string
          country?: string
          device?: string
          id?: string
          position?: number
          query?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reddit_thread_serp_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "reddit_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_thread_stats: {
        Row: {
          checked_at: string
          id: string
          num_comments: number
          thread_id: string
          up_votes: number
        }
        Insert: {
          checked_at?: string
          id?: string
          num_comments: number
          thread_id: string
          up_votes: number
        }
        Update: {
          checked_at?: string
          id?: string
          num_comments?: number
          thread_id?: string
          up_votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "reddit_thread_stats_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "reddit_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      reddit_threads: {
        Row: {
          author: string
          body: string
          created_at: string
          hydrated_at: string | null
          hydration_source: string
          id: string
          is_archived: boolean | null
          is_locked: boolean
          is_removed: boolean
          num_comments: number
          permalink: string
          posted_at: string | null
          reddit_id: string
          subreddit: string
          title: string
          top_comments: Json
          up_votes: number
          updated_at: string
        }
        Insert: {
          author?: string
          body?: string
          created_at?: string
          hydrated_at?: string | null
          hydration_source?: string
          id?: string
          is_archived?: boolean | null
          is_locked?: boolean
          is_removed?: boolean
          num_comments?: number
          permalink: string
          posted_at?: string | null
          reddit_id: string
          subreddit: string
          title?: string
          top_comments?: Json
          up_votes?: number
          updated_at?: string
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          hydrated_at?: string | null
          hydration_source?: string
          id?: string
          is_archived?: boolean | null
          is_locked?: boolean
          is_removed?: boolean
          num_comments?: number
          permalink?: string
          posted_at?: string | null
          reddit_id?: string
          subreddit?: string
          title?: string
          top_comments?: Json
          up_votes?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          activated_at: string | null
          cancel_at_period_end: boolean | null
          card_check_error: string | null
          card_checked_at: string | null
          card_verified: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          past_due_since: string | null
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          cancel_at_period_end?: boolean | null
          card_check_error?: string | null
          card_checked_at?: string | null
          card_verified?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          past_due_since?: string | null
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          cancel_at_period_end?: boolean | null
          card_check_error?: string | null
          card_checked_at?: string | null
          card_verified?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          past_due_since?: string | null
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
      tool_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string | null
          tool: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          role?: string | null
          tool?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          tool?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_article_credit: { Args: { _user_id: string }; Returns: boolean }
      exchange_clawback_placement: {
        Args: { _placement_id: string; _reason: string }
        Returns: boolean
      }
      exchange_grant_credits: {
        Args: { _credits: number; _period_end: string; _user_id: string }
        Returns: number
      }
      exchange_mark_placed: {
        Args: { _host_blog_id: string; _placement_id: string }
        Returns: boolean
      }
      exchange_refund_placement: {
        Args: {
          _placement_id: string
          _reason: string
          _status: Database["public"]["Enums"]["exchange_placement_status"]
        }
        Returns: boolean
      }
      exchange_reserve_placement: {
        Args: {
          _anchor: string
          _credits: number
          _host_blog_id: string
          _host_site_id: string
          _host_user_id: string
          _match_score?: number
          _target_id: string
        }
        Returns: string
      }
      exchange_set_paid: {
        Args: { _paid: boolean; _user_id: string }
        Returns: undefined
      }
      exchange_settle_placement: {
        Args: { _host_url: string; _placement_id: string }
        Returns: boolean
      }
      hit_rate_limit: {
        Args: { p_bucket: string; p_window_start: string }
        Returns: number
      }
      reddit_apply_reply_check: {
        Args: {
          _detail: string
          _outcome: string
          _reply_id: string
          _score: number
        }
        Returns: Database["public"]["Enums"]["reddit_reply_status"]
      }
      reddit_grant_credits: {
        Args: { _credits: number; _period_end: string; _user_id: string }
        Returns: number
      }
      reddit_record_reply: {
        Args: {
          _comment_id: string
          _draft_id: string
          _opportunity_id: string
          _permalink: string
          _user_id: string
        }
        Returns: string
      }
      reddit_refund_credit: {
        Args: {
          _amount: number
          _draft_id: string
          _note: string
          _user_id: string
        }
        Returns: number
      }
      reddit_set_paid: {
        Args: { _paid: boolean; _user_id: string }
        Returns: undefined
      }
      reddit_spend_credit: {
        Args: {
          _amount: number
          _draft_id: string
          _note: string
          _user_id: string
        }
        Returns: number
      }
      reddit_start_sweep: {
        Args: {
          _keywords: string[]
          _min_interval: string
          _trigger: string
          _user_id: string
        }
        Returns: Json
      }
      reddit_upsert_opportunity: {
        Args: {
          _blocked_reason: string
          _breakdown: Json
          _channel: string
          _keyword: string
          _score: number
          _sweep_id: string
          _thread_id: string
          _user_id: string
        }
        Returns: Json
      }
      reddit_upsert_thread: { Args: { _payload: Json }; Returns: string }
      refund_article_credit: { Args: { _user_id: string }; Returns: undefined }
      reset_article_credits:
        | {
            Args: { _period_end: string; _user_id: string }
            Returns: undefined
          }
        | {
            Args: { _credits: number; _period_end: string; _user_id: string }
            Returns: undefined
          }
    }
    Enums: {
      blog_status: "opportunity" | "scheduled" | "generating" | "finished"
      exchange_ledger_kind:
        | "grant"
        | "escrow"
        | "settle_spend"
        | "settle_earn"
        | "refund"
        | "clawback"
        | "bonus"
        | "adjust"
      exchange_placement_status:
        | "reserved"
        | "placed"
        | "live"
        | "lost"
        | "expired"
        | "cancelled"
      exchange_site_status:
        | "unverified"
        | "verifying"
        | "verified"
        | "suspended"
      exchange_verify_method: "dns_txt" | "meta_tag" | "well_known"
      keyword_source: "library" | "discovered"
      reddit_ai_engine:
        | "chatgpt"
        | "perplexity"
        | "gemini"
        | "google_ai_overview"
      reddit_ledger_kind: "grant" | "spend" | "refund" | "bonus" | "adjust"
      reddit_opportunity_status:
        | "new"
        | "saved"
        | "drafted"
        | "posted"
        | "dismissed"
        | "dead"
        | "stale"
      reddit_reply_status:
        | "claimed"
        | "posted"
        | "confirmed"
        | "removed"
        | "not_found"
      reddit_sweep_status: "running" | "ok" | "partial" | "failed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      exchange_ledger_kind: [
        "grant",
        "escrow",
        "settle_spend",
        "settle_earn",
        "refund",
        "clawback",
        "bonus",
        "adjust",
      ],
      exchange_placement_status: [
        "reserved",
        "placed",
        "live",
        "lost",
        "expired",
        "cancelled",
      ],
      exchange_site_status: [
        "unverified",
        "verifying",
        "verified",
        "suspended",
      ],
      exchange_verify_method: ["dns_txt", "meta_tag", "well_known"],
      keyword_source: ["library", "discovered"],
      reddit_ai_engine: [
        "chatgpt",
        "perplexity",
        "gemini",
        "google_ai_overview",
      ],
      reddit_ledger_kind: ["grant", "spend", "refund", "bonus", "adjust"],
      reddit_opportunity_status: [
        "new",
        "saved",
        "drafted",
        "posted",
        "dismissed",
        "dead",
        "stale",
      ],
      reddit_reply_status: [
        "claimed",
        "posted",
        "confirmed",
        "removed",
        "not_found",
      ],
      reddit_sweep_status: ["running", "ok", "partial", "failed"],
    },
  },
} as const
