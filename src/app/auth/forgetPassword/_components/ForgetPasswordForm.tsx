"use client"

import React,{useState,useEffect} from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import iris_logo from "@/_assets/images/logo_iris.png";
import { TErrorObject,IInputForGen, TForgetPasswordApiData } from '../types/type';
import ForgetPasswordFormLeaf from '@/app/auth/forgetPassword/_components/ForgetPasswordFormLeaf'
import { validate } from '@/app/auth/_utils/validate';
import { AxiosResponse } from 'axios';
import { useCallApi } from "@/app/api/CallApi";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  TApiResponse,
  TErrorMessage,
  TToastErrorSettingData,
} from "@/types/type";
import {
  allowableServerErrors,
  authHeader,
  pageApiHeader,
  generalizedApiError,
  toastSettingData,
  regexExp400,
} from "@/constants/index";
import { timeout } from '@/utils/waitForMin';
import '@/_assets/style/style.css'


// import {sanitizeInput} from '@/utils/sanitizeInput'









const ForgetPasswordForm = () => {

const [loaderStatus,setLoaderStatus] =useState(false)

const [inputValue, setInputValue] = useState<IInputForGen>({
 email:""
});
const [isSubmit, setIsSubmit] = useState(false);
const [formError, setFormError] = useState<TErrorObject>({});


const router = useRouter();

useEffect(() => {


  if (Object.keys(formError).length === 0 && isSubmit) {
    setLoaderStatus(true);

    let cloneInputValueData:IInputForGen = { ...inputValue };
    const forgetPasswordApiData:TForgetPasswordApiData={
      email:cloneInputValueData.email
    }

    const apiRequest=async()=>{
      try{

        let res: TApiResponse = await useCallApi({
          headersInfo: authHeader,
          endpoint: "api/forgot-password",
          httpMethod: "post",
          data: forgetPasswordApiData,
        });
        console.log(res, "ress");

        // console.log(res,"responseee")
        setLoaderStatus(false);
        // res &&  res?.status=="200"?router.push("/dashboard"): res?.data=\
        if (res?.status == "200") {
          const toastSettingDataCpy: TToastErrorSettingData ={...toastSettingData,autoClose: 5000, theme: "dark"}

          toast.success(`Password has been sent to your mail successfully ! Redirecting to the Log in page...`
           ,
           toastSettingDataCpy
            
          )
          
          await timeout(5000);

      
          // setSessionStorage(session))
          router.push("/");
        } else if (regexExp400.test(res?.status)) {
          setFormError({ username_text: res?.message })
        } else {
          const errorMessage: TErrorMessage = res?.message;

          const toastErrorSettingDataCpy: TToastErrorSettingData =
            toastSettingData;
          toast.error(
            allowableServerErrors.includes(errorMessage)
              ? errorMessage
              : generalizedApiError,
            toastErrorSettingDataCpy
          );
        }


    
      }
      catch(error:unknown){
        setLoaderStatus(false)
        


        const errorMessage: TErrorMessage =
        error instanceof Error ? error.message : "";

      const toastErrorSettingDataCpy: TToastErrorSettingData =
        toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );

   




      }

    }

apiRequest();






setIsSubmit(false);
  }
}, [formError]);


const sanitizeInput = (inputVal: IInputForGen): IInputForGen => {
  let trimmedObject: IInputForGen = { ...inputVal };

  Object.keys(inputVal).forEach((key) => {
    // Use type assertion here to tell TypeScript that key is a valid index
    const value = inputVal[key as keyof IInputForGen];

    if (typeof value === "string") {
      trimmedObject[key as keyof IInputForGen] = value.trim();
    }
  });

  return trimmedObject;
};



const submitForm = (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // setChecker(true);

  let sanitizedInput=sanitizeInput(inputValue);
  setInputValue(sanitizedInput)
// let iii:IInputValue={...sanitizeInput}

 
 

  setFormError(validate({values:sanitizedInput,typeofForm:'ForgetPasswordForm'}));

  setIsSubmit(true);
};
const changeInput = (event:React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;


    setInputValue({
      ...inputValue,

      [name]: value,
    });
  }







  return (
    <>
  


  <ToastContainer/>

<ForgetPasswordFormLeaf changeInput={changeInput} submitForm={submitForm} inputValue={inputValue} setInputValue={setInputValue} formError={formError} setFormError={setFormError}  loaderStatus={loaderStatus}/>

{/* <LoginLeaf    changeInput={changeInput} submitForm={submitForm} inputValue={inputValue} setInputValue={setInputValue} formError={formError} setFormError={setFormError} setAuthPage={setAuthPage} loaderStatus={loaderStatus} /> */}

    </>
  

  )
}

export default ForgetPasswordForm