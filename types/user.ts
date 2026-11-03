export interface User {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
}

export interface UserProfileResponse {
  status: number;
  message: string;
  data: User;
}
