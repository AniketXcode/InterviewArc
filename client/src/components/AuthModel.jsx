import React, { lazy, Suspense } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";

const Auth = lazy(() => import('../pages/Auth'));

function AuthModel({onClose}) {
    const {userData} = useSelector((state)=>state.user)

    useEffect(()=>{
        if(userData){
            onClose()
        }

    },[userData , onClose])

  return (
    <div className='fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
        <div className='relative w-full max-w-md'>
            <button onClick={onClose} className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl'>
             <FaTimes size={18}/>
            </button>
            <Suspense fallback={<div className='rounded-3xl bg-white p-6 text-center text-sm text-slate-500'>Loading...</div>}>
              <Auth isModel={true}/>
            </Suspense>


        </div>

      
    </div>
  )
}

export default AuthModel
