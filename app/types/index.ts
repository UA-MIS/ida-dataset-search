export interface Dataset {
  id: number;
  title: string;
  description?: string;
  category: string;
  tags: string[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  create_time: Date;
}
