import './SkillButtonList.css';
import classNames from 'classnames';
import FilterButtonList from '../FilterButtonList';

export default class SkillButtonList extends FilterButtonList {
  protected createButton(
    value: string,
    label: string,
    style: React.CSSProperties,
    disabled: boolean,
    className: string
  ): JSX.Element {
    if (value !== '0') {
      return super.createButton(value, label, style, disabled, className);
    }
    // 特技なし
    return super.createButton(
      value,
      '無',
      style,
      disabled,
      classNames(className, 'no-skill')
    );
  }
}
