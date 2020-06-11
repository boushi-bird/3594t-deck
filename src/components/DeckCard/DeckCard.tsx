import './DeckCard.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import classNames from 'classnames';
import type { General } from '3594t-deck';

interface Props {
  index: number;
  genMain?: string;
  general: General;
  pocket: boolean;
  active: boolean;
  search: boolean;
  enableMoveLeft: boolean;
  enableMoveRight: boolean;
  onSelectMainGen: (index: number, genMain?: string) => void;
  onActive: (index: number) => void;
  onRemoveDeck: (index: number) => void;
  onToggleSearch: (
    index: number,
    condition: {
      belongState: string;
      cost: string;
      unitType: string;
    }
  ) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
}

type MoveDirection = 'left' | 'right';

interface LocalState {
  moveFrom: MoveDirection | null;
}

export default class DeckCard extends React.PureComponent<Props, LocalState> {
  state: Readonly<LocalState> = { moveFrom: null };

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps === this.props) {
      return;
    }
    const diff = prevProps.index - this.props.index;
    if (diff === 0) {
      this.setState({ moveFrom: null });
    } else {
      this.setState({ moveFrom: diff > 0 ? 'right' : 'left' });
    }
  }

  private handleSelectMainGen = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const { index, onSelectMainGen } = this.props;
    let value: string | undefined = event.currentTarget.value;
    if (value == null || value === '') {
      value = undefined;
    }
    onSelectMainGen(index, value);
  };

  private handleActive = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onActive } = this.props;
    onActive(index);
  };

  private handleRemove = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onRemoveDeck } = this.props;
    onRemoveDeck(index);
  };

  private handleSearch = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    const { index, onToggleSearch, general } = this.props;
    const condition = {
      cost: general.raw.cost,
      belongState: general.raw.state,
      unitType: general.raw.unit_type,
    };
    onToggleSearch(index, condition);
  };

  private handleMoveLeft = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveLeft } = this.props;
    onMoveLeft(index);
  };

  private handleMoveRight = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    event.stopPropagation();
    this.setState({ moveFrom: null });
    const { index, onMoveRight } = this.props;
    onMoveRight(index);
  };

  public render(): React.ReactNode {
    const {
      index,
      general,
      genMain,
      active,
      search,
      pocket,
      enableMoveLeft,
      enableMoveRight,
    } = this.props;
    const style: React.CSSProperties = {
      backgroundColor: general.state.thincolor,
    };
    const statecolor = general.state.color;
    const styleState: React.CSSProperties = {
      backgroundColor: statecolor,
    };
    const gradientcolors = [
      statecolor,
      `${statecolor} 30px`,
      'transparent 92px',
      'transparent',
    ].join(',');
    const styleShadow: React.CSSProperties = {
      background: `linear-gradient(-30deg, ${gradientcolors})`,
    };
    const skills: JSX.Element[] = [];
    general.skills.forEach((skill) => {
      skills.push(
        <span className="skill" key={skill.id}>
          {skill.nameShort}
        </span>
      );
    });
    if (skills.length === 0) {
      skills.push(
        <span className="no-skill" key={0}>
          特技なし
        </span>
      );
    }
    const genMains: JSX.Element[] = [];
    general.genMains.forEach((genMain, i) => {
      genMains.push(
        <option value={genMain.id} key={i}>
          {genMain.nameShort}
        </option>
      );
    });
    const selectedGenMain = genMain != null ? genMain : '';
    const moveFrom = this.state.moveFrom;
    const indexClass = index % 2 === 0 ? 'even' : 'odd';
    return (
      <div
        className={classNames('deck-card', indexClass, {
          active,
          'from-right': moveFrom === 'right',
          'from-left': moveFrom === 'left',
        })}
        style={style}
        onClick={this.handleActive}
      >
        <div className="deck-card-inner-top">
          <img className="general-thumb" src={general.thumbUrl(pocket)} />
          <div className="shadow" style={styleShadow} />
          <span className="state" style={styleState}>
            {general.state.nameShort}
          </span>
          <span className="version" style={styleState}>
            {general.version}
          </span>
          <span className="cost" data-label="コスト">
            {general.cost.name}
          </span>
          <span className="unit" data-label="兵種">
            {general.unitType.nameShort}
          </span>
          <span className="name">
            <span className="rarity">{general.rarity.name}</span>
            {general.name}
          </span>
        </div>
        <div className="deck-card-inner-bottom">
          <span className="force" data-label="武">
            {general.force}
          </span>
          <span className="intelligence" data-label="知">
            {general.intelligence}
          </span>
          <span className="conquest" data-label="制圧">
            {general.conquest}
          </span>
          <span className="skills">{skills}</span>
          <span className="gen-mains" data-label="主将器">
            <select
              className="gen-mains-select"
              value={selectedGenMain}
              onChange={this.handleSelectMainGen}
            >
              <option value="" />
              {genMains}
            </select>
          </span>
        </div>
        <div className="tool-box">
          <button className="remove" onClick={this.handleRemove}>
            <FontAwesomeIcon icon={faMinusCircle} className="circle-icon" />
          </button>
          <button
            className={classNames('tool-button', 'search', { enable: search })}
            title="勢力・コスト・兵種で絞り込み"
            onClick={this.handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button
            className={classNames('tool-button', 'move-left', {
              enabled: enableMoveLeft,
            })}
            title="左へ移動"
            onClick={this.handleMoveLeft}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className={classNames('tool-button', 'move-right', {
              enabled: enableMoveRight,
            })}
            title="右へ移動"
            onClick={this.handleMoveRight}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    );
  }
}
