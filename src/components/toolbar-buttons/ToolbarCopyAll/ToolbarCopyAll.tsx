import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarCopyAll: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="複製" hotkeyLabel="(ctrl+enter)" expand={expand} {...rest}>
    <i className="icon copy" />
  </ToolbarButton>
);

export default ToolbarCopyAll;
