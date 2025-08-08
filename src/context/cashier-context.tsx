'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import { CartItem, Customer } from '@/lib/api/cashier'

interface CashierState {
  cart: CartItem[]
  selectedCustomer: Customer | null
  paymentType: 'CASH' | 'CARD' | null
  tenantId: string | null
  isLoading: boolean
  error: string | null
  amountGiven: number
  change: number
}

type CashierAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CUSTOMER'; payload: Customer | null }
  | { type: 'SET_PAYMENT_TYPE'; payload: 'CASH' | 'CARD' | null }
  | { type: 'SET_TENANT_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AMOUNT_GIVEN'; payload: number }
  | { type: 'CALCULATE_CHANGE' }

const initialState: CashierState = {
  cart: [],
  selectedCustomer: null,
  paymentType: null,
  tenantId: null,
  isLoading: false,
  error: null,
  amountGiven: 0,
  change: 0
}

function cashierReducer(state: CashierState, action: CashierAction): CashierState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.productId === action.payload.productId)
      
      if (existingItem) {
        // Update quantity if item already exists
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        }
      } else {
        // Add new item
        return {
          ...state,
          cart: [...state.cart, action.payload]
        }
      }
    }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        selectedCustomer: null,
        paymentType: null,
        amountGiven: 0,
        change: 0
      }
    
    case 'SET_CUSTOMER':
      return {
        ...state,
        selectedCustomer: action.payload
      }
    
    case 'SET_PAYMENT_TYPE':
      return {
        ...state,
        paymentType: action.payload
      }
    
    case 'SET_TENANT_ID':
      return {
        ...state,
        tenantId: action.payload
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    
    case 'SET_AMOUNT_GIVEN':
      return {
        ...state,
        amountGiven: action.payload
      }
    
    case 'CALCULATE_CHANGE':
      const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.07 // Including tax
      return {
        ...state,
        change: Math.max(0, state.amountGiven - total)
      }
    
    default:
      return state
  }
}

interface CashierContextType {
  state: CashierState
  dispatch: React.Dispatch<CashierAction>
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCustomer: (customer: Customer | null) => void
  setPaymentType: (type: 'CASH' | 'CARD' | null) => void
  setTenantId: (id: string) => void
  setAmountGiven: (amount: number) => void
  calculateChange: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getTax: () => number
}

const CashierContext = createContext<CashierContextType | undefined>(undefined)

export function CashierProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cashierReducer, initialState)

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const setCustomer = useCallback((customer: Customer | null) => {
    dispatch({ type: 'SET_CUSTOMER', payload: customer })
  }, [])

  const setPaymentType = useCallback((type: 'CASH' | 'CARD' | null) => {
    dispatch({ type: 'SET_PAYMENT_TYPE', payload: type })
  }, [])

  const setTenantId = useCallback((id: string) => {
    dispatch({ type: 'SET_TENANT_ID', payload: id })
  }, [])

  const setAmountGiven = useCallback((amount: number) => {
    dispatch({ type: 'SET_AMOUNT_GIVEN', payload: amount })
  }, [])

  const calculateChange = useCallback(() => {
    dispatch({ type: 'CALCULATE_CHANGE' })
  }, [])

  const getCartSubtotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [state.cart])

  const getTax = useCallback(() => {
    return getCartSubtotal() * 0.07 // 7% tax rate
  }, [getCartSubtotal])

  const getCartTotal = useCallback(() => {
    return getCartSubtotal() + getTax()
  }, [getCartSubtotal, getTax])

  const value: CashierContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCustomer,
    setPaymentType,
    setTenantId,
    setAmountGiven,
    calculateChange,
    getCartTotal,
    getCartSubtotal,
    getTax
  }

  return (
    <CashierContext.Provider value={value}>
      {children}
    </CashierContext.Provider>
  )
}

export function useCashier() {
  const context = useContext(CashierContext)
  if (context === undefined) {
    throw new Error('useCashier must be used within a CashierProvider')
  }
  return context
} 