import './CardList.css';
import React from 'react';
import GeneralCard from '../../components/GeneralCard';
import { DatalistState } from '../../modules/datalist';

export interface StateFromProps {
  generals: DatalistState['generals'];
}

export interface DispatchFromProps {}

type Props = StateFromProps & DispatchFromProps;

export default class CardList extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { generals } = this.props;
    const generalCards: JSX.Element[] = [];
    generals.forEach(general => {
      generalCards.push(<GeneralCard key={general.id} general={general} />);
    });
    return <div className="cardlist-container">{generalCards}</div>;
  }
}
