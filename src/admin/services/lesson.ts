import { Lesson } from "../models/lesson";

class LessonService {
  private endpoint = "/wp-json/wolf-memberships/v1/campaigns";

  async items(
    campaignId: string,
    options?: {
      filters?: {
        firstname?: string;
        lastname?: string;
        license?: string;
      };
      page?: number;
      size?: number;
    },
  ): Promise<{ items: Lesson[]; total: number }> {
    const { page = 1, size = 20 } = options || {};

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (options?.filters) {
      let filters: string[] = [];
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value) {
          filters.push(`${key}:like:${value}`);
        }
      });
      queryParams.append("filters", filters.join(";"));
    }

    const res = await fetch(
      `${this.endpoint}/${campaignId}/lessons?${queryParams.toString()}`,
    );
    const data = await res.json();

    return {
      items: data.items.map((item: any) => this.unserialize(item)),
      total: data.total,
    };
  }

  async item(campaignId: string, lessonId: string): Promise<Lesson> {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/lessons/${lessonId}`,
    );
    const data = await res.json();
    const entity = this.unserialize(data);

    return entity;
  }

  async create(campaignId: string, data: any) {
    const res = await fetch(`${this.endpoint}/${campaignId}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.serialize(data)),
    });
    const resData = await res.json();
    return this.unserialize(resData);
  }

  async update(campaignId: string, lessonId: string, data: any) {
    const res = await fetch(
      `${this.endpoint}/${campaignId}/lessons/${lessonId}`,
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

  async delete(campaignId: string, lessonId: string) {
    await fetch(`${this.endpoint}/${campaignId}/lessons/${lessonId}`, {
      method: "DELETE",
    });
  }

  private serialize(data: any) {
    return {
      ...data,
    };
  }

  private unserialize(data: any) {
    return {
      ...data,
    };
  }
}

export default new LessonService();
