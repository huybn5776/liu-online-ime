import React from 'react';

import AppLink from '../../AppLink/AppLink';

type Props = {
  expand: boolean;
} & React.HTMLAttributes<HTMLElement>;

const ToolbarGoToSetting: React.FC<Props> = ({ expand, className, ...rest }: Props) => (
  <AppLink
    className={`toolbar-button setting-button${expand ? ' expand' : ''}${className ? ` ${className}` : ''}`}
    to="/settings"
    withParas
    title="設定"
    {...rest}
  >
    <i className="icon cog" />
  </AppLink>
);

export default ToolbarGoToSetting;
