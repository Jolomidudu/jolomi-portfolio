"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Currency = "NGN" | "USD";

type CurrencyContextValue = {
  currency: Currency;
  toggleCurrency: () => void;
  rate: number;
};

const currencyStorageKey = "jolomi-site-currency";
const fallbackRate = 1328.1192;
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [rate, setRate] = useState(fallbackRate);

  useEffect(() => {
    const savedCurrency = window.localStorage.getItem(currencyStorageKey);
    if (savedCurrency === "NGN" || savedCurrency === "USD") {
      setCurrency(savedCurrency);
    }

    let active = true;
    fetch("/api/currency", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load the currency rate.");
        return (await response.json()) as { rate?: number };
      })
      .then((result) => {
        if (active && Number.isFinite(result.rate ?? 0) && (result.rate ?? 0) > 0) {
          setRate(result.rate as number);
        }
      })
      .catch(() => {
        if (active) setRate(fallbackRate);
      });

    return () => {
      active = false;
    };
  }, []);

  function toggleCurrency() {
    setCurrency((currentCurrency) => {
      const nextCurrency = currentCurrency === "NGN" ? "USD" : "NGN";
      window.localStorage.setItem(currencyStorageKey, nextCurrency);
      return nextCurrency;
    });
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, rate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const currencyContext = useContext(CurrencyContext);
  if (!currencyContext) {
    throw new Error("useCurrency must be used within CurrencyProvider.");
  }
  return currencyContext;
}

export function formatCurrencyAmount(amount: number, currency: Currency, rate: number) {
  const convertedAmount = currency === "NGN" ? amount : amount / rate;
  return new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  }).format(convertedAmount);
}

export function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();
  const nextCurrency = currency === "NGN" ? "USD" : "NGN";

  return (
    <button
      type="button"
      aria-label={`Prices shown in ${currency}. Switch to ${nextCurrency}.`}
      title={`Switch prices to ${nextCurrency}`}
      onClick={toggleCurrency}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#343434] text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1f2937] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#343434]"
    >
      {currency === "NGN" ? "₦" : "$"}
    </button>
  );
}