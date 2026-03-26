import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const MeetingPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>组会管理</h1>
          <p>管理团队会议安排</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default MeetingPage;
