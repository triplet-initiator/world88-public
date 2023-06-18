import styles from './wrapper.module.scss';

export default function Wrapper({ children, style }) {
  return (
    <div className={`${styles.wrapper}`} style={style}>
      {children}
    </div>
  );
}
