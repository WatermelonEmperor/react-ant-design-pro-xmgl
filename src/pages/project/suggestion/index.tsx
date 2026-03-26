import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ProjectSuggestionPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>工程建议</h1>
          <p>查看和管理工程建议</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ProjectSuggestionPage;
