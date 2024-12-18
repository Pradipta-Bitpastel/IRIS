"use client"
import SearchLeaf from '@/app/(pages)/search/_components/SearchLeaf'
// "use server"
import { useEffect } from 'react';
import { redirect } from 'next/navigation'

const page = ({ params }: { params: {id: string; type:string } }) => {

  const authGuard=():boolean=>{
    const sessionData = window.localStorage.getItem('sessionCheck');
    if (sessionData) {
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
console.log(params)
  return (
   <SearchLeaf params={params}/>
  )
}

export default page