import React, { ReactNode } from 'react';

import { Link } from 'react-router-dom';

type Props = {
  to: string;
  withParas?: boolean;
  children?: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const AppLink: React.FC<Props> = ({ to, withParas, children, ...rest }: Props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Link to={`${to}${withParas ? window.location.search : ''}`} {...rest}>{children}</Link>
);

export default AppLink;
