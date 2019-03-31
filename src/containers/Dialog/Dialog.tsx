import './Dialog.css';
import React from 'react';
import classNames from 'classnames';

export interface StateFromProps {
  show: boolean;
  title: string;
  message: string;
  logoUrl?: string;
  redText: string;
  blueText: string;
  cancelable: boolean;
}

export interface DispatchFromProps {
  actionRed: () => void;
  actionBlue: () => void;
  actionCancel: () => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class Dialog extends React.PureComponent<Props> {
  private handleRedClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.props.actionRed();
  };

  private handleBlueClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.props.actionBlue();
  };

  private handleCancelClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.props.actionCancel();
  };

  public render(): React.ReactNode {
    const {
      show,
      title,
      message,
      logoUrl,
      redText,
      blueText,
      cancelable,
    } = this.props;
    const style: React.CSSProperties = {};
    if (!show) {
      style.display = 'none';
    }
    return (
      <div className="dialog-container" style={style}>
        <div className="dialog-base">
          <div className="dialog-background" onClick={this.handleCancelClick} />
          <div className="dialog">
            <div className="dialog-inner">
              <div className="dialog-title">{title}</div>
              <div className="dialog-body">
                <div
                  className={classNames('dialog-logo', {
                    show: logoUrl != null,
                  })}
                >
                  <img src={logoUrl} />
                </div>
                <div className="dialog-message">{message}</div>
              </div>
              <div className="dialog-actions">
                <div
                  className="dialog-action-button dialog-action-red"
                  onClick={this.handleRedClick}
                >
                  {redText}
                </div>
                <div
                  className="dialog-action-button dialog-action-blue"
                  onClick={this.handleBlueClick}
                >
                  {blueText}
                </div>
              </div>
              <div
                className={classNames('dialog-close', { cancelable })}
                onClick={this.handleCancelClick}
              >
                x
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
