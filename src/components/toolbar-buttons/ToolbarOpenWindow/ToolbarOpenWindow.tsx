import React from 'react';

import clsx from 'clsx';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import toolbarButtonStyle from '../ToolbarButton/ToolbarButton.module.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarOpenWindow: React.FC<Props> = ({ expand, ...rest }: Props) => (
  <ToolbarButton title="在小視窗開啟" hotkeyLabel="(ctrl+n)" expand={expand} {...rest}>
    <i className={clsx('icon', 'external ', 'alternate ', toolbarButtonStyle.toolbarButtonIcon)} />
  </ToolbarButton>
);

export default ToolbarOpenWindow;
