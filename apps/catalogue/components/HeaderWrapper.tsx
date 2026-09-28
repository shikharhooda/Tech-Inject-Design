'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@tech-inject/ui';
import { UserDto } from '@tech-inject/types';
import { CatalogueApi } from '@/lib/api';

export function HeaderWrapper() {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    CatalogueApi.getMe().then((res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    });
  }, []);

  const handleLogout = async () => {
    await CatalogueApi.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Navbar
      user={user}
      onLogout={handleLogout}
      brandTitle="Tech Inject"
      links={[
        { href: '/components', label: 'Components' },
        { href: '/get-started', label: 'Get Started' },
        { href: '/account', label: 'License / Account' },
      ]}
    />
  );
}
