// URL builders for the catalog endpoints. Pages pass the result to useApi().

export interface CourseQuery {
  search?: string;
  categoryId?: number;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PagedQuery {
  search?: string;
  page?: number;
  pageSize?: number;
}

function toQuery(params: object): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

export const coursesUrl = (query: CourseQuery = {}) => `/api/courses${toQuery(query)}`;
export const courseUrl = (id: string | number) => `/api/courses/${id}`;

export const programsUrl = (query: PagedQuery = {}) => `/api/programs${toQuery(query)}`;
export const programUrl = (id: string | number) => `/api/programs/${id}`;

export const careerPathsUrl = (query: PagedQuery = {}) => `/api/careerpaths${toQuery(query)}`;
export const careerPathUrl = (id: string | number) => `/api/careerpaths/${id}`;

export const categoriesUrl = () => "/api/categories";
