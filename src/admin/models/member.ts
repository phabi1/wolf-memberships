export type Member = {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  license_number?: string;
  avatar_url?: string;
  gender?: "male" | "female";
};
