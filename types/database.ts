export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type ProgramCategory = 'adventure' | 'beach' | 'cultural' | 'desert' | 'city' | 'nature';

export interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  images: string[];
  published: boolean;
  category?: ProgramCategory;
  created_at: string;
  updated_at?: string;
}

export interface Reservation {
  id: string;
  program_id: string;
  full_name: string;
  phone: string;
  email: string;
  message: string | null;
  status: ReservationStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ReservationWithProgram extends Reservation {
  program?: Program;
}

export interface Review {
  id: string;
  program_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Visitor {
  id: string;
  ip_address: string;
  user_agent: string;
  country?: string | null;
  city?: string | null;
  created_at: string;
}

export interface CreateProgramInput {
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  images: string[];
  published: boolean;
  category?: ProgramCategory;
}

export interface UpdateProgramInput extends Partial<CreateProgramInput> {
  id: string;
}

export interface CreateReservationInput {
  program_id: string;
  full_name: string;
  phone: string;
  email: string;
  message?: string;
}

export type Database = {
  public: {
    Tables: {
      programs: {
        Row: Program;
        Insert: Omit<Program, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Program, 'id' | 'created_at' | 'updated_at'>>;
      };
      reservations: {
        Row: Reservation;
        Insert: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Reservation, 'id' | 'created_at' | 'updated_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
      newsletter: {
        Row: Newsletter;
        Insert: Omit<Newsletter, 'id' | 'created_at'>;
        Update: Partial<Omit<Newsletter, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<ContactMessage, 'id' | 'created_at'>>;
      };
      visitors: {
        Row: Visitor;
        Insert: Omit<Visitor, 'id' | 'created_at'>;
        Update: Partial<Omit<Visitor, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
