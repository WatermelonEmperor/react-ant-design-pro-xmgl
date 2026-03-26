import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const WorkNotePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>工作便签</h1>
          <p>记录您的工作笔记</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default WorkNotePage;
