"use client";

import React, { useEffect, useState, useRef, memo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import DashboardForm from "./DashboardForm";
import "@/_assets/style/style.css";
// import { TLogMsgApiResponse } from "../types/type";
import { riskFactorCalc, generatingOffsetAndLimitForApi, extractDataBasedOnPercentage, prepareObjectsWithStyle } from "@/helpers";
import { THeaders, TCustomApiProp, TApiData, TMessageCloudData, TGroupWordCloud, TEntityWordCloud } from "@/types/type";
import {
  allowableServerErrors,
  authHeader,
  pageApiHeader,
  generalizedApiError,
  toastSettingData,
  regexExp400,
  imgBasePath,
} from "@/constants/index";
import {
  TApiResponse,
  TErrorMessage,
  TToastErrorSettingData,
  TLogMsgApiSerializerResponse,
  TApiResponseCommon,
  TWordCloudObject
} from "@/types/type";
import { useCallApi } from "@/app/api/CallApi";
import { serializeLogMsgApiResponse, filterOutArr } from "@/helpers";
import { dateFormatter, timeout } from "@/utils/commonFunctions";

import $ from "jquery";
// import MapComponent from "./MapComponent";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { stat } from "fs";
import GaugeComponent from "react-gauge-component";
// import MapComponent from "@/app/(pages)/dashboard/_components/MapComponent";

// const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
const MapComponent = dynamic(
  () => import("@/app/(pages)/dashboard/_components/MapComponent"),
  { ssr: false }
);

const DashboardLeaf = memo(() => {
  const Router = useRouter();
  const focus = useRef<HTMLDivElement>(null);
  const routeToSearchPage = (searchInput: string) => {
    Router.push(`/search/${searchInput}`);
  };
  const [messageArr, setMessageArr] = useState<TLogMsgApiSerializerResponse[]>(
    []
  );
  const [alertMessageArr, setAlertMessageArr] = useState<TLogMsgApiSerializerResponse[]>(
    []
  );
  let [alertMsg, setAlertMsg] = useState<TLogMsgApiSerializerResponse[]>([]);
  let [msgCounter, setMsgCounter] = useState<number>(0);
  let [memberCounter, setMemberCounter] = useState<number>(0);
  let [groupCounter, setGroupCounter] = useState<number>(0);
  let [logFileHoverState, setLogFileHoverState] = useState<string[]>([]);
  let [IterableForLogMsg, setIterableForLogMsg] = useState(5);
  const [logMsgArr, setLogMsgArr] = useState<TLogMsgApiSerializerResponse[]>(
    []
  );
  const [positionTrackerForAlertMsg, setPositionTrackerForAlertMsg] = useState<number>(0);
  // const[indexTrackerFoAlertMsgArr,setIndexTrackerForAlertMsgArr]=useState<number>(103);
  const [indexTrackerFoAlertMsgArr, setIndexTrackerForAlertMsgArr] = useState<number>(0);

  const [loaderStatus, setLoaderStatus] = useState(true);

  const [chatMsgOffsetCount, setChatMsgOffsetCount] = useState<number>(0)
  const chatMsgLimit = 200



  let [wordCloudArr, setWordCloudArr] = useState<TWordCloudObject[]>([]);
  let callApiOnce = 1;

  // let [msgCounter, setMsgCounter] = useState<TStatDashboardApiData>({

  // }
  // );

  useEffect(() => {
    //  clearInterval(timer)
    let timer = setInterval(() => {

      if (msgCounter) {
        setMsgCounter((prev) => prev + 1);
        clearInterval(timer);
        return;
      }
    }, 50);

    return () => clearInterval(timer);
  }, [msgCounter]);

  useEffect(() => {
    //  clearInterval(timer)
    let timer = setInterval(() => {

      if (memberCounter) {
        setMemberCounter((prev) => prev + 1);
        clearInterval(timer);
        return;
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [memberCounter]);

  const generatingPayloadForApi = (offset: number = 0, limit: number = chatMsgLimit) => {
    const formData = new FormData();

    // formData.append("id", groupDetails?.id);
    formData.append("offset", String(offset));
    formData.append("limit", String(limit));
    return formData
  }
  const messageApi = (payload) => {
    // console.log('messageApi initiate');

    try {
      const data = useCallApi({
        headersInfo: {
          ...authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        endpoint: "api/chats/messages",
        httpMethod: "post",
        data: payload,
      })
      return data
    } catch (error) {
      const errorMessage: TErrorMessage = generalizedApiError;

      const toastErrorSettingDataCpy: TToastErrorSettingData =
        toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );
    }
  }
  const statApi = () => {
    // console.log('statApi initiate');
    try {
      const data = useCallApi({
        headersInfo: authHeader,
        endpoint: "api/dashboard/stats",
        httpMethod: "get",
        // data: generatingOffsetAndLimitForApi,
      })
      return data
    } catch (error) {
      const errorMessage: TErrorMessage = generalizedApiError;

      const toastErrorSettingDataCpy: TToastErrorSettingData =
        toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );
    }
  }
  const wordsApi = () => {
    // console.log('wordsApi initiate');
    try {
      const data = useCallApi({
        headersInfo: authHeader,
        endpoint: "api/top-words",
        httpMethod: "get",
        // data: generatingOffsetAndLimitForApi,
      })
      return data
    } catch (error) {
      const errorMessage: TErrorMessage = generalizedApiError;

      const toastErrorSettingDataCpy: TToastErrorSettingData =
        toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );
    }
  }

  useEffect(() => {
    const postLogMsgApiRequest = async () => {
      // const generatingOffsetAndLimitForApi()
      const payload = generatingPayloadForApi(chatMsgOffsetCount, chatMsgLimit)

      try {
        // let [responseMsgData, responseStatData, responseWordCloud]: TApiData[] =
        //   await Promise.all([
        //     useCallApi({
        //       headersInfo: {
        //         ...authHeader,
        //         "Content-Type": "application/x-www-form-urlencoded",
        //       },
        //       endpoint: "api/chats/messages",
        //       httpMethod: "post",
        //       data: payload,
        //     }),

        //     useCallApi({
        //       headersInfo: authHeader,
        //       endpoint: "api/dashboard/stats",
        //       httpMethod: "get",
        //       // data: generatingOffsetAndLimitForApi,
        //     }),

        //     useCallApi({
        //       headersInfo: authHeader,
        //       endpoint: "api/top-words",
        //       httpMethod: "get",
        //       // data: generatingOffsetAndLimitForApi,
        //     }),
        //   ]);
        let responseMsgData: any = await messageApi(payload)
        let responseStatData: any = await statApi()
        let responseWordCloud: any = await wordsApi()


        if (!(responseMsgData?.status == "200" && responseStatData?.status == "200" && responseWordCloud?.status == "200")) {

          const errorMessage: TErrorMessage = generalizedApiError;

          const toastErrorSettingDataCpy: TToastErrorSettingData =
            toastSettingData;
          toast.error(
            allowableServerErrors.includes(errorMessage)
              ? errorMessage
              : generalizedApiError,
            toastErrorSettingDataCpy
          );
        }
        // "group_count": 13,
        // "entity_count": 3237,
        // "message_count": 2452
        callApiOnce = callApiOnce + 1;
        // console.log(responseStatData);

        // console.log(responseMsgData, responseStatData, responseWordCloud, "response from message");
        setMsgCounter(responseStatData?.data.message_count);
        setGroupCounter(responseStatData?.data.group_count);
        setMemberCounter(responseStatData?.data.entity_count);
        let tunedResponse = filterOutArr(
          serializeLogMsgApiResponse(responseMsgData?.data?.result)
        );

        const shuffledMsgForAlert = shuffleMsgForAlert(tunedResponse, true)

        // console.log(shuffledMsgForAlert, "shuffledMsgForAlert")
        setMessageArr(tunedResponse);
        setAlertMessageArr(shuffledMsgForAlert)
        setLogMsgArr(() => tunedResponse.slice(0, 5));
        setAlertMsg(() => tunedResponse.slice(100, 103));

        if (+(responseMsgData?.data?.count) > chatMsgOffsetCount) {
          setChatMsgOffsetCount(chatMsgOffsetCount + chatMsgLimit)
        }

        // setAlertMsg(tunedResponse);
        setWordCloudArr(() => {
          let extractedDataBasedOnPercentage = extractDataBasedOnPercentage(responseWordCloud?.data[0], 100, 100, 100) //word, group, entity

          return prepareObjectsWithStyle(extractedDataBasedOnPercentage)
        })
        setLoaderStatus(false);
      } catch (error: unknown) {
        // setLoaderStatus(false);

        const errorMessage: TErrorMessage =
          error instanceof Error ? error.message : "";

        const toastErrorSettingDataCpy: TToastErrorSettingData =
          toastSettingData;
        toast.error(
          allowableServerErrors.includes(errorMessage)
            ? errorMessage
            : generalizedApiError,
          toastErrorSettingDataCpy
        );




      }
    };

    if (callApiOnce == 1) {
      postLogMsgApiRequest();
    }
  }, []);

  const rearrangeMsg = (
    arr: TLogMsgApiSerializerResponse[],
    mainLocalFilterdObj: TLogMsgApiSerializerResponse
  ): TLogMsgApiSerializerResponse[] => {
    let newArr: TLogMsgApiSerializerResponse[];
    // console.log(mainLocalFilterdObj,"mainFilteredobjjj")

    newArr = [mainLocalFilterdObj, ...arr];

    return newArr;
  };
  const addRemoveClassses = async (action: string) => {
    let itCount = [...Array(6).keys()];
    let itTimeout = [5, 50, 100, 200, 300, 400];
    for (let i = 1; i <= itCount.length; i++) {
      if (action == "add") {
        // console.log(i,"add")
        await timeout(itTimeout[i]);
        $(`.inner_card_parent:nth-child(${i})`).addClass("fst_ani");

        await timeout(itTimeout[0]);
      } else {
        // console.log(i,"removeee")

        $(`.inner_card_parent:nth-child(${i})`).removeClass("fst_ani");
      }

      //    await timeout(itTimeout[i])
    }
  };

  useEffect(() => {
    let intervalId: number | NodeJS.Timeout = 0;
    if (messageArr.length > 0) {

      if (logFileHoverState.length <= 0) {
        intervalId = setInterval(async () => {
          await addRemoveClassses("remove");

          let orgmsgArr = [...messageArr];
          let cpymsgArr = [...messageArr];
          // const rndInt = randomIntFromInterval(1, orgmsgArr.length);
          let cloneIterableForLogMsg = IterableForLogMsg; // initital index of the message
          if (cloneIterableForLogMsg > messageArr.length - 1) {
            // console.log("inside 000");
            // iterable_id = 0;
            cloneIterableForLogMsg = 0;
            setIterableForLogMsg(() => 0);
          }

          let mainLocalFilterdObj = orgmsgArr.filter((messageitem) => {
            return (
              messageitem.message_id ==
              orgmsgArr[cloneIterableForLogMsg].message_id
            );
          });
          setIterableForLogMsg(() => cloneIterableForLogMsg + 1);

          setLogMsgArr((logMsg) => {
            let appendedLogMsg: TLogMsgApiSerializerResponse[] = rearrangeMsg(
              logMsg,
              mainLocalFilterdObj[0]
            );
            if (logMsgArr.length >= 5) {
              return appendedLogMsg.slice(0, 5);
            }
            return appendedLogMsg;
          });
          await addRemoveClassses("add");
        }, 4500);
        // }, );
      } else {

        return () => clearInterval(intervalId);
      }
      // console.log("clear interva;")
      // console.log(typeof(intervalId),"intervalid")
    }
    if (!intervalId) {
      return () => clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
    //   };

    //   fetchDataWithDelay();
  }, [logMsgArr, logFileHoverState]);

  const onMouseEnter = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // console.log(e.target,e.currentTarget.id,"mouse enter");
    let numericId = e.currentTarget.id;
    setLogFileHoverState(() => {
      return [numericId];
    });
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setLogFileHoverState(() => {
      return [];
    });
  };
  const rearrangeAlertMsg = (arr: TLogMsgApiSerializerResponse[], clonePositionTrackerForAlertMsg: number, mainLocalFilterdObj: TLogMsgApiSerializerResponse) => {

    let cloneArr = [...arr];

    cloneArr.splice(clonePositionTrackerForAlertMsg, 1, mainLocalFilterdObj);

    return cloneArr;
  };
  const handleOpenSearchBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    $("#overlay-search-overlay").css("display", "block");
    $("#overlay-search-popup").css("display", "block");


  }


  useEffect(() => {
    let intervalId: number | NodeJS.Timeout = 0;

    if (alertMessageArr.length > 0) {
      // console.log(messageArr,"checkmsgarrinalertmsg")



      intervalId = setInterval(async () => {
        let clonePositionTrackerForAlertMsg = positionTrackerForAlertMsg;
        let cloneIndexTrackerForAlertMsgArr = indexTrackerFoAlertMsgArr
        await timeout(200)
        if (clonePositionTrackerForAlertMsg >= 3) {
          clonePositionTrackerForAlertMsg = 0;
          setPositionTrackerForAlertMsg(() => 0);
        }
        let cloneMessageArr = [...alertMessageArr];
        let cloneAlertMsgArr = [...alertMsg];

        if (cloneIndexTrackerForAlertMsgArr > cloneMessageArr.length - 1) {

          cloneIndexTrackerForAlertMsgArr = 0;
          setIndexTrackerForAlertMsgArr(() => 0);
        }
        let mainLocalFilterdObj = cloneMessageArr.filter((messageItem) => {
          return (
            messageItem.message_id ==
            cloneMessageArr[cloneIndexTrackerForAlertMsgArr].message_id
          );
        });;
        // console.log(mainLocalFilterdObj, "inside the only alert message------")
        setAlertMsg(() =>
          rearrangeAlertMsg(cloneAlertMsgArr, clonePositionTrackerForAlertMsg, mainLocalFilterdObj[0])
        );

        setPositionTrackerForAlertMsg(() => clonePositionTrackerForAlertMsg + 1);
        setIndexTrackerForAlertMsgArr(() => cloneIndexTrackerForAlertMsgArr + 1)

        await timeout(300)



      }, 2000);
    }



    return () => clearInterval(intervalId);

    ;
  }, [alertMsg, alertMessageArr]);

  //   useEffect(() => {
  //     let intervalId: number | NodeJS.Timeout = 0;

  // if(messageArr.length>0){
  //   // console.log(messageArr,"checkmsgarrinalertmsg")
  //   console.log(indexTrackerFoAlertMsgArr,"inside useeffect of alertt indexTracker------",messageArr)



  //      intervalId = setInterval(async() => {
  //       let clonePositionTrackerForAlertMsg = positionTrackerForAlertMsg;
  //       let cloneIndexTrackerForAlertMsgArr=indexTrackerFoAlertMsgArr
  //       await timeout(200)
  //       if (clonePositionTrackerForAlertMsg >= 3) {
  //         clonePositionTrackerForAlertMsg = 0;
  //         setPositionTrackerForAlertMsg(() => 0);
  //       }
  //       let cloneMessageArr = [...messageArr];
  //       let cloneAlertMsgArr = [...alertMsg];

  //       if ( cloneIndexTrackerForAlertMsgArr > cloneMessageArr.length) {

  //         cloneIndexTrackerForAlertMsgArr = 0;
  //         setIndexTrackerForAlertMsgArr(() => 0);
  //       }
  // console.log(cloneMessageArr[cloneIndexTrackerForAlertMsgArr],cloneIndexTrackerForAlertMsgArr,"loppp")
  //       let mainLocalFilterdObj = cloneMessageArr.filter((messageItem) => {
  //         return (
  //           messageItem.message_id ==
  //           cloneMessageArr[cloneIndexTrackerForAlertMsgArr].message_id
  //         );
  //       });;
  //       console.log(mainLocalFilterdObj,"inside the only alert message------")
  //       setAlertMsg(() =>
  //         rearrangeAlertMsg(cloneAlertMsgArr,clonePositionTrackerForAlertMsg, mainLocalFilterdObj[0])
  //       );

  //       setPositionTrackerForAlertMsg(() => clonePositionTrackerForAlertMsg+1);
  //       setIndexTrackerForAlertMsgArr(()=>cloneIndexTrackerForAlertMsgArr+1)

  // await timeout(300)



  //     }, 50);
  //   }



  //     return () => clearInterval(intervalId);

  // ;
  //   }, [alertMsg,alertMessageArr]);
  // const rearrangeAlertMsg = (arr, iterable_id, mainLocalFilterdObj) => {
  //   // let newArr=[]
  //   let cpy_main_arr = [...arr];
  //   // console.log(mainLocalFilterdObj,"mainFilteredobjjj")
  //   cpy_main_arr.splice(iterable_id, 1, mainLocalFilterdObj);
  //   // console.log(cpy_main_arr.length, "length");
  //   // let localFilterdArr=cpymsgArr.filter((item)=>{console.log(item.id,`{m${iterable_id}`,"loll");return(item.id!==`m${iterable_id}`)})

  //   // console.log(newArr,"newArr")
  //   return cpy_main_arr;
  // };
  // useEffect(() => {
  //   let intervalId = setInterval(async () => {
  //     let iterable_id = iterableState;
  //     await timeout(200)
  //     if (iterable_id >= 3) {
  //       // console.log("inside 000");
  //       iterable_id = 0;
  //       setIterableState(() => 0);
  //     }
  //     let orgmsgArr = [...messageArr];
  //     let cpymsgArr = [...alertMsg];
  //     const rndInt = randomIntFromInterval(1, orgmsgArr.length - 2);
  //     let mainLocalFilterdObj = orgmsgArr.filter((messageitem) => {
  //       return messageitem.message_id == `${rndInt}`;
  //       // `m${rndInt}`
  //     });
  //     if (mainLocalFilterdObj.length > 0) {
  //       setAlertMsg(() =>
  //         rearrangeAlertMsg(cpymsgArr, iterable_id, mainLocalFilterdObj[0])
  //       );
  //       setIterableState(() => iterable_id + 1);
  //     }
  //     console.log(iterable_id, "iterableid");
  //     await timeout(1000)
  //   }, 2000);


  //   return () => clearInterval(intervalId);
  // }, [alertMsg]);
  const callChatMsgApi = async (limit: number = chatMsgLimit, OffsetCount: number): Promise<TApiData> => {
    let object = {}
    try {
      const payload = generatingPayloadForApi(OffsetCount, limit)




      const chatMsgDataResponse: TApiData = await useCallApi({

        headersInfo: {
          ...authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        endpoint: "api/chats/messages",
        httpMethod: "post",
        data: payload,
      })

      if (chatMsgDataResponse?.status == "200") {
        // console.log(chatMsgDataResponse, "api response---------")





        object = { ...chatMsgDataResponse }
      }

      return object
    }
    catch (error: unknown) {
      const errorMessage: TErrorMessage =
        error instanceof Error ? error.message : "";

      const toastErrorSettingDataCpy: TToastErrorSettingData =
        toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );
      return object

    }




  }
  useEffect(() => {
    // const offsetCount=chatMsgOffsetCount + chatMsgLimit

    const callApi = async () => {
      const chatMsgDataResponse = await callChatMsgApi(chatMsgLimit, chatMsgOffsetCount)

      if (Object.keys(chatMsgDataResponse).length > 0) {

        let tunedResponse = filterOutArr(
          serializeLogMsgApiResponse(chatMsgDataResponse?.data?.result)
        );

        const shuffledMsgForAlert = shuffleMsgForAlert(tunedResponse, true)

        // console.log(shuffledMsgForAlert, tunedResponse, "api,callllllll")


        setMessageArr([...messageArr, ...tunedResponse]);
        setAlertMessageArr([...alertMessageArr, ...shuffledMsgForAlert])



        if (+(chatMsgDataResponse?.data?.count) > chatMsgOffsetCount) {

          setChatMsgOffsetCount(() => chatMsgOffsetCount + chatMsgLimit)
        }
        else {
          setChatMsgOffsetCount(-1)
        }
      }

    }

    if (IterableForLogMsg == (chatMsgOffsetCount - 20) && chatMsgOffsetCount > 0) {

      callApi()

    }


  }, [IterableForLogMsg])


  const shuffleMsgForAlert = (arr: TLogMsgApiSerializerResponse[], initialState: boolean = false): TLogMsgApiSerializerResponse[] => {

    if (arr.length > 0) {
      let i = 0;
      let uniqueGroups = [];
      let dataset = [];

      while (i < arr.length) {
        uniqueGroups = []

        while (i < arr.length && uniqueGroups.length < 3) {
          const groupName = arr[i].group_name;

          if (!uniqueGroups.includes(groupName)) {
            uniqueGroups.push(groupName);
            dataset.push(arr[i]);
          }

          i++;
        }
      }

      return dataset





    }

  }

  // Tooltip For Future
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));
  // console.log(logMsgArr, "alertMsg");

  return (
    <>
      <ToastContainer />
      {
        (loaderStatus) && <Loading />
      }
      <section className="dashboard_main">
        {
          (messageArr.length > 0) &&
          <div className="container-fluid">
            <div className="mb-search-icon" onClick={handleOpenSearchBar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#8E9DAD"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                />
              </svg>
            </div>
            <div id="overlay-search-overlay" className="overlay_of_search">
              <div
                id="overlay-search-popup"
                ref={focus}
                className="search_popup_modal"
              >
                <div className="popup-head"></div>
                <div className="popup-body">
                  <div className="search_bar_right dashboard-search">
                    <DashboardForm routeToSearchPage={routeToSearchPage} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row gx-3">
              <div className="col-lg-3 col-md-6 order-2 order-lg-1 mt-3 mt-lg-0">
                <div className="dashboard_main_left_section">
                  <div className="left_card">
                    <div className="left_card_title">
                      <div className="d-flex align-items-center">
                        <h5>Running Log Files</h5>
                        <Tooltip title={'Shows the latest messages received by the system.'} placement="right-start" arrow
                        >
                          <svg className="ms-1" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }} width={20} height={20} viewBox="0 0 36 36"><path fill="#fff" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                        </Tooltip>
                      </div>
                      {/* <span>20 Sep 2023</span> */}
                      <span>{dateFormatter()}</span>

                    </div>

                    <div className="left_card_body" key={34}>
                      {/* {console.log(messages,"messafe")} */}
                      {logMsgArr.length > 0 &&
                        logMsgArr.map((msg_item, msg_item_index) => {
                          if (msg_item_index <= 4) {
                            // setToggleState(0)
                            return (
                              // onClick={()=>{router.push({pathName:'/',query:{msg_id:msg_item?.id}})}}
                              <>
                                <Link
                                  href={{
                                    pathname: `/search`,
                                    query: {
                                      id: msg_item?.group_id, type: 'group',
                                      msg_id: msg_item?.message_id
                                    },
                                  }}
                                  className="inner_card_parent fadeout"
                                  id={`inner-card-parent-${msg_item?.message_id}`}
                                  key={msg_item_index}
                                  onMouseEnter={onMouseEnter}
                                  onMouseLeave={onMouseLeave}
                                >
                                  <div className="inner_card">
                                    <div className="inner_card_title">
                                      <div className="inner_card_title_span">
                                        <span className="inner_card_title_span_a">{`${msg_item?.group_name.length > 30 ? msg_item?.group_name.slice(0, 30) + '...' : msg_item?.group_name}`}</span>
                                      </div>
                                      <span className="inner_card_date d-flex align-items-center">
                                        {dateFormatter(msg_item?.chat_time)}
                                      </span>
                                    </div>
                                    <div className="inner_card_body">
                                      <div className="inner_card_body_maincontent">
                                        {/* <p>{msg_item?.message_text}</p> */}
                                        <p>
                                          {
                                            (msg_item?.message_text.length > 70 ? `${msg_item?.message_text.slice(0, 70)} ...` : msg_item?.message_text)
                                          }
                                        </p>
                                      </div>
                                      <div className="inner_card_group_risk">
                                        <span>Group Risk Score :</span>
                                        <div className="inner_card_group_risk_svg">
                                          {
                                            (msg_item && msg_item?.risk_score) ? (
                                              <>
                                                {/* <img
                                                  src={
                                                    msg_item.risk_score
                                                      ? `${riskFactorCalc(
                                                        msg_item.risk_score
                                                      ).photo.src
                                                      }`
                                                      : "/"
                                                  }
                                                  alt="risk score"
                                                /> */}

                                                {/* <span
                                                  className={`${msg_item.risk_score
                                                    ? `${riskFactorCalc(
                                                      msg_item.risk_score
                                                    )?.className
                                                    }`
                                                    : "/"
                                                    }`}
                                                > */}
                                                <span
                                                  className=''
                                                >
                                                  {msg_item.risk_score}
                                                </span>
                                              </>
                                            )
                                              :
                                              <span>N/A</span>
                                          }

                                        </div>
                                      </div>
                                      {
                                        msg_item.alpha2_code && (
                                          <div className="inner_card_country">
                                            <div className="inner_card_country_svg">
                                              <img
                                                // src={`${country.find((arr)=>arr.country==searchItem.country).country_flag_b64}`}
                                                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${msg_item.alpha2_code
                                                  }.svg`}
                                                className="img-fluid"
                                              ></img>
                                              {/* <p>{imgExtractor(msg_item)}</p> */}
                                            </div>
                                            {
                                              msg_item && msg_item?.entity?.country && (
                                                <span>
                                                  {msg_item?.entity?.country?.name}
                                                </span>
                                              )
                                            }
                                          </div>
                                        )
                                      }
                                    </div>
                                  </div>
                                </Link>
                              </>
                            );
                          }
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 order-1 order-lg-2">
                <div className="real_time_stat">
                  <div className="real_time_stat_title">
                    <h5>Real Time Stat</h5>
                  </div>
                  <div className="row gx-2">
                    <div className="col-xl-4 col-lg-12 col-md-12 col-12 gaugecomponent">

                      <GaugeComponent
                        type="semicircle"
                        minValue={36405}
                        maxValue={200000}
                        labels={{
                          tickLabels: {
                            hideMinMax: true,
                          },
                        }}
                        arc={{
                          colorArray: ['#108DE5'],
                          padding: 0.02,
                          subArcs: [{ limit: 36405 }, { limit: 50000 }, { limit: 100000 }, { limit: 150000 }, { limit: 200000 }],
                        }}
                        pointer={{ type: "blob", animationDelay: 0, animate: true, color: "#108DE5" }}
                        value={msgCounter}
                      />
                      <div
                        className="counttext">
                        Messages
                        <span>
                          <Tooltip title={'Total number of Messages'} arrow>
                            <svg className="" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#8E9DAD" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-12 col-md-12 col-12 gaugecomponent">

                      <GaugeComponent
                        type="semicircle"
                        minValue={2800}
                        maxValue={20000}
                        labels={{
                          tickLabels: {
                            hideMinMax: true,
                          },
                        }}
                        arc={{
                          colorArray: ['#108DE5'],
                          padding: 0.02,
                          subArcs: [{ limit: 4500 }, { limit: 8375 }, { limit: 12250 }, { limit: 16125 }, { limit: 20000 }],
                        }}
                        pointer={{ type: "blob", animationDelay: 0 }}
                        value={groupCounter}
                      />
                      <div
                        className="counttext"
                      >
                        Groups
                        <span>
                          <Tooltip title={'Total number of Groups'} arrow>
                            <svg className="" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#8E9DAD" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-12 col-md-12 col-12 gaugecomponent">

                      <GaugeComponent
                        type="semicircle"
                        minValue={319526}
                        maxValue={700000}
                        labels={{
                          tickLabels: {
                            hideMinMax: true,
                          },
                        }}
                        arc={{
                          colorArray: ['#108DE5'],
                          padding: 0.02,
                          subArcs: [{ limit: 319526 }, { limit: 400000 }, { limit: 500000 }, { limit: 600000 }, { limit: 700000 }],
                        }}
                        pointer={{ type: "blob", animationDelay: 0 }}
                        value={memberCounter}
                      />
                      <div className="counttext">
                        Entities
                        <span>
                          <Tooltip title={'Total number of Entities'} arrow>
                            <svg className="" xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#8E9DAD" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="map_section">
                  {
                    // (logFileHoverState.length<=0)&&
                    // <MapComponent logMsgArr={logMsgArr} />
                    logMsgArr && <MapComponent logMsgArr={logMsgArr} />
                  }
                  {/* <!-- here is for map implementation --> */}
                </div>
              </div>
              <div className="col-lg-3 col-md-6 order-3 order-lg-3 mt-3 mt-lg-0">
                <div className="search_bar_right dashboard-search">
                  <DashboardForm routeToSearchPage={routeToSearchPage} />
                </div>

                <div className="dashboard_main_left_section right_div">
                  <div className="left_card">
                    <div className="left_card_title">
                      <div className="d-flex align-items-center">
                        <h5>Alerts</h5>
                        <span>
                          <Tooltip title={'Shows messages, groups, and users that match your alerts conditions.'} arrow>
                            <svg className="ms-1" style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#fff" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </span>
                      </div>
                      <span>{dateFormatter()}</span>
                    </div>

                    <div className="left_card_body alert-section" key={12}>

                      {alertMsg && alertMsg?.map((msg_item, msg_item_index) =>

                        (msg_item_index <= 2) ?
                          <>
                            {/* <Tooltip title={msg_item?.message_text} placement="left-start"> */}
                            <Link
                              href={{
                                pathname: `/search`,
                                query: {
                                  id: msg_item?.group_id, type: 'group',
                                  msg_id: msg_item?.message_id
                                },
                              }}
                              className="alert-inner_card_parent"
                              id={`alert-inner-card-parent-${msg_item?.message_id}`}
                              key={msg_item_index}
                              onMouseEnter={onMouseEnter}
                              onMouseLeave={onMouseLeave}
                            >
                              <div className="inner_card">
                                <div className="inner_card_title">
                                  <div className="inner_card_title_span">
                                    <span className="inner_card_title_span_a">
                                      {`${msg_item?.group_name.length > 30 ? msg_item?.group_name.slice(0, 30) + '...' : msg_item?.group_name}`}
                                    </span>
                                  </div>
                                  <span className="inner_card_date">
                                    {dateFormatter(msg_item?.chat_time)}
                                  </span>
                                </div>
                                <div className="inner_card_body">
                                  <div className="inner_card_body_maincontent">
                                    {/* <p>{msg_item?.message_text}</p> */}

                                    <p>{msg_item?.message_text.length > 70 ? `${msg_item?.message_text.slice(0, 70)} ...` : msg_item?.message_text}</p>
                                  </div>
                                  <div className="inner_card_group_risk">
                                    <span>Group Risk Score :</span>
                                    <div className="inner_card_group_risk_svg">
                                      {
                                        msg_item && msg_item?.risk_score ? (
                                          <>
                                            {/* <img
                                              src={
                                                msg_item?.risk_score
                                                  ? `${riskFactorCalc(
                                                    msg_item.risk_score
                                                  ).photo.src
                                                  }`
                                                  : "/"
                                              }
                                              alt="risk score"
                                            /> */}
                                            <span

                                            >
                                              {msg_item.risk_score}
                                            </span>
                                          </>
                                        )
                                          :
                                          <span>N/A</span>
                                      }

                                    </div>
                                  </div>
                                  {
                                    msg_item?.alpha2_code && (
                                      <div className="inner_card_country">
                                        <div className="inner_card_country_svg">
                                          <img
                                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${msg_item?.alpha2_code || "US"
                                              }.svg`}
                                            className="img-fluid"
                                          ></img>
                                        </div>
                                        {
                                          msg_item && msg_item?.entity?.country && (
                                            <span>
                                              {msg_item?.entity?.country?.name}
                                            </span>
                                          )
                                        }
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            </Link>
                            {/* </Tooltip> */}
                          </>

                          : ''

                      )}
                    </div>
                  </div>
                </div>

                <div className="row gx-2">
                  <div className="col-6">
                    <div className="host_trend_cloud groups  ">
                      <div className="host_trend_cloud_title">
                        <div className="d-flex align-items-center">
                          <h5>Active Groups</h5>
                          <Tooltip title={'Top groups with the most new messages in the last 24 hours.'} arrow>
                            <svg className="ms-1" style={{ 'marginBottom': '8px', 'cursor': 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#fff" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="host_trend_cloud_body">
                        <div className="host_trend_cloud_content">
                          {

                            wordCloudArr
                              ?.filter(item =>
                                item?.type === "groups"
                                // item?.type === "entities" ||
                                // item?.type === "messages"
                              )
                              ?.slice(0, 5)
                              ?.map((item, itemIndex) => {
                                return (
                                  <Link
                                    key={itemIndex}
                                    href={{
                                      pathname:
                                        item?.type === "groups"
                                          // ? `/search/${(item as TGroupWordCloud).group_name}`
                                          ? `/search`
                                          : ``,
                                      query:
                                        item?.type !== "messages" && item?.type !== 'entities'
                                          ? {
                                            id:
                                              item?.type === "groups"
                                                ? (item as TGroupWordCloud).id

                                                : null,
                                            type:
                                              item?.type === "groups"
                                                ? "group"

                                                : null,
                                            // keyword:
                                            //   item?.type === "groups"
                                            //     ? (item as TGroupWordCloud).group_name

                                            //     : null,

                                          }
                                          : null,
                                    }}
                                  >
                                    {item?.type === "groups" ? (item as TGroupWordCloud).group_name : ""}
                                  </Link>
                                );
                              })

                          }

                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="host_trend_cloud entities">
                      <div className="host_trend_cloud_title">
                        <div className="d-flex align-items-center">
                          <h5>Active Entities</h5>
                          <Tooltip title={'Top phone numbers sending the most messages in the last 24 hours.'} arrow>
                            <svg className="ms-1" style={{ 'marginBottom': '8px', 'cursor': 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#fff" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="host_trend_cloud_body">
                        <div className="host_trend_cloud_content">
                          {wordCloudArr
                            ?.filter(item =>
                              // item?.type === "groups" ||
                              item?.type === "entities"
                              // item?.type === "messages"
                            )
                            ?.slice(0, 5)
                            ?.map((item, itemIndex) => {
                              return (
                                <Link
                                  key={itemIndex}
                                  href={{
                                    pathname:
                                      item?.type === "entities"
                                        // ? `/search/${(item as TGroupWordCloud).group_name}`
                                        ? `/search`
                                        : '',
                                    query:
                                      item?.type !== "messages" && item?.type !== "groups"
                                        ? {
                                          id:
                                            item?.type === "entities"
                                              ? (item as TEntityWordCloud).id
                                              : null,
                                          type:
                                            item?.type === "entities"
                                              ? "entity"
                                              : null,
                                          // keyword:
                                          //   item?.type === "entities"
                                          //     ? (item as TEntityWordCloud).phone_number
                                          //     : null,
                                        }
                                        : null,
                                  }}
                                >
                                  {item?.type === "entities" ? (item as TEntityWordCloud).phone_number : ""}
                                </Link>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="host_trend_cloud">
                  <div className="host_trend_cloud_title">
                    <div className="d-flex align-items-center">
                      <h5>Hosts Trend Cloud</h5>
                      <Tooltip title={"Word cloud of the most frequent words used across all groups (common words like 'and', 'the', etc. are excluded)."} arrow>
                        <svg className="ms-1" style={{ 'marginBottom': '8px', 'cursor': 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 36 36"><path fill="#fff" d="M18 6a12 12 0 1 0 12 12A12 12 0 0 0 18 6m-2 5.15a2 2 0 1 1 2 2a2 2 0 0 1-2.1-2ZM23 24a1 1 0 0 1-1 1h-7a1 1 0 1 1 0-2h2v-6h-1a1 1 0 0 1 0-2h4v8h2a1 1 0 0 1 1 1" className="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="host_trend_cloud_body">
                    <div className="host_trend_cloud_content">
                      {wordCloudArr
                        ?.filter(item =>
                          // item?.type === "groups" ||
                          // item?.type === "entities" ||
                          item?.type === "messages"
                        )
                        ?.slice(0, 30)
                        ?.map((item: any, itemIndex) => {
                          return (
                            <>
                              {
                                item?.word !== ".." && (
                                  <Link
                                    key={itemIndex}
                                    className={item.style}
                                    href={{
                                      pathname:
                                        item?.type === "messages"
                                          ? `/search/${(item as TMessageCloudData).word}`
                                          : ``,
                                      query:
                                        item?.type !== "messages"
                                          ? {
                                            id:
                                              item?.type === "groups"
                                                ? (item as TGroupWordCloud).id
                                                : item?.type === "entities"
                                                  ? (item as TEntityWordCloud).id
                                                  : "",
                                            type:
                                              item?.type === "groups"
                                                ? "group"
                                                : item?.type === "entities"
                                                  ? "entity"
                                                  : "",
                                            keyword:
                                              item?.type === "groups"
                                                ? (item as TGroupWordCloud).group_name
                                                : item?.type === "entities"
                                                  ? (item as TEntityWordCloud).phone_number
                                                  : "",
                                          }
                                          : null,
                                    }}
                                  >
                                    {item?.type === "messages" ? (item as TMessageCloudData).word : ""}
                                  </Link>
                                )
                              }
                            </>

                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </section>

    </>
  );
});

export default DashboardLeaf;
