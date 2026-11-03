export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount?: number;
  createdAt: string;
}

export interface UserProfileResponse {
  status: number;
  message: string;
  data: UserProfile;
}

export interface CurrentUserResponse {
  status: number;
  message: string;
  data: {
    id: string;
  };
}
