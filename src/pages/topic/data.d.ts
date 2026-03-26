export type TopicItem = {
  id: string;
  name: string;
  code: string;
  type: string;
  source: string;
  status: number;
  level: string;
  startDate: string;
  endDate: string;
  budget: number;
  leader: string;
  members: string[];
  description: string;
  objectives: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

export type TopicListParams = {
  name?: string;
  type?: string;
  status?: number;
  level?: string;
  pageSize?: number;
  current?: number;
};
