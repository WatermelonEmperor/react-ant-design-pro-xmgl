import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ResearchPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>调研管理</h1>
          <p>管理调研项目和报告</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ResearchPage;
