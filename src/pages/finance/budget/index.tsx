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
  StatisticCard,
} from '@ant-design/pro-components';
import { Button, Col, Drawer, message, Modal, Progress, Row, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

type BudgetItem = {
  id: string;
  name: string;
  projectId?: string;
  projectName?: string;
  category: string;
  year: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  status: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

const mockData: BudgetItem[] = [
  {
    id: '1',
    name: '智慧城市项目年度预算',
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    category: '项目预算',
    year: 2024,
    totalBudget: 500000,
    usedBudget: 280000,
    remainingBudget: 220000,
    status: 1,
    description: '智慧城市项目2024年度开发和运维预算',
    createdAt: '2024-01-05',
    updatedAt: '2024-03-15',
    createdBy: '张三',
    remark: '',
  },
  {
    id: '2',
    name: '设备采购预算',
    category: '设备采购',
    year: 2024,
    totalBudget: 200000,
    usedBudget: 85000,
    remainingBudget: 115000,
    status: 1,
    description: '2024年度办公设备和服务器采购预算',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-10',
    createdBy: '李四',
    remark: '',
  },
  {
    id: '3',
    name: '差旅费用预算',
    category: '差旅费用',
    year: 2024,
    totalBudget: 100000,
    usedBudget: 45000,
    remainingBudget: 55000,
    status: 1,
    description: '2024年度出差和培训费用预算',
    createdAt: '2024-01-08',
    updatedAt: '2024-03-18',
    createdBy: '王五',
    remark: '',
  },
  {
    id: '4',
    name: '人员培训预算',
    category: '培训费用',
    year: 2024,
    totalBudget: 80000,
    usedBudget: 20000,
    remainingBudget: 60000,
    status: 1,
    description: '2024年度技术培训和认证费用',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
    createdBy: '赵六',
    remark: '',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '未启用', color: 'default' },
  1: { text: '执行中', color: 'processing' },
  2: { text: '已结束', color: 'success' },
  3: { text: '已超支', color: 'error' },
};

const categoryOptions = [
  { label: '项目预算', value: '项目预算' },
  { label: '设备采购', value: '设备采购' },
  { label: '差旅费用', value: '差旅费用' },
  { label: '培训费用', value: '培训费用' },
  { label: '办公费用', value: '办公费用' },
  { label: '其他', value: '其他' },
];

const BudgetPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<BudgetItem>();

  const handleAdd = async (fields: Partial<BudgetItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<BudgetItem>) => {
    message.success('更新成功');
    return true;
  };

  const confirmDelete = (record: BudgetItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除预算「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  // 计算统计数据
  const totalBudget = mockData.reduce((sum, item) => sum + item.totalBudget, 0);
  const usedBudget = mockData.reduce((sum, item) => sum + item.usedBudget, 0);
  const remainingBudget = mockData.reduce((sum, item) => sum + item.remainingBudget, 0);
  const usageRate = Math.round((usedBudget / totalBudget) * 100);

  const columns: ProColumns<BudgetItem>[] = [
    {
      title: '预算名称',
      dataIndex: 'name',
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
      render: (text) => text || '-',
    },
    {
      title: '预算类别',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: Object.fromEntries(categoryOptions.map((o) => [o.value, { text: o.label }])),
    },
    {
      title: '年度',
      dataIndex: 'year',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '预算金额',
      dataIndex: 'totalBudget',
      width: 120,
      hideInSearch: true,
      render: (_, record) => `¥${record.totalBudget.toLocaleString()}`,
    },
    {
      title: '已使用',
      dataIndex: 'usedBudget',
      width: 120,
      hideInSearch: true,
      render: (_, record) => `¥${record.usedBudget.toLocaleString()}`,
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const rate = Math.round((record.usedBudget / record.totalBudget) * 100);
        return (
          <Progress
            percent={rate}
            size="small"
            strokeColor={rate > 90 ? '#ff4d4f' : rate > 70 ? '#faad14' : '#52c41a'}
          />
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: {
        0: { text: '未启用' },
        1: { text: '执行中' },
        2: { text: '已结束' },
        3: { text: '已超支' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
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
      <ProFormText name="name" label="预算名称" rules={[{ required: true }]} />
      <ProFormSelect
        name="category"
        label="预算类别"
        options={categoryOptions}
        rules={[{ required: true }]}
      />
      <ProFormDigit name="year" label="年度" rules={[{ required: true }]} min={2020} max={2030} />
      <ProFormDigit
        name="totalBudget"
        label="预算金额(元)"
        rules={[{ required: true }]}
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormDigit
        name="usedBudget"
        label="已使用金额(元)"
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '未启用', value: 0 },
          { label: '执行中', value: 1 },
          { label: '已结束', value: 2 },
          { label: '已超支', value: 3 },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="description" label="预算说明" fieldProps={{ rows: 3 }} />
      <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 2 }} />
    </>
  );

  return (
    <PageContainer>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '总预算',
              value: totalBudget,
              prefix: '¥',
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '已使用',
              value: usedBudget,
              prefix: '¥',
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '剩余预算',
              value: remainingBudget,
              prefix: '¥',
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '总体使用率',
              value: usageRate,
              suffix: '%',
            }}
            chart={<Progress percent={usageRate} showInfo={false} />}
          />
        </Col>
      </Row>

      <ProTable<BudgetItem>
        headerTitle="预算列表"
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
            新增预算
          </Button>,
        ]}
        request={async (params) => {
          let filteredData = [...mockData];
          if (params.name) {
            filteredData = filteredData.filter((item) => item.name.includes(params.name));
          }
          if (params.category) {
            filteredData = filteredData.filter((item) => item.category === params.category);
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
        title="新增预算"
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
        title="编辑预算"
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

      <Drawer
        width={640}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        title="预算详情"
      >
        {currentRow && (
          <ProDescriptions<BudgetItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '预算名称', dataIndex: 'name', span: 2 },
              { title: '所属项目', dataIndex: 'projectName', render: (text) => text || '-' },
              { title: '预算类别', dataIndex: 'category' },
              { title: '年度', dataIndex: 'year' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              {
                title: '预算金额',
                dataIndex: 'totalBudget',
                render: (_, record) => `¥${record.totalBudget.toLocaleString()}`,
              },
              {
                title: '已使用',
                dataIndex: 'usedBudget',
                render: (_, record) => `¥${record.usedBudget.toLocaleString()}`,
              },
              {
                title: '剩余预算',
                dataIndex: 'remainingBudget',
                render: (_, record) => `¥${record.remainingBudget.toLocaleString()}`,
              },
              {
                title: '使用率',
                dataIndex: 'usageRate',
                render: (_, record) => {
                  const rate = Math.round((record.usedBudget / record.totalBudget) * 100);
                  return <Progress percent={rate} size="small" />;
                },
              },
              { title: '预算说明', dataIndex: 'description', span: 2 },
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

export default BudgetPage;
