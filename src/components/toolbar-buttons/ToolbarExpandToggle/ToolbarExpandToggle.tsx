import React from 'react';

import ToolbarButton from '../ToolbarButton/ToolbarButton';
import './ToolbarExpandToggle.scss';

type Props = {
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
}

const ToolbarExpandToggle: React.FC<Props> = ({ expand , onExpandChange}: Props) => (
  <>
    <ToolbarButton
      title="展開工具欄"
      expand={expand}
      onClick={() => onExpandChange(true)}
      style={{ display: expand ? 'none' : '' }}
    >
      <i className="expand-icon"/>
    </ToolbarButton>
    <ToolbarButton
      title="收合工具欄"
      expand={expand}
      onClick={() => onExpandChange(false)}
      style={{ display: expand ? '' : 'none' }}
    >
      <i className="collapse-icon"/>
    </ToolbarButton>
  </>
);

export default ToolbarExpandToggle;
