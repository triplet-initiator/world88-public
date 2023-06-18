import { notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const DISPLAY_STYLES = {
  color: '#ffffff',
};

const STYLES = {
  background: '#373737',
  borderRadius: '10px',
};

notification.config({
  duration: 4,
});

export const notifySuccess = ({ msg = 'Success', cause }) =>
  notification.success({
    message: <div style={DISPLAY_STYLES}>{msg}</div>,
    description: cause && (
      <div style={{ ...DISPLAY_STYLES, paddingLeft: '2rem' }}>- {cause ?? ''}</div>
    ),
    closeIcon: <CloseOutlined style={DISPLAY_STYLES} />,
    style: STYLES,
  });

export const notifyError = ({ msg, cause }) =>
  notification.error({
    message: <div style={DISPLAY_STYLES}>ไม่สามารถดำเนินการได้</div>,
    description: (
      <section>
        <ul>
          <li className="pl-2" style={DISPLAY_STYLES}>
            - {msg}
          </li>
          {cause &&
            cause.split('|').map((desc, idx) => (
              <li key={idx} className="pl-2" style={DISPLAY_STYLES}>
                - {desc}
              </li>
            ))}
        </ul>
      </section>
    ),
    closeIcon: <CloseOutlined style={DISPLAY_STYLES} />,
    style: STYLES,
  });

export const notifyWarning = (title, description) =>
  notification.warning({
    message: <div style={DISPLAY_STYLES}>{title}</div>,
    description: <div style={DISPLAY_STYLES}>{description}</div>,
    closeIcon: <CloseOutlined style={DISPLAY_STYLES} />,
    style: STYLES,
  });
