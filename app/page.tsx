'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, signInWithGoogle, error, setError, user, loading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async ()=>{
      try{
        const user = await checkAuth();
        if(user){
          router.push('/admin');
        }
      }catch(err){
        console.log('checkUser Error:', err);
      }
    }
    checkUser();
  }, [user]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // Show nothing while checking auth
  if (loading) {
    return null;
  }

  return (
    <div className="max-h-screen bg-white flex justify-center items-center">
      <div className="w-full max-w-[1728px] h-full relative flex flex-col lg:flex-row">
        {/* Left side - Login Form */}
        <div className="flex w-full flex-1">
          <div className='flex flex-col justify-around w-[75%] m-auto'>
            <img
              className="w-[120px] h-auto lg:w-[169px]"
              alt="L space logo"
              src="https://c.animaapp.com/majiz5gqWthSjn/img/l-space-logo-removebg-preview-1.png"
            />

            <div className="flex flex-col items-start gap-3 w-full">
              <h1 className="text-4xl lg:text-[55px] font-bold text-[#212121] leading-tight">
                Welcome Back!
              </h1>
              <p className="text-xl lg:text-2xl font-semibold text-[#9a9a9a]">
                Log in to access the dashboard
              </p>
            </div>

            <div className="flex flex-col justify-around">
              <form onSubmit={handleEmailLogin} className="flex flex-col w-full gap-8">
                <div className="flex flex-col w-full gap-6">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-semibold text-secondarytext text-base">
                      Email
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-accentsfor-borders-secondary-background rounded-lg bg-inputColor">
                      <img
                        className="w-6 h-4"
                        alt="Email icon"
                        src="https://c.animaapp.com/majiz5gqWthSjn/img/vector-1.svg"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-transparent text-lg text-[#9b9b9b] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <label className="font-semibold text-secondary text-base">
                      Password
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-accentsfor-borders-secondary-background rounded-lg">
                      <img
                        className="w-6 h-6"
                        alt="Password icon"
                        src="https://c.animaapp.com/majiz5gqWthSjn/img/vector.svg"
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-transparent text-lg text-[#9b9b9b] outline-none"
                      />
                      <img
                        className="w-6 h-4 cursor-pointer"
                        alt="Show password"
                        src="https://c.animaapp.com/majiz5gqWthSjn/img/vector-2.svg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-right text-primary text-xl font-bold"
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary rounded-lg text-white text-2xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Login
                </button>
              </form>

              <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-px bg-[#9b9b9b]"></div>
                <span className="text-2xl text-[#9b9b9b]">Or</span>
                <div className="flex-1 h-px bg-[#9b9b9b]"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-4 w-full p-4 bg-accentsfor-borders-secondary-background rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  className="w-9 h-9"
                  alt="Google icon"
                  src="https://c.animaapp.com/majiz5gqWthSjn/img/image-17.png"
                />
                <span className="text-2xl font-semibold text-secondary">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1">
          <img
            className="w-full max-h-[100vh] object-cover"
            alt="Login illustration"
            src="https://c.animaapp.com/majiz5gqWthSjn/img/mask-group.png"
          />
        </div>
      </div>
    </div>
  );
}
