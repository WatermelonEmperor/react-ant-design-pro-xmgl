import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ResumePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>简历管理</h1>
          <p>管理人员简历信息</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ResumePage;
