import {
  BulbOutlined,
  CalendarOutlined,
  ClusterOutlined,
  ContactsOutlined,
  FileTextOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
  MailOutlined,
  MoneyCollectOutlined,
  PhoneOutlined,
  PlusOutlined,
  ProjectOutlined,
  ScheduleOutlined,
  SettingOutlined,
  TrademarkOutlined,
} from '@ant-design/icons';
import { GridContent, PageContainer, StatisticCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Input,
  type InputRef,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import useStyles from './Center.style';
import type { TagType } from './data.d';

const { Text, Paragraph } = Typography;

// 模拟当前用户数据
const currentUser = {
  name: '张三',
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  signature: '专注于科研项目管理与知识产权研究',
  title: '高级研究员',
  group: '人工智能研究中心',
  email: 'zhangsan@example.com',
  phone: '138****8888',
  geographic: {
    province: { label: '北京市' },
    city: { label: '海淀区' },
  },
  tags: [
    { key: '1', label: '项目管理' },
    { key: '2', label: '专利申请' },
    { key: '3', label: '科研攻关' },
    { key: '4', label: 'AI研究' },
  ],
};

// 模拟统计数据
const statisticsData = {
  taskCount: { total: 25, pending: 8, inProgress: 12, completed: 5 },
  projectCount: { total: 6, inProgress: 4, completed: 2 },
  clueCount: { total: 15, following: 8 },
  meetingCount: { total: 12, thisMonth: 3 },
  patentCount: { total: 8, authorized: 5, pending: 3 },
  articleCount: { total: 12, published: 10, draft: 2 },
  reimbursementCount: { total: 15, pending: 3, amount: 28500 },
  contractCount: { total: 8, inProgress: 5 },
};

// 模拟待办任务
const pendingTasks = [
  { id: 1, title: '完成项目A技术方案评审', priority: 'high', dueDate: '2024-01-20', project: '智能识别系统' },
  { id: 2, title: '提交专利申请材料', priority: 'high', dueDate: '2024-01-22', project: '算法优化专利' },
  { id: 3, title: '准备组会汇报PPT', priority: 'medium', dueDate: '2024-01-25', project: '周例会' },
  { id: 4, title: '审核外协合同条款', priority: 'medium', dueDate: '2024-01-28', project: '数据采集服务' },
  { id: 5, title: '完成报销单据整理', priority: 'low', dueDate: '2024-01-30', project: '差旅报销' },
];

// 模拟最近活动
const recentActivities = [
  { type: 'task', content: '完成了任务「系统架构设计」', time: '10分钟前', color: 'green' },
  { type: 'project', content: '更新了项目「智能识别系统」进度', time: '1小时前', color: 'blue' },
  { type: 'patent', content: '提交了专利「图像处理方法」', time: '2小时前', color: 'orange' },
  { type: 'meeting', content: '参加了组会「技术方案讨论」', time: '昨天', color: 'purple' },
  { type: 'reimbursement', content: '提交了报销单「差旅费用」', time: '2天前', color: 'cyan' },
  { type: 'clue', content: '新增了调研线索「市场分析」', time: '3天前', color: 'gold' },
];

// 模拟我参与的项目
const myProjects = [
  { id: 1, name: '智能识别系统', role: '负责人', progress: 75, status: 'active' },
  { id: 2, name: '数据分析平台', role: '核心成员', progress: 45, status: 'active' },
  { id: 3, name: '算法优化研究', role: '参与者', progress: 90, status: 'active' },
  { id: 4, name: '知识图谱构建', role: '负责人', progress: 100, status: 'completed' },
];

// 模拟即将到来的组会
const upcomingMeetings = [
  { id: 1, title: '周例会', date: '2024-01-22 10:00', location: '会议室A' },
  { id: 2, title: '技术评审会', date: '2024-01-25 14:00', location: '会议室B' },
  { id: 3, title: '项目汇报会', date: '2024-01-28 09:30', location: '大会议室' },
];

const TagList: React.FC<{ tags: typeof currentUser.tags }> = ({ tags }) => {
  const { styles } = useStyles();
  const ref = useRef<InputRef | null>(null);
  const [newTags, setNewTags] = useState<TagType[]>([]);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const showInput = () => {
    setInputVisible(true);
    if (ref.current) {
      ref.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];
    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: inputValue }];
    }
    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>专业标签</div>
      {(tags || []).concat(newTags).map((item) => (
        <Tag key={item.key} color="blue">{item.label}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} style={{ borderStyle: 'dashed' }}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center: React.FC = () => {
  const { styles } = useStyles();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '-';
    }
  };

  // 快捷入口配置
  const quickActions = [
    { title: '新建任务', icon: <ScheduleOutlined />, path: '/work/task', color: '#1890ff' },
    { title: '新建线索', icon: <BulbOutlined />, path: '/clue-research/clue', color: '#52c41a' },
    { title: '提交报销', icon: <MoneyCollectOutlined />, path: '/finance/reimbursement', color: '#faad14' },
    { title: '申请专利', icon: <TrademarkOutlined />, path: '/intellectual-property/patent', color: '#722ed1' },
    { title: '发起会议', icon: <CalendarOutlined />, path: '/work/meeting', color: '#13c2c2' },
    { title: '账号设置', icon: <SettingOutlined />, path: '/account/settings', color: '#8c8c8c' },
  ];

  return (
    <PageContainer title={false}>
      <GridContent>
        <Row gutter={24}>
          {/* 左侧个人信息卡片 */}
          <Col lg={6} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              <div className={styles.avatarHolder}>
                <img alt="" src={currentUser.avatar} />
                <div className={styles.name}>{currentUser.name}</div>
                <div>{currentUser.signature}</div>
              </div>
              <div className={styles.detail}>
                <p>
                  <ContactsOutlined style={{ marginRight: 8 }} />
                  {currentUser.title}
                </p>
                <p>
                  <ClusterOutlined style={{ marginRight: 8 }} />
                  {currentUser.group}
                </p>
                <p>
                  <HomeOutlined style={{ marginRight: 8 }} />
                  {currentUser.geographic.province.label}
                  {currentUser.geographic.city.label}
                </p>
                <p>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {currentUser.email}
                </p>
                <p>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {currentUser.phone}
                </p>
              </div>
              <Divider dashed />
              <TagList tags={currentUser.tags} />
              <Divider dashed />
              {/* 快捷入口 */}
              <div>
                <div className={styles.tagsTitle}>快捷入口</div>
                <Row gutter={[8, 8]}>
                  {quickActions.map((action) => (
                    <Col span={8} key={action.title}>
                      <Tooltip title={action.title}>
                        <Button
                          type="text"
                          style={{ 
                            width: '100%', 
                            height: 60, 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onClick={() => history.push(action.path)}
                        >
                          <span style={{ fontSize: 20, color: action.color }}>{action.icon}</span>
                          <span style={{ fontSize: 12, marginTop: 4 }}>{action.title}</span>
                        </Button>
                      </Tooltip>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>

            {/* 即将到来的组会 */}
            <Card 
              title="即将到来的组会" 
              bordered={false}
              extra={<a onClick={() => history.push('/work/meeting')}>更多</a>}
            >
              <List
                itemLayout="horizontal"
                dataSource={upcomingMeetings}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                      title={item.title}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{item.date}</Text>
                          <Text type="secondary">{item.location}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 右侧主内容区 */}
          <Col lg={18} md={24}>
            {/* 数据统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <StatisticCard
                  statistic={{
                    title: '我的任务',
                    value: statisticsData.taskCount.total,
                    suffix: `/ 待办 ${statisticsData.taskCount.pending}`,
                  }}
                  chart={
                    <Progress
                      percent={Math.round((statisticsData.taskCount.completed / statisticsData.taskCount.total) * 100)}
                      size="small"
                      status="active"
                    />
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/work/task')}
                />
              </Col>
              <Col span={6}>
                <StatisticCard
                  statistic={{
                    title: '参与项目',
                    value: statisticsData.projectCount.total,
                    suffix: `/ 进行中 ${statisticsData.projectCount.inProgress}`,
                  }}
                  chart={
                    <Progress
                      percent={Math.round((statisticsData.projectCount.completed / statisticsData.projectCount.total) * 100)}
                      size="small"
                      status="active"
                      strokeColor="#52c41a"
                    />
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/project/list')}
                />
              </Col>
              <Col span={6}>
                <StatisticCard
                  statistic={{
                    title: '知识产权',
                    value: statisticsData.patentCount.total + statisticsData.articleCount.total,
                    suffix: `专利 ${statisticsData.patentCount.total} / 文章 ${statisticsData.articleCount.total}`,
                  }}
                  chart={
                    <Progress
                      percent={Math.round((statisticsData.patentCount.authorized / statisticsData.patentCount.total) * 100)}
                      size="small"
                      status="active"
                      strokeColor="#722ed1"
                    />
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/intellectual-property/patent')}
                />
              </Col>
              <Col span={6}>
                <StatisticCard
                  statistic={{
                    title: '报销申请',
                    value: statisticsData.reimbursementCount.total,
                    suffix: `/ 待审 ${statisticsData.reimbursementCount.pending}`,
                  }}
                  chart={
                    <Statistic 
                      value={statisticsData.reimbursementCount.amount} 
                      prefix="¥" 
                      valueStyle={{ fontSize: 14, color: '#faad14' }}
                    />
                  }
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/finance/reimbursement')}
                />
              </Col>
            </Row>

            <Row gutter={24}>
              {/* 待办任务 */}
              <Col span={14}>
                <Card
                  title="我的待办任务"
                  bordered={false}
                  extra={<a onClick={() => history.push('/work/task')}>查看全部</a>}
                  style={{ marginBottom: 24 }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={pendingTasks}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Tag color={getPriorityColor(item.priority)} key="priority">
                            {getPriorityText(item.priority)}
                          </Tag>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge 
                              status={item.priority === 'high' ? 'error' : item.priority === 'medium' ? 'warning' : 'processing'} 
                            />
                          }
                          title={item.title}
                          description={
                            <Space>
                              <Text type="secondary">
                                <ProjectOutlined style={{ marginRight: 4 }} />
                                {item.project}
                              </Text>
                              <Text type="secondary">
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {dayjs(item.dueDate).format('MM-DD')}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                {/* 我参与的项目 */}
                <Card
                  title="我参与的项目"
                  bordered={false}
                  extra={<a onClick={() => history.push('/project/list')}>查看全部</a>}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={myProjects}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              style={{ backgroundColor: item.status === 'completed' ? '#52c41a' : '#1890ff' }}
                              icon={<FundProjectionScreenOutlined />}
                            />
                          }
                          title={
                            <Space>
                              <span>{item.name}</span>
                              <Tag color={item.role === '负责人' ? 'gold' : item.role === '核心成员' ? 'blue' : 'default'}>
                                {item.role}
                              </Tag>
                            </Space>
                          }
                          description={
                            <Progress 
                              percent={item.progress} 
                              size="small" 
                              status={item.status === 'completed' ? 'success' : 'active'}
                            />
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 最近动态 */}
              <Col span={10}>
                <Card
                  title="最近动态"
                  bordered={false}
                  style={{ marginBottom: 24 }}
                >
                  <Timeline
                    items={recentActivities.map((activity) => ({
                      color: activity.color,
                      children: (
                        <>
                          <Paragraph ellipsis style={{ marginBottom: 0 }}>
                            {activity.content}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {activity.time}
                          </Text>
                        </>
                      ),
                    }))}
                  />
                </Card>

                {/* 数据概览 */}
                <Card title="本月数据概览" bordered={false}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="跟进线索"
                        value={statisticsData.clueCount.following}
                        prefix={<BulbOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="参加会议"
                        value={statisticsData.meetingCount.thisMonth}
                        prefix={<CalendarOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="处理合同"
                        value={statisticsData.contractCount.inProgress}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="完成任务"
                        value={statisticsData.taskCount.completed}
                        prefix={<ScheduleOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </GridContent>
    </PageContainer>
  );
};

export default Center;
