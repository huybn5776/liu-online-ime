import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import styles from './ToolbarExpandToggle.module.scss';

type Props = {
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
};

const ToolbarExpandToggle: React.FC<Props> = ({ expand, onExpandChange }: Props) => (
  <>
    <ToolbarButton
      title="展開工具欄"
      expand={expand}
      onClick={() => onExpandChange(true)}
      style={{ display: expand ? 'none' : '' }}
    >
      <i className={styles.expandIcon} />
    </ToolbarButton>
    <ToolbarButton
      title="收合工具欄"
      expand={expand}
      onClick={() => onExpandChange(false)}
      style={{ display: expand ? '' : 'none' }}
    >
      <i className={styles.collapseIcon} />
    </ToolbarButton>
  </>
);

export default ToolbarExpandToggle;
