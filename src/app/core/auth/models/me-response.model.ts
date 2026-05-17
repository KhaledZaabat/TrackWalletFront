export interface MeResponse {
  userId: string; // Guid
  email: string;
  userName: string;
  fullName: string;
  birthDate: string | null; // DateOnly 
  isMale: boolean | null;
  profileImageUrl: string | null;
}