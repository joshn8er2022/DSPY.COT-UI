
'use client';

import { useState, useEffect } from 'react';
import { CredentialsManager } from './credentials-manager';
import { ChainOfThoughtInterface } from './chain-of-thought-interface';
import { ApiCredential } from '@/lib/types';

export function MainInterface() {
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);

  const loadCredentials = async () => {
    try {
      const response = await fetch('/api/credentials');
      const data = await response?.json?.();
      
      if (data?.success) {
        setCredentials(data?.data ?? []);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  return (
    <div className="space-y-8">
      <CredentialsManager onCredentialsUpdate={loadCredentials} />
      <ChainOfThoughtInterface credentials={credentials} />
    </div>
  );
}
