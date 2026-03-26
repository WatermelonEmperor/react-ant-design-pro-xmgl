import { DeleteOutlined, EditOutlined, PlusOutlined, PushpinOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

type NoteItem = {
  id: string;
  title: string;
  content: string;
  color: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

const initialNotes: NoteItem[] = [
  {
    id: '1',
    title: '项目会议要点',
    content: '1. 确认需求范围\n2. 分配开发任务\n3. 下周三前完成原型设计\n4. 每周五下午进度汇报',
    color: '#fff7e6',
    category: '工作',
    isPinned: true,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-18',
  },
  {
    id: '2',
    title: '待办事项',
    content: '- 提交周报\n- 审核代码\n- 更新文档\n- 准备演示材料',
    color: '#e6f7ff',
    category: '待办',
    isPinned: true,
    createdAt: '2024-03-16',
    updatedAt: '2024-03-19',
  },
  {
    id: '3',
    title: '学习笔记',
    content: 'React 18 新特性：\n1. Concurrent Mode\n2. Automatic Batching\n3. Transitions\n4. Suspense improvements',
    color: '#f6ffed',
    category: '学习',
    isPinned: false,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
  {
    id: '4',
    title: '灵感记录',
    content: '可以考虑在系统中增加AI助手功能，帮助用户快速完成重复性工作',
    color: '#fff0f6',
    category: '想法',
    isPinned: false,
    createdAt: '2024-03-12',
    updatedAt: '2024-03-12',
  },
  {
    id: '5',
    title: '重要联系人',
    content: '张经理：138****1234\n李总监：139****5678\n技术支持：400-xxx-xxxx',
    color: '#f9f0ff',
    category: '工作',
    isPinned: false,
    createdAt: '2024-03-08',
    updatedAt: '2024-03-14',
  },
];

const colorOptions = [
  { label: '橙色', value: '#fff7e6' },
  { label: '蓝色', value: '#e6f7ff' },
  { label: '绿色', value: '#f6ffed' },
  { label: '粉色', value: '#fff0f6' },
  { label: '紫色', value: '#f9f0ff' },
  { label: '白色', value: '#ffffff' },
];

const categoryOptions = [
  { label: '工作', value: '工作' },
  { label: '待办', value: '待办' },
  { label: '学习', value: '学习' },
  { label: '想法', value: '想法' },
  { label: '其他', value: '其他' },
];

const categoryColor: Record<string, string> = {
  工作: 'blue',
  待办: 'orange',
  学习: 'green',
  想法: 'purple',
  其他: 'default',
};

const WorkNotePage: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [form] = Form.useForm();
  const [filterCategory, setFilterCategory] = useState<string>('');

  const handleAdd = () => {
    setEditingNote(null);
    form.resetFields();
    form.setFieldsValue({ color: '#fff7e6', category: '工作' });
    setModalOpen(true);
  };

  const handleEdit = (note: NoteItem) => {
    setEditingNote(note);
    form.setFieldsValue(note);
    setModalOpen(true);
  };

  const handleDelete = (note: NoteItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除便签「${note.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setNotes(notes.filter((n) => n.id !== note.id));
        message.success('删除成功');
      },
    });
  };

  const handlePin = (note: NoteItem) => {
    setNotes(
      notes.map((n) => (n.id === note.id ? { ...n, isPinned: !n.isPinned } : n))
    );
    message.success(note.isPinned ? '已取消置顶' : '已置顶');
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingNote) {
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id
            ? { ...n, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : n
        )
      );
      message.success('更新成功');
    } else {
      const newNote: NoteItem = {
        id: Date.now().toString(),
        ...values,
        isPinned: false,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setNotes([newNote, ...notes]);
      message.success('添加成功');
    }
    setModalOpen(false);
  };

  const filteredNotes = filterCategory
    ? notes.filter((n) => n.category === filterCategory)
    : notes;

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const renderNoteCard = (note: NoteItem) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={note.id}>
      <Card
        size="small"
        style={{ backgroundColor: note.color, height: '100%' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {note.isPinned && <PushpinOutlined style={{ color: '#1890ff' }} />}
            <Text strong ellipsis style={{ flex: 1 }}>
              {note.title}
            </Text>
          </div>
        }
        extra={
          <Space size={4}>
            <Button
              type="text"
              size="small"
              icon={<PushpinOutlined />}
              onClick={() => handlePin(note)}
              style={{ color: note.isPinned ? '#1890ff' : undefined }}
            />
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(note)}
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(note)}
            />
          </Space>
        }
      >
        <Paragraph
          ellipsis={{ rows: 4 }}
          style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}
        >
          {note.content}
        </Paragraph>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag color={categoryColor[note.category]}>{note.category}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {note.updatedAt}
          </Text>
        </div>
      </Card>
    </Col>
  );

  return (
    <PageContainer>
      <Card
        title="便签列表"
        extra={
          <Space>
            <Select
              placeholder="按分类筛选"
              allowClear
              style={{ width: 120 }}
              options={categoryOptions}
              value={filterCategory || undefined}
              onChange={(value) => setFilterCategory(value || '')}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增便签
            </Button>
          </Space>
        }
      >
        {filteredNotes.length === 0 ? (
          <Empty description="暂无便签" />
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <>
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  已置顶
                </Text>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  {pinnedNotes.map(renderNoteCard)}
                </Row>
              </>
            )}
            {unpinnedNotes.length > 0 && (
              <>
                {pinnedNotes.length > 0 && (
                  <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                    其他便签
                  </Text>
                )}
                <Row gutter={[16, 16]}>
                  {unpinnedNotes.map(renderNoteCard)}
                </Row>
              </>
            )}
          </>
        )}
      </Card>

      <Modal
        title={editingNote ? '编辑便签' : '新增便签'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入便签标题" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={5} placeholder="请输入便签内容" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item name="color" label="颜色">
            <Select options={colorOptions}>
              {colorOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: opt.value,
                        border: '1px solid #d9d9d9',
                        borderRadius: 2,
                      }}
                    />
                    {opt.label}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default WorkNotePage;
