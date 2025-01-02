const shuffleArray = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  const dateFormatter=(timestamp,timestatus)=>{
    let timestampInMiliSec=timestamp*1000;
    let currentDateTime='';
    // let currentDateTimeArr=[]
    if(timestatus)
    {
        let dateObj=new Date(timestampInMiliSec);
//         let splittedDate=  toStringDate.split(":")
// console.log
currentDateTime= dateObj.getUTCHours()+':'+dateObj.getUTCMinutes()
    }
    else{
    if(timestamp)
    {
        let toStringDate=new Date(timestampInMiliSec).toString();
        let splittedDate=  toStringDate.split(" ");
// console.log(splittedDate,"timestampp")

   currentDateTime=  splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3]

    }
    else{
        
        let toStringDate=new Date().toString();
        let splittedDate=  toStringDate.split(" ");
        // console.log(splittedDate,"else  timestampp")
        currentDateTime=  splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3];

    }
}
// console.log(currentDateTime,"timestampp")
    return currentDateTime;
    // let splittedDate=currentDate.split(" ")
    // return (splittedDate[2]+' '+splittedDate[1]+' '+splittedDate[3])
    // return currentDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}


const removeDuplicate = (arr_total,uniqueKey) => {
  let arr = [...arr_total]

  return arr.filter((value, index) => {
      const chat_value = JSON.stringify(value.chat);
      const chat_time_value = JSON.stringify(value.chat_time);
      const member_id_value = JSON.stringify(value.member_id);
      const group_id_value = JSON.stringify(value.group_id)
      return index === arr.findIndex(obj => {
          // let p=  arr.findIndex(obj => {

          return (obj[uniqueKey]=== value[uniqueKey])
      });

      // console.log(p,"ppp")
      // return p

  });

 




}

function randomIntGenerator(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

  export {dateFormatter,removeDuplicate,randomIntGenerator,shuffleArray,timeout}