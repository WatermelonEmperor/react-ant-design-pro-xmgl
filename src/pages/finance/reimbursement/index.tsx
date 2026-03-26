import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';

type ReimbursementItem = {
  id: string;
  code: string;
  title: string;
  applicant: string;
  department: string;
  type: string;
  amount: number;
  status: number;
  projectId?: string;
  projectName?: string;
  expenseDate: string;
  description: string;
  attachments: string[];
  approver?: string;
  approveTime?: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
};

const mockData: ReimbursementItem[] = [
  {
    id: '1',
    code: 'BX-2024-001',
    title: '项目出差费用报销',
    applicant: '张三',
    department: '技术部',
    type: '差旅费',
    amount: 3500,
    status: 2,
    projectId: '1',
    projectName: '智慧城市交通管理系统',
    expenseDate: '2024-03-10',
    description: '赴北京参加项目对接会议，包含机票、住宿、餐饮费用',
    attachments: [],
    approver: '李四',
    approveTime: '2024-03-15',
    createdAt: '2024-03-12',
    updatedAt: '2024-03-15',
  },
  {
    id: '2',
    code: 'BX-2024-002',
    title: '办公用品采购',
    applicant: '李四',
    department: '行政部',
    type: '办公费',
    amount: 1200,
    status: 1,
    expenseDate: '2024-03-15',
    description: '采购办公文具、打印纸等办公用品',
    attachments: [],
    createdAt: '2024-03-16',
    updatedAt: '2024-03-16',
  },
  {
    id: '3',
    code: 'BX-2024-003',
    title: '技术培训费用',
    applicant: '王五',
    department: '技术部',
    type: '培训费',
    amount: 5000,
    status: 0,
    expenseDate: '2024-03-18',
    description: '参加云计算技术培训课程费用',
    attachments: [],
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
  },
  {
    id: '4',
    code: 'BX-2024-004',
    title: '客户招待费用',
    applicant: '赵六',
    department: '销售部',
    type: '招待费',
    amount: 2800,
    status: 3,
    projectId: '2',
    projectName: '医疗信息化平台升级',
    expenseDate: '2024-03-05',
    description: '客户来访接待餐饮费用',
    attachments: [],
    approver: '张三',
    approveTime: '2024-03-08',
    rejectReason: '超出招待费用标准，请调整后重新提交',
    createdAt: '2024-03-06',
    updatedAt: '2024-03-08',
  },
  {
    id: '5',
    code: 'BX-2024-005',
    title: '设备维修费用',
    applicant: '张三',
    department: '技术部',
    type: '维修费',
    amount: 800,
    status: 2,
    expenseDate: '2024-03-12',
    description: '服务器硬盘更换及维修费用',
    attachments: [],
    approver: '王五',
    approveTime: '2024-03-14',
    createdAt: '2024-03-13',
    updatedAt: '2024-03-14',
  },
];

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待提交', color: 'default' },
  1: { text: '审批中', color: 'processing' },
  2: { text: '已通过', color: 'success' },
  3: { text: '已驳回', color: 'error' },
  4: { text: '已取消', color: 'warning' },
};

const typeOptions = [
  { label: '差旅费', value: '差旅费' },
  { label: '办公费', value: '办公费' },
  { label: '培训费', value: '培训费' },
  { label: '招待费', value: '招待费' },
  { label: '维修费', value: '维修费' },
  { label: '交通费', value: '交通费' },
  { label: '通讯费', value: '通讯费' },
  { label: '其他', value: '其他' },
];

const ReimbursementPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<ReimbursementItem>();

  const handleAdd = async (fields: Partial<ReimbursementItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<ReimbursementItem>) => {
    message.success('更新成功');
    return true;
  };

  const handleApprove = (record: ReimbursementItem) => {
    Modal.confirm({
      title: '确认审批',
      content: `确定通过报销申请「${record.title}」吗？金额：¥${record.amount}`,
      okText: '通过',
      cancelText: '取消',
      onOk: async () => {
        message.success('审批通过');
        actionRef.current?.reload();
      },
    });
  };

  const handleReject = (record: ReimbursementItem) => {
    Modal.confirm({
      title: '驳回申请',
      content: `确定驳回报销申请「${record.title}」吗？`,
      okText: '驳回',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        message.success('已驳回');
        actionRef.current?.reload();
      },
    });
  };

  const confirmDelete = (record: ReimbursementItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除报销申请「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<ReimbursementItem>[] = [
    {
      title: '报销单号',
      dataIndex: 'code',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '报销标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 180,
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
      title: '申请人',
      dataIndex: 'applicant',
      width: 100,
    },
    {
      title: '部门',
      dataIndex: 'department',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '费用类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: Object.fromEntries(typeOptions.map((o) => [o.value, { text: o.label }])),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span style={{ color: '#f5222d' }}>¥{record.amount.toLocaleString()}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: {
        0: { text: '待提交' },
        1: { text: '审批中' },
        2: { text: '已通过' },
        3: { text: '已驳回' },
        4: { text: '已取消' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      ellipsis: true,
      width: 150,
      hideInSearch: true,
      render: (text) => text || '-',
    },
    {
      title: '费用日期',
      dataIndex: 'expenseDate',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 180,
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
          {record.status === 1 && (
            <>
              <Tooltip title="通过">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="驳回">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            </>
          )}
          {(record.status === 0 || record.status === 3) && (
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
          )}
          {record.status === 0 && (
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => confirmDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const formContent = (
    <>
      <ProFormText name="title" label="报销标题" rules={[{ required: true }]} />
      <ProFormSelect
        name="type"
        label="费用类型"
        options={typeOptions}
        rules={[{ required: true }]}
      />
      <ProFormDigit
        name="amount"
        label="报销金额(元)"
        rules={[{ required: true }]}
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormDatePicker name="expenseDate" label="费用日期" width="xl" rules={[{ required: true }]} />
      <ProFormText name="applicant" label="申请人" rules={[{ required: true }]} />
      <ProFormText name="department" label="所属部门" rules={[{ required: true }]} />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '待提交', value: 0 },
          { label: '审批中', value: 1 },
          { label: '已通过', value: 2 },
          { label: '已驳回', value: 3 },
          { label: '已取消', value: 4 },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="description" label="费用说明" rules={[{ required: true }]} fieldProps={{ rows: 3 }} />
    </>
  );

  return (
    <PageContainer>
      <ProTable<ReimbursementItem>
        headerTitle="报销列表"
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
            新增报销
          </Button>,
        ]}
        request={async (params) => {
          let filteredData = [...mockData];
          if (params.title) {
            filteredData = filteredData.filter((item) => item.title.includes(params.title));
          }
          if (params.applicant) {
            filteredData = filteredData.filter((item) => item.applicant.includes(params.applicant));
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
        title="新增报销"
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
        title="编辑报销"
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
        title="报销详情"
      >
        {currentRow && (
          <ProDescriptions<ReimbursementItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '报销单号', dataIndex: 'code' },
              { title: '报销标题', dataIndex: 'title', span: 2 },
              { title: '申请人', dataIndex: 'applicant' },
              { title: '所属部门', dataIndex: 'department' },
              { title: '费用类型', dataIndex: 'type' },
              {
                title: '报销金额',
                dataIndex: 'amount',
                render: (_, record) => (
                  <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                    ¥{record.amount.toLocaleString()}
                  </span>
                ),
              },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              { title: '费用日期', dataIndex: 'expenseDate', valueType: 'date' },
              { title: '所属项目', dataIndex: 'projectName', span: 2, render: (text) => text || '-' },
              { title: '费用说明', dataIndex: 'description', span: 2 },
              { title: '审批人', dataIndex: 'approver', render: (text) => text || '-' },
              { title: '审批时间', dataIndex: 'approveTime', valueType: 'date' },
              {
                title: '驳回原因',
                dataIndex: 'rejectReason',
                span: 2,
                render: (text) => text || '-',
              },
              { title: '提交时间', dataIndex: 'createdAt', valueType: 'date' },
              { title: '更新时间', dataIndex: 'updatedAt', valueType: 'date' },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ReimbursementPage;
