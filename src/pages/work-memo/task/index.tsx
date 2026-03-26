import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Progress, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

type TaskItem = {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  type: string;
  status: number;
  priority: number;
  progress: number;
  assignee: string;
  deadline: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

const mockData: TaskItem[] = [
  {
    id: '1',
    title: '完成需求文档编写',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '文档',
    status: 1,
    priority: 1,
    progress: 60,
    assignee: '张三',
    deadline: '2024-03-25',
    description: '编写智慧城市项目的详细需求文档',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-18',
    createdBy: '李四',
  },
  {
    id: '2',
    title: '代码审查',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '开发',
    status: 0,
    priority: 2,
    progress: 0,
    assignee: '李四',
    deadline: '2024-03-28',
    description: '对登录模块代码进行审查',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    createdBy: '张三',
  },
  {
    id: '3',
    title: '测试用例编写',
    projectId: '2',
    projectName: '医疗信息化平台升级',
    type: '测试',
    status: 2,
    priority: 2,
    progress: 100,
    assignee: '王五',
    deadline: '2024-03-20',
    description: '编写患者管理模块的测试用例',
    createdAt: '2024-03-08',
    updatedAt: '2024-03-19',
    createdBy: '李四',
  },
  {
    id: '4',
    title: '准备项目周报',
    type: '汇报',
    status: 0,
    priority: 3,
    progress: 0,
    assignee: '赵六',
    deadline: '2024-03-22',
    description: '整理本周工作进展，准备周报材料',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
    createdBy: '赵六',
  },
  {
    id: '5',
    title: '系统部署文档更新',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '文档',
    status: 1,
    priority: 2,
    progress: 30,
    assignee: '张三',
    deadline: '2024-03-30',
    description: '更新系统部署和运维文档',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-17',
    createdBy: '王五',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待处理', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已取消', color: 'error' },
};

const priorityMap: Record<number, { text: string; color: string }> = {
  1: { text: '高', color: 'red' },
  2: { text: '中', color: 'orange' },
  3: { text: '低', color: 'blue' },
};

const WorkTaskPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<TaskItem>();

  const handleAdd = async (fields: Partial<TaskItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<TaskItem>) => {
    message.success('更新成功');
    return true;
  };

  const handleComplete = (record: TaskItem) => {
    Modal.confirm({
      title: '确认完成',
      content: `确定将任务「${record.title}」标记为已完成吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('任务已完成');
        actionRef.current?.reload();
      },
    });
  };

  const confirmDelete = (record: TaskItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<TaskItem>[] = [
    {
      title: '任务标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 200,
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      ellipsis: true,
      width: 180,
      hideInSearch: true,
      render: (text) => text || '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      valueType: 'select',
      valueEnum: {
        开发: { text: '开发' },
        测试: { text: '测试' },
        文档: { text: '文档' },
        汇报: { text: '汇报' },
        会议: { text: '会议' },
        其他: { text: '其他' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: {
        0: { text: '待处理' },
        1: { text: '进行中' },
        2: { text: '已完成' },
        3: { text: '已取消' },
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
          {record.status !== 2 && (
            <Tooltip title="完成">
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleComplete(record)}
              />
            </Tooltip>
          )}
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
      <ProFormText name="title" label="任务标题" rules={[{ required: true }]} />
      <ProFormSelect
        name="type"
        label="任务类型"
        options={[
          { label: '开发', value: '开发' },
          { label: '测试', value: '测试' },
          { label: '文档', value: '文档' },
          { label: '汇报', value: '汇报' },
          { label: '会议', value: '会议' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '待处理', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已完成', value: 2 },
          { label: '已取消', value: 3 },
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
      <ProFormDatePicker name="deadline" label="截止日期" width="xl" rules={[{ required: true }]} />
      <ProFormTextArea name="description" label="任务描述" fieldProps={{ rows: 3 }} />
    </>
  );

  return (
    <PageContainer>
      <ProTable<TaskItem>
        headerTitle="任务列表"
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
            新增任务
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
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ModalForm
        title="新增任务"
        width={560}
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
        title="编辑任务"
        width={560}
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
    </PageContainer>
  );
};

export default WorkTaskPage;
