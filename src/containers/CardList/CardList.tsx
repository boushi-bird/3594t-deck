import './CardList.css';
import React from 'react';
import GeneralCard from '../../components/GeneralCard';
import { DatalistState } from '../../modules/datalist';

export interface StateFromProps {
  generals: DatalistState['generals'];
  searchedGeneralIds: string[];
}

export interface DispatchFromProps {
  addDeckGeneral: (card: {
    general: string;
    cost: string;
    genMain?: string;
  }) => void;
}

type Props = StateFromProps & DispatchFromProps;

export default class CardList extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { generals, searchedGeneralIds, addDeckGeneral } = this.props;
    const generalCards: JSX.Element[] = [];
    generals.forEach(general => {
      const show = searchedGeneralIds.includes(general.id);
      generalCards.push(
        <GeneralCard
          key={general.id}
          general={general}
          onAddDeck={addDeckGeneral}
          show={show}
        />
      );
    });
    return <div className="cardlist-container">{generalCards}</div>;
  }
}
