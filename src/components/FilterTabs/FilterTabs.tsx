import './FilterTabs.css';
import React from 'react';
import classNames from 'classnames';

interface Props {
  tabs: { [key: string]: string };
  activeTab: string;
  onTabChanged: (tab: string) => void;
}

export default class FilterTabs extends React.PureComponent<Props> {
  private handleTabClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const activeTab = event.currentTarget.dataset['tab'];
    if (activeTab) {
      this.props.onTabChanged(activeTab);
    }
  };

  public render(): React.ReactNode {
    const { tabs, activeTab } = this.props;
    const buttons: JSX.Element[] = [];
    Object.entries(tabs).forEach(([key, value]) => {
      const active = activeTab === key;
      const buttonClass = `tab-button-${key.toLowerCase()}`;
      const buttonClasses = classNames([buttonClass, { active }]);
      buttons.push(
        <button
          key={key}
          data-tab={key}
          className={buttonClasses}
          onClick={this.handleTabClick}
        >
          {value}
        </button>
      );
    });
    return <div className="card-filter-tabs">{buttons}</div>;
  }
}
