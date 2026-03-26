import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const PatentPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>专利管理</h1>
          <p>管理专利申请和维护</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PatentPage;
