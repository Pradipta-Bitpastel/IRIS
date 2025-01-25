'use client';
import React, { useEffect } from 'react'
import '@/_assets/style/style.css';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useCallApi } from '@/app/api/CallApi';
import { authHeader } from '@/constants';
import { profile } from 'console';
import Loading from '@/app/loading';
const Profiler = dynamic(() => import('@/app/(pages)/profiler/_components/Profiler'), { ssr: false });
const page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [profilerData, setProfilerData] = React.useState<Array<any>>([]);
    const [loaderStatus, setLoaderStatus] = React.useState<boolean>(true);
    const fetchProfiler = async (payload) => {
        try {
            let payload = new FormData();
            payload.append('entity_id', params.id[0]);
            const data = await useCallApi({
                headersInfo: {
                    ...authHeader,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                endpoint: "api/entity/profiler",
                httpMethod: "post",
                data: payload,
            })
            return data
        } catch (error) {
            console.log(error);
        }
    }
    const fetchData = async () => {
        let data = await fetchProfiler(params.id[0])
        if (data?.status == '200') {
            setProfilerData(data?.data as any);
            setLoaderStatus(false);
        }
    }
    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [])
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
    // console.log(profilerData, "profilerData");

    return (
        <>
            {
                loaderStatus && (
                    <Loading />
                )
            }
            <Profiler profilerData={profilerData} />
        </ >
    )
}

export default page