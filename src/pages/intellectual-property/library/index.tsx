import { SearchOutlined, FileTextOutlined, CodeOutlined, ReadOutlined, BankOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, StatisticCard } from '@ant-design/pro-components';
import { Input, List, Tag, Space, Tabs, Empty, Avatar, Row, Col } from 'antd';
import React, { useState } from 'react';

interface IPItem {
  id: string;
  type: 'patent' | 'software' | 'article';
  title: string;
  authors: string;
  date: string;
  status: string;
  tags?: string[];
}

const mockIPData: IPItem[] = [
  { id: '1', type: 'patent', title: '一种基于深度学习的图像识别方法', authors: '张三、李四、王五', date: '2024-06-20', status: 'authorized', tags: ['发明专利', '已授权'] },
  { id: '2', type: 'patent', title: '一种智慧城市数据处理系统', authors: '李明、赵六', date: '2024-02-20', status: 'examining', tags: ['发明专利', '审查中'] },
  { id: '3', type: 'patent', title: '一种数据可视化界面', authors: '王设计', date: '2024-05-15', status: 'authorized', tags: ['外观设计', '已授权'] },
  { id: '4', type: 'software', title: '智慧城市综合管理平台软件 V1.0', authors: '张三、李四', date: '2024-03-20', status: 'registered', tags: ['应用软件', '已登记'] },
  { id: '5', type: 'software', title: 'AI智能客服系统软件 V2.0', authors: '李明、王五', date: '2024-02-20', status: 'examining', tags: ['应用软件', '审查中'] },
  { id: '6', type: 'software', title: '数据分析可视化组件库 V1.5', authors: '赵六', date: '2024-03-10', status: 'draft', tags: ['工具软件', '草稿'] },
  { id: '7', type: 'article', title: '基于深度学习的图像识别技术研究与应用', authors: '张三、李四、王五', date: '2024-03-15', status: 'published', tags: ['SCI', '已发表'] },
  { id: '8', type: 'article', title: '智慧城市数据治理框架研究', authors: '李明、赵六', date: '2024-02-20', status: 'published', tags: ['EI', '已发表'] },
  { id: '9', type: 'article', title: '大语言模型在企业知识管理中的应用探索', authors: '王强、张三', date: '', status: 'submitted', tags: ['核心期刊', '已投稿'] },
];

const typeIconMap = {
  patent: <FileTextOutlined style={{ color: '#1890ff' }} />,
  software: <CodeOutlined style={{ color: '#52c41a' }} />,
  article: <ReadOutlined style={{ color: '#fa8c16' }} />,
};

const typeNameMap = {
  patent: '专利',
  software: '软著',
  article: '文章',
};

const statusColorMap: Record<string, string> = {
  authorized: 'success',
  registered: 'success',
  published: 'success',
  examining: 'processing',
  submitted: 'blue',
  draft: 'default',
};

const IPLibraryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredData = mockIPData.filter(item => {
    const matchSearch = !searchValue || 
      item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchValue.toLowerCase());
    const matchType = activeTab === 'all' || item.type === activeTab;
    return matchSearch && matchType;
  });

  const patentCount = mockIPData.filter(i => i.type === 'patent').length;
  const softwareCount = mockIPData.filter(i => i.type === 'software').length;
  const articleCount = mockIPData.filter(i => i.type === 'article').length;
  const authorizedCount = mockIPData.filter(i => ['authorized', 'registered', 'published'].includes(i.status)).length;

  return (
    <PageContainer>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '知识产权总数',
              value: mockIPData.length,
              icon: <BankOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '专利数量',
              value: patentCount,
              icon: <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '软著数量',
              value: softwareCount,
              icon: <CodeOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
            }}
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            statistic={{
              title: '论文数量',
              value: articleCount,
              icon: <ReadOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
            }}
          />
        </Col>
      </Row>

      <ProCard>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索知识产权名称、作者..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            style={{ width: 400 }}
            allowClear
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `全部 (${mockIPData.length})` },
            { key: 'patent', label: `专利 (${patentCount})` },
            { key: 'software', label: `软著 (${softwareCount})` },
            { key: 'article', label: `论文 (${articleCount})` },
          ]}
        />

        {filteredData.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            renderItem={item => (
              <List.Item
                actions={[
                  <a key="view">查看详情</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      icon={typeIconMap[item.type]} 
                      style={{ 
                        backgroundColor: item.type === 'patent' ? '#e6f7ff' : 
                          item.type === 'software' ? '#f6ffed' : '#fff7e6' 
                      }} 
                    />
                  }
                  title={
                    <Space>
                      <span>{item.title}</span>
                      <Tag>{typeNameMap[item.type]}</Tag>
                    </Space>
                  }
                  description={
                    <Space size="large">
                      <span>作者：{item.authors}</span>
                      <span>日期：{item.date || '待定'}</span>
                      <Space>
                        {item.tags?.map(tag => (
                          <Tag key={tag} color={statusColorMap[item.status] || 'default'}>{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无数据" style={{ padding: '60px 0' }} />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default IPLibraryPage;
