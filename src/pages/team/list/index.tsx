import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const TeamListPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>团队列表</h1>
          <p>查看所有团队</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default TeamListPage;
