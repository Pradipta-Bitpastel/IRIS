import { error } from "console";

export interface IInputValue{
    userName: string,
    password: string,
    rememberMeBox:string[],
    // email?:string
  }
  export type TErrorObject={
    username_text?:string,
    password_text?:string

  }
  export type TAuthPage= "authSignUp" | "authSignIn" | "authForgetPassword"
  export type TLoginApiData={
    email:string,
    password:string
  }

  export type TStatDashboardApiData={
    group_count: string;
    entity_count: string;
    message_count: string;
  }
  
 
