import { ProgressBar } from 'react-loader-spinner';

export default function ScreenLoading({}) {
  return (
    <>
      <div className="loading-wrapper">
        <div className="loader">
          <ProgressBar
            height="180"
            width="180"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="#F4442E"
            barColor="#51E5FF"
          />
        </div>
      </div>
    </>
  );
}
