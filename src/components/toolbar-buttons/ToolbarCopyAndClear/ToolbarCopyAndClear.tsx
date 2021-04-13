import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import './ToolbarCopyAndClear.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarCopyAndClear: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="複製並清除" hotkeyLabel="(ctrl+shift+⏎)" expand={expand} {...rest}>
    <div className="copy-clear-icon-container">
      <i className="icon copy outline" />
      <i className="icon close copy-clear-icon" />
    </div>
  </ToolbarButton>
);

export default ToolbarCopyAndClear;
