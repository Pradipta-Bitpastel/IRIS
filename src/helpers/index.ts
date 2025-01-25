import { risk_factor_db } from "@/constants/index";
import { randomIntGenerator } from "@/utils/commonFunctions";

import {
  RiskFactor,
  TLogMsgApiResponse,
  TLogMsgApiSerializerResponse,
  TApiData,
  TWordCloudObject,
  TEntityWordCloud,
  TMessageCloudData,
  TGroupWordCloud
} from "@/types/type";

// Define the RiskFactor type

// Updated riskFactorCalc function
export const riskFactorCalc = (risk_score_def: string): RiskFactor => {
if(!risk_score_def || typeof(risk_score_def)=="undefined"){
  risk_score_def="20%"
}
if(typeof(risk_score_def)=="number"){
  risk_score_def=''+risk_score_def+'%'
}

  let risk_fact_obj: RiskFactor;

  // Convert the string risk score to a number
  const risk_score = +risk_score_def.split("%")[0];

  // Find the corresponding risk factor object based on the risk_score
  if (risk_score < 30) {
    risk_fact_obj = {
      ...risk_factor_db.filter(
        (risk_scor_obj) => risk_scor_obj.risk_factor === "<30"
      )[0],
    };
  } else if (risk_score < 70) {
    risk_fact_obj = {
      ...risk_factor_db.filter(
        (risk_scor_obj) => risk_scor_obj.risk_factor === "<70"
      )[0],
    };
  } else {
    risk_fact_obj = {
      ...risk_factor_db.filter(
        (risk_scor_obj) => risk_scor_obj.risk_factor === "<100"
      )[0],
    };
  }

  return risk_fact_obj;
};

// USING FORMDATA

// export const generatingOffsetAndLimitForApi=(limit:number,offset:number):FormData=>{
//     const formData = new FormData()
//     if (limit) {
//       formData.append('limit', `${limit}`);
//   }

//   if (offset) {
//       formData.append('offset', `${offset}`);
//   }

// return formData

//   }

// USING PARAM

export const generatingOffsetAndLimitForApi = (
  limit: number,
  offset: number
): URLSearchParams => {
  const params = new URLSearchParams();

  if (limit) {
    params.append("limit", `${limit}`);
  }

  if (offset) {
    params.append("offset", `${offset}`);
  }

  return params;
};

export const serializeLogMsgApiResponse = (
  apiResponse: Record<string, any>
): TLogMsgApiSerializerResponse[] => {
  let serializedArr = apiResponse.map((item: Record<string, any>) => {
    const randomNumber = randomIntGenerator(5, 99);

    const messageObject = {
      message_id: item?.id || "",
      group_id: item?.group_id || "",
      group_name: item?.group_name || "",
      entity: item?.entity || {},
      message_text: item?.message_text || "",
      chat_time: item?.timestamp || "",
      media_url: item?.media_url || "",
      url: item?.url || "",
      // risk_score: randomNumber + "%",
// risk_score:item?.entity?.risk_score||'',
risk_score:item?.group_risk_score ||"",


      alpha2_code: item?.entity?.country?.alpha2_code || "",
    };

    return messageObject;
  });
  return serializedArr;
};

//   type InputObject = Record<string, any>; // Generic type for the input object

export const filterOutArr = (
  dataArray: any[]
): TLogMsgApiSerializerResponse[] => {
  console.log(dataArray, "dataarrrr");
  let filteredArr = dataArray.filter((dataObject: Record<string, any>) =>
    dataObject["message_text"].trim() || dataObject["url"].trim() ? true : false
  );
  return filteredArr;
  // let flag=false;
  // for(const [index, key] of Object.keys(keyObject).entries()){
  //     // if(dataArray.find((dataObject:Record<string, any>)=>dataObject["message_text"].trim() || dataObject["url"].trim()?true:false)){
  //     //     flag=true
  //     // }
  //     if(flag){
  //         break;
  //     }
  //     if (Object.keys(keyObject).length-1)

  //    }
};

export const extractDataBasedOnPercentage = (
  
  wordCloudObj:  Record<string, any>,
  messagesPercentage: number,
  groupsPercentage: number,
  entitiesPercentage: number
) => {


  let messagesCount:number = Math.floor( (wordCloudObj.words).length*(messagesPercentage/100))
  let groupsCount:number=Math.floor((wordCloudObj.groups).length*(groupsPercentage/100))
  let entitiesCount:number=Math.floor((wordCloudObj.entities).length*(entitiesPercentage/100))


return ({words:wordCloudObj.words.slice(0,messagesCount),groups:wordCloudObj.groups.slice(0,groupsCount),entities:wordCloudObj.entities.slice(0,entitiesCount)})

//   Object.keys(wordCloudObj).forEach((key)=>{
//     let messagesCount:number
//     if(key=='words'){

      

//     }
//     else if(key=='groups'){
//       let groupsCount:number=(wordCloudObj.groups).length*(groupsPercentage/100)

//     }
//     else{

//       let entitiesCount:number=(wordCloudObj.entities).length*(entitiesPercentage/100)
//     }
// finalObject[key as keyof TWordCloudObject]=wordCloudObj.words.slice(0,groupsPercentage)

//   })

// // extractObjectBasedOnPercentage()
  
};

// backup- 22nov24

// export const prepareObjectsWithStyle = (wordCloudArr: Record<string, any>):TWordCloudObject[] => {
//   // Calculate message count and round it to an integer

//   // Initialize object as an empty object
//   let objects: TWordCloudObject[] = [];

//   // Calculate message count and round it to an integer
//   let messagesCount: number = Math.floor(wordCloudArr.words.length * (70 / 100));

//   // Process words (TMessageCloudData)
//   [...wordCloudArr.words].forEach((item, itemIndex) => {
//     if (itemIndex <= messagesCount) {
//       objects.push({ ...item, style: 'font_size_s',type:'messages' } as TMessageCloudData);
//     } else {
//       objects.push({ ...item, style: 'font_size_l',type:'messages' } as TMessageCloudData);
//     }
//   });

//   // Calculate group count
//   let groupsCount: number = Math.floor(wordCloudArr.groups.length * (10 / 100));

//   // Process groups (TGroupWordCloud)
//   [...wordCloudArr.groups].forEach((item, itemIndex) => {
//     if (itemIndex <= groupsCount) {
//       objects.push({ ...item, style: 'font_size_xl',type:'groups' } as TGroupWordCloud);
//     } else {
//       objects.push({ ...item, style: 'font_size_s',type:'groups' } as TGroupWordCloud);
//     }
//   });

//   // Calculate entity count
//   let entitiesCount: number = Math.floor(wordCloudArr.entities.length * (10 / 100));

//   // Process entities (TEntityWordCloud)
//   [...wordCloudArr.entities].forEach((item, itemIndex) => {
//     if (itemIndex <= entitiesCount) {
//       objects.push({ ...item, style: 'font_size_l',type:'entities' } as TEntityWordCloud);
//     } else {
//       objects.push({ ...item, style: 'font_size_s',type:'entities' } as TEntityWordCloud);
//     }
//   });

//   // Return the array of TWordCloudObject
//   return objects;
// };

export const prepareObjectsWithStyle = (wordCloudArr: Record<string, any>): TWordCloudObject[] => {
  // Calculate message count and round it to an integer

  // Initialize object as an empty object
  let objects: any[] = [];
  // let groupObjects: TWordCloudObject[] = [];
  // let entityObjects: TWordCloudObject[] = [];
  // let msgobjects: TWordCloudObject[] = [];
  // Calculate message count and round it to an integer
  let messagesCount: number = Math.floor(wordCloudArr.words.length * (70 / 100));

  let topthree: number = Math.floor(wordCloudArr.words.length * (10 / 100));
  let oneXS: number = Math.floor(wordCloudArr.words.length * (5 / 100));
  let twoL: number = Math.floor(wordCloudArr.words.length * (10 / 100));
  let oneXL: number = Math.floor(wordCloudArr.words.length * (5 / 100));
  let oneM: number = Math.floor(wordCloudArr.words.length * (10 / 100));
  let threeS: number = Math.floor(wordCloudArr.words.length * (10 / 100));
  let oneXLO: number = Math.floor(wordCloudArr.words.length * (5 / 100));
  // console.log(topthree, oneXS, twoL, oneXL, oneM, threeS, oneXLO, 'count---------->');

  // s--L--s-Xs--s-M-Xl-Xs-S-M-L-Xl-M-s-Xs-S-M-L-XL-M-S-Xs-M-M
  // s-s-s-Xs-L-L-XL-M-M-M-S-S-XL-XL-L



  const assignStyles = (arr) => {
    const styles = ["s", "s", "s", "xl", "l", "l", "xl", "m", "m", "m", "s", "s", "xl", "xl", "l"];
    let styleIndex = 0;

    return arr.map((word, index) => {
      const style = styles[styleIndex] || "s";
      styleIndex = (styleIndex + 1) % styles.length;
      objects.push ({ ...word, style: `font_size_${style}`, type: 'messages' } as TMessageCloudData);
    });
  };

 assignStyles(wordCloudArr.words);

 



 


  // objects.push({ ...item, style: 'font_size_xl', type: 'messages' } as TMessageCloudData);
  // [...wordCloudArr.words].forEach((item, itemIndex) => {
  //   if (itemIndex <= topthree) {
  //     objects.push({ ...item, style: 'font_size_xl', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= oneXS) {
  //     objects.push({ ...item, style: 'font_size_xs', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= twoL) {
  //     objects.push({ ...item, style: 'font_size_l', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= oneXL) {
  //     objects.push({ ...item, style: 'font_size_xl', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= oneM) {
  //     objects.push({ ...item, style: 'font_size_m', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= threeS) {
  //     objects.push({ ...item, style: 'font_size_s', type: 'messages' } as TMessageCloudData);
  //   } else if (itemIndex <= oneXLO) {
  //     objects.push({ ...item, style: 'font_size_xl', type: 'messages' } as TMessageCloudData);
  //   } else {
  //     objects.push({ ...item, style: 'font_size_s', type: 'messages' } as TMessageCloudData);
  //   }
  // });

  // Calculate group count
  let groupsCount: number = Math.floor(wordCloudArr.groups.length * (10 / 100));
  // console.log(groupsCount, "groupsCount");

  // Process groups (TGroupWordCloud)
  [...wordCloudArr.groups].forEach((item, itemIndex) => {
    if (itemIndex <= groupsCount) {
      objects.push({ ...item, style: 'font_size_xl', type: 'groups' } as TGroupWordCloud);
    } else {
      objects.push({ ...item, style: 'font_size_s', type: 'groups' } as TGroupWordCloud);
    }
  });


  // Calculate entity count
  let entitiesCount: number = Math.floor(wordCloudArr.entities.length * (10 / 100));

  // Process entities (TEntityWordCloud)
  [...wordCloudArr.entities].forEach((item, itemIndex) => {
    if (itemIndex <= entitiesCount) {
      objects.push({ ...item, style: 'font_size_l', type: 'entities' } as TEntityWordCloud);
    } else {
      objects.push({ ...item, style: 'font_size_s', type: 'entities' } as TEntityWordCloud);
    }
  });
  // console.log(groupObjects,"groupObjects");
  console.log(objects, '--------->');

  // Return the array of TWordCloudObject
  return objects;
};



