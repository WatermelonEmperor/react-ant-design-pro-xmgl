import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

type MeetingItem = {
  id: string;
  title: string;
  type: string;
  status: number;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  participants: string[];
  agenda: string;
  summary: string;
  decisions: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

const mockData: MeetingItem[] = [
  {
    id: '1',
    title: '智慧城市项目周例会',
    type: '项目例会',
    status: 2,
    startTime: '2024-03-15 14:00',
    endTime: '2024-03-15 15:30',
    location: '会议室A',
    organizer: '张三',
    participants: ['李四', '王五', '赵六'],
    agenda: '1. 上周工作回顾\n2. 本周工作计划\n3. 问题讨论',
    summary: '完成了需求分析和原型设计，下周开始编码工作',
    decisions: '1. 确定使用React技术栈\n2. 下周三前完成数据库设计',
    attachments: [],
    createdAt: '2024-03-14',
    updatedAt: '2024-03-15',
    createdBy: '张三',
  },
  {
    id: '2',
    title: '技术方案评审会',
    type: '评审会议',
    status: 2,
    startTime: '2024-03-18 10:00',
    endTime: '2024-03-18 12:00',
    location: '线上会议',
    organizer: '李四',
    participants: ['张三', '王五', '技术专家组'],
    agenda: '1. 方案介绍\n2. 专家评审\n3. 问题答疑',
    summary: '技术方案通过评审，部分细节需要优化',
    decisions: '方案通过，需要在安全性方面加强设计',
    attachments: [],
    createdAt: '2024-03-16',
    updatedAt: '2024-03-18',
    createdBy: '李四',
  },
  {
    id: '3',
    title: '团队月度总结会',
    type: '总结会议',
    status: 1,
    startTime: '2024-03-22 15:00',
    endTime: '2024-03-22 17:00',
    location: '大会议室',
    organizer: '王五',
    participants: ['全体成员'],
    agenda: '1. 月度工作总结\n2. 优秀员工表彰\n3. 下月计划',
    summary: '',
    decisions: '',
    attachments: [],
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
    createdBy: '王五',
  },
  {
    id: '4',
    title: '客户需求沟通会',
    type: '客户会议',
    status: 0,
    startTime: '2024-03-25 09:30',
    endTime: '2024-03-25 11:00',
    location: '客户公司',
    organizer: '赵六',
    participants: ['张三', '客户代表'],
    agenda: '1. 需求确认\n2. 进度汇报\n3. 问题沟通',
    summary: '',
    decisions: '',
    attachments: [],
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19',
    createdBy: '赵六',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待开始', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已结束', color: 'success' },
  3: { text: '已取消', color: 'error' },
};

const typeOptions = [
  { label: '项目例会', value: '项目例会' },
  { label: '评审会议', value: '评审会议' },
  { label: '总结会议', value: '总结会议' },
  { label: '客户会议', value: '客户会议' },
  { label: '培训会议', value: '培训会议' },
  { label: '其他', value: '其他' },
];

const MeetingPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<MeetingItem>();

  const handleAdd = async (fields: Partial<MeetingItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<MeetingItem>) => {
    message.success('更新成功');
    return true;
  };

  const confirmDelete = (record: MeetingItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除会议「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<MeetingItem>[] = [
    {
      title: '会议主题',
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
      title: '会议类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        项目例会: { text: '项目例会' },
        评审会议: { text: '评审会议' },
        总结会议: { text: '总结会议' },
        客户会议: { text: '客户会议' },
        培训会议: { text: '培训会议' },
        其他: { text: '其他' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: {
        0: { text: '待开始' },
        1: { text: '进行中' },
        2: { text: '已结束' },
        3: { text: '已取消' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '会议地点',
      dataIndex: 'location',
      width: 120,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '组织者',
      dataIndex: 'organizer',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '参会人员',
      dataIndex: 'participants',
      width: 150,
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => record.participants?.join(', ') || '-',
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
      <ProFormText name="title" label="会议主题" rules={[{ required: true }]} />
      <ProFormSelect
        name="type"
        label="会议类型"
        options={typeOptions}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '待开始', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已结束', value: 2 },
          { label: '已取消', value: 3 },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormDateTimePicker name="startTime" label="开始时间" width="xl" rules={[{ required: true }]} />
      <ProFormDateTimePicker name="endTime" label="结束时间" width="xl" rules={[{ required: true }]} />
      <ProFormText name="location" label="会议地点" rules={[{ required: true }]} />
      <ProFormText name="organizer" label="组织者" rules={[{ required: true }]} />
      <ProFormTextArea name="agenda" label="会议议程" fieldProps={{ rows: 3 }} />
      <ProFormTextArea name="summary" label="会议纪要" fieldProps={{ rows: 3 }} />
      <ProFormTextArea name="decisions" label="会议决议" fieldProps={{ rows: 3 }} />
    </>
  );

  return (
    <PageContainer>
      <ProTable<MeetingItem>
        headerTitle="组会列表"
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
            新增会议
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
        title="新增会议"
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
        title="编辑会议"
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
        title="会议详情"
      >
        {currentRow && (
          <ProDescriptions<MeetingItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '会议主题', dataIndex: 'title', span: 2 },
              { title: '会议类型', dataIndex: 'type' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              { title: '开始时间', dataIndex: 'startTime' },
              { title: '结束时间', dataIndex: 'endTime' },
              { title: '会议地点', dataIndex: 'location' },
              { title: '组织者', dataIndex: 'organizer' },
              {
                title: '参会人员',
                dataIndex: 'participants',
                span: 2,
                render: (_, record) => record.participants?.join(', ') || '-',
              },
              { title: '会议议程', dataIndex: 'agenda', span: 2 },
              { title: '会议纪要', dataIndex: 'summary', span: 2 },
              { title: '会议决议', dataIndex: 'decisions', span: 2 },
              { title: '创建人', dataIndex: 'createdBy' },
              { title: '创建时间', dataIndex: 'createdAt', valueType: 'date' },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MeetingPage;
