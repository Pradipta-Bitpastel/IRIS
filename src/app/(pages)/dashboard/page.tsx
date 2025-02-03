
"use client"
// "use server"
import { useEffect } from 'react';
import '@/_assets/style/style.css';
import Dashboard from '../dashboard/_components/Dashboard';
import { authGuard } from '@/context/AuthContext';
import { redirect, useRouter } from 'next/navigation'

import dynamic from 'next/dynamic';

// const HeavyComponent = dynamic(() => import('@/app/(pages)/dashboard/_components/Dashboard'), { ssr: false });

const page = () => {
    // const { isAuthenticated, setIsAuthenticated } = useAuth();

    const router = useRouter();
    useEffect(() => {
        const checkAuthentication = () => {
            if (typeof window !== 'undefined') {
                const sessionData = localStorage.getItem('sessionCheck');
                // const userId = sessionStorage.getItem('userId');
                return sessionData;
            }
            return false;
        };

        if (!checkAuthentication()) {
            router.replace('/'); // Redirect if not authenticated
        }
    }, [router]); // Ensure the router is included in the dependency array





    return (
        <>
            <Dashboard />
        </>
    )

}

export default page
