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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      albumes: {
        Row: {
          created_at: string
          descripcion: string | null
          fecha_publicacion: string | null
          id: string
          jornada: string | null
          miniatura_url: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          fecha_publicacion?: string | null
          id?: string
          jornada?: string | null
          miniatura_url?: string | null
          tipo?: string
          titulo: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          fecha_publicacion?: string | null
          id?: string
          jornada?: string | null
          miniatura_url?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      contacto_config: {
        Row: {
          cobertura: string
          created_at: string
          facebook: string
          id: string
          whatsapp: string
        }
        Insert: {
          cobertura?: string
          created_at?: string
          facebook?: string
          id?: string
          whatsapp?: string
        }
        Update: {
          cobertura?: string
          created_at?: string
          facebook?: string
          id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      estadisticas: {
        Row: {
          categoria: string
          created_at: string
          id: string
          label: string
          suffix: string | null
          value: string
        }
        Insert: {
          categoria: string
          created_at?: string
          id?: string
          label: string
          suffix?: string | null
          value: string
        }
        Update: {
          categoria?: string
          created_at?: string
          id?: string
          label?: string
          suffix?: string | null
          value?: string
        }
        Relationships: []
      }
      fechas: {
        Row: {
          categoria: string | null
          created_at: string
          dia: string
          en_vivo: boolean | null
          fecha: string
          hora: string
          id: string
          local: string
          sede: string | null
          visitante: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          dia: string
          en_vivo?: boolean | null
          fecha: string
          hora: string
          id?: string
          local: string
          sede?: string | null
          visitante: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          dia?: string
          en_vivo?: boolean | null
          fecha?: string
          hora?: string
          id?: string
          local?: string
          sede?: string | null
          visitante?: string
        }
        Relationships: []
      }
      figuras_destacadas: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          equipo: string | null
          id: string
          imagen_url: string | null
          nombre: string
          orden: number
          posicion: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          equipo?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          orden?: number
          posicion?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          equipo?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          orden?: number
          posicion?: string | null
        }
        Relationships: []
      }
      galeria: {
        Row: {
          album_id: string | null
          created_at: string
          fecha_publicacion: string | null
          id: string
          imagen_url: string | null
          tipo: string
          titulo: string
          video_url: string | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          tipo?: string
          titulo: string
          video_url?: string | null
        }
        Update: {
          album_id?: string | null
          created_at?: string
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          tipo?: string
          titulo?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "galeria_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albumes"
            referencedColumns: ["id"]
          },
        ]
      }
      goles_destacados: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          miniatura_url: string | null
          orden: number
          titulo: string
          video_url: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          miniatura_url?: string | null
          orden?: number
          titulo: string
          video_url: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          miniatura_url?: string | null
          orden?: number
          titulo?: string
          video_url?: string
        }
        Relationships: []
      }
      hero_config: {
        Row: {
          badge: string
          created_at: string
          cta_href: string
          cta_text: string
          description: string
          id: string
          title1: string
          title2: string
        }
        Insert: {
          badge?: string
          created_at?: string
          cta_href?: string
          cta_text?: string
          description?: string
          id?: string
          title1?: string
          title2?: string
        }
        Update: {
          badge?: string
          created_at?: string
          cta_href?: string
          cta_text?: string
          description?: string
          id?: string
          title1?: string
          title2?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          categoria: string | null
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          imagen_url: string | null
          tag: string
          tiempo_lectura: string | null
          titulo: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          imagen_url?: string | null
          tag: string
          tiempo_lectura?: string | null
          titulo: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          imagen_url?: string | null
          tag?: string
          tiempo_lectura?: string | null
          titulo?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      productos: {
        Row: {
          created_at: string
          descripcion: string | null
          es_popular: boolean
          features: string[]
          id: string
          nombre: string
          orden: number
          periodo: string
          precio: string
          precio_anual: string | null
          whatsapp_url: string | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          es_popular?: boolean
          features?: string[]
          id?: string
          nombre: string
          orden?: number
          periodo?: string
          precio: string
          precio_anual?: string | null
          whatsapp_url?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          es_popular?: boolean
          features?: string[]
          id?: string
          nombre?: string
          orden?: number
          periodo?: string
          precio?: string
          precio_anual?: string | null
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      programa_episodios: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          duracion: string | null
          episodio: number
          fecha_publicacion: string | null
          id: string
          miniatura_url: string | null
          temporada: number
          titulo: string
          video_url: string
          vistas_completas: number
          vistas_inicio: number
          vistas_mitad: number
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          duracion?: string | null
          episodio?: number
          fecha_publicacion?: string | null
          id?: string
          miniatura_url?: string | null
          temporada?: number
          titulo: string
          video_url: string
          vistas_completas?: number
          vistas_inicio?: number
          vistas_mitad?: number
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          duracion?: string | null
          episodio?: number
          fecha_publicacion?: string | null
          id?: string
          miniatura_url?: string | null
          temporada?: number
          titulo?: string
          video_url?: string
          vistas_completas?: number
          vistas_inicio?: number
          vistas_mitad?: number
        }
        Relationships: []
      }
      publicidad: {
        Row: {
          activo: boolean
          created_at: string
          enlace_url: string | null
          id: string
          imagen_url: string | null
          orden: number
          posicion: string
          titulo: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          enlace_url?: string | null
          id?: string
          imagen_url?: string | null
          orden?: number
          posicion?: string
          titulo: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          enlace_url?: string | null
          id?: string
          imagen_url?: string | null
          orden?: number
          posicion?: string
          titulo?: string
        }
        Relationships: []
      }
      quienes_somos: {
        Row: {
          created_at: string
          descripcion: string
          icono: string | null
          id: string
          titulo: string
        }
        Insert: {
          created_at?: string
          descripcion: string
          icono?: string | null
          id?: string
          titulo: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          icono?: string | null
          id?: string
          titulo?: string
        }
        Relationships: []
      }
      reportajes: {
        Row: {
          contenido: string
          created_at: string
          fecha_publicacion: string | null
          id: string
          imagen_url: string | null
          publicado: boolean
          subtitulo: string | null
          tag: string
          titulo: string
          video_url: string | null
        }
        Insert: {
          contenido: string
          created_at?: string
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          subtitulo?: string | null
          tag?: string
          titulo: string
          video_url?: string | null
        }
        Update: {
          contenido?: string
          created_at?: string
          fecha_publicacion?: string | null
          id?: string
          imagen_url?: string | null
          publicado?: boolean
          subtitulo?: string | null
          tag?: string
          titulo?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_programa_view: {
        Args: { ep_id: string; view_type: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
