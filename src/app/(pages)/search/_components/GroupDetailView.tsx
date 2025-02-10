import React, { useEffect, useState, useRef, memo } from 'react'
import { dateFormatter, timeout } from "@/utils/commonFunctions";

import Image from 'next/image';
import Highlighter from "react-highlight-words";
import $ from 'jquery'
import {
  riskFactorCalc,
  generatingOffsetAndLimitForApi,
  extractDataBasedOnPercentage,
  prepareObjectsWithStyle,
} from "@/helpers";
import {
  THeaders,
  TCustomApiProp,
  TApiData,
  TMessageCloudData,
  TGroupWordCloud,
  TEntityWordCloud,
  THttpMethod,
} from "@/types/type";
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
  TWordCloudObject,
} from "@/types/type";
import { ToastContainer, toast } from "react-toastify";
import { defaultImgPath, activity_graph_data, activity_graph_option, activity_graph_dataset, video_icon_path, audio_icon_path, pdf_icon_path } from '@/constants/index';
import Chart from "chart.js/auto";
// import { Line } from "react-chartjs-2";
import 'photoswipe/dist/photoswipe.css'


import "react-toastify/dist/ReactToastify.css";
import { getMediaType, activityGraphDataBuilder, handleTranslation, translateText } from '../helpers';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loading from '@/app/loading';
import { off } from 'process';
import { count } from 'console';
import { translateData } from '../types/type';
import Link from 'next/link';
//   import faker from 'faker';
import { Tooltip } from "@mui/material";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  // Tooltip,
  Legend
);
type TProps = {
  groupDetails: Record<string, any>,
  search_str: string,
  postSearchByKeyApiRequest: (
    data: Record<string, any>,
    endpoint: string,
    httpMethod: THttpMethod
  ) => Promise<TApiResponse | unknown>; // Define the function signature
  groupMedias: any[]
  setGroupMedias: React.Dispatch<React.SetStateAction<any[]>>,
  groupMessages: Record<string, any>,
  setGroupMessages: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  groupMembers: Record<string, any>,
  setGroupMembers: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  openLightBox: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  goToDetailsPage: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  activeTab: string,
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
  handleTabClick: (tabName: string) => void,
  detailSectionTabLoader: boolean,
  setDetailSectionTabLoader: React.Dispatch<React.SetStateAction<boolean>>,
  showMoreMediaOffsetCount: number,
  showMoreMessageOffsetCount: number,
  showMoreMemberOffsetCount: number,
  setShowMoreMessageOffsetCount: React.Dispatch<React.SetStateAction<number>>
  setShowMoreMediaOffsetCount: React.Dispatch<React.SetStateAction<number>>
  setShowMoreMemberOffsetCount: React.Dispatch<React.SetStateAction<number>>
  deletedData: any,
  dashboardmsgId: string,
  setdashboardmsgId: React.Dispatch<React.SetStateAction<string>>
}

const GroupDetailView = memo(({ groupDetails, search_str, postSearchByKeyApiRequest, setGroupMessages, groupMessages, setGroupMedias, groupMedias, groupMembers, setGroupMembers, openLightBox, goToDetailsPage, setActiveTab, deletedData,
  activeTab,
  handleTabClick, detailSectionTabLoader,
  setDetailSectionTabLoader,
  showMoreMediaOffsetCount,
  showMoreMessageOffsetCount,
  showMoreMemberOffsetCount,
  setShowMoreMessageOffsetCount,
  setShowMoreMediaOffsetCount,
  setShowMoreMemberOffsetCount,
  dashboardmsgId,
  setdashboardmsgId
}: TProps) => {

  const [membersApi, setMembersApi] = useState([])
  const [translateData, setTranslateData] = useState<Array<translateData>>([]);
  const [messagesID, setmessagesID] = useState<string>(dashboardmsgId)
  // const[groupsApi,setGroupsApi]=useState([])
  // const [groupMembers,setGroupMembers]=useState<Record<string, any>>({
  //   count:'0',
  //   result:[]
  // })


  const targetDivRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    msg: null,
    mem: null,
    media: null
  });
  // const [showMoreMediaOffsetCount,setShowMoreMediaOffsetCount]=useState<number>(0)
  // const [showMoreMessageOffsetCount,setShowMoreMessageOffsetCount]=useState<number>(0)
  // const [totalMessagesCount,setTotalMessages]=useState<Number>(0)



  const memberApiLimit = 10
  const messageApiLimit = dashboardmsgId ? 99999999 : 10
  const mediaApiLimit = 30
  const [searchMsgId, setsearchMsgId] = useState<number>()
  // const []
  // console.log("search msg id", dashboardmsgId);

  const callMemberApi = async (limit: number = memberApiLimit, offset: number) => {
    // console.log("call members apii")
    setDetailSectionTabLoader(true)
    const formData = new FormData();
    formData.append("id", groupDetails?.id);
    formData.append("offset", String(offset));
    formData.append("limit", String(limit));
    try {
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/members', 'post');
      // console.log(response, "response from member")
      setDetailSectionTabLoader(false)
      if (response?.status == "200") {
        // console.log("resp from member", { ...response?.data, result: [...groupMembers.result, ...response?.data?.result] })
        setGroupMembers({ ...response?.data, result: [...groupMembers.result, ...response?.data?.result] })
        offset = offset + limit

        if (+(response?.data?.count) > offset) {

          setShowMoreMemberOffsetCount(offset)
        }
        else {
          setShowMoreMemberOffsetCount(-1)
        }
      }
      else {

        const errorMessage: TErrorMessage = generalizedApiError;

        const toastErrorSettingDataCpy: TToastErrorSettingData =
          toastSettingData;
        toast.error(
          allowableServerErrors.includes(errorMessage)
            ? errorMessage
            : generalizedApiError,
          toastErrorSettingDataCpy
        )
      }
    }
    catch (error) {
      setDetailSectionTabLoader(false)
      console.error("error")
      const errorMessage: TErrorMessage =
        error instanceof Error ? error.message : "";

      const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );
    }
  }

  const callMediasApi = async (limit: number = mediaApiLimit, offset: number) => {
    // console.log("click", "clickkk")
    setDetailSectionTabLoader(true)
    const formData = new FormData();
    formData.append("id", groupDetails?.id);
    formData.append("offset", String(offset));
    formData.append("limit", String(limit));
    try {
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/medias', 'post');
      // console.log(response, "respobsemediaa")
      setDetailSectionTabLoader(false)
      if (response?.status == "200") {
        const modifiedData = response?.data?.result.map((groupMedia) => {
          const media_type = getMediaType(groupMedia?.media_url || '')
          return ({ ...groupMedia, media_type })
        })
        setGroupMedias([...groupMedias, ...modifiedData]);
        offset = offset + limit;
        if (+(response?.data?.count) > offset) {

          setShowMoreMediaOffsetCount(offset)
        }
        else {
          setShowMoreMediaOffsetCount(-1)
        }
      }
      else {

        const errorMessage: TErrorMessage = generalizedApiError;

        const toastErrorSettingDataCpy: TToastErrorSettingData =
          toastSettingData;
        toast.error(
          allowableServerErrors.includes(errorMessage)
            ? errorMessage
            : generalizedApiError,
          toastErrorSettingDataCpy
        )
      }
    }
    catch (error) {
      setDetailSectionTabLoader(false)

      console.error("error")
      const errorMessage: TErrorMessage =
        error instanceof Error ? error.message : "";

      const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );



    }

  }

  const callMessagesApi = async (limit?: number, offset?: number) => {
    setDetailSectionTabLoader(true)
    // console.log("call messages apii")
    try {
      const formData = new FormData();

      formData.append("id", groupDetails?.id);
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/messages', 'post');
      setDetailSectionTabLoader(false)
      if (response?.status == "200") {
        // console.log(response, "resp of message", groupMessages)
        // console.log(response?.data?.result, "resp of message");
        let indexNo = await response?.data?.result.findIndex(item => item.id == dashboardmsgId);
        await setsearchMsgId(indexNo)
        // console.log(indexNo, "indexNo");

        setGroupMessages({ ...response?.data, result: [...groupMessages.result, ...response?.data?.result] })

        // console.log(response?.data, "dataaa of group messages", { ...response?.data, result: [...groupMessages.result, ...response?.data?.result] })
        // setDetailPageMedia(prev => ({ ...prev, ...response?.data?.result }));
        let mediaArr = response?.data?.result.filter((item: any) => {
          return item?.message_media !== null && item?.message_text == null && item.message_media?.media_type
        })
        setGroupMedias((prev) => {
          const existingIds = new Set(prev.map((item) => item.id)); // Assuming each item has an `id`
          const newItems = mediaArr.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        // console.log(mediaArr, "mediaArr");

        offset = offset + limit

        if (+(response?.data?.count) > offset) {

          setShowMoreMessageOffsetCount(offset)
        }
        else {
          setShowMoreMessageOffsetCount(-1)
        }



      }
      else {

        const errorMessage: TErrorMessage = generalizedApiError;

        const toastErrorSettingDataCpy: TToastErrorSettingData =
          toastSettingData;
        toast.error(
          allowableServerErrors.includes(errorMessage)
            ? errorMessage
            : generalizedApiError,
          toastErrorSettingDataCpy
        )
      }
    }
    catch (error) {
      setDetailSectionTabLoader(false)

      console.error("error", error)
      const errorMessage: TErrorMessage =
        error instanceof Error ? error.message : "";

      const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
      toast.error(
        allowableServerErrors.includes(errorMessage)
          ? errorMessage
          : generalizedApiError,
        toastErrorSettingDataCpy
      );



    }

  }
  useEffect(() => {
    // console.log(activeTab, showMoreMemberOffsetCount, "activetab-----------")

    let cloneActiveTab = activeTab.split("-")[0]
    //   let cloneActiveTab=activeTab[0]
    //   if(cloneActiveTabArr.length>=1){
    // cloneActiveTab=cloneActiveTabArr[0]
    //   }

    if (cloneActiveTab === "messages_area" && showMoreMessageOffsetCount == 0) {
      // setGroupMessages({count:'0',result:[]})
      setActiveTab('messages_area')
      callMessagesApi(messageApiLimit, showMoreMessageOffsetCount);

    }

    if (cloneActiveTab === "members_area" && showMoreMemberOffsetCount == 0) {
      callMemberApi(memberApiLimit, showMoreMemberOffsetCount);
    }


    if (cloneActiveTab === "medias_area" && showMoreMediaOffsetCount == 0) {
      callMediasApi(mediaApiLimit, showMoreMediaOffsetCount);
    }



  }, [activeTab]);

  const groupIdextractor = async () => {
    const index = await groupMessages?.result.filter(item => item.id == dashboardmsgId);
    // console.log(index, 'kadwda');
    return index
  }
  //     useEffect(() => {
  //         $(".tab-nav li").click(function () {
  //           $(".tab-nav li.active").removeClass("active");
  //           //   setUpperCountOfArrForNav();
  //           var currentClass = $(this).attr("class");
  //           console.log(currentClass,"currentclasss")
  //           let regxMedia = /medias_area/i;
  //           let regxMessage=/messages_area/i
  //           let regxMember=/member_area/i



  //           const  callMediasApi=async()=>{
  //             console.log("click","clickkk")

  //             const formData = new FormData();

  //             formData.append("id", groupDetails?.id);
  //             // formData.append("id", "c20ad4d76fe97759aa27a0c99bff6710");


  //             formData.append("offset", "0");

  //     try{
  //         let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'group/medias','post');
  //     console.log(response,"respobsemediaa")
  //         if(response?.status=="200"){

  //            const modifiedData=  response?.data?.result.map((groupMedia)=>{

  //                const media_type= getMediaType(groupMedia?.media_url||'')
  //                return({...groupMedia,media_type})

  //             })
  //     console.log(modifiedData,"modifiesss")
  //             setGroupMedias(modifiedData)



  //           }
  //           else{

  //             const errorMessage: TErrorMessage =generalizedApiError ;

  //             const toastErrorSettingDataCpy: TToastErrorSettingData =
  //               toastSettingData;
  //             toast.error(
  //               allowableServerErrors.includes(errorMessage)
  //                 ? errorMessage
  //                 : generalizedApiError,
  //               toastErrorSettingDataCpy
  //             )
  //           }
  //         }
  //     catch(error){
  //         console.error("error")
  //         const errorMessage: TErrorMessage =
  //         error instanceof Error ? error.message : "";

  //       const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
  //       toast.error(
  //         allowableServerErrors.includes(errorMessage)
  //           ? errorMessage
  //           : generalizedApiError,
  //         toastErrorSettingDataCpy
  //       );



  //     }

  //           }

  //           const callMessagesApi=async()=>{

  // console.log("call messages apii")

  //             try{
  //                 const formData = new FormData();

  //                 formData.append("id", groupDetails?.id);
  //                 formData.append("offset", "0");
  //                 let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'group/messages','post');

  //                 if(response?.status=="200"){

  //                     console.log(response?.data,"dataaa of group messages")
  //                     setGroupMessages(response?.data)



  //                   }
  //                   else{

  //                     const errorMessage: TErrorMessage =generalizedApiError ;

  //                     const toastErrorSettingDataCpy: TToastErrorSettingData =
  //                       toastSettingData;
  //                     toast.error(
  //                       allowableServerErrors.includes(errorMessage)
  //                         ? errorMessage
  //                         : generalizedApiError,
  //                       toastErrorSettingDataCpy
  //                     )
  //                   }
  //                 }
  //             catch(error){
  //                 console.error("error")
  //                 const errorMessage: TErrorMessage =
  //                 error instanceof Error ? error.message : "";

  //               const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
  //               toast.error(
  //                 allowableServerErrors.includes(errorMessage)
  //                   ? errorMessage
  //                   : generalizedApiError,
  //                 toastErrorSettingDataCpy
  //               );



  //             }

  //           }


  //           if (regxMedia.test(currentClass)) {

  //             console.log("media under")

  //             callMediasApi();
  //             // setUpperCountOfArrForNav(12);
  //           }


  //           else if(regxMessage.test(currentClass))
  //           {
  //             console.log("message under")

  //             callMessagesApi()

  //           }
  //           else {


  //             // setUpperCountOfArrForNav(6);
  //           }
  //           //   if
  //           $(this).addClass("active");
  //         });
  //         $(".tab-nav li:first-child").addClass("active");
  //       }, [activeTab]);

  const clickJoinGroup = (e) => {
    $("#overlay-join-overlay").css("display", "block");
    $("#overlay-join-popup").css("display", "block");
  };

  const showMoreMemberFunction = (): void => {
    callMemberApi(memberApiLimit, showMoreMemberOffsetCount);
  }


  const showMoreMediasFunction = (): void => {
    callMediasApi(mediaApiLimit, showMoreMediaOffsetCount);
  }
  const showMoreMessagesFunction = (): void => {
    // console.log("inner pagee")
    callMessagesApi(messageApiLimit, showMoreMessageOffsetCount);
  }


  const scrollToBottom = (targetRef: HTMLDivElement | null) => {
    if (targetRef) {
      targetRef.scrollTo({
        top: targetRef.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  const ArabicTranslation = async (message: string, messageId: string) => {
    // Check if the message has already been translated
    const existingTranslation = translateData.find(item => item.messageId === messageId);

    if (existingTranslation && existingTranslation.status) {
      // If already translated, clear the translation (remove the object from the array)
      setTranslateData(prevData =>
        prevData.filter(item => item.messageId !== messageId)
      );
    } else {
      let response = await translateText(message, messageId) as string;
      setTranslateData(prevData => [
        ...prevData,
        { messageId, message: response, status: true }
      ]);
      // If not translated yet, proceed with translation
      // let typeOfMsg = await handleTranslation(message, messageId) as string;

      // if (typeOfMsg === "Arabic" && typeOfMsg !== undefined) {

      // } else {
      //   // If translation failed, add a status as false for this messageId
      //   setTranslateData(prevData => [
      //     ...prevData,
      //     { messageId, message: '', status: false }
      //   ]);
      // }

      // if (translateMsg !== undefined) {
      //   // Add the new translation object to the array
      //   setTranslateData(prevData => [
      //     ...prevData,
      //     { messageId, message: translateMsg, status: true }
      //   ]);
      // } else {
      //   // If translation failed, add a status as false for this messageId
      //   setTranslateData(prevData => [
      //     ...prevData,
      //     { messageId, message: '', status: false }
      //   ]);
      // }
    }
  };


  // Function to format the numbered list with <p> tags and sanitize the content inside


  function chatGptDecodeFormattedText(input) {
    let html = input
      // Headings: Convert ###, ##, and # to <h3>, <h2>, and <h1> respectively
      .replace(/^###\s?(.*)$/gm, '<h3>$1</h3>')
      .replace(/^##\s?(.*)$/gm, '<h2>$1</h2>')
      .replace(/^#\s?(.*)$/gm, '<h1>$1</h1>')

      // Bold text: Convert **text** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

      // Italic text: Convert *text* to <i>
      .replace(/\*(.*?)\*/g, '<i>$1</i>')

      // Lists: Convert lines starting with "-" or "•" to <ul><li>
      .replace(/^- (.*?)$/gm, '<ul><li>$1</li></ul>')
      .replace(/• (.*?)$/gm, '<ul><li>$1</li></ul>')

      // Merge consecutive <ul> tags
      .replace(/<\/ul>\s*<ul>/g, '')

      // Paragraphs: Add <p> around remaining text blocks
      .replace(/(?<!<\/?(h\d|ul|li)>)^[^\n]+$/gm, '<p>$&</p>');

    // Return the generated HTML
    return html;
  }
  useEffect(() => {
    if (groupMembers?.result.length > 0 || groupMessages?.result.length > 0 || groupMedias?.length > 0) {
      Object.values(targetDivRefs.current).forEach(scrollToBottom);
    }

    if (groupMessages?.result.length > 0) {
      setTimeout(() => {
        setdashboardmsgId('')
      }, 7000)
    }
  }, [groupMembers, groupMessages, groupMedias]);

  console.log(groupMessages, "groupMessages");
  console.log(searchMsgId);

  return (
    <div>
      <div
        className="search_message_group_details group-detail"
      >
        <div className="row">
          <div className="col-md-12 col-lg-6">
            <div className="search_message_group_details_header">
              <div className="search_message_group_details_header_image">
                {/* <img src="./assets/images/adw.png" className="img-fluid"/> */}

                <img
                  src={`${groupDetails?.profile_image_url || "/asset/default_img/group_img.jpg"}`}
                  // fill={true}
                  className="img-fluid"
                  alt="p"
                ></img>
              </div>
              <p className="content-width-setter">
                {/* {detailInfoObj.name} */}

                {/* <span>doe</span> */}

                <Highlighter
                  highlightClassName="uni-active"
                  searchWords={[search_str]}
                  autoEscape={true}
                  textToHighlight={`${groupDetails?.group_name}`}
                />
              </p>
            </div>
            <div className="message_subcontent_risk">
              <div className="sender">
                <div className="member-count">
                  <span>Member Count:</span>
                  <p>{groupDetails?.members_count}</p>
                </div>
                <div className="member-count">
                  <span>Classification:</span>
                  <p>{groupDetails?.classification ? groupDetails?.classification : "N/A"}</p>
                </div>
              </div>

              <div className="inner_card_group_risk">
                <span>Risk Score: </span>
                {/* {
                  `${groupDetails?.risk_score}%`
                } */}
                <div className="inner_card_group_risk_svg">
                  {
                    groupDetails && groupDetails?.risk_score ? (
                      <>
                        {/* <img
                          src={`${riskFactorCalc(groupDetails?.risk_score)?.photo.src
                            }`}
                          alt="risk_image"
                        /> */}
                        <p
                        // className={`${riskFactorCalc(
                        //   groupDetails?.risk_score
                        // )?.className
                        //   }`}
                        >
                          {`${groupDetails?.risk_score}`}
                        </p>
                      </>
                    )
                      :
                      <p>N/A</p>
                  }

                </div>
              </div>
            </div>

            <div className="join-group">
              {
                groupDetails?.joinlink ?
                  <>
                    <Link href={groupDetails?.joinlink ? groupDetails?.joinlink : "javascript:void(0);"} className='join-grp-a' target={groupDetails?.joinlink ? '_blank' : ""}>
                      <button className="join-grp-btn" disabled={groupDetails?.joinlink ? false : true}>
                        JOIN LINK
                      </button>
                    </Link>
                  </>
                  :
                  <Tooltip
                    title={"Join Link is not available for this group"}
                    placement="top"
                    arrow
                  >
                    <Link href={groupDetails?.joinlink ? groupDetails?.joinlink : "javascript:void(0);"} className='join-grp-a' target={groupDetails?.joinlink ? '_blank' : ""}>
                      <button className="join-grp-btn" disabled={groupDetails?.joinlink ? false : true}>
                        JOIN LINK
                      </button>
                    </Link>

                  </Tooltip>
              }

            </div>
          </div>
          <div className="col-md-12 col-lg-6">
            <div className="group_inner_chart-p">
              <div className="group_inner_chart">
                <Line
                  data={groupDetails?.activity_graph_data}
                  options={groupDetails?.activity_graph_option}
                />
              </div>
              <div className="group_inner_chart_float_content">
                <span>Activity Patterns</span>
              </div>
            </div>
          </div>
        </div>
        <div className="wrapper tab-wrapper new-tab-mod">
          {
            detailSectionTabLoader && <Loading />
          }
          <div className="tab-panel">
            <ul className="tab-nav">

              <li
                className={activeTab === "messages_area" ? "active" : ""}
                onClick={() => handleTabClick("messages_area")}>
                <span className="tab_nav_span">Messages</span>
                <div className="content-holder">
                  <div className="search_group_details_main_card">
                    <div className="search_group_details_main_card_body" ref={(el) => { targetDivRefs.current.msg = el; }}>
                      {groupMessages?.result?.length > 0 ? (


                        searchMsgId > 0 ? (

                          groupMessages.result.slice(0, searchMsgId + 2).map((item, index) => {
                            const isMediaAvailable = !item?.message_text && item?.message_media;

                            return (

                              <div key={index} className={`search_group_details_inner_card relative_pos ${Object.keys(item).includes('is_deleted') && item?.is_deleted == '1' ? "deleted" : ""}`}
                              >
                                {/* <span>{item?.id}'/'{searchMsgId} '/' {index}</span> */}
                                {/* Overlay for navigating to details */}
                                <div className="search_result_people_overlay" onClick={goToDetailsPage} id={`message-${item.id}`}></div>
                                {/* Entity Profile Image */}
                                <div className="search_group_details_inner_card_image details-clickable-img-zIndex">
                                  <img onClick={goToDetailsPage} id={`entity-${item?.entity?.id}`} src={`${item?.entity?.profile_image_url[0]}`} className="img-fluid" alt="people image" />
                                </div>

                                {/* Message Content */}
                                <div className="search_group_details_inner_card_content">
                                  {item?.message_text ? (
                                    item?.id === messagesID ? (
                                      <p className="msg-uni-active-p">
                                        <Highlighter
                                          highlightClassName="uni-active"
                                          searchWords={[item?.message_text]}
                                          autoEscape={true}
                                          textToHighlight={`${item?.message_text}`}
                                        />
                                      </p>
                                    )
                                      :
                                      <p>
                                        {item?.message_text}
                                      </p>

                                  ) : (
                                    isMediaAvailable &&
                                    (Array.isArray(item.message_media) ? (
                                      item.message_media.map((media, mediaIndex) => {
                                        const mediaType = media.media_type.split("/")[0]; // Extract main type (image, video, etc.)
                                        console.log(mediaType);
                                        return (
                                          <div key={mediaIndex} className="media-container">
                                            {mediaType === "image" ? (
                                              <img
                                                src={media.thumbnail_url || media.media_url}
                                                alt="media thumbnail"
                                                className="img-fluid"
                                                onClick={openLightBox}  // Update: Use media URL for lightbox
                                                id={`id-${media?.id}`}
                                              />
                                            ) : mediaType === "video" ? (
                                              <video
                                                controls
                                                className="img-fluid"
                                                // onClick={openLightBox}
                                                id={`id-${media?.id}`} // Update: Use media URL for lightbox
                                              >
                                                <source src={media.media_url} type={media.media_type} />
                                                Your browser does not support the video tag.
                                              </video>
                                            ) : mediaType === "audio" ? (
                                              <audio controls className="audio-player">
                                                <source src={media.media_url} type={media.media_type} />
                                                Your browser does not support the audio tag.
                                              </audio>
                                            ) : (
                                              <div className="unsupported-media">
                                                <p>Unsupported media type</p>
                                              </div>
                                            )}
                                            <p>Media Type: {media.media_type.split("/")[1]}</p>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="media-container">
                                        {(() => {
                                          const eachMediaType = item.message_media?.media_type.split("/")[0]; // Extract main type
                                          if (eachMediaType === "image") {
                                            return (
                                              <img
                                                src={item.message_media.media_url || item.message_media.thumbnail_url}
                                                alt="media thumbnail"
                                                className="img-fluid"
                                                id={`id-${item?.id}`}
                                                onClick={openLightBox}  // Update: Use media URL for lightbox
                                              />
                                            );
                                          } else if (eachMediaType === "video") {
                                            return (
                                              <div className="media-gallery-card">
                                                <div className="media-gallery-card-inner-img">
                                                  <img
                                                    src={`${video_icon_path || item?.message_media?.thumbnail_url}`}
                                                    className="img-fluid"
                                                    onClick={openLightBox}  // Update: Use media URL for lightbox
                                                    id={`id-${item?.id}`}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          } else if (["document", "application"].includes(eachMediaType)) {
                                            return (
                                              <div className="media-gallery-card">
                                                <div className="media-gallery-card-inner-img">
                                                  <img
                                                    src={`${pdf_icon_path}`}
                                                    className="img-fluid"
                                                    onClick={openLightBox}  // Update: Use media URL for lightbox
                                                    id={`id-${item?.id}`}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          } else if (eachMediaType === "audio") {
                                            return (
                                              <div className="media-gallery-card">
                                                <div className="media-gallery-card-inner-img">
                                                  <img
                                                    src={`${audio_icon_path}`}
                                                    className="img-fluid"
                                                    onClick={openLightBox}  // Update: Use media URL for lightbox
                                                    id={`id-${item?.id}`}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div className="unsupported-media">
                                                <p>Unsupported media type</p>
                                              </div>
                                            );
                                          }
                                        })()}
                                      </div>
                                    ))
                                  )}

                                  {/* Footer Section with Phone and Timestamp */}
                                  <div className="d-flex justify-content-between">
                                    <span>{item?.entity?.phone_number}</span>
                                    <span>{dateFormatter(item?.timestamp)} | {dateFormatter(item?.timestamp, true)}</span>
                                  </div>

                                  {/* Translator Button */}
                                  <div className="translator-btn">
                                    {/* {!item?.message_media && (
                                      (
                                        item?.language != 'en' && item?.language != 'km' && item?.language != 'da' && item?.language != 'unknown' ?
                                          <span
                                            onClick={() => ArabicTranslation(item?.message_text, item?.id)}
                                            className={
                                              translateData.some(
                                                (translation) =>
                                                  translation.messageId === item?.id && translation.status
                                              )
                                                ? "active"
                                                : ""
                                            }
                                          >
                                            Translate
                                          </span>
                                          : ''
                                      )
                                    )} */}
                                    {
                                      (item?.language != 'en' && item?.language != 'km' && item?.language != 'da' && item?.language != 'unknown' && item?.language != 'zh' && item?.language) || (item?.language == 'ja') ?
                                        <span
                                          onClick={() => ArabicTranslation(item?.message_text, item?.id)}
                                          className={
                                            translateData.some(
                                              (translation) =>
                                                translation.messageId === item?.id && translation.status
                                            )
                                              ? "active"
                                              : ""
                                          }
                                        >
                                          Translate
                                        </span>
                                        : ''
                                    }
                                  </div>

                                  {/* Translated Message Section */}
                                  {translateData
                                    .filter(
                                      (translation) =>
                                        translation.messageId === item?.id && translation.status
                                    )
                                    .map((translation) => (
                                      <div className="translated-msg-section" id="translateSec" key={translation.messageId}>
                                        <p>{translation.message}</p>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            );
                          })
                        )
                          : (
                            groupMessages.result.map((item, index) => {
                              const isMediaAvailable = item?.message_media;

                              return (
                                <div key={index} className={`search_group_details_inner_card relative_pos ${Object.keys(item).includes('is_deleted') && item?.is_deleted == '1' ? "deleted" : ""}`}
                                >

                                  {/* Overlay for navigating to details */}
                                  <div className="search_result_people_overlay" onClick={goToDetailsPage} id={`message-${item.id}`}></div>

                                  {/* Entity Profile Image */}
                                  <div className="search_group_details_inner_card_image details-clickable-img-zIndex">
                                    <img onClick={goToDetailsPage} id={`entity-${item?.entity?.id}`} src={`${item?.entity?.profile_image_url[0]}`} className="img-fluid" alt="people image" />
                                  </div>

                                  {/* Message Content */}
                                  <div className="search_group_details_inner_card_content">
                                    {item?.message_text ? (
                                      item?.id === messagesID ? (
                                        <p className="msg-uni-active-p">
                                          <Highlighter
                                            highlightClassName="uni-active"
                                            searchWords={[item?.message_text]}
                                            autoEscape={true}
                                            textToHighlight={`${item?.message_text}`}
                                          />
                                        </p>
                                      )
                                        :
                                        <p>
                                          {item?.message_text}
                                        </p>

                                    ) : (
                                      isMediaAvailable &&
                                      (Array.isArray(item.message_media) ? (
                                        item.message_media.map((media, mediaIndex) => {
                                          const mediaType = media.media_type.split("/")[0];



                                          // Extract main type (image, video, etc.)
                                          return (
                                            <div key={mediaIndex} className="media-container">
                                              {mediaType === "image" ? (
                                                <img
                                                  src={media.thumbnail_url || media.media_url}
                                                  alt="media thumbnail"
                                                  className="img-fluid"
                                                  onClick={openLightBox}  // Update: Use media URL for lightbox
                                                  id={`id-${media?.id}`}
                                                />
                                              ) : mediaType === "video" ? (
                                                <video
                                                  controls
                                                  className="img-fluid"
                                                  // onClick={openLightBox}
                                                  id={`id-${media?.id}`} // Update: Use media URL for lightbox
                                                >
                                                  <source src={media.media_url} type={media.media_type} />
                                                  Your browser does not support the video tag.
                                                </video>
                                              ) : mediaType === "audio" ? (
                                                <audio controls className="audio-player">
                                                  <source src={media.media_url} type={media.media_type} />
                                                  Your browser does not support the audio tag.
                                                </audio>
                                              ) : (
                                                <div className="unsupported-media">
                                                  <p>Unsupported media type</p>
                                                </div>
                                              )}
                                              <p>Media Type: {media.media_type.split("/")[1]}</p>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="media-container">
                                          {(() => {
                                            const eachMediaType = item.message_media?.media_type.split("/")[0]; // Extract main type
                                            console.log(eachMediaType, "mediaType");
                                            if (eachMediaType === "image") {
                                              return (
                                                <img
                                                  src={item.message_media.media_url || item.message_media.thumbnail_url}
                                                  alt="media thumbnail"
                                                  className="img-fluid"
                                                  id={`id-${item?.id}`}
                                                  onClick={openLightBox}  // Update: Use media URL for lightbox
                                                />
                                              );
                                            } else if (eachMediaType === "video") {
                                              return (
                                                <div className="media-gallery-card">
                                                  <div className="media-gallery-card-inner-img">
                                                    <img
                                                      src={`${video_icon_path || item?.message_media?.thumbnail_url}`}
                                                      className="img-fluid"
                                                      onClick={openLightBox}  // Update: Use media URL for lightbox
                                                      id={`id-${item?.id}`}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            } else if (["document", "application"].includes(eachMediaType)) {
                                              return (
                                                <div className="media-gallery-card">
                                                  <div className="media-gallery-card-inner-img">
                                                    <img
                                                      src={`${pdf_icon_path}`}
                                                      className="img-fluid"
                                                      onClick={openLightBox}  // Update: Use media URL for lightbox
                                                      id={`id-${item?.id}`}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            } else if (item.message_media?.media_type == 'unknown' || eachMediaType === "audio") {
                                              return (
                                                <div className="media-gallery-card">
                                                  <div className="media-gallery-card-inner-img">
                                                    <img
                                                      src={`${audio_icon_path}`}
                                                      className="img-fluid"
                                                      onClick={openLightBox}  // Update: Use media URL for lightbox
                                                      id={`id-${item?.id}`}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div className="unsupported-media">
                                                  <p>Unsupported media type</p>
                                                </div>
                                              );
                                            }
                                          })()}
                                        </div>
                                      ))
                                    )}

                                    {/* Footer Section with Phone and Timestamp */}
                                    <div className="d-flex justify-content-between">
                                      <span>{item?.entity?.phone_number}</span>
                                      <span>{dateFormatter(item?.timestamp)} | {dateFormatter(item?.timestamp, true)}</span>
                                    </div>

                                    {/* Translator Button */}
                                    <div className="translator-btn">
                                      {/* {!item?.message_media && (
                                        (
                                          item?.language !== 'en' && item?.language !== 'km' && item?.language !== 'zh' && item?.language !== 'da' && item?.language !== 'unknown' ?
                                            <span
                                              onClick={() => ArabicTranslation(item?.message_text, item?.id)}
                                              className={
                                                translateData.some(
                                                  (translation) =>
                                                    translation.messageId === item?.id && translation.status
                                                )
                                                  ? "active"
                                                  : ""
                                              }
                                            >
                                              Translate
                                            </span>
                                            : ''
                                        )
                                      )} */}
                                      {
                                        (item?.language !== 'en' && item?.language !== 'km' && item?.language !== 'da' && item?.language != 'zh' && item?.language !== 'unknown' && item?.language) || (item?.language == 'ja') ?
                                          <span
                                            onClick={() => ArabicTranslation(item?.message_text, item?.id)}
                                            className={
                                              translateData.some(
                                                (translation) =>
                                                  translation.messageId === item?.id && translation.status
                                              )
                                                ? "active"
                                                : ""
                                            }
                                          >
                                            Translate
                                          </span>
                                          : ''
                                      }
                                    </div>

                                    {/* Translated Message Section */}
                                    {translateData
                                      .filter(
                                        (translation) =>
                                          translation.messageId === item?.id && translation.status
                                      )
                                      .map((translation) => (
                                        <div className="translated-msg-section" id="translateSec" key={translation.messageId}>
                                          <p>{translation.message}</p>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              );
                            })
                          )

                      ) : (
                        <div className="no_data_text">
                          <p>No data to show</p>
                        </div>
                      )}
                    </div>
                    {
                      showMoreMessageOffsetCount > 0 &&
                      <div className="search_result_show_more">
                        <a onClick={() => showMoreMessagesFunction()} href="javascript:void(0)">Show More</a>
                      </div>
                    }
                  </div>
                </div>
              </li>
              <li
                className={activeTab.split("-")[0] === "members_area" ? "active" : ""}
                onClick={() => handleTabClick("members_area")}>
                <span className="tab_nav_span">Members</span>
                <div className="content-holder pt-3">
                  <div className="tab_members_card">

                    <div className="tab_members_card_wrapper" ref={(el) => { targetDivRefs.current.mem = el; }}>
                      {
                        (groupMembers?.result.length > 0) ?
                          groupMembers?.result
                            .map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className="tab_members_card_inner_lists relative_pos"
                                >
                                  <div className="search_result_people_overlay" onClick={goToDetailsPage} id={`entity-${item?.entity?.id}`}></div>
                                  <div className="tab_members_card_inner_list_content">
                                    <div className="tab_members_card_inner_lists_image ">
                                      <img
                                        src={`${item?.entity?.profile_image_url[0] || "/asset/default_img/default_img.jpg"}`}
                                        className="img-fluid"
                                        alt=""
                                      ></img>
                                    </div>
                                    <div className="tab_members_card_inner_lists_content">
                                      <div className="tab_members_card_inner_lists_left_content">
                                        <p>{item?.entity?.phone_number}</p>
                                        <span>{item?.entity?.phone_number}</span>
                                        <div className="flag_date">
                                          {(item && item?.entity?.country) &&
                                            <>
                                              <div className="flag">
                                                <img
                                                  src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.entity?.country?.alpha2_code}.svg`}
                                                  className="img-fluid"
                                                ></img>
                                              </div>
                                              <span>
                                                {item?.entity?.country?.name}
                                              </span>
                                            </>
                                          }


                                        </div>
                                      </div>
                                      <div className="tab_members_card_inner_lists_right_content"></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }) :
                          <div className="no_data_text">
                            <p>No data to show</p>
                          </div>


                      }
                    </div>
                    {
                      showMoreMemberOffsetCount > 0 &&
                      <div className="search_result_show_more">
                        <a onClick={() => showMoreMemberFunction()} href="javascript:void(0)">Show More</a>
                      </div>
                    }
                  </div>
                </div>
              </li>

              <li
                className={activeTab === "medias_area" ? "active" : ""}
                onClick={() => handleTabClick("medias_area")}>

                <span className="tab_nav_span">Media</span>
                <div className="content-holder pt-3">
                  <div className="media_gallery_card">
                    <div className="row gx-2" ref={(el) => { targetDivRefs.current.media = el; }}>
                      {/* <div className="col-lg-3">
                    
                        <div className="media_gallery_card_inner"> */}

                      {/* {
                        <Box >
                        <Masonry columns={5}  spacing={1}> */}
                      {/* {/ video_thumbnails /}
                         {/ <Gallery> /} */}

                      {
                        (groupMedias?.length > 0) ?
                          // .slice(0, upperCountOfArr)
                          groupMedias.map((eachMediaObj, eachMediaObjIndex) => {
                            const mediaType = eachMediaObj?.message_media?.media_type?.split("/")[0];

                            return mediaType == "video" ? (


                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img ">
                                    <img
                                      src={`${video_icon_path || eachMediaObj?.message_media?.thumbnail_url}`}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}
                                    />
                                  </div>
                                </div>
                              </div>





                            ) : mediaType == "document" || mediaType == "application" ? (
                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${pdf_icon_path || eachMediaObj?.message_media?.thumbnail_url}`}
                                      // fill={true}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : mediaType == "audio" ? (
                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${audio_icon_path || eachMediaObj?.message_media?.thumbnail_url}`}
                                      // fill={true}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}

                                    />
                                  </div>
                                </div>
                              </div>
                            ) : mediaType == "image" ? (




                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${eachMediaObj?.message_media?.media_url || eachMediaObj?.message_media?.thumbnail_url}`}
                                      // fill={true}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}
                                    />
                                  </div>
                                </div>
                              </div>
                              //                             <Item 

                              //                         key={eachMediaObjIndex}
                              //                         original={`/${media_path}/${eachMediaObj.thumbnail_img}`}


                              //                         width="1024"
                              //                           height="768"
                              //                       >




                              // {({ ref, open }) => (
                              //             <div
                              //               ref={ref}
                              //               onClick={(e) => {
                              //                 console.log("eeeee",e)
                              //                 e.preventDefault();
                              //                 open(e);
                              //               }}
                              //               className="col-lg-3"
                              //             >
                              //               <div className="media_gallery_card_inner">
                              //                 <div className="media_gallery_card_inner_img">
                              //                   <img
                              //                     src={`/${media_path}/${eachMediaObj.thumbnail_img}`}
                              //                     className="img-fluid"
                              //                   />
                              //                 </div>
                              //               </div>
                              //             </div>
                              //           )}
                              //                             </Item>
                            ) : null;
                          }) :
                          <div className="no_data_text">
                            <p>No data to show</p>
                          </div>

                      }
                      {/* {/ </Gallery> /} */}

                      {/* </Masonry>
                        </Box>
                        
                        } */}
                      {/* <div className="media_gallery_card_inner_img">
                                        <img src="./assets/images/555.png"
                                            className="img-fluid"/>
                                    </div> */}
                      {/* <div className="media_gallery_card_inner_icon">
                                        <img src="./assets/images/ic_baseline-image.svg"
                                            className="img-fluid"/>
                                    </div> */}
                    </div>
                    {
                      showMoreMediaOffsetCount > 0 &&
                      <div className="search_result_show_more">
                        <a onClick={() => showMoreMediasFunction()} href="javascript:void(0)">Show More</a>
                      </div>
                    }
                  </div>
                </div>
              </li>
              <li
                className={activeTab === "summary_area" ? "active" : ""}
                onClick={() => handleTabClick("summary_area")}>
                <span className="tab_nav_span">Summary</span>
                <div className="content-holder pt-3">
                  <div className='search_group_details_main_card_summary'>
                    {
                      groupDetails?.summary ?
                        <>
                          <div className='search_group_details_main_card_body_summary'>
                            <div className='search_group_details_inner_card_content_summary'>

                              <p className='mb-0'
                                dangerouslySetInnerHTML={{
                                  __html: chatGptDecodeFormattedText(groupDetails?.summary),
                                }}
                              />
                              {/* {groupDetails?.summary} */}
                              {/* {chatGptDecodeFormattedText(groupDetails?.summary)} */}
                            </div>
                          </div>
                        </>
                        :
                        <p className='text-center mb-0 no-data-summary-text'>
                          No Data to show
                        </p>
                    }
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
});

export default GroupDetailView;
