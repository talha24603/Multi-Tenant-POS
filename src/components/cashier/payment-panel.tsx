'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, DollarSign, CheckCircle, User, Loader2, Calculator } from "lucide-react"
import { useCashier } from "@/context/cashier-context"
import { useState, useEffect } from "react"
import { searchCustomers, createCustomer, processSale, Customer } from "@/lib/api/cashier"
import { useDebounce } from "@/hooks/useDebounce"
import { Receipt } from "./receipt"

export function PaymentPanel() {
  const { 
    state, 
    setPaymentType, 
    setCustomer, 
    clearCart, 
    getCartTotal,
    setTenantId,
    setAmountGiven,
    calculateChange
  } = useCashier()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerQuery, setCustomerQuery] = useState("")
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" })
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastSaleId, setLastSaleId] = useState("")
  
  const debouncedCustomerQuery = useDebounce(customerQuery, 300)

  useEffect(() => {
    if (debouncedCustomerQuery.length > 0 && state.tenantId) {
      searchCustomers(debouncedCustomerQuery, state.tenantId)
        .then((results) => {
          setCustomers(results)
          setShowCustomerSearch(true)
        })
        .catch((error) => {
          console.error('Error searching customers:', error)
        })
    } else {
      setCustomers([])
      setShowCustomerSearch(false)
    }
  }, [debouncedCustomerQuery, state.tenantId])

  // Calculate change whenever amount given or cart changes
  useEffect(() => {
    if (state.amountGiven > 0) {
      calculateChange()
    }
  }, [state.amountGiven, state.cart, calculateChange])

  const handlePaymentTypeSelect = (type: 'CASH' | 'CARD') => {
    setPaymentType(type)
  }

  const handleCustomerSelect = (customer: Customer) => {
    setCustomer(customer)
    setCustomerQuery(customer.name)
    setShowCustomerSearch(false)
  }

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !state.tenantId) return

    setIsCreatingCustomer(true)
    try {
      const customer = await createCustomer({
        ...newCustomer,
        tenantId: state.tenantId
      })
      setCustomer(customer)
      setCustomerQuery(customer.name)
      setShowCustomerForm(false)
      setNewCustomer({ name: "", email: "", phone: "" })
    } catch (error) {
      console.error('Error creating customer:', error)
    } finally {
      setIsCreatingCustomer(false)
    }
  }

  const handleAmountGivenChange = (value: string) => {
    const amount = parseFloat(value) || 0
    setAmountGiven(amount)
  }

  const handleQuickAmount = (amount: number) => {
    setAmountGiven(amount)
  }

  const handleCompleteSale = async () => {
    if (state.cart.length === 0 || !state.paymentType || !state.tenantId) {
      return
    }

    // For cash payments, ensure amount given is sufficient
    if (state.paymentType === 'CASH' && state.amountGiven < getCartTotal()) {
      alert('Amount given must be greater than or equal to the total amount.')
      return
    }

    setIsProcessing(true)
    try {
      const saleData = {
        items: state.cart,
        total: getCartTotal(),
        paymentType: state.paymentType,
        customerId: state.selectedCustomer?.id,
        tenantId: state.tenantId,
        amountGiven: state.amountGiven,
        change: state.change
      }

      const result = await processSale(saleData)
      
      if (result.success) {
        setLastSaleId(result.saleId)
        setShowReceipt(true)
        // Don't clear cart immediately - let user view receipt first
      }
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error processing sale. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    clearCart() // Clear cart after receipt is closed
  }

  const canCompleteSale = state.cart.length > 0 && state.paymentType && state.tenantId && 
    (state.paymentType === 'CARD' || (state.paymentType === 'CASH' && state.amountGiven >= getCartTotal()))

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        
        {/* Customer Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Customer</span>
          </div>
          <div className="relative">
            <Input
              placeholder="Search customer..."
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              onFocus={() => setShowCustomerSearch(true)}
            />
            {showCustomerSearch && customers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="font-medium text-sm">{customer.name}</div>
                    {customer.email && (
                      <div className="text-xs text-muted-foreground">{customer.email}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showCustomerSearch && customerQuery.length > 0 && customers.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                <div className="text-sm text-muted-foreground">No customers found</div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-xs"
                  onClick={() => setShowCustomerForm(true)}
                >
                  Create new customer
                </Button>
              </div>
            )}
          </div>
          
          {state.selectedCustomer && (
            <div className="text-xs text-muted-foreground">
              Selected: {state.selectedCustomer.name}
            </div>
          )}
        </div>

        {/* Customer Creation Form */}
        {showCustomerForm && (
          <div className="border rounded-md p-3 space-y-2">
            <Input
              placeholder="Customer name *"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
            <Input
              placeholder="Email (optional)"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <Input
              placeholder="Phone (optional)"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateCustomer}
                disabled={!newCustomer.name || isCreatingCustomer}
              >
                {isCreatingCustomer ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomerForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Payment Type Selection */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Payment Method</div>
          <div className="flex gap-2">
            <Button
              variant={state.paymentType === 'CASH' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => handlePaymentTypeSelect('CASH')}
            >
              <DollarSign className="h-4 w-4" />
              Cash
            </Button>
            <Button
              variant={state.paymentType === 'CARD' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => handlePaymentTypeSelect('CARD')}
            >
              <CreditCard className="h-4 w-4" />
              Card
            </Button>
          </div>
        </div>

        {/* Amount Given and Change Calculation (for Cash payments) */}
        {state.paymentType === 'CASH' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-medium">Amount Given</span>
              </div>
              <Input
                type="number"
                placeholder="Enter amount given"
                value={state.amountGiven || ''}
                onChange={(e) => handleAmountGivenChange(e.target.value)}
                className="text-lg font-semibold"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Quick Amounts</div>
              <div className="flex gap-2 flex-wrap">
                {[10, 20, 50, 100].map((amt) => (
                  <Button 
                    key={amt} 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleQuickAmount(amt)}
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Change Display */}
            {state.amountGiven > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Change to Return:</span>
                  <span className="text-lg font-bold text-green-800">
                    ${state.change.toFixed(2)}
                  </span>
                </div>
                {state.change < 0 && (
                  <div className="text-xs text-red-600 mt-1">
                    Amount given is insufficient
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Complete Sale Button */}
        <Button 
          className="w-full flex items-center gap-2"
          onClick={handleCompleteSale}
          disabled={!canCompleteSale || isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          {isProcessing ? 'Processing...' : 'Complete Sale'}
        </Button>

        {/* Sale Summary */}
        {state.cart.length > 0 && (
          <div className="border-t pt-3 space-y-1">
            <div className="text-sm font-medium">Sale Summary</div>
            <div className="text-xs text-muted-foreground">
              Items: {state.cart.length} | Total: ${getCartTotal().toFixed(2)}
            </div>
            {state.selectedCustomer && (
              <div className="text-xs text-muted-foreground">
                Customer: {state.selectedCustomer.name}
              </div>
            )}
            {state.paymentType && (
              <div className="text-xs text-muted-foreground">
                Payment: {state.paymentType}
              </div>
            )}
            {state.paymentType === 'CASH' && state.amountGiven > 0 && (
              <div className="text-xs text-muted-foreground">
                Amount Given: ${state.amountGiven.toFixed(2)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <Receipt
          saleId={lastSaleId}
          items={state.cart}
          customer={state.selectedCustomer}
          paymentType={state.paymentType!}
          amountGiven={state.amountGiven}
          change={state.change}
          onClose={handleReceiptClose}
        />
      )}
    </>
  )
} 