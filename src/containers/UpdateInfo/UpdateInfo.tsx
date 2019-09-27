import './UpdateInfo.css';
import React from 'react';

export interface StateFromProps {
  show: boolean;
}

export interface DispatchFromProps {
  closeUpdateInfo: () => void;
}

type Props = StateFromProps & DispatchFromProps;

const UPDATE_INFO_URL = process.env.UPDATE_INFO_URL as string;

let updateInfoUrl: string | undefined = undefined;

export default class UpdateInfo extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { show, closeUpdateInfo } = this.props;
    const style: React.CSSProperties = {};
    if (show) {
      // 一度表示されたらずっとURLを維持する
      updateInfoUrl = UPDATE_INFO_URL;
    } else {
      style.display = 'none';
    }
    return (
      <div className="update-info" style={style}>
        <div className="update-info-inner">
          <div className="update-info-title">更新情報</div>
        </div>
        <div className="update-info-buttons">
          <button className="action-buton-ok" onClick={closeUpdateInfo}>
            OK
          </button>
        </div>
        <div className="update-info-body">
          <iframe className="update-info-iframe" src={updateInfoUrl} />
        </div>
      </div>
    );
  }
}
