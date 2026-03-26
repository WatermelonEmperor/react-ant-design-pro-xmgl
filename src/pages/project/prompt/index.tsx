import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Modal, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { Paragraph } = Typography;

type PromptItem = {
  id: string;
  name: string;
  category: string;
  scene: string;
  content: string;
  variables: string[];
  isPublic: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  remark: string;
};

const mockData: PromptItem[] = [
  {
    id: '1',
    name: '需求分析助手',
    category: '需求分析',
    scene: '项目启动',
    content: '你是一个专业的需求分析师。请帮我分析以下需求：\n\n{{requirement}}\n\n请从以下几个方面进行分析：\n1. 功能点梳理\n2. 技术可行性\n3. 风险评估\n4. 工时估算',
    variables: ['requirement'],
    isPublic: true,
    useCount: 156,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    createdBy: '张三',
    remark: '通用需求分析模板',
  },
  {
    id: '2',
    name: '代码审查助手',
    category: '代码审查',
    scene: '开发阶段',
    content: '请对以下{{language}}代码进行审查：\n\n```{{language}}\n{{code}}\n```\n\n请关注：\n1. 代码规范\n2. 潜在bug\n3. 性能问题\n4. 安全隐患\n5. 优化建议',
    variables: ['language', 'code'],
    isPublic: true,
    useCount: 89,
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
    createdBy: '李四',
    remark: '',
  },
  {
    id: '3',
    name: '技术方案生成器',
    category: '技术方案',
    scene: '方案设计',
    content: '请根据以下需求生成技术方案：\n\n需求背景：{{background}}\n功能要求：{{requirements}}\n性能要求：{{performance}}\n\n请输出完整的技术方案，包括：\n1. 技术选型\n2. 架构设计\n3. 数据库设计\n4. 接口设计\n5. 部署方案',
    variables: ['background', 'requirements', 'performance'],
    isPublic: false,
    useCount: 45,
    createdAt: '2024-02-15',
    updatedAt: '2024-03-18',
    createdBy: '王五',
    remark: '内部使用',
  },
  {
    id: '4',
    name: '测试用例生成',
    category: '测试',
    scene: '测试阶段',
    content: '请为以下功能生成测试用例：\n\n功能描述：{{function}}\n输入参数：{{inputs}}\n预期输出：{{outputs}}\n\n请生成完整的测试用例，包括：\n1. 正常流程测试\n2. 边界值测试\n3. 异常处理测试\n4. 性能测试建议',
    variables: ['function', 'inputs', 'outputs'],
    isPublic: true,
    useCount: 67,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-20',
    createdBy: '赵六',
    remark: '',
  },
];

const categoryOptions = [
  { label: '需求分析', value: '需求分析' },
  { label: '技术方案', value: '技术方案' },
  { label: '代码审查', value: '代码审查' },
  { label: '测试', value: '测试' },
  { label: '文档生成', value: '文档生成' },
  { label: '其他', value: '其他' },
];

const sceneOptions = [
  { label: '项目启动', value: '项目启动' },
  { label: '方案设计', value: '方案设计' },
  { label: '开发阶段', value: '开发阶段' },
  { label: '测试阶段', value: '测试阶段' },
  { label: '上线部署', value: '上线部署' },
  { label: '运维支持', value: '运维支持' },
];

const PromptManagePage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<PromptItem>();

  const handleAdd = async (fields: Partial<PromptItem>) => {
    message.success('添加成功');
    return true;
  };

  const handleUpdate = async (fields: Partial<PromptItem>) => {
    message.success('更新成功');
    return true;
  };

  const handleCopy = (record: PromptItem) => {
    navigator.clipboard.writeText(record.content);
    message.success('提示词已复制到剪贴板');
  };

  const confirmDelete = (record: PromptItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除提示词「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<PromptItem>[] = [
    {
      title: '提示词名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 180,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      valueType: 'select',
      valueEnum: {
        需求分析: { text: '需求分析' },
        技术方案: { text: '技术方案' },
        代码审查: { text: '代码审查' },
        测试: { text: '测试' },
        文档生成: { text: '文档生成' },
        其他: { text: '其他' },
      },
    },
    {
      title: '应用场景',
      dataIndex: 'scene',
      width: 100,
      valueType: 'select',
      valueEnum: {
        项目启动: { text: '项目启动' },
        方案设计: { text: '方案设计' },
        开发阶段: { text: '开发阶段' },
        测试阶段: { text: '测试阶段' },
        上线部署: { text: '上线部署' },
        运维支持: { text: '运维支持' },
      },
    },
    {
      title: '提示词内容',
      dataIndex: 'content',
      ellipsis: true,
      width: 300,
      hideInSearch: true,
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, tooltip: text }} style={{ marginBottom: 0 }}>
          {text as string}
        </Paragraph>
      ),
    },
    {
      title: '变量',
      dataIndex: 'variables',
      width: 150,
      hideInSearch: true,
      render: (_, record) => (
        <Space size={4} wrap>
          {record.variables?.map((v) => (
            <Tag key={v} color="blue">{`{{${v}}}`}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '公开',
      dataIndex: 'isPublic',
      width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.isPublic ? 'green' : 'default'}>
          {record.isPublic ? '公开' : '私有'}
        </Tag>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      width: 90,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="复制">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentRow(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => confirmDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const formContent = (
    <>
      <ProFormText name="name" label="提示词名称" rules={[{ required: true }]} />
      <ProFormSelect
        name="category"
        label="分类"
        options={categoryOptions}
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="scene"
        label="应用场景"
        options={sceneOptions}
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="content"
        label="提示词内容"
        rules={[{ required: true }]}
        fieldProps={{ rows: 8 }}
        tooltip="使用 {{变量名}} 定义变量，如：{{requirement}}"
      />
      <ProFormText
        name="variables"
        label="变量列表"
        tooltip="多个变量用逗号分隔，如：requirement,background"
        placeholder="请输入变量名，多个用逗号分隔"
      />
      <ProFormSelect
        name="isPublic"
        label="是否公开"
        options={[
          { label: '公开', value: true },
          { label: '私有', value: false },
        ]}
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 2 }} />
    </>
  );

  return (
    <PageContainer>
      <ProTable<PromptItem>
        headerTitle="提示词列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            新增提示词
          </Button>,
        ]}
        request={async (params) => {
          let filteredData = [...mockData];
          if (params.name) {
            filteredData = filteredData.filter((item) => item.name.includes(params.name));
          }
          if (params.category) {
            filteredData = filteredData.filter((item) => item.category === params.category);
          }
          if (params.scene) {
            filteredData = filteredData.filter((item) => item.scene === params.scene);
          }
          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          };
        }}
        columns={columns}
        scroll={{ x: 1400 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <ModalForm
        title="新增提示词"
        width={640}
        open={createModalOpen}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setCreateModalOpen(false),
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
        onFinish={async (values) => {
          const success = await handleAdd(values);
          if (success) {
            setCreateModalOpen(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      >
        {formContent}
      </ModalForm>

      <ModalForm
        title="编辑提示词"
        width={640}
        open={editModalOpen}
        initialValues={currentRow}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setEditModalOpen(false);
            setCurrentRow(undefined);
          },
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
        onFinish={async (values) => {
          const success = await handleUpdate(values);
          if (success) {
            setEditModalOpen(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
          return success;
        }}
      >
        {formContent}
      </ModalForm>
    </PageContainer>
  );
};

export default PromptManagePage;
