import { Member } from "./member";

export type Subscription = {
  id: number;
  license_type: string;
  member: Member;
  subscribed_at: number;
  contacts: {
    id: number;
    firstname: string;
    lastname: string;
    email?: string;
    phone?: string;
  }[];
};
