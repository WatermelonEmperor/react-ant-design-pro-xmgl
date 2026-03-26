import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ProjectListPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>工程列表</h1>
          <p>查看和管理所有工程项目</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ProjectListPage;
