export interface MasterAttendance {
  id: number; 
  user_id: number | null; 
  check_in: Date | null; 
  check_out: Date | null; 
}

// Define the type for MasterUser
export interface MasterUser {
  id: number;
  name: string;
  email: string;
}

export interface MasterAttendanceWithUser extends MasterAttendance {
  user: MasterUser;
}
