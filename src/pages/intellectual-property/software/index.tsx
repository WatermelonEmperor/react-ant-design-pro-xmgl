import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, CodeOutlined } from '@ant-design/icons';
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
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions } from 'antd';
import React, { useRef, useState } from 'react';

interface SoftwareCopyrightItem {
  id: string;
  registerNo: string;
  name: string;
  shortName: string;
  version: string;
  authors: string;
  rightsHolder: string;
  developWay: string;
  publishDate: string;
  registerDate?: string;
  status: string;
  category: string;
  projectName?: string;
  description?: string;
  remark?: string;
  createdAt: string;
}

const mockData: SoftwareCopyrightItem[] = [
  {
    id: '1',
    registerNo: '2024SR0001234',
    name: '智慧城市综合管理平台软件',
    shortName: '智慧城市平台',
    version: 'V1.0',
    authors: '张三、李四',
    rightsHolder: '本公司',
    developWay: 'independent',
    publishDate: '2024-01-15',
    registerDate: '2024-03-20',
    status: 'registered',
    category: 'application',
    projectName: '智慧城市综合管理平台',
    description: '用于城市综合管理的软件系统',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    registerNo: '2024SR0002345',
    name: 'AI智能客服系统软件',
    shortName: 'AI客服系统',
    version: 'V2.0',
    authors: '李明、王五',
    rightsHolder: '本公司',
    developWay: 'independent',
    publishDate: '2024-02-20',
    status: 'examining',
    category: 'application',
    projectName: 'AI智能客服系统',
    description: '基于人工智能的智能客服解决方案',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    registerNo: '',
    name: '数据分析可视化组件库',
    shortName: '数据可视化库',
    version: 'V1.5',
    authors: '赵六',
    rightsHolder: '本公司',
    developWay: 'independent',
    publishDate: '2024-03-10',
    status: 'draft',
    category: 'tool',
    description: '用于数据分析和可视化的前端组件库',
    createdAt: '2024-03-10',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  submitted: { text: '已提交', color: 'processing' },
  examining: { text: '审查中', color: 'blue' },
  registered: { text: '已登记', color: 'success' },
  rejected: { text: '已退回', color: 'error' },
};

const developWayMap: Record<string, string> = {
  independent: '独立开发',
  cooperative: '合作开发',
  commissioned: '委托开发',
};

const categoryMap: Record<string, string> = {
  application: '应用软件',
  system: '系统软件',
  middleware: '中间件',
  embedded: '嵌入式软件',
  tool: '工具软件',
};

const SoftwareCopyrightPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<SoftwareCopyrightItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<SoftwareCopyrightItem[]>(mockData);

  const columns: ProColumns<SoftwareCopyrightItem>[] = [
    {
      title: '登记号',
      dataIndex: 'registerNo',
      width: 150,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <CodeOutlined style={{ marginRight: 4 }} />
          {record.registerNo || '待分配'}
        </a>
      ),
    },
    {
      title: '软件名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 220,
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '著作权人',
      dataIndex: 'rightsHolder',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '软件类别',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        application: { text: '应用软件' },
        system: { text: '系统软件' },
        middleware: { text: '中间件' },
        embedded: { text: '嵌入式软件' },
        tool: { text: '工具软件' },
      },
      render: (_, record) => categoryMap[record.category],
    },
    {
      title: '首次发表日期',
      dataIndex: 'publishDate',
      valueType: 'date',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      valueType: 'date',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.registerDate || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        draft: { text: '草稿' },
        submitted: { text: '已提交' },
        examining: { text: '审查中' },
        registered: { text: '已登记' },
        rejected: { text: '已退回' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
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

  const handleAdd = async (values: Partial<SoftwareCopyrightItem>) => {
    const newItem: SoftwareCopyrightItem = {
      id: Date.now().toString(),
      registerNo: '',
      name: values.name || '',
      shortName: values.shortName || '',
      version: values.version || 'V1.0',
      authors: values.authors || '',
      rightsHolder: values.rightsHolder || '本公司',
      developWay: values.developWay || 'independent',
      publishDate: values.publishDate || new Date().toISOString().split('T')[0],
      status: 'draft',
      category: values.category || 'application',
      projectName: values.projectName,
      description: values.description,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增软著成功');
    return true;
  };

  const handleEdit = async (values: Partial<SoftwareCopyrightItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑软著成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<SoftwareCopyrightItem>
        headerTitle="软著列表"
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
            新增软著
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的软著吗？"
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
        title="新增软著"
        width={700}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="软件全称" rules={[{ required: true }]} />
        <ProFormText name="shortName" label="软件简称" rules={[{ required: true }]} />
        <ProFormText name="version" label="版本号" initialValue="V1.0" rules={[{ required: true }]} />
        <ProFormText name="authors" label="开发者" placeholder="多人用顿号分隔" rules={[{ required: true }]} />
        <ProFormText name="rightsHolder" label="著作权人" initialValue="本公司" rules={[{ required: true }]} />
        <ProFormSelect
          name="developWay"
          label="开发方式"
          options={[
            { label: '独立开发', value: 'independent' },
            { label: '合作开发', value: 'cooperative' },
            { label: '委托开发', value: 'commissioned' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="category"
          label="软件类别"
          options={[
            { label: '应用软件', value: 'application' },
            { label: '系统软件', value: 'system' },
            { label: '中间件', value: 'middleware' },
            { label: '嵌入式软件', value: 'embedded' },
            { label: '工具软件', value: 'tool' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="publishDate" label="首次发表日期" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormTextArea name="description" label="软件描述" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑软著"
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
        <ProFormText name="registerNo" label="登记号" />
        <ProFormText name="name" label="软件全称" rules={[{ required: true }]} />
        <ProFormText name="shortName" label="软件简称" rules={[{ required: true }]} />
        <ProFormText name="version" label="版本号" rules={[{ required: true }]} />
        <ProFormText name="authors" label="开发者" rules={[{ required: true }]} />
        <ProFormText name="rightsHolder" label="著作权人" rules={[{ required: true }]} />
        <ProFormSelect
          name="developWay"
          label="开发方式"
          options={[
            { label: '独立开发', value: 'independent' },
            { label: '合作开发', value: 'cooperative' },
            { label: '委托开发', value: 'commissioned' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="category"
          label="软件类别"
          options={[
            { label: '应用软件', value: 'application' },
            { label: '系统软件', value: 'system' },
            { label: '中间件', value: 'middleware' },
            { label: '嵌入式软件', value: 'embedded' },
            { label: '工具软件', value: 'tool' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="publishDate" label="首次发表日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="registerDate" label="登记日期" />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '草稿', value: 'draft' },
            { label: '已提交', value: 'submitted' },
            { label: '审查中', value: 'examining' },
            { label: '已登记', value: 'registered' },
            { label: '已退回', value: 'rejected' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormTextArea name="description" label="软件描述" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="软著详情"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="登记号">{currentRow.registerNo || '待分配'}</Descriptions.Item>
            <Descriptions.Item label="软件全称">{currentRow.name}</Descriptions.Item>
            <Descriptions.Item label="软件简称">{currentRow.shortName}</Descriptions.Item>
            <Descriptions.Item label="版本号">{currentRow.version}</Descriptions.Item>
            <Descriptions.Item label="开发者">{currentRow.authors}</Descriptions.Item>
            <Descriptions.Item label="著作权人">{currentRow.rightsHolder}</Descriptions.Item>
            <Descriptions.Item label="开发方式">{developWayMap[currentRow.developWay]}</Descriptions.Item>
            <Descriptions.Item label="软件类别">{categoryMap[currentRow.category]}</Descriptions.Item>
            <Descriptions.Item label="首次发表日期">{currentRow.publishDate}</Descriptions.Item>
            <Descriptions.Item label="登记日期">{currentRow.registerDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联项目">{currentRow.projectName || '-'}</Descriptions.Item>
            <Descriptions.Item label="软件描述">{currentRow.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注">{currentRow.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRow.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SoftwareCopyrightPage;
