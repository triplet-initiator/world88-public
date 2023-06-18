import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { UseLogin } from '@/hook/useAuth';
import styles from '@/styles/login.module.scss';
import ScreenLoading from '@/components/loading/screen-loading';
import { NEXT_AUTH_STATUS } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { Col, Row, Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { withAuth } from '@/helper/withAuth';

const { Text } = Typography;

export default function Login({}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session, status } = useSession();

  const onSubmitLogin = async (params) => {
    await UseLogin(params)
      .then((res) => {
        if (res?.error) {
          message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        } else {
          message.success('ลงชื่อเข้าใช้สำเร็จ');
          let callbackUrl = router.query.callbackUrl;
          if (!callbackUrl) callbackUrl = '/';
          router.push(res.url + callbackUrl);
        }
      })
      .catch(() => {
        message.error('มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง');
      });
  };

  if (status === NEXT_AUTH_STATUS.UNAUTHENTICATED) {
    return (
      <>
        <section className={styles['__login-area']}>
          <div className="flex justify-center py-8">
            <div>
              <Link href="/">
                <img
                  src={'/images/logo/world88_720.webp'}
                  alt="world88"
                  style={{ objectFit: 'contain' }}
                  width={240}
                  height={240}
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
          <div className="flex justify-center py-1">
            <div className={styles.login}>
              <div className="text-center">
                <Text className={styles['text-login']}>เข้าสู่ระบบ</Text>
              </div>
              <Form
                form={form}
                name="form_login"
                className="ant-advanced-search-form p-4"
                layout="vertical"
                onFinish={onSubmitLogin}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input prefix={<UserOutlined />} allowClear />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} allowClear />
                </Form.Item>
                <Row>
                  <Col
                    span={24}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <Button type="primary" htmlType="submit" className="submit-button-color w-full">
                      ลงชื่อเข้าใช้
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <ScreenLoading />
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  const { req, res } = context;
  if (context.isAuth) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  // if (context.authStatus && context.authStatus.code) {
  //   console.log('if authStatus');
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: setupLogOutUrl(context),
  //     },
  //   };
  // }
  return {
    props: {},
  };
});
