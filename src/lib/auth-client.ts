"use client";

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000",
  plugins: [],
  user: {
    additionalFields: {
      age: {
        type: "number",
        required: false,
      },
    },
  },
});


