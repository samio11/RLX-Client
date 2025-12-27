"use server";

import { jwtDecode } from "jwt-decode";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
}

export enum ERole {
  admin = "admin",
  user = "user",
}

export const userLogin = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    (await cookies()).delete("accessToken");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const userRegister = async (payload: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/register`,
      {
        method: "POST",
        body: payload,
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    let decoded = null;
    if (token) {
      decoded = await jwtDecode<IUser>(token);
      return decoded;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllUserAdmin = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      next: {
        tags: ["user"],
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getUserByToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/get-single`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    // revalidateTag("user", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateUserByToken = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(payload),
    }).then((x) => x.json());
    revalidateTag("user", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const blockUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/block/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const unBlockUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/un-block/${userId}`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
