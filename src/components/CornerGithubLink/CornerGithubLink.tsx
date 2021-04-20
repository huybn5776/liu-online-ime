import React from 'react';

import clsx from 'clsx';

import styles from './CornerGithubLink.module.scss';

const CornerGithubLink: React.FC = () => (
  <a
    className={styles.cornerGithubLink}
    href="https://github.com/huybn5776/liu-online-ime"
    target="_blank"
    rel="noreferrer noopener"
  >
    <i className={clsx('github', 'icon', styles.githubIcon)} />
  </a>
);

export default CornerGithubLink;
