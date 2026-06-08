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
        Update: Partial<Database["public"]["Tables"]["scam_reports"]["Insert"]>;
      };
      url_checks: {
        Row: {
          id: string;
          created_at: string;
          url: string;
          result: "SAFE" | "WARNING" | "DANGER";
          reasons: string[];
          check_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          url: string;
          result: "SAFE" | "WARNING" | "DANGER";
          reasons: string[];
          check_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["url_checks"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
