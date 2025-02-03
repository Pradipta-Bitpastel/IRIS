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
    const [noData, setNoData] = React.useState<boolean>(false);
    const fetchProfiler = async () => {
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
        let data = await fetchProfiler()
        if (data?.status == '200') {
            setProfilerData(data?.data as any);
            setLoaderStatus(false);
        } else {
            setLoaderStatus(false);
            setNoData(true);
        }
    }
    useEffect(() => {
        fetchData();
    }, [params])
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
    console.log(profilerData, "profilerData");

    return (
        <>
            {
                loaderStatus && (
                    <Loading />
                )
            }
            {
                noData ? (
                    <div className='no-data-found profilerPage'>
                        <p className='text-white'> No data found</p>

                    </div>
                )
                    : (
                        <>
                            <Profiler profilerData={profilerData && profilerData} />
                        </>
                    )
            }
        </ >
    )
}

export default page