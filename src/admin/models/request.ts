import { RequestParticipant } from "./request-participant";

export type Request = {
  id: number;
  status: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  data: {
    contact: {
      firstname: string;
      lastname: string;
      email?: string;
      phone?: string;
    };
    participants: RequestParticipant[];
  };
  campaign_id: number;
};
