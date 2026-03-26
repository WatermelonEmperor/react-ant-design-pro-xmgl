import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ReceiptContractPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>收款合同</h1>
          <p>管理收款合同</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ReceiptContractPage;
