import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot-password' | 'admin-login';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login' }) => {
  const {
    loginWithGoogle,
    loginWithDemo,
    setCurrentView,
    showToast,
    user,
  } = useShop();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'admin-login'>(
    initialMode
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'admin-login') {
      // Admin verification
      if (
        (email.includes('admin') || email.includes('nayem')) &&
        (password === 'admin123' || password === 'myshopbd2026' || adminSecretKey === 'BD2026')
      ) {
        loginWithDemo('admin');
        showToast('Authorized Administrator access granted.', 'success');
        setCurrentView('admin-dashboard');
      } else {
        showToast('Invalid administrator credentials or secret key.', 'error');
      }
      setIsSubmitting(false);
      return;
    }

    if (mode === 'forgot-password') {
      showToast(`Password reset link sent to ${email}`, 'success');
      setMode('login');
      setIsSubmitting(false);
      return;
    }

    // Customer login / register
    loginWithDemo('customer');
    showToast(
      mode === 'register' ? 'Account created successfully!' : 'Signed in successfully!',
      'success'
    );
    setCurrentView('account');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
            BD
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {mode === 'login'
              ? 'Customer Sign In'
              : mode === 'register'
              ? 'Create New Account'
              : mode === 'admin-login'
              ? 'Admin Portal Access'
              : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'admin-login'
              ? 'Restricted to authorized MY SHOP BD store personnel.'
              : 'Access your Bangladesh order history and Google Drive digital library.'}
          </p>
        </div>

        {/* Official Google Sign-In Button (Mandated by Workspace integration) */}
        {mode !== 'admin-login' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-semibold">
                Or with Email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {mode === 'admin-login' ? 'Admin Email' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder={mode === 'admin-login' ? 'admin@myshopbd.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-[11px] text-teal-600 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {mode === 'admin-login' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Security Key (Default: <code>BD2026</code>)
              </label>
              <input
                type="password"
                placeholder="BD2026"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            {mode === 'login'
              ? 'Sign In to MY SHOP BD'
              : mode === 'register'
              ? 'Complete Registration'
              : mode === 'admin-login'
              ? 'Verify Administrator Access'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Demo Fast Logins for instant evaluation */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <span className="text-[11px] text-slate-400 block text-center font-medium">
            Demo Evaluation Shortcuts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginWithDemo('customer')}
              className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-semibold text-center"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => {
                loginWithDemo('admin');
                setCurrentView('admin-dashboard');
              }}
              className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-semibold text-center"
            >
              Demo Admin (Nayem)
            </button>
          </div>
        </div>

        {/* Toggle Mode Footer */}
        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-teal-700 font-bold hover:underline"
              >
                Register Here
              </button>
            </p>
          ) : mode === 'register' ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-teal-700 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-teal-700 font-semibold hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
