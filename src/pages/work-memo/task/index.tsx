import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const WorkTaskPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>工作任务</h1>
          <p>管理您的工作任务</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default WorkTaskPage;
