import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/signup.module.scss';
import ScreenLoading from '@/components/loading/screen-loading';
import { NEXT_AUTH_STATUS, STATUS_CODE, BANK_COMPANY, MODAL_HEADER } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { Col, Row, Button, Form, Input, Typography, message, Select, Space, Steps } from 'antd';
import { bankList } from '@/lib/data';
import { UseSignup } from '@/hook/useUser';
import { UseAppContext } from '@/context/AppContext';
import { UseLogin } from '@/hook/useAuth';
import { UseGetGroup } from '@/hook/useGroup';
import { QrcodeOutlined, BankOutlined } from '@ant-design/icons';
import { UseClickRefId } from '@/hook/useAffiliate';
import { withAuth } from '@/helper/withAuth';

const { Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const SOURCE_REGISTER = [
  {
    key: 'GOOGLE',
    value: 'Google',
  },
  {
    key: 'FACEBOOK',
    value: 'Facebook',
  },
  {
    key: 'YOUTUBE',
    value: 'Youtube',
  },
  {
    key: 'TIKTOK',
    value: 'Tiktok',
  },
  {
    key: 'FRIEND',
    value: 'เพื่อนแนะนำ',
  },
  {
    key: 'LINE',
    value: 'Line',
  },
  {
    key: 'TELEGRAM',
    value: 'Telegram',
  },
  {
    key: 'BILLBOARD',
    value: 'ป้ายโฆษณา',
  },
  {
    key: 'BILLBOARD',
    value: 'ป้ายโฆษณา',
  },
  {
    key: 'OTHER',
    value: 'อื่นๆ โปรดระบุ',
  },
];

const DEFAULT_GROUPMEMBER = {
  depositList: [],
  maxWithdrawPerDay: 0,
  minDepositAuto: 0,
  minDeposit: 0,
  maxDeposit: 0,
  minWithdrawAuto: 0,
  minWithdraw: 0,
  maxWithdraw: 0,
};

const depositMethod = {
  qr: { label: 'QR', value: 'QR_CODE', icon: <QrcodeOutlined /> },
  p2p: { label: 'P2P', value: 'P2P', icon: <BankOutlined /> },
};

export default function SignUp({ refIdKeyGssp }) {
  const AppContext = UseAppContext();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRegisterSourceFill, setIsRegisterSourceFill] = useState(false);
  const [registerForm] = Form.useForm();
  const [hasRefId, setHasRefId] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [group, setGroup] = useState(DEFAULT_GROUPMEMBER);
  const [dpForm] = Form.useForm();
  const [refId, setRefId] = useState(refIdKeyGssp);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [isRegisterButtonClicked, setRegisterButtonClicked] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    bank: {
      company: '',
      accountNo: '',
      accountName: '',
    },
    registerType: '',
    registerSource: '',
    lineId: '',
    refId: '',
  });

  const handleNextStep = async () => {
    form.validateFields().then((values) => {
      setFormData((prevData) => ({ ...prevData, ...values }));
      setCurrentStep((prevStep) => prevStep + 1);
    });
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    form.validateFields().then((values) => {
      const allFormData = { ...formData, ...values };
      onSubmitRegister(allFormData);
    });
    setRegisterButtonClicked(true);
    setTimeout(() => {
      setRegisterButtonClicked(false);
    }, 5000);
  };

  useEffect(() => {
    registerForm.setFieldsValue({
      bank: {
        company: BANK_COMPANY.KBANK,
      },
    });
    const refIdLocalStorage = window.localStorage.getItem('refId');
    if (refId) {
      const _refId = refId.slice(0, 12);
      registerForm.setFieldValue('refId', _refId);
      window.localStorage.setItem('refId', _refId);
      AppContext.action.setModalHeaderState(MODAL_HEADER.REGISTER);
      setHasRefId(true);
    } else {
      if (refIdLocalStorage) {
        registerForm.setFieldValue('refId', refIdLocalStorage);
        setHasRefId(true);
      }
    }
  }, [refId]);

  const onSubmitRegister = async (params) => {
    console.log('onSubmitRegister >> ', params);
    const body = {
      bank: {
        accountName: params.bank.accountName,
        company: params.bank.company,
        accountNo: params.bank.accountNo.replace(/\D/g, ''),
      },
      username: params.username,
      password: params.password,
      refId: params.refId !== undefined ? params.refId : '0_skahg5q9bd',
      tel: params.username,
      registerSource: params.registerSource,
      registerType: params?.registerType ?? '',
    };

    setConfirmLoading(true);

    await UseSignup(body)
      .then((res) => {
        if (res.code === STATUS_CODE.Success) {
          message.success('สมัครสมาชิกสำเร็จ');
          window.localStorage.removeItem('refId');
          setTimeout(() => {
            AppContext.action.setModalHeaderState(null);
            setConfirmLoading(false);
            registerForm.resetFields();
            onSubmitLogin(params);
          }, 2000);
        } else {
          message.error(res.msg);
          setConfirmLoading(false);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const onSubmitLogin = async (params) => {
    setConfirmLoading(true);
    await UseLogin(params).then(async (res) => {
      if (res?.error) {
        message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setConfirmLoading(false);
      } else {
        await AppContext.action.getBalance();
        message.success('ลงชื่อเข้าใช้สำเร็จ');
        window.localStorage.removeItem('refId');
        await getGroup();
        setTimeout(() => {
          if (router.query?.callbackUrl) {
            router.push(router.query?.callbackUrl);
          }
          router.push('/');
          if (router.query?.modal) {
            AppContext.action.setModalHeaderState(router.query?.modal);
          } else {
            AppContext.action.setModalHeaderState(null);
          }
          setConfirmLoading(false);
        }, 1000);
      }
    });
  };

  const getGroup = async () => {
    await UseGetGroup().then((res) => {
      if (res.code === STATUS_CODE.Success) {
        setGroup(res.groupMember || DEFAULT_GROUPMEMBER);
        dpForm.setFieldsValue({
          method: depositMethod.p2p.value,
          amount: null,
        });
      } else {
        message.error(res.cause || res.msg);
      }
    });
  };

  return (
    <>
      <section className={styles['__signup-area']}>
        <div className="flex justify-center py-8">
          <div className="relative h-52 w-52">
            <Link href="/">
              <img
                src={'/images/logo/world88_720.webp'}
                alt="world88"
                style={{ objectFit: 'contain' }}
                width={190}
                height={190}
                loading="lazy"
              />
            </Link>
          </div>
        </div>
        <div className="flex justify-center py-1">
          <div className={styles.signup}>
            <div>
              <Steps current={currentStep}>
                <Step
                  title={<span style={{ fontSize: '12px', color: '#ffffff' }}>เบอร์โทรศัพท์</span>}
                />
                <Step
                  title={<span style={{ fontSize: '12px', color: '#ffffff' }}>ข้อมูลธนาคาร</span>}
                />
                <Step title={<span style={{ fontSize: '12px', color: '#ffffff' }}>อื่นๆ</span>} 
                />
              </Steps>

              <Form
                form={form}
                name="form_register"
                layout="vertical"
                className={`${styles['signup-form']} p-4`}
                onFinish={handleFinish}
                onValuesChange={(changeValue, value) => {
                  if (value.registerType === 'OTHER') {
                    setIsRegisterSourceFill(false);
                  } else {
                    setIsRegisterSourceFill(true);
                  }
                }}
              >
                <Row className="block">
                  {currentStep === 0 && (
                    <>
                      <Col>
                        <Form.Item
                          name="username"
                          label={<label style={{ color: 'white' }}>เบอร์โทรศัพท์</label>}
                          rules={[
                            {
                              required: true,
                              message: (
                                <small style={{ color: 'red' }}>กรุณากรอกเบอร์โทรศัพท์</small>
                              ),
                            },
                            {
                              type: 'string',
                              len: 10,
                              whitespace: true,
                              message: (
                                <small style={{ color: 'red' }}>
                                  รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง
                                </small>
                              ),
                              pattern: new RegExp(/^[0][0-9]\d{8}$/),
                            },
                          ]}
                        >
                          <Input placeholder="" allowClear />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name="password"
                          label={<label style={{ color: 'white' }}>รหัสผ่าน</label>}
                          rules={[
                            {
                              required: true,
                              message: <small style={{ color: 'red' }}>กรุณากรอกรหัสผ่าน</small>,
                            },
                            {
                              type: 'string',
                              min: 4,
                              max: 12,
                              whitespace: true,
                              message: (
                                <small style={{ color: 'red' }}>รูปแบบรหัสผ่านไม่ถูกต้อง</small>
                              ),
                              pattern: new RegExp(/^[a-zA-Z0-9!@#$%\-_&=?]*$/),
                            },
                          ]}
                          extra={
                            <>
                              <small>- สามารถใส่ตัวอักษรได้แค่ 4-12 ตัวอักษรเท่านั้น</small>
                              <br />
                              <small>
                                - รองรับเฉพาะตัวอักษร ตัวเลข และอักษรพิเศษเท่านั้น [A-Z, a-z, 0-9,
                                !, @, $, -, _, &, =, ?]
                              </small>
                            </>
                          }
                        >
                          <Input.Password placeholder="รหัสผ่าน" allowClear />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <Col>
                        <Form.Item
                          name={['bank', 'company']}
                          label={<label style={{ color: 'white' }}>ธนาคารสำหรับฝาก-ถอน</label>}
                          rules={[
                            {
                              required: true,
                              message: <small style={{ color: 'red' }}>กรุณาเลือกธนาคาร</small>,
                            },
                          ]}
                        >
                          <Select>
                            {bankList.map((value, idx) => (
                              <Option value={value.company} key={idx}>
                                <Space align="center">
                                  <div className="relative w-7 h-7">
                                    <Image
                                      src={`/images/bank/${value.company.toLowerCase()}.png`}
                                      alt=""
                                      style={{ objectFit: 'contain' }}
                                      fill
                                      loading="lazy"
                                    />
                                  </div>
                                  <div>{value.name}</div>
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name={['bank', 'accountNo']}
                          label={<label style={{ color: 'white' }}>เลขบัญชีธนาคาร</label>}
                          rules={[
                            {
                              required: true,
                              message: (
                                <small style={{ color: 'red' }}>กรุณากรอกเลขบัญชีธนาคาร</small>
                              ),
                            },
                          ]}
                        >
                          <Input placeholder="เลขบัญชีธนาคาร" allowClear />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name={['bank', 'accountName']}
                          label={
                            <label style={{ color: 'white' }}>
                              ชื่อ-นามสกุล (ที่ตรงกับบัญชีธนาคาร)
                            </label>
                          }
                          rules={[
                            {
                              required: true,
                              message: (
                                <small style={{ color: 'red' }}>กรุณากรอกชื่อ-นามสกุล</small>
                              ),
                            },
                          ]}
                        >
                          <Input placeholder="ชื่อ-นามสกุล (ที่ตรงกับบัญชีธนาคาร)" allowClear />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Col>
                        <Form.Item
                          name="registerType"
                          label={<label>รู้จักเราจากช่องทางใด</label>}
                          rules={[
                            {
                              required: true,
                              message: (
                                <small style={{ color: 'red' }}>
                                  กรุณาเลือกช่องทางที่รู้จากเรา
                                </small>
                              ),
                            },
                          ]}
                        >
                          <Select>
                            {SOURCE_REGISTER.map((item, idx) => (
                              <Option value={item.key} key={idx}>
                                {item.value}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name="registerSource"
                          label={<label>ระบุ</label>}
                          required={!isRegisterSourceFill}
                          rules={[
                            {
                              required: !isRegisterSourceFill,
                              message: <small style={{ color: 'red' }}>กรุณาระบุ</small>,
                            },
                          ]}
                        >
                          <Input disabled={isRegisterSourceFill} />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name="lineId"
                          label={<label style={{ color: 'white' }}>lineId</label>}
                        >
                          <Input placeholder="lineId" allowClear />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          label={<label style={{ color: 'white' }}>รหัสผู้แนะนำ ( ถ้ามี )</label>}
                          name="refId"
                        >
                          <Input
                            placeholder="รหัสผู้แนะนำ ( ถ้ามี )"
                            allowClear
                            disabled={hasRefId}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>

                <Row>
                  <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
                    {currentStep > 0 && (
                      <Button style={{ float: 'left' }} onClick={handlePreviousStep}>
                        ย้อนกลับ
                      </Button>
                    )}
                    {currentStep < 2 && (
                      <Button type="primary" onClick={handleNextStep} style={{ float: 'right' }}>
                        ถัดไป
                      </Button>
                    )}
                    {currentStep === 2 && (
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={isRegisterButtonClicked}
                        style={{ float: 'right' }}
                      >
                        {isRegisterButtonClicked ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  if (context.isAuth) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
    };
  }
  const query = {
    refId: context.query?.refId || '',
  };

  if (query.refId) {
    await UseClickRefId(query);
  }

  return {
    props: {
      refIdKeyGssp: query.refId,
    },
  };
});
