import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Progress, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

type RequirementItem = {
  id: string;
  title: string;
  code: string;
  projectId?: string;
  projectName?: string;
  type: string;
  status: number;
  priority: number;
  progress: number;
  description: string;
  acceptanceCriteria: string;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

const mockData: RequirementItem[] = [
  {
    id: '1',
    title: '用户登录认证模块',
    code: 'REQ-2024-001',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '功能需求',
    status: 2,
    priority: 1,
    progress: 100,
    description: '实现用户登录、注册、密码找回等功能',
    acceptanceCriteria: '1. 支持用户名密码登录\n2. 支持手机验证码登录\n3. 登录成功后跳转首页',
    assignee: '李四',
    estimatedHours: 40,
    actualHours: 45,
    deadline: '2024-02-28',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
    createdBy: '张三',
    remark: '已完成验收',
  },
  {
    id: '2',
    title: '交通数据可视化展示',
    code: 'REQ-2024-002',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '功能需求',
    status: 1,
    priority: 1,
    progress: 60,
    description: '实现交通流量、拥堵指数等数据的图表展示',
    acceptanceCriteria: '1. 支持实时数据更新\n2. 支持历史数据查询\n3. 支持导出图表',
    assignee: '王五',
    estimatedHours: 80,
    actualHours: 50,
    deadline: '2024-04-15',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
    createdBy: '张三',
    remark: '',
  },
  {
    id: '3',
    title: '系统性能优化',
    code: 'REQ-2024-003',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '非功能需求',
    status: 0,
    priority: 2,
    progress: 0,
    description: '优化系统响应速度，提升并发处理能力',
    acceptanceCriteria: '1. 页面加载时间小于2秒\n2. 支持1000并发用户',
    assignee: '赵六',
    estimatedHours: 60,
    actualHours: 0,
    deadline: '2024-05-30',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    createdBy: '张三',
    remark: '待启动',
  },
  {
    id: '4',
    title: '患者信息管理',
    code: 'REQ-2024-004',
    projectId: '2',
    projectName: '医疗信息化平台升级',
    type: '功能需求',
    status: 1,
    priority: 1,
    progress: 35,
    description: '实现患者基本信息、病历、检查报告的管理',
    acceptanceCriteria: '1. 支持患者信息录入和修改\n2. 支持病历关联\n3. 支持检查报告上传',
    assignee: '李四',
    estimatedHours: 100,
    actualHours: 35,
    deadline: '2024-06-30',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-18',
    createdBy: '王五',
    remark: '',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待开发', color: 'default' },
  1: { text: '开发中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
  4: { text: '已取消', color: 'error' },
};

const priorityMap: Record<number, { text: string; color: string }> = {
  1: { text: '高', color: 'red' },
  2: { text: '中', color: 'orange' },
  3: { text: '低', color: 'blue' },
};

const ProjectRequirementPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<RequirementItem>();

  const handleAdd = async (fields: Partial<RequirementItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<RequirementItem>) => {
    message.success('更新成功');
    return true;
  };

  const confirmDelete = (record: RequirementItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除需求「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<RequirementItem>[] = [
    {
      title: '需求编号',
      dataIndex: 'code',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '需求标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 200,
      render: (dom, entity) => (
        <a
          onClick={() => {
            setCurrentRow(entity);
            setShowDetail(true);
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      ellipsis: true,
      width: 180,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        功能需求: { text: '功能需求' },
        非功能需求: { text: '非功能需求' },
        优化需求: { text: '优化需求' },
        bug修复: { text: 'bug修复' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '待开发' },
        1: { text: '开发中' },
        2: { text: '已完成' },
        3: { text: '已暂停' },
        4: { text: '已取消' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      valueType: 'select',
      valueEnum: {
        1: { text: '高' },
        2: { text: '中' },
        3: { text: '低' },
      },
      render: (_, record) => {
        const priority = priorityMap[record.priority];
        return <Tag color={priority?.color}>{priority?.text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <Progress percent={record.progress} size="small" />,
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '预估工时',
      dataIndex: 'estimatedHours',
      width: 90,
      hideInSearch: true,
      render: (_, record) => `${record.estimatedHours}h`,
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentRow(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formContent = (
    <>
      <ProFormText name="title" label="需求标题" rules={[{ required: true }]} />
      <ProFormText name="code" label="需求编号" rules={[{ required: true }]} />
      <ProFormSelect
        name="type"
        label="需求类型"
        options={[
          { label: '功能需求', value: '功能需求' },
          { label: '非功能需求', value: '非功能需求' },
          { label: '优化需求', value: '优化需求' },
          { label: 'bug修复', value: 'bug修复' },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '待开发', value: 0 },
          { label: '开发中', value: 1 },
          { label: '已完成', value: 2 },
          { label: '已暂停', value: 3 },
          { label: '已取消', value: 4 },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="priority"
        label="优先级"
        options={[
          { label: '高', value: 1 },
          { label: '中', value: 2 },
          { label: '低', value: 3 },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormText name="assignee" label="负责人" rules={[{ required: true }]} />
      <ProFormDigit name="estimatedHours" label="预估工时(小时)" min={0} />
      <ProFormDigit name="progress" label="完成进度(%)" min={0} max={100} />
      <ProFormTextArea name="description" label="需求描述" rules={[{ required: true }]} fieldProps={{ rows: 3 }} />
      <ProFormTextArea name="acceptanceCriteria" label="验收标准" fieldProps={{ rows: 3 }} />
      <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 2 }} />
    </>
  );

  return (
    <PageContainer>
      <ProTable<RequirementItem>
        headerTitle="工程需求列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            新增需求
          </Button>,
        ]}
        request={async (params) => {
          let filteredData = [...mockData];
          if (params.title) {
            filteredData = filteredData.filter((item) => item.title.includes(params.title));
          }
          if (params.type) {
            filteredData = filteredData.filter((item) => item.type === params.type);
          }
          if (params.status !== undefined) {
            filteredData = filteredData.filter((item) => item.status === Number(params.status));
          }
          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          };
        }}
        columns={columns}
        scroll={{ x: 1400 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ModalForm
        title="新增需求"
        width={640}
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setCreateModalOpen(false),
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
        onFinish={async (values) => {
          const success = await handleAdd(values);
          if (success) {
            setCreateModalOpen(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      >
        {formContent}
      </ModalForm>

      <ModalForm
        title="编辑需求"
        width={640}
        open={editModalOpen}
        initialValues={currentRow}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
          },
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
        onFinish={async (values) => {
          const success = await handleUpdate(values);
          if (success) {
            setEditModalOpen(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
          return success;
        }}
      >
        {formContent}
      </ModalForm>

      <Drawer
        width={640}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        title="需求详情"
      >
        {currentRow && (
          <ProDescriptions<RequirementItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '需求编号', dataIndex: 'code' },
              { title: '需求标题', dataIndex: 'title', span: 2 },
              { title: '所属项目', dataIndex: 'projectName', span: 2 },
              { title: '需求类型', dataIndex: 'type' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              {
                title: '优先级',
                dataIndex: 'priority',
                render: (_, record) => {
                  const priority = priorityMap[record.priority];
                  return <Tag color={priority?.color}>{priority?.text}</Tag>;
                },
              },
              {
                title: '进度',
                dataIndex: 'progress',
                render: (_, record) => <Progress percent={record.progress} size="small" />,
              },
              { title: '负责人', dataIndex: 'assignee' },
              { title: '截止日期', dataIndex: 'deadline', valueType: 'date' },
              { title: '预估工时', dataIndex: 'estimatedHours', render: (_, r) => `${r.estimatedHours}h` },
              { title: '实际工时', dataIndex: 'actualHours', render: (_, r) => `${r.actualHours}h` },
              { title: '需求描述', dataIndex: 'description', span: 2 },
              { title: '验收标准', dataIndex: 'acceptanceCriteria', span: 2 },
              { title: '创建人', dataIndex: 'createdBy' },
              { title: '创建时间', dataIndex: 'createdAt', valueType: 'date' },
              { title: '备注', dataIndex: 'remark', span: 2 },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProjectRequirementPage;
