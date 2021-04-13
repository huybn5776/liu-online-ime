import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarClear: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="清除" hotkeyLabel="(ctrl+shift+←)" expand={expand} {...rest}>
    <i className="icon eraser"/>
  </ToolbarButton>
);

export default ToolbarClear;
