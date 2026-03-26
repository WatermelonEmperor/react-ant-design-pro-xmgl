import { request } from '@umijs/max';
import type { TopicItem, TopicListParams } from './data.d';

const mockData: TopicItem[] = [
  {
    id: '1',
    name: '智能交通系统关键技术研究',
    code: 'KT-2024-001',
    type: '纵向课题',
    source: '国家自然科学基金',
    status: 1,
    level: '国家级',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    budget: 800000,
    leader: '张教授',
    members: ['李四', '王五', '赵六'],
    description: '研究智能交通系统中的关键算法和技术',
    objectives: '建立智能交通预测模型，提高交通效率30%',
    createdAt: '2023-12-15',
    updatedAt: '2024-03-10',
    createdBy: '张教授',
    remark: '重点项目',
  },
  {
    id: '2',
    name: '企业数字化转型咨询服务',
    code: 'KT-2024-002',
    type: '横向课题',
    source: '企业委托',
    status: 1,
    level: '省部级',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    budget: 350000,
    leader: '李四',
    members: ['王五', '钱七'],
    description: '为某制造企业提供数字化转型整体规划',
    objectives: '完成数字化转型方案并指导实施',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-15',
    createdBy: '李四',
    remark: '',
  },
  {
    id: '3',
    name: '人工智能在医疗诊断中的应用研究',
    code: 'KT-2024-003',
    type: '纵向课题',
    source: '省科技厅',
    status: 0,
    level: '省部级',
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    budget: 500000,
    leader: '王五',
    members: ['张教授', '赵六'],
    description: 'AI辅助医疗影像诊断技术研究',
    objectives: '开发医疗影像AI辅助诊断系统',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-20',
    createdBy: '王五',
    remark: '待启动',
  },
  {
    id: '4',
    name: '新能源汽车电池管理系统优化',
    code: 'KT-2023-008',
    type: '横向课题',
    source: '企业委托',
    status: 2,
    level: '其他',
    startDate: '2023-06-01',
    endDate: '2024-02-28',
    budget: 450000,
    leader: '赵六',
    members: ['李四'],
    description: '优化新能源汽车电池管理算法',
    objectives: '延长电池寿命20%，提升充电效率',
    createdAt: '2023-05-15',
    updatedAt: '2024-02-28',
    createdBy: '赵六',
    remark: '已结题验收',
  },
];

export async function queryTopicList(params: TopicListParams) {
  return new Promise<{ data: TopicItem[]; total: number; success: boolean }>((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockData];
      if (params.name) {
        filteredData = filteredData.filter((item) => item.name.includes(params.name!));
      }
      if (params.type) {
        filteredData = filteredData.filter((item) => item.type === params.type);
      }
      if (params.status !== undefined) {
        filteredData = filteredData.filter((item) => item.status === params.status);
      }
      if (params.level) {
        filteredData = filteredData.filter((item) => item.level === params.level);
      }
      resolve({
        data: filteredData,
        total: filteredData.length,
        success: true,
      });
    }, 300);
  });
}

export async function addTopic(params: Partial<TopicItem>) {
  return request<{ success: boolean }>('/api/topic', {
    method: 'POST',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function updateTopic(params: Partial<TopicItem>) {
  return request<{ success: boolean }>('/api/topic', {
    method: 'PUT',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function removeTopic(params: { ids: string[] }) {
  return request<{ success: boolean }>('/api/topic', {
    method: 'DELETE',
    data: params,
  }).catch(() => ({ success: true }));
}
