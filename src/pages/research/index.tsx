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
import ResearchForm from './components/ResearchForm';
import type { ResearchItem, ResearchListParams } from './data.d';
import { addResearch, queryResearchList, removeResearch, updateResearch } from './service';

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待启动', color: 'default' },
  1: { text: '进行中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
};

const ResearchPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<ResearchItem>();
  const [selectedRowsState, setSelectedRows] = useState<ResearchItem[]>([]);

  const handleAdd = async (fields: Partial<ResearchItem>) => {
    const hide = message.loading('正在添加');
    try {
      await addResearch({
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

  const handleUpdate = async (fields: Partial<ResearchItem>) => {
    const hide = message.loading('正在更新');
    try {
      await updateResearch({
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

  const handleRemove = async (selectedRows: ResearchItem[]) => {
    if (!selectedRows?.length) {
      message.warning('请选择要删除的调研');
      return false;
    }
    const hide = message.loading('正在删除');
    try {
      await removeResearch({
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

  const confirmDelete = (record: ResearchItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除调研「${record.title}」吗？`,
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

  const columns: ProColumns<ResearchItem>[] = [
    {
      title: '调研标题',
      dataIndex: 'title',
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
      title: '调研类型',
      dataIndex: 'type',
      width: 100,
      valueType: 'select',
      valueEnum: {
        市场调研: { text: '市场调研' },
        技术调研: { text: '技术调研' },
        竞品调研: { text: '竞品调研' },
        政策调研: { text: '政策调研' },
        用户调研: { text: '用户调研' },
        其他: { text: '其他' },
      },
    },
    {
      title: '研究领域',
      dataIndex: 'field',
      width: 100,
      valueType: 'select',
      valueEnum: {
        智慧城市: { text: '智慧城市' },
        人工智能: { text: '人工智能' },
        新能源: { text: '新能源' },
        产品分析: { text: '产品分析' },
        医疗健康: { text: '医疗健康' },
        金融科技: { text: '金融科技' },
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
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 160,
      hideInSearch: true,
      sorter: true,
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
      <ProTable<ResearchItem, ResearchListParams>
        headerTitle="调研列表"
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
            新增调研
          </Button>,
        ]}
        request={async (params) => {
          const result = await queryResearchList(params);
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
        scroll={{ x: 1200 }}
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
                content: `确定要删除选中的 ${selectedRowsState.length} 条调研吗？`,
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

      <ResearchForm
        title="新增调研"
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

      <ResearchForm
        title="编辑调研"
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
        title="调研详情"
      >
        {currentRow && (
          <ProDescriptions<ResearchItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '调研标题', dataIndex: 'title', span: 2 },
              { title: '调研类型', dataIndex: 'type' },
              { title: '研究领域', dataIndex: 'field' },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => {
                  const status = statusMap[record.status];
                  return <Tag color={status?.color}>{status?.text}</Tag>;
                },
              },
              { title: '负责人', dataIndex: 'leader' },
              { title: '开始日期', dataIndex: 'startDate', valueType: 'date' },
              { title: '结束日期', dataIndex: 'endDate', valueType: 'date' },
              { title: '调研目标', dataIndex: 'objective', span: 2 },
              { title: '调研方法', dataIndex: 'methods', span: 2 },
              { title: '调研发现', dataIndex: 'findings', span: 2 },
              { title: '调研结论', dataIndex: 'conclusion', span: 2 },
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

export default ResearchPage;
