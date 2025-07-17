export interface Position {
  id: number;
  description: string;
  level: string;
  division: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  position_id: number | null;
  profile_picture: string | null;
  password: string;
  created_at: Date;
  updated_at: Date;
  created_by: number | null;
  updated_by: number | null;
  
  position: Position;
  creator: User | null; // Creator can be another User
  updater: User | null; // Updater can be another User
}
