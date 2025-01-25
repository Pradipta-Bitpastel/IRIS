'use client'
import Login from './_components/Login';
import "@/_assets/style/style.css"
import '@/_assets/style/map.css'
import '@/_assets/style/leafletex.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';




const LoginEntry = () => {
  const router = useRouter();
  useEffect(() => {
    router.prefetch('/dashboard');
    router.prefetch('/search');
    router.prefetch('/alertsetting');
  }, [router]);

  return (
    <>

      <Login />
    </>
  );
};

export default LoginEntry;
