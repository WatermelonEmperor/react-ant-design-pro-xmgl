import { PlusOutlined, DeleteOutlined, ExportOutlined, EyeOutlined, EditOutlined, DollarOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions, Table, Progress } from 'antd';
import React, { useRef, useState } from 'react';

// 收款合同数据类型
interface ReceiptContractItem {
  id: string;
  contractNo: string;
  contractName: string;
  partyA: string;
  partyB: string;
  projectName: string;
  totalAmount: number;
  receivedAmount: number;
  status: string;
  signDate: string;
  startDate: string;
  endDate: string;
  paymentTerms: string;
  remark?: string;
  createdAt: string;
  payments?: PaymentRecord[];
}

interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  remark?: string;
}

// 模拟数据
const mockData: ReceiptContractItem[] = [
  {
    id: '1',
    contractNo: 'RC-2024-001',
    contractName: '智慧城市项目开发合同',
    partyA: '某市政府信息中心',
    partyB: '本公司',
    projectName: '智慧城市综合管理平台',
    totalAmount: 1500000,
    receivedAmount: 750000,
    status: 'executing',
    signDate: '2024-01-15',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    paymentTerms: '分三期付款：首付50%、验收30%、质保期满20%',
    createdAt: '2024-01-15',
    payments: [
      { id: '1', amount: 750000, paymentDate: '2024-02-05', paymentMethod: '银行转账', remark: '首付款' },
    ],
  },
  {
    id: '2',
    contractNo: 'RC-2024-002',
    contractName: '数据分析系统采购合同',
    partyA: '某大型企业',
    partyB: '本公司',
    projectName: '企业数据分析平台',
    totalAmount: 800000,
    receivedAmount: 800000,
    status: 'completed',
    signDate: '2024-01-20',
    startDate: '2024-02-15',
    endDate: '2024-06-30',
    paymentTerms: '一次性付清',
    createdAt: '2024-01-20',
    payments: [
      { id: '1', amount: 800000, paymentDate: '2024-02-20', paymentMethod: '银行转账', remark: '全款' },
    ],
  },
  {
    id: '3',
    contractNo: 'RC-2024-003',
    contractName: 'AI系统开发合同',
    partyA: '某科技集团',
    partyB: '本公司',
    projectName: 'AI智能客服系统',
    totalAmount: 2000000,
    receivedAmount: 0,
    status: 'pending',
    signDate: '2024-03-01',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    paymentTerms: '分四期付款',
    createdAt: '2024-03-01',
    payments: [],
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待执行', color: 'blue' },
  executing: { text: '执行中', color: 'processing' },
  completed: { text: '已完成', color: 'success' },
  terminated: { text: '已终止', color: 'error' },
};

const ReceiptContractPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<ReceiptContractItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ReceiptContractItem[]>(mockData);

  const columns: ProColumns<ReceiptContractItem>[] = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      width: 130,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          {record.contractNo}
        </a>
      ),
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      ellipsis: true,
      width: 200,
    },
    {
      title: '甲方',
      dataIndex: 'partyA',
      ellipsis: true,
      width: 150,
    },
    {
      title: '关联项目',
      dataIndex: 'projectName',
      ellipsis: true,
      width: 180,
      hideInSearch: true,
    },
    {
      title: '合同金额',
      dataIndex: 'totalAmount',
      width: 130,
      hideInSearch: true,
      render: (_, record) => `¥${record.totalAmount.toLocaleString()}`,
    },
    {
      title: '已收款',
      dataIndex: 'receivedAmount',
      width: 130,
      hideInSearch: true,
      render: (_, record) => (
        <span style={{ color: record.receivedAmount > 0 ? '#52c41a' : '#999' }}>
          ¥{record.receivedAmount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '收款进度',
      dataIndex: 'progress',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        const percent = Math.round((record.receivedAmount / record.totalAmount) * 100);
        return <Progress percent={percent} size="small" />;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        draft: { text: '草稿' },
        pending: { text: '待执行' },
        executing: { text: '执行中' },
        completed: { text: '已完成' },
        terminated: { text: '已终止' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '签订日期',
      dataIndex: 'signDate',
      valueType: 'date',
      width: 110,
    },
    {
      title: '合同期限',
      dataIndex: 'dateRange',
      width: 200,
      hideInSearch: true,
      render: (_, record) => `${record.startDate} 至 ${record.endDate}`,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
            <EyeOutlined /> 查看
          </a>
          <a onClick={() => { setCurrentRow(record); setEditModalVisible(true); }}>
            <EditOutlined /> 编辑
          </a>
          <a onClick={() => { setCurrentRow(record); setPaymentModalVisible(true); }}>
            <DollarOutlined /> 收款
          </a>
        </Space>
      ),
    },
  ];

  const handleAdd = async (values: Partial<ReceiptContractItem>) => {
    const newItem: ReceiptContractItem = {
      id: Date.now().toString(),
      contractNo: `RC-${new Date().getFullYear()}-${String(dataSource.length + 1).padStart(3, '0')}`,
      contractName: values.contractName || '',
      partyA: values.partyA || '',
      partyB: values.partyB || '本公司',
      projectName: values.projectName || '',
      totalAmount: values.totalAmount || 0,
      receivedAmount: 0,
      status: 'draft',
      signDate: values.signDate || '',
      startDate: values.startDate || '',
      endDate: values.endDate || '',
      paymentTerms: values.paymentTerms || '',
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
      payments: [],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增合同成功');
    return true;
  };

  const handleEdit = async (values: Partial<ReceiptContractItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑合同成功');
    return true;
  };

  const handlePayment = async (values: { amount: number; paymentDate: string; paymentMethod: string; remark?: string }) => {
    if (!currentRow) return false;
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      ...values,
    };
    const newData = dataSource.map(item => {
      if (item.id === currentRow.id) {
        const payments = [...(item.payments || []), newPayment];
        const receivedAmount = item.receivedAmount + values.amount;
        const status = receivedAmount >= item.totalAmount ? 'completed' : 'executing';
        return { ...item, payments, receivedAmount, status };
      }
      return item;
    });
    setDataSource(newData);
    message.success('收款登记成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<ReceiptContractItem>
        headerTitle="收款合同列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1600 }}
        search={{ labelWidth: 100 }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新增合同
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的合同吗？"
              onConfirm={() => handleDelete(selectedRowKeys as string[])}
            >
              <Button danger icon={<DeleteOutlined />}>
                批量删除
              </Button>
            </Popconfirm>
          ),
          <Button key="export" icon={<ExportOutlined />}>导出</Button>,
        ]}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ defaultPageSize: 10 }}
      />

      {/* 新增合同弹窗 */}
      <ModalForm
        title="新增收款合同"
        width={700}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="contractName" label="合同名称" rules={[{ required: true }]} />
        <ProFormText name="partyA" label="甲方名称" rules={[{ required: true }]} />
        <ProFormText name="partyB" label="乙方名称" initialValue="本公司" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" rules={[{ required: true }]} />
        <ProFormDigit name="totalAmount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} rules={[{ required: true }]} />
        <ProFormTextArea name="paymentTerms" label="付款条款" rules={[{ required: true }]} />
        <ProFormDatePicker name="signDate" label="签订日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="startDate" label="开始日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="endDate" label="结束日期" rules={[{ required: true }]} />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      {/* 编辑合同弹窗 */}
      <ModalForm
        title="编辑收款合同"
        width={700}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleEdit}
        initialValues={currentRow}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="contractName" label="合同名称" rules={[{ required: true }]} />
        <ProFormText name="partyA" label="甲方名称" rules={[{ required: true }]} />
        <ProFormText name="partyB" label="乙方名称" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" rules={[{ required: true }]} />
        <ProFormDigit name="totalAmount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} rules={[{ required: true }]} />
        <ProFormTextArea name="paymentTerms" label="付款条款" rules={[{ required: true }]} />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '草稿', value: 'draft' },
            { label: '待执行', value: 'pending' },
            { label: '执行中', value: 'executing' },
            { label: '已完成', value: 'completed' },
            { label: '已终止', value: 'terminated' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="signDate" label="签订日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="startDate" label="开始日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="endDate" label="结束日期" rules={[{ required: true }]} />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      {/* 收款登记弹窗 */}
      <ModalForm
        title={`收款登记 - ${currentRow?.contractName}`}
        width={500}
        open={paymentModalVisible}
        onOpenChange={setPaymentModalVisible}
        onFinish={handlePayment}
        modalProps={{ destroyOnClose: true }}
      >
        <Descriptions column={1} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="合同金额">¥{currentRow?.totalAmount?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="已收款">¥{currentRow?.receivedAmount?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="待收款">
            ¥{((currentRow?.totalAmount || 0) - (currentRow?.receivedAmount || 0)).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        <ProFormDigit 
          name="amount" 
          label="收款金额" 
          min={0} 
          max={(currentRow?.totalAmount || 0) - (currentRow?.receivedAmount || 0)}
          fieldProps={{ precision: 2, prefix: '¥' }} 
          rules={[{ required: true }]} 
        />
        <ProFormDatePicker name="paymentDate" label="收款日期" rules={[{ required: true }]} />
        <ProFormSelect
          name="paymentMethod"
          label="收款方式"
          options={[
            { label: '银行转账', value: '银行转账' },
            { label: '支票', value: '支票' },
            { label: '现金', value: '现金' },
            { label: '其他', value: '其他' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      {/* 详情抽屉 */}
      <Drawer
        title="合同详情"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="合同编号">{currentRow.contractNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="合同名称" span={2}>{currentRow.contractName}</Descriptions.Item>
              <Descriptions.Item label="甲方">{currentRow.partyA}</Descriptions.Item>
              <Descriptions.Item label="乙方">{currentRow.partyB}</Descriptions.Item>
              <Descriptions.Item label="关联项目" span={2}>{currentRow.projectName}</Descriptions.Item>
              <Descriptions.Item label="合同金额">¥{currentRow.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="已收款">¥{currentRow.receivedAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="收款进度" span={2}>
                <Progress percent={Math.round((currentRow.receivedAmount / currentRow.totalAmount) * 100)} />
              </Descriptions.Item>
              <Descriptions.Item label="签订日期">{currentRow.signDate}</Descriptions.Item>
              <Descriptions.Item label="合同期限">{currentRow.startDate} 至 {currentRow.endDate}</Descriptions.Item>
              <Descriptions.Item label="付款条款" span={2}>{currentRow.paymentTerms}</Descriptions.Item>
              {currentRow.remark && (
                <Descriptions.Item label="备注" span={2}>{currentRow.remark}</Descriptions.Item>
              )}
            </Descriptions>
            
            <h4 style={{ marginTop: 24, marginBottom: 16 }}>收款记录</h4>
            <Table
              dataSource={currentRow.payments}
              rowKey="id"
              pagination={false}
              columns={[
                { title: '收款金额', dataIndex: 'amount', render: (v: number) => `¥${v.toLocaleString()}` },
                { title: '收款日期', dataIndex: 'paymentDate' },
                { title: '收款方式', dataIndex: 'paymentMethod' },
                { title: '备注', dataIndex: 'remark' },
              ]}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ReceiptContractPage;
