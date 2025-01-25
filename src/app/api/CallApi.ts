// import apiFunction from "@/lib/apiFunction";
'use server'
import { TCustomApiProp, TApiResponse } from "@/types/type";
import { basicFetch, basicPost } from "@/lib/apiFunction"

// export const useCallApi =async ({httpMethod,endpoint,headers={'Content-Type':'application/json'}}:TCustomApiProp) => {


export const useCallApi = async (customApiProp: TCustomApiProp): Promise<TApiResponse> => {
  console.log("useCallapi")
  // const URL=  `/routes?` +
  //     (process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/` : '') +
  //     (endpoint ? `${endpoint}` :'')
  let modifiedCustomApiProp = { ...customApiProp }
  // process.env.API_BASE_URL?`${process.env.API_BASE_URL}/${endpoint}`:''
  const URL: string = process.env.API_BASE_URL ? (`${process.env.API_BASE_URL}/` + `${customApiProp.endpoint}`) : ''
  // modifiedCustomApiProp={...modifiedCustomApiProp,URL:urlWithEndPoint}
  // return await basicFetch(   `/routes`)
  console.log(URL, "urlll")
  let response: TApiResponse
  try {

    if (customApiProp.httpMethod === "get") {
      response = await basicFetch({ customApiProp, URL });
      //  console.log(response,"get-method")
      return response
    }
    if (customApiProp.httpMethod === "post") {
      response = await basicPost({ customApiProp, URL });
      //  console.log(response,"post-method")


      return response
    }
    return {
      message: 'Unsupported HTTP method',
      status: '500',
      data: {},
    };
  }



  catch (err: unknown) {
    const response = {
      message: (err as Error)?.message || 'An unexpected error occurred',
      status: (err as { code?: string })?.code || '500',
      data: {}
    };
    return response;
  }
  // catch (err:any) {



  //    response={ 
  //     message: err?.message || 'An unexpected error occurred',
  //     status: err?.code ||'500',
  //     data: {}
  //   }
  //   return(response)

  //     // console.log(err,"errr")
  //     // return({
  //     //     message: "Login successfull",
  //     //     status: "200",
  //     //     data: {
  //     //         "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNzI2MTkzNywiaWF0IjoxNzI3MTc1NTM3LCJqdGkiOiI1YzA4MjVhZjk2Yjg0OGFhYjA0Mzk1NGNkODJjOTRlNCIsInVzZXJfaWQiOjJ9.AgJytJA3PH-KpHH2zTlAkg3fxC_3CBCXrTZ-A4mXIjs",
  //     //         "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3MTc1ODM3LCJpYXQiOjE3MjcxNzU1MzcsImp0aSI6IjRjODJkMWU3YWUwYTQ3MjU5MDEyN2YxNWZjYTAxNjY5IiwidXNlcl9pZCI6Mn0.Yfq7NoSskI79Yi4r3cdiA4BkhYAZJkCZRcnqHS8luM4"
  //     //     }
  //     // })
  //     // Handle the error more generically
  //     // if (err instanceof Error) {
  //     //   throw new Error(err.message);
  //     // } else {
  //     //   throw new Error('An unexpected error occurred');
  //     // }
  //   }
  // schemaValidator()
}
