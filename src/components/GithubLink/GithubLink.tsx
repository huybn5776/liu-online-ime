import React from 'react';

import clsx from 'clsx';

import styles from './GithubLink.module.scss';

interface Props {
  className?: string;
}

const GithubLink: React.FC<Props> = ({ className }: Props) => (
  <a
    className={clsx('item', styles.githubLink, className)}
    href="https://github.com/huybn5776/liu-online-ime"
    target="_blank"
    rel="noreferrer noopener"
  >
    <i className={clsx('github', 'icon', styles.githubIcon)} />
  </a>
);

export default GithubLink;
