import './AssistDeckCard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import classNames from 'classnames';
import type { AssistGeneral } from '3594t-deck';

interface Props {
  index: number;
  assist: AssistGeneral | null;
  active: boolean;
  onActive: (index: number) => void;
  onRemoveDeck: (index: number) => void;
}

const DEFAULT_ASSIST: {
  readonly name: string;
  readonly strategyName: string;
} = {
  name: '軍師',
  strategyName: '控えめな正兵',
};

export default class AssistDeckCard extends React.PureComponent<Props> {
  private handleActive = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onActive } = this.props;
    onActive(index);
  };

  private handleRemove = (
    event: React.MouseEvent<Element, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onRemoveDeck, assist } = this.props;
    if (!assist) {
      return;
    }
    onRemoveDeck(index);
  };

  public render(): React.ReactNode {
    const { index, active, assist } = this.props;
    const style: React.CSSProperties = {};
    const styleState: React.CSSProperties = {};
    const styleThumb: React.CSSProperties = {};
    if (assist) {
      style.backgroundColor = assist.state.thincolor;
      styleState.backgroundColor = assist.state.color;
    } else {
      styleState.display = 'none';
    }
    const stateShortName = assist?.state?.nameShort ?? '';
    const name = assist?.name ?? (index === 0 ? DEFAULT_ASSIST.name : '');
    const avatarUrl = assist?.avatarUrl ?? undefined;
    if (!avatarUrl) {
      styleThumb.display = 'none';
    }
    const stratName =
      assist?.strategy?.name ??
      (index === 0 ? DEFAULT_ASSIST.strategyName : '');
    const noAssist = !assist;
    return (
      <div
        className={classNames('assist-deck-card', {
          active,
          'no-assist': noAssist,
        })}
        style={style}
        onClick={this.handleActive}
      >
        <span className="image">
          <img className="assist-thumb" style={styleThumb} src={avatarUrl} />
        </span>
        <span className="state" style={styleState}>
          {stateShortName}
        </span>
        <span className="card-type">遊軍</span>
        <span className="name">{name}</span>
        <span className="strategy">{stratName}</span>
        <div className="tool-box">
          <button className="tool-button remove" onClick={this.handleRemove}>
            <FontAwesomeIcon icon={faMinusCircle} />
          </button>
        </div>
      </div>
    );
  }
}
