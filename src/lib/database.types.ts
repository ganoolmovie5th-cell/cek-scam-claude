export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      scam_reports: {
        Row: {
          id: string;
          created_at: string;
          scam_type: string;
          target_name: string;
          platform: string;
          description: string;
          loss_amount: number | null;
          reporter_contact: string | null;
          anonymous: boolean;
          status: "pending" | "verified" | "rejected";
          risk_level: "DANGER" | "WARNING" | "SAFE";
          votes: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          scam_type: string;
          target_name: string;
          platform: string;
          description: string;
          loss_amount?: number | null;
          reporter_contact?: string | null;
          anonymous?: boolean;
          status?: "pending" | "verified" | "rejected";
          risk_level?: "DANGER" | "WARNING" | "SAFE";
          votes?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          scam_type?: string;
          target_name?: string;
          platform?: string;
          description?: string;
          loss_amount?: number | null;
          reporter_contact?: string | null;
          anonymous?: boolean;
          status?: "pending" | "verified" | "rejected";
          risk_level?: "DANGER" | "WARNING" | "SAFE";
          votes?: number;
        };
      };
      url_checks: {
        Row: {
          id: string;
          created_at: string;
          url: string;
          result: "SAFE" | "WARNING" | "DANGER";
          reasons: string[];
          check_count: number;
          vt_stats: Record<string, number> | null;
          vt_detections: Array<{ vendor: string; category: string; result: string }> | null;
          vt_categories: string[] | null;
          vt_permalink: string | null;
          total_engines: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          url: string;
          result: "SAFE" | "WARNING" | "DANGER";
          reasons: string[];
          check_count?: number;
          vt_stats?: Record<string, number> | null;
          vt_detections?: Array<{ vendor: string; category: string; result: string }> | null;
          vt_categories?: string[] | null;
          vt_permalink?: string | null;
          total_engines?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          url?: string;
          result?: "SAFE" | "WARNING" | "DANGER";
          reasons?: string[];
          check_count?: number;
          vt_stats?: Record<string, number> | null;
          vt_detections?: Array<{ vendor: string; category: string; result: string }> | null;
          vt_categories?: string[] | null;
          vt_permalink?: string | null;
          total_engines?: number | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
