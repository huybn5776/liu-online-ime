import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';

type Props = {
  expand: boolean;
  modeLabel: string;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarSwitchInputMode: React.FC<Props> = ({ expand, modeLabel, ...rest }: Props) => (
  <ToolbarButton title="切換輸入模式" hotkeyLabel="(shift)" expand={expand} {...rest}>
    <span>{modeLabel}</span>
  </ToolbarButton>
);

export default ToolbarSwitchInputMode;
