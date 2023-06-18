import {
  PieChartOutlined,
  UserOutlined,
  AuditOutlined,
  BankOutlined,
  DollarOutlined,
} from '@ant-design/icons';

import Image from 'next/image';

export const menus = [
  {
    label: 'สล็อต',
    key: 'slot',
    icon: (
      <section className="__block px-4">
        <img src={'/images/newIcon/icon_slot.webp'} width={24} height={24} alt="world88 slot" />
      </section>
    ),
    children: null,
  },
  {
    label: 'คาสิโน',
    key: 'casino',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_casino.webp'}
          width={24}
          height={24}
          alt="world88 casino"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'ยิงปลา',
    key: 'fishing-games',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_fishing.webp'}
          width={24}
          height={24}
          alt="world88 ยิงปลา fish games"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'กีฬา',
    key: 'sport',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_sport.webp'}
          width={24}
          height={24}
          alt="world88 sport"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'หวย',
    key: 'lotto',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_lotto.webp'}
          width={24}
          height={24}
          alt="world88 lotto"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'UFA',
    key: 'ufa',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_ufa.webp'}
          width={24}
          height={24}
          alt="world88 ufa"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'เกมส์โต๊ะ',
    key: 'table-games',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_table.webp'}
          width={24}
          height={24}
          alt="world88 table games"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'Arcade',
    key: 'arcade',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_arcade.webp'}
          width={24}
          height={24}
          alt="world88 table games"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'อื่นๆ',
    key: 'other',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/newIcon/icon_other.webp'}
          width={24}
          height={24}
          alt="world88 Bingo บิงโก Dare 2 win Scratch Card"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
];

export const marketingMenus = [
  {
    label: 'โปรโมชั่น',
    key: 'promotion',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/icon/icon_promotion.png'}
          width={24}
          height={24}
          alt="world88 promotion"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'เครดิตเงินคืน',
    key: 'cashback',
    icon: (
      <section className="__block px-4">
        <img
          className="sidebar-icon-center md:absolute relative"
          src={'/images/icon/icon_cashback.png'}
          width={24}
          height={24}
          alt="world88 cashback เครดิตเงินคืน"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'คืนยอดเสีย',
    key: 'payback',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/icon/icon_income.png'}
          width={24}
          height={24}
          alt="world88 payback คืนยอดเสีย"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
  {
    label: 'สร้างรายได้',
    key: 'affiliate',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/icon/icon_affiliate.png'}
          width={24}
          height={24}
          alt="world88 affiliate สร้างรายได้"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
];

export const contactMenus = [
  {
    label: 'ติดต่อเรา',
    key: 'contact',
    icon: (
      <section className="__block px-4">
        <img
          src={'/images/icon/icon_contact.png'}
          width={24}
          height={24}
          alt="world88 contact ติดต่อเรา"
          loading="lazy"
        />
      </section>
    ),
    children: null,
  },
];
