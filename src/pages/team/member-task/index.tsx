import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const MemberTaskPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>成员任务</h1>
          <p>管理成员任务分配</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default MemberTaskPage;
