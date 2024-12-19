const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
//   With timestatus = true and a specific timestamp: The output is the time in HH:MM format.
//   With timestatus = false and a specific timestamp: The output is the date in day month year format.
//   Without a timestamp and timestatus = false: The output is today's date in day month year format.
//   const dateFormatter=(timestamp:number,timestatus:boolean)=>{
//     let timestampInMiliSec=timestamp*1000;
//     let currentDateTime='';
//     // let currentDateTimeArr=[]
//     if(timestatus)
//     {
//         let dateObj=new Date(timestampInMiliSec);
// //         let splittedDate=  toStringDate.split(":")
// // console.log
// currentDateTime= dateObj.getUTCHours()+':'+dateObj.getUTCMinutes()
//     }
//     else{
//     if(timestamp)
//     {
//         let toStringDate=new Date(timestampInMiliSec).toString();
//         let splittedDate=  toStringDate.split(" ");
// // console.log(splittedDate,"timestampp")

//    currentDateTime=  splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3]

//     }
//     else{

//         let toStringDate=new Date().toString();
//         let splittedDate=  toStringDate.split(" ");
//         // console.log(splittedDate,"else  timestampp")
//         currentDateTime=  splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3];

//     }
// }
// // console.log(currentDateTime,"timestampp")
//     return currentDateTime;
//     // let splittedDate=currentDate.split(" ")
//     // return (splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3])
//     // return currentDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
// }
// 2024-03-20T15:33:16Z
// const dateFormatter = (dateIsoStandard?: string, timeOutputFormat?: boolean) => {
//   if (timeOutputFormat) {
//     //get the time in HH:MM format
//     let dateObj = new Date();
//     return dateObj.getUTCHours() + ":" + dateObj.getUTCMinutes();
//   } else if (!timeOutputFormat && dateIsoStandard) {
//     const toStringDate = new Date(dateIsoStandard).toString();
//     const splittedDate = toStringDate.split(" ");
//     return `${splittedDate[2]} ${splittedDate[1]} ${splittedDate[3]}`;
//   } else if (!timeOutputFormat && !dateIsoStandard) {
//     //today's date in day month year format
//     let toStringDate = new Date().toString();
//     let splittedDate = toStringDate.split(" ");
//     return splittedDate[2] + " " + splittedDate[1] + " " + splittedDate[3];
//   } //default ''
//   else {
//     return "";
//   }
// };
const dateFormatter = (dateIsoStandard?: string, timeOutputFormat?: boolean): string => {
  if (dateIsoStandard) {
    const dateObj = new Date(dateIsoStandard);

    if (timeOutputFormat) {
      // Format time as HH:MM
      const hours = dateObj.getUTCHours().toString().padStart(2, "0");
      const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      // Format date as DD MMM YYYY
      const day = dateObj.getUTCDate().toString().padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" }); // Get abbreviated month
      const year = dateObj.getUTCFullYear();
      return `${day} ${month} ${year}`;
    }
  } else {
    // Default to today's date in DD MMM YYYY format
    const now = new Date();
    const day = now.getUTCDate().toString().padStart(2, "0");
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }
};
// removeDuplicate is designed to remove duplicates from an array (arr_total) based on a unique key (uniqueKey) provided as a parameter.
type AnyObject = { [key: string]: any };
const removeDuplicate = <T extends AnyObject>(
  arr_total: T[],
  uniqueKey: keyof T
): T[] => {
  let arr = [...arr_total];

  return arr.filter((value, index) => {
    const chat_value = JSON.stringify(value.chat);
    const chat_time_value = JSON.stringify(value.chat_time);
    const member_id_value = JSON.stringify(value.member_id);
    const group_id_value = JSON.stringify(value.group_id);
    return (
      index ===
      arr.findIndex((obj) => {
        // let p=  arr.findIndex(obj => {

        return obj[uniqueKey] === value[uniqueKey];
      })
    );

    // console.log(p,"ppp")
    // return p
  });
};

function randomIntGenerator(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export {
  dateFormatter,
  removeDuplicate,
  randomIntGenerator,
  shuffleArray,
  timeout,
};
