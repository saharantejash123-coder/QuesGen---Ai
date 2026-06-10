import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLanguage } from '../context/LanguageContext';
import { loginWithGoogleToken, saveSession } from '../services/authService';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    schoolName: '',
    phone: '',
    registrationNumber: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googlePrefilled, setGooglePrefilled] = useState(false);
  const [showLoginRedirect, setShowLoginRedirect] = useState(false);
  const navigate = useNavigate();

  // Registration is allowed without pre-login

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Map form fields to backend expected shape
    const nameParts = (formData.name || '').trim().split(/\s+/).filter(Boolean);
    const first = role === 'school' ? formData.schoolName : (nameParts[0] || '');
    const last = role === 'school' ? '' : (nameParts.slice(1).join(' ') || '');

    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: first,
      lastName: last,
      role,
    };

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backend}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem('questra_user', JSON.stringify(data.user));
        localStorage.setItem('questra_token', data.token);
        
        if (data.user.role === 'school') navigate('/school');
        else if (data.user.role === 'teacher') navigate('/teacher');
        else navigate('/student');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);

    try {
      const user = await loginWithGoogleToken(credentialResponse.credential);
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: user.firstName || '',
      }));
      setGooglePrefilled(true);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Google authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please check your credentials and try again.');
  };

  // Demo Google removed

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30">
      {/* Login Required Message */}
      {showLoginRedirect && (
        <div className="mx-auto w-full max-w-md mb-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
            <p className="text-amber-300 text-sm font-medium mb-2">Sign in first to register</p>
            <p className="text-amber-200 text-xs mb-3">Please log in to your account first to complete registration.</p>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Go to Login →
            </button>
          </div>
        </div>
      )}

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
          Create an account
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-zinc-400">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-10 mx-auto w-full max-w-md">
        <div className="bg-[#0a0a0a] py-6 sm:py-8 px-4 sm:px-10 shadow-2xl sm:rounded-2xl border border-white/8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          {/* Google sign-up button */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="dark"
              width="200"
            />
          </div>

          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs sm:text-sm font-medium leading-6">
              <span className="bg-[#0a0a0a] px-4 text-zinc-500">Or fill in manually</span>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium leading-6 text-zinc-300 mb-2">
                I am registering as a:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['student', 'teacher', 'school'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-medium capitalize transition-all border ${role === r ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {role !== 'school' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="John Doe" />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-zinc-300">
                  {role === 'school' ? 'Official Admin Email' : 'Email address'}
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => { handleInputChange(e); setGooglePrefilled(false); }}
                    className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-300">
                  Password
                </label>
                <div className="mt-2">
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium leading-6 text-zinc-300">
                  {role === 'school' ? 'Institution Name' : 'School Name'}
                </label>
                <div className="mt-2">
                  <input id="schoolName" name="schoolName" type="text" required={role === 'school'} value={formData.schoolName} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="e.g. Springfield High" />
                </div>
              </div>

              {(role === 'teacher' || role === 'school') && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-zinc-300">
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              )}

              {role === 'teacher' && (
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium leading-6 text-zinc-300">
                    Primary Subject Taught
                  </label>
                  <div className="mt-2">
                    <input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="e.g. Mathematics" />
                  </div>
                </div>
              )}

              {role === 'school' && (
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium leading-6 text-zinc-300">
                    School Registration Number / ID
                  </label>
                  <div className="mt-2">
                    <input id="registrationNumber" name="registrationNumber" type="text" required value={formData.registrationNumber} onChange={handleInputChange} className="block w-full rounded-xl border-0 bg-white/5 py-2.5 px-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm transition-all" placeholder="e.g. SCH-992381" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start mt-6">
              <div className="flex h-6 items-center">
                <input id="privacy" name="privacy" type="checkbox" required className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="privacy" className="font-medium text-zinc-400">
                  I agree to the <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</Link>.
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
