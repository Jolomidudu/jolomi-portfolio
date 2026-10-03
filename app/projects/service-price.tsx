"use client";

import { useCurrency } from "../currency-provider";

type ServicePriceProps = {
  nigeria: string;
  international: string;
  className?: string;
};

export default function ServicePrice({ nigeria, international, className = "" }: ServicePriceProps) {
  const { currency } = useCurrency();
  const price = currency === "NGN" ? nigeria : international;

  return <span className={className}>Starting At {price}</span>;
}