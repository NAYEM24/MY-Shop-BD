import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  PhoneCall,
  LogOut,
  FolderDown,
  LayoutDashboard,
  Box,
  Truck,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import { OrderTrackerModal } from '../common/OrderTrackerModal.tsx';
import { buildWhatsAppUrl, getGeneralWhatsAppMessage } from '../../utils/whatsapp.ts';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    categories,
    products,
    user,
    isAdmin,
    logout,
    language,
    setLanguage,
    setSelectedProductSlug,
    setSelectedCategorySlug,
    formatPrice,
    storeSettings,
    t,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live search suggestions
  const liveSuggestions = React.useMemo(() => {
    if (!localSearch.trim() || localSearch.trim().length < 2) return [];
    const q = localSearch.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((tag) => tag.toLowerCase().includes(q)))
      .slice(0, 5);
  }, [localSearch, products]);

  // Close live search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setCurrentView('search');
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('category');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const selectSuggestion = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
    setSearchFocused(false);
    setLocalSearch('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        {/* 1. Announcement Bar (Compact on Mobile, Full on Desktop) */}
        <div className="bg-slate-950 text-slate-200 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 text-left truncate">
              <span className="bg-teal-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] tracking-wide uppercase flex-shrink-0">
                {t.bdDeliveryBadge}
              </span>
              <span className="text-slate-300 text-[10px] sm:text-xs truncate">
                {t.deliveryNotice}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[11px] text-slate-300 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsTrackerOpen(true)}
                className="hover:text-teal-300 font-medium flex items-center space-x-1 transition-colors text-[10px] sm:text-xs"
              >
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400" />
                <span className="hidden xs:inline">{t.trackOrder}</span>
              </button>

              {/* WhatsApp Live Support Hotline */}
              <a
                href={buildWhatsAppUrl(
                  storeSettings.whatsappNumber || '01940320627',
                  getGeneralWhatsAppMessage()
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors text-[10px] sm:text-xs"
                title="Live WhatsApp Support"
              >
                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">WhatsApp:</span>
                <span className="font-mono font-semibold">{storeSettings.whatsappNumber || '01940320627'}</span>
              </a>

              <div className="hidden md:flex items-center space-x-1 text-slate-400">
                <PhoneCall className="w-3 h-3 text-teal-400" />
                <span>{t.hotline}</span>
              </div>

              {/* Language Switcher (Desktop only in top bar; on mobile it's in main header) */}
              <div className="hidden sm:flex items-center space-x-1 border-l border-slate-700 pl-3">
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="bg-slate-800 hover:bg-slate-700 text-teal-300 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-700 transition-colors flex items-center space-x-1"
                  title="Switch Language"
                >
                  <span className="font-mono">{language === 'en' ? 'BN' : 'EN'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-2.5 text-left group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-slate-950 to-teal-900 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform border border-teal-500/30 flex-shrink-0">
              <span>BD</span>
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900">MY SHOP</span>
                <span className="font-extrabold text-base sm:text-xl text-teal-600">BD</span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium tracking-wide block -mt-1 uppercase hidden xs:block">
                Premium Bangladesh Store
              </span>
            </div>
          </button>

          {/* Desktop & Tablet Search Bar with Live Suggestions */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-lg mx-2 lg:mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={localSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchFocused(true);
                }}
                className="w-full pl-10 pr-24 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {t.searchButton}
              </button>
            </form>

            {/* Live Suggestions Dropdown */}
            {searchFocused && liveSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {language === 'bn' ? 'সরাসরি সাজেশন' : 'Quick Suggestions'}
                </div>
                {liveSuggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectSuggestion(product.slug)}
                    className="w-full px-3 py-2 text-left hover:bg-teal-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-slate-800 block truncate">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-700 ml-2 flex-shrink-0">
                      {formatPrice(product.salePrice ?? product.regularPrice)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Quick Track Mobile Trigger */}
            <button
              type="button"
              onClick={() => setIsTrackerOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-teal-600 rounded-xl"
              title={t.trackOrder}
            >
              <Truck className="w-5 h-5" />
            </button>

            {/* Language Switcher on Mobile Header */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="md:hidden text-teal-800 font-mono font-bold text-xs px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg"
            >
              {language === 'en' ? 'BN' : 'EN'}
            </button>

            {/* Wishlist Button (Desktop) */}
            <button
              type="button"
              onClick={() => setCurrentView('wishlist')}
              className="hidden md:flex relative p-2 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center space-x-1"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-800 ml-1">
                {t.cart}
              </span>
            </button>

            {/* User Account Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="User Account Menu"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                  {user ? user.displayName.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user ? user.displayName.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            Store Admin
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentView('account')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile & Addresses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView('orders')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <Box className="w-4 h-4 text-slate-400" />
                        <span>Order History</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView('digital-library')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <FolderDown className="w-4 h-4 text-slate-400" />
                        <span>My Digital Library</span>
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setCurrentView('admin-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 flex items-center space-x-2 border-t border-slate-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-teal-600" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => setCurrentView('login')}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
                      >
                        Sign In to My Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentView('register')}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        Create New Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Mobile Live Search Bar (Directly below main logo bar on mobile) */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-20 py-2 bg-slate-100 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-teal-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg"
            >
              {t.searchButton}
            </button>
          </form>
        </div>

        {/* 4. Desktop Category Navigation Menu */}
        <nav className="hidden md:block bg-slate-50/90 border-t border-slate-200/60 px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-6">
              {/* All Categories Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center space-x-1.5 text-slate-900 hover:text-teal-700 py-1 font-bold"
                >
                  <Menu className="w-4 h-4 text-teal-600" />
                  <span>{t.allCategories}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {categoryDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => navigateToCategory(cat.slug)}
                        className="w-full text-left px-4 py-2 hover:bg-teal-50 flex items-center justify-between text-xs text-slate-800 hover:text-teal-900 transition-colors"
                      >
                        <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                          {cat.productCount}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Category Links */}
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className={`hover:text-teal-700 transition-colors ${currentView === 'home' ? 'text-teal-700 font-bold' : ''}`}
              >
                {t.home}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('shop')}
                className={`hover:text-teal-700 transition-colors ${currentView === 'shop' ? 'text-teal-700 font-bold' : ''}`}
              >
                {t.shop}
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('electronics')}
                className="hover:text-teal-700 transition-colors"
              >
                {language === 'bn' ? 'স্মার্ট ইলেকট্রনিক্স' : 'Electronics'}
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('digital-products')}
                className="hover:text-teal-700 transition-colors flex items-center space-x-1"
              >
                <FolderDown className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'bn' ? 'ডিজিটাল ই-বুক' : 'Digital E-Books'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToCategory('traditional-fashion')}
                className="hover:text-teal-700 transition-colors"
              >
                {language === 'bn' ? 'ঐতিহ্যবাহী পোশাক' : 'Heritage Fashion'}
              </button>
            </div>

            <div className="flex items-center space-x-4 text-slate-500 font-normal">
              <button
                type="button"
                onClick={() => setCurrentView('digital-library')}
                className="hover:text-slate-800 transition-colors flex items-center space-x-1"
              >
                <FolderDown className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-medium">{t.digitalLibrary}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('policy-shipping')}
                className="hover:text-slate-800 transition-colors"
              >
                {language === 'bn' ? 'ডেলিভারি নিয়ম' : 'Shipping Info'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 5. Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative max-w-xs w-full bg-white h-full shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Top */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                    BD
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm">MY SHOP BD</h3>
                    <p className="text-[10px] text-teal-300">Bangladesh Store</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                  {language === 'bn' ? 'প্রধান মেন্যু' : 'Main Menu'}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-xs text-slate-800 hover:bg-teal-50 flex items-center justify-between"
                >
                  <span>{t.home}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-xs text-slate-800 hover:bg-teal-50 flex items-center justify-between"
                >
                  <span>{t.shop}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTrackerOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-xs text-teal-700 bg-teal-50/70 hover:bg-teal-100 flex items-center space-x-2"
                >
                  <Truck className="w-4 h-4 text-teal-600" />
                  <span>{t.trackOrder}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('digital-library');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-xs text-slate-800 hover:bg-teal-50 flex items-center space-x-2"
                >
                  <FolderDown className="w-4 h-4 text-sky-600" />
                  <span>{t.digitalLibrary}</span>
                </button>

                {/* Categories */}
                <div className="pt-4 border-t border-slate-100 mt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                    {t.allCategories}
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => navigateToCategory(cat.slug)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{cat.productCount}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5">
              {/* WhatsApp Live Support Button */}
              <a
                href={buildWhatsAppUrl(
                  storeSettings.whatsappNumber || '01940320627',
                  getGeneralWhatsAppMessage()
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Live: {storeSettings.whatsappNumber || '01940320627'}</span>
              </a>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Language:</span>
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="px-3 py-1 bg-teal-600 text-white font-bold rounded-lg text-xs"
                >
                  {language === 'en' ? 'Switch to Bangla (BN)' : 'Switch to English (EN)'}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                <span>+880 1711-000999 (24/7)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Order Tracking Modal */}
      <OrderTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </>
  );
};
