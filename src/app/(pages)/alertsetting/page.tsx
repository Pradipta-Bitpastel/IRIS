'use client';
import React, { useEffect } from 'react'
import AlertSettingLeaf from './_components/AlertSettingLeaf'
import '@/_assets/style/style.css';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
// const HeavyComponent = dynamic(() => import('@/app/(pages)/alertsetting/_components/AlertSettingLeaf'), { ssr: false });
const page = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = () => {
            const sessionData = localStorage.getItem('sessionCheck');
            // const userId = sessionStorage.getItem('userId');
            return sessionData;
        };

        if (!checkAuthentication()) {
            router.replace('/'); // Redirect to the homepage if not authenticated
        }
    }, [router]); // Add router to the dependency array
    return (
        <>
            <AlertSettingLeaf />
            {/* <HeavyComponent /> */}
        </ >
    )
}

export default page