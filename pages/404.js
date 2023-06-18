import { Typography } from 'antd';

const { Text, Title, Link } = Typography;

export default function Custom404() {
  return (
    <section id="error" className="flex flex-col justify-center items-center h-100 mb-4">
      <Title level={1}>404 - ไม่พบหน้านี้</Title>
      <Link href={'/'} className="__pointer">
        กลับไปหน้าแรก
      </Link>
    </section>
  );
}
