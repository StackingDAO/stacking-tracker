import React from 'react';
import clsx from 'clsx';

enum Color {
  GRAY,
  GREEN,
}

type Props = {
  color?: Color;
  className?: string;
};

const colorMap: Record<Color, string> = {
  [Color.GRAY]: 'bg-white/40',
  [Color.GREEN]: 'bg-green/60',
};

export function PlaceholderBar({ className, color = Color.GREEN }: Props) {
  return (
    <span className={`${className}`}>
      <span className={clsx('animate-pulse rounded-lg flex-1', colorMap[color])} />
    </span>
  );
}

PlaceholderBar.color = Color;
PlaceholderBar.className = '';
