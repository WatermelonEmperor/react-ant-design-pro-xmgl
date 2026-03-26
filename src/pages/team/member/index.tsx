import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions, Avatar } from 'antd';
import React, { useRef, useState } from 'react';

interface MemberItem {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  team: string;
  position: string;
  role: string;
  status: string;
  joinDate: string;
  skills?: string[];
  remark?: string;
}

const mockData: MemberItem[] = [
  {
    id: '1',
    name: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    team: '研发一组',
    position: '高级工程师',
    role: '组长',
    status: 'active',
    joinDate: '2022-03-15',
    skills: ['React', 'TypeScript', 'Node.js'],
    remark: '技术骨干',
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    email: 'lisi@example.com',
    phone: '13800138002',
    team: '研发一组',
    position: '中级工程师',
    role: '成员',
    status: 'active',
    joinDate: '2023-01-10',
    skills: ['Vue', 'JavaScript'],
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    email: 'wangwu@example.com',
    phone: '13800138003',
    team: '研发二组',
    position: '初级工程师',
    role: '成员',
    status: 'active',
    joinDate: '2023-06-20',
    skills: ['Python', 'Django'],
  },
  {
    id: '4',
    name: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    team: '设计组',
    position: 'UI设计师',
    role: '成员',
    status: 'onleave',
    joinDate: '2022-08-01',
    skills: ['Figma', 'Sketch', 'PS'],
    remark: '正在休假',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  active: { text: '在职', color: 'success' },
  onleave: { text: '休假', color: 'warning' },
  resigned: { text: '离职', color: 'default' },
};

const roleMap: Record<string, { text: string; color: string }> = {
  '组长': { text: '组长', color: 'gold' },
  '成员': { text: '成员', color: 'blue' },
  '实习生': { text: '实习生', color: 'cyan' },
};

const MemberListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<MemberItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<MemberItem[]>(mockData);

  const columns: ProColumns<MemberItem>[] = [
    {
      title: '成员',
      dataIndex: 'name',
      width: 150,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <Space>
            <Avatar size="small" src={record.avatar} icon={<UserOutlined />} />
            {record.name}
          </Space>
        </a>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 180,
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '所属团队',
      dataIndex: 'team',
      width: 120,
      valueType: 'select',
      valueEnum: {
        '研发一组': { text: '研发一组' },
        '研发二组': { text: '研发二组' },
        '设计组': { text: '设计组' },
      },
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      valueType: 'select',
      valueEnum: {
        '组长': { text: '组长' },
        '成员': { text: '成员' },
        '实习生': { text: '实习生' },
      },
      render: (_, record) => (
        <Tag color={roleMap[record.role]?.color}>{roleMap[record.role]?.text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '在职' },
        onleave: { text: '休假' },
        resigned: { text: '离职' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      valueType: 'date',
      width: 120,
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

  const handleAdd = async (values: Partial<MemberItem>) => {
    const newItem: MemberItem = {
      id: Date.now().toString(),
      name: values.name || '',
      email: values.email || '',
      phone: values.phone || '',
      team: values.team || '',
      position: values.position || '',
      role: values.role || '成员',
      status: 'active',
      joinDate: values.joinDate || new Date().toISOString().split('T')[0],
      skills: values.skills,
      remark: values.remark,
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增成员成功');
    return true;
  };

  const handleEdit = async (values: Partial<MemberItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑成员成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<MemberItem>
        headerTitle="成员列表"
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
            新增成员
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的成员吗？"
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
        title="新增成员"
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
        <ProFormText name="email" label="邮箱" rules={[{ required: true, type: 'email' }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormSelect
          name="team"
          label="所属团队"
          options={[
            { label: '研发一组', value: '研发一组' },
            { label: '研发二组', value: '研发二组' },
            { label: '设计组', value: '设计组' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="position" label="职位" rules={[{ required: true }]} />
        <ProFormSelect
          name="role"
          label="角色"
          options={[
            { label: '组长', value: '组长' },
            { label: '成员', value: '成员' },
            { label: '实习生', value: '实习生' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="joinDate" label="入职日期" rules={[{ required: true }]} />
        <ProFormSelect
          name="skills"
          label="技能标签"
          mode="tags"
          fieldProps={{ tokenSeparators: [','] }}
          placeholder="输入技能后按回车"
        />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑成员"
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
        <ProFormText name="email" label="邮箱" rules={[{ required: true, type: 'email' }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormSelect
          name="team"
          label="所属团队"
          options={[
            { label: '研发一组', value: '研发一组' },
            { label: '研发二组', value: '研发二组' },
            { label: '设计组', value: '设计组' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="position" label="职位" rules={[{ required: true }]} />
        <ProFormSelect
          name="role"
          label="角色"
          options={[
            { label: '组长', value: '组长' },
            { label: '成员', value: '成员' },
            { label: '实习生', value: '实习生' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '在职', value: 'active' },
            { label: '休假', value: 'onleave' },
            { label: '离职', value: 'resigned' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="joinDate" label="入职日期" rules={[{ required: true }]} />
        <ProFormSelect
          name="skills"
          label="技能标签"
          mode="tags"
          fieldProps={{ tokenSeparators: [','] }}
          placeholder="输入技能后按回车"
        />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="成员详情"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="头像">
              <Avatar size={64} src={currentRow.avatar} icon={<UserOutlined />} />
            </Descriptions.Item>
            <Descriptions.Item label="姓名">{currentRow.name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{currentRow.email}</Descriptions.Item>
            <Descriptions.Item label="电话">{currentRow.phone}</Descriptions.Item>
            <Descriptions.Item label="所属团队">{currentRow.team}</Descriptions.Item>
            <Descriptions.Item label="职位">{currentRow.position}</Descriptions.Item>
            <Descriptions.Item label="角色">
              <Tag color={roleMap[currentRow.role]?.color}>{roleMap[currentRow.role]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="入职日期">{currentRow.joinDate}</Descriptions.Item>
            <Descriptions.Item label="技能">
              {currentRow.skills?.map(skill => (
                <Tag key={skill} color="blue">{skill}</Tag>
              )) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="备注">{currentRow.remark || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MemberListPage;
