"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Service = {
  id: string;
  title: string;
  startingAmount: number;
};

export default function PaymentForm({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"deposit" | "custom">("deposit");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectedService = services.find((service) => service.id === serviceId);
  const depositAmount = selectedService ? Math.round(selectedService.startingAmount * 0.45) : 0;
  const customAmountValue = Number(customAmount);
  const customAmountIsValid = Number.isSafeInteger(customAmountValue) && customAmountValue >= 100;
  const paymentAmount = paymentType === "deposit" ? depositAmount : customAmountIsValid ? customAmountValue : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType,
          serviceId: paymentType === "deposit" ? serviceId : undefined,
          customAmount: paymentType === "custom" ? customAmountValue : undefined,
          email,
          name,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to start payment.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to start payment.");
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Pay" aria-haspopup="dialog" className="fixed bottom-[100px] right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffffff] text-[0.625rem] font-bold text-[#365132] shadow-lg transition-transform hover:-translate-y-1 hover:bg-[#006e6a]">
       PAY ME
      </button>
      

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 sm:items-center sm:p-6">
          <button type="button" aria-label="Close payment form" onClick={() => setOpen(false)} className="absolute inset-0 h-full w-full cursor-default" />
          <section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto border-t-4 border-[#00A9A5] bg-[#f5f5f0] px-5 pb-8 pt-6 text-[#111111] shadow-2xl sm:border-t-0 sm:px-8 sm:pt-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008c87]">Secure checkout</p>
                <h2 id="payment-title" className="mt-2 text-1xl font-semibold">MAKE A SERVICE PAYMENT</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close payment form" className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/15 text-2xl leading-none hover:bg-black/5">×</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7">
              <fieldset>
                <legend className="text-sm font-medium">Payment amount</legend>
                <div className="mt-3 grid grid-cols-2 border border-black/15">
                  <label className={`cursor-pointer px-3 py-3 text-center text-sm font-medium ${paymentType === "deposit" ? "bg-[#111111] text-white" : "hover:bg-black/5"}`}>
                    <input className="sr-only" type="radio" name="paymentType" value="deposit" checked={paymentType === "deposit"} onChange={() => setPaymentType("deposit")} />
                    Service deposit
                  </label>
                  <label className={`cursor-pointer border-l border-black/15 px-3 py-3 text-center text-sm font-medium ${paymentType === "custom" ? "bg-[#111111] text-white" : "hover:bg-black/5"}`}>
                    <input className="sr-only" type="radio" name="paymentType" value="custom" checked={paymentType === "custom"} onChange={() => setPaymentType("custom")} />
                    Custom amount
                  </label>
                </div>
              </fieldset>

              {paymentType === "deposit" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="text-sm font-medium">
                    Service
                    <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]">
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>{service.title}</option>
                      ))}
                    </select>
                  </label>
                  <p className="pb-3 text-sm text-black/60">45% of Selected Service Fee: <strong className="text-[#008c87]">₦{depositAmount.toLocaleString()}</strong></p>
                </div>
              ) : (
                <label className="mt-5 block text-sm font-medium">
                  Amount in naira
                  <span className="mt-2 flex border border-black/20 focus-within:border-[#00A9A5]">
                    <span className="flex items-center border-r border-black/15 px-4 text-black/55">₦</span>
                    <input required type="number" min="100" step="1" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none" placeholder="Enter amount" />
                  </span>
                  <span className="mt-2 block text-xs font-normal text-black/50">Minimum payment ₦100.</span>
                </label>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Your name
                  <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]" placeholder="Full name" />
                </label>
                <label className="text-sm font-medium">
                  Email address
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]" placeholder="you@example.com" />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-black/55">Payment total: <strong className="text-[#111111]">₦{paymentAmount.toLocaleString()}</strong></p>
                <button type="submit" disabled={loading || (paymentType === "deposit" ? !selectedService : !customAmountIsValid)} className="inline-flex w-fit items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008c87] disabled:cursor-wait disabled:opacity-50">
                  <span>{loading ? "Opening checkout..." : "Continue to Paystack"}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              {status && <p role="alert" className="mt-4 text-sm text-red-700">{status}</p>}
            </form>
          </section>
        </div>
      )}
    </>
  );
}
