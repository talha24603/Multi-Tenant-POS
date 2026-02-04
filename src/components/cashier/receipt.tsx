'use client'

import { CartItem, Customer } from '@/lib/api/cashier'
import { useCashier } from '@/context/cashier-context'
import { Button } from '@/components/ui/button'
import { Printer, Download, X } from 'lucide-react'
import { useRef } from 'react'
import { useSession } from 'next-auth/react'

interface ReceiptProps {
  saleId: string
  items: CartItem[]
  customer: Customer | null
  paymentType: 'CASH' | 'CARD'
  amountGiven: number
  change: number
  onClose: () => void
}

export function Receipt({ 
  saleId, 
  items, 
  customer, 
  paymentType, 
  amountGiven, 
  change, 
  onClose 
}: ReceiptProps) {
  const { getCartSubtotal, getTax, getCartTotal } = useCashier()
  const receiptRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const tenantName = session?.user?.tenantName || 'Your Store Name'

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>SIDZ Receipt</title>
              <style>
                body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                .receipt { max-width: 320px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 16px 14px 20px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
                .header { text-align: center; margin-bottom: 16px; }
                .brand { display: inline-flex; align-items: baseline; gap: 4px; justify-content: center; }
                .brand-name { font-size: 20px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
                .brand-pill { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: #eef2ff; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.08em; }
                .subtitle { font-size: 11px; color: #6b7280; }
                .divider { border-top: 1px dashed #d4d4d8; margin: 10px 0; }
                .item { display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px; }
                .item-name { flex: 1; padding-right: 6px; }
                .item-price { text-align: right; min-width: 64px; }
                .total-section { margin-top: 10px; font-size: 12px; }
                .total-row { display: flex; justify-content: space-between; font-weight: 600; margin: 2px 0; }
                .total-row--muted { font-weight: 500; color: #6b7280; }
                .total-row--emphasis { font-size: 13px; }
                .footer { text-align: center; margin-top: 16px; font-size: 10px; color: #6b7280; }
                .footer-cta { font-size: 11px; font-weight: 600; margin-bottom: 4px; }
                .meta { font-size: 11px; margin-top: 4px; color: #6b7280; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownload = () => {
    if (receiptRef.current) {
      const content = receiptRef.current.innerText
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${saleId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Receipt</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Receipt Content */}
        <div className="p-4">
          <div ref={receiptRef} className="receipt bg-white p-4 border rounded">
            {/* Receipt Header */}
            <div className="header">
              <div className="brand">
                <div className="brand-name">{tenantName}</div>
              </div>
              <div className="subtitle">Powered by SIDZ POS</div>
              <div className="subtitle">123 Main Street, City, State</div>
              <div className="subtitle">Phone: (555) 123-4567</div>
              <div className="divider"></div>
            </div>

            {/* Sale Info */}
            <div className="sale-info">
              <div className="item">
                <span>Sale ID:</span>
                <span>{saleId}</span>
              </div>
              <div className="item">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="item">
                <span>Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              {customer && (
                <div className="item">
                  <span>Customer:</span>
                  <span>{customer.name}</span>
                </div>
              )}
              <div className="divider"></div>
            </div>

            {/* Items */}
            <div className="items">
              {items.map((item) => (
                <div key={item.id} className="item">
                  <div className="item-name">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="divider"></div>
            </div>

            {/* Totals */}
            <div className="total-section">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${getCartSubtotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (7%):</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="divider"></div>
              <div className="total-row">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              {/* Payment Info */}
              <div className="divider"></div>
              <div className="total-row">
                <span>Payment Method:</span>
                <span>{paymentType}</span>
              </div>
              {paymentType === 'CASH' && (
                <>
                  <div className="total-row">
                    <span>Amount Given:</span>
                    <span>${amountGiven.toFixed(2)}</span>
                  </div>
                  <div className="total-row">
                    <span>Change:</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="footer">
              <div className="footer-cta">Thank you for shopping with SIDZ.</div>
              <div>We appreciate your business.</div>
              <div className="divider"></div>
              <div className="meta">Powered by SIDZ POS</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 border-t">
          <Button onClick={handlePrint} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
