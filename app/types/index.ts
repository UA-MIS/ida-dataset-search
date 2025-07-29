export interface Dataset {
  id: number;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  categories: string[];
  type: string;
  isActive: string;
  downloads?: number;
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

export interface AccessInfo {
  id: number;
  dataset_id: number;
  field: string;
  value: string;
}

export interface Overview {
  datasets: number;
  active_datasets: number;
  total_downloads: number;
  users: number;
  tags: number;
  categories: number;
}