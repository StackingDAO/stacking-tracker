// @ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import { PlaceholderBar } from '@/app/components/PlaceholderBar';
import { currency } from '@/app/common/utils';
import { fetchStxPrice } from '@/app/components/AppContext';

interface CenterProps {
  className: string;
}

export function Center({ className }: CenterProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [startedLoading, setStartedLoading] = useState(false);
  const [amountLocked, setAmountLocked] = useState<number>(0);

  const loadPoxData = async () => {
    const url = 'https://api.mainnet.hiro.so/v2/pox';
    const response = await fetch(url, { credentials: 'omit' });
    const data = await response.json();

    const stxPrice = await fetchStxPrice();
    const stxStacked = Number(data['current_cycle']['stacked_ustx']) / 1000000.0;

    setAmountLocked(stxPrice * stxStacked);
    setIsLoading(false);
  };

  useEffect(() => {
    if (startedLoading) return;

    loadPoxData();
  }, []);

  return (
    <div className="text-2xl">
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
        <span>Currently there is ${currency.short.format(amountLocked)} locked up in PoX.</span>
      )}
    </div>
  );
}
