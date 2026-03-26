import { 
  PlusOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined,
  FileOutlined, FilePdfOutlined, FileWordOutlined, FileExcelOutlined, 
  FileImageOutlined, FileZipOutlined, FolderOutlined, EyeOutlined
} from '@ant-design/icons';
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
import { Button, message, Popconfirm, Space, Tag, Modal, Upload, Breadcrumb, Card, Row, Col, Statistic } from 'antd';
import React, { useRef, useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  projectName?: string;
  uploadBy: string;
  uploadAt: string;
  description?: string;
}

const mockData: FileItem[] = [
  {
    id: '1',
    name: '智慧城市项目需求文档.docx',
    type: 'docx',
    size: '2.5 MB',
    category: 'requirement',
    projectName: '智慧城市综合管理平台',
    uploadBy: '张三',
    uploadAt: '2024-03-15 10:30',
    description: '项目需求规格说明书',
  },
  {
    id: '2',
    name: 'AI客服系统设计方案.pdf',
    type: 'pdf',
    size: '5.8 MB',
    category: 'design',
    projectName: 'AI智能客服系统',
    uploadBy: '李四',
    uploadAt: '2024-03-14 15:20',
    description: '系统架构设计文档',
  },
  {
    id: '3',
    name: '2024年Q1财务报表.xlsx',
    type: 'xlsx',
    size: '1.2 MB',
    category: 'finance',
    uploadBy: '财务部',
    uploadAt: '2024-03-10 09:00',
    description: '第一季度财务数据',
  },
  {
    id: '4',
    name: '产品原型设计稿.zip',
    type: 'zip',
    size: '45.6 MB',
    category: 'design',
    projectName: '智慧城市综合管理平台',
    uploadBy: '王设计',
    uploadAt: '2024-03-08 16:45',
    description: 'Figma设计源文件',
  },
  {
    id: '5',
    name: '系统架构图.png',
    type: 'png',
    size: '856 KB',
    category: 'design',
    projectName: 'AI智能客服系统',
    uploadBy: '李明',
    uploadAt: '2024-03-05 11:30',
  },
  {
    id: '6',
    name: '技术调研报告.docx',
    type: 'docx',
    size: '3.2 MB',
    category: 'research',
    uploadBy: '赵六',
    uploadAt: '2024-03-01 14:20',
    description: '大模型技术调研',
  },
];

const fileIconMap: Record<string, React.ReactNode> = {
  pdf: <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />,
  docx: <FileWordOutlined style={{ color: '#1890ff', fontSize: 20 }} />,
  doc: <FileWordOutlined style={{ color: '#1890ff', fontSize: 20 }} />,
  xlsx: <FileExcelOutlined style={{ color: '#52c41a', fontSize: 20 }} />,
  xls: <FileExcelOutlined style={{ color: '#52c41a', fontSize: 20 }} />,
  png: <FileImageOutlined style={{ color: '#fa8c16', fontSize: 20 }} />,
  jpg: <FileImageOutlined style={{ color: '#fa8c16', fontSize: 20 }} />,
  jpeg: <FileImageOutlined style={{ color: '#fa8c16', fontSize: 20 }} />,
  zip: <FileZipOutlined style={{ color: '#722ed1', fontSize: 20 }} />,
  rar: <FileZipOutlined style={{ color: '#722ed1', fontSize: 20 }} />,
  default: <FileOutlined style={{ color: '#999', fontSize: 20 }} />,
};

const categoryMap: Record<string, { text: string; color: string }> = {
  requirement: { text: '需求文档', color: 'blue' },
  design: { text: '设计文档', color: 'purple' },
  development: { text: '开发文档', color: 'cyan' },
  test: { text: '测试文档', color: 'orange' },
  finance: { text: '财务文档', color: 'green' },
  contract: { text: '合同文档', color: 'red' },
  research: { text: '调研文档', color: 'gold' },
  other: { text: '其他', color: 'default' },
};

const FilePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<FileItem[]>(mockData);

  const columns: ProColumns<FileItem>[] = [
    {
      title: '文件名',
      dataIndex: 'name',
      ellipsis: true,
      width: 280,
      render: (_, record) => (
        <Space>
          {fileIconMap[record.type] || fileIconMap.default}
          <a onClick={() => { setCurrentFile(record); setPreviewVisible(true); }}>
            {record.name}
          </a>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      hideInSearch: true,
      render: (_, record) => record.type.toUpperCase(),
    },
    {
      title: '大小',
      dataIndex: 'size',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      valueType: 'select',
      valueEnum: {
        requirement: { text: '需求文档' },
        design: { text: '设计文档' },
        development: { text: '开发文档' },
        test: { text: '测试文档' },
        finance: { text: '财务文档' },
        contract: { text: '合同文档' },
        research: { text: '调研文档' },
        other: { text: '其他' },
      },
      render: (_, record) => (
        <Tag color={categoryMap[record.category]?.color}>{categoryMap[record.category]?.text}</Tag>
      ),
    },
    {
      title: '关联项目',
      dataIndex: 'projectName',
      width: 180,
      ellipsis: true,
      render: (_, record) => record.projectName || '-',
    },
    {
      title: '上传者',
      dataIndex: 'uploadBy',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadAt',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => (
        <Space>
          <a onClick={() => { setCurrentFile(record); setPreviewVisible(true); }}>
            <EyeOutlined /> 预览
          </a>
          <a><DownloadOutlined /> 下载</a>
          <Popconfirm
            title="确定要删除该文件吗？"
            onConfirm={() => handleDelete([record.id])}
          >
            <a style={{ color: '#ff4d4f' }}><DeleteOutlined /></a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUpload = async (values: { category: string; projectName?: string; description?: string }) => {
    const newItem: FileItem = {
      id: Date.now().toString(),
      name: '新上传文件.pdf',
      type: 'pdf',
      size: '1.0 MB',
      category: values.category,
      projectName: values.projectName,
      uploadBy: '当前用户',
      uploadAt: new Date().toLocaleString(),
      description: values.description,
    };
    setDataSource([newItem, ...dataSource]);
    message.success('上传成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  // 统计数据
  const totalFiles = dataSource.length;
  const totalSize = '58.16 MB';
  const todayUploads = 3;

  return (
    <PageContainer>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="文件总数" value={totalFiles} suffix="个" prefix={<FileOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总大小" value={totalSize} prefix={<FolderOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日上传" value={todayUploads} suffix="个" prefix={<UploadOutlined />} />
          </Card>
        </Col>
      </Row>

      <ProTable<FileItem>
        headerTitle="文件列表"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 100 }}
        toolBarRender={() => [
          <Button
            key="upload"
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
          >
            上传文件
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的文件吗？"
              onConfirm={() => handleDelete(selectedRowKeys as string[])}
            >
              <Button danger icon={<DeleteOutlined />}>批量删除</Button>
            </Popconfirm>
          ),
          selectedRowKeys.length > 0 && (
            <Button key="batchDownload" icon={<DownloadOutlined />}>
              批量下载
            </Button>
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
        title="上传文件"
        width={500}
        open={uploadModalVisible}
        onOpenChange={setUploadModalVisible}
        onFinish={handleUpload}
        modalProps={{ destroyOnClose: true }}
      >
        <Upload.Dragger
          name="file"
          multiple
          style={{ marginBottom: 16 }}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
          <p className="ant-upload-hint">支持单个或批量上传</p>
        </Upload.Dragger>
        <ProFormSelect
          name="category"
          label="文件分类"
          options={[
            { label: '需求文档', value: 'requirement' },
            { label: '设计文档', value: 'design' },
            { label: '开发文档', value: 'development' },
            { label: '测试文档', value: 'test' },
            { label: '财务文档', value: 'finance' },
            { label: '合同文档', value: 'contract' },
            { label: '调研文档', value: 'research' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="projectName" label="关联项目" />
        <ProFormTextArea name="description" label="文件描述" />
      </ModalForm>

      <Modal
        title="文件详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            下载文件
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {currentFile && (
          <div>
            <div style={{ textAlign: 'center', padding: '40px 0', background: '#f5f5f5', marginBottom: 16 }}>
              {React.cloneElement(
                (fileIconMap[currentFile.type] || fileIconMap.default) as React.ReactElement,
                { style: { fontSize: 64 } }
              )}
              <div style={{ marginTop: 16, fontSize: 16 }}>{currentFile.name}</div>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}><strong>文件类型：</strong>{currentFile.type.toUpperCase()}</Col>
              <Col span={12}><strong>文件大小：</strong>{currentFile.size}</Col>
              <Col span={12}><strong>分类：</strong><Tag color={categoryMap[currentFile.category]?.color}>{categoryMap[currentFile.category]?.text}</Tag></Col>
              <Col span={12}><strong>关联项目：</strong>{currentFile.projectName || '-'}</Col>
              <Col span={12}><strong>上传者：</strong>{currentFile.uploadBy}</Col>
              <Col span={12}><strong>上传时间：</strong>{currentFile.uploadAt}</Col>
              {currentFile.description && (
                <Col span={24}><strong>描述：</strong>{currentFile.description}</Col>
              )}
            </Row>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default FilePage;
