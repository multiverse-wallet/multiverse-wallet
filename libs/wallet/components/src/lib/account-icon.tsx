import React from 'react';
import stc from 'string-to-color';
import Color from 'color';

export interface AccountIconProps {
  address: string;
  name?: string;
  className?: string;
}

export function AccountIcon({ address, name, className }: AccountIconProps) {
  const color = Color(stc(address)).saturate(1);
  const colorHex = color.hex();
  const oppositeColorHex = color.negate().hex();
  return (
    <div
      className={`shadow relative rounded-full ${className}`}
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${colorHex}, ${oppositeColorHex})`,
      }}
    ></div>
  );
}
