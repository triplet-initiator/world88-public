import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { UseLogout } from '@/hook/useAuth';
import { LOGOUT_CODE, STATUS_CODE } from '@/lib/constants';
import ScreenLoading from '@/components/loading/screen-loading';
import { UseAppContext } from '@/context/AppContext';
import { Button } from 'antd';

export default function Login({ data }) {
  const router = useRouter();
  const AppContext = UseAppContext();

  const logout = async () => {
    const res = await UseLogout();
    if ([...LOGOUT_CODE].includes(res.code) || res.code === STATUS_CODE.Success) {
      AppContext.action.toggleScreenLoading();
      await signOut();
    }
  };

  if (AppContext.state.isScreenLoading) {
    return (
      <>
        <ScreenLoading />
      </>
    );
  } else {
    return (
      <section id="error" className="flex flex-col justify-center items-center h-100 mb-4">
        <Link href="/">
          <Image
            src={'/images/logo/world88_720.webp'}
            alt="world88"
            style={{ objectFit: 'contain' }}
            width={240}
            height={240}
            loading="lazy"
          />
        </Link>
        <h1 style={{ color: '#fff' }}>
          {router.query.message
            ? decodeURIComponent(router.query.message?.split('-').join(' '))
            : 'มีบางอย่างผิดพลาด'}
        </h1>
        <h3 style={{ color: '#fff' }}>กรุณาลงชื่อเข้าใช้ใหม่อีกครั้งหรือติดต่อแอดมิน</h3>
        <Button onClick={logout}>ลงชื่อออกจากระบบ</Button>
      </section>
    );
  }
}
