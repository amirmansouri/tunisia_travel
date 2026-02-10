export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type EventType = 'match' | 'general';
export type MatchStatus = 'upcoming' | 'live' | 'halftime' | 'finished';

export type ProgramCategory = 'adventure' | 'beach' | 'cultural' | 'desert' | 'city' | 'nature';

// Itinerary day for multi-destination programs
export interface ItineraryDay {
  day: number;
  location: string;
  title: string;
  description: string;
  activities?: string[];
  meals?: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
  accommodation?: string;
  images?: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  price: number | null;
  start_date: string;
  end_date: string;
  location: string;
  images: string[];
  published: boolean;
  category?: ProgramCategory;
  itinerary?: ItineraryDay[];
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

export interface LiveEvent {
  id: string;
  event_type: EventType;
  name: string;
  description: string | null;
  location: string | null;
  event_date: string;
  image_url: string | null;
  is_active: boolean;
  team_a: string | null;
  team_b: string | null;
  score_a: number | null;
  score_b: number | null;
  match_status: MatchStatus | null;
  created_at: string;
  updated_at?: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at?: string;
}

// Tournament types
export type TournamentStatus = 'registration' | 'pools' | 'knockout' | 'finished';
export type RoundType = 'pool' | 'quarter' | 'semi' | 'final' | '3rd_place';
export type MatchStatusType = 'scheduled' | 'live' | 'finished';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  max_teams: number;
  num_pools: number;
  status: TournamentStatus;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  name: string;
  country: string | null;
  captain_name: string | null;
  captain_phone: string | null;
  captain_email: string | null;
  pool: string | null;
  seed: number | null;
  is_confirmed: boolean;
  created_at: string;
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round_type: RoundType;
  pool: string | null;
  match_number: number;
  team_a_id: string | null;
  team_b_id: string | null;
  score_a: number;
  score_b: number;
  status: MatchStatusType;
  scheduled_time: string | null;
  court: string | null;
  created_at: string;
  updated_at?: string;
  // Joined fields
  team_a?: TournamentTeam;
  team_b?: TournamentTeam;
}

export interface TournamentStanding {
  id: string;
  tournament_id: string;
  team_id: string;
  pool: string;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  points_for: number;
  points_against: number;
  points: number;
  rank: number;
  // Joined fields
  team?: TournamentTeam;
}

export interface CreateProgramInput {
  title: string;
  description: string;
  price?: number | null;
  start_date: string;
  end_date: string;
  location: string;
  images: string[];
  published: boolean;
  category?: ProgramCategory;
  itinerary?: ItineraryDay[];
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
      live_events: {
        Row: LiveEvent;
        Insert: Omit<LiveEvent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LiveEvent, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, 'updated_at'>;
        Update: Partial<Omit<SiteSetting, 'updated_at'>>;
      };
      tournaments: {
        Row: Tournament;
        Insert: Omit<Tournament, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tournament, 'id' | 'created_at' | 'updated_at'>>;
      };
      tournament_teams: {
        Row: TournamentTeam;
        Insert: Omit<TournamentTeam, 'id' | 'created_at'>;
        Update: Partial<Omit<TournamentTeam, 'id' | 'created_at'>>;
      };
      tournament_matches: {
        Row: TournamentMatch;
        Insert: Omit<TournamentMatch, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TournamentMatch, 'id' | 'created_at' | 'updated_at'>>;
      };
      tournament_standings: {
        Row: TournamentStanding;
        Insert: Omit<TournamentStanding, 'id'>;
        Update: Partial<Omit<TournamentStanding, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
