export interface userType {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role: string;
}

export interface loginResponse {
  user: userType;
  token: string;
}

export interface registerResponse {
  user: userType;
  token: string;
}