import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';

const ContactPage: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>联系人管理</h1>
          <p>管理您的联系人信息</p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ContactPage;
