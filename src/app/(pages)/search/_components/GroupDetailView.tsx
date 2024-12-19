import React, { useEffect, useState, useRef } from 'react'
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
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Loading from '@/app/loading';
import { off } from 'process';
import { count } from 'console';
import { translateData } from '../types/type';
//   import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
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
  deletedData:any
}

const GroupDetailView = ({ groupDetails, search_str, postSearchByKeyApiRequest, setGroupMessages, groupMessages, setGroupMedias, groupMedias, groupMembers, setGroupMembers, openLightBox, goToDetailsPage, setActiveTab,deletedData,
  activeTab,
  handleTabClick, detailSectionTabLoader,
  setDetailSectionTabLoader,
  showMoreMediaOffsetCount,
  showMoreMessageOffsetCount,
  showMoreMemberOffsetCount,
  setShowMoreMessageOffsetCount,
  setShowMoreMediaOffsetCount,
  setShowMoreMemberOffsetCount

}: TProps) => {

  const [membersApi, setMembersApi] = useState([])
  const [translateData, setTranslateData] = useState<Array<translateData>>([]);
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
  const messageApiLimit = 10
  const mediaApiLimit = 30

  // const []

  const callMemberApi = async (limit: number = memberApiLimit, offset: number) => {
    console.log("call members apii")

    setDetailSectionTabLoader(true)


    const formData = new FormData();

    formData.append("id", groupDetails?.id);
    formData.append("offset", String(offset));
    formData.append("limit", String(limit));

    try {

      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/members', 'post');
      console.log(response, "response from member")
      setDetailSectionTabLoader(false)

      if (response?.status == "200") {
        console.log("resp from member", { ...response?.data, result: [...groupMembers.result, ...response?.data?.result] })
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
    console.log("click", "clickkk")
    setDetailSectionTabLoader(true)


    const formData = new FormData();

    formData.append("id", groupDetails?.id);
    formData.append("offset", String(offset));
    formData.append("limit", String(limit));

    try {

      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/medias', 'post');
      console.log(response, "respobsemediaa")
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

  const callMessagesApi = async (limit: number = messageApiLimit, offset: number) => {
    setDetailSectionTabLoader(true)


    console.log("call messages apii")

    try {
      const formData = new FormData();

      formData.append("id", groupDetails?.id);
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group/messages', 'post');
      setDetailSectionTabLoader(false)
      if (response?.status == "200") {
        console.log(response, "resp of message", groupMessages)

        console.log(response?.data, "dataaa of group messages", { ...response?.data, result: [...groupMessages.result, ...response?.data?.result] })
        setGroupMessages({ ...response?.data, result: [...groupMessages.result, ...response?.data?.result] })
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
    console.log(activeTab, showMoreMemberOffsetCount, "activetab-----------")

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
  const setUpperCountOfArr1 = () => {
    console.log("innnn");
  };
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

    console.log("inner pagee")


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
      // If not translated yet, proceed with translation
      let typeOfMsg = await handleTranslation(message, messageId) as string;

      if (typeOfMsg === "Arabic" && typeOfMsg !== undefined) {
        let response = await translateText(message, messageId) as string;
        setTranslateData(prevData => [
          ...prevData,
          { messageId, message: response, status: true }
        ]);
      } else {
        // If translation failed, add a status as false for this messageId
        setTranslateData(prevData => [
          ...prevData,
          { messageId, message: '', status: false }
        ]);
      }

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
  useEffect(() => {
    if (groupMembers?.result.length > 0 || groupMessages?.result.length > 0 || groupMedias?.length > 0 ) {
      Object.values(targetDivRefs.current).forEach(scrollToBottom);
    }
  }, [groupMembers, groupMessages, groupMedias]);
  console.log(groupMessages, "groupMessages");


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
              {/* <div className="sender">
                <span>Member Count:</span>
                <p>{mapObjectDetail["groupMember"].length}</p>
              </div> */}

              <div className="sender">
                <div className="member-count">
                  <span>Member Count:</span>
                  <p>{groupDetails?.members_count}</p>
                </div>
                <div className="member-count">
                  <span>Classification:</span>
                  <p>{groupDetails?.classification}</p>
                </div>
              </div>

              <div className="inner_card_group_risk">
                <span>Risk Score: </span>
                <div className="inner_card_group_risk_svg">


                  <img
                    src={`${riskFactorCalc(groupDetails?.risk_score)?.photo.src
                      }`}
                    alt="risk_image"
                  />

                  <span
                    className={`${riskFactorCalc(
                      groupDetails?.risk_score
                    )?.className
                      }`}
                  >
                    {groupDetails?.risk_score + '%'}
                  </span>
                </div>
              </div>
            </div>

            <div className="join-group">
              <button onClick={clickJoinGroup} className="join-grp-btn">
                JOIN LINK
              </button>
            </div>
          </div>
          <div className="col-md-12 col-lg-6">
            <div className="group_inner_chart-p">
              <div className="group_inner_chart">

                {/* <img src="./assets/images/pattern.png" className="img-fluid" /> */}

                {/* <Line data={activity_graph_data} options={activity_graph_option} /> */}
                {/* data={activityGraphDataBuilder('id')}
                 options={activity_graph_option} */}
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

                      {
                        (groupMessages?.result?.length > 0) ?
                          groupMessages?.result
                            // .slice(0, upperCountOfArr)
                            .map((item, index) => {
                              console.log(item, "item");

                              return (
                                <div
                                  key={index}
                                  className={`search_group_details_inner_card relative_pos ${deletedData.includes(index) ? 'deleted' : ''}`}


                                >
                                  <div
                                    className="search_result_people_overlay"
                                    onClick={goToDetailsPage}
                                    id={`message-${item.id}`}
                                  ></div>
                                  <div className="search_group_details_inner_card_image details-clickable-img-zIndex">
                                    <img

                                      onClick={goToDetailsPage}
                                      id={`entity-${item?.entity?.id}`}
                                      src={`${item?.entity?.profile_image_url}`}
                                      //   fill={true}
                                      className="img-fluid"
                                      alt="people image"
                                    ></img>
                                  </div>
                                  <div className="search_group_details_inner_card_content">
                                    <p>{item?.message_text}</p>
                                    <div className="d-flex justify-content-between">
                                      <span>
                                        {
                                          item?.entity?.phone_number
                                        }
                                      </span>
                                      <span>
                                        {dateFormatter(item?.timestamp)} |{" "}
                                        {dateFormatter(item?.timestamp, true)}
                                      </span>
                                    </div>
                                    <div className="">
                                      {/* {
                                        (item?.message_text.trim().toLowerCase() == groupMessages?.message_text.trim().toLowerCase() &&
                                          groupMessages?.language == 'ar' || 'fa') || (item?.language && item?.language === "ar" || 'fa') ?
                                          <div className="translator-btn">
                                            <span
                                              onClick={() => { ArabicTranslation(item?.message_text, item?.id) }}
                                              className={translateData.some(translation => translation.messageId === item?.id && translation.status) ? "active" : ""}
                                            >
                                              Translate
                                            </span>
                                          </div>
                                          : ''
                                      } */}
                                      {
                                        <div className="translator-btn">
                                          <span
                                            onClick={() => { ArabicTranslation(item?.message_text, item?.id) }}
                                            className={translateData.some(translation => translation.messageId === item?.id && translation.status) ? "active" : ""}
                                          >
                                            Translate
                                          </span>
                                        </div>
                                      }
                                    </div>
                                    {
                                      // Display translated message only if translation exists and status is true for that messageId
                                      translateData.filter(translation => translation.messageId === item?.id && translation.status).map(translation => (
                                        <div className="translated-msg-section" id="translateSec">
                                          <p key={translation.messageId}>
                                            {translation.message}
                                          </p>
                                        </div>
                                      ))
                                    }
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

                      showMoreMessageOffsetCount > 0 &&
                      <div className="search_result_show_more">
                        <a onClick={() => showMoreMessagesFunction()} href="javascript:void(0)">Show More</a>
                      </div>
                    }
                  </div>
                </div>
              </li>
              {/* <li className="members_area"> */}
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
                                        src={`${item?.entity?.profile_image_url || "/asset/default_img/default_img.jpg"}`}
                                        className="img-fluid"
                                        alt=""
                                      ></img>
                                    </div>
                                    <div className="tab_members_card_inner_lists_content">
                                      <div className="tab_members_card_inner_lists_left_content">
                                        <p>{item?.entity?.phone_number}</p>
                                        <span>{item?.entity?.phone_number}</span>
                                        <div className="flag_date">
                                          {(item?.entity?.country?.alpha2_code) &&
                                            <div className="flag">
                                              <img
                                                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.entity?.country?.alpha2_code}.svg`}
                                                className="img-fluid"
                                              ></img>
                                            </div>
                                          }

                                          <span>
                                            {(!item?.entity?.country?.name) ? "N/A" : item?.entity?.country?.name}
                                          </span>
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
                      {/* <div className="tab_members_card_inner_lists">
                                <div className="tab_members_card_inner_list_content">
                                    <div className="tab_members_card_inner_lists_image">
                                        <img src="./assets/images/user1.png"
                                            className="img-fluid"/>
                                    </div>
                                    <div className="tab_members_card_inner_lists_content">
                                        <div
                                            className="tab_members_card_inner_lists_left_content">
                                            <p>John Doe</p>
                                            <div className="flag_date">
                                                <div className="flag">
                                                    <img src="./assets/images/Afghanistan (AF).png"
                                                        className="img-fluid"/>
                                                </div>
                                                <span>Afghanistan | +93 01 2345678</span>
                                            </div>
                                        </div>
                                        <div
                                            className="tab_members_card_inner_lists_right_content">
                                        </div>
                                    </div>
                                </div>
                                <div className="tab_members_learn_more">
                                    <a href="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                            height="16" viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M12 4.7C12 4.52319 11.9297 4.35362 11.8047 4.2286C11.6797 4.10357 11.5101 4.03333 11.3333 4.03333L5.99996 4C5.82315 4 5.65358 4.07024 5.52855 4.19526C5.40353 4.32029 5.33329 4.48986 5.33329 4.66667C5.33329 4.84348 5.40353 5.01305 5.52855 5.13807C5.65358 5.2631 5.82315 5.33333 5.99996 5.33333H9.70663L4.19329 10.86C4.13081 10.922 4.08121 10.9957 4.04737 11.0769C4.01352 11.1582 3.99609 11.2453 3.99609 11.3333C3.99609 11.4213 4.01352 11.5085 4.04737 11.5897C4.08121 11.671 4.13081 11.7447 4.19329 11.8067C4.25527 11.8692 4.329 11.9187 4.41024 11.9526C4.49148 11.9864 4.57862 12.0039 4.66663 12.0039C4.75463 12.0039 4.84177 11.9864 4.92301 11.9526C5.00425 11.9187 5.07798 11.8692 5.13996 11.8067L10.6666 6.28V10C10.6666 10.1768 10.7369 10.3464 10.8619 10.4714C10.9869 10.5964 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.5964 11.8047 10.4714C11.9297 10.3464 12 10.1768 12 10V4.7Z"
                                                fill="#108DE5" />
                                        </svg>
                                        <span>View Member Details</span>
                                    </a>
                                </div>
                            </div> */}
                    </div>
                    {

                      showMoreMemberOffsetCount > 0 &&
                      <div className="search_result_show_more">
                        <a onClick={() => showMoreMemberFunction()} href="javascript:void(0)">Show More</a>
                      </div>

                      // (upperCountOfArr<=mapObjectDetail["groupOnlyMember"].length) &&
                      // <div className="search_result_show_more">
                      //   <a onClick={setUpperCountOfArr}  href="javascript:void(0)">Show More</a>
                      // </div>
                    }
                  </div>
                </div>
              </li>
              {/* <li className="messages_area"> */}

              {/* <li className="medias_area" > */}
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
                      {/* video_thumbnails */}
                      {/* <Gallery> */}
                      {
                        (groupMedias?.length > 0) ?
                          // .slice(0, upperCountOfArr)
                          groupMedias.map((eachMediaObj, eachMediaObjIndex) => {
                            return eachMediaObj?.media_type == "video" ? (


                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img ">
                                    <img
                                      src={`${video_icon_path}`}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}
                                    />
                                  </div>
                                </div>
                              </div>





                            ) : eachMediaObj["media_type"] == "document" || eachMediaObj["media_type"] == "pdf" ? (
                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${pdf_icon_path}`}
                                      // fill={true}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : eachMediaObj["media_type"] == "audio" ? (
                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${audio_icon_path}`}
                                      // fill={true}
                                      className="img-fluid"
                                      id={`id-${eachMediaObj?.id}`}

                                    />
                                  </div>
                                </div>
                              </div>
                            ) : eachMediaObj["media_type"] == "image" ? (




                              <div key={eachMediaObjIndex} className="col-lg-3 col-md-6 col-6" onClick={openLightBox}>
                                <div className="media_gallery_card_inner">
                                  <div className="media_gallery_card_inner_img">
                                    <img
                                      src={`${eachMediaObj?.media_url}`}
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
                      {/* </Gallery> */}

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
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GroupDetailView;
