import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
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
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions, Avatar, List } from 'antd';
import React, { useRef, useState } from 'react';

interface TeamItem {
  id: string;
  name: string;
  leader: string;
  leaderAvatar?: string;
  memberCount: number;
  department: string;
  status: string;
  description?: string;
  createdAt: string;
  members?: { id: string; name: string; role: string; avatar?: string }[];
}

const mockData: TeamItem[] = [
  {
    id: '1',
    name: '研发一组',
    leader: '张三',
    leaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    memberCount: 8,
    department: '技术部',
    status: 'active',
    description: '负责核心产品研发',
    createdAt: '2023-06-15',
    members: [
      { id: '1', name: '张三', role: '组长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
      { id: '2', name: '李四', role: '高级工程师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
      { id: '3', name: '王五', role: '工程师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    ],
  },
  {
    id: '2',
    name: '研发二组',
    leader: '李明',
    leaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    memberCount: 6,
    department: '技术部',
    status: 'active',
    description: '负责新项目孵化',
    createdAt: '2023-08-20',
    members: [
      { id: '4', name: '李明', role: '组长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
      { id: '5', name: '赵六', role: '工程师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    ],
  },
  {
    id: '3',
    name: '设计组',
    leader: '王设计',
    leaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    memberCount: 4,
    department: '设计部',
    status: 'active',
    description: '负责产品UI/UX设计',
    createdAt: '2023-07-10',
    members: [
      { id: '6', name: '王设计', role: '组长', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
    ],
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  active: { text: '活跃', color: 'success' },
  inactive: { text: '停用', color: 'default' },
};

const TeamListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<TeamItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<TeamItem[]>(mockData);

  const columns: ProColumns<TeamItem>[] = [
    {
      title: '团队名称',
      dataIndex: 'name',
      width: 150,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          {record.name}
        </a>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      width: 120,
      render: (_, record) => (
        <Space>
          <Avatar size="small" src={record.leaderAvatar} />
          {record.leader}
        </Space>
      ),
    },
    {
      title: '成员数量',
      dataIndex: 'memberCount',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <Tag color="blue">{record.memberCount} 人</Tag>,
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      width: 120,
      valueType: 'select',
      valueEnum: {
        '技术部': { text: '技术部' },
        '设计部': { text: '设计部' },
        '产品部': { text: '产品部' },
        '市场部': { text: '市场部' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '活跃' },
        inactive: { text: '停用' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
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

  const handleAdd = async (values: Partial<TeamItem>) => {
    const newItem: TeamItem = {
      id: Date.now().toString(),
      name: values.name || '',
      leader: values.leader || '',
      memberCount: 1,
      department: values.department || '',
      status: 'active',
      description: values.description,
      createdAt: new Date().toISOString().split('T')[0],
      members: [],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增团队成功');
    return true;
  };

  const handleEdit = async (values: Partial<TeamItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑团队成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<TeamItem>
        headerTitle="团队列表"
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
            新增团队
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的团队吗？"
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
        title="新增团队"
        width={500}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="团队名称" rules={[{ required: true }]} />
        <ProFormText name="leader" label="负责人" rules={[{ required: true }]} />
        <ProFormSelect
          name="department"
          label="所属部门"
          options={[
            { label: '技术部', value: '技术部' },
            { label: '设计部', value: '设计部' },
            { label: '产品部', value: '产品部' },
            { label: '市场部', value: '市场部' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormTextArea name="description" label="团队描述" />
      </ModalForm>

      <ModalForm
        title="编辑团队"
        width={500}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleEdit}
        initialValues={currentRow}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="团队名称" rules={[{ required: true }]} />
        <ProFormText name="leader" label="负责人" rules={[{ required: true }]} />
        <ProFormSelect
          name="department"
          label="所属部门"
          options={[
            { label: '技术部', value: '技术部' },
            { label: '设计部', value: '设计部' },
            { label: '产品部', value: '产品部' },
            { label: '市场部', value: '市场部' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '活跃', value: 'active' },
            { label: '停用', value: 'inactive' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormTextArea name="description" label="团队描述" />
      </ModalForm>

      <Drawer
        title="团队详情"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="团队名称">{currentRow.name}</Descriptions.Item>
              <Descriptions.Item label="负责人">
                <Space>
                  <Avatar size="small" src={currentRow.leaderAvatar} />
                  {currentRow.leader}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="所属部门">{currentRow.department}</Descriptions.Item>
              <Descriptions.Item label="成员数量">{currentRow.memberCount} 人</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="描述">{currentRow.description || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentRow.createdAt}</Descriptions.Item>
            </Descriptions>
            
            <h4 style={{ marginTop: 24, marginBottom: 16 }}>团队成员</h4>
            <List
              dataSource={currentRow.members}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={item.role}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TeamListPage;
