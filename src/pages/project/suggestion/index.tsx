import { DeleteOutlined, EditOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { Paragraph } = Typography;

type SuggestionItem = {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  type: string;
  status: number;
  priority: number;
  content: string;
  proposer: string;
  handler?: string;
  feedback?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

const mockData: SuggestionItem[] = [
  {
    id: '1',
    title: '优化系统登录流程',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '功能优化',
    status: 1,
    priority: 2,
    content: '建议在登录页面增加记住密码功能，并支持指纹/面部识别登录',
    proposer: '张三',
    handler: '李四',
    feedback: '已采纳，将在下个版本实现',
    likes: 5,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    title: '增加数据导出功能',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    type: '新功能',
    status: 0,
    priority: 1,
    content: '建议增加交通数据的Excel和PDF导出功能，方便生成报告',
    proposer: '王五',
    likes: 8,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12',
  },
  {
    id: '3',
    title: '改进用户界面交互',
    projectId: '2',
    projectName: '医疗信息化平台升级',
    type: 'UI改进',
    status: 2,
    priority: 3,
    content: '建议简化操作流程，减少点击次数，提升用户体验',
    proposer: '李四',
    handler: '赵六',
    feedback: '已完成界面优化',
    likes: 3,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-18',
  },
  {
    id: '4',
    title: '增强系统安全性',
    type: '安全建议',
    status: 1,
    priority: 1,
    content: '建议增加双因素认证和操作审计日志功能',
    proposer: '赵六',
    handler: '张三',
    likes: 12,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-16',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待处理', color: 'default' },
  1: { text: '处理中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已拒绝', color: 'error' },
};

const priorityMap: Record<number, { text: string; color: string }> = {
  1: { text: '高', color: 'red' },
  2: { text: '中', color: 'orange' },
  3: { text: '低', color: 'blue' },
};

const ProjectSuggestionPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<SuggestionItem>();

  const handleAdd = async (fields: Partial<SuggestionItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<SuggestionItem>) => {
    message.success('更新成功');
    return true;
  };

  const confirmDelete = (record: SuggestionItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除建议「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<SuggestionItem>[] = [
    {
      title: '建议标题',
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
      width: 100,
      valueType: 'select',
      valueEnum: {
        功能优化: { text: '功能优化' },
        新功能: { text: '新功能' },
        UI改进: { text: 'UI改进' },
        安全建议: { text: '安全建议' },
        其他: { text: '其他' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '待处理' },
        1: { text: '处理中' },
        2: { text: '已完成' },
        3: { text: '已拒绝' },
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
      title: '建议内容',
      dataIndex: 'content',
      ellipsis: true,
      width: 250,
      hideInSearch: true,
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, tooltip: text }} style={{ marginBottom: 0 }}>
          {text as string}
        </Paragraph>
      ),
    },
    {
      title: '提议人',
      dataIndex: 'proposer',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <span>
          <LikeOutlined style={{ marginRight: 4 }} />
          {record.likes}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
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

  return (
    <PageContainer>
      <ProTable<SuggestionItem>
        headerTitle="工程建议列表"
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
            新增建议
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
        scroll={{ x: 1300 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ModalForm
        title="新增建议"
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
        <ProFormText name="title" label="建议标题" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="建议类型"
          options={[
            { label: '功能优化', value: '功能优化' },
            { label: '新功能', value: '新功能' },
            { label: 'UI改进', value: 'UI改进' },
            { label: '安全建议', value: '安全建议' },
            { label: '其他', value: '其他' },
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
        <ProFormTextArea name="content" label="建议内容" rules={[{ required: true }]} fieldProps={{ rows: 4 }} />
      </ModalForm>

      <ModalForm
        title="编辑建议"
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
        <ProFormText name="title" label="建议标题" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="建议类型"
          options={[
            { label: '功能优化', value: '功能优化' },
            { label: '新功能', value: '新功能' },
            { label: 'UI改进', value: 'UI改进' },
            { label: '安全建议', value: '安全建议' },
            { label: '其他', value: '其他' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '待处理', value: 0 },
            { label: '处理中', value: 1 },
            { label: '已完成', value: 2 },
            { label: '已拒绝', value: 3 },
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
        <ProFormTextArea name="content" label="建议内容" rules={[{ required: true }]} fieldProps={{ rows: 4 }} />
        <ProFormTextArea name="feedback" label="处理反馈" fieldProps={{ rows: 3 }} />
      </ModalForm>
    </PageContainer>
  );
};

export default ProjectSuggestionPage;
