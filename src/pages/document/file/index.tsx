import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const FilePage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>文件管理</h1>
          <p>管理项目文件资料</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default FilePage;
