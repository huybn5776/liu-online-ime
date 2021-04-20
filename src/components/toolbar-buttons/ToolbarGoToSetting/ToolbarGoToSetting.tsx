import React from 'react';

import clsx from 'clsx';

import AppLink from '../../AppLink/AppLink';
import toolbarButtonStyle from '../ToolbarButton/ToolbarButton.module.scss';
import styles from './ToolbarGoToSetting.module.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLElement>;

const ToolbarGoToSetting: React.FC<Props> = ({ expand, className, ...rest }: Props) => (
  <AppLink
    className={clsx(
      toolbarButtonStyle.toolbarButton,
      styles.settingButton,
      { [toolbarButtonStyle.expand]: expand },
      className,
    )}
    to="/settings"
    withParas
    title="設定"
    {...rest}
  >
    <i className={clsx('icon', 'cog', toolbarButtonStyle.toolbarButtonIcon)} />
  </AppLink>
);

export default ToolbarGoToSetting;
