export type ClueItem = {
  id: string;
  name: string;
  source: string;
  type: string;
  status: number;
  priority: number;
  contact: string;
  phone: string;
  email: string;
  description: string;
  followUpDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

export type ClueListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ClueListData = {
  list: ClueItem[];
  pagination: Partial<ClueListPagination>;
};

export type ClueListParams = {
  name?: string;
  source?: string;
  type?: string;
  status?: number;
  priority?: number;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
