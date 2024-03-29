import { Program } from "@/app/types/Program";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // The user's unique identifier
      defaultPlannerId: string | null | undefined;
      isRecordCreated: boolean;
      programs: Program[];
    } & DefaultSession["user"];
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     sub: string;
//     isUserRecordCreated: boolean;
//   } & DefaultJWT["user"];
// }
