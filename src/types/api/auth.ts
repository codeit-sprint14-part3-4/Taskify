export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl: string;
    createdAt: string; // JSON을 Date로 자동 변환해주지 X
    updatedAt: string;
  };
  accessToken: string;
}

export interface ChangePasswordBody {
  password: string;
  newPassword: string;
}
