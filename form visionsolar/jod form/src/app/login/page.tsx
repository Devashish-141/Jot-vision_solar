'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      // Bypassing Supabase auth for local testing
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center brand-gradient relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-3xl" />

        {/* Floating sun rays */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-white/10 rounded-full"
            style={{
              height: `${60 + i * 20}px`,
              left: `${10 + i * 16}%`,
              top: `${15 + (i % 3) * 25}%`,
              transform: `rotate(${-30 + i * 12}deg)`,
              animation: `fadeIn ${1.5 + i * 0.3}s ease-out forwards`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo & Brand */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center mb-2">
              <Image
                src="/images/logo.svg"
                alt="VisionSolar"
                width={220}
                height={55}
                priority
              />
            </div>
            <p className="text-dark-gray text-sm">
              Sign in to your Form Builder account
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
              <Zap className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium text-charcoal">
                Email Address
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@visionsolar.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-off-white border-light-gray focus:border-vision-green focus:ring-vision-green/20"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium text-charcoal">
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-off-white border-light-gray focus:border-vision-green focus:ring-vision-green/20 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mid-gray hover:text-dark-gray transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-light-gray data-[state=checked]:bg-vision-green data-[state=checked]:border-vision-green"
                />
                <label htmlFor="remember-me" className="text-sm text-dark-gray cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-vision-green hover:text-green-dark font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-solar-orange hover:bg-orange-light text-white font-semibold text-base shadow-lg shadow-solar-orange/25 transition-all duration-200 hover:shadow-xl hover:shadow-solar-orange/30 disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-mid-gray">
              © {new Date().getFullYear()} VisionSolar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
