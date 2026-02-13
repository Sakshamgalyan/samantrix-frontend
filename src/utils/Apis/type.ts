export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  mobileNo: string;
  post: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  status: string;
}

export interface RegisterResponse {
  message: string;
  status: string;
}

export interface ProfileResponse {
  message: string;
  status: string;
  user: {
    id: string;
    role: string;
    name: string;
    email: string;
    mobileNo: string;
    employeeId: string;
    post: string;
  };
}
