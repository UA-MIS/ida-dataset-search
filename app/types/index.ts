export interface Dataset {
  id: number;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  categories: string[];
}

export interface Tag {
  id: number;
  name: string;
  usage_count?: number;
}

export interface Category {
  id: number;
  name: string;
  usage_count?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  create_time: Date;
}
