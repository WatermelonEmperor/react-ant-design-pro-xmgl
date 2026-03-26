import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Avatar, Col, List, Progress, Row, Tag, Timeline, Typography } from 'antd';
import React from 'react';
import {
  ProjectOutlined,
  TeamOutlined,
  FileTextOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// 统计数据
const statisticsData = {
  projects: { total: 28, progress: 12, completed: 16 },
  clues: { total: 45, following: 18, converted: 12 },
  tasks: { total: 56, pending: 23, done: 33 },
  contracts: { total: 15, amount: 2850000 },
};

// 待办任务
const todoList = [
  { id: 1, title: '提交智慧城市项目方案', deadline: '2024-03-20', priority: 'high' },
  { id: 2, title: '与客户确认需求细节', deadline: '2024-03-21', priority: 'high' },
  { id: 3, title: '完成专利申请材料', deadline: '2024-03-22', priority: 'medium' },
  { id: 4, title: '组织周例会', deadline: '2024-03-23', priority: 'low' },
  { id: 5, title: '审核报销单据', deadline: '2024-03-24', priority: 'medium' },
];

// 项目进度
const projectProgress = [
  { name: '智慧城市一期', progress: 85, status: 'active' },
  { name: '医疗信息化升级', progress: 60, status: 'active' },
  { name: '金融风控系统', progress: 35, status: 'active' },
  { name: '教育平台建设', progress: 90, status: 'active' },
];

// 最近动态
const recentActivities = [
  { time: '10分钟前', content: '张三 完成了 智慧城市项目需求分析', type: 'success' },
  { time: '30分钟前', content: '李四 提交了 报销申请 (¥3,500)', type: 'info' },
  { time: '1小时前', content: '王五 新增了 合作线索 - 高校科研合作', type: 'info' },
  { time: '2小时前', content: '赵六 更新了 专利申请进度', type: 'warning' },
  { time: '3小时前', content: '系统 自动备份完成', type: 'success' },
];

const priorityColor: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};

const priorityText: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const ConsolePage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '控制台',
        ghost: true,
      }}
    >
      <Row gutter={[16, 16]}>
        {/* 统计卡片 */}
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '项目总数',
              value: statisticsData.projects.total,
              icon: <ProjectOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
              description: (
                <Text type="secondary">
                  进行中 {statisticsData.projects.progress} / 已完成 {statisticsData.projects.completed}
                </Text>
              ),
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '线索数量',
              value: statisticsData.clues.total,
              icon: <BulbOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
              description: (
                <Text type="secondary">
                  跟进中 {statisticsData.clues.following} / 已转化 {statisticsData.clues.converted}
                </Text>
              ),
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '任务数量',
              value: statisticsData.tasks.total,
              icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />,
              description: (
                <Text type="secondary">
                  待处理 {statisticsData.tasks.pending} / 已完成 {statisticsData.tasks.done}
                </Text>
              ),
            }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            statistic={{
              title: '合同金额',
              value: statisticsData.contracts.amount,
              prefix: '¥',
              icon: <DollarOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
              description: (
                <Text type="secondary">
                  合同数量 {statisticsData.contracts.total} 份
                </Text>
              ),
            }}
          />
        </Col>

        {/* 待办任务 */}
        <Col xs={24} lg={12}>
          <ProCard title="待办任务" extra={<a href="/work/task">查看全部</a>} headerBordered>
            <List
              size="small"
              dataSource={todoList}
              renderItem={(item) => (
                <List.Item
                  extra={<Tag color={priorityColor[item.priority]}>{priorityText[item.priority]}</Tag>}
                >
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined style={{ fontSize: 16, color: '#999' }} />}
                    title={item.title}
                    description={`截止日期：${item.deadline}`}
                  />
                </List.Item>
              )}
            />
          </ProCard>
        </Col>

        {/* 项目进度 */}
        <Col xs={24} lg={12}>
          <ProCard title="项目进度" extra={<a href="/project/list">查看全部</a>} headerBordered>
            <List
              size="small"
              dataSource={projectProgress}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{item.name}</Text>
                      <Text type="secondary">{item.progress}%</Text>
                    </div>
                    <Progress
                      percent={item.progress}
                      showInfo={false}
                      strokeColor={item.progress >= 80 ? '#52c41a' : item.progress >= 50 ? '#1890ff' : '#faad14'}
                    />
                  </div>
                </List.Item>
              )}
            />
          </ProCard>
        </Col>

        {/* 最近动态 */}
        <Col xs={24} lg={12}>
          <ProCard title="最近动态" headerBordered style={{ minHeight: 380 }}>
            <Timeline
              items={recentActivities.map((item) => ({
                color: item.type === 'success' ? 'green' : item.type === 'warning' ? 'orange' : 'blue',
                children: (
                  <div>
                    <Text>{item.content}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                  </div>
                ),
              }))}
            />
          </ProCard>
        </Col>

        {/* 快捷入口 */}
        <Col xs={24} lg={12}>
          <ProCard title="快捷入口" headerBordered style={{ minHeight: 380 }}>
            <Row gutter={[16, 16]}>
              {[
                { title: '新增线索', icon: <BulbOutlined />, href: '/clue-research/clue', color: '#1890ff' },
                { title: '新增项目', icon: <ProjectOutlined />, href: '/project/list', color: '#52c41a' },
                { title: '新增任务', icon: <CheckCircleOutlined />, href: '/work/task', color: '#faad14' },
                { title: '新增合同', icon: <FileTextOutlined />, href: '/contract/receipt', color: '#eb2f96' },
                { title: '团队管理', icon: <TeamOutlined />, href: '/personnel/team', color: '#722ed1' },
                { title: '组会管理', icon: <ClockCircleOutlined />, href: '/work/meeting', color: '#13c2c2' },
              ].map((item) => (
                <Col key={item.title} xs={12} sm={8}>
                  <a href={item.href}>
                    <ProCard
                      hoverable
                      style={{ textAlign: 'center' }}
                      bodyStyle={{ padding: '20px 12px' }}
                    >
                      <Avatar
                        size={48}
                        style={{ backgroundColor: item.color, marginBottom: 8 }}
                        icon={item.icon}
                      />
                      <div>{item.title}</div>
                    </ProCard>
                  </a>
                </Col>
              ))}
            </Row>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ConsolePage;
