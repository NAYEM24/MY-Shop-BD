import React from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  FolderDown,
  Layers,
  Heart,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { ProductViewer3D } from '../3d/ProductViewer3D.tsx';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    formatPrice,
    addToCart,
    setCurrentView,
    setSelectedProductSlug,
    setSelectedCategorySlug,
    toggleWishlist,
    isInWishlist,
    reviews,
    applyCouponCode,
    showToast,
    language,
    t,
  } = useShop();

  const [copiedCoupon, setCopiedCoupon] = React.useState<string | null>(null);

  const featuredProducts = products.filter((p) => p.featured && p.status === 'active');
  const digitalProducts = products.filter((p) => p.type === 'digital' && p.status === 'active');
  const physicalProducts = products.filter((p) => p.type === 'physical' && p.status === 'active');

  const openProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
  };

  const openCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('category');
  };

  const handleApplyCoupon = (code: string) => {
    applyCouponCode(code);
    setCopiedCoupon(code);
    showToast(
      language === 'bn'
        ? `কুপন কোড "${code}" প্রয়োগ করা হয়েছে!`
        : `Coupon "${code}" applied to your order!`,
      'success'
    );
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section (Responsive Mobile & Desktop) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'bn' ? 'বিশ্বস্ত বাংলাদেশি ই-কমার্স' : 'Trusted Bangladeshi Shopping'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitle1}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-emerald-300">
                {t.heroHighlight}
              </span>{' '}
              {t.heroTitle2}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
              {t.heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('shop')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.shopNow}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategorySlug('electronics');
                  setCurrentView('category');
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>{language === 'bn' ? 'সেরা অফার ও পণ্যসমূহ' : 'Trending Collections'}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{t.officialPayment}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{t.cashOnDelivery}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>{language === 'bn' ? 'সহজ রিটার্ন গ্যারান্টি' : '7-Day Return Guarantee'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Product Interactive Preview */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="bg-slate-900/90 rounded-3xl p-2 border border-slate-800 shadow-2xl">
              <ProductViewer3D
                productType="spectrometer"
                title={language === 'bn' ? 'অ্যাপেক্স ল্যাব স্পেকট্রোমিটার (থ্রি-ডি ভিউ)' : 'Apex Lab Spectrophotometer (3D)'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories (Mobile horizontal pill scroll / Desktop grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              {t.curatedCollections}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-0.5">
              {t.featuredCategories}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>{t.viewAllCategories}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid (2 cols on mobile, 5 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="group text-left p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {cat.productCount}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                  {language === 'bn' ? cat.nameBn : cat.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  {language === 'bn' ? `${cat.productCount} টি পণ্য` : `${cat.productCount} items`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Promo Coupons Banner with 1-Click Apply */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-3xl p-5 sm:p-7 border border-teal-800/60 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 bg-teal-500/20 text-teal-300 px-3 py-0.5 rounded-full text-xs font-semibold">
                <Tag className="w-3 h-3" />
                <span>{t.specialPromo}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold">
                {t.saveDiscount}
              </h3>
              <p className="text-xs text-slate-300 max-w-lg">
                {t.applyCouponPromo}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleApplyCoupon('EID2026')}
                className="bg-slate-800/95 hover:bg-slate-800 border border-teal-500/50 hover:border-teal-400 px-4 py-2 rounded-xl text-center transition-all group active:scale-95 text-left"
              >
                <span className="text-[10px] text-slate-300 block font-medium">
                  {language === 'bn' ? '১৫% ছাড় (ন্যূনতম ২,০০০৳)' : '15% Off (Min Tk 2,000)'}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-teal-300 flex items-center space-x-1">
                  <span>EID2026</span>
                  {copiedCoupon === 'EID2026' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300" />
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyCoupon('WELCOME150')}
                className="bg-slate-800/95 hover:bg-slate-800 border border-sky-500/50 hover:border-sky-400 px-4 py-2 rounded-xl text-center transition-all group active:scale-95 text-left"
              >
                <span className="text-[10px] text-slate-300 block font-medium">
                  {language === 'bn' ? 'ফ্ল্যাট ১৫০৳ ছাড় (ন্যূনতম ১,০০০৳)' : 'Flat Tk 150 Off (Min Tk 1,000)'}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-sky-300 flex items-center space-x-1">
                  <span>WELCOME150</span>
                  {copiedCoupon === 'WELCOME150' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending & Best-Selling Products (Compact Responsive Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
              {t.customerFavorites}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-0.5">
              {t.trendingBestSellers}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="flex items-center space-x-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>{t.browseCatalog}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => {
            const hasSale = product.salePrice && product.salePrice < product.regularPrice;
            const price = product.salePrice ?? product.regularPrice;
            const inWishlist = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/70 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Product Image & Badges */}
                <div
                  className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                  onClick={() => openProduct(product.slug)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        product.type === 'digital'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-900/90 text-white'
                      }`}
                    >
                      {product.type === 'digital' ? t.digital : t.physical}
                    </span>

                    {product.has3DModel && (
                      <span className="bg-teal-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5">
                        <Layers className="w-2.5 h-2.5" />
                        <span>3D</span>
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full shadow-md transition-all ${
                      inWishlist
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-[11px] mb-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                      <span className="text-slate-400">({product.reviewCount})</span>
                    </div>

                    <h3
                      onClick={() => openProduct(product.slug)}
                      className="font-bold text-xs sm:text-sm text-slate-900 hover:text-teal-700 transition-colors line-clamp-2 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">
                        {formatPrice(price)}
                      </span>
                      {hasSale && (
                        <span className="text-[10px] text-slate-400 line-through font-mono block">
                          {formatPrice(product.regularPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="p-2 sm:p-2.5 bg-slate-900 hover:bg-teal-600 text-white rounded-xl transition-colors active:scale-95 shadow-xs"
                      title={t.addToCart}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Clean Digital Products Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center space-x-1 bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-0.5 rounded-full">
              <FolderDown className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'তাৎক্ষণিক ডিজিটাল ডাউনলোড' : 'Instant Digital Downloads'}</span>
            </span>

            <h2 className="text-xl sm:text-3xl font-extrabold text-white">
              {language === 'bn'
                ? 'ই-বুক, স্টাডি গাইড ও ডিজিটাল প্রকাশনা'
                : 'Digital E-Books, Revision Bundles & Research Tools'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'কোনো ডেলিভারি অপেক্ষার প্রয়োজন নেই! অর্ডার নিশ্চিত হতেই সরাসরি ডাউনলোড করুন অথবা ১-ক্লিকে নিজের গুগল ড্রাইভে সেভ করুন।'
                : 'Zero waiting time! Download verified PDF guides directly from your Digital Library or save them automatically to your Google Drive.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategorySlug('digital-products');
                  setCurrentView('category');
                }}
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md"
              >
                <span>{language === 'bn' ? 'সব ডিজিটাল পণ্য দেখুন' : 'Browse All Digital Products'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('digital-library')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs border border-slate-700 transition-colors"
              >
                {t.digitalLibrary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
            {t.reviewsSubtitle}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-0.5">
            {t.reviewsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-500 mb-2.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{rev.userName}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                {rev.verifiedPurchase && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.verifiedBuyer}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
