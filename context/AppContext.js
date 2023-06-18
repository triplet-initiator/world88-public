import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { UseGetBalance } from '@/hook/useUser';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { LOGOUT_CODE, NEXT_AUTH_STATUS, STATUS_CODE } from '@/lib/constants';
import { message } from 'antd';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const { data: session, status } = useSession();

  const [count, setCount] = useState(0);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isFetchBalance, setIsFetchBalance] = useState(false);
  const [keyPath, setKeyPath] = useState(['/']);
  const [balance, setBalance] = useState({
    amount: 0,
    time: new Date(),
  });
  const [modalHeaderState, setModalHeaderState] = useState(null);

  useEffect(() => {
    if (status === NEXT_AUTH_STATUS.AUTHENTICATED) {
      getBalance();
    }
  }, [status]);

  const getBalance = async () => {
    if (status === NEXT_AUTH_STATUS.AUTHENTICATED) {
      setIsFetchBalance(true);
      await UseGetBalance().then((res) => {
        if (res.code !== STATUS_CODE.Success) {
          message.error(res.cause || res.msg);
        }
        setBalance(res?.data ?? balance);
        setIsFetchBalance(false);
      });
    }
  };

  let appState = {
    ref: {},
    state: {
      count: count,
      isSidebarActive,
      isScreenLoading,
      balance,
      isFetchBalance,
      keyPath,
      modalHeaderState,
    },
    action: {
      setCount: (value) => setCount(value),
      setKeyPath: (value) => setKeyPath(value),
      setModalHeaderState: (value) => setModalHeaderState(value),
      toggleSidebar: () => setIsSidebarActive(!isSidebarActive),
      toggleScreenLoading: () => setIsScreenLoading(!isScreenLoading),
      setBalance: (value) => setBalance(value),
      setIsFetchBalance: (value) => setIsFetchBalance(value),
      getBalance: () => getBalance(),
    },
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function UseAppContext() {
  return useContext(AppContext);
}
