import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ProjectRequirementPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>工程需求</h1>
          <p>查看和管理工程需求</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ProjectRequirementPage;
