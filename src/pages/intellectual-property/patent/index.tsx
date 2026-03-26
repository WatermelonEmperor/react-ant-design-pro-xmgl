import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
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

interface PatentItem {
  id: string;
  patentNo: string;
  name: string;
  type: string;
  inventors: string;
  applicant: string;
  applicationDate: string;
  authorizationDate?: string;
  status: string;
  projectName?: string;
  abstract?: string;
  remark?: string;
  createdAt: string;
}

const mockData: PatentItem[] = [
  {
    id: '1',
    patentNo: 'ZL202410001234.5',
    name: '一种基于深度学习的图像识别方法',
    type: 'invention',
    inventors: '张三、李四、王五',
    applicant: '本公司',
    applicationDate: '2024-01-15',
    authorizationDate: '2024-06-20',
    status: 'authorized',
    projectName: 'AI智能客服系统',
    abstract: '本发明公开了一种基于深度学习的图像识别方法，包括图像预处理、特征提取、模型训练等步骤...',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    patentNo: 'ZL202410002345.6',
    name: '一种智慧城市数据处理系统',
    type: 'invention',
    inventors: '李明、赵六',
    applicant: '本公司',
    applicationDate: '2024-02-20',
    status: 'examining',
    projectName: '智慧城市综合管理平台',
    abstract: '本发明涉及智慧城市领域，公开了一种数据处理系统...',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    patentNo: 'ZL202430003456.7',
    name: '一种数据可视化界面',
    type: 'design',
    inventors: '王设计',
    applicant: '本公司',
    applicationDate: '2024-03-10',
    authorizationDate: '2024-05-15',
    status: 'authorized',
    abstract: '本外观设计涉及数据可视化软件界面...',
    createdAt: '2024-03-10',
  },
];

const typeMap: Record<string, { text: string; color: string }> = {
  invention: { text: '发明专利', color: 'blue' },
  utility: { text: '实用新型', color: 'green' },
  design: { text: '外观设计', color: 'orange' },
};

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  submitted: { text: '已提交', color: 'processing' },
  examining: { text: '审查中', color: 'blue' },
  authorized: { text: '已授权', color: 'success' },
  rejected: { text: '已驳回', color: 'error' },
  expired: { text: '已过期', color: 'default' },
};

const PatentPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<PatentItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<PatentItem[]>(mockData);

  const columns: ProColumns<PatentItem>[] = [
    {
      title: '专利号',
      dataIndex: 'patentNo',
      width: 180,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <FileTextOutlined style={{ marginRight: 4 }} />
          {record.patentNo}
        </a>
      ),
    },
    {
      title: '专利名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 250,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        invention: { text: '发明专利' },
        utility: { text: '实用新型' },
        design: { text: '外观设计' },
      },
      render: (_, record) => (
        <Tag color={typeMap[record.type]?.color}>{typeMap[record.type]?.text}</Tag>
      ),
    },
    {
      title: '发明人',
      dataIndex: 'inventors',
      width: 150,
      ellipsis: true,
    },
    {
      title: '申请日期',
      dataIndex: 'applicationDate',
      valueType: 'date',
      width: 110,
    },
    {
      title: '授权日期',
      dataIndex: 'authorizationDate',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
      render: (_, record) => record.authorizationDate || '-',
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
        authorized: { text: '已授权' },
        rejected: { text: '已驳回' },
        expired: { text: '已过期' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '关联项目',
      dataIndex: 'projectName',
      width: 180,
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

  const handleAdd = async (values: Partial<PatentItem>) => {
    const newItem: PatentItem = {
      id: Date.now().toString(),
      patentNo: values.patentNo || `ZL${new Date().getFullYear()}${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}.${Math.floor(Math.random() * 10)}`,
      name: values.name || '',
      type: values.type || 'invention',
      inventors: values.inventors || '',
      applicant: values.applicant || '本公司',
      applicationDate: values.applicationDate || new Date().toISOString().split('T')[0],
      status: 'draft',
      projectName: values.projectName,
      abstract: values.abstract,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增专利成功');
    return true;
  };

  const handleEdit = async (values: Partial<PatentItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑专利成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<PatentItem>
        headerTitle="专利列表"
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
            新增专利
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的专利吗？"
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
        title="新增专利"
        width={700}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="patentNo" label="专利号" placeholder="留空自动生成" />
        <ProFormText name="name" label="专利名称" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="专利类型"
          options={[
            { label: '发明专利', value: 'invention' },
            { label: '实用新型', value: 'utility' },
            { label: '外观设计', value: 'design' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="inventors" label="发明人" placeholder="多人用顿号分隔" rules={[{ required: true }]} />
        <ProFormText name="applicant" label="申请人" initialValue="本公司" rules={[{ required: true }]} />
        <ProFormDatePicker name="applicationDate" label="申请日期" rules={[{ required: true }]} />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormTextArea name="abstract" label="摘要" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑专利"
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
        <ProFormText name="patentNo" label="专利号" rules={[{ required: true }]} />
        <ProFormText name="name" label="专利名称" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="专利类型"
          options={[
            { label: '发明专利', value: 'invention' },
            { label: '实用新型', value: 'utility' },
            { label: '外观设计', value: 'design' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="inventors" label="发明人" rules={[{ required: true }]} />
        <ProFormText name="applicant" label="申请人" rules={[{ required: true }]} />
        <ProFormDatePicker name="applicationDate" label="申请日期" rules={[{ required: true }]} />
        <ProFormDatePicker name="authorizationDate" label="授权日期" />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '草稿', value: 'draft' },
            { label: '已提交', value: 'submitted' },
            { label: '审查中', value: 'examining' },
            { label: '已授权', value: 'authorized' },
            { label: '已驳回', value: 'rejected' },
            { label: '已过期', value: 'expired' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormTextArea name="abstract" label="摘要" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="专利详情"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="专利号">{currentRow.patentNo}</Descriptions.Item>
            <Descriptions.Item label="专利名称">{currentRow.name}</Descriptions.Item>
            <Descriptions.Item label="专利类型">
              <Tag color={typeMap[currentRow.type]?.color}>{typeMap[currentRow.type]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发明人">{currentRow.inventors}</Descriptions.Item>
            <Descriptions.Item label="申请人">{currentRow.applicant}</Descriptions.Item>
            <Descriptions.Item label="申请日期">{currentRow.applicationDate}</Descriptions.Item>
            <Descriptions.Item label="授权日期">{currentRow.authorizationDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="关联项目">{currentRow.projectName || '-'}</Descriptions.Item>
            <Descriptions.Item label="摘要">{currentRow.abstract || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注">{currentRow.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRow.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default PatentPage;
