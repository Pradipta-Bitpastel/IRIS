import { groups } from "@/_assets/datasets/db";
import { TSearchByKeyApiResponse, TSearchByKeyEntityApiSerializerResponse, TSearchByKeyGroupApiSerializerResponse, TSearchEntityApiSerializerResponse, TSearchGroupApiSerializerResponse, TSearchMsgApiSerializerResponse } from "../types/type";
import { randomIntGenerator } from "@/utils/commonFunctions";
import { TEntity } from "@/types/type";
import { activity_graph_dataset, activity_graph_data, activity_graph_option } from "@/constants";
import { timeStamp } from "console";
import axios from "axios";
import { createTheme, FormControl, styled } from "@mui/material";

export const serializeSearchByKeywordApiResponse = (
  apiResponse: Record<string, any>
): TSearchByKeyApiResponse => {
  let SerializedObject: TSearchByKeyApiResponse = {
    groups: {
      totalCount: '0',
      count: '0',  // Initialize count with a default value
      result: [] // Assuming you have a list of groups under this structure
    },
    entities: {
      totalCount: '0',

      count: '0',  // Initialize count with a default value
      result: [] // Assuming you have a list of groups under this structure
    },
    messages: {
      totalCount: '0',

      count: '0',  // Initialize count with a default value
      result: [] // Assuming you have a list of groups under this structure
    }

  }
  Object.keys(apiResponse).forEach((item) => {

    if (item == 'entitys' || item == 'entities') {



      let entityModifiedArr = apiResponse[item].Result.map((entity_object: Record<string, any>) => {
        const randomNumber = randomIntGenerator(5, 99);


        const entityObject: TSearchEntityApiSerializerResponse = {
          // item?.media_url || "",
          id: entity_object?.id || '',
          profile_photo_url: entity_object?.profile_image_url || '',
          phone: entity_object?.phone_number || '',
          alpha2_code: entity_object?.country?.alpha2_code || '',
          alpha3_code: entity_object?.country?.alpha3_code || '',
          country: entity_object?.country?.name || '',
          type: 'entity',
          first_name: entity_object?.first_name || '',
          last_name: entity_object?.last_name || ''





        }
        return entityObject




      })

      Object.assign(SerializedObject, { entities: { result: entityModifiedArr, count: apiResponse?.entitys?.count || apiResponse?.entities?.count || '0', totalCount: apiResponse?.entitys?.total_count || apiResponse?.entities?.total_count || '0' } })




    }
    else if (item == 'groups') {

      let groupModifiedArr = apiResponse[item]?.Result.map((group_object: Record<string, any>) => {
        const randomNumber = randomIntGenerator(5, 99);


        const groupObject: TSearchGroupApiSerializerResponse = {
          // item?.media_url || "",

          id: group_object?.id || '',
          name: group_object?.group_name || '',
          profile_photo_url: group_object?.profile_image_url || '',
          // risk_score: randomNumber + "%",
          risk_score: group_object?.risk_score || '',
          member_count: group_object?.member_count,
          type: 'group'




        }
        return groupObject




      })

      Object.assign(SerializedObject, { groups: { result: groupModifiedArr, count: apiResponse?.groups?.count || '0', totalCount: apiResponse?.groups?.total_count || '0' } })


    }

    else {

      let msgModifiedArr = apiResponse[item]?.Result.map((msg_object: Record<string, any>) => {
        const randomNumber = randomIntGenerator(5, 99);
        // console.log(msg_object, "msgObjecttt----")

        const msgObject: TSearchMsgApiSerializerResponse = {
          // item?.media_url || "",
          id: msg_object?.id || '',
          group_name: msg_object?.group_name || '',
          message_text: msg_object?.message_text || '',
          entity_name: msg_object?.entity
            || '',
          type: 'message'
        }



        // console.log(msgObject, "msgObjecttt")


        return msgObject
      }
      )




      Object.assign(SerializedObject, { messages: { result: msgModifiedArr, count: apiResponse?.messages?.count || '0', totalCount: apiResponse?.messages?.total_count || '0' } })
    }

  }

  )
  return SerializedObject
};
//   export const serializeSearchByEntityApiResponse= (
//     entity_object: Record<string, any>
//   ):TSearchByKeyEntityApiSerializerResponse =>{

//     const entityObject:TSearchEntityApiSerializerResponse={
//       // item?.media_url || "",
//       id:entity_object?.id ||'',
//       profile_photo_url: entity_object?.profile_image_url||'',
//       phone: entity_object?.phone_number||'',
//       alpha2_code: entity_object?.country?.alpha2_code ||'',
//       alpha3_code: entity_object?.country?.alpha3_code ||'',
//       country:entity_object?.country?.name ||'',
//       type:'entity'






//     }
//     // Object.assign(SerializedObject,{entities:{result:entityModifiedArr,count:apiResponse?.entitys?.count||'0'}})

// return {result:entityModifiedArr,count:apiResponse?.entitys?.count||'0'}

//   }



export const getMediaType = (mediaUrl: string): string => {
  const extension = mediaUrl.split('.').pop()?.toLowerCase(); // Extract file extension

  switch (extension) {
    case "mp4":
    case "mkv":
    case "avi":
      return "video";
    case "mp3":
    case "wav":
    case "aac":
      return "audio";
    case "pdf":
      return "pdf";
    case "doc":
    case "docx":
      return "document";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
      return "image";
    default:
      return "unknown";
  }
};


export const activityGraphDataBuilder = (groupId: string) => {
  let cloneActivityGraphData = { ...activity_graph_data }
  let cloneActivityGraphDataset = { ...activity_graph_dataset }
  let resultActivityGraphData = {}
  let localDataSetsArr = []
  console.log(groupId, "group id")
  const randomInt = randomIntGenerator(1, 10)

  const datasetName = 'dataSet' + randomInt
  if (groupId) {
    [...Array(2).keys()].forEach(index => {

      let localObj = { ...cloneActivityGraphData['datasets'][index], data: cloneActivityGraphDataset[datasetName][index] }
      localDataSetsArr.push(localObj)
    });
  }


  return { ...cloneActivityGraphData, datasets: localDataSetsArr }


}

export const preparePrevAndNextMsgWithCurrent = (messageObject: Record<string, any>) => {
  let cloneMessageObject = { id: messageObject?.id, message_text: messageObject?.message_text, risk_score: messageObject?.risk_score, timeStamp: messageObject?.timestamp, entity: messageObject?.entity }

  let prevAndNextMsgWithCurrent = [...messageObject?.adjacent_messages?.previous]

  return [...messageObject?.adjacent_messages?.previous, cloneMessageObject, ...messageObject?.adjacent_messages?.next]
  // if(messageObject?.adjacent_messages?.previous.length>0 && messageObject?.adjacent_messages?.next.length>0){

  // prevAndNextMsgWithCurrent=[...prevAndNextMsgWithCurrent,messageObject?.message_text,...messageObject?.adjacent_messages?.next]

  // }
  // else if(messageObject?.adjacent_messages?.previous.length>0){

  // }


}



// export const translateText = async (text: string, messageId: string): Promise<string | void> => {
//   const apiKey = 'AIzaSyDy0LmeEz-CEu68KfzszWwqS0jIXZvVxq8'; // Replace with your API key
//   const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

//   const body = {
//     q: text,
//     source: "ar",
//     target: "en",
//     format: "text",
//   };

//   try {
//     const response = await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const translatedText = response.data.data.translations[0].translatedText;
//     return translatedText
//   } catch (error) {
//     console.error("Error translating text:", error);
//     return error
//     // Handle error by updating status and setting a default message
//     // setTranslatedTexts(prevState => ({
//     //   ...prevState,
//     //   [messageId]: { message: 'Error translating text. Please try again.', status: false }
//     // }));
//   }
// };


export const translateText = async (text: string, messageId: string): Promise<string | void> => {
  const subscriptionKey = "A4s3Xa5qi2h97AIZmTKm2HlEAFfOYuXJLFpjsTymYgZ1UIUaH8RDJQQJ99ALACULyCpXJ3w3AAAbACOG0Sqm"; // Replace with your Azure subscription key
  const region = "global"; // Replace with your Azure service region
  const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en`; // Replace 'en' with your desired target language

  const body = [
    {
      Text: text,
    },
  ];

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
    });
    // console.log(response,'--------->');
    
    const translatedText = response.data[0].translations[0].text;
    console.log(response,'-------->');
    
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return error;
    // Optionally handle error and return a default message
    // setTranslatedTexts(prevState => ({
    //   ...prevState,
    //   [messageId]: { message: 'Error translating text. Please try again.', status: false }
    // }));
  }
};
export const handleTranslation = async (str: string, messageId: string): Promise<string | void> => {
  // Regular expressions for detecting English and Arabic letters (ignoring special chars and emojis)
  const englishRegex = /^[A-Za-z\s]*$/;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  // Remove non-letter characters (including special characters and emojis) for accurate detection
  const cleanStr = str.replace(/[^\w\s\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, "");

  // If cleaned string contains only English characters
  if (englishRegex.test(cleanStr)) {
    console.log("Already have in English");
    return "503";
  }

  // If cleaned string contains Arabic characters
  if (arabicRegex.test(cleanStr)) {
    console.log("Arabic");
    // Translate the message and update the state only for the specific message
    // let respopnse = await translateText(str, messageId);
    return "Arabic";
  }

  // If neither, return unknown
  return "503";
}

// <div className="translator-btn ms-1">
// <svg className={translatedTexts[msg_item?.message_id]?.message.length > 0 ? "active" : ""} onClick={() => { handleTranslation((msg_item?.message_text.length > 70 ? `${msg_item?.message_text.slice(0, 70)} ...` : msg_item?.message_text), msg_item?.message_id) }} xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24"><path fill="currentColor" d="M22.401 4.818h-9.927L10.927 0H1.599C.72 0 .002.719.002 1.599v16.275c0 .878.72 1.597 1.597 1.597h10L13.072 24H22.4c.878 0 1.597-.707 1.597-1.572V6.39c0-.865-.72-1.572-1.597-1.572zm-15.66 8.68c-2.07 0-3.75-1.68-3.75-3.75s1.68-3.75 3.75-3.75c1.012 0 1.86.375 2.512.976l-.99.952a2.2 2.2 0 0 0-1.522-.584c-1.305 0-2.363 1.08-2.363 2.409S5.436 12.16 6.74 12.16c1.507 0 2.13-1.08 2.19-1.808l-2.188-.002V9.066h3.51c.05.23.09.457.09.764c0 2.147-1.434 3.669-3.602 3.669zm16.757 8.93c0 .59-.492 1.072-1.097 1.072h-8.875l3.649-4.03h.005l-.74-2.302l.006-.005s.568-.488 1.277-1.24c.712.771 1.63 1.699 2.818 2.805l.771-.772c-1.272-1.154-2.204-2.07-2.89-2.805c.919-1.087 1.852-2.455 2.049-3.707h2.034v.002h.002v-.94h-4.532v-1.52h-1.471v1.52H14.3l-1.672-5.21l.006.022h9.767c.605 0 1.097.48 1.097 1.072zm-6.484-7.311c-.536.548-.943.873-.943.873l-.008.004l-1.46-4.548h4.764c-.307 1.084-.988 2.108-1.651 2.904c-1.176-1.392-1.18-1.844-1.18-1.844h-1.222s.05.678 1.7 2.61z"></path></svg>
// </div>

// // Check if translation exists for this specific message and if it's still in progress
// translatedTexts[msg_item?.message_id]?.status
//   ? 'Translating...' Display "Translating..." while status is true
//   : translatedTexts[msg_item?.message_id]?.message.length > 0
//     ? translatedTexts[msg_item?.message_id]?.message
//     :
export const StyledFormControl = styled(FormControl)({
  "& .MuiSelect-select": {
    color: "#8E9DAD", // Input text color
    // opacity: 1,
    '-webkit-text-fill-color': "#fff",
  },
  "& .MuiMenuItem-root": {
    color: "#8E9DAD", // Dropdown items color
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff", // Border color
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
  "& .MuiSvgIcon-root": {
    color: "#fff", // Change dropdown arrow color
  },
  '&.Mui-disabled': {
    color: '#8E9DAD', // Custom disabled text color
    '-webkit-text-fill-color':'#8E9DAD',
    // backgroundColor: '#F5F5F5', // Optional: Custom disabled background color
  },
});
export const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif', // Add your preferred font family
    fontSize: 12, // Global font size
  }
});