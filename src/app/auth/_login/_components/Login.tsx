"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginLeaf from "./LoginLeaf";
import {
  TErrorObject,
  IInputValue,
  TAuthPage,
  TLoginApiData,
} from "../types/type";
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
import { validate } from "@/app/auth/_utils/validate";
import ForgetPasswordForm from "./ForgetPasswordForm";

import { useCallApi } from "@/app/api/CallApi";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { AxiosError, AxiosResponse } from "axios";
import "@/_assets/style/style.css";
import Axios from "axios";
import { headers } from "next/headers";
import { json } from "stream/consumers";
// import {} '@/constants/index'
import CryptoJS from "crypto-js";
import { decryptPassword, encryptPassword } from "../helpers";
const Login = () => {
  const [authPage, setAuthPage] = useState<TAuthPage>("authSignIn");

  const [showPassword, setShowPassword] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);

  const [inputValue, setInputValue] = useState<IInputValue>({
    userName: "",
    password: "",
    rememberMeBox: [],
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [formError, setFormError] = useState<TErrorObject>({});

  const router = useRouter();
  // const justifyBgLoader = (loaderStatus:boolean) => {
  //   // if (loaderStatus) {
  //   //   $("#imageParent").css("display", "block");
  //   //   $("#main-login-card").css("-webkit-filter", "brightness(40%)");
  //   // } else {
  //   //   $("#imageParent").css("display", "none");
  //   //   $("#main-login-card").css("-webkit-filter", "brightness(100%)");
  //   // }
  // };
  useEffect(() => {
    const session = getSessionStorage("session");
    if (session) {
      const sessionObject = JSON.parse(session);

      setInputValue({
        ...inputValue,
        userName: sessionObject?.userName,
        password: decryptPassword(sessionObject?.password),
        rememberMeBox: ['rememberMeOn']
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formError).length === 0 && isSubmit) {
      setLoaderStatus(true);

      let cloneInputValueData: IInputValue = { ...inputValue };

      const loginApiData: TLoginApiData = {
        // username: cloneInputValueData.userName,
        email: cloneInputValueData.userName,

        password: cloneInputValueData.password,
      };

      // console.log(l)

      const apiRequest = async () => {
        // try{
        // try{
        // const response=await Axios.post(
        //     `http://127.0.0.1:8000/api/login`,

        //     JSON.stringify(loginApiData)

        //     // formData

        //   )
        //     const response = await fetch('http://127.0.0.1:8000/api/login', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify(loginApiData),
        //     });
        //     const data = await response.json().catch(() => {
        //       console.error('Response is not valid JSON.');
        //       return null;
        //     });
        //     console.log(data,"dataa")
        //     setLoaderStatus(false)
        //     if (data) {
        //       // console.log('Success:', data);
        //       if(data.status=="200"){
        //   router.push("/dashboard");

        // } else {

        //   // Object.keys(data.data.type)
        //   setFormError({
        //     password_text:data.message
        //   })
        // }
        //       }

        // router.push("/dashboard");
        // return response

        // const data =
        //   {
        //     "username":"testuser",
        //     "password":"password"
        // }

        //  let p= await Axios.post("http://20.217.83.10/api/login", data)
        //     .then(response => {
        //       console.log('Success:', p);
        //     })
        //     .catch(error => {
        //       console.error('Error:', error);
        //     });
        //   }
        //   catch(err){
        //     console.log(err,"error")

        // return err
        // if (Axios.isAxiosError(err)) {

        //   throw new Error(err.message);
        // } else {
        //   throw new Error('An unexpected error occurred');
        // }

        console.log("inside fetchhh");

        // fetch("http://127.0.0.1:8000/api/test", {
        //   method: 'GET',
        //   // headers: {
        //   //   'Content-Type': 'application/json',
        //   //   'Client-Secret':'asdfdsgvbrggre'
        //   // },
        //   mode: 'no-cors',

        //   // body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(data => console.log('Success:', data))
        // .catch(error => console.error('Error:', error));

        // }

        try {
          // let res :AxiosResponse<apiResponse> | undefined | unknown=await useCallApi({headersInfo:authHeader,endpoint:'api/login',httpMethod:'post',data:loginApiData})
          let res: TApiResponse = await useCallApi({
            headersInfo: authHeader,
            endpoint: "api/login",
            httpMethod: "post",
            data: loginApiData,
          });

          console.log(res, "responseee")
          setLoaderStatus(false);
          // res &&  res?.status=="200"?router.push("/dashboard"): res?.data=\
          if (res?.status == "200") {
            // inputValue.rememberMeBox.length > 0 ?
            //   setSessionStorage(
            //     JSON.stringify({
            //       token: `Bearer ${res?.data?.access}`,
            //       userName: cloneInputValueData.userName,
            //       password: cloneInputValueData.password,
            //     })
            //   ):(inputValue.rememberMeBox.length ==0) ? clearSessionStorage('session'):''

            if (inputValue.rememberMeBox.length > 0) {
              setSessionStorage(
                JSON.stringify({
                  token: `Bearer ${res?.data?.access}`,
                  userName: cloneInputValueData.userName,
                  password: encryptPassword(cloneInputValueData.password),
                  // userID: encryptPassword(`${res?.data?.user_id}`),
                })
              );
              // new added Code 13.12.2024
              // window.sessionStorage.setItem('userId', JSON.stringify({ userID: `${res?.data?.user_id}` }));
            } else if (inputValue.rememberMeBox.length == 0) {
              clearSessionStorage('session');
              // clearSessionStorage('userId');
              // sessionStorage.removeItem('userId');
            }
            // window.sessionStorage.setItem('userId', JSON.stringify({ userID: `${res?.data?.user_id}` }));
            window.localStorage.setItem(`sessionCheck`, JSON.stringify({ 
              sessionCheck: `Bearer ${res?.data?.access}` ,
              userID: encryptPassword(`${res?.data?.user_id}`),
            }));

            router.push("/dashboard");
          } else if (regexExp400.test(res?.status)) {
            console.log("inside of it")

            res?.data?.type == "password"
              ? setFormError({ password_text: res?.message })
              : setFormError({ username_text: res?.message });
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

          // console.log('Success:', data);
        } catch (error: unknown) {
          setLoaderStatus(false);

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

          // console.log(error, "errorr");
          // let errorObj:TErrorObject = {};
          // const errorCode=
          // error instanceof Error && 'code' in error ? error.code : '';
          // let errorData = error.response.data.message;
          // if (!error?.code=="404" || error?.code=="504") {
          //   Object.assign(errorObj, {
          //     password_text: "The user credentials were incorrect.",
          //   });
          // }
          // if (!error?.response?.data?.success) {
          //   Object.assign(errorObj, {
          //     password: "The user credentials were incorrect.",
          //   });
          // }
          // setFormError(errorObj);
          // setFormError(errorObj);

          // const errorMessage:TErrorMessage =
          // error?error?.message || ''

          // const errorMessage: TErrorMessage =
          // error instanceof Error ? error.message : '';

          //   const errorMessage =
          //   error?.response?.data?.message || error?.message
          // toast.error(
          //   allowableServerErrors.includes(errorMessage)
          //     ? errorMessage
          //     : 'We apologize, but we were unable to process the payment using your card. Kindly reach out to your card issuer for assistance. Please take note that Amex and Discover cards are not yet supported at this time.'
          // )

          // }
        }
        // catch(error){
        //   console.log(error.message,"messa")

        //         setLoaderStatus(false)

        //         // error.response.data

        //         // Object.keys(error).forEach(()=>{

        //         // })

        //     //     console.log(error, "errorr");

        // }

        setIsSubmit(false);
      };

      apiRequest();
    }
  }, [formError]);
  const sanitizeInput = (inputVal: IInputValue): IInputValue => {
    let trimmedObject: IInputValue = { ...inputVal };

    Object.keys(inputVal).forEach((key) => {
      const value = inputVal[key as keyof IInputValue];

      // Trim the string values
      if (typeof value === "string") {
        trimmedObject[key as keyof Omit<IInputValue, 'rememberMeBox'>] = value.trim();
      }
      // Skip arrays and other types
    });

    return trimmedObject;
  };


  // const sanitizeInput = (inputVal: IInputValue): IInputValue => {
  //   let trimmedObject: IInputValue = { ...inputVal };

  //   Object.keys(inputVal).forEach((key) => {
  //     // Use type assertion here to tell TypeScript that key is a valid index
  //     const value = inputVal[key as keyof IInputValue];

  //     if (typeof value === "string") {
  //       trimmedObject[key as keyof IInputValue] = value.trim();
  //     }
  //     else if (Array.isArray(value)) {
  //      console.log("in")
  //     }
  //   });

  //   return trimmedObject;
  // };
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let sanitizedInput = sanitizeInput(inputValue);
    console.log(sanitizedInput, "sanitized input")
    setInputValue(sanitizedInput)


    setFormError(validate({ values: { ...sanitizedInput, email: sanitizedInput.userName }, typeofForm: 'LoginForm' }));

    setIsSubmit(true);
  };
  const handleClickShowPassword = (event: React.MouseEvent<HTMLElement>) => {
    setShowPassword(!showPassword);
  };

  const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name == "rememberMeBox") {
      const { value, checked } = event.target;

      console.log(checked);

      if (checked) {
        setInputValue({
          ...inputValue,
          rememberMeBox: [...inputValue.rememberMeBox, value],
        });
      } else {
        setInputValue({
          ...inputValue,

          rememberMeBox: inputValue.rememberMeBox.filter((e) => e !== value),
        });
      }
    } else {
      setInputValue({
        ...inputValue,

        [name]: value,
      });
    }
  };

  const clearInputBox = () => {
    setInputValue({
      ...inputValue,
      userName: "",
      password: "",
      rememberMeBox: []
    });
  };

  const setSessionStorage = (session: string) => {
    window.localStorage.setItem(`session`, session);
  };
  const getSessionStorage = (session: string) => {
    return window.localStorage.getItem(`${session}`);
  };
  const clearSessionStorage = (session: string) => {
    window.localStorage.removeItem(`${session}`);
  };

  return (
    <>
      <ToastContainer />
      {authPage == "authSignIn" ? (
        <LoginLeaf
          loaderStatus={loaderStatus}
          handleClickShowPassword={handleClickShowPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          changeInput={changeInput}
          submitForm={submitForm}
          inputValue={inputValue}
          setInputValue={setInputValue}
          formError={formError}
          setFormError={setFormError}
          setAuthPage={setAuthPage}
        />
      ) : authPage == "authForgetPassword" ? (
        <ForgetPasswordForm
          handleClickShowPassword={handleClickShowPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          changeInput={changeInput}
          submitForm={submitForm}
          inputValue={inputValue}
          setInputValue={setInputValue}
          formError={formError}
          setFormError={setFormError}
          setAuthPage={setAuthPage}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Login;
