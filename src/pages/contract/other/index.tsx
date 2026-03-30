import { PlusOutlined, DeleteOutlined, ExportOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
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
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions } from 'antd';
import React, { useRef, useState } from 'react';

// 其他合同数据类型
interface OtherContractItem {
  id: string;
  contractNo: string;
  contractName: string;
  contractType: string;
  partyA: string;
  partyB: string;
  amount: number;
  status: string;
  signDate: string;
  startDate: string;
  endDate: string;
  description?: string;
  remark?: string;
  createdAt: string;
  attachments?: string[];
}

// 模拟数据
const mockData: OtherContractItem[] = [
  {
    id: '1',
    contractNo: 'OC-2024-001',
    contractName: '办公场地租赁合同',
    contractType: 'lease',
    partyA: '本公司',
    partyB: '某物业管理公司',
    amount: 360000,
    status: 'executing',
    signDate: '2024-01-01',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    description: '公司总部办公场地年度租赁合同',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    contractNo: 'OC-2024-002',
    contractName: '设备采购合同',
    contractType: 'purchase',
    partyA: '本公司',
    partyB: '某设备供应商',
    amount: 150000,
    status: 'completed',
    signDate: '2024-02-15',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    description: '服务器及网络设备采购',
    createdAt: '2024-02-15',
  },
  {
    id: '3',
    contractNo: 'OC-2024-003',
    contractName: '保密协议',
    contractType: 'nda',
    partyA: '本公司',
    partyB: '某合作伙伴',
    amount: 0,
    status: 'executing',
    signDate: '2024-03-01',
    startDate: '2024-03-01',
    endDate: '2027-02-28',
    description: '与合作伙伴签订的三年期保密协议',
    createdAt: '2024-03-01',
  },
  {
    id: '4',
    contractNo: 'OC-2024-004',
    contractName: '软件授权许可合同',
    contractType: 'license',
    partyA: '本公司',
    partyB: '某软件公司',
    amount: 50000,
    status: 'executing',
    signDate: '2024-01-10',
    startDate: '2024-01-10',
    endDate: '2025-01-09',
    description: '企业版软件年度授权',
    createdAt: '2024-01-10',
  },
  {
    id: '5',
    contractNo: 'OC-2024-005',
    contractName: '战略合作框架协议',
    contractType: 'cooperation',
    partyA: '本公司',
    partyB: '某高校研究院',
    amount: 0,
    status: 'pending',
    signDate: '2024-03-20',
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    description: '产学研合作框架协议',
    createdAt: '2024-03-20',
  },
];

const contractTypeMap: Record<string, { text: string; color: string }> = {
  lease: { text: '租赁合同', color: 'blue' },
  purchase: { text: '采购合同', color: 'cyan' },
  nda: { text: '保密协议', color: 'purple' },
  license: { text: '授权许可', color: 'orange' },
  cooperation: { text: '合作协议', color: 'green' },
  service: { text: '服务合同', color: 'geekblue' },
  other: { text: '其他', color: 'default' },
};

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  pending: { text: '待执行', color: 'blue' },
  executing: { text: '执行中', color: 'processing' },
  completed: { text: '已完成', color: 'success' },
  terminated: { text: '已终止', color: 'error' },
  expired: { text: '已过期', color: 'warning' },
};

const OtherContractPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<OtherContractItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<OtherContractItem[]>(mockData);

  const columns: ProColumns<OtherContractItem>[] = [
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
      title: '合同类型',
      dataIndex: 'contractType',
      width: 110,
      valueType: 'select',
      valueEnum: {
        lease: { text: '租赁合同' },
        purchase: { text: '采购合同' },
        nda: { text: '保密协议' },
        license: { text: '授权许可' },
        cooperation: { text: '合作协议' },
        service: { text: '服务合同' },
        other: { text: '其他' },
      },
      render: (_, record) => (
        <Tag color={contractTypeMap[record.contractType]?.color}>
          {contractTypeMap[record.contractType]?.text}
        </Tag>
      ),
    },
    {
      title: '甲方',
      dataIndex: 'partyA',
      ellipsis: true,
      width: 150,
    },
    {
      title: '乙方',
      dataIndex: 'partyB',
      ellipsis: true,
      width: 150,
    },
    {
      title: '合同金额',
      dataIndex: 'amount',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.amount > 0 ? `¥${record.amount.toLocaleString()}` : '-',
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
        expired: { text: '已过期' },
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
      title: '有效期限',
      dataIndex: 'dateRange',
      width: 200,
      hideInSearch: true,
      render: (_, record) => `${record.startDate} 至 ${record.endDate}`,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
            <EyeOutlined /> 查看
          </a>
          <a onClick={() => { setCurrentRow(record); setEditModalVisible(true); }}>
            <EditOutlined /> 编辑
          </a>
          <Popconfirm
            title="确定要删除此合同吗？"
            onConfirm={() => handleDelete([record.id])}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = async (values: Partial<OtherContractItem>) => {
    const newItem: OtherContractItem = {
      id: Date.now().toString(),
      contractNo: `OC-${new Date().getFullYear()}-${String(dataSource.length + 1).padStart(3, '0')}`,
      contractName: values.contractName || '',
      contractType: values.contractType || 'other',
      partyA: values.partyA || '',
      partyB: values.partyB || '',
      amount: values.amount || 0,
      status: 'draft',
      signDate: values.signDate || '',
      startDate: values.startDate || '',
      endDate: values.endDate || '',
      description: values.description,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增合同成功');
    return true;
  };

  const handleEdit = async (values: Partial<OtherContractItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item =>
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑合同成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<OtherContractItem>
        headerTitle="其他合同列表"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1500 }}
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
        title="新增其他合同"
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
        <ProFormSelect
          name="contractType"
          label="合同类型"
          options={[
            { label: '租赁合同', value: 'lease' },
            { label: '采购合同', value: 'purchase' },
            { label: '保密协议', value: 'nda' },
            { label: '授权许可', value: 'license' },
            { label: '合作协议', value: 'cooperation' },
            { label: '服务合同', value: 'service' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="partyA" label="甲方名称" initialValue="本公司" rules={[{ required: true }]} />
        <ProFormText name="partyB" label="乙方名称" rules={[{ required: true }]} />
        <ProFormDigit name="amount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} />
        <ProFormDatePicker name="signDate" label="签订日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="startDate" label="开始日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="endDate" label="结束日期" rules={[{ required: true }]} />
        <ProFormTextArea name="description" label="合同描述" />
        <ProFormTextArea name="remark" label="备注" />
        <ProFormUploadButton
          name="attachments"
          label="附件"
          title="上传附件"
          max={5}
          fieldProps={{
            name: 'file',
            listType: 'text',
          }}
        />
      </ModalForm>

      {/* 编辑合同弹窗 */}
      <ModalForm
        title="编辑其他合同"
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
        <ProFormSelect
          name="contractType"
          label="合同类型"
          options={[
            { label: '租赁合同', value: 'lease' },
            { label: '采购合同', value: 'purchase' },
            { label: '保密协议', value: 'nda' },
            { label: '授权许可', value: 'license' },
            { label: '合作协议', value: 'cooperation' },
            { label: '服务合同', value: 'service' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="partyA" label="甲方名称" rules={[{ required: true }]} />
        <ProFormText name="partyB" label="乙方名称" rules={[{ required: true }]} />
        <ProFormDigit name="amount" label="合同金额" min={0} fieldProps={{ precision: 2, prefix: '¥' }} />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '草稿', value: 'draft' },
            { label: '待执行', value: 'pending' },
            { label: '执行中', value: 'executing' },
            { label: '已完成', value: 'completed' },
            { label: '已终止', value: 'terminated' },
            { label: '已过期', value: 'expired' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="signDate" label="签订日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="startDate" label="开始日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="endDate" label="结束日期" rules={[{ required: true }]} />
        <ProFormTextArea name="description" label="合同描述" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      {/* 详情抽屉 */}
      <Drawer
        title="合同详情"
        width={640}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="合同编号">{currentRow.contractNo}</Descriptions.Item>
            <Descriptions.Item label="合同类型">
              <Tag color={contractTypeMap[currentRow.contractType]?.color}>
                {contractTypeMap[currentRow.contractType]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="合同名称" span={2}>{currentRow.contractName}</Descriptions.Item>
            <Descriptions.Item label="甲方">{currentRow.partyA}</Descriptions.Item>
            <Descriptions.Item label="乙方">{currentRow.partyB}</Descriptions.Item>
            <Descriptions.Item label="合同金额">
              {currentRow.amount > 0 ? `¥${currentRow.amount.toLocaleString()}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="签订日期">{currentRow.signDate}</Descriptions.Item>
            <Descriptions.Item label="有效期限">{currentRow.startDate} 至 {currentRow.endDate}</Descriptions.Item>
            {currentRow.description && (
              <Descriptions.Item label="合同描述" span={2}>{currentRow.description}</Descriptions.Item>
            )}
            {currentRow.remark && (
              <Descriptions.Item label="备注" span={2}>{currentRow.remark}</Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间" span={2}>{currentRow.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OtherContractPage;
