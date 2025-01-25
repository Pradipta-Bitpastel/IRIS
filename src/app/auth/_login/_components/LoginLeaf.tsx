// "use client";
import React from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import iris_logo from "@/_assets/images/logo_iris.png";
import { credentialDb } from "@/_assets/datasets/db";
// import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
// import ClickAwayListener from "@mui/material/ClickAwayListener";
import eyeOnIcon from "@/_assets/images/view-on.svg";
import eyeOffIcon from "@/_assets/images/view-off.svg";
import { IInputValue, TErrorObject, TAuthPage } from '../types/type';
import Link from 'next/link';

type TProp = {
  loaderStatus: boolean,
  handleClickShowPassword?: (event: React.MouseEvent<HTMLElement>) => void,
  showPassword: boolean,
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>,
  changeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  submitForm?: (event: React.FormEvent<HTMLFormElement>) => void,
  inputValue: IInputValue,
  setInputValue: React.Dispatch<React.SetStateAction<IInputValue>>,
  formError: TErrorObject,
  setFormError: React.Dispatch<React.SetStateAction<TErrorObject>>,
  setAuthPage: React.Dispatch<React.SetStateAction<TAuthPage>>


}






const LoginLeaf = ({ handleClickShowPassword, showPassword, setShowPassword, changeInput, submitForm, inputValue, setInputValue, formError, setFormError, setAuthPage, loaderStatus }: TProp) => {
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
              <div className="login_card_form">
                <div id="main-login-card" className="login_card_form_content">
                  <div className="login_card_form_title">
                    <h2>Log in to your account</h2>
                    <p>Enter your email or username and password to log in</p>
                  </div>
                  <form onSubmit={submitForm}>
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
                        name="userName"
                        className="form-control"
                        placeholder="Email"
                        value={inputValue.userName}
                        onChange={changeInput}
                      />

                      {Object.keys(formError).length > 0 && (
                        <div className="formError">
                          {<p>{formError.username_text} </p>}
                        </div>
                      )}
                    </div>
                    <div className="input_password">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="login_input_icons"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M4.5 16.5C4.0875 16.5 3.73425 16.353 3.44025 16.059C3.14625 15.765 2.9995 15.412 3 15V7.5C3 7.0875 3.147 6.73425 3.441 6.44025C3.735 6.14625 4.088 5.9995 4.5 6H5.25V4.5C5.25 3.4625 5.61575 2.578 6.34725 1.8465C7.07875 1.115 7.963 0.749501 9 0.750001C10.0375 0.750001 10.922 1.11575 11.6535 1.84725C12.385 2.57875 12.7505 3.463 12.75 4.5V6H13.5C13.9125 6 14.2658 6.147 14.5598 6.441C14.8538 6.735 15.0005 7.088 15 7.5V15C15 15.4125 14.853 15.7657 14.559 16.0597C14.265 16.3538 13.912 16.5005 13.5 16.5H4.5ZM9 12.75C9.4125 12.75 9.76575 12.603 10.0598 12.309C10.3538 12.015 10.5005 11.662 10.5 11.25C10.5 10.8375 10.353 10.4843 10.059 10.1903C9.765 9.89625 9.412 9.7495 9 9.75C8.5875 9.75 8.23425 9.897 7.94025 10.191C7.64625 10.485 7.4995 10.838 7.5 11.25C7.5 11.6625 7.647 12.0158 7.941 12.3098C8.235 12.6038 8.588 12.7505 9 12.75ZM6.75 6H11.25V4.5C11.25 3.875 11.0313 3.34375 10.5938 2.90625C10.1563 2.46875 9.625 2.25 9 2.25C8.375 2.25 7.84375 2.46875 7.40625 2.90625C6.96875 3.34375 6.75 3.875 6.75 4.5V6Z"
                          fill="#8E9DAD"
                        />
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password-code"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={inputValue.password}
                        onChange={changeInput}
                      />
                      {/* <svg xmlns="http://www.w3.org/2000/svg" className="preview_icon" width="16" height="16" viewBox="0 0 16 16"
                                    fill="none">
                                    <path
                                        d="M15.4569 7.7975C15.435 7.74813 14.9056 6.57375 13.7287 5.39687C12.1606 3.82875 10.18 3 7.99999 3C5.81999 3 3.83937 3.82875 2.27124 5.39687C1.09437 6.57375 0.562494 7.75 0.543119 7.7975C0.51469 7.86144 0.5 7.93064 0.5 8.00062C0.5 8.0706 0.51469 8.1398 0.543119 8.20375C0.564994 8.25312 1.09437 9.42688 2.27124 10.6038C3.83937 12.1713 5.81999 13 7.99999 13C10.18 13 12.1606 12.1713 13.7287 10.6038C14.9056 9.42688 15.435 8.25312 15.4569 8.20375C15.4853 8.1398 15.5 8.0706 15.5 8.00062C15.5 7.93064 15.4853 7.86144 15.4569 7.7975ZM7.99999 10.5C7.50554 10.5 7.02219 10.3534 6.61107 10.0787C6.19995 9.80397 5.87951 9.41352 5.6903 8.95671C5.50108 8.49989 5.45157 7.99723 5.54803 7.51227C5.64449 7.02732 5.8826 6.58186 6.23223 6.23223C6.58186 5.8826 7.02732 5.6445 7.51227 5.54804C7.99722 5.45157 8.49989 5.50108 8.9567 5.6903C9.41352 5.87952 9.80396 6.19995 10.0787 6.61107C10.3534 7.0222 10.5 7.50555 10.5 8C10.5 8.66304 10.2366 9.29893 9.76776 9.76777C9.29892 10.2366 8.66304 10.5 7.99999 10.5Z"
                                        fill="#8E9DAD" />
                                </svg> */}
                      {showPassword ? (
                        <Image
                          src={eyeOnIcon}
                          alt="eyeOpenIcon"
                          onClick={handleClickShowPassword}
                          className="preview_icon"
                        />
                      ) : (
                        <Image
                          src={eyeOffIcon}
                          alt="eyeCloseIcon"
                          onClick={handleClickShowPassword}
                          className="preview_icon"
                        />
                      )}

                      {Object.keys(formError).length > 0 && (
                        <div className="formError">
                          {<p>{formError.password_text} </p>}
                        </div>
                      )}
                    </div>
                    <div className="form_checkbox">

                      <div className="form-check">
                        <input
                          className="form-check-input"

                          name="rememberMeBox"
                          type="checkbox"
                          checked={(inputValue.rememberMeBox.find(
                            (arr) => (arr == "rememberMeOn")
                          )) ? true : false}
                          value="rememberMeOn"
                          onChange={changeInput}
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Remember me
                        </label>
                      </div>


                      {/* </div> */}
                      {/* <div className="forget_pass">
                                    <a href="" onClick={(e)=>{alert }}>Forgot password?</a>
                                </div> */}
                      <div className="forget_pass">
                        {/* <ClickAwayListener onClickAway={handleTooltipClose}> */}

                        {/* <Button onClick={handleTooltipOpen}>Click</Button> */}

                        {/* <a  onClick={(event)=>setAuthPage("authForgetPassword")}>
                            Forgot password?
                          </a> */}
                        <Link href="/auth/forgetPassword">
                          Forgot password?
                        </Link>

                        {/* </ClickAwayListener> */}
                      </div>
                    </div>
                    <button className="login_form_btn">
                      <span className="login_span">Login</span>
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

export default LoginLeaf