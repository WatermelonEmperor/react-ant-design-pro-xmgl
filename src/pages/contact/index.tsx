import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions, Avatar } from 'antd';
import React, { useRef, useState } from 'react';

interface ContactItem {
  id: string;
  name: string;
  avatar?: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  category: string;
  importance: string;
  address?: string;
  wechat?: string;
  remark?: string;
  createdAt: string;
}

const mockData: ContactItem[] = [
  {
    id: '1',
    name: '陈经理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c1',
    company: '某市政府信息中心',
    position: '项目负责人',
    phone: '13900139001',
    email: 'chen@gov.cn',
    category: 'customer',
    importance: 'high',
    address: '某市政府大楼',
    wechat: 'chen_manager',
    remark: '智慧城市项目主要对接人',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: '李总',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c2',
    company: '某大型企业',
    position: 'IT总监',
    phone: '13900139002',
    email: 'li@enterprise.com',
    category: 'customer',
    importance: 'high',
    remark: '数据分析项目客户',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: '张设计',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c3',
    company: '某设计公司',
    position: '设计总监',
    phone: '13900139003',
    email: 'zhang@design.com',
    category: 'supplier',
    importance: 'medium',
    remark: 'UI设计外包合作方',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: '王教授',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=c4',
    company: '某高校',
    position: '教授/博导',
    phone: '13900139004',
    email: 'wang@university.edu.cn',
    category: 'partner',
    importance: 'high',
    remark: '产学研合作专家',
    createdAt: '2024-02-10',
  },
];

const categoryMap: Record<string, { text: string; color: string }> = {
  customer: { text: '客户', color: 'blue' },
  supplier: { text: '供应商', color: 'orange' },
  partner: { text: '合作伙伴', color: 'green' },
  other: { text: '其他', color: 'default' },
};

const importanceMap: Record<string, { text: string; color: string }> = {
  high: { text: '重要', color: 'red' },
  medium: { text: '一般', color: 'gold' },
  low: { text: '普通', color: 'default' },
};

const ContactPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<ContactItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ContactItem[]>(mockData);

  const columns: ProColumns<ContactItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <Space>
            <Avatar size="small" src={record.avatar} />
            {record.name}
          </Space>
        </a>
      ),
    },
    {
      title: '公司/单位',
      dataIndex: 'company',
      ellipsis: true,
      width: 180,
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 130,
      render: (_, record) => (
        <a href={`tel:${record.phone}`}>
          <PhoneOutlined style={{ marginRight: 4 }} />
          {record.phone}
        </a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <a href={`mailto:${record.email}`}>
          <MailOutlined style={{ marginRight: 4 }} />
          {record.email}
        </a>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        customer: { text: '客户' },
        supplier: { text: '供应商' },
        partner: { text: '合作伙伴' },
        other: { text: '其他' },
      },
      render: (_, record) => (
        <Tag color={categoryMap[record.category]?.color}>{categoryMap[record.category]?.text}</Tag>
      ),
    },
    {
      title: '重要程度',
      dataIndex: 'importance',
      width: 100,
      valueType: 'select',
      valueEnum: {
        high: { text: '重要' },
        medium: { text: '一般' },
        low: { text: '普通' },
      },
      render: (_, record) => (
        <Tag color={importanceMap[record.importance]?.color}>{importanceMap[record.importance]?.text}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => (
        <Space>
          <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
            <EyeOutlined /> 查看
          </a>
          <a onClick={() => { setCurrentRow(record); setEditModalVisible(true); }}>
            <EditOutlined /> 编辑
          </a>
        </Space>
      ),
    },
  ];

  const handleAdd = async (values: Partial<ContactItem>) => {
    const newItem: ContactItem = {
      id: Date.now().toString(),
      name: values.name || '',
      company: values.company || '',
      position: values.position || '',
      phone: values.phone || '',
      email: values.email || '',
      category: values.category || 'other',
      importance: values.importance || 'medium',
      address: values.address,
      wechat: values.wechat,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增联系人成功');
    return true;
  };

  const handleEdit = async (values: Partial<ContactItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑联系人成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<ContactItem>
        headerTitle="联系人列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            新增联系人
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的联系人吗？"
              onConfirm={() => handleDelete(selectedRowKeys as string[])}
            >
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          ),
        ]}
        dataSource={dataSource}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{ defaultPageSize: 10 }}
      />

      <ModalForm
        title="新增联系人"
        width={600}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="company" label="公司/单位" rules={[{ required: true }]} />
        <ProFormText name="position" label="职位" rules={[{ required: true }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" rules={[{ type: 'email' }]} />
        <ProFormSelect
          name="category"
          label="类别"
          options={[
            { label: '客户', value: 'customer' },
            { label: '供应商', value: 'supplier' },
            { label: '合作伙伴', value: 'partner' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="importance"
          label="重要程度"
          options={[
            { label: '重要', value: 'high' },
            { label: '一般', value: 'medium' },
            { label: '普通', value: 'low' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="wechat" label="微信" />
        <ProFormText name="address" label="地址" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑联系人"
        width={600}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleEdit}
        initialValues={currentRow}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormText name="company" label="公司/单位" rules={[{ required: true }]} />
        <ProFormText name="position" label="职位" rules={[{ required: true }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" rules={[{ type: 'email' }]} />
        <ProFormSelect
          name="category"
          label="类别"
          options={[
            { label: '客户', value: 'customer' },
            { label: '供应商', value: 'supplier' },
            { label: '合作伙伴', value: 'partner' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="importance"
          label="重要程度"
          options={[
            { label: '重要', value: 'high' },
            { label: '一般', value: 'medium' },
            { label: '普通', value: 'low' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="wechat" label="微信" />
        <ProFormText name="address" label="地址" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="联系人详情"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="头像">
              <Avatar size={64} src={currentRow.avatar} />
            </Descriptions.Item>
            <Descriptions.Item label="姓名">{currentRow.name}</Descriptions.Item>
            <Descriptions.Item label="公司/单位">{currentRow.company}</Descriptions.Item>
            <Descriptions.Item label="职位">{currentRow.position}</Descriptions.Item>
            <Descriptions.Item label="电话">
              <a href={`tel:${currentRow.phone}`}>{currentRow.phone}</a>
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">
              <a href={`mailto:${currentRow.email}`}>{currentRow.email}</a>
            </Descriptions.Item>
            <Descriptions.Item label="类别">
              <Tag color={categoryMap[currentRow.category]?.color}>{categoryMap[currentRow.category]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="重要程度">
              <Tag color={importanceMap[currentRow.importance]?.color}>{importanceMap[currentRow.importance]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="微信">{currentRow.wechat || '-'}</Descriptions.Item>
            <Descriptions.Item label="地址">{currentRow.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注">{currentRow.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRow.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ContactPage;
