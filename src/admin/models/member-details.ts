export type MemberDetails = {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  license_number?: string;
  avatar_url?: string;
  gender?: "male" | "female";
  wheels: {
    id: number;
    assigned_at: string;
  }[];
};
