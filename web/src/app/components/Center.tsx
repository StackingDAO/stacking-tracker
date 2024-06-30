// @ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { PlaceholderBar } from '@/app/components/PlaceholderBar';

interface CenterProps {
  className: string;
}

export function Center({ className }: CenterProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

  }, []);

  return (
    <div className="relative z-[-1] flex text-2xl">
      {isLoading ? (
        <div className="inline-flex">
          <PlaceholderBar
            className="inline-flex w-24 h-2 mr-2"
            color={PlaceholderBar.color.GREEN}
          />
          <PlaceholderBar
            className="inline-flex w-24 h-2 mr-2"
            color={PlaceholderBar.color.GREEN}
          />
          <PlaceholderBar
            className="inline-flex w-24 h-2 mr-2"
            color={PlaceholderBar.color.GREEN}
          />
          <PlaceholderBar
            className="inline-flex w-24 h-2"
            color={PlaceholderBar.color.GREEN}
          />
        </div>
      ) : (
        <span>Currently there is $622,000,000 locked up in PoX.</span>
      )}
    </div>
  );
}
