export type ProjectItem = {
  id: string;
  name: string;
  code: string;
  type: string;
  status: number;
  progress: number;
  priority: number;
  startDate: string;
  endDate: string;
  budget: number;
  cost: number;
  manager: string;
  members: string[];
  client: string;
  description: string;
  topicId?: string;
  topicName?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

export type ProjectListParams = {
  name?: string;
  type?: string;
  status?: number;
  priority?: number;
  pageSize?: number;
  current?: number;
};
