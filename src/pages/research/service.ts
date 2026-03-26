import { request } from '@umijs/max';
import type { ResearchItem, ResearchListParams } from './data.d';

const mockData: ResearchItem[] = [
  {
    id: '1',
    title: '智慧城市建设市场调研',
    type: '市场调研',
    field: '智慧城市',
    status: 2,
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    leader: '张三',
    participants: ['李四', '王五'],
    objective: '了解智慧城市建设的市场需求和竞争格局',
    methods: '问卷调查、专家访谈、数据分析',
    findings: '市场规模预计达到5000亿，主要集中在一线城市',
    conclusion: '建议重点关注交通和安防领域',
    attachments: [],
    createdAt: '2024-01-10',
    updatedAt: '2024-03-01',
    createdBy: '张三',
    remark: '已完成报告',
  },
  {
    id: '2',
    title: '人工智能技术应用调研',
    type: '技术调研',
    field: '人工智能',
    status: 1,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    leader: '李四',
    participants: ['赵六', '钱七'],
    objective: '调研AI技术在企业中的应用现状和趋势',
    methods: '文献研究、案例分析、技术测试',
    findings: '',
    conclusion: '',
    attachments: [],
    createdAt: '2024-01-25',
    updatedAt: '2024-03-10',
    createdBy: '李四',
    remark: '进行中',
  },
  {
    id: '3',
    title: '竞争对手产品分析',
    type: '竞品调研',
    field: '产品分析',
    status: 1,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    leader: '王五',
    participants: ['张三'],
    objective: '分析主要竞争对手的产品特点和市场策略',
    methods: '产品体验、用户反馈收集、功能对比',
    findings: '',
    conclusion: '',
    attachments: [],
    createdAt: '2024-02-28',
    updatedAt: '2024-03-15',
    createdBy: '王五',
    remark: '',
  },
  {
    id: '4',
    title: '新能源行业政策研究',
    type: '政策调研',
    field: '新能源',
    status: 0,
    startDate: '2024-04-01',
    endDate: '2024-05-15',
    leader: '赵六',
    participants: ['李四', '王五'],
    objective: '研究新能源行业最新政策和发展方向',
    methods: '政策文件分析、行业报告研读',
    findings: '',
    conclusion: '',
    attachments: [],
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    createdBy: '赵六',
    remark: '待启动',
  },
];

export async function queryResearchList(params: ResearchListParams) {
  return new Promise<{ data: ResearchItem[]; total: number; success: boolean }>((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockData];
      if (params.title) {
        filteredData = filteredData.filter((item) => item.title.includes(params.title!));
      }
      if (params.type) {
        filteredData = filteredData.filter((item) => item.type === params.type);
      }
      if (params.status !== undefined) {
        filteredData = filteredData.filter((item) => item.status === params.status);
      }
      resolve({
        data: filteredData,
        total: filteredData.length,
        success: true,
      });
    }, 300);
  });
}

export async function addResearch(params: Partial<ResearchItem>) {
  return request<{ success: boolean }>('/api/research', {
    method: 'POST',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function updateResearch(params: Partial<ResearchItem>) {
  return request<{ success: boolean }>('/api/research', {
    method: 'PUT',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function removeResearch(params: { ids: string[] }) {
  return request<{ success: boolean }>('/api/research', {
    method: 'DELETE',
    data: params,
  }).catch(() => ({ success: true }));
}
