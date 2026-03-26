import { PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message, Popconfirm, Space, Tag, Descriptions, Avatar, Timeline } from 'antd';
import React, { useRef, useState } from 'react';

interface ResumeItem {
  id: string;
  name: string;
  avatar?: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  education: string;
  school: string;
  major: string;
  workYears: number;
  expectedPosition: string;
  expectedSalary: string;
  status: string;
  source: string;
  skills?: string[];
  workExperience?: { company: string; position: string; period: string; description?: string }[];
  remark?: string;
  createdAt: string;
}

const mockData: ResumeItem[] = [
  {
    id: '1',
    name: '张伟',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r1',
    gender: 'male',
    age: 28,
    phone: '13800138001',
    email: 'zhangwei@email.com',
    education: 'master',
    school: '清华大学',
    major: '计算机科学',
    workYears: 5,
    expectedPosition: '高级前端工程师',
    expectedSalary: '30K-40K',
    status: 'interview',
    source: 'boss',
    skills: ['React', 'TypeScript', 'Node.js', 'Vue'],
    workExperience: [
      { company: '某互联网大厂', position: '前端工程师', period: '2021-至今', description: '负责核心产品前端开发' },
      { company: '某创业公司', position: '前端开发', period: '2019-2021', description: '负责移动端H5开发' },
    ],
    remark: '技术能力强，面试表现优秀',
    createdAt: '2024-03-01',
  },
  {
    id: '2',
    name: '李娜',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r2',
    gender: 'female',
    age: 25,
    phone: '13800138002',
    email: 'lina@email.com',
    education: 'bachelor',
    school: '浙江大学',
    major: '软件工程',
    workYears: 3,
    expectedPosition: 'Java开发工程师',
    expectedSalary: '20K-30K',
    status: 'pending',
    source: 'lagou',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    workExperience: [
      { company: '某科技公司', position: 'Java开发', period: '2021-至今', description: '后端服务开发' },
    ],
    createdAt: '2024-03-05',
  },
  {
    id: '3',
    name: '王强',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=r3',
    gender: 'male',
    age: 32,
    phone: '13800138003',
    email: 'wangqiang@email.com',
    education: 'bachelor',
    school: '北京理工大学',
    major: '计算机应用',
    workYears: 8,
    expectedPosition: '技术经理',
    expectedSalary: '40K-50K',
    status: 'offer',
    source: 'referral',
    skills: ['团队管理', 'Python', 'AI/ML', '项目管理'],
    workExperience: [
      { company: '某AI公司', position: '技术负责人', period: '2020-至今', description: '带领团队完成多个AI项目' },
      { company: '某互联网公司', position: '高级工程师', period: '2016-2020', description: '核心算法开发' },
    ],
    remark: '已发offer，等待入职',
    createdAt: '2024-02-20',
  },
];

const statusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待筛选', color: 'default' },
  screening: { text: '筛选中', color: 'processing' },
  interview: { text: '面试中', color: 'blue' },
  offer: { text: '已发Offer', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' },
  hired: { text: '已入职', color: 'green' },
};

const educationMap: Record<string, string> = {
  high: '高中',
  college: '大专',
  bachelor: '本科',
  master: '硕士',
  doctor: '博士',
};

const sourceMap: Record<string, string> = {
  boss: 'BOSS直聘',
  lagou: '拉勾网',
  zhilian: '智联招聘',
  liepin: '猎聘',
  referral: '内部推荐',
  other: '其他',
};

const ResumePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<ResumeItem>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<ResumeItem[]>(mockData);

  const columns: ProColumns<ResumeItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
          <Space>
            <Avatar size="small" src={record.avatar} icon={<UserOutlined />} />
            {record.name}
          </Space>
        </a>
      ),
    },
    {
      title: '期望职位',
      dataIndex: 'expectedPosition',
      width: 150,
    },
    {
      title: '学历',
      dataIndex: 'education',
      width: 80,
      valueType: 'select',
      valueEnum: {
        high: { text: '高中' },
        college: { text: '大专' },
        bachelor: { text: '本科' },
        master: { text: '硕士' },
        doctor: { text: '博士' },
      },
      render: (_, record) => educationMap[record.education],
    },
    {
      title: '工作年限',
      dataIndex: 'workYears',
      width: 100,
      hideInSearch: true,
      render: (_, record) => `${record.workYears}年`,
    },
    {
      title: '期望薪资',
      dataIndex: 'expectedSalary',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 130,
      hideInSearch: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      valueType: 'select',
      valueEnum: {
        boss: { text: 'BOSS直聘' },
        lagou: { text: '拉勾网' },
        zhilian: { text: '智联招聘' },
        liepin: { text: '猎聘' },
        referral: { text: '内部推荐' },
        other: { text: '其他' },
      },
      render: (_, record) => sourceMap[record.source],
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        pending: { text: '待筛选' },
        screening: { text: '筛选中' },
        interview: { text: '面试中' },
        offer: { text: '已发Offer' },
        rejected: { text: '已拒绝' },
        hired: { text: '已入职' },
      },
      render: (_, record) => (
        <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      width: 110,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => (
        <Space>
          <a onClick={() => { setCurrentRow(record); setDetailDrawerVisible(true); }}>
            <EyeOutlined /> 查看
          </a>
          <a onClick={() => { setCurrentRow(record); setEditModalVisible(true); }}>
            <EditOutlined /> 编辑
          </a>
          <a><DownloadOutlined /> 下载</a>
        </Space>
      ),
    },
  ];

  const handleAdd = async (values: Partial<ResumeItem>) => {
    const newItem: ResumeItem = {
      id: Date.now().toString(),
      name: values.name || '',
      gender: values.gender || 'male',
      age: values.age || 0,
      phone: values.phone || '',
      email: values.email || '',
      education: values.education || 'bachelor',
      school: values.school || '',
      major: values.major || '',
      workYears: values.workYears || 0,
      expectedPosition: values.expectedPosition || '',
      expectedSalary: values.expectedSalary || '',
      status: 'pending',
      source: values.source || 'other',
      skills: values.skills,
      remark: values.remark,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDataSource([newItem, ...dataSource]);
    message.success('新增简历成功');
    return true;
  };

  const handleEdit = async (values: Partial<ResumeItem>) => {
    if (!currentRow) return false;
    const newData = dataSource.map(item => 
      item.id === currentRow.id ? { ...item, ...values } : item
    );
    setDataSource(newData);
    message.success('编辑简历成功');
    return true;
  };

  const handleDelete = (ids: string[]) => {
    setDataSource(dataSource.filter(item => !ids.includes(item.id)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  return (
    <PageContainer>
      <ProTable<ResumeItem>
        headerTitle="简历列表"
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
            新增简历
          </Button>,
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title="确定要删除选中的简历吗？"
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
        title="新增简历"
        width={700}
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        onFinish={handleAdd}
        modalProps={{
          destroyOnClose: true,
          styles: { body: { maxHeight: '60vh', overflowY: 'auto', paddingRight: 8 } },
        }}
      >
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormSelect
          name="gender"
          label="性别"
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDigit name="age" label="年龄" min={18} max={65} rules={[{ required: true }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" rules={[{ type: 'email' }]} />
        <ProFormSelect
          name="education"
          label="学历"
          options={[
            { label: '高中', value: 'high' },
            { label: '大专', value: 'college' },
            { label: '本科', value: 'bachelor' },
            { label: '硕士', value: 'master' },
            { label: '博士', value: 'doctor' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="school" label="毕业院校" rules={[{ required: true }]} />
        <ProFormText name="major" label="专业" rules={[{ required: true }]} />
        <ProFormDigit name="workYears" label="工作年限" min={0} rules={[{ required: true }]} />
        <ProFormText name="expectedPosition" label="期望职位" rules={[{ required: true }]} />
        <ProFormText name="expectedSalary" label="期望薪资" placeholder="如：20K-30K" rules={[{ required: true }]} />
        <ProFormSelect
          name="source"
          label="简历来源"
          options={[
            { label: 'BOSS直聘', value: 'boss' },
            { label: '拉勾网', value: 'lagou' },
            { label: '智联招聘', value: 'zhilian' },
            { label: '猎聘', value: 'liepin' },
            { label: '内部推荐', value: 'referral' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="skills"
          label="技能标签"
          mode="tags"
          fieldProps={{ tokenSeparators: [','] }}
          placeholder="输入技能后按回车"
        />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <ModalForm
        title="编辑简历"
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
        <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
        <ProFormSelect
          name="gender"
          label="性别"
          options={[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormDigit name="age" label="年龄" min={18} max={65} rules={[{ required: true }]} />
        <ProFormText name="phone" label="电话" rules={[{ required: true }]} />
        <ProFormText name="email" label="邮箱" rules={[{ type: 'email' }]} />
        <ProFormSelect
          name="education"
          label="学历"
          options={[
            { label: '高中', value: 'high' },
            { label: '大专', value: 'college' },
            { label: '本科', value: 'bachelor' },
            { label: '硕士', value: 'master' },
            { label: '博士', value: 'doctor' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormText name="school" label="毕业院校" rules={[{ required: true }]} />
        <ProFormText name="major" label="专业" rules={[{ required: true }]} />
        <ProFormDigit name="workYears" label="工作年限" min={0} rules={[{ required: true }]} />
        <ProFormText name="expectedPosition" label="期望职位" rules={[{ required: true }]} />
        <ProFormText name="expectedSalary" label="期望薪资" rules={[{ required: true }]} />
        <ProFormSelect
          name="source"
          label="简历来源"
          options={[
            { label: 'BOSS直聘', value: 'boss' },
            { label: '拉勾网', value: 'lagou' },
            { label: '智联招聘', value: 'zhilian' },
            { label: '猎聘', value: 'liepin' },
            { label: '内部推荐', value: 'referral' },
            { label: '其他', value: 'other' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '待筛选', value: 'pending' },
            { label: '筛选中', value: 'screening' },
            { label: '面试中', value: 'interview' },
            { label: '已发Offer', value: 'offer' },
            { label: '已拒绝', value: 'rejected' },
            { label: '已入职', value: 'hired' },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormSelect
          name="skills"
          label="技能标签"
          mode="tags"
          fieldProps={{ tokenSeparators: [','] }}
        />
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>

      <Drawer
        title="简历详情"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentRow && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="头像" span={2}>
                <Avatar size={64} src={currentRow.avatar} icon={<UserOutlined />} />
              </Descriptions.Item>
              <Descriptions.Item label="姓名">{currentRow.name}</Descriptions.Item>
              <Descriptions.Item label="性别">{currentRow.gender === 'male' ? '男' : '女'}</Descriptions.Item>
              <Descriptions.Item label="年龄">{currentRow.age}岁</Descriptions.Item>
              <Descriptions.Item label="工作年限">{currentRow.workYears}年</Descriptions.Item>
              <Descriptions.Item label="电话">{currentRow.phone}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{currentRow.email}</Descriptions.Item>
              <Descriptions.Item label="学历">{educationMap[currentRow.education]}</Descriptions.Item>
              <Descriptions.Item label="毕业院校">{currentRow.school}</Descriptions.Item>
              <Descriptions.Item label="专业" span={2}>{currentRow.major}</Descriptions.Item>
              <Descriptions.Item label="期望职位">{currentRow.expectedPosition}</Descriptions.Item>
              <Descriptions.Item label="期望薪资">{currentRow.expectedSalary}</Descriptions.Item>
              <Descriptions.Item label="简历来源">{sourceMap[currentRow.source]}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentRow.status]?.color}>{statusMap[currentRow.status]?.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="技能" span={2}>
                {currentRow.skills?.map(skill => (
                  <Tag key={skill} color="blue">{skill}</Tag>
                )) || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentRow.remark || '-'}</Descriptions.Item>
            </Descriptions>
            
            {currentRow.workExperience && currentRow.workExperience.length > 0 && (
              <>
                <h4 style={{ marginTop: 24, marginBottom: 16 }}>工作经历</h4>
                <Timeline
                  items={currentRow.workExperience.map(exp => ({
                    children: (
                      <div>
                        <div style={{ fontWeight: 500 }}>{exp.company} - {exp.position}</div>
                        <div style={{ color: '#999', fontSize: 12 }}>{exp.period}</div>
                        {exp.description && <div style={{ marginTop: 4 }}>{exp.description}</div>}
                      </div>
                    ),
                  }))}
                />
              </>
            )}
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ResumePage;
