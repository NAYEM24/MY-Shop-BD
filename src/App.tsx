import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { NotificationToast } from './components/common/NotificationToast.tsx';
import { MobileBottomNav } from './components/common/MobileBottomNav.tsx';
import { WhatsAppLiveWidget } from './components/common/WhatsAppLiveWidget.tsx';

// Pages
import { HomePage } from './components/pages/HomePage.tsx';
import { ShopPage } from './components/pages/ShopPage.tsx';
import { ProductDetailPage } from './components/pages/ProductDetailPage.tsx';
import { CartPage } from './components/pages/CartPage.tsx';
import { CheckoutPage } from './components/pages/CheckoutPage.tsx';
import { OrderSuccessPage } from './components/pages/OrderSuccessPage.tsx';
import { OrderDetailsPage } from './components/pages/OrderDetailsPage.tsx';
import { DigitalLibraryPage } from './components/pages/DigitalLibraryPage.tsx';
import { WishlistPage } from './components/pages/WishlistPage.tsx';
import { AccountPage } from './components/pages/AccountPage.tsx';
import { AuthPages } from './components/pages/AuthPages.tsx';
import { AdminDashboard } from './components/pages/AdminDashboard.tsx';
import { PolicyPages } from './components/pages/PolicyPages.tsx';
import { NotFoundPage } from './components/pages/NotFoundPage.tsx';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            সাময়িক যান্ত্রিক ত্রুটি হয়েছে (An error occurred)
          </h2>
          <p className="text-xs text-slate-500">
            দুঃখিত, পেজটি লোড করতে সমস্যা হয়েছে। দয়া করে নিচের বাটনে ক্লিক করে পুনরায় চেষ্টা করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              হোমপেজে ফিরে যান (Return Home)
            </button>
            <a
              href="https://wa.me/8801940320627?text=Assalamu%20Alaikum,%20I%20need%20support%20on%20MY%20SHOP%20BD"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center"
            >
              WhatsApp Support (01940320627)
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentView } = useShop();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;

      case 'shop':
      case 'category':
      case 'search':
        return <ShopPage />;

      case 'product-detail':
        return <ProductDetailPage />;

      case 'cart':
        return <CartPage />;

      case 'checkout':
        return <CheckoutPage />;

      case 'order-success':
        return <OrderSuccessPage />;

      case 'order-detail':
        return <OrderDetailsPage />;

      case 'digital-library':
        return <DigitalLibraryPage />;

      case 'wishlist':
        return <WishlistPage />;

      case 'account':
      case 'orders':
        return <AccountPage />;

      case 'login':
        return <AuthPages initialMode="login" />;

      case 'register':
        return <AuthPages initialMode="register" />;

      case 'forgot-password':
        return <AuthPages initialMode="forgot-password" />;

      case 'admin-login':
        return <AuthPages initialMode="admin-login" />;

      case 'admin-dashboard':
      case 'admin-products':
      case 'admin-categories':
      case 'admin-orders':
      case 'admin-customers':
      case 'admin-coupons':
      case 'admin-reviews':
      case 'admin-reports':
      case 'admin-settings':
        return <AdminDashboard />;

      case 'policy-shipping':
      case 'policy-return':
      case 'policy-privacy':
      case 'policy-terms':
      case 'faq':
      case 'about':
      case 'contact':
        return <PolicyPages pageType={currentView} />;

      case 'not-found':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <ErrorBoundary key={currentView}>{renderCurrentView()}</ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppLiveWidget />
      <MobileBottomNav />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
