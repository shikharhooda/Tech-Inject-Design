import React from 'react';
import { Badge } from './Badge';

export interface StatusBadgeProps {
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ACTIVE' | 'REVOKED' | 'FREE' | 'PREMIUM' | 'CUSTOMER' | 'ADMIN';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  switch (status) {
    case 'PUBLISHED':
      return <Badge variant="success" size={size}>Published</Badge>;
    case 'DRAFT':
      return <Badge variant="warning" size={size}>Draft</Badge>;
    case 'UNPUBLISHED':
      return <Badge variant="neutral" size={size}>Unpublished</Badge>;
    case 'FREE':
      return <Badge variant="success" size={size}>Free</Badge>;
    case 'PREMIUM':
      return <Badge variant="warning" size={size}>Premium</Badge>;
    case 'ACTIVE':
      return <Badge variant="success" size={size}>Active</Badge>;
    case 'REVOKED':
      return <Badge variant="danger" size={size}>Revoked</Badge>;
    case 'ADMIN':
      return <Badge variant="default" size={size}>Admin</Badge>;
    case 'CUSTOMER':
      return <Badge variant="neutral" size={size}>Customer</Badge>;
    default:
      return <Badge variant="neutral" size={size}>{status}</Badge>;
  }
};
