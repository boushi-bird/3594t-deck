import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import type { General } from '3594t-deck';

interface Props {
  genMains: General['genMains'];
  genMainSp: General['genMainSp'];
  officialUrl: string;
}

export default class GenMains extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { genMains, genMainSp, officialUrl } = this.props;
    const genMainElments: JSX.Element[] = [];
    genMains.forEach((genMain, i) => {
      const gm = genMainSp || genMain;
      genMainElments.push(
        <span className="gen-main-readonly" key={i}>
          {gm.nameShort}
        </span>
      );
    });
    const genMainLabel = genMainSp != null ? '奇才将器' : '主将器';
    return (
      <>
        <span className="gen-mains" data-label={genMainLabel}>
          {genMainElments}
        </span>
        <span className="externals">
          <a href={officialUrl} target="_blank" rel="noopener noreferrer">
            公式
            <br />
            サイトへ
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </span>
      </>
    );
  }
}
