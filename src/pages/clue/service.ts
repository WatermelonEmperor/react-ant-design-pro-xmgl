import { request } from '@umijs/max';
import type { ClueItem, ClueListParams } from './data.d';

// 模拟数据
const mockClues: ClueItem[] = [
  {
    id: '1',
    name: '智慧城市建设项目',
    source: '政府招标',
    type: '项目线索',
    status: 1,
    priority: 1,
    contact: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    description: '某市智慧城市建设项目，预算约500万',
    followUpDate: '2024-03-20',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    createdBy: '李四',
    remark: '需要重点跟进',
  },
  {
    id: '2',
    name: '企业数字化转型咨询',
    source: '客户推荐',
    type: '咨询线索',
    status: 2,
    priority: 2,
    contact: '王五',
    phone: '13800138002',
    email: 'wangwu@example.com',
    description: '大型制造企业数字化转型咨询需求',
    followUpDate: '2024-03-25',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-18',
    createdBy: '赵六',
    remark: '',
  },
  {
    id: '3',
    name: '高校科研合作',
    source: '学术交流',
    type: '合作线索',
    status: 0,
    priority: 3,
    contact: '陈教授',
    phone: '13800138003',
    email: 'chen@university.edu',
    description: '某高校人工智能实验室寻求产学研合作',
    followUpDate: '2024-04-01',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    createdBy: '李四',
    remark: '等待进一步沟通',
  },
  {
    id: '4',
    name: '医疗信息化升级',
    source: '展会获取',
    type: '项目线索',
    status: 1,
    priority: 1,
    contact: '刘院长',
    phone: '13800138004',
    email: 'liu@hospital.com',
    description: '三甲医院信息化系统升级项目',
    followUpDate: '2024-03-22',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-16',
    createdBy: '王五',
    remark: '已提交方案',
  },
  {
    id: '5',
    name: '金融风控系统开发',
    source: '网络渠道',
    type: '项目线索',
    status: 3,
    priority: 2,
    contact: '孙经理',
    phone: '13800138005',
    email: 'sun@finance.com',
    description: '银行风控系统定制开发需求',
    followUpDate: '2024-03-18',
    createdAt: '2024-02-28',
    updatedAt: '2024-03-12',
    createdBy: '赵六',
    remark: '项目已确认，进入合同阶段',
  },
];

// 查询线索列表
export async function queryClueList(params: ClueListParams) {
  // 模拟API请求
  return new Promise<{ data: ClueItem[]; total: number; success: boolean }>((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockClues];
      
      // 模拟筛选
      if (params.name) {
        filteredData = filteredData.filter(item => 
          item.name.includes(params.name!)
        );
      }
      if (params.source) {
        filteredData = filteredData.filter(item => 
          item.source.includes(params.source!)
        );
      }
      if (params.status !== undefined) {
        filteredData = filteredData.filter(item => 
          item.status === params.status
        );
      }
      
      resolve({
        data: filteredData,
        total: filteredData.length,
        success: true,
      });
    }, 300);
  });
}

// 添加线索
export async function addClue(params: Partial<ClueItem>) {
  return request<{ success: boolean }>('/api/clue', {
    method: 'POST',
    data: params,
  }).catch(() => ({ success: true }));
}

// 更新线索
export async function updateClue(params: Partial<ClueItem>) {
  return request<{ success: boolean }>('/api/clue', {
    method: 'PUT',
    data: params,
  }).catch(() => ({ success: true }));
}

// 删除线索
export async function removeClue(params: { ids: string[] }) {
  return request<{ success: boolean }>('/api/clue', {
    method: 'DELETE',
    data: params,
  }).catch(() => ({ success: true }));
}
