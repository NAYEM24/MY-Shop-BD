import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext.tsx';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-2xl shadow-xl border text-xs transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : toast.type === 'error'
              ? 'bg-rose-950 text-white border-rose-600/60'
              : 'bg-slate-900 text-white border-sky-500/50'
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          </div>

          <div className="flex-1 font-medium leading-relaxed">{toast.message}</div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
