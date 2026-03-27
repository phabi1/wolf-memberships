import { Member } from "../models/member";
import { MemberDetails } from "../models/member-details";

class MemberService {
  private endpoint = "/wp-json/wolf-memberships/v1/members";

  async items(options?: {
    filters?: Record<string, string | Record<string, string>>;
    page?: number;
    size?: number;
  }): Promise<{ items: Member[]; total: number }> {
    const { page = 1, size = 20, filters = {} } = options || {};

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: "lastname",
    });

    if (options?.filters) {
      let filters: string[] = [];
      Object.entries(options.filters).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([operator, subValue]) => {
            filters.push(`${key}:${operator}:${subValue}`);
          });
        } else if (value !== "") {
          filters.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filters.join(";"));
    }

    const res = await fetch(`${this.endpoint}?${queryParams.toString()}`);
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(memberId: string): Promise<MemberDetails> {
    const res = await fetch(`${this.endpoint}/${memberId}`);
    const data = await res.json();
    const entity = this.unserialize(data);

    const [contacts, wheels] = await Promise.all([
      this.fetchContacts(memberId),
      this.fetchWheels(memberId),
    ]);

    entity.contacts = contacts;
    entity.wheels = wheels;

    return entity;
  }

  async create(data: any) {
    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(memberId: string, data: any) {
    const res = await fetch(`${this.endpoint}/${memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async delete(memberId: string) {
    await fetch(`${this.endpoint}/${memberId}`, {
      method: "DELETE",
    });
  }

    async exists(data: {
    firstname: string;
    lastname: string;
    birthdate: Date;
  }): Promise<{ exists: boolean; id: number | null }> {
    const res = await fetch(`${this.endpoint}/exists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        birthdate: Math.floor(data.birthdate.getTime() / 1000),
      }),
    });
    const resData = await res.json();
    return {
      exists: resData.exists,
      id: resData.id,
    };
  }

  private async fetchContacts(memberId: string) {
    const res = await fetch(`${this.endpoint}/${memberId}/contacts`);
    const data = await res.json();
    return data.items;
  }

  private async fetchWheels(memberId: string) {
    const res = await fetch(`${this.endpoint}/${memberId}/wheels`);
    const data = await res.json();
    return data.items;
  }

  private serialize(data: any) {
    return {
      ...data,
      birthdate: data.birthdate
        ? Math.floor(data.birthdate.getTime() / 1000)
        : null,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate * 1000) : null,
    };
  }
}

export default new MemberService();
