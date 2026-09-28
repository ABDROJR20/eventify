import { NextResponse } from "next/server";
import { getAllRegistrations, createRegistration, getAllEvents } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");

    const currency = searchParams.get("currency") || "PKR";

    let registrations = await getAllRegistrations();

    if (eventId && eventId !== "All") {
      registrations = registrations.filter(
        (r) => String(r.eventId) === String(eventId) || r.eventTitle === eventId
      );
    }

    if (status && status !== "All") {
      registrations = registrations.filter(
        (r) => (r.status || "").toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      registrations = registrations.filter(
        (r) =>
          (r.id || "").toLowerCase().includes(search) ||
          (r.customerName || "").toLowerCase().includes(search) ||
          (r.customerEmail || "").toLowerCase().includes(search) ||
          (r.eventTitle || "").toLowerCase().includes(search) ||
          (r.ticketCode && r.ticketCode.toLowerCase().includes(search))
      );
    }

    // Exchange rates (Base: 1 PKR)
    const exchangeRates = {
      PKR: { rate: 1, symbol: "PKR ", format: (val) => `PKR ${Math.round(val).toLocaleString()}` },
      USD: { rate: 1 / 278.50, symbol: "$", format: (val) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      EUR: { rate: 1 / 302.20, symbol: "€", format: (val) => `€${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      GBP: { rate: 1 / 362.40, symbol: "£", format: (val) => `£${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      AED: { rate: 1 / 75.82, symbol: "AED ", format: (val) => `AED ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
      SAR: { rate: 1 / 74.25, symbol: "SAR ", format: (val) => `SAR ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    };

    const curr = exchangeRates[currency] || exchangeRates.PKR;

    const rawRevenuePKR = registrations
      .filter((r) => r.status === "Completed" || r.status === "Checked In")
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

    const totalTicketsSold = registrations
      .filter((r) => r.status !== "Refunded")
      .reduce((sum, r) => sum + (Number(r.ticketCount) || 1), 0);

    const avgOrderValue =
      registrations.length > 0 ? (rawRevenuePKR / registrations.length) * curr.rate : 0;

    return NextResponse.json({
      success: true,
      data: registrations,
      metrics: {
        totalRevenue: curr.format(rawRevenuePKR * curr.rate),
        rawRevenue: rawRevenuePKR,
        totalTicketsSold: totalTicketsSold.toLocaleString(),
        avgOrderValue: curr.format(avgOrderValue),
      },
      total: registrations.length,
    });
  } catch (error) {
    console.error("Registrations GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    const newReg = await createRegistration(body);

    return NextResponse.json(
      { success: true, message: "Registration created successfully", data: newReg },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registrations POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create registration" },
      { status: 500 }
    );
  }
}
