export interface Translations {
  // Navigation
  home: string;
  shop: string;
  allCategories: string;
  cart: string;
  wishlist: string;
  account: string;
  digitalLibrary: string;
  adminPanel: string;
  trackOrder: string;
  searchPlaceholder: string;
  searchButton: string;
  hotline: string;
  bdDeliveryBadge: string;
  deliveryNotice: string;
  
  // Hero & Homepage
  heroTitle1: string;
  heroHighlight: string;
  heroTitle2: string;
  heroSubtitle: string;
  shopNow: string;
  view3dModel: string;
  officialPayment: string;
  googleDriveDelivery: string;
  cashOnDelivery: string;
  curatedCollections: string;
  featuredCategories: string;
  viewAllCategories: string;
  customerFavorites: string;
  trendingBestSellers: string;
  browseCatalog: string;
  specialPromo: string;
  saveDiscount: string;
  applyCouponPromo: string;
  verifiedBuyer: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  
  // Product & Shop
  physical: string;
  digital: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  filterBy: string;
  resetFilters: string;
  allProducts: string;
  sortBy: string;
  priceLowHigh: string;
  priceHighLow: string;
  ratingHigh: string;
  newest: string;
  
  // Checkout & Cart
  secureCheckout: string;
  reviewItems: string;
  subtotal: string;
  discount: string;
  deliveryCharge: string;
  freeDelivery: string;
  total: string;
  confirmOrder: string;
  division: string;
  district: string;
  thanaArea: string;
  streetAddress: string;
  fullName: string;
  mobileNumber: string;
  paymentMethod: string;
  testModeActive: string;
  
  // Quick Actions & Admin
  quickView: string;
  stock: string;
  quickAdd: string;
  orders: string;
  customers: string;
  manageProducts: string;
  salesOverview: string;
}

export const translations: Record<'en' | 'bn', Translations> = {
  en: {
    home: 'Home',
    shop: 'Shop All',
    allCategories: 'All Categories',
    cart: 'Cart',
    wishlist: 'Wishlist',
    account: 'Account',
    digitalLibrary: 'Digital Library',
    adminPanel: 'Admin Panel',
    trackOrder: 'Track Order',
    searchPlaceholder: 'Search products, gadgets, books...',
    searchButton: 'Search',
    hotline: 'Hotline: +880 1711-000999',
    bdDeliveryBadge: 'BD Delivery',
    deliveryNotice: 'Dhaka Tk 60 • Outside Dhaka Tk 120 • Free over Tk 3,000!',
    
    heroTitle1: 'Premium Shopping,',
    heroHighlight: 'Bangladeshi Pride',
    heroTitle2: '& Smart Innovations.',
    heroSubtitle: 'Authentic products, high-grade electronics, traditional fashion, and instant digital books with secure bKash, Nagad, and Google Drive delivery.',
    shopNow: 'Shop Now',
    view3dModel: 'Inspect 3D Product',
    officialPayment: 'Official bKash / Nagad',
    googleDriveDelivery: 'Google Drive Storage',
    cashOnDelivery: 'Cash on Delivery',
    curatedCollections: 'Curated Collections',
    featuredCategories: 'Featured Categories',
    viewAllCategories: 'View All Categories',
    customerFavorites: 'Customer Favorites',
    trendingBestSellers: 'Trending & Best Sellers',
    browseCatalog: 'Browse Full Catalog',
    specialPromo: 'Special Promo Offers',
    saveDiscount: 'Save up to 20% on Orders',
    applyCouponPromo: 'Use promo code EID2026 or WELCOME150 during checkout for instant savings.',
    verifiedBuyer: 'Verified Buyer',
    reviewsTitle: 'Loved Across Bangladesh',
    reviewsSubtitle: 'Verified feedback from happy customers across all 8 divisions.',
    
    physical: 'Physical',
    digital: 'Instant Digital',
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    filterBy: 'Filter By',
    resetFilters: 'Reset',
    allProducts: 'All Products',
    sortBy: 'Sort by:',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    ratingHigh: 'Highest Rated',
    newest: 'Newest First',
    
    secureCheckout: 'Secure Checkout',
    reviewItems: 'Review Items in Order',
    subtotal: 'Subtotal',
    discount: 'Discount',
    deliveryCharge: 'Delivery Charge',
    freeDelivery: 'FREE',
    total: 'Final Total',
    confirmOrder: 'Confirm Order & Pay',
    division: 'Division (Bibhag)',
    district: 'District (Zila)',
    thanaArea: 'Upazila / Thana / Area',
    streetAddress: 'Street Address / House / Flat',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Phone Number',
    paymentMethod: 'Select Payment Method (Bangladesh)',
    testModeActive: 'Test Mode Active',
    
    quickView: 'Quick View',
    stock: 'Stock',
    quickAdd: 'Quick Add',
    orders: 'Orders',
    customers: 'Customers',
    manageProducts: 'Manage Products',
    salesOverview: 'Sales Overview',
  },
  bn: {
    home: 'হোম',
    shop: 'সব পণ্য',
    allCategories: 'সব ক্যাটাগরি',
    cart: 'ব্যাগ',
    wishlist: 'পছন্দ',
    account: 'অ্যাকাউন্ট',
    digitalLibrary: 'ডিজিটাল লাইব্রেরি',
    adminPanel: 'অ্যাডমিন প্যানেল',
    trackOrder: 'অর্ডার ট্র্যাক',
    searchPlaceholder: 'পণ্য, গ্যাজেট বা বই খুঁজুন...',
    searchButton: 'খুঁজুন',
    hotline: 'হটলাইন: +৮৮০ ১৭১১-০০০৯৯৯',
    bdDeliveryBadge: 'সারা দেশে ডেলিভারি',
    deliveryNotice: 'ঢাকা ৬০৳ • ঢাকার বাইরে ১২০৳ • ৩,০০০৳ এর বেশি অর্ডারে ফ্রি ডেলিভারি!',
    
    heroTitle1: 'সেরা শপিং,',
    heroHighlight: 'বাংলাদেশের বিশ্বস্ত প্ল্যাটফর্ম',
    heroTitle2: '& স্মার্ট সেবা।',
    heroSubtitle: 'আসল পণ্য, গ্যাজেট, ঐতিহ্যবাহী পোশাক ও ডিজিটাল বই—বিকাশ, নগদ ও ক্যাশ অন ডেলিভারিতে দ্রুত হোম ডেলিভারি।',
    shopNow: 'এখনই কেনাকাটা করুন',
    view3dModel: 'থ্রি-ডি পণ্য দেখুন',
    officialPayment: 'বিকাশ ও নগদ পেমেন্ট',
    googleDriveDelivery: 'গুগল ড্রাইভ ডেলিভারি',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি সুবিধা',
    curatedCollections: 'বিশেষ সংগ্রহ',
    featuredCategories: 'জনপ্রিয় ক্যাটাগরি',
    viewAllCategories: 'সব ক্যাটাগরি দেখুন',
    customerFavorites: 'গ্রাহকদের পছন্দের পণ্য',
    trendingBestSellers: 'সেরা বিক্রিত পণ্যসমূহ',
    browseCatalog: 'সব পণ্য দেখুন',
    specialPromo: 'বিশেষ ডিসকাউন্ট অফার',
    saveDiscount: 'অর্ডারে সর্বোচ্চ ২০% পর্যন্ত ছাড়',
    applyCouponPromo: 'চেকআউটের সময় EID2026 বা WELCOME150 কুপন কোড ব্যবহার করে তাৎক্ষণিক ছাড় পান।',
    verifiedBuyer: 'যাচাইকৃত ক্রেতা',
    reviewsTitle: 'সারা দেশের মানুষের আস্থা',
    reviewsSubtitle: 'ঢাকা, চট্টগ্রাম, সিলেট ও রাজশাহীসহ আটটি বিভাগের ক্রেতাদের বাস্তব মতামত।',
    
    physical: 'ফিজিক্যাল পণ্য',
    digital: 'ডিজিটাল ডাউনলোড',
    addToCart: 'কার্টে যোগ করুন',
    outOfStock: 'স্টক শেষ',
    inStock: 'স্টকে আছে',
    filterBy: 'ফিল্টার করুন',
    resetFilters: 'রিসেট',
    allProducts: 'সব পণ্য',
    sortBy: 'সাজান:',
    priceLowHigh: 'মূল্য: কম থেকে বেশি',
    priceHighLow: 'মূল্য: বেশি থেকে কম',
    ratingHigh: 'সর্বোচ্চ রেটিং',
    newest: 'নতুন সংযোজন',
    
    secureCheckout: 'নিরাপদ চেকআউট',
    reviewItems: 'অর্ডারের বিবরণ',
    subtotal: 'সাব-টোটাল',
    discount: 'ডিসকাউন্ট',
    deliveryCharge: 'ডেলিভারি চার্জ',
    freeDelivery: 'ফ্রি',
    total: 'সর্বমোট মূল্য',
    confirmOrder: 'অর্ডার নিশ্চিত করুন',
    division: 'বিভাগ',
    district: 'জেলা',
    thanaArea: 'উপজেলা / থানা / এলাকা',
    streetAddress: 'ঠিকানা / বাসা নং / রোড',
    fullName: 'আপনার পূর্ণ নাম',
    mobileNumber: 'মোবাইল নম্বর',
    paymentMethod: 'পেমেন্ট পদ্ধতি বেছে নিন (বাংলাদেশ)',
    testModeActive: 'টেস্ট মোড চালু',
    
    quickView: 'একনজরে দেখুন',
    stock: 'স্টক',
    quickAdd: 'কার্টে নিন',
    orders: 'অর্ডারসমূহ',
    customers: 'ক্রেতাবৃন্দ',
    manageProducts: 'পণ্য পরিচালনা',
    salesOverview: 'বিক্রয় বিবরণী',
  },
};
