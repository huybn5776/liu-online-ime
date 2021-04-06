import React, { ReactNode } from 'react';

interface Props {
  active?: boolean;
  children: ReactNode;
}

const SettingTabContent: React.FC<Props> = ({ active, children }: Props) => (
  <div className={`ui bottom attached tab segment${active ? ' active' : ''}`}>{children}</div>
);

export default SettingTabContent;
