import React, { memo, useEffect, useState } from "react";
import {
  riskFactorCalc,
  generatingOffsetAndLimitForApi,
  extractDataBasedOnPercentage,
  prepareObjectsWithStyle,
} from "@/helpers";
import {
  Paper,
  TableContainer,
  TableBody,
  TablePagination,
  Pagination,
} from "@mui/material";
import Image from "next/image";
import Highlighter from "react-highlight-words";
import {
  sortingData,
  TSearchByKeyApiResponse,
  TSearchEntityApiSerializerResponse,
  TSearchGroupApiSerializerResponse,
  TSearchMsgApiSerializerResponse,
} from "../types/type";
import { serializeSearchByKeywordApiResponse, activityGraphDataBuilder } from "../helpers";
import { ToastContainer, toast } from "react-toastify";
import {
  allowableServerErrors,
  authHeader,
  pageApiHeader,
  generalizedApiError,
  toastSettingData,
  regexExp400,
  imgBasePath,
} from "@/constants/index";

// import { member_group_map } from '@/assets/datasets/db';

import {
  TApiResponse,
  TErrorMessage,
  TToastErrorSettingData,
  TLogMsgApiSerializerResponse,
  TApiResponseCommon,
  TWordCloudObject,
  TApiData,
  THttpMethod,



} from "@/types/type";
import { groups, messages } from "@/_assets/datasets/db";

type TProp = {
  listDetailInfo: TSearchByKeyApiResponse;

  // changePage:"search-list-entities" | "search-list-messages" | "search-list-groups";
  changePage: string;

  inputVal: string;
  searchStr: string
  goToDetailsPage: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  // search_str:string,
  postSearchByKeyApiRequest: (
    data: Record<string, any>,
    endpoint: string,
    httpMethod: THttpMethod
  ) => Promise<TApiResponse | unknown>;
  setSearchResultSectionLoader: React.Dispatch<React.SetStateAction<boolean>>

  restrictUseEffectFromInitialRendering: React.MutableRefObject<boolean>

  // listDetail:(TSearchEntityApiSerializerResponse | TSearchGroupApiSerializerResponse | TSearchMsgApiSerializerResponse)[]
  listDetail: TSearchByKeyApiResponse
  setListDetail: React.Dispatch<React.SetStateAction<TSearchByKeyApiResponse>>
  filterPayload: Record<string, any>
  sortingValue: sortingData;
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>
  // setListDetail:React.Dispatch<React.SetStateAction<(TSearchEntityApiSerializerResponse | TSearchGroupApiSerializerResponse | TSearchMsgApiSerializerResponse)[]>>


};



const callMessageListApi = () => {

}

const callGroupListApi = () => {

}
const extractChangePage = (changePage: string): string => {
  const changePageSplitVal = changePage.split("-");
  const discardData = changePageSplitVal.pop();
  return changePageSplitVal.join("-");
};

const ListOfDetail = memo(({ listDetail, setListDetail, listDetailInfo, restrictUseEffectFromInitialRendering, changePage, inputVal, searchStr, goToDetailsPage, postSearchByKeyApiRequest, setSearchResultSectionLoader, filterPayload, sortingValue, page, setPage }: TProp) => {


  //   const groupListApiLimit=10
  // const messageListApiLimit=10
  // const entityListApiLimit=10
  // const [OffsetCount,setShowMoreEntityOffsetCount]=useState<number>(0)
  let data = []
  const [totalDataCount, setTotalDataCount] = useState(0)
  // const [showMoreMessageOffsetCount,setShowMoreMessageOffsetCount]=useState<number>(0)
  // const [showMoreGroupsOffsetCount,setShowMoreGroupOffsetCount]=useState<number>(0)
  // const [listDetail, setListDetail] = useState<(TSearchEntityApiSerializerResponse | TSearchGroupApiSerializerResponse | TSearchMsgApiSerializerResponse)[]>([]);

  // const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const extractedChangePage = extractChangePage(changePage)

  const callEntityListApi = async (limit: number = 5, offset: number) => {
    setSearchResultSectionLoader(true);
    //  if (resultArray["peopleCountArr"])
    //  {

    //  }

    try {

      const formData = new FormData();

      // Append data to the FormData object
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      formData.append("search", inputVal);

      formData.append("risk_score", filterPayload?.risk_score);
      formData.append("classification", filterPayload?.classification);
      formData.append("country_id", filterPayload?.country_id);
      if (Object.values(sortingValue).every(value => value === '') === false) {
        formData.append("orderby_field", sortingValue?.orderby_field);
        formData.append("orderby_type", sortingValue?.orderby_type);
      }
      // formData.append(...formData,filterPayload);


      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'entities', 'post');
      setSearchResultSectionLoader(false);

      // console.log(response, "response from list page-------------")
      if (response?.status == "200") {

        let serializedSearchByKeywordApiResponse =
          serializeSearchByKeywordApiResponse({ entities: response?.data })
        // console.log(serializedSearchByKeywordApiResponse,"serializeddd-----")

        setListDetail({ ...serializedSearchByKeywordApiResponse, entities: serializedSearchByKeywordApiResponse?.entities });
        data = serializedSearchByKeywordApiResponse?.entities.result

        // console.log(data, "dataaa")
        setTotalDataCount(+serializedSearchByKeywordApiResponse?.entities?.count)
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
      setSearchResultSectionLoader(false);
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

  const callGroupListApi = async (limit: number = 5, offset: number) => {
    setSearchResultSectionLoader(true);
    //  if (resultArray["peopleCountArr"])
    //  {

    //  }
    try {
      const formData = new FormData();

      // Append data to the FormData object
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      formData.append("search", inputVal);

      formData.append("risk_score", filterPayload?.risk_score);
      formData.append("classification", filterPayload?.classification);
      formData.append("member_count", filterPayload?.member_count);
      if (Object.values(sortingValue).every(value => value === '') === false) {
        formData.append("orderby_field", sortingValue?.orderby_field);
        formData.append("orderby_type", sortingValue?.orderby_type);
      }
      // classification: '',
      // risk_score: '',
      // country: '',
      // member_count: '',
      // date_range: '',
      // search: '',
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'groups', 'post');
      setSearchResultSectionLoader(false);

      if (response?.status == "200") {
        // console.log("-------------------", response)

        let serializedSearchByKeywordApiResponse =
          serializeSearchByKeywordApiResponse({ groups: response?.data })
        // console.log(serializedSearchByKeywordApiResponse, "serializeddd")
        setListDetail({ ...serializedSearchByKeywordApiResponse, groups: serializedSearchByKeywordApiResponse?.groups });

        setTotalDataCount(+serializedSearchByKeywordApiResponse?.groups?.count)

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

      setSearchResultSectionLoader(false);
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

  const callMessageListApi = async (limit: number = 5, offset: number) => {
    setSearchResultSectionLoader(true);
    //  if (resultArray["peopleCountArr"])
    //  {

    //  }
    try {
      const formData = new FormData();

      // Append data to the FormData object
      formData.append("offset", String(offset));
      formData.append("limit", String(limit));
      formData.append("search", inputVal);

      formData.append("risk_score", filterPayload?.risk_score);
      formData.append("date_range", filterPayload?.date_range);
      if (Object.values(sortingValue).every(value => value === '') === false) {
        formData.append("orderby_field", sortingValue?.orderby_field);
        formData.append("orderby_type", sortingValue?.orderby_type);
      }
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'messages', 'post');
      // console.log(response, "response from list page")
      setSearchResultSectionLoader(false);

      if (response?.status == "200") {

        let serializedSearchByKeywordApiResponse =
          serializeSearchByKeywordApiResponse({ messages: response?.data })
        // console.log(serializedSearchByKeywordApiResponse, "serializeddd")
        setListDetail({ ...serializedSearchByKeywordApiResponse, messages: serializedSearchByKeywordApiResponse?.messages });

        setTotalDataCount(+serializedSearchByKeywordApiResponse?.messages?.count)


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

      setSearchResultSectionLoader(false);
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


  // console.log(listDetail, "listofdetaill");
  // const data =
  //   +listDetail?.entities?.count > 0
  //     ? listDetail?.entities.result
  //     : +listDetail?.groups?.count > 0
  //     ? listDetail?.groups.result
  //     : listDetail?.messages?.result;

  // const totalDataCount = +(+listDetail?.entities?.count > 0
  //   ? listDetail?.entities?.count
  //   : +listDetail?.groups?.count > 0
  //   ? listDetail?.groups?.count
  //   : listDetail?.messages?.count);
  // +(data?.groups?.count) > 0 ||
  // +(data?.messages?.count) >0)


  // const callMessagesApi=async(limit:number=messageApiLimit,offset:number)=>{
  // setDetailSectionTabLoader(true)


  // console.log("call messages apii")

  //   try{
  //       const formData = new FormData();

  //       formData.append("id", groupDetails?.id);
  //       formData.append("offset", String(offset));
  //       formData.append("limit",String(limit));
  //       let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'group/messages','post');
  // setDetailSectionTabLoader(false)

  //       if(response?.status=="200"){

  //           console.log(response?.data,"dataaa of group messages")
  //           setGroupMessages(response?.data)
  //           offset=offset+limit

  //           if(+(response?.data?.count)>offset){

  //             setShowMoreMessageOffsetCount(offset)
  //           }
  //           else{
  //             setShowMoreMessageOffsetCount(-1)
  //           }



  //         }
  //         else{

  //           const errorMessage: TErrorMessage =generalizedApiError ;

  //           const toastErrorSettingDataCpy: TToastErrorSettingData =
  //             toastSettingData;
  //           toast.error(
  //             allowableServerErrors.includes(errorMessage)
  //               ? errorMessage
  //               : generalizedApiError,
  //             toastErrorSettingDataCpy
  //           )
  //         }
  //       }
  //   catch(error){
  // setDetailSectionTabLoader(false)

  //       console.error("error")
  //       const errorMessage: TErrorMessage =
  //       error instanceof Error ? error.message : "";

  //     const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
  //     toast.error(
  //       allowableServerErrors.includes(errorMessage)
  //         ? errorMessage
  //         : generalizedApiError,
  //       toastErrorSettingDataCpy
  //     );



  //   }

  // }




  useEffect(() => {


    // if (!restrictUseEffectFromInitialRendering.current) {
    //   // Skip the effect on the first render
    //   console.log(listDetailInfo,"listdetailInfo else")

    //   if(changePage=="search-list-entities" )
    //     {
    //       setListDetail(listDetailInfo?.entities.result);
    //       // data=serializedSearchByKeywordApiResponse?.entities.result

    //       console.log(data,"dataaa")
    // setTotalDataCount(+listDetailInfo?.entities?.count)
    //     }
    //     // else if(changePage=="search-list-groups"){

    //     //   callGroupListApi(rowsPerPage,offset)

    //     // }
    //     // else if(changePage=="search-list-messages"){
    //     //   callMessageListApi(rowsPerPage,offset)


    //     // }


    //   restrictUseEffectFromInitialRendering.current=true
    //   restrictUseEffectFromInitialRendering.current = true;
    //   return;
    // }

    // // if(restrictUseEffectFromInitialRendering.current){
    //   console.log(listDetailInfo,"listdetailInfo-outside")
    // console.log("inside of lalaaa--prev", changePage)

    const cloneChangePage = extractChangePage(changePage)

    // console.log("inside of lalaaa--", cloneChangePage)
    const offset = (page - 1) * rowsPerPage

    if (cloneChangePage == "search-list-entities" && filterPayload?.type == 'people') {
      callEntityListApi(rowsPerPage, offset)
    }
    else if (cloneChangePage == "search-list-groups" && filterPayload?.type == 'group') {

      callGroupListApi(rowsPerPage, offset)

    }
    else if (cloneChangePage == "search-list-messages" && filterPayload?.type == 'message') {
      callMessageListApi(rowsPerPage, offset)


    }




  }, [page, changePage, rowsPerPage, filterPayload, sortingValue])


  const handleChangePage = (event: unknown, newPage: number) => {
    // console.log("inside handleChange", newPage, page)



    setPage(newPage);

  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    // console.log("inside handleChangeRowsPerPage", event.target.value)


    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };


  // const totalPages = Math.ceil(totalDataCount / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  // console.log(listDetail, "listDetail");

  return (
    <>
      {
        totalDataCount > 0 ?

          <div className="search_result_showmore search_result_inner_people_sec search mobile-margin-view">
            <div className="people_result_content">


              <p>
                {" "}
                {
                  extractedChangePage == "search-list-entities"

                    ? (<>People
                      <span>({listDetail?.entities?.count} of {listDetail?.entities?.totalCount} results)</span></>)

                    : extractedChangePage == "search-list-groups"
                      ? <>Group
                        <span>({listDetail?.groups?.count} of {listDetail?.groups?.totalCount} results)</span></>
                      : <>Message
                        <span>({listDetail?.messages?.count} of {listDetail?.messages?.totalCount} results)</span></>
                }
              </p>

            </div>
            <div className="search_people_filter_sec"></div>
            <div className="search_people_pagination_sec"></div>
            <div className="search_result_inner_people_sec_height">
              <Paper>
                <div className="search_result_inner_peoples">
                  <div className="pagination">
                    <Pagination
                      // count={totalPages}
                      count={Math.ceil(totalDataCount / rowsPerPage)}
                      page={page}
                      onChange={(event, value) => {setPage(value) }}
                      // defaultPage={}
                      boundaryCount={2}
                      siblingCount={0}
                    //   showFirstButton
                    //   showLastButton

                    // count={totalPages}
                    // page={page - 1}
                    // onChange={(event, value) => setPage(value)}
                    // defaultPage={3}
                    // boundaryCount={2}
                    // siblingCount={0}
                    // showFirstButton
                    // showLastButton
                    />
                  </div>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    // count={data.length}
                    count={totalDataCount}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  <TableContainer>
                    <div className="search_result_inner_people_list" key={'345'}>
                      {
                        listDetail?.entities?.result.length >
                          0 ?
                          listDetail?.entities?.result
                            // .slice(startIndex, endIndex)
                            .map((searchItem, searchItemIndex) => {
                              return (
                                <div
                                  key={searchItemIndex}
                                  className={`search_result_inner_people`}
                                >
                                  <div
                                    className="search_result_people_overlay"
                                    // onClick={goT}
                                    onClick={goToDetailsPage}
                                    id={`${searchItem.type}-${searchItem.id}`}
                                  ></div>

                                  <div className="search_result_inner_people_cards">
                                    <div className="search_result_inner_people0">
                                      <div className="search_result_inner_people_card">
                                        <div className="search_result_inner_people_card_left">
                                          <div className="search_result_inner_people_image">
                                            <img
                                              src={`${(
                                                searchItem as TSearchEntityApiSerializerResponse
                                              )?.profile_photo_url[0] ||
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
                                                searchWords={[searchStr]}
                                                autoEscape={true}
                                                textToHighlight={`${(
                                                  searchItem as TSearchEntityApiSerializerResponse
                                                ).phone
                                                  }`}
                                              />

                                              {/* <span>Doe</span> */}
                                            </p>
                                            <span>
                                              {
                                                !searchItem.first_name || searchItem.first_name==='N/A'?
                                                  searchItem.phone
                                                  : searchItem.first_name
                                              }
                                            </span>
                                            <div className="d-flex">
                                              {/* src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpERTc5MkI3RjE3OEExMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpERTc5MkI4MDE3OEExMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkEyMTE0RjIyMTc4QTExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRFNzkyQjdFMTc4QTExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+60cYSwAAAyhJREFUeNrElN1PU3cYxz/tOQUBD/aNymtbUAq2IOiUWXmZA40Iy2BzcW53y7JlyZLtZuE/8NaY7Gbe7WJbdJnTDOdQCbLKrERUotgCSodQ7AsFpK28yKT7rfsL2gv7JCcn+eV3zpPv5/l+H9X2xp65SqtJGfr1Fg3vNPD02SIhfwRniwP3pdvsOVxPaCHGs7+DOA/VJs8crXXEs3P48OfTfMIcU+SRaqlMzm8SNut2VuefIxvyydZIxFbWyX35iviLNZRiPZJaxdLyCkoiQUyc6cwFTPvC9FRkcbJMy7JaTrmxHIuvxaZm5xW7+Jl3NkKRaRt5OVlMjvuoqa9gwr9AgS4PvTYP78hjdtVVEAw9J+Kdxv7Td+hL8tGTeslGg8Jeexk3/riLs62O+cU441NBDjbZGbg+SlNbPYvRF9zzzHCoycFA/yhvCtRqnZbr5a1YEjGm5S2po1ZXfRHVaCTlWLODq24v1eWFGPVbuXH5Dh3vORm88xhziR5zoZ5rl9y0dx/ggS/EzGSQs5Ua3s39h7CUlbri0mKdUGzmijBXqzBXYH4Z931fsmlf7zBvd+wjIigMDI/TcbyRvt+GOSgUZ62uU3S2h8IdRgrTQK1S2T6PyhpZ+aB9LxcF2hpbCUUF27hy4S+Of/wWfUMeykuNVIin9/xNuj9qYWR8juknIc5szNC1voA/DdSypayAhlor57/vp/NEC7OBRfpveek+0cwvP/7JsfedhEWcLg8+pOtkMxfOuTjc5WSrSc+S6ymSQYtGyk5dsVT9/4zbhZmu3Z5IztggXOwSZjvSuZ+hUR9mEan/KAz+PkJb5z7GngSYdXu46T9Ho3EL6ZSKnZ9Fax0W5aFrDNuB6mROA6El7BYTnns+bPt3srK2gV+QcIjIPRLzrxL3ZkLLfB0c40udRCAd1EfFNioxaSG+Sl2NmchSnCKjwh6HBWlzk/rd1uTyMOTn8MbuctRiieyqLKbKbqXs4gSvQmFephOnRCIRFW+F11yyp/3TtD/eSKjYTM4rjcZh110yUZlDPfnVqcwovkppRhRnDrX/2x+UjKDuJXcuE4r/FWAAjBMttNdoYOEAAAAASUVORK5CYII=`} */}
                                              {
                                                searchItem.alpha2_code && (
                                                  <img
                                                    src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${searchItem.alpha2_code}.svg`}
                                                    className="img-fluid"
                                                  ></img>
                                                )
                                              }

                                              {/* <img src={`data:image/png;base64,${searchItem.country_flag}`} className="img-fluid"/> */}
                                              <span>
                                                {
                                                  (
                                                    searchItem as TSearchEntityApiSerializerResponse
                                                  ).country
                                                }
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="search_result_inner_people_card_right">
                                          <a href="" className="learn-more-btn-mob">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                            >
                                              <path
                                                d="M12 4.7C12 4.52319 11.9297 4.35362 11.8047 4.2286C11.6797 4.10357 11.5101 4.03333 11.3333 4.03333L5.99996 4C5.82315 4 5.65358 4.07024 5.52855 4.19526C5.40353 4.32029 5.33329 4.48986 5.33329 4.66667C5.33329 4.84348 5.40353 5.01305 5.52855 5.13807C5.65358 5.2631 5.82315 5.33333 5.99996 5.33333H9.70663L4.19329 10.86C4.13081 10.922 4.08121 10.9957 4.04737 11.0769C4.01352 11.1582 3.99609 11.2453 3.99609 11.3333C3.99609 11.4213 4.01352 11.5085 4.04737 11.5897C4.08121 11.671 4.13081 11.7447 4.19329 11.8067C4.25527 11.8692 4.329 11.9187 4.41024 11.9526C4.49148 11.9864 4.57862 12.0039 4.66663 12.0039C4.75463 12.0039 4.84177 11.9864 4.92301 11.9526C5.00425 11.9187 5.07798 11.8692 5.13996 11.8067L10.6666 6.28V10C10.6666 10.1768 10.7369 10.3464 10.8619 10.4714C10.9869 10.5964 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.5964 11.8047 10.4714C11.9297 10.3464 12 10.1768 12 10V4.7Z"
                                                fill="#108DE5"
                                              />
                                            </svg>
                                            <span>Learn More</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }) : listDetail?.groups?.result.length >
                              0 ?
                            listDetail?.groups?.result
                              // .slice(startIndex, endIndex)
                              .map((searchItem, searchItemIndex) => <div key={searchItemIndex} className="result_item_mt">
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
                                        id={`${searchItem.type}-${searchItem.id}`}
                                      ></div>
                                      <div className="search_result_inner_people_card">
                                        <div className="search_result_inner_people_card_left">
                                          <div className="search_result_inner_people_image">
                                            <img
                                              src={`${searchItem?.profile_photo_url ||
                                                "/asset/default_img/group_img.jpg"
                                                }`}
                                              className="img-fluid"
                                            // fill={true}
                                            />
                                          </div>
                                          <div className="search_result_inner_people_content">
                                            {/* <p>Group name lorem doe <span>Doe</span></p> */}
                                            <p className="group_name_width_setter">
                                              <Highlighter
                                                highlightClassName="uni-active"
                                                searchWords={[searchStr]}
                                                autoEscape={true}
                                                textToHighlight={`${searchItem.name}`}
                                              />
                                            </p>

                                            <span>
                                              Members:{" "}
                                              <span>{searchItem?.member_count}</span>
                                            </span>

                                            <div className="inner_card_group_risk">
                                              <span>Group Risk Score : </span>
                                              <div className="inner_card_group_risk_svg">
                                                {
                                                  (searchItem && searchItem?.risk_score) ?(
                                                    <>
                                                      {/* <img
                                                        src={`${riskFactorCalc(searchItem?.risk_score).photo.src}`}
                                                        alt="risk_image"
                                                      /> */}
                                                      <span
                                                        // className={`${riskFactorCalc(searchItem?.risk_score)?.className}`}
                                                      >
                                                        {
                                                          searchItem?.risk_score 
                                                        }
                                                      </span>
                                                    </>
                                                  )
                                                  :
                                                  <span>N/A</span>
                                                }
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="search_result_inner_people_card_right">
                                          {/* <Link href={`/search/${searchItem.id}`}> */}
                                          <a
                                            id={`${searchItem?.type}-${searchItem.id}`}
                                            href="javascript:void(0)"
                                            className="learn-more-btn-mob"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                            >
                                              <path
                                                d="M12 4.7C12 4.52319 11.9297 4.35362 11.8047 4.2286C11.6797 4.10357 11.5101 4.03333 11.3333 4.03333L5.99996 4C5.82315 4 5.65358 4.07024 5.52855 4.19526C5.40353 4.32029 5.33329 4.48986 5.33329 4.66667C5.33329 4.84348 5.40353 5.01305 5.52855 5.13807C5.65358 5.2631 5.82315 5.33333 5.99996 5.33333H9.70663L4.19329 10.86C4.13081 10.922 4.08121 10.9957 4.04737 11.0769C4.01352 11.1582 3.99609 11.2453 3.99609 11.3333C3.99609 11.4213 4.01352 11.5085 4.04737 11.5897C4.08121 11.671 4.13081 11.7447 4.19329 11.8067C4.25527 11.8692 4.329 11.9187 4.41024 11.9526C4.49148 11.9864 4.57862 12.0039 4.66663 12.0039C4.75463 12.0039 4.84177 11.9864 4.92301 11.9526C5.00425 11.9187 5.07798 11.8692 5.13996 11.8067L10.6666 6.28V10C10.6666 10.1768 10.7369 10.3464 10.8619 10.4714C10.9869 10.5964 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.5964 11.8047 10.4714C11.9297 10.3464 12 10.1768 12 10V4.7Z"
                                                fill="#108DE5"
                                              />
                                            </svg>
                                            <span
                                              id={`${searchItem.type}-${searchItem.id}`}
                                            >
                                              Learn More
                                            </span>
                                          </a>
                                          {/* </Link> */}
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                </div>
                              </div>



                              ) :


                            listDetail?.messages?.result
                              // .slice(startIndex, endIndex)
                              .map((searchItem, searchItemIndex) =>
                                <div className="search_result_inner_people dark_bg">
                                  <div
                                    className="search_result_people_overlay"
                                    id={`${searchItem.type}-${searchItem.id}`}
                                    onClick={goToDetailsPage}
                                  ></div>
                                  <div className="search_result_inner_people_card">
                                    <div className="search_result_inner_people_card_left">
                                      <div className="search_result_inner_people_content_area">
                                        <p>
                                          {/* {searchItem.common_name_prop} */}
                                          <Highlighter
                                            highlightClassName="uni-active"
                                            searchWords={[searchStr]}
                                            autoEscape={true}
                                            textToHighlight={`${searchItem?.message_text.length > 102 ? searchItem?.message_text.slice(0, 102) + ' ...' : searchItem?.message_text}`}
                                          />
                                        </p>
                                        <span>
                                          Sender:{" "}
                                          <span>{searchItem?.entity_name.length > 200 ? searchItem?.entity_name.slice(0, 200) + ' ...' : searchItem?.entity_name}</span>
                                        </span>
                                        <br />
                                        <span>
                                          Group: <span> {searchItem?.group_name} </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="search_result_inner_people_card_right">
                                      <a
                                        id={`${searchItem.type}-${searchItem.id}`}
                                        className="learn-more-btn-mob"
                                        href="javascript:void(0)"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M12 4.7C12 4.52319 11.9297 4.35362 11.8047 4.2286C11.6797 4.10357 11.5101 4.03333 11.3333 4.03333L5.99996 4C5.82315 4 5.65358 4.07024 5.52855 4.19526C5.40353 4.32029 5.33329 4.48986 5.33329 4.66667C5.33329 4.84348 5.40353 5.01305 5.52855 5.13807C5.65358 5.2631 5.82315 5.33333 5.99996 5.33333H9.70663L4.19329 10.86C4.13081 10.922 4.08121 10.9957 4.04737 11.0769C4.01352 11.1582 3.99609 11.2453 3.99609 11.3333C3.99609 11.4213 4.01352 11.5085 4.04737 11.5897C4.08121 11.671 4.13081 11.7447 4.19329 11.8067C4.25527 11.8692 4.329 11.9187 4.41024 11.9526C4.49148 11.9864 4.57862 12.0039 4.66663 12.0039C4.75463 12.0039 4.84177 11.9864 4.92301 11.9526C5.00425 11.9187 5.07798 11.8692 5.13996 11.8067L10.6666 6.28V10C10.6666 10.1768 10.7369 10.3464 10.8619 10.4714C10.9869 10.5964 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.5964 11.8047 10.4714C11.9297 10.3464 12 10.1768 12 10V4.7Z"
                                            fill="#108DE5"
                                          />
                                        </svg>
                                        <span>Learn More</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>

                              )





                      }
                    </div>
                  </TableContainer>
                  {/* style={{ display: 'flex', justifyContent: 'center', margin: '20px' } */}
                  {/* <div className='pagination'>
      <Pagination
          count={totalPages}
        //   page={page}
          onChange={(event, value) => setPage(value)}
          defaultPage={5}
          boundaryCount={2}
          siblingCount={0}
        //   showFirstButton
        //   showLastButton

        // count={totalPages}
        // page={page - 1}
        // onChange={(event, value) => setPage(value)}
        // defaultPage={3}
        // boundaryCount={2}
        // siblingCount={0}
        // showFirstButton
        // showLastButton
        />
      </div> */}
                  {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
                </div>
              </Paper>

              {/* <div className="search_result_inner_people_card">
            <div className="search_result_inner_people_card_left">
                <div className="search_result_inner_people_image">
                    <img src="./assets/images/user1.png" className="img-fluid"/>
                </div>
                <div className="search_result_inner_people_content">
                    <p>John <span>Doe</span></p>
                    <span>+93 01 2345678</span>
                    <div className="d-flex">
                        <img src="./assets/images/Afghanistan (AF).svg" className="img-fluid"/>
                        <span>Afghanistan</span>
                    </div>
                </div>
            </div>
            <div className="search_result_inner_people_card_right">
                <a href="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 16 16" fill="none">
                        <path
                            d="M12 4.7C12 4.52319 11.9297 4.35362 11.8047 4.2286C11.6797 4.10357 11.5101 4.03333 11.3333 4.03333L5.99996 4C5.82315 4 5.65358 4.07024 5.52855 4.19526C5.40353 4.32029 5.33329 4.48986 5.33329 4.66667C5.33329 4.84348 5.40353 5.01305 5.52855 5.13807C5.65358 5.2631 5.82315 5.33333 5.99996 5.33333H9.70663L4.19329 10.86C4.13081 10.922 4.08121 10.9957 4.04737 11.0769C4.01352 11.1582 3.99609 11.2453 3.99609 11.3333C3.99609 11.4213 4.01352 11.5085 4.04737 11.5897C4.08121 11.671 4.13081 11.7447 4.19329 11.8067C4.25527 11.8692 4.329 11.9187 4.41024 11.9526C4.49148 11.9864 4.57862 12.0039 4.66663 12.0039C4.75463 12.0039 4.84177 11.9864 4.92301 11.9526C5.00425 11.9187 5.07798 11.8692 5.13996 11.8067L10.6666 6.28V10C10.6666 10.1768 10.7369 10.3464 10.8619 10.4714C10.9869 10.5964 11.1565 10.6667 11.3333 10.6667C11.5101 10.6667 11.6797 10.5964 11.8047 10.4714C11.9297 10.3464 12 10.1768 12 10V4.7Z"
                            fill="#108DE5" />
                    </svg>
                    <span>Learn More</span>
                </a>
            </div>
        </div> */}
            </div>
          </div> :
          <div className="no_data_text">
            <p>No Result Found</p>
          </div>
      }
    </>
  );
});

export default ListOfDetail;



{/* <p>
{" "}
{
+listDetail?.entities?.count > 0 
 
    ? (<>People
    <span>({totalDataCount} of {listDetail?.entities?.totalCount} results)</span></>)
    
    :   +listDetail?.groups?.count > 0 
    ? <>Group
    <span>({totalDataCount} of {listDetail?.groups?.totalCount} results)</span></>
    : <>Message
    <span>({totalDataCount} of {listDetail?.messages?.totalCount} results)</span></>
    
    } <span>({listDetail.length} of 9280 results)</span> 
</p> */}
