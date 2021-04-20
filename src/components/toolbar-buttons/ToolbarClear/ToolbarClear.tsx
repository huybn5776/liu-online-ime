import React from 'react';

import clsx from 'clsx';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import toolbarButtonStyle from '../ToolbarButton/ToolbarButton.module.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarClear: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="清除" hotkeyLabel="(ctrl+shift+←)" expand={expand} {...rest}>
    <i className={clsx('icon', 'eraser', toolbarButtonStyle.toolbarButtonIcon)} />
  </ToolbarButton>
);

export default ToolbarClear;
