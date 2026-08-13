import { Subscription } from "../models/subscription";

class SubscriptionService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items(
    campaignId: string,
    options?: {
      filters?: Record<string, string | Record<string, string>>;
      page?: number;
      size?: number;
    },
  ): Promise<{ items: Subscription[]; total: number }> {
    const { page = 1, size = 20 } = options || {};

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
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

    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(campaignId: string, memberId: string): Promise<Subscription> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions/${memberId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async create(campaignId: string, data: any) {
    const res = await fetch(`${this.endpoint}/${campaignId}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(campaignId: string, memberId: string, data: any) {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions/${memberId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.serialize(data)),
      },
    );
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async delete(campaignId: string, memberId: string) {
    await fetch(`${this.endpoint}/${campaignId}/subscriptions/${memberId}`, {
      method: "DELETE",
    });
  }

  async count(campaignId: string, filters?: Record<string, string>) {
    const queryParams = new URLSearchParams({
      size: "1",
    });
    if (filters) {
      let filtersArr: string[] = [];
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
          filtersArr.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filtersArr.join(";"));
    }

    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions?${queryParams.toString()}`,
    );
    const data = await res.json();
    return data.total;
  }

  async import(campaignId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions/import`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await res.json();
    return data;
  }

  async export(campaignId: string) {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/subscriptions/export`,
      {
        method: "GET",
      },
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return url;
  }

  async fetchSessions(campaignId: string, subscriptionId: string) {
    const params = new URLSearchParams({
      filters: "subscription_id:eq:" + subscriptionId,
    });
    const res = await fetch(
      `${this.endpoint}/${campaignId}/sessions?${params.toString()}`,
      {
        method: "GET",
      },
    );
    const data = await res.json();
    return data.items || [];
  }

  private serialize(data: any) {
    return {
      ...data,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
      member: {
        ...data.member,
        birthdate: data.member.birthdate
          ? new Date(data.member.birthdate * 1000)
          : null,
      },
    };
  }
}

export default new SubscriptionService();
