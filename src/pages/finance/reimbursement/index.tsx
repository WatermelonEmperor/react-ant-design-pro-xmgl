import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ReimbursementPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>报销管理</h1>
          <p>管理费用报销</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ReimbursementPage;
