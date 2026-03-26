import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const BudgetPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>预算管理</h1>
          <p>管理项目预算</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default BudgetPage;
