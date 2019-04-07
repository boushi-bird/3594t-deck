import { Dispatch } from 'redux';

import {
  datalistActions,
  BasicFilterCondition,
  DetailFilterCondition,
} from '../../modules/datalist';

let handleId: NodeJS.Timeout;
const delayTime = 500;

export function setBasicConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<BasicFilterCondition>) => void {
  return (condition: Partial<BasicFilterCondition>) => {
    dispatch(datalistActions.setBasicCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}

export function setDetailConditionAdapter(
  dispatch: Dispatch
): (condition: Partial<DetailFilterCondition>) => void {
  return (condition: Partial<DetailFilterCondition>) => {
    dispatch(datalistActions.setDetailCondition(condition));
    clearTimeout(handleId);
    handleId = setTimeout(() => {
      dispatch(datalistActions.applyCondition());
    }, delayTime);
  };
}
