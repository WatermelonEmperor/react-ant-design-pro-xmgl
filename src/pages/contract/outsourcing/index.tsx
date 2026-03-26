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

// 外协合同数据类型
interface OutsourcingContractItem {
  id: string;
  contractNo: string;
  contractName: string;
  supplier: string;
  projectName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  signDate: string;
  startDate: string;
  endDate: string;
  paymentTerms: string;
  contactPerson: string;
  contactPhone: string;
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
const mockData: OutsourcingContractItem[] = [
  {
    id: '1',
    contractNo: 'OC-2024-001',
    contractName: 'UI设计外包合同',
    supplier: '某设计公司',
    projectName: '智慧城市综合管理平台',
    totalAmount: 150000,
    paidAmount: 75000,
    status: 'executing',
    signDate: '2024-02-01',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    paymentTerms: '预付50%，验收后付50%',
    contactPerson: '张设计',
    contactPhone: '13800138001',
    createdAt: '2024-02-01',
    payments: [
      { id: '1', amount: 75000, paymentDate: '2024-02-10', paymentMethod: '银行转账', remark: '预付款' },
    ],
  },
  {
    id: '2',
    contractNo: 'OC-2024-002',
    contractName: '硬件采购合同',
    supplier: '某科技设备公司',
    projectName: '数据中心建设',
    totalAmount: 500000,
    paidAmount: 500000,
    status: 'completed',
    signDate: '2024-01-15',
    startDate: '2024-01-20',
    endDate: '2024-03-20',
    paymentTerms: '货到付款',
    contactPerson: '李经理',
    contactPhone: '13900139001',
    createdAt: '2024-01-15',
    payments: [
      { id: '1', amount: 500000, paymentDate: '2024-02-01', paymentMethod: '银行转账', remark: '全款' },
    ],
  },
  {
    id: '3',
    contractNo: 'OC-2024-003',
    contractName: '算法开发外包合同',
    supplier: '某AI研究院',
    projectName: 'AI智能客服系统',
    totalAmount: 300000,
    paidAmount: 0,
    status: 'pending',
    signDate: '2024-03-05',
    startDate: '2024-04-01',
    endDate: '2024-08-31',
    paymentTerms: '分三期付款',
    contactPerson: '王博士',
    contactPhone: '13700137001',
    createdAt: '2024-03-05',
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

const OutsourcingContractPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<OutsourcingContractItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<OutsourcingContractItem[]>(mockData);

  const columns: ProColumns<OutsourcingContractItem>[] = [
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
      width: 180,
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
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
      width: 120,
      hideInSearch: true,
      render: (_, record) => `¥${record.totalAmount.toLocaleString()}`,
    },
    {
      title: '已付款',
      dataIndex: 'paidAmount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <span style={{ color: record.paidAmount > 0 ? '#fa8c16' : '#999' }}>
          ¥{record.paidAmount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '付款进度',
      dataIndex: 'progress',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        const percent = Math.round((record.paidAmount / record.totalAmount) * 100);
        return <Progress percent={percent} size="small" strokeColor="#fa8c16" />;
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
      title: '联系人',
      dataIndex: 'contactPerson',
      width: 100,
      hideInSearch: true,
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
            <DollarOutlined /> 付款
          </a>
        </Space>
      ),
    },
  ];

  const handleAdd = async (values: Partial<OutsourcingContractItem>) => {
    const newItem: OutsourcingContractItem = {
      id: Date.now().toString(),
      contractNo: `OC-${new Date().getFullYear()}-${String(dataSource.length + 1).padStart(3, '0')}`,
      contractName: values.contractName || '',
      supplier: values.supplier || '',
      projectName: values.projectName || '',
      totalAmount: values.totalAmount || 0,
      paidAmount: 0,
      status: 'draft',
      signDate: values.signDate || '',
      startDate: values.startDate || '',
      endDate: values.endDate || '',
      paymentTerms: values.paymentTerms || '',
      contactPerson: values.contactPerson || '',
      contactPhone: values.contactPhone || '',
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
      payments: [],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增合同成功');
    return true;
  };

  const handleEdit = async (values: Partial<OutsourcingContractItem>) => {
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
        const paidAmount = item.paidAmount + values.amount;
        const status = paidAmount >= item.totalAmount ? 'completed' : 'executing';
        return { ...item, payments, paidAmount, status };
      }
      return item;
    });
    setDataSource(newData);
    message.success('付款登记成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<OutsourcingContractItem>
        headerTitle="外协合同列表"
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
        title="新增外协合同"
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
        <ProFormText name="supplier" label="供应商" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" rules={[{ required: true }]} />
        <ProFormDigit name="totalAmount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} rules={[{ required: true }]} />
        <ProFormTextArea name="paymentTerms" label="付款条款" rules={[{ required: true }]} />
        <ProFormText name="contactPerson" label="联系人" rules={[{ required: true }]} />
        <ProFormText name="contactPhone" label="联系电话" rules={[{ required: true }]} />
        <ProFormDatePicker name="signDate" label="签订日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="startDate" label="开始日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="endDate" label="结束日期" rules={[{ required: true }]} />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      {/* 编辑合同弹窗 */}
      <ModalForm
        title="编辑外协合同"
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
        <ProFormText name="supplier" label="供应商" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" rules={[{ required: true }]} />
        <ProFormDigit name="totalAmount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} rules={[{ required: true }]} />
        <ProFormTextArea name="paymentTerms" label="付款条款" rules={[{ required: true }]} />
        <ProFormText name="contactPerson" label="联系人" rules={[{ required: true }]} />
        <ProFormText name="contactPhone" label="联系电话" rules={[{ required: true }]} />
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

      {/* 付款登记弹窗 */}
      <ModalForm
        title={`付款登记 - ${currentRow?.contractName}`}
        width={500}
        open={paymentModalVisible}
        onOpenChange={setPaymentModalVisible}
        onFinish={handlePayment}
        modalProps={{ destroyOnClose: true }}
      >
        <Descriptions column={1} style={{ marginBottom: 16 }}>
          <Descriptions.Item label="合同金额">¥{currentRow?.totalAmount?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="已付款">¥{currentRow?.paidAmount?.toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="待付款">
            ¥{((currentRow?.totalAmount || 0) - (currentRow?.paidAmount || 0)).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        <ProFormDigit 
          name="amount" 
          label="付款金额" 
          min={0} 
          max={(currentRow?.totalAmount || 0) - (currentRow?.paidAmount || 0)}
          fieldProps={{ precision: 2, prefix: '¥' }} 
          rules={[{ required: true }]} 
        />
        <ProFormDatePicker name="paymentDate" label="付款日期" rules={[{ required: true }]} />
        <ProFormSelect
          name="paymentMethod"
          label="付款方式"
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
              <Descriptions.Item label="供应商" span={2}>{currentRow.supplier}</Descriptions.Item>
              <Descriptions.Item label="关联项目" span={2}>{currentRow.projectName}</Descriptions.Item>
              <Descriptions.Item label="合同金额">¥{currentRow.totalAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="已付款">¥{currentRow.paidAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="付款进度" span={2}>
                <Progress percent={Math.round((currentRow.paidAmount / currentRow.totalAmount) * 100)} strokeColor="#fa8c16" />
              </Descriptions.Item>
              <Descriptions.Item label="联系人">{currentRow.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentRow.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="签订日期">{currentRow.signDate}</Descriptions.Item>
              <Descriptions.Item label="合同期限">{currentRow.startDate} 至 {currentRow.endDate}</Descriptions.Item>
              <Descriptions.Item label="付款条款" span={2}>{currentRow.paymentTerms}</Descriptions.Item>
              {currentRow.remark && (
                <Descriptions.Item label="备注" span={2}>{currentRow.remark}</Descriptions.Item>
              )}
            </Descriptions>
            
            <h4 style={{ marginTop: 24, marginBottom: 16 }}>付款记录</h4>
            <Table
              dataSource={currentRow.payments}
              rowKey="id"
              pagination={false}
              columns={[
                { title: '付款金额', dataIndex: 'amount', render: (v: number) => `¥${v.toLocaleString()}` },
                { title: '付款日期', dataIndex: 'paymentDate' },
                { title: '付款方式', dataIndex: 'paymentMethod' },
                { title: '备注', dataIndex: 'remark' },
              ]}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OutsourcingContractPage;
