import React, { useMemo } from 'react';

import clsx from 'clsx';

import { SettingKey } from '@services/setting';
import { getSetting } from '@services/setting/setting-service';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import toolbarButtonStyle from '../ToolbarButton/ToolbarButton.module.scss';
import styles from './ToolbarCopyAndClear.module.scss';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarCopyAndClear: React.FC<Props> = ({ expand, ...rest }: Props) => {
  const quickCopyMode = useMemo(() => getSetting(SettingKey.quickCopyMode), []);

  return (
    <ToolbarButton
      title="複製並清除"
      hotkeyLabel={quickCopyMode ? '(enter)' : '(ctrl+shift+⏎)'}
      expand={expand}
      {...rest}
    >
      <div className={styles.copyClearIconContainer}>
        <i className={clsx('icon', 'copy', 'outline', toolbarButtonStyle.toolbarButtonIcon)} />
        <i className={clsx('icon', 'close', toolbarButtonStyle.toolbarButtonIcon, styles.copyClearIcon)} />
      </div>
    </ToolbarButton>
  );
};

export default ToolbarCopyAndClear;
