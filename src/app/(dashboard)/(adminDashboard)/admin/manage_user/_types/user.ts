export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: "user" | "admin";
  isVerified: boolean;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    meta: {
      totalData: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  };
}

export interface UpdateUserPayload {
  _id: string;
  role?: "user" | "admin";
  isVerified?: boolean;
}
