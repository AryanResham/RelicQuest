"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"

import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { Separator } from "./ui/separator"
import { cn } from "../lib/utils"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  seller: z.string().min(1, "Seller name is required"),
  image: z.string().optional(),
  
  // Pricing type
  pricingType: z.enum(["fixed", "auction"]),
  
  // Fixed pricing fields
  price: z.number().min(0.01, "Price must be greater than 0").optional(),
  originalPrice: z.number().min(0, "Original price must be non-negative").optional(),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100").optional(),
  
  // Auction fields
  startingBid: z.number().min(0.01, "Starting bid must be greater than 0").optional(),
  minBidIncrement: z.number().min(0.01, "Minimum bid increment must be greater than 0").optional(),
  auctionEndTime: z.date().optional(),
  
  // Specifications
  specifications: z.record(z.string(), z.string()).optional(),
}).refine((data) => {
  // Validate fixed pricing
  if (data.pricingType === "fixed") {
    return data.price && data.price > 0
  }
  // Validate auction pricing
  if (data.pricingType === "auction") {
    return data.startingBid && data.startingBid > 0 && 
           data.minBidIncrement && data.minBidIncrement > 0 &&
           data.auctionEndTime && data.auctionEndTime > new Date()
  }
  return true
}, {
  message: "Please fill in all required fields for the selected pricing type",
  path: ["pricingType"]
})

type ProductFormData = z.infer<typeof productSchema>

const categories = [
  "Electronics",
  "Gaming",
  "Collectibles",
  "Toys & Hobbies",
  "Home & Garden",
  "Sports",
  "Books",
  "Clothing",
  "Other"
]

const conditions = [
  "New",
  "Like New",
  "Excellent",
  "Good",
  "Fair",
  "Poor"
]

interface SellerFormProps {
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
}

export function SellerForm({ onSubmit, isLoading = false }: SellerFormProps) {
  const [imagePreview, setImagePreview] = useState<string>("")
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      condition: "",
      seller: "",
      pricingType: "fixed",
      price: undefined,
      originalPrice: undefined,
      discount: 0,
      startingBid: undefined,
      minBidIncrement: 1,
      specifications: {},
    },
  })

  const pricingType = form.watch("pricingType")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        form.setValue("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      const updatedSpecs = { ...specifications, [newSpecKey]: newSpecValue }
      setSpecifications(updatedSpecs)
      form.setValue("specifications", updatedSpecs)
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key: string) => {
    const updatedSpecs = { ...specifications }
    delete updatedSpecs[key]
    setSpecifications(updatedSpecs)
    form.setValue("specifications", updatedSpecs)
  }

  const handleSubmit = (data: ProductFormData) => {
    const processedData = {
      ...data,
      specifications,
      isAuction: data.pricingType === "auction",
    }
    onSubmit(processedData)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">List Your Product</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the details below to list your product for sale
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Product Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Information</h2>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product in detail..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="seller"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name or store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Image</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-sm"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="max-w-xs h-auto rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pricing</h2>
            
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Pricing Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <label htmlFor="fixed">Fixed Price</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auction" id="auction" />
                        <label htmlFor="auction">Auction</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {pricingType === "fixed" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          max="100"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {pricingType === "auction" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startingBid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Bid ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minBidIncrement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Bid Increment ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="1.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="auctionEndTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Auction End Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When should this auction end?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Specifications */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Specifications</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Specification name (e.g., Brand)"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                />
                <Input
                  placeholder="Value (e.g., Sony)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                />
                <Button type="button" onClick={addSpecification} variant="outline">
                  Add
                </Button>
              </div>

              {Object.entries(specifications).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-muted p-3 rounded">
                      <span><strong>{key}:</strong> {value}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Listing Product..." : "List Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}