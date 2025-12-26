"use server";

import { cookies } from "next/headers";

export const AdminAnalysis = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/analysis`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
