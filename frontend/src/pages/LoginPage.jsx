import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../context/LanguageContext';
import { login, loginWithGoogleToken, saveSession } from '../services/authService';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      saveSession(user);

      const role = (user.role || '').toLowerCase();
      if (role === 'admin') navigate('/admin');
      else if (role === 'school') navigate('/school');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);

    try {
      const user = await loginWithGoogleToken(credentialResponse.credential);
      saveSession(user);

      const role = (user.role || '').toLowerCase();
      if (role === 'admin') navigate('/admin');
      else if (role === 'school') navigate('/school');
      else if (role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please check your credentials and try again.');
    setIsLoading(false);
  };

  // Demo Google removed; use real Google OAuth or backend redirect flow

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="flex flex-col justify-center items-center gap-2 mb-4 sm:mb-6 group">
          <img
            src="/logo.png"
            alt="QuesGen Logo"
            className="h-14 sm:h-16 w-14 sm:w-16 object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(0,180,255,0.5)]"
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">QuesGen</span>
        </Link>
        <h2 className="mt-2 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          {t('auth.signInToYourAccount')}
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-zinc-400">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            {t('auth.createNewAccount')}
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-10 mx-auto w-full max-w-md">
        <div className="bg-[#0a0a0a] py-6 sm:py-8 px-4 sm:px-10 shadow-2xl sm:rounded-2xl border border-white/8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium leading-6 text-zinc-300">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-white/5 py-3 sm:py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm sm:leading-6 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium leading-6 text-zinc-300">
                  Password
                </label>
                <a href="#" className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-white/5 py-3 sm:py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-white px-3 py-3 sm:py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all disabled:opacity-70 disabled:cursor-not-allowed min-h-12 sm:min-h-11"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Google sign-in */}
          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a0a] text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="dark"
                width="200"
              />
            </div>
          </div>

          <p className="mt-6 sm:mt-8 text-center text-xs text-zinc-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
