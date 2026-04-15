import { LockOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, useIntl, useModel } from '@umijs/max';
import { Alert, App, Button, Col, Form, Input, Row } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { login } from '@/services/ant-design-pro/api';

const useStyles = createStyles(() => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundImage: 'url(/images/login_back.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    // 白色圆角矩形容器，包含左侧图片和右侧表单
    loginCard: {
      display: 'flex',
      background: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      maxWidth: '1000px',
      width: '90%',
      minHeight: '550px',
    },
    // 左侧插图区域
    leftArea: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      background: '#fff',
    },
    illustrationImage: {
      maxWidth: '100%',
      maxHeight: '450px',
      objectFit: 'contain' as const,
    },
    // 右侧表单区域
    rightPanel: {
      width: '420px',
      background: '#fff',
      padding: '50px 45px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
    },
    formTitle: {
      fontSize: '22px',
      fontWeight: 600,
      color: '#333',
      textAlign: 'center' as const,
      marginBottom: '8px',
    },
    formDivider: {
      width: '100%',
      height: '1px',
      background: '#e8e8e8',
      margin: '16px 0 32px 0',
    },
    inputWrapper: {
      marginBottom: '20px',
    },
    inputWithIcon: {
      display: 'flex',
      alignItems: 'stretch',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      overflow: 'hidden',
      '&:hover': {
        borderColor: '#5a9bf6',
      },
      '&:focus-within': {
        borderColor: '#5a9bf6',
        boxShadow: '0 0 0 2px rgba(90, 155, 246, 0.2)',
      },
    },
    iconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      background: '#f5f5f5',
      borderRight: '1px solid #d9d9d9',
      color: '#999',
      fontSize: '18px',
    },
    captchaImage: {
      width: '100%',
      height: '48px',
      background: 'linear-gradient(90deg, #5a9bf6 0%, #667eea 100%)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '24px',
      fontFamily: 'monospace',
      letterSpacing: '8px',
      cursor: 'pointer',
      userSelect: 'none' as const,
    },
    submitBtn: {
      width: '100%',
      height: '48px',
      fontSize: '16px',
      fontWeight: 500,
      background: 'linear-gradient(90deg, #5a9bf6 0%, #667eea 100%)',
      border: 'none',
      borderRadius: '4px',
      '&:hover': {
        background: 'linear-gradient(90deg, #4a8be6 0%, #5a6eda 100%)',
      },
    },
  };
});

// 生成随机验证码
const generateCaptcha = () => {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.slice(0, 3) + ' ' + result.slice(3);
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [submitting, setSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // 验证验证码
    if (captchaInput.replace(/\s/g, '') !== captcha.replace(/\s/g, '')) {
      message.error('验证码错误！');
      refreshCaptcha();
      return;
    }

    setSubmitting(true);
    try {
      const msg = await login({ ...values, type: 'account' });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
    setSubmitting(false);
  };

  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录 - 高校课题组管理平台</title>
      </Helmet>

      {/* 白色圆角矩形容器 */}
      <div className={styles.loginCard}>
        {/* 左侧插图区域 */}
        <div className={styles.leftArea}>
          <img
            src="/images/login_form_left.png"
            alt="登录插图"
            className={styles.illustrationImage}
          />
        </div>

        {/* 右侧表单区域 */}
        <div className={styles.rightPanel}>
          <h1 className={styles.formTitle}>欢迎登录高校课题组管理平台</h1>
          <div className={styles.formDivider} />

          {status === 'error' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}

          <Form form={form} onFinish={handleSubmit}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputWithIcon}>
                <div className={styles.iconBox}>
                  <UserOutlined />
                </div>
                <ProFormText
                  name="username"
                  fieldProps={{
                    bordered: false,
                    placeholder: 'admin',
                    style: { padding: '12px 16px' },
                  }}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <div className={styles.inputWithIcon}>
                <div className={styles.iconBox}>
                  <LockOutlined />
                </div>
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    bordered: false,
                    placeholder: '请输入密码',
                    style: { padding: '12px 16px' },
                  }}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <div className={styles.inputWithIcon}>
                <div className={styles.iconBox}>
                  <NumberOutlined />
                </div>
                <ProFormText
                  name="loginCode"
                  fieldProps={{
                    bordered: false,
                    placeholder: '请输入登录码',
                    style: { padding: '12px 16px' },
                  }}
                />
              </div>
            </div>

            <Row gutter={12} style={{ marginBottom: 24 }}>
              <Col span={14}>
                <div
                  className={styles.captchaImage}
                  onClick={refreshCaptcha}
                  title="点击刷新验证码"
                >
                  {captcha}
                </div>
              </Col>
              <Col span={10}>
                <Input
                  placeholder="请输入验证码"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  style={{ height: '48px' }}
                />
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className={styles.submitBtn}
            >
              登 录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
