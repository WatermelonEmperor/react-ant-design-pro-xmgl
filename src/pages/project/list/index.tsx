import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Progress, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import ProjectForm from './components/ProjectForm';
import type { ProjectItem, ProjectListParams } from './data.d';
import { addProject, queryProjectList, removeProject, updateProject } from './service';

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待启动', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
  4: { text: '已取消', color: 'error' },
};

const priorityMap: Record<number, { text: string; color: string }> = {
  1: { text: '高', color: 'red' },
  2: { text: '中', color: 'orange' },
  3: { text: '低', color: 'blue' },
};

const ProjectListPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<ProjectItem>();
  const [selectedRowsState, setSelectedRows] = useState<ProjectItem[]>([]);

  const handleAdd = async (fields: Partial<ProjectItem>) => {
    const hide = message.loading('正在添加');
    try {
      await addProject({
        ...fields,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '当前用户',
      });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (fields: Partial<ProjectItem>) => {
    const hide = message.loading('正在更新');
    try {
      await updateProject({
        ...currentRow,
        ...fields,
        updatedAt: new Date().toISOString(),
      });
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleRemove = async (selectedRows: ProjectItem[]) => {
    if (!selectedRows?.length) {
      message.warning('请选择要删除的工程');
      return false;
    }
    const hide = message.loading('正在删除');
    try {
      await removeProject({
        ids: selectedRows.map((row) => row.id),
      });
      hide();
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }
  };

  const confirmDelete = (record: ProjectItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除工程「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const success = await handleRemove([record]);
        if (success) {
          actionRef.current?.reload();
        }
      },
    });
  };

  const columns: ProColumns<ProjectItem>[] = [
    {
      title: '工程编号',
      dataIndex: 'code',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '工程名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 200,
      render: (dom, entity) => (
        <a
          onClick={() => {
            setCurrentRow(entity);
            setShowDetail(true);
          }}
        >
          {dom}
        </a>
      ),
    },
    {
      title: '工程类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        软件开发: { text: '软件开发' },
        系统集成: { text: '系统集成' },
        咨询服务: { text: '咨询服务' },
        技术支持: { text: '技术支持' },
        其他: { text: '其他' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '待启动', status: 'Default' },
        1: { text: '进行中', status: 'Processing' },
        2: { text: '已完成', status: 'Success' },
        3: { text: '已暂停', status: 'Warning' },
        4: { text: '已取消', status: 'Error' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      valueType: 'select',
      valueEnum: {
        1: { text: '高' },
        2: { text: '中' },
        3: { text: '低' },
      },
      render: (_, record) => {
        const priority = priorityMap[record.priority];
        return <Tag color={priority?.color}>{priority?.text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <Progress
          percent={record.progress}
          size="small"
          strokeColor={record.progress >= 80 ? '#52c41a' : record.progress >= 50 ? '#1890ff' : '#faad14'}
        />
      ),
    },
    {
      title: '项目经理',
      dataIndex: 'manager',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '客户',
      dataIndex: 'client',
      width: 120,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      width: 110,
      hideInSearch: true,
      render: (_, record) => `¥${record.budget?.toLocaleString() || 0}`,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
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
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentRow(record);
                setShowDetail(true);
              }}
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

  return (
    <PageContainer>
      <ProTable<ProjectItem, ProjectListParams>
        headerTitle="工程列表"
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
            新增工程
          </Button>,
        ]}
        request={async (params) => {
          const result = await queryProjectList(params);
          return {
            data: result.data,
            success: result.success,
            total: result.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        scroll={{ x: 1400 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button
            danger
            onClick={async () => {
              Modal.confirm({
                title: '批量删除',
                content: `确定要删除选中的 ${selectedRowsState.length} 条工程吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  await handleRemove(selectedRowsState);
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <ProjectForm
        title="新增工程"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onSubmit={async (values) => {
          const success = await handleAdd(values);
          if (success) {
            setCreateModalOpen(false);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

      <ProjectForm
        title="编辑工程"
        open={editModalOpen}
        values={currentRow}
        onCancel={() => {
          setEditModalOpen(false);
          setCurrentRow(undefined);
        }}
        onSubmit={async (values) => {
          const success = await handleUpdate(values);
          if (success) {
            setEditModalOpen(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
          return success;
        }}
      />

      <Drawer
        width={640}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        title="工程详情"
      >
        {currentRow && (
          <ProDescriptions<ProjectItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '工程编号', dataIndex: 'code' },
              { title: '工程名称', dataIndex: 'name', span: 2 },
              { title: '工程类型', dataIndex: 'type' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              {
                title: '优先级',
                dataIndex: 'priority',
                render: (_, record) => {
                  const priority = priorityMap[record.priority];
                  return <Tag color={priority?.color}>{priority?.text}</Tag>;
                },
              },
              {
                title: '进度',
                dataIndex: 'progress',
                render: (_, record) => <Progress percent={record.progress} size="small" />,
              },
              { title: '项目经理', dataIndex: 'manager' },
              { title: '客户名称', dataIndex: 'client' },
              {
                title: '项目预算',
                dataIndex: 'budget',
                render: (_, record) => `¥${record.budget?.toLocaleString() || 0}`,
              },
              {
                title: '已用成本',
                dataIndex: 'cost',
                render: (_, record) => `¥${record.cost?.toLocaleString() || 0}`,
              },
              { title: '开始日期', dataIndex: 'startDate', valueType: 'date' },
              { title: '结束日期', dataIndex: 'endDate', valueType: 'date' },
              { title: '关联课题', dataIndex: 'topicName', span: 2 },
              { title: '工程描述', dataIndex: 'description', span: 2 },
              { title: '创建人', dataIndex: 'createdBy' },
              { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime' },
              { title: '备注', dataIndex: 'remark', span: 2 },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ProjectListPage;
