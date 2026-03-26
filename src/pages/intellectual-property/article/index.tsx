import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, FileSearchOutlined, LinkOutlined } from '@ant-design/icons';
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

interface ArticleItem {
  id: string;
  title: string;
  authors: string;
  journal: string;
  publishDate: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  type: string;
  status: string;
  projectName?: string;
  keywords?: string[];
  abstract?: string;
  remark?: string;
  createdAt: string;
}

const mockData: ArticleItem[] = [
  {
    id: '1',
    title: '基于深度学习的图像识别技术研究与应用',
    authors: '张三、李四、王五',
    journal: '计算机学报',
    publishDate: '2024-03-15',
    volume: '47',
    issue: '3',
    pages: '521-535',
    doi: '10.1000/journal.2024.0315',
    type: 'sci',
    status: 'published',
    projectName: 'AI智能客服系统',
    keywords: ['深度学习', '图像识别', '卷积神经网络'],
    abstract: '本文提出了一种基于深度学习的图像识别方法...',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: '智慧城市数据治理框架研究',
    authors: '李明、赵六',
    journal: '软件学报',
    publishDate: '2024-02-20',
    volume: '35',
    issue: '2',
    pages: '312-328',
    type: 'ei',
    status: 'published',
    projectName: '智慧城市综合管理平台',
    keywords: ['智慧城市', '数据治理', '大数据'],
    abstract: '本文针对智慧城市建设中的数据治理问题...',
    createdAt: '2023-11-15',
  },
  {
    id: '3',
    title: '大语言模型在企业知识管理中的应用探索',
    authors: '王强、张三',
    journal: '人工智能学报',
    publishDate: '',
    type: 'core',
    status: 'submitted',
    keywords: ['大语言模型', 'GPT', '知识管理'],
    abstract: '本文探讨了大语言模型在企业知识管理场景中的应用...',
    createdAt: '2024-03-01',
  },
];

const typeMap: Record<string, { text: string; color: string }> = {
  sci: { text: 'SCI', color: 'red' },
  ei: { text: 'EI', color: 'orange' },
  core: { text: '核心期刊', color: 'blue' },
  normal: { text: '普通期刊', color: 'default' },
  conference: { text: '会议论文', color: 'green' },
};

const statusMap: Record<string, { text: string; color: string }> = {
  draft: { text: '草稿', color: 'default' },
  writing: { text: '撰写中', color: 'processing' },
  submitted: { text: '已投稿', color: 'blue' },
  reviewing: { text: '审稿中', color: 'gold' },
  revision: { text: '修改中', color: 'orange' },
  accepted: { text: '已录用', color: 'cyan' },
  published: { text: '已发表', color: 'success' },
  rejected: { text: '已拒稿', color: 'error' },
};

const ArticlePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<ArticleItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ArticleItem[]>(mockData);

  const columns: ProColumns<ArticleItem>[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 280,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <FileSearchOutlined style={{ marginRight: 4 }} />
          {record.title}
        </a>
      ),
    },
    {
      title: '作者',
      dataIndex: 'authors',
      width: 150,
      ellipsis: true,
    },
    {
      title: '期刊/会议',
      dataIndex: 'journal',
      width: 150,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        sci: { text: 'SCI' },
        ei: { text: 'EI' },
        core: { text: '核心期刊' },
        normal: { text: '普通期刊' },
        conference: { text: '会议论文' },
      },
      render: (_, record) => (
        <Tag color={typeMap[record.type]?.color}>{typeMap[record.type]?.text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        draft: { text: '草稿' },
        writing: { text: '撰写中' },
        submitted: { text: '已投稿' },
        reviewing: { text: '审稿中' },
        revision: { text: '修改中' },
        accepted: { text: '已录用' },
        published: { text: '已发表' },
        rejected: { text: '已拒稿' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '发表日期',
      dataIndex: 'publishDate',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
      render: (_, record) => record.publishDate || '-',
    },
    {
      title: 'DOI',
      dataIndex: 'doi',
      width: 180,
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => record.doi ? (
        <a href={`https://doi.org/${record.doi}`} target="_blank" rel="noreferrer">
          <LinkOutlined style={{ marginRight: 4 }} />
          {record.doi}
        </a>
      ) : '-',
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

  const handleAdd = async (values: Partial<ArticleItem>) => {
    const newItem: ArticleItem = {
      id: Date.now().toString(),
      title: values.title || '',
      authors: values.authors || '',
      journal: values.journal || '',
      publishDate: values.publishDate || '',
      volume: values.volume,
      issue: values.issue,
      pages: values.pages,
      doi: values.doi,
      type: values.type || 'normal',
      status: 'draft',
      projectName: values.projectName,
      keywords: values.keywords,
      abstract: values.abstract,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增文章成功');
    return true;
  };

  const handleEdit = async (values: Partial<ArticleItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑文章成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<ArticleItem>
        headerTitle="文章列表"
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
            新增文章
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的文章吗？"
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
        title="新增文章"
        width={700}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="title" label="文章标题" rules={[{ required: true }]} />
        <ProFormText name="authors" label="作者" placeholder="多人用顿号分隔" rules={[{ required: true }]} />
        <ProFormText name="journal" label="期刊/会议名称" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="文章类型"
          options={[
            { label: 'SCI', value: 'sci' },
            { label: 'EI', value: 'ei' },
            { label: '核心期刊', value: 'core' },
            { label: '普通期刊', value: 'normal' },
            { label: '会议论文', value: 'conference' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="publishDate" label="发表日期" />
        <ProFormText name="volume" label="卷号" />
        <ProFormText name="issue" label="期号" />
        <ProFormText name="pages" label="页码" placeholder="如：521-535" />
        <ProFormText name="doi" label="DOI" />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormSelect
          name="keywords"
          label="关键词"
          mode="tags"
          fieldProps={{ tokenSeparators: [',', '，'] }}
          placeholder="输入关键词后按回车"
        />
        <ProFormTextArea name="abstract" label="摘要" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑文章"
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
        <ProFormText name="title" label="文章标题" rules={[{ required: true }]} />
        <ProFormText name="authors" label="作者" rules={[{ required: true }]} />
        <ProFormText name="journal" label="期刊/会议名称" rules={[{ required: true }]} />
        <ProFormSelect
          name="type"
          label="文章类型"
          options={[
            { label: 'SCI', value: 'sci' },
            { label: 'EI', value: 'ei' },
            { label: '核心期刊', value: 'core' },
            { label: '普通期刊', value: 'normal' },
            { label: '会议论文', value: 'conference' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '草稿', value: 'draft' },
            { label: '撰写中', value: 'writing' },
            { label: '已投稿', value: 'submitted' },
            { label: '审稿中', value: 'reviewing' },
            { label: '修改中', value: 'revision' },
            { label: '已录用', value: 'accepted' },
            { label: '已发表', value: 'published' },
            { label: '已拒稿', value: 'rejected' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDatePicker name="publishDate" label="发表日期" />
        <ProFormText name="volume" label="卷号" />
        <ProFormText name="issue" label="期号" />
        <ProFormText name="pages" label="页码" />
        <ProFormText name="doi" label="DOI" />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormSelect
          name="keywords"
          label="关键词"
          mode="tags"
          fieldProps={{ tokenSeparators: [',', '，'] }}
        />
        <ProFormTextArea name="abstract" label="摘要" />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="文章详情"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="文章标题">{currentRow.title}</Descriptions.Item>
            <Descriptions.Item label="作者">{currentRow.authors}</Descriptions.Item>
            <Descriptions.Item label="期刊/会议">{currentRow.journal}</Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag color={typeMap[currentRow.type]?.color}>{typeMap[currentRow.type]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发表日期">{currentRow.publishDate || '-'}</Descriptions.Item>
            <Descriptions.Item label="卷/期/页码">
              {currentRow.volume || currentRow.issue || currentRow.pages 
                ? `${currentRow.volume || '-'}卷 ${currentRow.issue || '-'}期 ${currentRow.pages || '-'}页`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="DOI">
              {currentRow.doi ? (
                <a href={`https://doi.org/${currentRow.doi}`} target="_blank" rel="noreferrer">
                  {currentRow.doi}
                </a>
              ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="关联项目">{currentRow.projectName || '-'}</Descriptions.Item>
            <Descriptions.Item label="关键词">
              {currentRow.keywords?.map(kw => (
                <Tag key={kw} color="blue">{kw}</Tag>
              )) || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="摘要">{currentRow.abstract || '-'}</Descriptions.Item>
            <Descriptions.Item label="备注">{currentRow.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentRow.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ArticlePage;
