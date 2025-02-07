import React, { memo, useEffect, useState } from "react";
import { dateFormatter, timeout } from "@/utils/commonFunctions";

import Image from "next/image";
import Highlighter from "react-highlight-words";
import $ from "jquery";
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
import { defaultImgPath } from "@/constants/index";

import "react-toastify/dist/ReactToastify.css";
import { getMediaType, handleTranslation, translateText } from "../helpers";
import { translateData } from "../types/type";

type TProps = {
  messageDetails: Record<string, any>;
  search_str: string;
  deletedData: any;
  postSearchByKeyApiRequest: (
    data: Record<string, any>,
    endpoint: string,
    httpMethod: THttpMethod
  ) => Promise<TApiResponse | unknown>; // Define the function signature

  goToDetailsPage: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
};

const MessageDetailView = memo(({
  messageDetails,
  search_str,
  postSearchByKeyApiRequest,
  goToDetailsPage,
  deletedData
}: TProps) => {
  const [translateData, setTranslateData] = useState<Array<translateData>>([]);

  const ArabicTranslation = async (message: string, messageId: string) => {
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

  console.log(messageDetails, "messageDetails");

  return (
    <>
      <div className="search_group_details msg-detail">
        <div className="search_group_details_main_content">
          <div className="message_content">
            <span>Message:</span>
            <p className="msg-uni-active-p">
              {/* {detailInfoObj.textMessage} */}
              <Highlighter
                highlightClassName="uni-active"
                searchWords={[search_str]}
                autoEscape={true}
                textToHighlight={`${messageDetails?.message_text}`}
              />
            </p>
          </div>
          <div className="message_subcontent">
            <div className="message_subcontent_detail">
              <div className="sender message-sender">
                <span>Sender:</span>
                <br />
                <p
                  className="detail-section-pointer"
                  onClick={goToDetailsPage}
                  id={`entity-${messageDetails?.entity?.id}`}>{messageDetails?.entity?.first_name ? messageDetails?.entity?.first_name : messageDetails?.entity?.phone_number}</p>
              </div>
              <div className="number">
                <span>Number:</span>
                <p className="detail-section-pointer" onClick={goToDetailsPage}
                  id={`entity-${messageDetails?.entity?.id}`}>{messageDetails?.entity?.phone_number}</p>
              </div>
              <div className="date_time">
                <span>Date Time:</span>
                <p>
                  {dateFormatter(messageDetails?.timestamp)} |{" "}
                  {dateFormatter(messageDetails?.timestamp, true)}
                </p>
              </div>
            </div>
            <div className="message_subcontent_risk">
              <div className="inner_card_group_risk">
                <span>Risk Score: </span>
                <div className="inner_card_group_risk_svg message-risk-score">
                  {
                    messageDetails && messageDetails?.risk_score ? (
                      <>
                        {/* <img
                          src={
                            messageDetails?.risk_score
                              ? `${riskFactorCalc(messageDetails?.risk_score).photo.src
                              }`
                              : "/"
                          }
                          alt="risk_image"
                        /> */}

                        <p
                        // className={`${riskFactorCalc(messageDetails?.risk_score)?.className
                        //   }`}
                        >
                          {messageDetails?.risk_score}
                        </p>
                      </>

                    )
                      :
                      <p>N/A</p>
                  }
                </div>
                {/* <div className="sender">
                    <span>Flag:</span>
                    <p>NO</p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="search_group_details_main_card">
            <div className="search_group_details_main_card_title">
              <p>
                {/* onClick={goToDetailsPage}id={`group-${item?.id}`} */}
                Group: <span className="detail-section-pointer" onClick={goToDetailsPage}
                  id={`group-${messageDetails?.group_id}`}>{messageDetails?.group_name}</span>{" "}
              </p>
            </div>
            <div className="search_group_details_main_card_body">
              {messageDetails?.prevAndNextMsgWithCurrent.map((item, index) => {
                return (
                  <div key={index} className={`search_group_details_inner_card relative_pos 
                    ${item?.message_text.trim().toLowerCase() !== messageDetails?.message_text.trim().toLowerCase() && Object.keys(item).includes('is_deleted') && item?.is_deleted=='1' ? "deleted" : ""}`}
                  >
                    <div className="search_result_people_overlay" onClick={goToDetailsPage} id={`message-${item.id}`}></div>
                    <div className="search_group_details_inner_card_image profile_img_parent details-clickable-img-zIndex">
                      <img
                        onClick={goToDetailsPage}
                        id={`entity-${item?.entity?.id}`}
                        src={`${item?.entity?.profile_image_url[0] ||
                          "/asset/default_img/default_img.jpg"
                          }`}
                        // fill={true}
                        className="img-fluid"
                        alt="peoples image"
                      ></img>
                    </div>
                    <div className="search_group_details_inner_card_content">
                      <p
                        className={`${item?.message_text.trim().toLowerCase() ==
                          messageDetails?.message_text.trim().toLowerCase()
                          ? "uni-active"
                          : ""
                          }`}
                      >
                        {" "}
                        {item?.message_text}{" "}
                      </p>
                      <div className="d-flex justify-content-between ">
                        <div className="">
                          {
                            item?.message_text.trim().toLowerCase() == messageDetails?.message_text.trim().toLowerCase()
                              ?
                              (messageDetails?.language != 'en' && messageDetails?.language != 'km' && messageDetails?.language != 'da' && messageDetails?.language != 'zh' && messageDetails?.language != 'unknown' && messageDetails?.language) &&
                              <div className="translator-btn">
                                <span
                                  onClick={() => { ArabicTranslation(item?.message_text, item?.id) }}
                                  className={translateData.some(translation => translation.messageId === item?.id && translation.status) ? "active" : ""}
                                >
                                  Translate
                                </span>
                              </div>
                              :

                              (item?.language !== 'en' && item?.language !== 'km' && item?.language !== 'da' && item?.language != 'zh' && item?.language !== 'unknown' && messageDetails?.language) &&
                              <div className="translator-btn">
                                <span
                                  onClick={() => { ArabicTranslation(item?.message_text, item?.id) }}
                                  className={translateData.some(translation => translation.messageId === item?.id && translation.status) ? "active" : ""}
                                >
                                  Translate
                                </span>
                              </div>
                            // (item?.message_text.trim().toLowerCase() == messageDetails?.message_text.trim().toLowerCase() &&
                            //   messageDetails?.language == 'ar' || 'fa') && (item?.language && item?.language === "ar" || 'fa') ?
                            //   <div className="translator-btn">
                            //     <span
                            //       onClick={() => { ArabicTranslation(item?.message_text, item?.id) }}
                            //       className={translateData.some(translation => translation.messageId === item?.id && translation.status) ? "active" : ""}
                            //     >
                            //       Translate
                            //     </span>
                            //   </div>
                            //   : ''
                          }
                        </div>
                        <span className="d-flex align-items-center">
                          {
                            item?.message_text.trim().toLowerCase() == messageDetails?.message_text.trim().toLowerCase() ?
                              <>
                                {dateFormatter(messageDetails?.timestamp)} | {dateFormatter(messageDetails?.timestamp, true)}
                              </>
                              :
                              <>
                                {dateFormatter(item?.timestamp)} | {dateFormatter(item?.timestamp, true)}
                              </>
                          }

                        </span>
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
              })}
            </div>
          </div>
          <div className="additional_messege_searh_group">
            <div className="row gx-3">
              <div className="col-lg-6">
                <div className="additional_messege_searh_group_card">
                  <div className="additional_messege_searh_group_card_inner">
                    <div className="additional_messege_searh_group_card_title">
                      <h4>Additional messages by this user in this group</h4>
                    </div>

                    <div className="additional_messege_content_wrapper">
                      {messageDetails?.other_messages.map(
                        (item: Record<string, string>, index: number) => {
                          return (
                            <div
                              key={index}
                              className={`additional_messege_content  relative_pos ${Object.keys(item).includes('is_deleted') && item?.is_deleted=='1' ? "deleted" : ""}`}
                            >
                              <div
                                className="search_result_people_overlay"
                                onClick={goToDetailsPage}
                                id={`message-${item.id}`}
                              ></div>

                              <div className="">
                                <p>{item?.message_text}</p>
                                <span>
                                  {dateFormatter(item?.timestamp)} |{" "}
                                  {dateFormatter(item?.timestamp, true)}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="additional_messege_searh_group_card">
                  <div className="additional_messege_searh_group_card_inner">
                    <div className="additional_messege_searh_group_card_title">
                      <h4>Additional Groups this user is a member in</h4>
                    </div>
                    <div className="additional_messege_content_wrapper">
                      {messageDetails?.group_memberships.map((item, index) => (
                        <div
                          key={index}
                          className="additional_messege_content relative_pos"
                        >
                          <div
                            className="search_result_people_overlay"
                            onClick={goToDetailsPage}
                            id={`group-${item?.id}`}
                          ></div>
                          <p>{item?.name}</p>
                          <span>Member count: {item?.members_count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default MessageDetailView;
