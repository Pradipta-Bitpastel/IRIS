"use client"
import React,{ useState,useEffect} from 'react'

import {IInputSearchValue,TErrorSearchObject} from '@/types/type'
// import React from 'react'
import '@/_assets/style/style.css'
import { validate } from '@/app/auth/_utils/validate';
type TProp = {
  routeToSearchPage: (arg: string) => void;
};



const DashboardForm = ({routeToSearchPage}:TProp) => {



    const [inputValue, setInputValue] = useState<IInputSearchValue>({
        searchInput:""
           
          });
         
        
          const [formError, setFormError] = useState<TErrorSearchObject>({});

const [isSubmit, setIsSubmit] = useState(false);
        
          useEffect(() => {
            // console.log(Object,"object")
            if (Object.keys(formError).length === 0 && isSubmit) {
         routeToSearchPage(inputValue.searchInput)
            }
       
            setIsSubmit(false);
          }, [formError]);
          const changeInput = (event:React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
          
          
              setInputValue({
                ...inputValue,
          
                [name]: value,
              });
            }

          const sanitizeInput = (inputVal: IInputSearchValue): IInputSearchValue => {
            let trimmedObject: IInputSearchValue = { ...inputVal };
          
            Object.keys(inputVal).forEach((key) => {
              // Use type assertion here to tell TypeScript that key is a valid index
              const value = inputVal[key as keyof IInputSearchValue];
          
              if (typeof value === "string") {
                trimmedObject[key as keyof IInputSearchValue] = value.trim();
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
          
           
           
          
            // setFormError(validate({values:sanitizedInput,typeofForm:'DashboardSearchForm'}));
            setFormError(validate(inputValue));
          
          
            setIsSubmit(true);
          };
        const validate = (values:IInputSearchValue):TErrorSearchObject => {
            const error:TErrorSearchObject = {};
          //   const user_regx = new RegExp();
          
            if (!values.searchInput) {
              error.search_text = "please give search input";

            } 
            // if (!values.password) {
            //   error.password_code = "Please provide a password";
            // } 
            console.log(error)
          
            return error;
          };
  return (
    <>
    
    
    <form className="form" onSubmit={submitForm} >
        <div className="search_inp">
          
            <input className="input" name="searchInput" type="text" placeholder="Search" id="searchInputId" onChange={changeInput} value={inputValue.searchInput} />
          
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                </path>
              </g>
            </svg>
          </div>
        </div>
      </form>
    </>
  )
}

export default DashboardForm