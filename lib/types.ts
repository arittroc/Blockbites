export type SpiceLevel = "mild" | "medium" | "hot";

export interface Meal {
  id: string;
  name: string;
  description: string;
  /** Price per portion in INR. */
  price: number;
  image: string;
  emoji: string;
  category: string;
  chefId: string;
  chefName: string;
  chefRating: number;
  distanceKm: number;
  prepMinutes: number;
  portionLabel: string;
  portionsLeft: number;
  totalPortions: number;
  tags: string[];
  veg: boolean;
  spice: SpiceLevel;
}

export interface Chef {
  id: string;
  name: string;
  initials: string;
  rating: number;
  distanceKm: number;
  speciality: string;
}

export interface CartLine {
  lineId: string;
  mealId: string;
  name: string;
  chefName: string;
  image: string;
  emoji: string;
  price: number;
  quantity: number;
  portionsLeft: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  area: string;
  distanceKm: number;
  instructions?: string;
}

export type PaymentMethodId = "upi" | "card" | "wallet" | "cod";

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
  badge?: string;
  /** Cash on delivery skips the payment intent entirely. */
  requiresIntent: boolean;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  method: PaymentMethodId;
  status: "requires_confirmation" | "succeeded";
}

export interface Bill {
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  gst: number;
  tip: number;
  discount: number;
  total: number;
  /** Rupees still needed for free delivery (0 when already free). */
  freeDeliveryGap: number;
}

export interface Rider {
  name: string;
  initials: string;
  rating: number;
  deliveries: number;
  vehicle: string;
  phone: string;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "cooking"
  | "picked_up"
  | "arriving"
  | "delivered";

export interface OrderLine {
  mealId: string;
  name: string;
  chefName: string;
  image: string;
  emoji: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  placedAt: number;
  lines: OrderLine[];
  bill: Bill;
  address: Address;
  paymentMethod: PaymentMethodId;
  rider: Rider;
  /** Confirmation promise shown at checkout, in minutes. */
  etaMinutes: number;
  rated?: number;
}

export interface PromoCode {
  code: string;
  label: string;
  /** Either a flat rupee amount or a percentage, never both. */
  flat?: number;
  percent?: number;
  maxDiscount?: number;
  minOrder: number;
}

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  phone: string;
  initials: string;
}

/** Shaped like a Supabase session so the mock can be swapped for the real one. */
export interface AuthSession {
  accessToken: string;
  expiresAt: number;
  user: AuthUser;
}

export type CategoryId = "all" | "thali" | "veg" | "dinner" | "snacks";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}
