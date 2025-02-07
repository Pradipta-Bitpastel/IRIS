import React, { memo, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Highlighter from "react-highlight-words";
import $ from "jquery";
import { dateFormatter, timeout } from "@/utils/commonFunctions";
import Loading from "@/app/loading";
import Link from "next/link";
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
  video_icon_path,
  audio_icon_path,
  pdf_icon_path,
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
import { defaultImgPath } from "@/constants/index";

import "react-toastify/dist/ReactToastify.css";
import { getMediaType, translateText } from "../helpers";
import { Tooltip } from "@mui/material";
import { translateData } from "../types/type";
import { useRouter } from "next/navigation";

type TProps = {
  entityDetails: Record<string, any>;
  search_str: string;
  postSearchByKeyApiRequest: (
    data: Record<string, any>,
    endpoint: string,
    httpMethod: THttpMethod
  ) => Promise<TApiResponse | unknown>; // Define the function signature
  entityMedias: any[];
  setEntityMedias: React.Dispatch<React.SetStateAction<any[]>>;
  entityMessages: Record<string, any>;
  setEntityMessages: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  openLightBox: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  goToDetailsPage: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  detailSectionTabLoader: boolean;
  setDetailSectionTabLoader: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  handleTabClick: (tabName: string) => void;
  showMoreMediaOffsetCount: number;
  showMoreMessageOffsetCount: number;

  setShowMoreMessageOffsetCount: React.Dispatch<React.SetStateAction<number>>;
  setShowMoreMediaOffsetCount: React.Dispatch<React.SetStateAction<number>>;
};

const PersonDetailView = memo(
  ({
    entityDetails,
    search_str,
    postSearchByKeyApiRequest,
    setEntityMessages,
    entityMessages,
    setEntityMedias,
    entityMedias,
    openLightBox,
    goToDetailsPage,
    detailSectionTabLoader,
    setDetailSectionTabLoader,
    setActiveTab,
    activeTab,
    handleTabClick,
    showMoreMediaOffsetCount,
    showMoreMessageOffsetCount,
    setShowMoreMessageOffsetCount,
    setShowMoreMediaOffsetCount,
  }: TProps) => {
    const media_path = "media_assets";
    const audio_image = "audio_image.png";
    const pdf_image = "pdf_image.png";
    //   const [showMoreMediaOffsetCount,setShowMoreMediaOffsetCount]=useState<number>(0)
    // const [showMoreMessageOffsetCount,setShowMoreMessageOffsetCount]=useState<number>(0)
    const [translateData, setTranslateData] = useState<Array<translateData>>(
      []
    );
    const targetDivRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
      msg: null,
    });

    const router = useRouter();
    const messageApiLimit = 10;
    const mediaApiLimit = 30;
    const callMediasApi = async (
      limit: number = mediaApiLimit,
      offset: number
    ) => {
      setDetailSectionTabLoader(true);
      const formData = new FormData();

      formData.append("id", entityDetails?.id);
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      // formData.append("id", "1700002963a49da13542e0726b7bb758");

      try {
        let response: TApiData | undefined = await postSearchByKeyApiRequest(
          formData,
          "entity/medias",
          "post"
        );
        setDetailSectionTabLoader(false);

        if (response?.status == "200") {
          const modifiedData = response?.data?.result.map((entityMedia) => {
            const media_type = getMediaType(entityMedia?.media_url || "");
            return { ...entityMedia, media_type };
          });

          setEntityMedias([...entityMedias, ...modifiedData]);

          offset = offset + limit;
          if (+response?.data?.count > offset) {
            setShowMoreMediaOffsetCount(offset);
          } else {
            setShowMoreMediaOffsetCount(-1);
          }
        } else {
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
      } catch (error) {
        setDetailSectionTabLoader(false);

        console.error("error");
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
    const callMessagesApi = async (
      limit: number = messageApiLimit,
      offset: number
    ) => {
      setDetailSectionTabLoader(true);

      try {
        const formData = new FormData();
        // 1700002963a49da13542e0726b7bb758
        // formData.append("id", entityDetails?.id);

        formData.append("id", entityDetails?.id);
        formData.append("offset", String(offset));
        formData.append("limit", String(limit));
        // formData.append("id","1700002963a49da13542e0726b7bb758");

        let response: TApiData | undefined = await postSearchByKeyApiRequest(
          formData,
          "entity/messages",
          "post"
        );
        setDetailSectionTabLoader(false);

        if (response?.status == "200") {
          // console.log(response?.data, "data of message api...........");
          setEntityMessages({
            ...response?.data,
            result: [...entityMessages.result, ...response?.data?.result],
          });

          offset = offset + limit;

          if (+response?.data?.count > offset) {
            setShowMoreMessageOffsetCount(offset);
          } else {
            setShowMoreMessageOffsetCount(-1);
          }
        } else {
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
      } catch (error) {
        setDetailSectionTabLoader(false);

        console.error("error");
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
    // useEffect(() => {

    //   if ( activeTab === "medias_area") {
    //     callMediasApi();
    //   } else if ( activeTab === "messages_area") {
    //     callMessagesApi();
    //   }
    // }, [activeTab]);

    useEffect(() => {
      if (activeTab === "medias_area" && showMoreMediaOffsetCount == 0) {
        callMediasApi(mediaApiLimit, showMoreMediaOffsetCount);
      } else if (
        activeTab === "messages_area" &&
        showMoreMessageOffsetCount == 0
      ) {
        // setGroupMessages({count:'0',result:[]})
        callMessagesApi(messageApiLimit, showMoreMessageOffsetCount);
      }
    }, [activeTab]);
    // useEffect(() => {
    //   $(".tab-nav li").click(function () {
    //     $(".tab-nav li.active").removeClass("active");
    //     //   setUpperCountOfArrForNav();
    //     var currentClass = $(this).attr("class");
    //     let regxMedia = /medias_area/i;
    //     let regxMessage = /messages_area/i;

    //     const callMediasApi = async () => {

    //       setDetailSectionTabLoader(true)
    //       const formData = new FormData();

    //       formData.append("id", entityDetails?.id);
    //       // formData.append("id", "1700002963a49da13542e0726b7bb758");

    //       formData.append("offset", "0");

    //       try {
    //         let response: TApiData | undefined = await postSearchByKeyApiRequest(
    //           formData,
    //           "entity/medias",
    //           "post"
    //         );
    //         setDetailSectionTabLoader(false)

    //         if (response?.status == "200") {
    //           const modifiedData=  response?.data?.result.map((entityMedia)=>{

    //             const media_type= getMediaType(entityMedia?.media_url||'')
    //             return({...entityMedia,media_type})

    //          })

    //           setEntityMedias(modifiedData);
    //         } else {
    //           const errorMessage: TErrorMessage = generalizedApiError;

    //           const toastErrorSettingDataCpy: TToastErrorSettingData =
    //             toastSettingData;
    //           toast.error(
    //             allowableServerErrors.includes(errorMessage)
    //               ? errorMessage
    //               : generalizedApiError,
    //             toastErrorSettingDataCpy
    //           );
    //         }
    //       } catch (error) {
    //         setDetailSectionTabLoader(false)

    //         console.error("error");
    //         const errorMessage: TErrorMessage =
    //           error instanceof Error ? error.message : "";

    //         const toastErrorSettingDataCpy: TToastErrorSettingData =
    //           toastSettingData;
    //         toast.error(
    //           allowableServerErrors.includes(errorMessage)
    //             ? errorMessage
    //             : generalizedApiError,
    //           toastErrorSettingDataCpy
    //         );
    //       }
    //     };

    //     const callMessagesApi = async () => {
    //       setDetailSectionTabLoader(true)

    //       try {
    //         const formData = new FormData();
    //         // 1700002963a49da13542e0726b7bb758
    //         // formData.append("id", entityDetails?.id);
    //         formData.append("id","1700002963a49da13542e0726b7bb758");

    //         formData.append("offset", "0");
    //         let response: TApiData | undefined = await postSearchByKeyApiRequest(
    //           formData,
    //           "entity/messages",
    //           "post"
    //         );
    //         setDetailSectionTabLoader(false)

    //         if (response?.status == "200") {
    //           console.log(response?.data, "data of message api...........");
    //           setEntityMessages(response?.data);
    //         } else {
    //           const errorMessage: TErrorMessage = generalizedApiError;

    //           const toastErrorSettingDataCpy: TToastErrorSettingData =
    //             toastSettingData;
    //           toast.error(
    //             allowableServerErrors.includes(errorMessage)
    //               ? errorMessage
    //               : generalizedApiError,
    //             toastErrorSettingDataCpy
    //           );
    //         }
    //       } catch (error) {
    //         setDetailSectionTabLoader(false)

    //         console.error("error");
    //         const errorMessage: TErrorMessage =
    //           error instanceof Error ? error.message : "";

    //         const toastErrorSettingDataCpy: TToastErrorSettingData =
    //           toastSettingData;
    //         toast.error(
    //           allowableServerErrors.includes(errorMessage)
    //             ? errorMessage
    //             : generalizedApiError,
    //           toastErrorSettingDataCpy
    //         );
    //       }
    //     };

    //     if (regxMedia.test(currentClass)) {
    //       callMediasApi();
    //       // setUpperCountOfArrForNav(12);
    //     } else if (regxMessage.test(currentClass)) {
    //       callMessagesApi();
    //     } else {
    //       // setUpperCountOfArrForNav(6);
    //     }
    //     //   if
    //     $(this).addClass("active");
    //   });
    //   $(".tab-nav li:first-child").addClass("active");
    // }, []);
    // const handleTabClick = (tabName: string) => {
    //   setActiveTab(tabName);
    //   // window.localStorage.setItem("activeTab", tabName);
    // };

    const showMoreMediasFunction = (): void => {
      callMediasApi(mediaApiLimit, showMoreMediaOffsetCount);
    };
    const showMoreMessagesFunction = (): void => {
      // console.log("inner pagee")

      callMessagesApi(messageApiLimit, showMoreMessageOffsetCount);
    };
    const ArabicTranslation = async (message: string, messageId: string) => {
      // Check if the message has already been translated
      const existingTranslation = translateData.find(
        (item) => item.messageId === messageId
      );

      if (existingTranslation && existingTranslation.status) {
        // If already translated, clear the translation (remove the object from the array)
        setTranslateData((prevData) =>
          prevData.filter((item) => item.messageId !== messageId)
        );
      } else {
        let response = (await translateText(message, messageId)) as string;
        setTranslateData((prevData) => [
          ...prevData,
          { messageId, message: response, status: true },
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
    const scrollToBottom = (targetRef: HTMLDivElement | null) => {
      if (targetRef) {
        targetRef.scrollTo({
          top: targetRef.scrollHeight,
          behavior: "smooth",
        });
      }
    };
    useEffect(() => {
      if (entityMessages?.result.length > 0) {
        Object.values(targetDivRefs.current).forEach(scrollToBottom);
      }
    }, [entityMessages]);

    async function handleProfilerClick(entityDetails: {
      id: string;
      profiler_status: string;
    }) {
      try {
        if (entityDetails?.profiler_status == "1") {
          router.push(`/profiler/${entityDetails && entityDetails?.id}`);
        } else if (entityDetails?.profiler_status == "0") {
          setDetailSectionTabLoader(true);

          const formdata = new FormData();
          formdata.append("id", entityDetails?.id);

          let response: TApiData | undefined = await postSearchByKeyApiRequest(
            formdata,
            "entity/profiler-enrichment",
            "post"
          );

          // console.log("response", response);

          if (response.status == "200") {
            router.push(`/profiler/${entityDetails && entityDetails?.id}`);
            setDetailSectionTabLoader(false);
          } else if (response.status == "ERROR") {
            toast.error(response?.message);
          }
        } else {

        }
      } catch (error) {
        console.log(error);
      } finally {
        setDetailSectionTabLoader(false);
      }
    }

    console.log(entityDetails, "entityDetails");


    return (
      <div>
        <div className="search_people_details search_message_group_details">
          <div className="search_result_inner_people_details">
            <div className="details-wrapper">
              {/* <Link href={'/profiler'}>Profiler</Link> */}
              {/* <Tooltip title={'Work in Progress'} placement="top" arrow> */}
              {/* <Link href={`/profiler/${entityDetails &&entityDetails?.id}`}>Profiler</Link> */}
              {/* </Tooltip> */}
            </div>
            <div className="search_result_inner_people_profile_area ">
              <div className="search_result_inner_people_profile">
                <div className="search_result_inner_people_profile_img">
                  <img
                    src={`${(entityDetails?.profile_image_url &&
                        entityDetails?.profile_image_url[0]) ||
                      "/asset/default_img/default_img.jpg"
                      }`}
                    // fill={true}
                    className="img-fluid"
                    alt="people"
                  ></img>
                </div>
                <div className="search_result_inner_people_content">
                  <p>
                    <Highlighter
                      highlightClassName="uni-active"
                      searchWords={[search_str]}
                      autoEscape={true}
                      textToHighlight={`${entityDetails?.phone_number}`}
                    />
                  </p>
                  <span>{entityDetails?.phone_number}</span>
                  {entityDetails && entityDetails?.country && (
                    <div
                      className="d-flex align-items-center"
                      style={{ paddingLeft: "2px" }}
                    >
                      <div className="flag">
                        {/* <img src={`${country.find((arr)=>arr.country==searchItem.country).country_flag_b64}`} className='img-fluid'></img> */}
                        <img
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${entityDetails?.country?.alpha2_code}.svg`}
                          className="img-fluid "
                        ></img>
                      </div>

                      <span>{entityDetails?.country?.name}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* <div> */}
              <div className="classification">
                <span>Classification:</span>
                <p>
                  {entityDetails?.classification
                    ? entityDetails?.classification
                    : "N/A"}
                </p>
              </div>
              {/* <div className="classification d-flex gap-2">
                  <span>Group Count:</span>
                  <p>
                    {entityDetails?.group_count
                      ? entityDetails?.group_count
                      : "N/A"}
                  </p>
                </div> */}

              {/* </div> */}
              {/* <div className="inner_card_group_risk"> */}
              {/* <span>Risk Score: </span> */}
              {/* <div className="search_risk_score"> */}
              <div className="classification">
                <span>Risk Score: </span>
                <div className="inner_card_group_risk_svg">
                  {entityDetails?.risk_score ? (
                    <>
                      {/* <img
                        src={
                          entityDetails?.risk_score
                            ? `${riskFactorCalc(entityDetails?.risk_score).photo.src}`
                            : "/"
                        }
                        alt="risk_image"
                      /> */}

                      <p
                      // className="mb-0"
                      // className={`${riskFactorCalc(entityDetails?.risk_score)?.className
                      //   }`}
                      >
                        {entityDetails?.risk_score}
                      </p>
                    </>
                  ) : (
                    <p className="mb-0">N/A</p>
                  )}
                </div>
              </div>

              <div className="classification">
                <span>Group Count:</span>
                <p>
                  {entityDetails?.group_count
                    ? entityDetails?.group_count
                    : "N/A"}
                </p>
              </div>
              {/* </div> */}
              {/* </div> */}
            </div>
            <div className="search_result_inner_button_area">
              <button className="join-grp-btn" disabled={true}>
                Start Conversation
              </button>
              <button className="join-grp-btn" disabled={true}>
                External Enrichment
              </button>
              {/^\+?\d+(\s?\d+)*$/.test(
                entityDetails?.phone_number?.trim() || ""
              ) ? (
                <button
                  onClick={async () =>
                    handleProfilerClick(
                      entityDetails as {
                        id: string;
                        profiler_status: string;
                      }
                    )
                  }
                  className="join-grp-btn profiler"
                >
                  Profiler
                </button>
              ) : (
                <Tooltip
                  title={"Profiler option is not available for Channel Admin"}
                  placement="top"
                  arrow
                >
                  <button
                    onClick={async () =>
                      handleProfilerClick(
                        entityDetails as {
                          id: string;
                          profiler_status: string;
                        }
                      )
                    }
                    disabled
                    className="join-grp-btn profiler opacity-50"
                  >
                    Profiler
                  </button>
                </Tooltip>
              )}
            </div>

            <div className="wrapper tab-wrapper">
              {detailSectionTabLoader && <Loading />}

              <div className="tab-panel">
                <ul className="tab-nav">
                  {/* <li className="personal_details"> */}
                  <li
                    className={activeTab === "personal_details" ? "active" : ""}
                    onClick={() => handleTabClick("personal_details")}
                  >
                    <span className="tab_nav_span">Personal Details</span>

                    <div className="content-holder">
                      <div className="search_group_details_main_card">
                        <div className="search_group_details_main_card_body">
                          <div className="personal-details-item">
                            <span>First Name:</span>
                            <p>{entityDetails?.first_name || "N/A"}</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Last Name:</span>
                            <p>{entityDetails?.last_name || "N/A"}</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Gender:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>DOB:</span>
                            <p>{entityDetails?.date_of_birth || "N/A"}</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Skills:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Languages:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Device Type:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Description:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Education:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Location:</span>
                            <p>N/A</p>
                          </div>
                          <div className="personal-details-item">
                            <span>Sources:</span>
                            <p>N/A</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* <li className="members_area"> */}
                  <li
                    className={activeTab === "members_area" ? "active" : ""}
                    onClick={() => handleTabClick("members_area")}
                  >
                    <span className="tab_nav_span">Groups</span>
                    <div className="content-holder">
                      <div className="search_group_details_main_card">
                        <div className="search_group_details_main_card_body">
                          {entityDetails?.group_memberships.length > 0 ? (
                            entityDetails?.group_memberships.map(
                              (eachMemberGroup, eachGroupIndex) => {
                                return (
                                  <div
                                    key={eachGroupIndex}
                                    className="result_item_mt"
                                  >
                                    <div>
                                      <a
                                        href="javascript:void(0)"
                                      // onClick={goToDetailsPage}
                                      // id={`result-${searchItem.db_type}-${searchItem.id}`}
                                      >
                                        <div className="search_result_inner_people dark_bg">
                                          <div
                                            className="search_result_people_overlay"
                                            onClick={goToDetailsPage}
                                            id={`group-${eachMemberGroup?.group?.id}`}
                                          ></div>
                                          <div className="search_result_inner_people_card">
                                            <div className="search_result_inner_people_card_left">
                                              <div className="search_result_inner_people_image">
                                                <img
                                                  src={`${eachMemberGroup?.group?.profile_image_url}`}
                                                  className="img-fluid"
                                                // fill={true}
                                                />
                                              </div>
                                              <div className="search_result_inner_people_content">
                                                {/* <p>Group name lorem doe <span>Doe</span></p> */}

                                                <p>
                                                  {
                                                    eachMemberGroup?.group
                                                      ?.group_name
                                                  }
                                                </p>

                                                <span>
                                                  Members:{" "}
                                                  <span>
                                                    {
                                                      eachMemberGroup?.group
                                                        ?.members_count
                                                    }
                                                  </span>
                                                </span>
                                                <div className="inner_card_group_risk">
                                                  <span>
                                                    Group Risk Score:{" "}
                                                  </span>
                                                  <div className="inner_card_group_risk_svg">
                                                    {eachMemberGroup &&
                                                      eachMemberGroup?.group
                                                        ?.risk_score ? (
                                                      <>
                                                        {/* <img
                                                          src={
                                                            eachMemberGroup?.group
                                                              ?.risk_score
                                                              ? `${riskFactorCalc(
                                                                eachMemberGroup?.group
                                                                  ?.risk_score || "20%"
                                                              ).photo.src
                                                              }`
                                                              : "/"
                                                          }
                                                          alt="risk_image"
                                                        /> */}
                                                        <span
                                                        // className={`${riskFactorCalc(
                                                        //   eachMemberGroup?.group
                                                        //     ?.risk_score || "20%"
                                                        // )?.className
                                                        //   }`}
                                                        >
                                                          {`${eachMemberGroup?.group?.risk_score}`}
                                                        </span>
                                                      </>
                                                    ) : (
                                                      <span>N/A</span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <div className="no_data_text">
                              <p>No data to show</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    className={activeTab === "messages_area" ? "active" : ""}
                    onClick={() => handleTabClick("messages_area")}
                  >
                    <span className="tab_nav_span">Message History</span>
                    <div className="content-holder">
                      <div className="search_group_details_main_card">
                        <div
                          className="search_group_details_main_card_body"
                          ref={(el) => {
                            targetDivRefs.current.msg = el;
                          }}
                        >
                          <div className="scroll-y">
                            {entityMessages?.result?.length > 0 ? (
                              // messagesOfMember.slice(0,upperCountOfArr).map((messageOfMemberObj,messageOfMemberObjIndex)=>{
                              entityMessages.result.map(
                                (
                                  messageOfMemberObj,
                                  messageOfMemberObjIndex
                                ) => {
                                  return (
                                    <div
                                      key={messageOfMemberObjIndex}
                                      className={`search_result_inner_people dark_bg ${Object.keys(messageOfMemberObj).includes('is_deleted') && messageOfMemberObj?.is_deleted=='1' ? "deleted" : ""}`}
                                    >
                                      <div
                                        className="search_result_people_overlay"
                                        onClick={goToDetailsPage}
                                        id={`message-${messageOfMemberObj.id}`}
                                      ></div>
                                      <div className="search_result_inner_people_card persondetails relative_pos">
                                        <div className="search_result_inner_people_card_left">
                                          <div className="search_result_inner_people_content_area">
                                            <div className="search_result_inner_people_content_area_title">
                                              <span>
                                                {messageOfMemberObj?.group_name}
                                              </span>
                                            </div>
                                            <p className="mt-1">
                                              {messageOfMemberObj.message_text}
                                            </p>
                                            <div className="d-flex justify-content-between mt-1">
                                              {(messageOfMemberObj?.language !==
                                                "en" &&
                                                messageOfMemberObj?.language !==
                                                "km" &&
                                                messageOfMemberObj?.language !==
                                                "da" &&
                                                messageOfMemberObj?.language !=
                                                "zh" &&
                                                messageOfMemberObj?.language !==
                                                "unknown" &&
                                                messageOfMemberObj?.language) ||
                                                messageOfMemberObj?.language ==
                                                "ja" ? (
                                                <div className="translator-btn">
                                                  <span
                                                    onClick={() =>
                                                      ArabicTranslation(
                                                        messageOfMemberObj?.message_text,
                                                        messageOfMemberObj?.id
                                                      )
                                                    }
                                                    className={
                                                      translateData.some(
                                                        (translation) =>
                                                          translation.messageId ===
                                                          messageOfMemberObj?.id &&
                                                          translation.status
                                                      )
                                                        ? "active"
                                                        : ""
                                                    }
                                                  >
                                                    Translate
                                                  </span>
                                                </div>
                                              ) : (
                                                ""
                                              )}

                                              <span>
                                                {dateFormatter(
                                                  messageOfMemberObj.timestamp
                                                )}{" "}
                                                |{" "}
                                                {dateFormatter(
                                                  messageOfMemberObj?.timestamp,
                                                  true
                                                )}
                                              </span>
                                            </div>

                                            {/* Translated Message Section */}
                                            {translateData
                                              .filter(
                                                (translation) =>
                                                  translation.messageId ===
                                                  messageOfMemberObj?.id &&
                                                  translation.status
                                              )
                                              .map((translation) => (
                                                <div
                                                  className="translated-msg-section"
                                                  id="translateSec"
                                                  key={translation.messageId}
                                                >
                                                  <p>{translation.message}</p>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    // </div>
                                  );
                                }
                              )
                            ) : (
                              <div className="no_data_text">
                                <p>No data to show</p>
                              </div>
                            )}
                          </div>
                          {/* <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div>
                            <div className="search_group_details_inner_card">
                                <div className="search_group_details_inner_card_image">
                                    <img src="./assets/images/u-2.png" className="img-fluid"/>
                                </div>
                                <div className="search_group_details_inner_card_content">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing
                                        elit, sed do eiusmod
                                        tempor ut incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim
                                        veniam, quis nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea
                                        commodo consequat.
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <span>John Doe</span>
                                        <span>20 Sep 2023 | 20:40</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        {showMoreMessageOffsetCount > 0 && (
                          <div className="search_result_show_more">
                            <a
                              onClick={() => showMoreMessagesFunction()}
                              href="javascript:void(0)"
                            >
                              Show More
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>

                  <li
                    className={activeTab === "medias_area" ? "active" : ""}
                    onClick={() => handleTabClick("medias_area")}
                  >
                    <span className="tab_nav_span">Media</span>
                    <div className="content-holder pt-3">
                      <div className="media_gallery_card">
                        <div className="row gx-2">
                          {/* <div className="col-lg-3">
                    
                        <div className="media_gallery_card_inner"> */}

                          {
                            // .slice(0, upperCountOfArr)
                            entityMedias?.length > 0 ? (
                              entityMedias.map(
                                (eachMediaObj, eachMediaObjIndex) => {
                                  return eachMediaObj?.media_type == "video" ? (
                                    // <div key={eachMediaObjIndex} className="col-lg-3">
                                    //   <div className="media_gallery_card_inner">
                                    //     <div className="media_gallery_card_inner_img ">
                                    //       <img
                                    //         src={`/${media_path}/video_image.png`}
                                    //         className="img-fluid"
                                    //       />
                                    //     </div>
                                    //   </div>
                                    // </div>

                                    <div
                                      key={eachMediaObjIndex}
                                      className="col-lg-3 col-md-6 col-6"
                                      onClick={openLightBox}
                                    >
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
                                  ) : eachMediaObj["media_type"] == "audio" ? (
                                    <div
                                      key={eachMediaObjIndex}
                                      className="col-lg-3 col-md-6 col-6"
                                      onClick={openLightBox}
                                    >
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
                                  ) : eachMediaObj["media_type"] ==
                                    "document" ||
                                    eachMediaObj["media_type"] == "pdf" ? (
                                    <div
                                      key={eachMediaObjIndex}
                                      className="col-lg-3 col-md-6 col-6"
                                      onClick={openLightBox}
                                    >
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
                                  ) : eachMediaObj["media_type"] == "image" ? (
                                    <div
                                      key={eachMediaObjIndex}
                                      className="col-lg-3 col-md-6 col-6"
                                      onClick={openLightBox}
                                    >
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
                                  ) : null;
                                }
                              )
                            ) : (
                              <div className="no_data_text">
                                <p>No data to show</p>
                              </div>
                            )
                          }
                          {/* <div className="media_gallery_card_inner_img">
                                        <img src="./assets/images/555.png"
                                            className="img-fluid"/>
                                    </div> */}
                          {/* <div className="media_gallery_card_inner_icon">
                                        <img src="./assets/images/ic_baseline-image.svg"
                                            className="img-fluid"/>
                                    </div> */}
                        </div>

                        {showMoreMediaOffsetCount > 0 && (
                          <div className="search_result_show_more">
                            <a
                              onClick={() => showMoreMediasFunction()}
                              href="javascript:void(0)"
                            >
                              Show More
                            </a>
                          </div>
                        )}
                        {/* {
                         (upperCountOfArr<=mapObjectDetail["finalMediaArr"].length) &&
                    <div className="search_result_show_more">
                      <a onClick={setUpperCountOfArr} href="javascript:void(0)">Show More</a>
                    </div>
} */}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PersonDetailView;
