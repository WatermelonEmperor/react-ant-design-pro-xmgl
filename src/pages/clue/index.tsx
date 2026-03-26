import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const CluePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>线索管理</h1>
          <p>管理您的项目线索</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default CluePage;
