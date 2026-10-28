import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Download,
  Filter,
  Search,
  Lock,
  Layers,
  Save,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  ExternalLink,
  Calendar,
  Printer,
  FileText,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import {
  FulfillmentStatus,
  PaymentStatus,
  Product,
  ProductStatus,
  ProductType,
  BannerSlide,
} from '../../types/index.ts';
import { INITIAL_DEFAULT_BANNERS } from '../../context/initialData.ts';
import { BannerSlider } from '../common/BannerSlider.tsx';
import { DailyOrdersLog } from '../admin/DailyOrdersLog.tsx';
import { printInvoicePdf, downloadInvoicePdf, downloadInvoiceHtmlFile } from '../../utils/invoiceGenerator.ts';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    categories,
    reviews,
    moderateReview,
    storeSettings,
    updateStoreSettings,
    formatPrice,
    isAdmin,
    setCurrentView,
    resetToDemoData,
    showToast,
    language,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'daily-log' | 'products' | 'orders' | 'banners' | 'reviews' | 'settings'
  >('overview');

  // Banner management state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);

  // Banner form state
  const [bTitle, setBTitle] = useState('');
  const [bTitleBn, setBTitleBn] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bSubtitleBn, setBSubtitleBn] = useState('');
  const [bBadge, setBBadge] = useState('');
  const [bBadgeBn, setBBadgeBn] = useState('');
  const [bImage, setBImage] = useState('');
  const [bButtonText, setBButtonText] = useState('Shop Now');
  const [bButtonTextBn, setBButtonTextBn] = useState('এখনই দেখুন');
  const [bLinkView, setBLinkView] = useState('category');
  const [bLinkCategory, setBLinkCategory] = useState('electronics');
  const [bOrder, setBOrder] = useState(1);
  const [bIsActive, setBIsActive] = useState(true);

  // Sample banner image presets for 1-click convenience
  const BANNER_PRESETS = [
    {
      name: 'Electronics & Audio',
      nameBn: 'স্মার্ট গ্যাজেট',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80',
      category: 'electronics',
      badge: 'Special Eid Offer',
      badgeBn: 'বিশেষ উৎসবের ছাড়',
      title: 'Next-Gen Audio & Smart Tech',
      titleBn: 'নেক্সট-জেন অডিও ও স্মার্ট গ্যাজেট',
    },
    {
      name: 'Bangladeshi Heritage',
      nameBn: 'ঐতিহ্যবাহী পোশাক',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
      category: 'heritage-fashion',
      badge: 'Bangladeshi Heritage',
      badgeBn: 'দেশীয় ঐতিহ্য',
      title: 'Authentic Jamdani & Festive Wear',
      titleBn: 'খাঁটি ঢাকাই জামদানি ও পাঞ্জাবি',
    },
    {
      name: 'Bioscience Lab Gear',
      nameBn: 'ল্যাব সরঞ্জাম',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      category: 'science-lab',
      badge: 'Science & Research',
      badgeBn: 'বিজ্ঞান ও গবেষণা',
      title: 'Precision Bioscience & Lab Gear',
      titleBn: 'উন্নত বায়োসায়েন্স ও ল্যাব সরঞ্জাম',
    },
    {
      name: 'Digital E-Books',
      nameBn: 'ডিজিটাল ই-বুক',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
      category: 'digital-products',
      badge: 'Instant Delivery',
      badgeBn: 'তাৎক্ষণিক ডেলিভারি',
      title: 'Digital E-Books & Developer Guides',
      titleBn: 'ডিজিটাল ই-বুক ও স্টাডি গাইড',
    },
  ];

  const openCreateBannerModal = () => {
    setEditingBanner(null);
    setBTitle('');
    setBTitleBn('');
    setBSubtitle('');
    setBSubtitleBn('');
    setBBadge('Special Eid Offer');
    setBBadgeBn('বিশেষ উৎসবের অফার');
    setBImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80');
    setBButtonText('Shop Collection');
    setBButtonTextBn('এখনই কিনুন');
    setBLinkView('category');
    setBLinkCategory('electronics');
    setBOrder(banners.length + 1);
    setBIsActive(true);
    setShowBannerModal(true);
  };

  const openEditBannerModal = (banner: BannerSlide) => {
    setEditingBanner(banner);
    setBTitle(banner.title);
    setBTitleBn(banner.titleBn || '');
    setBSubtitle(banner.subtitle || '');
    setBSubtitleBn(banner.subtitleBn || '');
    setBBadge(banner.badge || '');
    setBBadgeBn(banner.badgeBn || '');
    setBImage(banner.imageUrl);
    setBButtonText(banner.buttonText || 'Shop Now');
    setBButtonTextBn(banner.buttonTextBn || 'এখনই দেখুন');
    setBLinkView(banner.linkView || 'category');
    setBLinkCategory(banner.linkCategory || 'electronics');
    setBOrder(banner.order || 1);
    setBIsActive(banner.isActive);
    setShowBannerModal(true);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bImage.trim() || !bTitle.trim()) {
      showToast('Please provide both banner title and image URL', 'error');
      return;
    }

    if (editingBanner) {
      updateBanner({
        ...editingBanner,
        title: bTitle.trim(),
        titleBn: bTitleBn.trim() || undefined,
        subtitle: bSubtitle.trim() || undefined,
        subtitleBn: bSubtitleBn.trim() || undefined,
        badge: bBadge.trim() || undefined,
        badgeBn: bBadgeBn.trim() || undefined,
        imageUrl: bImage.trim(),
        buttonText: bButtonText.trim() || 'Shop Now',
        buttonTextBn: bButtonTextBn.trim() || 'এখনই দেখুন',
        linkView: bLinkView,
        linkCategory: bLinkCategory,
        order: Number(bOrder) || 1,
        isActive: bIsActive,
      });
    } else {
      addBanner({
        id: 'banner_' + Date.now().toString(),
        title: bTitle.trim(),
        titleBn: bTitleBn.trim() || undefined,
        subtitle: bSubtitle.trim() || undefined,
        subtitleBn: bSubtitleBn.trim() || undefined,
        badge: bBadge.trim() || undefined,
        badgeBn: bBadgeBn.trim() || undefined,
        imageUrl: bImage.trim(),
        buttonText: bButtonText.trim() || 'Shop Now',
        buttonTextBn: bButtonTextBn.trim() || 'এখনই দেখুন',
        linkView: bLinkView,
        linkCategory: bLinkCategory,
        order: Number(bOrder) || (banners.length + 1),
        isActive: bIsActive,
      });
    }

    setShowBannerModal(false);
  };

  const handleToggleBannerActive = (banner: BannerSlide) => {
    updateBanner({ ...banner, isActive: !banner.isActive });
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIndex];
    sorted[targetIndex] = temp;

    // Reassign orders sequentially 1, 2, 3...
    const reordered = sorted.map((b, i) => ({ ...b, order: i + 1 }));
    reorderBanners(reordered);
  };

  const handleResetBanners = () => {
    reorderBanners(INITIAL_DEFAULT_BANNERS);
    showToast('Banners reset to original defaults.', 'success');
  };

  // Search & Filter States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for creating/editing products
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('electronics');
  const [pType, setPType] = useState<ProductType>('physical');
  const [pPrice, setPPrice] = useState(1500);
  const [pSalePrice, setPSalePrice] = useState<number | undefined>(undefined);
  const [pSku, setPSku] = useState('');
  const [pStock, setPStock] = useState(25);
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pHas3D, setPHas3D] = useState(false);
  const [p3DType, setP3DType] = useState<'spectrometer' | 'earbuds' | 'smartwatch'>('spectrometer');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Guard: Admin authorization check
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Restricted</h2>
        <p className="text-xs text-slate-500">
          You must be an authorized MY SHOP BD administrator with custom security privileges to view this portal.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('admin-login')}
          className="px-5 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !orderSearchQuery ||
        o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.shippingAddress.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.userPhone.includes(orderSearchQuery) ||
        (o.paymentDetails?.transactionId && o.paymentDetails.transactionId.toLowerCase().includes(orderSearchQuery.toLowerCase()));

      const matchesStatus =
        orderStatusFilter === 'all' ||
        (orderStatusFilter === 'pending' && (o.fulfillmentStatus === 'pending_payment' || o.paymentStatus === 'pending')) ||
        (orderStatusFilter === 'paid' && o.paymentStatus === 'paid') ||
        (orderStatusFilter === 'processing' && o.fulfillmentStatus === 'processing') ||
        (orderStatusFilter === 'shipped' && o.fulfillmentStatus === 'shipped') ||
        (orderStatusFilter === 'delivered' && o.fulfillmentStatus === 'delivered');

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !productSearchQuery ||
        p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearchQuery.toLowerCase());

      const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, productSearchQuery, productCategoryFilter]);

  // Dashboard Overview Metrics
  const totalOrders = orders.length;
  const verifiedSales = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'pending_payment' || o.fulfillmentStatus === 'processing'
  ).length;
  const lowStockProducts = products.filter((p) => p.type === 'physical' && p.stock <= 5);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPCategory('electronics');
    setPType('physical');
    setPPrice(1500);
    setPSalePrice(undefined);
    setPSku('MSBD-PROD-' + Math.floor(100 + Math.random() * 900));
    setPStock(25);
    setPDescription('');
    setPImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
    setPHas3D(false);
    setP3DType('spectrometer');
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPCategory(product.category);
    setPType(product.type);
    setPPrice(product.regularPrice);
    setPSalePrice(product.salePrice);
    setPSku(product.sku);
    setPStock(product.stock);
    setPDescription(product.description);
    setPImage(product.images[0]);
    setPHas3D(!!product.has3DModel);
    setP3DType(product.model3DType || 'spectrometer');
    setShowProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const slug = pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: pName,
        category: pCategory,
        type: pType,
        regularPrice: pPrice,
        salePrice: pSalePrice || undefined,
        sku: pSku,
        stock: pType === 'physical' ? pStock : 9999,
        description: pDescription,
        images: [pImage || editingProduct.images[0]],
        has3DModel: pHas3D,
        model3DType: pHas3D ? p3DType : undefined,
        updatedAt: now,
      });
    } else {
      addProduct({
        id: 'prod_' + Date.now().toString(),
        slug,
        name: pName,
        description: pDescription,
        type: pType,
        category: pCategory,
        subcategory: 'General',
        regularPrice: pPrice,
        salePrice: pSalePrice || undefined,
        sku: pSku,
        stock: pType === 'physical' ? pStock : 9999,
        status: 'active',
        featured: true,
        images: [pImage],
        rating: 5.0,
        reviewCount: 0,
        tags: [pCategory, pType, 'new'],
        has3DModel: pHas3D,
        model3DType: pHas3D ? p3DType : undefined,
        digitalMetadata:
          pType === 'digital'
            ? {
                fileId: 'file_' + Date.now().toString(),
                fileName: `${pName}.pdf`,
                fileSizeBytes: 14889779,
                mimeType: 'application/pdf',
                version: '1.0.0',
                downloadLimit: 5,
                storagePath: `protected/digital/${slug}.pdf`,
              }
            : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    setShowProductModal(false);
  };

  // Quick 1-click status actions
  const handleQuickMarkPaid = (orderId: string) => {
    updateOrderStatus(orderId, 'processing', 'paid');
    showToast('Order marked as PAID and moved to Processing.', 'success');
  };

  const handleQuickShip = (orderId: string, carrierName: 'Pathao Courier' | 'Steadfast Courier' = 'Pathao Courier') => {
    const isSteadfast = carrierName === 'Steadfast Courier';
    const trackingCode = isSteadfast
      ? `ST-${Math.floor(1000000 + Math.random() * 9000000)}BD`
      : `PTH-BD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    updateOrderStatus(orderId, 'shipped', 'paid', {
      carrier: carrierName,
      trackingNumber: trackingCode,
      shippedAt: now,
      estimatedDelivery: '2-3 Business Days across BD',
    });
    showToast(`Order dispatched via ${carrierName}! Tracking: ${trackingCode}`, 'success');
  };

  const handleQuickDeliver = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered', 'paid');
    showToast('Order marked as successfully DELIVERED!', 'success');
  };

  const handleQuickCancel = (orderId: string) => {
    if (confirm('Cancel this order?')) {
      updateOrderStatus(orderId, 'cancelled');
      showToast('Order cancelled.', 'info');
    }
  };

  // Quick stock adjuster
  const handleStockAdjust = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct({ ...product, stock: newStock });
    showToast(`Stock for "${product.name}" updated to ${newStock}`, 'info');
  };

  // Toggle Test Mode
  const handleToggleTestMode = () => {
    const updated = !storeSettings.isPaymentTestMode;
    updateStoreSettings({ isPaymentTestMode: updated });
    setSettingsForm((prev) => ({ ...prev, isPaymentTestMode: updated }));
    showToast(
      updated
        ? 'bKash/Nagad Test Mode ACTIVATED (Simulated transactions allowed)'
        : 'LIVE Payment Mode ACTIVATED (Real merchant API verification required)',
      'info'
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(settingsForm);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order Number,Date,Customer,Email,Phone,Total (BDT),Payment Method,Payment Status,Fulfillment Status\n'];
    const rows = orders.map(
      (o) =>
        `"${o.orderNumber}","${new Date(o.createdAt).toLocaleDateString()}","${o.shippingAddress.fullName}","${o.userEmail}","${o.userPhone}",${o.totalAmount},"${o.paymentMethod}","${o.paymentStatus}","${o.fulfillmentStatus}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MY_SHOP_BD_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Orders report downloaded as CSV!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Top Admin Banner with Quick Switchers */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-slate-800 shadow-md">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Store Administrator Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">MY SHOP BD Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fulfillment, 1-click order updates, inventory controls, and payment test settings.
          </p>
        </div>

        {/* Quick Top Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Test Mode Switcher */}
          <button
            type="button"
            onClick={handleToggleTestMode}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
              storeSettings.isPaymentTestMode
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Toggle between Test Mode and Live Mode"
          >
            {storeSettings.isPaymentTestMode ? (
              <ToggleRight className="w-4 h-4 text-amber-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-emerald-400" />
            )}
            <span>{storeSettings.isPaymentTestMode ? 'Test Mode: ON' : 'Live Mode: ON'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Restore default products, categories and sample orders?')) {
                resetToDemoData();
              }
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
            title="Restore fresh demo catalog and orders"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Add Banner Button */}
          <button
            type="button"
            onClick={openCreateBannerModal}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 border border-slate-700 transition-all"
            title="Add a new promotional banner slide"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Banner</span>
          </button>

          {/* Add Product Button */}
          <button
            type="button"
            onClick={openAddProductModal}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportOrdersCSV}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs (Scrollable on Mobile) */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold text-slate-600 no-scrollbar">
        {[
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          {
            key: 'daily-log',
            label: language === 'bn' ? `দৈনিক অর্ডার লগ (${orders.length})` : `Daily Orders Log (${orders.length})`,
            icon: Calendar,
          },
          { key: 'orders', label: `All Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'banners', label: `Banners / ব্যানার (${banners.length})`, icon: ImageIcon },
          { key: 'products', label: `Products (${products.length})`, icon: Package },
          { key: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { key: 'settings', label: 'Settings & Shipping', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 bg-white border border-slate-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-1 block">
                {totalOrders}
              </span>
              <span className="text-[11px] text-teal-600 font-semibold block pt-1">
                Across Bangladesh
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Sales
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                {formatPrice(verifiedSales)}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block pt-1">
                Paid Orders
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Action
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono mt-1 block">
                {pendingOrders}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold block pt-1">
                Fulfillment queue
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Low Stock Alerts
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono mt-1 block">
                {lowStockProducts.length}
              </span>
              <span className="text-[11px] text-rose-600 font-semibold block pt-1">
                Restock required
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs text-teal-600 font-bold hover:underline"
              >
                View & Manage All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5">Order Code</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Customer & Location</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-medium text-slate-800">
                        {ord.shippingAddress.fullName} ({ord.shippingAddress.division})
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900">{formatPrice(ord.totalAmount)}</td>
                      <td className="py-3 uppercase text-[10px] font-bold text-slate-600">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full capitalize font-semibold">
                          {ord.fulfillmentStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1.5: DAILY ORDERS LOG & BREAKDOWN (কোন দিন কত অর্ডার আসলো) */}
      {activeTab === 'daily-log' && (
        <DailyOrdersLog
          orders={orders}
          formatPrice={formatPrice}
          storeSettings={storeSettings}
          showToast={showToast}
          language={language}
        />
      )}

      {/* TAB 2: ORDERS MANAGEMENT WITH 1-CLICK FAST ACTIONS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Order Management & Dispatch ({filteredOrders.length})
              </h3>
              <p className="text-xs text-slate-400">
                1-click status actions to verify bKash/Nagad payments and dispatch packages.
              </p>
            </div>

            {/* Order Search Box */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name, phone, order#..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'paid', label: 'Paid' },
              { id: 'processing', label: 'Processing' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setOrderStatusFilter(f.id)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-colors ${
                  orderStatusFilter === f.id
                    ? 'bg-teal-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders List with 1-Click Action Buttons */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs hover:border-teal-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-sm text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Payment: {ord.paymentStatus}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full capitalize">
                          {ord.fulfillmentStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Customer: <strong>{ord.shippingAddress.fullName}</strong> • Phone:{' '}
                        <strong>{ord.userPhone}</strong> • {ord.shippingAddress.streetAddress},{' '}
                        {ord.shippingAddress.district}, {ord.shippingAddress.division}
                      </p>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="font-mono font-extrabold text-base text-slate-900">
                        {formatPrice(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        {ord.paymentMethod} • {ord.items.length} item(s)
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex flex-wrap gap-2 py-1">
                    {ord.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] text-slate-700 font-medium"
                      >
                        {item.productName} × {item.quantity} ({formatPrice(item.totalPrice)})
                      </span>
                    ))}
                  </div>

                    {/* 1-Click Fast Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/50">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500">Quick Actions:</span>

                        {/* 1-Click PDF Invoice Direct Download */}
                        <button
                          type="button"
                          onClick={async () => {
                            showToast(
                              language === 'bn'
                                ? `${ord.orderNumber} এর জন্য PDF ডাউনলোড হচ্ছে...`
                                : `Downloading PDF invoice for ${ord.orderNumber}...`,
                              'info'
                            );
                            try {
                              const ok = await downloadInvoicePdf(ord, storeSettings);
                              if (ok) {
                                showToast(
                                  language === 'bn'
                                    ? `${ord.orderNumber} এর PDF ইনভয়েস ডাউনলোড সফল!`
                                    : `PDF invoice for ${ord.orderNumber} downloaded!`,
                                  'success'
                                );
                              } else {
                                showToast(
                                  language === 'bn'
                                    ? `${ord.orderNumber} এর ইনভয়েস ফাইল ডাউনলোড সম্পন্ন!`
                                    : `Invoice file downloaded!`,
                                  'success'
                                );
                              }
                            } catch (err) {
                              console.error('PDF download error:', err);
                              printInvoicePdf(ord, storeSettings);
                            }
                          }}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
                          title="Download PDF Invoice"
                        >
                          <Download className="w-3 h-3" />
                          <span>{language === 'bn' ? 'পিডিএফ ডাউনলোড' : 'PDF Download'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            printInvoicePdf(ord, storeSettings);
                          }}
                          className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px]"
                          title="Print Invoice"
                        >
                          <Printer className="w-3 h-3" />
                        </button>

                        {ord.paymentStatus !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => handleQuickMarkPaid(ord.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark Paid</span>
                          </button>
                        )}

                        {ord.fulfillmentStatus !== 'shipped' && ord.fulfillmentStatus !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => handleQuickShip(ord.id)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Ship (Pathao)</span>
                          </button>
                        )}

                        {ord.fulfillmentStatus !== 'delivered' && (
                          <button
                            type="button"
                            onClick={() => handleQuickDeliver(ord.id)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                          >
                            <Package className="w-3 h-3" />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        {ord.fulfillmentStatus !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleQuickCancel(ord.id)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 rounded-lg text-[11px] font-bold"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleString('en-GB')}
                        </span>
                      </div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT WITH FAST STOCK ADJUSTMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Products & Inventory Catalog ({filteredProducts.length})
              </h3>
              <p className="text-xs text-slate-400">
                Adjust physical stock directly with + / - buttons or click edit.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative w-48 sm:w-60">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="button"
                onClick={openAddProductModal}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Price (BDT)</th>
                  <th className="py-2.5">Stock Management</th>
                  <th className="py-2.5">3D Model</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 flex items-center space-x-2.5">
                      <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-50" />
                      <div>
                        <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{p.category} • SKU: {p.sku}</span>
                      </div>
                    </td>
                    <td className="py-3 capitalize text-[11px] font-semibold">
                      <span className={p.type === 'digital' ? 'text-sky-700' : 'text-slate-700'}>
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {formatPrice(p.salePrice ?? p.regularPrice)}
                    </td>
                    <td className="py-3">
                      {p.type === 'physical' ? (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(p, -1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-xs flex items-center justify-center text-slate-800"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold text-xs min-w-[24px] text-center ${
                              p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(p, 1)}
                            className="w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded font-bold text-xs flex items-center justify-center text-slate-800"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">Instant Digital</span>
                      )}
                    </td>
                    <td className="py-3">
                      {p.has3DModel ? (
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          3D Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditProductModal(p)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Customer Reviews Moderation ({reviews.length})
          </h3>

          <div className="space-y-3 text-xs">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-amber-500 font-bold">{rev.rating} ★</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center space-x-2">
                  {rev.status === 'approved' ? (
                    <button
                      type="button"
                      onClick={() => moderateReview(rev.id, 'hidden')}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-[10px] font-bold"
                    >
                      Hide Review
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => moderateReview(rev.id, 'approved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STORE & PAYMENT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6 text-xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Store, Delivery & Payment Gateway Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.storeName}
                onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hotline Phone</label>
              <input
                type="text"
                value={settingsForm.contactPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                <span>WhatsApp Live Support Number</span>
                <span className="text-[10px] text-emerald-600 font-bold">Active: 01940320627</span>
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber || '01940320627'}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-emerald-200 focus:border-emerald-500 rounded-xl font-mono text-emerald-950 font-semibold"
                placeholder="01940320627"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Inside Dhaka Shipping Fee (BDT)</label>
              <input
                type="number"
                value={settingsForm.insideDhakaShippingFee}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, insideDhakaShippingFee: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Outside Dhaka Shipping Fee (BDT)</label>
              <input
                type="number"
                value={settingsForm.outsideDhakaShippingFee}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, outsideDhakaShippingFee: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Free Shipping Threshold (BDT)</label>
              <input
                type="number"
                value={settingsForm.freeShippingThreshold}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, freeShippingThreshold: parseInt(e.target.value) || 0 })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">bKash Merchant Wallet Number</label>
              <input
                type="text"
                value={settingsForm.bkashMerchantNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, bkashMerchantNumber: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nagad Merchant Wallet Number</label>
              <input
                type="text"
                value={settingsForm.nagadMerchantNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, nagadMerchantNumber: e.target.value })
                }
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="testModeCheck"
                checked={settingsForm.isPaymentTestMode}
                onChange={(e) => setSettingsForm({ ...settingsForm, isPaymentTestMode: e.target.checked })}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="testModeCheck" className="font-semibold text-slate-800 cursor-pointer">
                Enable Payment Test Mode (Allow simulated bKash/Nagad transactions)
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: BANNERS SLIDER MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Top Banner Control Header */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {language === 'bn' ? 'হোমপেজ ব্যানার স্লাইডার' : 'Homepage Hero Banners'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {language === 'bn'
                  ? 'হোমপেজে যে ব্যানারগুলো ঘুরে ঘুরে ছবি প্রদর্শন করবে, তা এখান থেকে সহজে যোগ, এডিট বা অন/অফ করতে পারেন। আপনি যা দিবেন সাথে সাথে হোমপেজে শো করবে।'
                  : 'Manage the sliding visual promotional banners rotating on your homepage. Add new images, edit titles, reorder sequence, and link them to categories.'}
              </p>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                type="button"
                onClick={handleResetBanners}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                title="Reset to default banner set"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ডিফল্ট ব্যানার' : 'Reset Defaults'}</span>
              </button>

              <button
                type="button"
                onClick={openCreateBannerModal}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-teal-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ব্যানার যোগ করুন' : 'Add New Banner'}</span>
              </button>
            </div>
          </div>

          {/* Banner Cards List */}
          <div className="space-y-3.5">
            {[...banners]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((banner, index, arr) => {
                const categoryObj = categories.find((c) => c.slug === banner.linkCategory);

                return (
                  <div
                    key={banner.id}
                    className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      banner.isActive
                        ? 'border-slate-200 hover:border-teal-400 shadow-xs'
                        : 'border-slate-200/60 bg-slate-50/50 opacity-70'
                    }`}
                  >
                    {/* Left: Thumbnail & Badges */}
                    <div className="flex items-start sm:items-center space-x-4 w-full md:w-auto">
                      {/* Thumbnail with sequence order */}
                      <div className="relative w-28 sm:w-36 h-18 sm:h-22 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute top-1 left-1 bg-slate-950/80 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          #{banner.order || index + 1}
                        </div>
                        {banner.badge && (
                          <div className="absolute bottom-1 left-1 right-1 bg-teal-500/90 text-slate-950 font-bold text-[9px] px-1 py-0.5 rounded truncate text-center">
                            {banner.badge}
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                            {banner.title}
                          </h4>
                          {banner.titleBn && (
                            <span className="text-xs text-slate-500 font-medium">
                              ({banner.titleBn})
                            </span>
                          )}
                        </div>

                        {banner.subtitle && (
                          <p className="text-xs text-slate-600 line-clamp-2 max-w-xl mb-2">
                            {banner.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          {/* Target Category */}
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                            <span>
                              {categoryObj ? categoryObj.name : banner.linkCategory || 'All Products'}
                            </span>
                          </span>

                          {/* Button text */}
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold text-[10px]">
                            CTA: {banner.buttonText || 'Shop Now'}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center space-x-1 ${
                              banner.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                banner.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                              }`}
                            />
                            <span>
                              {banner.isActive
                                ? language === 'bn'
                                  ? 'সক্রিয় (Active)'
                                  : 'Active'
                                : language === 'bn'
                                ? 'বন্ধ (Paused)'
                                : 'Paused'}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Toggle, Reorder, Edit, Delete) */}
                    <div className="flex items-center space-x-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                      {/* Active Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleBannerActive(banner)}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 border transition-colors ${
                          banner.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={banner.isActive ? 'Deactivate banner' : 'Activate banner'}
                      >
                        {banner.isActive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="hidden sm:inline">
                          {banner.isActive ? 'Live' : 'Off'}
                        </span>
                      </button>

                      {/* Reorder Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveBanner(index, 'up')}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Reorder Down */}
                      <button
                        type="button"
                        disabled={index === arr.length - 1}
                        onClick={() => handleMoveBanner(index, 'down')}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditBannerModal(banner)}
                        className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition-colors font-bold text-xs flex items-center space-x-1"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (banners.length <= 1) {
                            showToast('You must keep at least one banner in the slider', 'error');
                            return;
                          }
                          deleteBanner(banner.id);
                        }}
                        className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Live Mobile/Desktop Store Preview */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">
                  {language === 'bn' ? 'লাইভ প্রিভিউ (হোমপেজে যেমন দেখাবে)' : 'Live Storefront Slider Preview'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1"
              >
                <span>{language === 'bn' ? 'হোমপেজে যান' : 'Go to Homepage'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700">
              <BannerSlider />
            </div>
          </div>
        </div>
      )}

      {/* Banner Add / Edit Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <form
            onSubmit={handleBannerSubmit}
            className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingBanner
                    ? (language === 'bn' ? 'ব্যানার এডিট করুন' : 'Edit Banner Slide')
                    : (language === 'bn' ? 'নতুন ব্যানার যোগ করুন' : 'Add New Banner Slide')}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'ছবি ও তথ্য দিন, সাথে সাথে হোমপেজে যুক্ত হবে।'
                    : 'Set custom photo URL, headline, subtitle and target link.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Inspiration Presets */}
            <div className="bg-teal-50/60 p-3 rounded-2xl border border-teal-100 space-y-1.5">
              <span className="text-[11px] font-bold text-teal-800 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? '১-ক্লিকে প্রি-সেট ছবি ও টপিক বাছুন:' : 'Quick Presets (1-Click Fill):'}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setBTitle(preset.title);
                      setBTitleBn(preset.titleBn);
                      setBBadge(preset.badge);
                      setBBadgeBn(preset.badgeBn);
                      setBImage(preset.url);
                      setBLinkCategory(preset.category);
                      setBLinkView('category');
                      showToast(`Preset "${preset.name}" loaded!`, 'info');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-teal-200 font-semibold text-[10px] transition-colors"
                  >
                    {language === 'bn' ? preset.nameBn : preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Image URL & Live Preview */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Image URL / ছবির লিংক <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={bImage}
                  onChange={(e) => setBImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-teal-500 outline-none"
                />

                {/* Preview Thumbnail */}
                {bImage && (
                  <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={bImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 text-teal-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Image Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Title EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Banner Title (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                    placeholder="Next-Gen Audio & Smart Tech"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    ব্যানার শিরোনাম (বাংলা - ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={bTitleBn}
                    onChange={(e) => setBTitleBn(e.target.value)}
                    placeholder="নেক্সট-জেন অডিও ও স্মার্ট গ্যাজেট"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Subtitle EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Subtitle / Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={bSubtitle}
                    onChange={(e) => setBSubtitle(e.target.value)}
                    placeholder="Up to 35% OFF on premium headphones and accessories..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    সাবটাইটেল / বিবরণ (বাংলা - ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    value={bSubtitleBn}
                    onChange={(e) => setBSubtitleBn(e.target.value)}
                    placeholder="অ্যাক্টিভ নয়েজ ক্যান্সেলিং ইয়ারবাডস ও স্মার্ট গ্যাজেটে বিশেষ অফার..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Badge & Target Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={bBadge}
                    onChange={(e) => setBBadge(e.target.value)}
                    placeholder="Special Offer"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Target Category / পেজ</label>
                  <select
                    value={bLinkCategory}
                    onChange={(e) => setBLinkCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Display Order (ক্রম)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bOrder}
                    onChange={(e) => setBOrder(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Button Text & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Button Text (EN)</label>
                  <input
                    type="text"
                    value={bButtonText}
                    onChange={(e) => setBButtonText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">বাটন টেক্সট (বাংলা)</label>
                  <input
                    type="text"
                    value={bButtonTextBn}
                    onChange={(e) => setBButtonTextBn(e.target.value)}
                    placeholder="এখনই দেখুন"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4 sm:pt-6">
                  <input
                    type="checkbox"
                    id="bannerActiveCheck"
                    checked={bIsActive}
                    onChange={(e) => setBIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="bannerActiveCheck" className="font-bold text-slate-800 cursor-pointer">
                    সক্রিয় ব্যানার (Active)
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl shadow-md shadow-teal-600/20 active:scale-95 transition-all"
              >
                {editingBanner
                  ? (language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')
                  : (language === 'bn' ? 'ব্যানার সংরক্ষণ করুন' : 'Add Banner')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleProductSubmit}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-slate-900 border-b pb-2">
              {editingProduct ? 'Edit Product' : 'Add New Product to MY SHOP BD'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="e.g. Apex Precision UV-Vis Spectrometer"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={pCategory}
                  onChange={(e) => setPCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Product Type</label>
                <select
                  value={pType}
                  onChange={(e) => setPType(e.target.value as ProductType)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="physical">Physical Product</option>
                  <option value="digital">Digital Product (Downloadable PDF)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Regular Price (BDT)</label>
                <input
                  type="number"
                  required
                  value={pPrice}
                  onChange={(e) => setPPrice(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Sale Price (BDT, Optional)</label>
                <input
                  type="number"
                  value={pSalePrice || ''}
                  onChange={(e) => setPSalePrice(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                  placeholder="Leave empty for regular price"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={pSku}
                  onChange={(e) => setPSku(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  disabled={pType === 'digital'}
                  value={pType === 'digital' ? 9999 : pStock}
                  onChange={(e) => setPStock(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono disabled:opacity-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  placeholder="Detailed product specifications..."
                />
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has3DCheck"
                    checked={pHas3D}
                    onChange={(e) => setPHas3D(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="has3DCheck" className="font-semibold text-slate-800 cursor-pointer">
                    Enable Three.js 3D Interactive Model Inspection
                  </label>
                </div>

                {pHas3D && (
                  <div>
                    <label className="font-semibold block mb-1">3D Composite Model Template</label>
                    <select
                      value={p3DType}
                      onChange={(e) => setP3DType(e.target.value as any)}
                      className="w-full p-2 bg-white border rounded-xl font-medium"
                    >
                      <option value="spectrometer">Apex UV-Vis Spectrometer (Lab Equipment)</option>
                      <option value="earbuds">SoundPulse ANC Wireless Earbuds (Audio Gadget)</option>
                      <option value="smartwatch">Apex Horizon AMOLED Smartwatch (Wearable)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
