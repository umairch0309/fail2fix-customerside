"use client";

import { useEffect } from "react";
import type { Quote } from "@/types/quote";

interface InvoicePreviewProps {
  quote: Quote;
}

/**
 * Invoice Preview Component (Customer)
 * Read-only preview of the quote/invoice
 */
export function InvoicePreview({ quote }: InvoicePreviewProps) {
  // Inject print styles for A4 PDF export
  useEffect(() => {
    const styleId = "invoice-print-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      "@media print {",
      "  @page { size: A4; margin: 0; }",
      "  body * { visibility: hidden; }",
      "  #invoice-print-area, #invoice-print-area * { visibility: visible; }",
      "  #invoice-print-area {",
      "    position: absolute; left: 0; top: 0;",
      "    width: 210mm; min-height: 297mm; padding: 15mm;",
      "    background: white !important;",
      "    -webkit-print-color-adjust: exact; print-color-adjust: exact;",
      "    border-radius: 0 !important; border: none !important;",
      "  }",
      "}",
    ].join("\n");
    document.head.appendChild(style);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div id="invoice-print-area" className="bg-white rounded-2xl border border-[#E0E0E0] p-6 flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-lg font-bold">
            <span className="text-[#F15D1E]">FAIL</span>
            <span className="text-[#494F57]">2FIX</span>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="text-[#97999D]">Invoice Date</div>
          <div className="text-[#494F57] font-semibold">
            {formatDate(quote.sentAt || quote.createdAt)}
          </div>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[#494F57] mb-1">Invoice</h1>
        <div className="text-[#97999D] text-sm">#{quote.invoiceNumber || "-"}</div>
        {quote.validUntil && (
          <div className="text-right text-sm -mt-8">
            <div className="text-[#97999D]">Valid Until</div>
            <div className="text-[#494F57] font-semibold">
              {formatDate(quote.validUntil)}
            </div>
          </div>
        )}
      </div>

      {/* From / To Section */}
      <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
        <div>
          <div className="text-[#97999D] mb-2">From</div>
          <div className="text-[#494F57] font-semibold">Fail2Fix Ltd</div>
          <div className="text-[#81868C]">support@fail2fix.com</div>
          <div className="text-[#81868C]">London, UK</div>
        </div>
        <div className="text-right">
          <div className="text-[#97999D] mb-2">To</div>
          <div className="text-[#494F57] font-semibold">{quote.customerName || "Customer"}</div>
          {quote.customerPhone && (
            <div className="text-[#81868C]">{quote.customerPhone}</div>
          )}
          {quote.customerEmail && (
            <div className="text-[#81868C]">{quote.customerEmail}</div>
          )}
          {quote.customerShowAddress !== false && (quote.customerAddress || quote.customerCity || quote.customerState || quote.customerPostalCode) && (
            <div className="text-[#81868C]">
              {quote.customerAddress && <div>{quote.customerAddress}</div>}
              {(quote.customerCity || quote.customerState || quote.customerPostalCode) && (
                <div>
                  {[quote.customerCity, quote.customerState, quote.customerPostalCode].filter(Boolean).join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-1 mb-6">
        <div className="border-t border-b border-[#EAEAEA] py-3">
          <div className="grid grid-cols-12 text-sm font-semibold text-[#494F57]">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-right">Total</div>
          </div>
        </div>

        <div className="py-2 space-y-2 min-h-[100px]">
          {quote.items && quote.items.length > 0 ? (
            quote.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 text-sm text-[#81868C] py-1"
              >
                <div className="col-span-5 truncate">{item.description}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-center">
                  £{formatCurrency(item.unitPrice)}
                </div>
                <div className="col-span-3 text-right">
                  £{formatCurrency(item.total)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-[#C4C4C4] text-sm py-8">
              No items
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <div className="mb-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#EAEAEA]">
          <div className="text-xs font-semibold text-[#97999D] uppercase mb-2">
            Notes
          </div>
          <p className="text-sm text-[#494F57]">{quote.notes}</p>
        </div>
      )}

      {/* Bottom Section - Footer & Totals */}
      <div className="mt-auto flex justify-between items-end">
        {/* Footer */}
        <div className="text-xs text-[#97999D]">Fail2fix.com</div>

        {/* Totals */}
        <div className="w-72 rounded-xl border border-[#EAEAEA] overflow-hidden bg-white">
          {/* Subtotal & Tax */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#81868C]">Subtotal</span>
              <span className="text-[#494F57] font-medium">
                £{formatCurrency(quote.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#81868C]">
                VAT {quote.vatRate ? `(${quote.vatRate}%)` : ""}
              </span>
              <span className="text-[#494F57] font-medium">
                £{formatCurrency(quote.vatAmount)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#EAEAEA]" />

          {/* Total Due */}
          <div className="p-4 flex justify-between items-center">
            <span className="text-[#494F57] font-semibold">Total Due</span>
            <span className="text-xl font-semibold text-[#494F57]">
              £{formatCurrency(quote.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
