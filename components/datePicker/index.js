import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import styles from './datePicker.module.scss';

export default function CustomDatePicker({ selectDate }) {
  const { RangePicker } = DatePicker;

  const onChange = (dateString) => {
    const date = {
      startDate: dayjs(dateString[0], 'DD-MM-YYYY').format('YYYYMMDD'),
      endDate: dayjs(dateString[1], 'DD-MM-YYYY').format('YYYYMMDD'),
    };
    selectDate(date);
  };

  return (
    <>
      <section className={styles.wrapper}>
        <RangePicker
          size="large"
          format="DD-MM-YYYY"
          ranges={{
            วันนี้: [dayjs(), dayjs()],
            สัปดาห์นี้: [dayjs().startOf('isoWeek'), dayjs().endOf('isoWeek')],
            สัปดาห์ที่แล้ว: [
              dayjs().subtract(1, 'weeks').startOf('isoWeek'),
              dayjs().subtract(1, 'weeks').endOf('isoWeek'),
            ],
            สัปดาห์ต่อไป: [
              dayjs().add(1, 'weeks').startOf('isoWeek'),
              dayjs().add(1, 'weeks').endOf('isoWeek'),
            ],
            เดือนนี้: [dayjs().startOf('month'), dayjs().endOf('month')],
          }}
          onChange={onChange}
        />
      </section>
    </>
  );
}
