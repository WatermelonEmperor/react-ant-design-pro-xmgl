import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const SoftwareCopyrightPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>软著管理</h1>
          <p>管理软件著作权</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default SoftwareCopyrightPage;
