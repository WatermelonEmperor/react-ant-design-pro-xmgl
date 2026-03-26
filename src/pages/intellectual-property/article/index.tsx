import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ArticlePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>文章管理</h1>
          <p>管理学术论文和文章</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ArticlePage;
