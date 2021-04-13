import React, { memo, ReactNode } from 'react';

import './ToolbarButton.scss';

type Props = {
  title: string;
  hotkeyLabel?: string;
  expand: boolean;
  children: ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>;

const ToolbarButton: React.FC<Props> = ({ title, hotkeyLabel, expand, className, children, ...rest }: Props) => (
  <button
    className={`toolbar-button${expand ? ' expand' : ''}${className ? ` ${className}` : ''}`}
    type="button"
    title={title}
    data-hotkey={hotkeyLabel}
    {...rest}
  >
    {children}
  </button>
);

export default memo(ToolbarButton);
