import React, { useMemo } from "react";
import CustomModal from "../UI/CustomModal";
import PrimaryButton from "../UI/PrimaryButton";
import "./OrderInvoice.scss";
import currencySymbolGenerator from "../../utilities/currencySymbolGenerator";

const PLATFORM_FEE_PERCENT = 8;
const LOGO_SRC = "/partikarte-logo.png";

function buildInvoiceTotals(order) {
  if (!order) {
    return {
      amount: "0.00",
      amountWithVat: "0.00",
      vat: "0.00",
      fee: "0.00",
      netToBusiness: "0.00",
      feePercent: PLATFORM_FEE_PERCENT,
      date: "—",
      currency: "EUR",
      customerName: "",
      customerEmail: "",
      noOfTickets: 0,
      orderId: "",
      eventName: "",
    };
  }

  const event =
    order.eventId && typeof order.eventId === "object" ? order.eventId : null;
  const eventTickets = event?.tickets || [];

  let totalWithoutVat = 0;
  let totalWithVat = 0;
  let computedFromTickets = false;

  (order.tickets || []).forEach((line) => {
    const ticketData = eventTickets.find(
      (t) => t?._id?.toString?.() === line?.ticketId?.toString?.()
    );
    if (!ticketData) return;

    const qty = Number(line?.noOfTickets) || 0;
    const price = Number(ticketData.price) || 0;
    const priceWithVat =
      Number(ticketData.priceWithVAT) ||
      price + (Number(ticketData.vat) || 0);

    totalWithoutVat += price * qty;
    totalWithVat += priceWithVat * qty;
    computedFromTickets = true;
  });

  // Fallback: orderAmount is gross (VAT included) for Stripe/paid orders
  if (!computedFromTickets) {
    totalWithVat = Number(order.orderAmount) || 0;
    totalWithoutVat = totalWithVat;
  }

  const vatAmount = Math.max(0, totalWithVat - totalWithoutVat);

  let platformFee = Number(order.platformFeeAmount);
  if (!Number.isFinite(platformFee) || platformFee <= 0) {
    platformFee =
      Math.round(totalWithVat * (PLATFORM_FEE_PERCENT / 100) * 100) / 100;
  }

  let netToBusiness = Number(order.netToBusiness);
  if (!Number.isFinite(netToBusiness) || netToBusiness <= 0) {
    netToBusiness = Math.round((totalWithVat - platformFee) * 100) / 100;
  }

  const currency = order.currency || event?.eventCurrency || "EUR";

  return {
    amount: totalWithoutVat.toFixed(2),
    amountWithVat: totalWithVat.toFixed(2),
    vat: vatAmount.toFixed(2),
    fee: platformFee.toFixed(2),
    netToBusiness: netToBusiness.toFixed(2),
    feePercent: PLATFORM_FEE_PERCENT,
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    currency,
    customerName: order.customerName || "",
    customerEmail: order.customerEmail || "",
    noOfTickets: order.noOfTickets || 0,
    orderId: order._id?.toString?.() || order.purchaseId || "",
    eventName: event?.eventName || "",
  };
}

function downloadInvoice(data, symbol) {
  const fileId = data.orderId || Date.now();
  const rows = [
    ["Customer", data.customerName || "—"],
    ["Email", data.customerEmail || "—"],
    ["Event", data.eventName || "—"],
    ["Tickets", String(data.noOfTickets || 0)],
    ["Order Amount (without VAT)", `${symbol} ${data.amount}`],
    ["Order Amount (with VAT)", `${symbol} ${data.amountWithVat}`],
    ["VAT Amount", `${symbol} ${data.vat}`],
    [`Platform Fee (${data.feePercent}%)`, `${symbol} ${data.fee}`],
    ["Net to Business", `${symbol} ${data.netToBusiness}`],
    ["Date/Time of Purchase", data.date],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8eef6;color:#1a2b4a;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8eef6;text-align:right;font-weight:600;color:#1a2b4a;">${value}</td>
      </tr>`
    )
    .join("");

  const logoAbsolute = `${window.location.origin}${LOGO_SRC}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Order Invoice ${fileId}</title>
  <style>
    body { font-family: Outfit, Arial, Helvetica, sans-serif; margin: 0; color: #1d1e25; background: #f0f4fa; }
    .sheet { max-width: 680px; margin: 32px auto; background: #fff; border: 1px solid #e8eef6; border-radius: 16px; overflow: hidden; }
    .brand { background: #3d8aff; padding: 24px; text-align: center; }
    .brand img { height: 36px; width: auto; max-width: 220px; }
    .content { padding: 28px 32px 36px; }
    h1 { margin: 0 0 8px; font-size: 24px; color: #0e2d5d; }
    p { margin: 0 0 24px; color: #5b6b86; }
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand"><img src="${logoAbsolute}" alt="Partikarte" /></div>
    <div class="content">
      <h1>Order Invoice</h1>
      <p>Partikarte order invoice${data.orderId ? ` - #${data.orderId}` : ""}</p>
      <table>${rowsHtml}</table>
    </div>
  </div>
  <script>window.onload = function () { window.print(); };</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");
  if (!printWindow) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${fileId}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const OrderInvoice = ({
  showOrderInvoice,
  setShowOrderInvoice,
  selectedRecord,
}) => {
  const data = useMemo(
    () => buildInvoiceTotals(selectedRecord),
    [selectedRecord]
  );
  const symbol = currencySymbolGenerator(data.currency);

  return (
    <CustomModal
      onCancel={() => setShowOrderInvoice(false)}
      open={showOrderInvoice}
      onOk={() => setShowOrderInvoice(false)}
      title="Order Invoice"
      subtitle={
        data.orderId
          ? `Partikarte order invoice - #${data.orderId}`
          : "Following are the details of the order invoice."
      }
    >
      <div className="order-invoice-main-container">
        <div className="invoice-brand">
          <img src={LOGO_SRC} alt="Partikarte" />
        </div>

        {(data.customerName || data.customerEmail || data.eventName) && (
          <>
            {data.customerName && (
              <div className="invoice-item">
                <h4>Customer</h4>
                <h3>{data.customerName}</h3>
              </div>
            )}
            {data.customerEmail && (
              <div className="invoice-item">
                <h4>Email</h4>
                <h3>{data.customerEmail}</h3>
              </div>
            )}
            {data.eventName && (
              <div className="invoice-item">
                <h4>Event</h4>
                <h3>{data.eventName}</h3>
              </div>
            )}
            <div className="invoice-item">
              <h4>Tickets</h4>
              <h3>{data.noOfTickets}</h3>
            </div>
          </>
        )}
        <div className="invoice-item">
          <h4>Order Amount (without VAT)</h4>
          <h3>
            {symbol} {data.amount}
          </h3>
        </div>
        <div className="invoice-item">
          <h4>Order Amount (with VAT)</h4>
          <h3>
            {symbol} {data.amountWithVat}
          </h3>
        </div>
        <div className="invoice-item">
          <h4>VAT Amount</h4>
          <h3>
            {symbol} {data.vat}
          </h3>
        </div>
        <div className="invoice-item">
          <h4>Platform Fee ({data.feePercent}%)</h4>
          <h3>
            {symbol} {data.fee}
          </h3>
        </div>
        <div className="invoice-item">
          <h4>Net to Business</h4>
          <h3>
            {symbol} {data.netToBusiness}
          </h3>
        </div>
        <div className="invoice-item">
          <h4>Date/Time of Purchase</h4>
          <h3>{data.date}</h3>
        </div>

        <PrimaryButton
          type="button"
          className="invoice-download-button"
          onClick={() => downloadInvoice(data, symbol)}
        >
          Download Invoice
        </PrimaryButton>
      </div>
    </CustomModal>
  );
};

export default OrderInvoice;
