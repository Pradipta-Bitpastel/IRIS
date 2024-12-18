import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import iris_logo from "@/_assets/images/logo_iris.png";
import { IInputForGen, TErrorObject} from '../types/type';

type TProp={
  // showPassword:boolean,
  // setShowPassword:React.Dispatch<React.SetStateAction<boolean>>,
  changeInput?:(event:React.ChangeEvent<HTMLInputElement>)=>void,
  submitForm?:(event:React.FormEvent<HTMLFormElement>)=>void,
  inputValue:IInputForGen,
  setInputValue:React.Dispatch<React.SetStateAction<IInputForGen>>,
  formError:TErrorObject,
  setFormError:React.Dispatch<React.SetStateAction<TErrorObject>>,
  loaderStatus:boolean
  // setAuthPage:React.Dispatch<React.SetStateAction<TAuthPage>>
  

}

const ForgetPasswordForm = ({changeInput,submitForm,inputValue,setInputValue,formError,setFormError,loaderStatus}:TProp) => {
  return (
    <>
    
    {
loaderStatus &&

    <div id="imageParent" className="loadingParent">
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  </div>
    }
    
    <section className="login_sec">
    <div className="login_sec_bg">
      <div className="login_card">
        <div className="login_card_content">
          <div className="login_card_img text-center">
            {/* <img src="./assets/images/logo_iris.png" className="img-fluid"/> */}

            <Image
              src={iris_logo}
              alt="Iris Logo"
              className="img-fluid"
              priority
            />
          </div>
          <div className="login_card_form forgetPasswordForm">
            <div id="main-login-card" className="login_card_form_content">
              <div className="login_card_form_title">
                <h2>Reset Password</h2>
                <p>Enter your registered email to continue</p>
              </div>
              <form  onSubmit={submitForm}>
                <div className="input_username position_relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="login_input_icons"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_641_421)">
                      <path
                        d="M9 1.5C9.74168 1.5 10.4667 1.71993 11.0834 2.13199C11.7001 2.54404 12.1807 3.12971 12.4646 3.81494C12.7484 4.50016 12.8226 5.25416 12.6779 5.98159C12.5333 6.70902 12.1761 7.3772 11.6517 7.90165C11.1272 8.4261 10.459 8.78325 9.73159 8.92794C9.00416 9.07264 8.25016 8.99838 7.56494 8.71455C6.87971 8.43072 6.29404 7.95007 5.88199 7.33339C5.46993 6.7167 5.25 5.99168 5.25 5.25L5.25375 5.08725C5.29569 4.12181 5.70871 3.20983 6.40667 2.54149C7.10463 1.87316 8.03365 1.50006 9 1.5ZM10.5 10.5C11.4946 10.5 12.4484 10.8951 13.1517 11.5983C13.8549 12.3016 14.25 13.2554 14.25 14.25V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V14.25C3.75 13.2554 4.14509 12.3016 4.84835 11.5983C5.55161 10.8951 6.50544 10.5 7.5 10.5H10.5Z"
                        fill="#8E9DAD"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_641_421">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <input
                    type="text"
                    id="user-name"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={inputValue.email}
                    onChange={changeInput}
                  />

                  {Object.keys(formError).length > 0 && (
                    <div className="formError">
                      {<p>{formError.username_text} </p>}
                    </div>
                  )}
                </div>
             
                <button className="login_form_btn">
                  <span className="login_span">Submit</span>
                  <div className="progress-bar">
                    <div className="bars" data-size="100">
                      <span className="perc"></span>
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>
          </div>
          </div>
          <div className="login_shape"></div>
          </div>
          </section>
          </>

  )
}

export default ForgetPasswordForm