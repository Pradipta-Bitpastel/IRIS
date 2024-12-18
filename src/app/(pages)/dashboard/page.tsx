
"use client"
// "use server"
import { useEffect } from 'react';
import '@/_assets/style/style.css';
import Dashboard from '../dashboard/_components/Dashboard';
import { authGuard } from '@/context/AuthContext';
import { redirect } from 'next/navigation'



const page = () => {
    // const { isAuthenticated, setIsAuthenticated } = useAuth();

    // const router = useRouter();
const authGuard=():boolean=>{
        const sessionData = window.localStorage.getItem('sessionCheck');
        const userId = window.sessionStorage.getItem('userId');
        if (sessionData && userId) {
          return true
        }
        else {
          return false
        }
      
      
      }

      useEffect(()=>{

        const isAuthenticate=authGuard()
        if(!isAuthenticate){
            redirect("/")
        }


    })





    return (
        <>
            {/* <div className="dashboard-page d-flex justify-content-center align-items-center">
                <h1 className='text-center fw-bold white-come'>Coming Soon</h1>
                <div className="loading">
                    <span className="loading__dot"></span>
                    <span className="loading__dot"></span>
                    <span className="loading__dot"></span>
                </div>
            </div> */}
            <Dashboard/>
        </>
    )

}

export default page
