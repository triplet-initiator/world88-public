import moment from 'moment';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  RedoOutlined,
  LoadingOutlined,
  ClockCircleOutlined,
  LockOutlined,
  LogoutOutlined,
  DownOutlined,
  CrownFilled,
  QrcodeOutlined,
  BankOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import {
  Modal,
  Space,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  message,
  Select,
  Dropdown,
  Segmented,
  Divider,
  InputNumber,
  Popconfirm,
  QRCode,
  Descriptions,
  Table,
  Tag,
  Pagination,
  Checkbox,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSession, signOut } from 'next-auth/react';
import Hamburger from 'hamburger-react';
import { UseSignup, UseChangePassword } from '@/hook/useUser';
import { UseLogin, UseLogout } from '@/hook/useAuth';
import { UseGetGroup } from '@/hook/useGroup';
import { UseGetStatement, UseCancelDeposit, UseStatementHistory } from '@/hook/useStatement';
import {
  UseDepositPaymentGatewayQr,
  UseDepositPaymentGatewayP2P,
  UseWithdrawPaymentGateway,
} from '@/hook/usePayment';
import { BANK_COMPANY, STATUS_CODE, MODAL_HEADER, NEXT_AUTH_STATUS } from '@/lib/constants';
import styles from './header.module.scss';
import { UseAppContext, STATE_MODAL } from '@/context/AppContext';
import { bankList } from '@/lib/data';

const { Text, Title } = Typography;
const { Option } = Select;
const { Column } = Table;

const items = [
  {
    label: 'ข้อมูลสมาชิก',
    key: MODAL_HEADER.INFO,
    icon: <UserOutlined />,
  },
  {
    label: 'เปลี่ยนรหัสผ่าน',
    key: MODAL_HEADER.CHANGE_PASSWORD,
    icon: <LockOutlined />,
  },
  {
    label: 'ประวัติ ฝาก-ถอน',
    key: MODAL_HEADER.HISTORY,
    icon: <ClockCircleOutlined />,
  },
  {
    label: 'ออกจากระบบ',
    key: MODAL_HEADER.LOG_OUT,
    icon: <LogoutOutlined />,
    danger: true,
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

const DP_STATE = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAW: 'WITHDRAW',
  WAITING: 'WAITING',
};

const DEFAULT_DEPOSIT_ACCOUNT_DETAIL = {
  method: null,
  amount: null,
  accountName: '',
  accountNo: '',
  bankCode: '',
  qrcode: '',
  transactionId: null,
};

export default function Header({}) {
  const AppContext = UseAppContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [dpForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dpState, setDpState] = useState(DP_STATE.DEPOSIT);
  const [segmentState, setSegmentState] = useState(DP_STATE.DEPOSIT);
  const [segmentDepositType, setSegmentDepositType] = useState(null);
  const [group, setGroup] = useState(DEFAULT_GROUPMEMBER);
  const [disabled, setDisabled] = useState(false);
  const [depositAccount, setDepositAccount] = useState(DEFAULT_DEPOSIT_ACCOUNT_DETAIL);
  const [autoHistory, setAutoHistory] = useState({
    history: [],
    count: 0,
    pageAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pagesOption, setPagesOption] = useState({
    current: 1,
    pageSize: 5,
  });
  const [isRegisterSourceFill, setIsRegisterSourceFill] = useState(false);
  const [hasRefId, setHasRefId] = useState(false);
  const [modalHowtoState, setModalHowtoState] = useState(null);

  const [mobile, setMobile] = useState(true);

  const [visible, setVisible] = useState(false);
  // const [hideModal, setHideModal] = useState(false);

  // const handleCheckboxChange = (e) => {
  //   const currentDate = new Date().toDateString();
  //   const isChecked = e.target.checked;

  //   setHideModal(isChecked);

  //   if (isChecked) {
  //     localStorage.setItem('lastCheckedDate', currentDate);
  //   } else {
  //     localStorage.removeItem('lastCheckedDate');
  //   }
  // };

  // const handleModalClose = () => {
  //   setVisible(false);
  // };

  // const chackVisible = async () => {
  //   const savedDate = localStorage.getItem('lastCheckedDate');
  //   const currentDate = new Date().toDateString();
  //   const hideModalStatus = localStorage.getItem('modalVisible');

  //   if (!savedDate && hideModalStatus) {
  //     setVisible(true);
  //   } else if (savedDate !== currentDate && hideModalStatus === true) {
  //     setVisible(true);
  //   } else {
  //     setVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   chackVisible();
  // }, []);

  useEffect(() => {
    const fetchGroupMember = async () => await getGroup();
    setMobile(isMobile);
    if (status === NEXT_AUTH_STATUS.AUTHENTICATED) {
      fetchGroupMember();
    }
  }, [status]);

  useEffect(() => {
    registerForm.setFieldsValue({
      bank: {
        company: BANK_COMPANY.KBANK,
      },
    });
    const refIdLocalStorage = window.localStorage.getItem('refId');
    if (router?.query?.refId || router?.query?.refid) {
      const refId = router?.query?.refId || router?.query?.refid;
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
  }, [router]);

  const onSubmitLogin = async (params) => {
    setConfirmLoading(true);
    await UseLogin(params)
      .then(async (res) => {
        if (res?.error) {
          message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
          setConfirmLoading(false);
        } else {
          await AppContext.action.getBalance();
          message.success('ลงชื่อเข้าใช้สำเร็จ');
          window.localStorage.removeItem('refId');
          await getGroup();
          // localStorage.setItem('modalVisible', true);
          setTimeout(() => {
            if (router.query?.redirect) {
              router.push(router.query?.redirect);
            }
            if (router.query?.modal) {
              AppContext.action.setModalHeaderState(router.query?.modal);
            } else {
              AppContext.action.setModalHeaderState(null);
            }
            // chackVisible();
            setConfirmLoading(false);
          }, 1000);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const onSubmitDpForm = async (params) => {
    const _params = {
      amount: params.amount,
    };
    if (dpState === DP_STATE.DEPOSIT) {
      if (params.method === 'QR_CODE') {
        await UseDepositPaymentGatewayQr(_params).then((res) => {
          if (res.code === STATUS_CODE.Success) {
            setDpState(DP_STATE.WAITING);
            setDepositAccount({
              method: res.type === 'QR' ? depositMethod.qr.value : depositMethod.p2p.value,
              amount: res.amount,
              accountName: res.payee.accountName,
              accountNo: res.payee.accountNo,
              bankCode: res.payee.bankCode,
              qrcode: res.qrcode,
              transactionId: res.transactionId,
            });
          } else {
            message.error(res.cause || res.msg);
          }
        });
      } else {
        await UseDepositPaymentGatewayP2P(_params).then((res) => {
          if (res.code === STATUS_CODE.Success) {
            setDpState(DP_STATE.WAITING);
            setDepositAccount({
              method: res.type,
              amount: res.amount,
              accountName: res.payee.accountName,
              accountNo: res.payee.accountNo,
              bankCode: res.payee.bankCode,
              qrcode: res.qrcode,
              transactionId: res.transactionId,
            });
          } else {
            message.error(res.cause || res.msg);
          }
        });
      }
    }
    if (dpState === DP_STATE.WITHDRAW) {
      setConfirmLoading(true);
      await UseWithdrawPaymentGateway(_params).then((res) => {
        if (res.code === STATUS_CODE.Success) {
          message.success('ทำรายการถอนสำเร็จ กรุณารอสักครู่');
          setTimeout(() => {
            AppContext.action.setModalHeaderState(null);
            setConfirmLoading(false);
          }, 1000);
        } else {
          message.error(res.cause || res.msg);
          setConfirmLoading(false);
        }
      });
    }

    await AppContext.action.getBalance();
  };

  const logout = async () => {
    const res = await UseLogout();
    if (res.code === STATUS_CODE.Success) {
      message.success('ลงชื่อออกสำเร็จ');
      await signOut();
      // localStorage.removeItem('modalVisible');
    }
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

  const fetchStatement = async (state) => {
    if (state === DP_STATE.DEPOSIT) {
      await UseGetStatement().then((res) => {
        if (res.statement.isProgressingDeposit) {
          setDisabled(false);
          setDpState(DP_STATE.WAITING);
          setSegmentState(DP_STATE.DEPOSIT);
          setDepositAccount({
            method: res.statement.isQR ? depositMethod.qr.value : depositMethod.p2p.value,
            amount: res.statement.amount,
            accountName: res.statement.payee?.accountName,
            accountNo: res.statement.payee?.accountNo,
            bankCode: res.statement.payee?.bankCode,
            transactionId: res.statement.transactionId,
            qrcode: res.statement.qrcode,
          });
        } else {
          setDisabled(true);
          setSegmentState(DP_STATE.DEPOSIT);
          setDpState(DP_STATE.DEPOSIT);
        }
      });
    }
  };

  const onClickCancelDeposit = async () => {
    const body = {
      transactionId: depositAccount.transactionId,
    };
    await UseCancelDeposit(body).then((res) => {
      if (res.code === STATUS_CODE.Success) {
        setDpState(DP_STATE.DEPOSIT);
        message.success('ดำเนินการสำเร็จ');
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleMenuClick = async (state) => {
    // message.info('Click on menu item : ' + state.key);
    if (state.key === MODAL_HEADER.INFO) {
      AppContext.action.setModalHeaderState(MODAL_HEADER.INFO);
      // setModalState(MODAL_HEADER.INFO);
    }
    if (state.key === MODAL_HEADER.CHANGE_PASSWORD) {
      // setModalState(MODAL_HEADER.CHANGE_PASSWORD);
      AppContext.action.setModalHeaderState(MODAL_HEADER.CHANGE_PASSWORD);
      setDisabled(true);
    }
    if (state.key === MODAL_HEADER.HISTORY) {
      AppContext.action.setModalHeaderState(MODAL_HEADER.HISTORY);
      // setModalState(MODAL_HEADER.HISTORY);
      await getBankHistory({
        pagesOption,
      });
    }
    if (state.key === MODAL_HEADER.LOG_OUT) {
      await logout();
    }
  };

  const onSubmitChangePassword = async (params) => {
    setConfirmLoading(true);
    await UseChangePassword(params)
      .then(async (res) => {
        if (res.code === STATUS_CODE.Success) {
          message.success(res.cause || res.msg);
          setTimeout(() => {
            changePasswordForm.resetFields();
            AppContext.action.setModalHeaderState(null);
            setConfirmLoading(false);
          }, 1000);
        } else {
          message.error(res.cause || res.msg);
          setConfirmLoading(false);
        }
        // setConfirmLoading(true);
        // if (res?.error) {
        //   message.error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        // } else {
        //   await AppContext.action.getBalance();
        //   message.success('ลงชื่อเข้าใช้สำเร็จ');
        // }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const getBankHistory = async (query) => {
    setIsLoading(true);
    await UseStatementHistory(query).then((res) => {
      if (res.code === STATUS_CODE.Success) {
        setAutoHistory(res);
      } else {
        message.error(res.msg);
      }
      setIsLoading(false);
    });
  };

  const onChangePagination = async (current, size) => {
    setPagesOption({
      current,
      pageSize: size,
    });
    const query = {
      pagesOption: {
        current,
        pageSize: size,
      },
    };

    await getBankHistory(query);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const showAccountNoPattern = (value) => {
    return `${value.substring(0, 3)}-${value.substring(3, 4)}-${value.substring(
      4,
      9
    )}-${value.substring(9, 12)}`;
  };

  return (
    <>
      {/* How to deposit QR Code */}
      <Modal
        title={
          <div className="text-center">
            {modalHowtoState === DP_STATE.DEPOSIT ? 'วิธีการฝากแบบ QR Code' : 'วิธีทำรายการถอน'}
          </div>
        }
        open={modalHowtoState}
        width={600}
        onCancel={() => {
          setModalHowtoState(null);
        }}
        footer={[]}
      >
        {modalHowtoState === DP_STATE.DEPOSIT ? (
          <div className="relative w-auto h-[300px] md:h-[600px]">
            <img
              src={`/images/howto/deposit.jpeg`}
              className="card-image"
              alt={'วิธีทำรายการฝาก'}
              width={50}
              height={50}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative w-auto h-[300px] md:h-[600px]">
            <img
              src={`/images/howto/withdraw.jpeg`}
              className="card-image"
              alt={'วิธีทำรายการถอน'}
              width={50}
              height={50}
              loading="lazy"
            />
          </div>
        )}
      </Modal>
      {/* How to deposit QR Code */}
      {/* LOGIN */}
      <Modal
        title={<div className="text-center">ลงชื่อเข้าใช้</div>}
        open={AppContext.state.modalHeaderState === MODAL_HEADER.LOGIN}
        confirmLoading={confirmLoading}
        width={400}
        onCancel={() => {
          AppContext.action.setModalHeaderState(null);
        }}
        footer={[
          <Button
            key="OK"
            type="primary"
            className="w-full"
            loading={confirmLoading}
            onClick={() => {
              loginForm.submit();
            }}
          >
            ลงชื่อเข้าใช้
          </Button>,
        ]}
      >
        <Form form={loginForm} name="form_signup" layout="vertical" onFinish={onSubmitLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
      {/* LOGIN */}
      {/* REGISTER */}
      {/* REGISTER */}
      {/* DEPOSIT - WITHDRAW */}
      <Modal
        title={
          <section className="text-center">
            <Space direction="vertical">
              <Segmented
                onChange={async (value) => {
                  dpForm.setFieldValue('amount', null);
                  if (value === DP_STATE.DEPOSIT) {
                    await fetchStatement(value);
                  } else {
                    setDpState(value);
                    setSegmentState(value);
                  }
                }}
                defaultValue={DP_STATE.DEPOSIT}
                value={segmentState}
                size="large"
                options={[
                  { label: 'ฝาก', value: DP_STATE.DEPOSIT },
                  { label: 'ถอน', value: DP_STATE.WITHDRAW },
                ]}
              />
            </Space>
            {/* <Divider>{dpState === 'DEPOSIT' ? 'ฝาก' : 'ถอน'}</Divider> */}
            <Divider />
          </section>
        }
        open={AppContext.state.modalHeaderState === MODAL_HEADER.DEPOSIT_WITHDRAW}
        confirmLoading={confirmLoading}
        // width={400}
        onCancel={async () => {
          dpForm.setFieldValue('amount', null);
          AppContext.action.setModalHeaderState(null);
          await AppContext.action.getBalance();
        }}
        footer={[
          <>
            {dpState === DP_STATE.WAITING ? (
              <Popconfirm
                placement="topRight"
                title={`ต้องการยกเลิกรายการฝากใช่หรือไม่?`}
                onConfirm={() => onClickCancelDeposit()}
                okText="ตกลง"
                cancelText="ปิด"
                okButtonProps={{
                  type: 'primary',
                  className: 'cancal-pop-confirm-button-color',
                }}
                cancelButtonProps={{
                  danger: true,
                }}
              >
                <Button
                  key="Cancel"
                  type="primary"
                  danger
                  className="w-full"
                  loading={confirmLoading}
                  disabled={disabled}
                  onClick={() => {
                    dpForm.submit();
                  }}
                >
                  ยกเลิกรายการฝาก
                </Button>
              </Popconfirm>
            ) : (
              <Button
                key="OK"
                type="primary"
                className="w-full"
                loading={confirmLoading}
                disabled={disabled}
                onClick={() => {
                  dpForm.submit();
                }}
              >
                ทำรายการ{dpState === DP_STATE.DEPOSIT ? 'ฝาก' : 'ถอน'}
              </Button>
            )}
          </>,
        ]}
        width={600}
      >
        <Form
          form={dpForm}
          name="form_signup"
          layout="vertical"
          onFinish={onSubmitDpForm}
          onValuesChange={(value, allValue) => {
            dpForm.validateFields().catch((error) => {
              setDisabled(!!error.errorFields.length);
              if (dpState === DP_STATE.WITHDRAW) {
                setDisabled(error.values.amount > AppContext.state.balance.amount);
              }
            });
            // onValuesChange(value, allValue);
          }}
        >
          {segmentState === DP_STATE.DEPOSIT && dpState !== DP_STATE.WAITING && (
            <>
              <section className="text-center mb-4">
                <Space direction="vertical">
                  <Form.Item
                    name="method"
                    rules={[{ required: true, message: 'กรุณาเลือกวิธีการฝากเงิน' }]}
                  >
                    <Segmented
                      onChange={(value) => {
                        setSegmentDepositType(value);
                      }}
                      options={[...group.depositList]}
                    />
                  </Form.Item>
                </Space>
                <div>
                  <Text className="text-lg" type="warning">
                    {segmentDepositType === depositMethod.qr.value
                      ? 'ฝากแบบ QR Code (แนะนำ!! ฝากไว ได้ 24 ชั่วโมง)'
                      : 'ฝากแบบ P2P (โอนผ่านหมายเลขบัญชีธนาคาร)'}
                  </Text>
                </div>
              </section>
            </>
          )}
          {dpState === DP_STATE.WAITING && (
            <>
              {depositAccount.method === depositMethod.p2p.value && (
                <section className="text-center">
                  <img
                    src={`/images/bank/${depositAccount.bankCode.toLowerCase()}.png`}
                    alt="world88"
                    style={{ objectFit: 'contain' }}
                    width={50}
                    height={50}
                    loading="lazy"
                  />
                  <Title level={4} className="my-2">
                    {depositAccount.accountName}
                  </Title>
                  <div>
                    <Text strong className="text-lg">
                      จำนวนเงิน{' '}
                    </Text>
                    <Text strong className="text-lg" type="danger">
                      {depositAccount.amount}
                    </Text>
                    <Text strong> บาท</Text>
                  </div>
                  <div className="bg-zinc-200 w-fit mx-auto px-4 py-2 my-2 rounded-lg">
                    <Text className="text-lg">
                      {showAccountNoPattern(depositAccount.accountNo || '')}
                    </Text>
                    <CopyToClipboard
                      text={depositAccount.accountNo}
                      onCopy={() => message.success('Copied')}
                    >
                      <span className="pl-1 __pointer">
                        <CopyOutlined />
                      </span>
                    </CopyToClipboard>
                  </div>
                  <div className="mt-4">
                    <Text className="text-lg" type="warning">
                      โอนเงินเข้าบัญชีแล้วรอรับเครดิตได้เลย
                    </Text>
                    <br />
                    <Text>
                      โอนเงินเข้าบัญชีแล้วรอรับเครดิตได้เลย ถ้าหากไม่ได้รับเครดิตภายใน 3 นาที
                    </Text>
                    <br />
                    <Text>กรุณาติดต่อแอดมิน</Text>
                    <br />
                    <Text type="danger">*** รบกวนใช้บัญชีที่สมัครโอนเงินเท่านั้น ***</Text>
                    <br />
                    <Text type="danger">
                      *** โปรดหลีกเลี่ยงการฝากเงิน ช่วงเวลา 23.55 - 00.15 น. ของทุกวัน ***
                    </Text>
                    <br />
                  </div>
                </section>
              )}
              {depositAccount.method === depositMethod.qr.value && (
                <section className="text-center">
                  <QRCode
                    className="mx-auto"
                    bordered={false}
                    errorLevel="H"
                    value={depositAccount.qrcode}
                  />
                  <div className="mt-4 m-0">
                    <Text className="text-lg">จำนวนเงิน </Text>
                    <Text className="text-lg" type="danger">
                      {depositAccount.amount}
                    </Text>
                    <Text className="text-lg"> บาท</Text>
                    <br></br>
                    <Text className="" type="warning">
                      กรุณาเติมเงินภายใน 5 นาที
                    </Text>
                    <br />
                    <Text type="danger">
                      *** QR Code จะหมดอายุภายใน 5 นาที หรือเมื่อทำรายการสำเร็จแล้ว ***
                    </Text>
                    <br />
                    <Text type="danger">*** รบกวนใช้บัญชีที่สมัครโอนเงินเท่านั้น ***</Text>
                    <br />
                  </div>
                </section>
              )}
            </>
          )}
          {dpState === DP_STATE.DEPOSIT && (
            <section className="text-center">
              <Form.Item
                name="amount"
                label={
                  <div>
                    จำนวนเงิน (ยอดฝากขั้นต่ำ{' '}
                    {group.minDeposit.toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    / ยอดฝากสูงสุด{' '}
                    {group.maxDeposit.toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    ){' '}
                    {segmentDepositType === depositMethod.qr.value && (
                      <Typography.Link onClick={() => setModalHowtoState(DP_STATE.DEPOSIT)}>
                        วิธีการฝาก
                      </Typography.Link>
                    )}
                  </div>
                }
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'กรุณาใส่จำนวนเงินเพื่อขอรับเลขบัญชี',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value && value < group.minDeposit) {
                        return Promise.reject(<div>จำนวนเงินขั้นต่ำไม่ถูกต้อง</div>);
                      } else if (value && value > group.maxDeposit) {
                        return Promise.reject(<div>จำนวนเงินสูงสุดไม่ถูกต้อง</div>);
                      } else return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  prefix="฿"
                  // min={group.minDeposit}
                  // max={group.maxDeposit}
                  step={1}
                  style={{ width: '100%' }}
                  onKeyDown={(event) => {
                    if (event.key === '.') {
                      event.preventDefault();
                    }
                  }}
                  formatter={(value) => {
                    if (value.includes('.')) {
                      const pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b\.)/g;
                      const valueSplit = value.split('.');
                      if (valueSplit[1].length > 2) {
                        return Number(value).toFixed(2).replace(pattern, ',');
                      } else return value.replace(pattern, ',');
                    } else {
                      const pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b)/g;
                      return value.replace(pattern, ',');
                    }
                  }}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <div>
                <Text>
                  {segmentDepositType === depositMethod.qr.value ? 'Scan QR Code แล้ว' : 'โอนแล้ว'}
                  รอรับเครดิตได้เลย ถ้าหากไม่ได้รับเครดิตภายใน 1 นาที <br /> กรุณาติดต่อแอดมิน
                </Text>
              </div>
              <div>
                <Text className="text-2xl" type="danger">
                  *** ห้ามทำรายการซ้ำผ่านแอปพลิเคชันของธนาคารเด็ดขาด!!! ***
                </Text>
                <br />
                <Text className="text-xl" type="danger">
                  *** ต้องทำรายการฝากใหม่ทุกครั้งก่อนโอนเงิน ***
                </Text>
              </div>
              {segmentDepositType === depositMethod.p2p.value && (
                <div>
                  <Text type="danger" className="text-lg">
                    *** โปรดหลีกเลี่ยงการฝากเงิน ช่วงเวลา 23.00 - 01.00 น. ของทุกวัน ***
                  </Text>
                </div>
              )}
              <div>
                <Text className="text-lg" type="danger">
                  *** กรุณาใช้บัญชีที่สมัครโอนเงินเท่านั้น ***
                </Text>
              </div>
            </section>
          )}
          {dpState === DP_STATE.WITHDRAW && (
            <section>
              <Form.Item
                name="amount"
                label={
                  <div>
                    จำนวนเงิน (ยอดถอนขั้นต่ำ{' '}
                    {group.minWithdraw.toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    / ยอดถอนสูงสุด{' '}
                    {group.maxWithdraw.toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    ){' '}
                    <Typography.Link onClick={() => setModalHowtoState(DP_STATE.WITHDRAW)}>
                      วิธีการถอน
                    </Typography.Link>
                  </div>
                }
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'กรุณาใส่จำนวนเงิน',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value && value < group.minWithdraw) {
                        return Promise.reject(<div>จำนวนเงินขั้นต่ำไม่ถูกต้อง</div>);
                      } else if (value && value > group.maxWithdraw) {
                        return Promise.reject(<div>จำนวนเงินสูงสุดไม่ถูกต้อง</div>);
                      } else if (value > AppContext.state.balance.amount) {
                        return Promise.reject(<div>ยอดเงินไม่เพียงพอ</div>);
                      } else return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  prefix="฿"
                  min={0}
                  max={group.maxWithdraw}
                  step={1}
                  style={{ width: '100%' }}
                  addonAfter={
                    <div
                      onClick={() => {
                        const amount = Math.floor(AppContext.state.balance.amount);
                        if (amount > group.maxWithdraw) {
                          dpForm.setFieldValue('amount', groupMember.maxWithdraw);
                        } else {
                          dpForm.setFieldValue('amount', amount);
                        }
                        setDisabled(false);
                      }}
                      className="cursor-pointer select-none"
                    >
                      ถอนทั้งหมด
                    </div>
                  }
                  // addonAfter={<Button type="text">ถอนทั้งหมด</Button>}
                  onKeyDown={(event) => {
                    if (event.key === '.') {
                      event.preventDefault();
                    }
                  }}
                  formatter={(value) => {
                    if (value.includes('.')) {
                      const pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b\.)/g;
                      const valueSplit = value.split('.');
                      if (valueSplit[1].length > 2) {
                        return Number(value).toFixed(2).replace(pattern, ',');
                      } else return value.replace(pattern, ',');
                    } else {
                      const pattern = /(?=(?!^)\d{3}(?:\b|(?:\d{3})+)\b)/g;
                      return value.replace(pattern, ',');
                    }
                  }}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
              <ul>
                <Text type="warning">*หมายเหตุ</Text>
                <li>
                  <Text className="ml-4">
                    - หากลูกค้ารับโปรโมชั่นหรือเครดิตเงินคืนไว้ หลังจากถอนเงินสำเร็จยอดเงินจะเหลือ{' '}
                    <span className="text-red-500">0</span> บาท
                  </Text>
                </li>
                <li>
                  <Text className="ml-4">- แนะนำให้ใส่ยอดเงินทั้งหมดทุกครั้งที่ทำรายการถอน</Text>
                </li>
                <li>
                  <Text className="ml-4">
                    - ถอนเงินได้จำนวน{' '}
                    <span className="text-red-500">{group.maxWithdrawPerDay} ครั้ง / วัน</span>{' '}
                    (เริ่มนับใหม่ทุกวันเวลาเที่ยงคืน)
                  </Text>
                </li>
              </ul>
            </section>
          )}
        </Form>
      </Modal>
      {visible && (
        <Modal
          visible={visible}
          onCancel={handleModalClose}
          width={650}
          footer={[
            <div key="footer" className="flex justify-between">
              <div>
                <Checkbox checked={hideModal} onChange={handleCheckboxChange}>
                  ไม่ต้องการแสดงอีก
                </Checkbox>
              </div>
              <div>
                <Button key="close" onClick={handleModalClose}>
                  ปิด
                </Button>
              </div>
            </div>,
          ]}
        >
          <p className="text-3xl font-bold">ประกาศ</p>
          <p className="text-xl">
            แจ้งปิดระบบฝาก P2P (ผ่านหมายเลขบัญชีธนาคาร) ช่วงเวลา 23:00 น. เป็นต้นไป
          </p>
          <p className="text-xl">*เพื่อปรับปรุงระบบ P2P ให้มีประสิทธิภาพมากยิ่งขึ้น*</p>
        </Modal>
      )}
      {/* DEPOSIT - WITHDRAW */}
      {session && (
        <>
          {/* INFO */}
          <Modal
            title={<div className="text-center">ข้อมูลสมาชิก</div>}
            open={AppContext.state.modalHeaderState === MODAL_HEADER.INFO}
            onCancel={() => {
              AppContext.action.setModalHeaderState(null);
            }}
            footer={[]}
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label="ชื่อผู้ใช้งาน">{session.user.username}</Descriptions.Item>
              <Descriptions.Item label="ธนาคาร" className="relative">
                <img
                  src={`/images/bank/${session.user.bankMember.company.toLowerCase()}.png`}
                  alt=""
                  style={{ objectFit: 'contain' }}
                  width={24}
                  height={24}
                  loading="lazy"
                />
              </Descriptions.Item>
              <Descriptions.Item label="ชื่อบัญชี">
                {session.user.bankMember.accountName}
              </Descriptions.Item>
              <Descriptions.Item label="เลขบัญชี">
                {showAccountNoPattern(session.user.bankMember.accountNo)}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
          {/* INFO */}
          {/* CHANGE PASSWORD */}
          <Modal
            title={<div className="text-center">เปลี่ยนรหัสผ่าน</div>}
            open={AppContext.state.modalHeaderState === MODAL_HEADER.CHANGE_PASSWORD}
            confirmLoading={confirmLoading}
            onCancel={() => {
              AppContext.action.setModalHeaderState(null);
            }}
            footer={[
              <Button
                key="OK"
                type="primary"
                className="w-full"
                loading={confirmLoading}
                disabled={disabled}
                onClick={() => {
                  changePasswordForm.submit();
                }}
              >
                เปลี่ยนรหัสผ่าน
              </Button>,
            ]}
          >
            <Form
              form={changePasswordForm}
              name="form_change_password"
              layout="vertical"
              onFinish={onSubmitChangePassword}
              onValuesChange={(value, allValue) => {
                changePasswordForm.validateFields().catch((error) => {
                  setDisabled(!!error.errorFields.length);
                });
                // onValuesChange(value, allValue);
              }}
            >
              <Form.Item
                name="oldPassword"
                label="รหัสผ่านปัจจุบัน"
                rules={[
                  { required: true, message: <small>กรุณากรอกรหัสผ่าน</small> },
                  {
                    type: 'string',
                    min: 4,
                    max: 12,
                    whitespace: true,
                    message: <small>รูปแบบรหัสผ่านไม่ถูกต้อง</small>,
                    pattern: new RegExp(/^[a-zA-Z0-9!@#$=?]*$/),
                  },
                ]}
              >
                <Input.Password placeholder="รหัสผ่าน" allowClear />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="รหัสผ่านใหม่"
                rules={[
                  { required: true, message: <small>กรุณากรอกรหัสผ่าน</small> },
                  {
                    type: 'string',
                    min: 4,
                    max: 12,
                    whitespace: true,
                    message: <small>รูปแบบรหัสผ่านไม่ถูกต้อง</small>,
                    pattern: new RegExp(/^[a-zA-Z0-9!@#$=?]*$/),
                  },
                ]}
                extra={
                  <>
                    <small>- สามารถใส่ตัวอักษรได้แค่ 4-12 ตัวอักษรเท่านั้น</small>
                    <br />
                    <small>
                      - รองรับเฉพาะตัวอักษร ตัวเลข และอักษรพิเศษเท่านั้น [A-Z, a-z, 0-9, !, @, $, =,
                      ?]
                    </small>
                  </>
                }
              >
                <Input.Password placeholder="รหัสผ่าน" allowClear />
              </Form.Item>

              <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
                label="ยืนยันรหัสผ่านใหม่"
                rules={[
                  { required: true, message: <small>กรุณากรอกรหัสผ่าน</small> },
                  {
                    type: 'string',
                    min: 4,
                    max: 12,
                    whitespace: true,
                    message: <small>รูปแบบรหัสผ่านไม่ถูกต้อง</small>,
                    pattern: new RegExp(/^[a-zA-Z0-9!@#$=?]*$/),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      if (value.length >= 4) {
                        return Promise.reject(<small>รหัสผ่านใหม่ไม่ตรงกัน</small>);
                      }
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="ยืนยันรหัสผ่าน" allowClear />
              </Form.Item>
            </Form>
          </Modal>
          {/* CHANGE PASSWORD */}
          {/* HISTORY */}
          <Modal
            title="ประวัติรายการฝาก-ถอน"
            footer={null}
            width={1000}
            open={AppContext.state.modalHeaderState === MODAL_HEADER.HISTORY}
            onCancel={() => {
              AppContext.action.setModalHeaderState(null);
            }}
          >
            <Table
              dataSource={autoHistory.statement}
              bordered
              className="overflow-auto"
              pagination={false}
              loading={isLoading}
            >
              <Column
                dataIndex="index"
                key="index"
                title={<h5 className="text-center">No</h5>}
                render={(value, rec, idx) => <div className="text-center">{value}</div>}
              />
              <Column
                title={<h5 className="text-center whitespace-nowrap">รายละเอียด</h5>}
                render={(value, rec, idx) => (
                  <section className="whitespace-nowrap">
                    <div>
                      <Text strong>Transaction ID: </Text>
                      <Text>{rec.transactionId}</Text>
                      <CopyToClipboard
                        text={rec.transactionId}
                        onCopy={() => message.success('Copied')}
                      >
                        <span className="pl-1 __pointer">
                          <CopyOutlined />
                        </span>
                      </CopyToClipboard>
                    </div>
                    <div>
                      <Text strong>วันที่/เวลา: </Text>
                      <Text>{moment(rec.createdAt).format('DD/MM/YYYY hh:mm:ss')}</Text>
                    </div>
                  </section>
                )}
              />
              <Column
                dataIndex="status"
                key="status"
                title={<h5 className="text-center">Status</h5>}
                render={(value, rec, idx) => {
                  let status;
                  if (value === 'SUCCESS') {
                    status = (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        สำเร็จ
                      </Tag>
                    );
                  }

                  if (value === 'PENDING') {
                    status = (
                      <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        อยู่ระหว่างดำเนินการ
                      </Tag>
                    );
                  }
                  if (value === 'WAITING') {
                    status = (
                      <Tag icon={<ExclamationCircleOutlined />} color="processing">
                        อยู่ระหว่างดำเนินการ
                      </Tag>
                    );
                  }
                  if (value === 'REJECT') {
                    status = (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        ถูกปฏิเสธ
                      </Tag>
                    );
                  }
                  if (value === 'EXPIRED') {
                    status = (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        คำขอหมดเวลา
                      </Tag>
                    );
                  }
                  return <div className="text-center">{status}</div>;
                }}
              />
              <Column
                title={<h5 className="text-center whitespace-nowrap">ฝาก</h5>}
                render={(value, rec, idx) => {
                  if (rec.type === 'DEPOSIT') {
                    return (
                      <div className="text-center whitespace-nowrap">
                        {rec.amount.toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    );
                  } else return <div className="text-center">-</div>;
                }}
              />
              <Column
                title={<h5 className="text-center whitespace-nowrap">ถอน</h5>}
                render={(value, rec, idx) => {
                  if (rec.type === 'WITHDRAW') {
                    return (
                      <div className="text-center whitespace-nowrap">
                        {rec.amount.toLocaleString('th-TH', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    );
                  } else return <div className="text-center">-</div>;
                }}
              />
            </Table>
            <section>
              <Pagination
                className="mt-4"
                showQuickJumper
                defaultCurrent={1}
                total={autoHistory.count}
                onChange={onChangePagination}
                pageSize={pagesOption.pageSize}
              />
            </section>
          </Modal>
          {/* HISTORY */}
        </>
      )}

      <header
        className={`${styles.header} ${
          AppContext.state.isSidebarActive ? styles.active : styles.inactive
        }`}
      >
        <section className={`${styles.wrapper}`}>
          <section className={`${styles['left-nav']}`}>
            <Space>
              <section>
                <Button
                  className="lg:hidden block"
                  type="primary"
                  icon={
                    AppContext.state.isSidebarActive ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => {
                    AppContext.action.toggleSidebar();
                  }}
                ></Button>
              </section>
              <img
                src={'/images/logo/world88_720.webp'}
                alt="world88.com"
                style={{ objectFit: 'contain' }}
                width="80"
                height="80"
                className="cursor-pointer"
                loading="lazy"
                onClick={() => {
                  router.push('/');
                }}
              />
            </Space>
          </section>
          <section className={`${styles['right-nav']}`}>
            {session?.user ? (
              <Space>
                <section className={styles.balance}>
                  <span className="ml-4">
                    ฿{' '}
                    {AppContext.state.balance.amount.toLocaleString('th-TH', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  {AppContext.state.isFetchBalance ? (
                    <LoadingOutlined className="p-2" />
                  ) : (
                    <RedoOutlined
                      className="mx-2 cursor-pointer"
                      onClick={() => {
                        AppContext.action.getBalance();
                      }}
                    />
                  )}
                  <Button
                    type="primary"
                    onClick={async () => {
                      setSegmentDepositType(group.depositList[0]?.value);
                      dpForm.setFieldValue('method', group.depositList[0]?.value);
                      AppContext.action.setModalHeaderState(MODAL_HEADER.DEPOSIT_WITHDRAW);
                      await fetchStatement(segmentState);
                    }}
                  >
                    <div className="hidden md:block">ฝาก - ถอน</div>
                    <div className="block md:hidden relative">
                      <img
                        src={'/images/icon/icon_wallet.png'}
                        width={24}
                        height={24}
                        alt="world88 เติมเงิน กระเป๋าตังค์ กระเป๋าเงิน"
                        loading="lazy"
                      />
                    </div>
                  </Button>
                </section>
                <section>
                  <Dropdown menu={menuProps}>
                    <Button
                      style={{ color: '#fff' }}
                      type="text"
                      icon={<CrownFilled className="mr-2" style={{ color: '#fff' }} />}
                    >
                      <Space className="hidden md:inline-flex">
                        {session?.user.username}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </section>
              </Space>
            ) : (
              <Space>
                <Button
                  type="text"
                  style={{ color: '#fff' }}
                  onClick={() => AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN)}
                >
                  ลงชื่อเข้าใช้
                </Button>
                <Button type="primary" href={'/signup'}>
                  สมัครสมาชิก
                </Button>
              </Space>
            )}
          </section>
        </section>
      </header>
    </>
  );
}
