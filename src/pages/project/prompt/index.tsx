import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const PromptManagePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>提示词管理</h1>
          <p>管理和配置AI提示词</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PromptManagePage;
