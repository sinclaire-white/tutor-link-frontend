import type { SignUpEmailInput } from "better-auth/client";

declare module "better-auth/client" {
  interface SignUpEmailInput {
    age?: number;
    phoneNumber?: string;
  }

  interface User {
    role: "STUDENT" | "TUTOR" | "ADMIN";
    age?: number;
    phoneNumber?: string;
  }
}