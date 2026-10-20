import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  CartItem,
  Category,
  Coupon,
  DigitalEntitlement,
  FulfillmentStatus,
  Order,
  PaymentMethod,
  PaymentStatus,
  Product,
  ProductReview,
  ShippingAddress,
  StoreSettings,
  UserProfile,
} from '../types/index.ts';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_COUPONS,
  DEFAULT_REVIEWS,
  DEFAULT_SETTINGS,
} from './initialData.ts';
import {
  calculateOrderSummary,
  generateOrderNumber,
  validateAndApplyCoupon,
} from '../utils/shopRules.ts';
import {
  auth,
  initAuthListener,
  signInWithGoogle,
  firebaseLogout,
  getCachedAccessToken,
} from '../services/firebase.ts';
import { translations, Translations } from '../utils/translations.ts';

export type CurrentView =
  | 'home'
  | 'shop'
  | 'category'
  | 'search'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'account'
  | 'orders'
  | 'order-detail'
  | 'digital-library'
  | 'wishlist'
  | 'about'
  | 'contact'
  | 'faq'
  | 'policy-shipping'
  | 'policy-return'
  | 'policy-privacy'
  | 'policy-terms'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-categories'
  | 'admin-orders'
  | 'admin-customers'
  | 'admin-coupons'
  | 'admin-reviews'
  | 'admin-reports'
  | 'admin-settings'
  | 'not-found';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ShopContextType {
  // Navigation & View
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Language & Currency
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  t: Translations;
  formatPrice: (amount: number) => string;
  resetToDemoData: () => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  cartCount: number;

  // Checkout & Summary
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;
  shippingAddress: ShippingAddress;
  setShippingAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
  orderSummary: ReturnType<typeof calculateOrderSummary>;

  // Orders & Entitlements
  orders: Order[];
  placeOrder: (paymentMethod: PaymentMethod, paymentDetails?: Order['paymentDetails']) => Promise<Order>;
  updateOrderStatus: (orderId: string, fulfillmentStatus: FulfillmentStatus, paymentStatus?: PaymentStatus) => void;
  digitalEntitlements: DigitalEntitlement[];
  markEntitlementDownloaded: (entitlementId: string) => void;
  markEntitlementDriveExported: (entitlementId: string, driveFileId: string) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'status'>) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'hidden') => void;

  // Auth & Profile
  user: UserProfile | null;
  isAdmin: boolean;
  googleAccessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithDemo: (role?: 'customer' | 'admin') => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_PRODUCTS = 'myshopbd_products_v1';
const STORAGE_KEY_ORDERS = 'myshopbd_orders_v1';
const STORAGE_KEY_CART = 'myshopbd_cart_v1';
const STORAGE_KEY_WISHLIST = 'myshopbd_wishlist_v1';
const STORAGE_KEY_SETTINGS = 'myshopbd_settings_v1';
const STORAGE_KEY_USER = 'myshopbd_user_v1';
const STORAGE_KEY_ENTITLEMENTS = 'myshopbd_entitlements_v1';
const STORAGE_KEY_REVIEWS = 'myshopbd_reviews_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return cached ? JSON.parse(cached) : DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_CART);
    return cached ? JSON.parse(cached) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_WISHLIST);
    return cached ? JSON.parse(cached) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_ORDERS);
    return cached ? JSON.parse(cached) : [];
  });

  const [digitalEntitlements, setDigitalEntitlements] = useState<DigitalEntitlement[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_ENTITLEMENTS);
    return cached ? JSON.parse(cached) : [];
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_REVIEWS);
    return cached ? JSON.parse(cached) : DEFAULT_REVIEWS;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_USER);
    return cached
      ? JSON.parse(cached)
      : {
          uid: 'user_nayem112',
          email: 'nayemhosan112@gmail.com',
          displayName: 'Nayem Hosan',
          phone: '+880 1711-234567',
          role: 'admin',
          savedAddresses: [
            {
              fullName: 'Nayem Hosan',
              phone: '01711234567',
              division: 'Dhaka',
              district: 'Dhaka',
              upazilaOrArea: 'Gulshan 2',
              streetAddress: 'House 14, Road 53, Gulshan-2, Dhaka',
            },
          ],
          createdAt: new Date().toISOString(),
        };
  });

  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(getCachedAccessToken());

  // Coupons
  const [coupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Address
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    if (user?.savedAddresses?.length) {
      return user.savedAddresses[0];
    }
    return {
      fullName: 'Customer Name',
      phone: '01711000000',
      division: 'Dhaka',
      district: 'Dhaka',
      upazilaOrArea: 'Dhanmondi',
      streetAddress: 'House 24, Road 7/A, Dhanmondi',
    };
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(digitalEntitlements));
  }, [digitalEntitlements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = initAuthListener(
      (fbUser, token) => {
        setGoogleAccessToken(token);
        if (fbUser) {
          setUser((prev) => ({
            uid: fbUser.uid,
            email: fbUser.email || 'customer@myshopbd.com',
            displayName: fbUser.displayName || 'Valued Customer',
            phone: fbUser.phoneNumber || prev?.phone || '',
            role: prev?.role || (fbUser.email?.includes('admin') || fbUser.email?.includes('nayem') ? 'admin' : 'customer'),
            savedAddresses: prev?.savedAddresses || [],
            createdAt: prev?.createdAt || new Date().toISOString(),
          }));
        }
      },
      () => {
        // Logged out
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithGoogle();
      setGoogleAccessToken(res.accessToken);
      showToast('Successfully signed in with Google!', 'success');
    } catch (err: any) {
      showToast(`Google Sign-in: ${err?.message || 'Could not complete sign in'}`, 'error');
    }
  };

  const loginWithDemo = (role: 'customer' | 'admin' = 'customer') => {
    const demoUser: UserProfile = {
      uid: role === 'admin' ? 'admin_demo_99' : 'cust_demo_88',
      email: role === 'admin' ? 'admin@myshopbd.com' : 'customer@myshopbd.com',
      displayName: role === 'admin' ? 'Store Administrator (Nayem)' : 'Rahim Ahmed (Dhaka)',
      phone: '+880 1819-876543',
      role,
      savedAddresses: [
        {
          fullName: role === 'admin' ? 'Nayem Hosan' : 'Rahim Ahmed',
          phone: '01819876543',
          division: 'Dhaka',
          district: 'Dhaka',
          upazilaOrArea: 'Uttara Sector 4',
          streetAddress: 'Plot 12, Road 18, Sector 4, Uttara',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    showToast(`Logged in as demo ${role}`, 'info');
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    setGoogleAccessToken(null);
    showToast('Signed out successfully.', 'info');
    setCurrentView('home');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    showToast('Profile updated successfully!', 'success');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variantId?: string) => {
    const variant = product.variants?.find((v) => v.id === variantId);
    const unitPrice = variant ? (product.salePrice ?? product.regularPrice) + variant.priceDelta : (product.salePrice ?? product.regularPrice);
    const maxStock = variant ? variant.stock : product.stock;

    if (product.type === 'physical' && maxStock <= 0) {
      showToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (product.type === 'physical' && newQty > maxStock) {
          showToast(`Cannot add more than available stock (${maxStock})`, 'error');
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId,
          name: variant ? `${product.name} - ${variant.name}` : product.name,
          image: product.images[0] || '',
          price: unitPrice,
          regularPrice: product.regularPrice,
          quantity: Math.min(quantity, maxStock || 1),
          type: product.type,
          maxStock,
          selectedAttributes: variant?.attributes,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to your cart.`, 'success');
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantId === variantId)));
    showToast('Item removed from cart.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          const clamped = item.type === 'physical' ? Math.min(quantity, item.maxStock) : quantity;
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupons
  const applyCouponCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode);
    if (!found) {
      showToast('Invalid coupon code.', 'error');
      return false;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = validateAndApplyCoupon(found, subtotal);
    if (!result.valid) {
      showToast(result.error || 'Coupon cannot be applied.', 'error');
      return false;
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${cleanCode}" applied: Saved Tk ${result.discountAmount.toLocaleString()}!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Order summary memo
  const orderSummary = useMemo(() => {
    return calculateOrderSummary(
      cart,
      appliedCoupon,
      shippingAddress,
      {
        insideDhakaFee: storeSettings.insideDhakaShippingFee,
        outsideDhakaFee: storeSettings.outsideDhakaShippingFee,
        freeShippingThreshold: storeSettings.freeShippingThreshold,
      }
    );
  }, [cart, appliedCoupon, shippingAddress, storeSettings]);

  // Place Order
  const placeOrder = async (
    paymentMethod: PaymentMethod,
    paymentDetails?: Order['paymentDetails']
  ): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();
    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: item.name,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        type: item.type,
        image: item.image,
        digitalFileId: prod?.digitalMetadata?.fileId,
      };
    });

    const isPaid = paymentMethod === 'bkash' || paymentMethod === 'nagad';
    const initialPaymentStatus: PaymentStatus = isPaid ? 'paid' : 'pending';
    const initialFulfillmentStatus: FulfillmentStatus = isPaid ? 'processing' : 'pending_payment';

    const newOrder: Order = {
      id: 'ord_' + Date.now().toString(),
      orderNumber,
      userId: user?.uid || 'guest_' + Math.random().toString(36).substring(2, 7),
      userEmail: user?.email || 'customer@myshopbd.com',
      userPhone: shippingAddress.phone,
      items: orderItems,
      subtotal: orderSummary.subtotal,
      discountAmount: orderSummary.discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee: orderSummary.shippingFee,
      totalAmount: orderSummary.totalAmount,
      currency: 'BDT',
      shippingAddress: { ...shippingAddress },
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      fulfillmentStatus: initialFulfillmentStatus,
      paymentDetails: {
        ...paymentDetails,
        paidAt: isPaid ? now : undefined,
        verifiedByServer: true,
        isTestMode: storeSettings.isPaymentTestMode,
      },
      auditLogs: [
        {
          timestamp: now,
          action: 'Order Placed',
          actor: user?.email || 'Customer',
          notes: `Created with payment method: ${paymentMethod.toUpperCase()}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Update physical inventory
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = cart.find((c) => c.productId === p.id && c.type === 'physical');
        if (orderedItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderedItem.quantity),
          };
        }
        return p;
      })
    );

    // If paid and order contains digital products, unlock Digital Entitlements
    const newEntitlements: DigitalEntitlement[] = [];
    orderItems.forEach((item) => {
      if (item.type === 'digital') {
        const prod = products.find((p) => p.id === item.productId);
        if (prod?.digitalMetadata) {
          newEntitlements.push({
            id: 'ent_' + Math.random().toString(36).substring(2, 9),
            userId: newOrder.userId,
            orderId: newOrder.id,
            productId: item.productId,
            productName: item.productName,
            fileName: prod.digitalMetadata.fileName,
            mimeType: prod.digitalMetadata.mimeType,
            downloadCount: 0,
            downloadLimit: prod.digitalMetadata.downloadLimit,
            unlockedAt: now,
            isRevoked: false,
          });
        }
      }
    });

    if (newEntitlements.length > 0) {
      setDigitalEntitlements((prev) => [...prev, ...newEntitlements]);
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setSelectedOrderId(newOrder.id);
    setCurrentView('order-success');
    showToast(`Order #${newOrder.orderNumber} successfully confirmed!`, 'success');

    return newOrder;
  };

  // Update order status (Admin tool)
  const updateOrderStatus = (
    orderId: string,
    fulfillmentStatus: FulfillmentStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const now = new Date().toISOString();
          const updated: Order = {
            ...ord,
            fulfillmentStatus,
            paymentStatus: paymentStatus || ord.paymentStatus,
            updatedAt: now,
            auditLogs: [
              ...ord.auditLogs,
              {
                timestamp: now,
                action: `Status updated to ${fulfillmentStatus}`,
                actor: user?.email || 'Admin',
              },
            ],
          };

          // If transitioning to cancelled/refunded, revoke entitlements
          if (fulfillmentStatus === 'cancelled' || fulfillmentStatus === 'refunded') {
            setDigitalEntitlements((eList) =>
              eList.map((e) => (e.orderId === orderId ? { ...e, isRevoked: true } : e))
            );
          }

          return updated;
        }
        return ord;
      })
    );
    showToast('Order status updated.', 'info');
  };

  const markEntitlementDownloaded = (entitlementId: string) => {
    setDigitalEntitlements((prev) =>
      prev.map((e) => (e.id === entitlementId ? { ...e, downloadCount: e.downloadCount + 1 } : e))
    );
  };

  const markEntitlementDriveExported = (entitlementId: string, driveFileId: string) => {
    setDigitalEntitlements((prev) =>
      prev.map((e) =>
        e.id === entitlementId ? { ...e, driveExported: true, driveFileId } : e
      )
    );
  };

  // Product CRUD (Admin)
  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" published!`, 'success');
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    showToast(`Product "${updatedProd.name}" updated!`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted.', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'status'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: 'rev_' + Date.now().toString(),
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your verified review has been published.', 'success');
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'hidden') => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    showToast(`Review marked as ${status}.`, 'info');
  };

  // Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved successfully.', 'success');
  };

  const resetToDemoData = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    setCart([]);
    setWishlist([]);
    setStoreSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_WISHLIST);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    showToast(language === 'bn' ? 'ডেমো ডেটা সফলভাবে রিস্টোর হয়েছে।' : 'Demo data restored to defaults!', 'success');
  };

  // Currency Formatter: Tk BDT with Bangla numeral support
  const formatPrice = (amount: number): string => {
    const rounded = Math.round(amount);
    if (language === 'bn') {
      return `৳ ${rounded.toLocaleString('bn-BD')}`;
    }
    return `Tk ${rounded.toLocaleString('en-US')}`;
  };

  const t = translations[language];

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductSlug,
        setSelectedProductSlug,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedOrderId,
        setSelectedOrderId,
        searchQuery,
        setSearchQuery,
        language,
        setLanguage,
        t,
        formatPrice,
        resetToDemoData,
        products,
        categories,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        shippingAddress,
        setShippingAddress,
        orderSummary,
        orders,
        placeOrder,
        updateOrderStatus,
        digitalEntitlements,
        markEntitlementDownloaded,
        markEntitlementDriveExported,
        wishlist,
        toggleWishlist,
        isInWishlist,
        reviews,
        addReview,
        moderateReview,
        user,
        isAdmin: user?.role === 'admin',
        googleAccessToken,
        loginWithGoogle,
        loginWithDemo,
        logout,
        updateProfile,
        storeSettings,
        updateStoreSettings,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
