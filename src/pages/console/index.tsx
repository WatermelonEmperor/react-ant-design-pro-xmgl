import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ConsolePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>控制台</h1>
          <p>欢迎使用项目管理系统</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ConsolePage;
