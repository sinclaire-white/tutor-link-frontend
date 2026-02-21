// Augment better-auth session user to include app-specific fields
// (server configures these; client infers them at runtime)
export {};

declare module "better-auth/client" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: "STUDENT" | "TUTOR" | "ADMIN";
    };
  }
}