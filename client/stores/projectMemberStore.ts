import { create } from "zustand";

export interface ProjectMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ProjectMemberState {
  members: ProjectMember[];
  fetchMembers: (projectId?: string) => Promise<void>;
}

export const useProjectMemberStore = create<ProjectMemberState>((set) => ({
  members: [
    { id: "m1", user: { id: "u1", name: "John Doe", email: "j@d.com" } },
    { id: "m2", user: { id: "u2", name: "Jane Doe", email: "jane@d.com" } },
    { id: "m3", user: { id: "u3", name: "Alex Miller", email: "alex@d.com" } },
  ],
  fetchMembers: async (projectId) => {
    // Return static/mock members for now to keep store simple and functional
  },
}));
