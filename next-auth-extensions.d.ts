import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // The user's unique identifier
      isRecordCreated: boolean; // Whether the user has a record in the database
    } & DefaultSession["user"];
  }
}
