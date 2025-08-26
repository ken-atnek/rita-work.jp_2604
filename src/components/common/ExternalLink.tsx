// src/components/common/ExternalLink.tsx

import React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

const ExternalLink = ({ children, ...props }: Props) => (
  <a target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);

export default ExternalLink;
