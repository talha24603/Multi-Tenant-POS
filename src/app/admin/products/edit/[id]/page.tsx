"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Upload, Loader2, Save, X } from "lucide-react"
import { toast } from "sonner"
import { fetchProductById, updateProduct, type UpdateProductData, type Product } from "@/lib/api/products"

export default function EditProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const productId = params.id

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [formData, setFormData] = useState<UpdateProductData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoadingProduct(true)
        const product = await fetchProductById(productId)
        setFormData({
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description || "",
          category: product.category || "General",
          barcode: product.barcode || "",
          imageUrl: product.imageUrl || ""
        })
      } catch (error) {
        toast.error("Failed to load product")
        router.push("/admin/products")
      } finally {
        setLoadingProduct(false)
      }
    }
    if (productId) loadProduct()
  }, [productId, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = "Product name is required"
    if (formData.price === undefined || formData.price === null || isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = "Price must be a positive number"
    if (formData.stock === undefined || formData.stock === null || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) newErrors.stock = "Stock must be a non-negative number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof UpdateProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('upload_preset', 'pos-app')
    setIsUploading(true)
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setFormData(prev => ({ ...prev, imageUrl: data.secure_url }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (status === 'loading' || status === 'unauthenticated') {
      toast.error('Please log in to edit products')
      return
    }
    setIsLoading(true)
    try {
      await updateProduct(productId, {
        name: formData.name?.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description?.trim() || undefined,
        category: formData.category?.trim() || 'General',
        barcode: formData.barcode?.trim() || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined
      })
      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/products')
  }

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span className="text-lg">Loading product...</span>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
            <p className="text-muted-foreground">Update product details</p>
          </div>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Edit the details for this product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || "General"}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="General"
                  />
                </div>
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price ?? ""}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock ?? ""}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                    className={errors.stock ? 'border-red-500' : ''}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">{errors.stock}</p>
                  )}
                </div>
                {/* Barcode */}
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode || ""}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Enter barcode (optional)"
                  />
                </div>
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                      disabled={isUploading}
                      className="flex items-center space-x-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    </Button>
                  </div>
                  {formData.imageUrl && (
                    <div className="relative inline-block">
                      <img
                        src={formData.imageUrl}
                        alt="Product preview"
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description..."
                  rows={4}
                />
              </div>
              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to discard all changes? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Continue Editing</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel}>
                        Discard Changes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
