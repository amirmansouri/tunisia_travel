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
  created_at: string;
}

export interface ReservationWithProgram extends Reservation {
  program?: Program;
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
        Insert: Omit<Reservation, 'id' | 'created_at'>;
        Update: Partial<Omit<Reservation, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
