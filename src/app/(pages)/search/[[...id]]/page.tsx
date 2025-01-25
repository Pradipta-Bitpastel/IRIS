"use client"
import SearchLeaf from '@/app/(pages)/search/_components/SearchLeaf'
// "use server"
import { useEffect } from 'react';
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// const HeavyComponent = dynamic(() => import('@/app/(pages)/search/_components/SearchLeaf'), { ssr: false });
const page = ({ params }: { params: { id: string; type: string; msg_id?: string } }) => {

  // const authGuard = (): boolean => {
  //   const sessionData = window.localStorage.getItem('sessionCheck');
  //   if (sessionData) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }


  // }
  // useEffect(() => {

  //   const isAuthenticate = authGuard()
  //   if (!isAuthenticate) {
  //     redirect("/")
  //   }


  // })
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
  // console.log(params)
  return (
    // <HeavyComponent params={params} />
    <SearchLeaf params={params} />
  )
}

export default page