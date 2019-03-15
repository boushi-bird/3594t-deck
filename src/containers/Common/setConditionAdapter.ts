import { Dispatch } from 'redux';

import { datalistActions, FilterCondition } from '../../modules/datalist';

let handleId: NodeJS.Timeout;
const delayTime = 500;

export default function setConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<FilterCondition>) => void {
  return (condition: Partial<FilterCondition>) => {
    dispatch(datalistActions.setCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}
