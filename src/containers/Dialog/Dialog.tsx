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
  animation: boolean;
}

export interface DispatchFromProps {
  actionRed: () => void;
  actionBlue: () => void;
  actionCancel: () => void;
}

type Props = StateFromProps & DispatchFromProps;

type ButtonAnimation = 'RED' | 'BLUE';

const delay = 500;

interface LocalState {
  buttonAnimation?: ButtonAnimation;
  poison: boolean;
}

export default class Dialog extends React.PureComponent<Props, LocalState> {
  public state: Readonly<LocalState> = { poison: false };

  private actionWithAnimation = (
    buttonAnimation: ButtonAnimation,
    action: () => void
  ) => {
    if (this.state.buttonAnimation) {
      return;
    }
    if (!this.props.animation) {
      if (buttonAnimation === 'BLUE') {
        this.setState({ poison: true });
        setTimeout(() => {
          action();
          this.setState({ poison: false });
        }, delay);
      } else {
        action();
      }
      return;
    }
    this.setState({ buttonAnimation });
    setTimeout(() => {
      this.setState({ buttonAnimation: undefined });
      action();
    }, delay);
  };

  private handleRedClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.actionWithAnimation('RED', this.props.actionRed);
  };

  private handleBlueClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    this.actionWithAnimation('BLUE', this.props.actionBlue);
  };

  private handleCancelClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (this.state.buttonAnimation) {
      return;
    }
    if (this.props.cancelable) {
      this.props.actionCancel();
    }
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
      animation,
    } = this.props;
    const { buttonAnimation, poison } = this.state;
    let animationText = '';
    let red = false;
    let blue = false;
    if (buttonAnimation === 'RED') {
      animationText = '緋略';
      red = true;
    } else if (buttonAnimation === 'BLUE') {
      animationText = '蒼略';
      blue = true;
    }
    const style: React.CSSProperties = {};
    if (!show) {
      style.display = 'none';
    }
    return (
      <div className="dialog-container" style={style}>
        <div className="dialog-base">
          <div
            className={classNames('dialog-background', { poison })}
            onClick={this.handleCancelClick}
          />
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
                  className={classNames(
                    'dialog-action-button',
                    'dialog-action-red',
                    { text: animation }
                  )}
                  onClick={this.handleRedClick}
                >
                  {redText}
                </div>
                <div
                  className={classNames(
                    'dialog-action-button',
                    'dialog-action-blue',
                    { text: animation }
                  )}
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
          <div
            className={classNames('action-animation', {
              red,
              blue,
              show: red || blue,
            })}
          >
            {animationText}
          </div>
        </div>
      </div>
    );
  }
}
