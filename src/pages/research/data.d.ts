export type ResearchItem = {
  id: string;
  title: string;
  type: string;
  field: string;
  status: number;
  startDate: string;
  endDate: string;
  leader: string;
  participants: string[];
  objective: string;
  methods: string;
  findings: string;
  conclusion: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

export type ResearchListParams = {
  title?: string;
  type?: string;
  field?: string;
  status?: number;
  pageSize?: number;
  current?: number;
};
