import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';
import {
  FulfillmentStatus,
  PaymentStatus,
  Product,
  ProductStatus,
  ProductType,
} from '../../types/index.ts';

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
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'reviews' | 'settings'
  >('overview');

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
                fileSizeFormatted: '14.2 MB',
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

  const handleQuickShip = (orderId: string) => {
    const trackingCode = `PTH-BD-${Math.floor(100000 + Math.random() * 900000)}`;
    updateOrderStatus(orderId, 'shipped', 'paid');
    showToast(`Order dispatched via Pathao Courier! Tracking: ${trackingCode}`, 'success');
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
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
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
