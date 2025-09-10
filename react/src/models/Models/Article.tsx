
export interface Author {
  id: number;
  full_name: string;
  slug: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Source {
  id: number;
  name: string;
  slug: string;
}

export interface ArticleData {
  id: number;
  title: string;
  description: string;
  img_url?: string;
  external_url: string;
  published_at: string;
  author?: Author;
  category?: Category;
  source?: Source;
  slug: string;
}
