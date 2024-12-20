export type THeaders={
   'Content-Type':string ,
   'Client-Secret'?:string
}
export type THttpMethod='get' | 'post' | 'put' | 'patch' | 'delete'
export type TCustomApiProp={
    headersInfo: THeaders,
    endpoint:string,
    httpMethod: THttpMethod,

    // httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete',
    // data?:string
    data?: Record<string, any> | any

}

// export type TCustomApiPropCommon={
//   headersInfo: THeaders,
//   endpoint:string,
//   httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete',
//   // data?:string
//   data?: TLogMsgApiResponse

// }

export type TCustomApiPropWithURL={
   customApiProp:TCustomApiProp,
   URL:string 
}
export type TErrorMessage=string
export type TApiData=Record<string, any>
export type TApiResponse={
   message:string,
   status:string,
   data:TApiData,
   
}
export type TApiResponseCommon={
  message:string,
  status:string,
  data:TApiData[],
  
}
export type TToastErrorSettingData=Record<string, any>
type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

export interface RiskFactor {
   risk_factor: string;
   photo: StaticImageData;
   className: string,
   // Add other properties of the risk_factor_db items here if necessary
}


export interface IInputSearchValue{
    searchInput:string
   
    // email?:string
  }
  export type TErrorSearchObject={
    search_text?:string,
    // password_text?:string

  }
  export type TLogMsgApiResponse={

   
        id: number;
        group_id: number;
        group_name: string;
        user_id: number;
        message_text: string| null ;
        entity: TEntity |{};
        media_url: string | null; // Media URL can be a string or null
        timestamp: string| null; // ISO date string
        url: string | null; // URL can be a string or null


  }
//   export type TLogMsgApiSerializerResponse={
  
//       message_id: string;        // ID of the message
//       group_id: string;          // ID of the group
//       group_name: string;          // ID of the group

//       member_id: string; 
//       phone_number:string;
//       message_text: string;       // The text message content
//       chat_time: string;         // Timestamp for chat time (Unix timestamp)

//       url: string;       // ID of the platform (e.g., 2 for a specific platform)
//       media_url: string;         // URL for any media attached to the message
//       media_type?: string;        // Type of the media (e.g., "video_media")
//   }
  
 


//   export type TAuthPage= "authSignUp" | "authSignIn" | "authForgetPassword"
//   export type TLoginApiData={
//     email:string,
//     password:string
//   }



export type TCountry = {
   id: string;
   country_code: string;
   name: string;
   latitude: string;
   longitude: string;
 };
 
 export type TEntity = {
   id: string;
   phone_number: string;
   country: TCountry;
   profile_image_url?:string
 };
 
 export type TLogMsgApiSerializerResponse = {
   message_id: string;
   group_id: string;
   group_name: string;
   message_text: string;
   media_url: string | null;
   chat_time: string;
   entity: TEntity ;
   url: string | null;
   media_type?: string;
   risk_score:string;
   alpha2_code?:string;
   alpha3_code?:string
 };


//  export type TLogMsgApi = {
//   message_id: string;
//   group_id: string;
//   group_name: string;
//   message_text: string;
//   media_url: string | null;
//   chat_time: string;
//   entity: TEntity ;
//   url: string | null;
//   media_type?: string;
//   risk_score:string;
//   alpha2_code?:string;
//   alpha3_code?:string
// };





export type TMessageCloudData = {
    word: string;
    count: number;
    style?:string;
    type?:string,


};

export type TGroupWordCloud = {
    id: number;
    group_name: string;
    message_count: number;
    style?:string,
    type?:string,


};

export type TEntityWordCloud = {
    id: number;
    phone_number: string;
    message_count: number;
    style?:string,
    type?:string,

};

export type TWordCloudApiObject = {
    words: TMessageCloudData[];
    groups: TGroupWordCloud[];
    entities: TEntityWordCloud[];
};
export type TWordCloudObject = TMessageCloudData | TGroupWordCloud | TEntityWordCloud;

// export type TWordCloudData = TWordCloudObject[]




 
  
 
