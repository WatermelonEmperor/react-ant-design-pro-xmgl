import { request } from '@umijs/max';
import type { ProjectItem, ProjectListParams } from './data.d';

const mockData: ProjectItem[] = [
  {
    id: '1',
    name: '智慧城市交通管理系统',
    code: 'PRJ-2024-001',
    type: '软件开发',
    status: 1,
    progress: 65,
    priority: 1,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 500000,
    cost: 280000,
    manager: '张三',
    members: ['李四', '王五', '赵六'],
    client: '某市交通局',
    description: '建设智慧交通管理平台',
    topicId: '1',
    topicName: '智能交通系统关键技术研究',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-15',
    createdBy: '张三',
    remark: '重点项目',
  },
  {
    id: '2',
    name: '医疗信息化平台升级',
    code: 'PRJ-2024-002',
    type: '系统集成',
    status: 1,
    progress: 40,
    priority: 2,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    budget: 350000,
    cost: 120000,
    manager: '李四',
    members: ['王五', '钱七'],
    client: '某三甲医院',
    description: '医院信息系统升级改造',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-10',
    createdBy: '李四',
    remark: '',
  },
  {
    id: '3',
    name: '企业数字化转型咨询',
    code: 'PRJ-2024-003',
    type: '咨询服务',
    status: 2,
    progress: 100,
    priority: 2,
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    budget: 150000,
    cost: 145000,
    manager: '王五',
    members: ['张三'],
    client: '某制造企业',
    description: '企业数字化转型规划咨询',
    createdAt: '2023-12-20',
    updatedAt: '2024-03-01',
    createdBy: '王五',
    remark: '已验收',
  },
  {
    id: '4',
    name: 'AI辅助诊断系统研发',
    code: 'PRJ-2024-004',
    type: '软件开发',
    status: 0,
    progress: 0,
    priority: 1,
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    budget: 800000,
    cost: 0,
    manager: '赵六',
    members: ['张三', '李四', '王五'],
    client: '内部项目',
    description: 'AI医疗影像辅助诊断系统',
    topicId: '3',
    topicName: '人工智能在医疗诊断中的应用研究',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    createdBy: '赵六',
    remark: '待启动',
  },
];

export async function queryProjectList(params: ProjectListParams) {
  return new Promise<{ data: ProjectItem[]; total: number; success: boolean }>((resolve) => {
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
      resolve({
        data: filteredData,
        total: filteredData.length,
        success: true,
      });
    }, 300);
  });
}

export async function addProject(params: Partial<ProjectItem>) {
  return request<{ success: boolean }>('/api/project', {
    method: 'POST',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function updateProject(params: Partial<ProjectItem>) {
  return request<{ success: boolean }>('/api/project', {
    method: 'PUT',
    data: params,
  }).catch(() => ({ success: true }));
}

export async function removeProject(params: { ids: string[] }) {
  return request<{ success: boolean }>('/api/project', {
    method: 'DELETE',
    data: params,
  }).catch(() => ({ success: true }));
}
