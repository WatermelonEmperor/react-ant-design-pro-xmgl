import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const OutsourcingContractPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>外协合同</h1>
          <p>管理外协合同</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default OutsourcingContractPage;
