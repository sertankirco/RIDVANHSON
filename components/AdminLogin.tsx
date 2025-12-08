import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo password
    if (password === 'admin123') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Yönetici Girişi</h2>
          <p className="text-slate-500 text-sm mt-2">Devam etmek için lütfen şifrenizi girin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                Hatalı şifre. (İpucu: admin123)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Giriş Yap <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-slate-500 text-sm hover:text-slate-800 transition-colors"
          >
            Siteye Geri Dön
          </button>
        </form>
      </div>
    </div>
  );
};