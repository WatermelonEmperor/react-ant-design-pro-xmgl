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
import ClueForm from './components/ClueForm';
import type { ClueItem, ClueListParams } from './data.d';
import { addClue, queryClueList, removeClue, updateClue } from './service';

// 状态映射
const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待跟进', color: 'default' },
  1: { text: '跟进中', color: 'processing' },
  2: { text: '已暂停', color: 'warning' },
  3: { text: '已转化', color: 'success' },
  4: { text: '已关闭', color: 'error' },
};

// 优先级映射
const priorityMap: Record<number, { text: string; color: string }> = {
  1: { text: '高', color: 'red' },
  2: { text: '中', color: 'orange' },
  3: { text: '低', color: 'blue' },
};

const CluePage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>(null);
  const [currentRow, setCurrentRow] = useState<ClueItem>();
  const [selectedRowsState, setSelectedRows] = useState<ClueItem[]>([]);

  // 处理添加
  const handleAdd = async (fields: Partial<ClueItem>) => {
    const hide = message.loading('正在添加');
    try {
      await addClue({
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

  // 处理编辑
  const handleUpdate = async (fields: Partial<ClueItem>) => {
    const hide = message.loading('正在更新');
    try {
      await updateClue({
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

  // 处理删除
  const handleRemove = async (selectedRows: ClueItem[]) => {
    if (!selectedRows?.length) {
      message.warning('请选择要删除的线索');
      return false;
    }
    const hide = message.loading('正在删除');
    try {
      await removeClue({
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

  // 确认删除
  const confirmDelete = (record: ClueItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除线索「${record.name}」吗？`,
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

  const columns: ProColumns<ClueItem>[] = [
    {
      title: '线索名称',
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
      title: '线索来源',
      dataIndex: 'source',
      ellipsis: true,
      width: 120,
      valueType: 'select',
      valueEnum: {
        政府招标: { text: '政府招标' },
        客户推荐: { text: '客户推荐' },
        学术交流: { text: '学术交流' },
        展会获取: { text: '展会获取' },
        网络渠道: { text: '网络渠道' },
        主动拜访: { text: '主动拜访' },
        其他: { text: '其他' },
      },
    },
    {
      title: '线索类型',
      dataIndex: 'type',
      ellipsis: true,
      width: 100,
      valueType: 'select',
      valueEnum: {
        项目线索: { text: '项目线索' },
        咨询线索: { text: '咨询线索' },
        合作线索: { text: '合作线索' },
        其他线索: { text: '其他线索' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '待跟进', status: 'Default' },
        1: { text: '跟进中', status: 'Processing' },
        2: { text: '已暂停', status: 'Warning' },
        3: { text: '已转化', status: 'Success' },
        4: { text: '已关闭', status: 'Error' },
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
      title: '联系人',
      dataIndex: 'contact',
      ellipsis: true,
      width: 100,
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      ellipsis: true,
      width: 130,
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '计划跟进日期',
      dataIndex: 'followUpDate',
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
      title: '创建人',
      dataIndex: 'createdBy',
      width: 100,
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
      <ProTable<ClueItem, ClueListParams>
        headerTitle="线索列表"
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
            新增线索
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const result = await queryClueList({
            ...params,
            ...filter,
          });
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
                content: `确定要删除选中的 ${selectedRowsState.length} 条线索吗？`,
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

      {/* 新增线索弹窗 */}
      <ClueForm
        title="新增线索"
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

      {/* 编辑线索弹窗 */}
      <ClueForm
        title="编辑线索"
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

      {/* 详情抽屉 */}
      <Drawer
        width={640}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        title="线索详情"
      >
        {currentRow && (
          <ProDescriptions<ClueItem>
            column={2}
            dataSource={currentRow}
            columns={[
              { title: '线索名称', dataIndex: 'name', span: 2 },
              { title: '线索来源', dataIndex: 'source' },
              { title: '线索类型', dataIndex: 'type' },
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
              { title: '联系人', dataIndex: 'contact' },
              { title: '联系电话', dataIndex: 'phone', copyable: true },
              { title: '邮箱', dataIndex: 'email', span: 2, copyable: true },
              { title: '计划跟进日期', dataIndex: 'followUpDate', valueType: 'date' },
              { title: '创建人', dataIndex: 'createdBy' },
              { title: '创建时间', dataIndex: 'createdAt', valueType: 'dateTime' },
              { title: '更新时间', dataIndex: 'updatedAt', valueType: 'dateTime' },
              { title: '线索描述', dataIndex: 'description', span: 2 },
              { title: '备注', dataIndex: 'remark', span: 2 },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CluePage;
