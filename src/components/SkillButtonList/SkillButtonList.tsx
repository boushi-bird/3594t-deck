import './SkillButtonList.css';
import classNames from 'classnames';
import FilterButtonList from '../FilterButtonList';

export default class SkillButtonList extends FilterButtonList {
  protected createButton(
    value: string,
    label: string,
    style: React.CSSProperties,
    className: string
  ): JSX.Element {
    if (value !== '0') {
      return super.createButton(value, label, style, className);
    }
    // 特技なし
    return super.createButton(
      value,
      '無',
      style,
      classNames(className, 'no-skill')
    );
  }
}
