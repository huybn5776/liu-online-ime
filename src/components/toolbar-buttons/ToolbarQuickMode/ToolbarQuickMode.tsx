import React from 'react';

import clsx from 'clsx';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import toolbarButtonStyle from '../ToolbarButton/ToolbarButton.module.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarQuickMode: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="Enter複製模式" hotkeyLabel="(ctrl+enter)" expand={expand} {...rest}>
    <i className={clsx('icon', 'copy', toolbarButtonStyle.toolbarButtonIcon)} />
  </ToolbarButton>
);

export default ToolbarQuickMode;
