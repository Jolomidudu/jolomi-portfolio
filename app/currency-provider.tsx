"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Currency = "NGN" | "USD";

type CurrencyContextValue = {
  currency: Currency;
  toggleCurrency: () => void;
};

const currencyStorageKey = "jolomi-site-currency";
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");

  useEffect(() => {
    const savedCurrency = window.localStorage.getItem(currencyStorageKey);
    if (savedCurrency === "NGN" || savedCurrency === "USD") {
      setCurrency(savedCurrency);
    }
  }, []);

  function toggleCurrency() {
    setCurrency((currentCurrency) => {
      const nextCurrency = currentCurrency === "NGN" ? "USD" : "NGN";
      window.localStorage.setItem(currencyStorageKey, nextCurrency);
      return nextCurrency;
    });
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency }}>
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