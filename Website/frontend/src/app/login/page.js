'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('ridelytics_token', data.token);
        if (data.user) {
          localStorage.setItem('ridelytics_user', JSON.stringify(data.user));
        }
        router.push('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-soft-white cinematic-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-cyan/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-teal/10 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      {/* Logo */}
      <div className="mb-10 text-center animate-fade-in-down z-10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Ridelytics" width={200} height={54} className="h-12 w-auto mx-auto mb-4" />
        </Link>
        <p className="text-brand-slate font-medium">System Access Portal</p>
      </div>

      {/* Login Card */}
      <div className="glass-panel w-full max-w-md p-8 animate-slide-up z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-semantic-negative/10 border border-semantic-negative/20 text-semantic-negative px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="form-label">System Identifier (Email)</label>
              <input
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@ridelytics.com"
              />
            </div>
            <div>
              <label className="form-label">Security Key (Password)</label>
              <input
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Authenticating...' : 'Engage System'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-light flex flex-col gap-3">
          <p className="text-xs text-center text-brand-slate font-medium uppercase tracking-wider">Demo Access</p>
          <button 
            onClick={() => setFormData({ email: 'admin@ridelytics.com', password: 'Admin123' })}
            className="w-full py-2.5 rounded-xl border border-brand-light bg-brand-light/30 text-brand-teal text-sm font-semibold hover:bg-brand-light/70 transition-colors"
          >
            Load Administrator Credentials
          </button>
        </div>
      </div>

      <div className="mt-8 text-center animate-fade-in z-10">
        <Link href="/" className="text-brand-slate hover:text-brand-teal text-sm font-medium transition-colors flex items-center justify-center gap-2">
          ← Return to Nexus
        </Link>
      </div>
    </div>
  );
}
