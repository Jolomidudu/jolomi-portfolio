import { NextResponse } from "next/server";

const exchangeRateUrl = "https://open.er-api.com/v6/latest/USD";

export async function GET() {
  try {
    const response = await fetch(exchangeRateUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Exchange rate service returned ${response.status}.`);
    }

    const result = (await response.json()) as {
      rates?: { NGN?: number };
    };
    const rate = result.rates?.NGN;

    if (!rate || !Number.isFinite(rate) || rate <= 0) {
      throw new Error("Exchange rate service returned an invalid NGN rate.");
    }

    return NextResponse.json({
      rate,
      source: exchangeRateUrl,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to fetch exchange rate:", error);
    return NextResponse.json(
      {
        error: "Unable to load the current currency rate.",
        rate: 1328.1192,
      },
      { status: 502 },
    );
  }
}
