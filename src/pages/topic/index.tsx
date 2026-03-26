import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Modal, Space, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import TopicForm from './components/TopicForm';
import type { TopicItem, TopicListParams } from './data.d';
import { addTopic, queryTopicList, removeTopic, updateTopic } from './service';

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待启动', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已结题', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
};

const levelColor: Record<string, string> = {
  国家级: 'red',
  省部级: 'orange',
  市厅级: 'blue',
  校级: 'green',
  其他: 'default',
};

const TopicPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<TopicItem>();
  const [selectedRowsState, setSelectedRows] = useState<TopicItem[]>([]);

  const handleAdd = async (fields: Partial<TopicItem>) => {
    const hide = message.loading('正在添加');
    try {
      await addTopic({
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

  const handleUpdate = async (fields: Partial<TopicItem>) => {
    const hide = message.loading('正在更新');
    try {
      await updateTopic({
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

  const handleRemove = async (selectedRows: TopicItem[]) => {
    if (!selectedRows?.length) {
      message.warning('请选择要删除的课题');
      return false;
    }
    const hide = message.loading('正在删除');
    try {
      await removeTopic({
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

  const confirmDelete = (record: TopicItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除课题「${record.name}」吗？`,
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

  const columns: ProColumns<TopicItem>[] = [
    {
      title: '课题编号',
      dataIndex: 'code',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '课题名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 220,
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
      title: '课题类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        纵向课题: { text: '纵向课题' },
        横向课题: { text: '横向课题' },
        校内课题: { text: '校内课题' },
        自主研究: { text: '自主研究' },
      },
    },
    {
      title: '课题级别',
      dataIndex: 'level',
      width: 100,
      valueType: 'select',
      valueEnum: {
        国家级: { text: '国家级' },
        省部级: { text: '省部级' },
        市厅级: { text: '市厅级' },
        校级: { text: '校级' },
        其他: { text: '其他' },
      },
      render: (_, record) => (
        <Tag color={levelColor[record.level]}>{record.level}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '待启动', status: 'Default' },
        1: { text: '进行中', status: 'Processing' },
        2: { text: '已结题', status: 'Success' },
        3: { text: '已暂停', status: 'Warning' },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status?.color}>{status?.text}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '课题经费',
      dataIndex: 'budget',
      width: 120,
      hideInSearch: true,
      render: (_, record) => `¥${record.budget?.toLocaleString() || 0}`,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      valueType: 'date',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      valueType: 'date',
      width: 120,
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
      <ProTable<TopicItem, TopicListParams>
        headerTitle="课题列表"
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
            新增课题
          </Button>,
        ]}
        request={async (params) => {
          const result = await queryTopicList(params);
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
        scroll={{ x: 1300 }}
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
                content: `确定要删除选中的 ${selectedRowsState.length} 条课题吗？`,
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

      <TopicForm
        title="新增课题"
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

      <TopicForm
        title="编辑课题"
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
        title="课题详情"
      >
        {currentRow && (
          <ProDescriptions<TopicItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '课题编号', dataIndex: 'code' },
              { title: '课题名称', dataIndex: 'name', span: 2 },
              { title: '课题类型', dataIndex: 'type' },
              { title: '课题来源', dataIndex: 'source' },
              {
                title: '课题级别',
                dataIndex: 'level',
                render: (_, record) => (
                  <Tag color={levelColor[record.level]}>{record.level}</Tag>
                ),
              },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              { title: '负责人', dataIndex: 'leader' },
              {
                title: '课题经费',
                dataIndex: 'budget',
                render: (_, record) => `¥${record.budget?.toLocaleString() || 0}`,
              },
              { title: '开始日期', dataIndex: 'startDate', valueType: 'date' },
              { title: '结束日期', dataIndex: 'endDate', valueType: 'date' },
              { title: '课题简介', dataIndex: 'description', span: 2 },
              { title: '研究目标', dataIndex: 'objectives', span: 2 },
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

export default TopicPage;
