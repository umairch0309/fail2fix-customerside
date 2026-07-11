/**
 * Blog Types - matching Payload CMS Blogs collection
 */

export interface BlogAuthor {
  id: number;
  email: string;
  name?: string;
}

export interface BlogMedia {
  id: number;
  alt: string;
  url: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface BlogTag {
  tag?: string | null;
  id?: string | null;
}

export interface LexicalNode {
  type: string;
  version: number;
  [key: string]: unknown;
}

export interface LexicalRoot {
  type: string;
  children: LexicalNode[];
  direction: "ltr" | "rtl" | null;
  format: "left" | "start" | "center" | "right" | "end" | "justify" | "";
  indent: number;
  version: number;
}

export interface LexicalContent {
  root: LexicalRoot;
  [key: string]: unknown;
}

export interface BlogSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: BlogMedia | number | null;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: LexicalContent;
  featuredImage?: BlogMedia | number | null;
  author?: BlogAuthor | number | null;
  publishedDate?: string | null;
  status?: "draft" | "published" | null;
  featured?: boolean | null;
  tags?: BlogTag[] | null;
  seo?: BlogSEO | null;
  updatedAt: string;
  createdAt: string;
}

export interface BlogsResponse {
  docs: Blog[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
