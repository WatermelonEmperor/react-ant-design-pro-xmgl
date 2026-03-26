import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const MemberListPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>成员列表</h1>
          <p>查看所有团队成员</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default MemberListPage;
