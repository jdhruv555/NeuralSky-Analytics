/**
 * Authentication-ready placeholder. Replace with NextAuth, Clerk, or custom session.
 */
export type AuthRole = "viewer" | "analyst" | "admin";

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: AuthRole;
  workspaceId: string;
}

export async function getServerSession(): Promise<AuthSession | null> {
  return null;
}

export function getClientSessionMock(): AuthSession {
  return {
    userId: "demo-user",
    email: "analyst@neuralsky.io",
    name: "Demo Analyst",
    role: "analyst",
    workspaceId: "ws-neuralsky-demo",
  };
}
