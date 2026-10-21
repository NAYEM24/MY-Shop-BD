import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { NotificationToast } from './components/common/NotificationToast.tsx';
import { MobileBottomNav } from './components/common/MobileBottomNav.tsx';

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
      <main className="flex-1">{renderCurrentView()}</main>
      <Footer />
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
