export type MemberDetails = {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  license_number?: string;
  contacts: {
    firstname: string;
    lastname: string;
    phone: string;
    owner: boolean;
  }[];
  wheels: {
    id: number;
    assigned_at: string;
  }[];
};
