import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const TopicPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>课题管理</h1>
          <p>管理您的研究课题</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default TopicPage;
