import Axios,{ AxiosError } from "axios";
import { TCustomApiProp,TCustomApiPropWithURL,TApiResponse } from "@/types/type";
import { error } from "console";
import { Rethink_Sans } from "next/font/google";

export const basicFetch=async({customApiProp,URL}:TCustomApiPropWithURL): Promise<TApiResponse>=>{
  try{
    const response= await Axios.get(
      `${URL}`,
      {
        headers:customApiProp.headersInfo
      }
      
      // formData
      
    )
    return {...response.data,status:response?.status}
  }
  // catch (err: unknown) {
  //   // Handle the error more generically
  //   if (err instanceof Error) {
  //     throw new Error(err.message);
  //   } else {
  //     throw new Error('An unexpected error occurred');
  //   }
  // }
  catch(err:any){
    // console.log(err,"errr")
    // return err
    // if (err) {
    //   if(err?.status!=500) {

    //   }
    //   // throw new Error(err.message);
    // } else {
    //   throw new Error('An unexpected error occurred');
    // }
    
    // return err
    if (Axios.isAxiosError(err)) {
      return err?.response?.data

    
      // return {message:err?.response?.data,status:`${err?.response?.status}`, data:{}}

      // return {data:err?.response?.data,status:`${err?.response?.status}`}
    
      // console.log(err.code,err.message,"lolll");
    } else {
      console.log(err.code,"codeeee")
      throw new Error('An unexpected error occurred');
    }

  }
  
}
  

    
    
  


// export const basicPost=async({httpMethod,URL,headersInfo={'Content-Type':'application/json'},data}:TCustomApiProp)=>{
  export const basicPost=async({customApiProp,URL}:TCustomApiPropWithURL):Promise<TApiResponse>=>{
try{
  console.log("truyyy",customApiProp.data)
  const response=await Axios.post(
      `${URL}`,
      // JSON.stringify(customApiProp.data),
      // formData
      customApiProp.data !== undefined ?customApiProp.headersInfo["Content-Type"].includes("application/x-www-form-urlencoded")?customApiProp.data: JSON.stringify(customApiProp.data) : undefined,
     
      // customApiProp.data !== undefined ? customApiProp.data : undefined,
     
      {
        headers:customApiProp.headersInfo
      }
    )
    console.log(response,"responseeeee")

    // return  response.data
    return {...response.data,status:response?.status}

  }
  catch(err:any){
    console.log(err,"errr")
    // return err
    // if (err) {
    //   if(err?.status!=500) {

    //   }
    //   // throw new Error(err.message);
    // } else {
    //   throw new Error('An unexpected error occurred');
    // }
    
    // return err
    if (Axios.isAxiosError(err)) {
// console.log(err.response.data,"errraAa")
      return err?.response?.data
    
      // console.log(err.code,err.message,"lolll");
    } else {
      console.log(err.code,"codeeee")
      throw new Error('An unexpected error occurred');
    }

  }

}


// const {data} = await axios.post('https://httpbin.org/post', {
//   firstName: 'Fred',
//   lastName: 'Flintstone',
//   orders: [1, 2, 3]
// }, {
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// })

