import React, { memo, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './ToolbarButton.module.scss';

type Props = {
  title: string;
  hotkeyLabel?: string;
  expand: boolean;
  children: ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarButton: React.FC<Props> = ({ title, hotkeyLabel, expand, className, children, ...rest }: Props) => (
  <button
    className={clsx(styles.toolbarButton, { [styles.expand]: expand }, className)}
    type="button"
    title={title}
    data-hotkey={hotkeyLabel}
    {...rest}
  >
    {children}
  </button>
);

export default memo(ToolbarButton);
