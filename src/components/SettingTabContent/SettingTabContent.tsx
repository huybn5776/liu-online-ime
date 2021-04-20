import React, { ReactNode } from 'react';

import clsx from 'clsx';

interface Props {
  active?: boolean;
  children: ReactNode;
}

const SettingTabContent: React.FC<Props> = ({ active, children }: Props) => (
  <div className={clsx('ui', 'bottom', 'attached', 'tab', 'segment', { active })}>{children}</div>
);

export default SettingTabContent;
