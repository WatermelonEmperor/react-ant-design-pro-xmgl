import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const IPLibraryPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>知识产权库</h1>
          <p>浏览知识产权资源库</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default IPLibraryPage;
