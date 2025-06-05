// src/models/types.ts
export interface Reward {
    id: string;
    name: string;
    description: string;
    points: number;
    imageUrl: string;
    status: 'Active' | 'Inactive';
    created: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
    conditions?: string[];
  }