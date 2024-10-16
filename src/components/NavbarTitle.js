import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function NavbarTitle() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      {siteConfig.title}
    </Link>
  );
}

export default NavbarTitle;