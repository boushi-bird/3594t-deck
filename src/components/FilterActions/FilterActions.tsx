import './FilterActions.css';
import React from 'react';

interface Props {
  resetConditions(): void;
  closeFilter(): void;
}

const FilterActions: React.FC<Props> = ({
  resetConditions,
  closeFilter,
}: Props): React.ReactElement => (
  <div className="card-filter-actions">
    <button className="action-buton-reset" onClick={resetConditions}>
      リセット
    </button>
    <button className="action-buton-ok" onClick={closeFilter}>
      OK
    </button>
  </div>
);

export default React.memo(FilterActions);
