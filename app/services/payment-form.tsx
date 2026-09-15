"use client";

import { useState } from "react";

type Service = {
  id: string;
  title: string;
  amount: number;
  note: string;
};

export default function PaymentForm({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedService = services.find((service) => service.id === serviceId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, email, name }),
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
    <form onSubmit={handleSubmit} className="mt-10 border-t border-black/15 pt-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">
          Service
          <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]">
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.title} - ₦{service.amount.toLocaleString()}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Your name
          <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]" placeholder="Full name" />
        </label>
        <label className="text-sm font-medium">
          Email address
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border border-black/20 bg-transparent px-4 py-3 outline-none focus:border-[#00A9A5]" placeholder="you@example.com" />
        </label>
        <div className="text-sm font-medium">
          <span>Payment provider</span>
          <p className="mt-2 border border-[#00A9A5] bg-[#dce9e3] px-4 py-3">Paystack secure checkout</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/55">Starting payment: ₦{selectedService?.amount.toLocaleString() ?? "0"}. Final project scope can be agreed before work begins.</p>
        <button disabled={loading || !selectedService} className="inline-flex w-fit rounded-full bg-[#111111] px-6 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-1 disabled:cursor-wait disabled:opacity-50">
          {loading ? "Opening checkout..." : "Continue to payment ↗"}
        </button>
      </div>
      {status && <p role="alert" className="mt-4 text-sm text-red-700">{status}</p>}
    </form>
  );
}
