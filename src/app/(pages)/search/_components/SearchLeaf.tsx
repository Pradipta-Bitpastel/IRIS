"use client";

import React, { useEffect, useState, useRef, memo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

import "@/_assets/style/style.css";
// import { TLogMsgApiResponse } from "../types/type";

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
  activity_graph_option,
  filterriskScores,
  filtermemberCounts,
  formatTimestamps
} from "@/constants/index";
import {
  TApiResponse,
  TErrorMessage,
  TToastErrorSettingData,
  TLogMsgApiSerializerResponse,
  TApiResponseCommon,
  TWordCloudObject,
} from "@/types/type";
import { useCallApi } from "@/app/api/CallApi";
import { serializeLogMsgApiResponse, filterOutArr } from "@/helpers";
import { dateFormatter, timeout } from "@/utils/commonFunctions";
import { randomIntGenerator } from "@/utils/commonFunctions";

import $ from "jquery";

// import MapComponent from "./MapComponent";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/loading";
import { serializeSearchByKeywordApiResponse, activityGraphDataBuilder, StyledFormControl, theme } from "../helpers";
import {
  TSearchByKeyApiResponse,
  TSearchMsgApiSerializerResponse,
  TSearchGroupApiSerializerResponse,
  TSearchEntityApiSerializerResponse,
  DropdownState,
  sortingData,
} from "@/app/(pages)/search/types/type";
import useDebounce from "@/hooks/useDebounce";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { styled, ThemeProvider } from "@mui/system";
import Highlighter from "react-highlight-words";
import ListOfDetail from "@/app/(pages)/search/_components/ListOfDetail";
import PersonDetailView from "./PersonDetailView";
import LightBOxForMedia from "@/components/LightBoxForMedia";
import GroupDetailView from "./GroupDetailView";
import MessageDetailView from "./MessageDetailView"
import { preparePrevAndNextMsgWithCurrent } from "../helpers";
import styles from "../../../../_assets/style/AdvancedFilter.module.css"
import CalenderSlider from "./CalenderSlider"
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { addDays, set } from 'date-fns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CssBaseline } from "@mui/material";

// import { usePathname} from "next/navigation";

// import Loading from "@/app/loading";

const SearchLeaf = memo(({ params }: { params: { id: string; type: string; msg_id?: string } }) => {


  const [loaderStatus, setLoaderStatus] = useState(false);
  const [detailSectionLoader, setDetailSectionLoader] = useState(false)
  const [detailSectionTabLoader, setDetailSectionTabLoader] = useState(false)
  const [searchResultSectionLoader, setSearchResultSectionLoader] = useState(false)
  const [showMoreMediaOffsetCount, setShowMoreMediaOffsetCount] = useState<number>(0)
  const [showMoreMessageOffsetCount, setShowMoreMessageOffsetCount] = useState<number>(0)
  const [showMoreMemberOffsetCount, setShowMoreMemberOffsetCount] = useState<number>(0)

  const [searchInput, setSearchInput] = useState({
    inputVal: ''
  })
  // const [listDetail, setListDetail] = useState<(TSearchEntityApiSerializerResponse | TSearchGroupApiSerializerResponse | TSearchMsgApiSerializerResponse)[]>([]);

  const restrictUseEffectFromInitialRendering = useRef(false)
  const searchParams = useSearchParams();
  const [showLabel, setShowLabel] = useState({ searchStr: "" });
  const de = useDebounce(showLabel.searchStr, 300);
  let [resultArr, setResultArr] = useState([]);
  let [preloadedAutoCompleteOption, setPreloadedAutoCompleteOption] = useState<
    (
      | TSearchMsgApiSerializerResponse
      | TSearchGroupApiSerializerResponse
      | TSearchEntityApiSerializerResponse
    )[]
  >([]);
  let [categoryWiseStatus, setcategoryWiseStatus] = useState({
    people: false,
    group: false,
    message: false,
  });
  // let [changePage, setChangePage] = useState <"search-result" | "search-list-entities" |"search-list-messages" | "search-list-groups">("search-result");
  let [changePage, setChangePage] = useState<string>("search-result");
  const [page, setPage] = useState(1);

  // const [listDetailInfo, setListDetailInfo] = useState<(TSearchEntityApiSerializerResponse | TSearchGroupApiSerializerResponse | TSearchMsgApiSerializerResponse)[]>([]);

  const [listDetailInfo, setListDetailInfo] = useState<TSearchByKeyApiResponse>({
    groups: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    entities: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    messages: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
  })

  const [listDetail, setListDetail] = useState<TSearchByKeyApiResponse>({
    groups: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    entities: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    messages: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
  })

  let resultArrayUpperLimit = 2;

  let [searchByKeyState, setSearchByKeyState] = useState<TSearchByKeyApiResponse>({
    groups: {
      totalCount: "0",
      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    entities: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
    messages: {
      totalCount: "0",

      count: "0", // Initialize count with a default value
      result: [], // Assuming you have a list of groups under this structure
    },
  });
  const [detailInformationObject, setDetailInformationObject] = useState<Record<string, any>>({});

  const [detailPageMedia, setDetailPageMedia] = useState<any[]>([]);

  const [detailPageMessage, setDetailPageMessage] = useState<Record<string, any>>({ count: '0', result: [] });

  const [mediaIdForLightbox, setMediaIdForLightbox] = useState<string>()
  // const [activeTab, setActiveTab] = useState<string>("members_area");
  const [activeTab, setActiveTab] = useState<string>("messages_area");
  const [onSearchCallDeciderStatus, setOnSearchCallDeciderStatus] = useState<Record<string, any>>({});
  const [detailPageMembers, setDetailPageMembers] = useState<Record<string, any>>({
    count: '0',
    result: []
  })
  const [selectbtn, setSelectbtn] = useState<string>('')
  const [btnStatus, setBtnstatus] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string | any>('')


  // filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deletedData, setDeletedData] = useState([])
  const [filterStatus, setFilterStatus] = useState({
    all: true,
    group: false,
    message: false,
    people: false
  })
  const [filterData, setFilterData] = useState({
    country: [],
    group_classification: [],
    people_classifications: [],
    // people: false
  })
  let initialDate = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
    maxDate: new Date(),
  }
  const [datePick, setdatePick] = useState<any>([
    initialDate
  ]);

  const [dropdownValues, setDropdownValues] = useState<DropdownState>({
    type: '',
    classification: '',
    risk_score: '',
    country_id: '',
    member_count: '',
    date_range: '',
    search: '',
  });

  const [sortingValue, setSortingValue] = useState<sortingData>({
    orderVal: '',
    orderby_field: '',
    orderby_type: ''
  });
  const [dashboardmsgId, setdashboardmsgId] = useState<string>(
    searchParams.has('msg_id') ? searchParams.get('msg_id') : ''
  )

  // console.log(searchParams.has('msg_id'), "paramm");
  const handelSortingChange = (event: any) => {
    // let resultVal = (event.target.value).split('-')
    let inputPayload = splitStringAscDesc(event.target.value)
    // console.log(inputPayload, 'inputPayload');

    setSortingValue((prev) => ({
      ...prev,
      orderVal: event.target.value,
      orderby_field: inputPayload[0],
      orderby_type: inputPayload[1]
    }))
    // console.log(resultVal)
  };

  function splitStringAscDesc(inputString: string) {
    // Match ASC or DESC at the end of the string
    const match = inputString.match(/\b(ASC|DESC)\b$/i);

    if (match) {
      const direction = match[1].toUpperCase(); // ASC or DESC
      let restOfString = inputString.replace(/\b(ASC|DESC)\b$/i, '').trim().toLowerCase();

      // Check if the string has multiple words (separated by spaces)
      if (restOfString.includes(' ')) {
        if (restOfString == 'country name') {
          restOfString = restOfString.replace(/\s+/g, '__');
        } else {
          // If it has more than one word, replace spaces with underscores
          restOfString = restOfString.replace(/\s+/g, '_');
        }
      } else {
        if (restOfString == 'date') {
          restOfString = 'timestamp'
        }
      }
      return [restOfString, direction];
    }

    // Return nulls if no ASC/DESC is found
    return [inputString.toLowerCase(), null];
  }


  const goToFilteredList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | string, gotTheId?: string) => {
    // setCloneMemberGroup(member_group_map)
    let id = gotTheId || (typeof e === 'string' ? e : (e.target as HTMLButtonElement).id);
    // btnList.forEach
    if ($(".search_result_content_inner_button button").hasClass("selected")) {

      $(".search_result_content_inner_button button").removeClass("selected");

    }
    // console.log(id, "iddd-filtered list")

    if (id == "people") {
      let status = categoryWiseStatus.people;

      if (!status) {

        $(`#${id}`).addClass("selected");

        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: true,
          group: false,
          message: false,
        });
        setDropdownValues({
          ...dropdownValues,
          type: 'people',
          // classification:'',
        })
      } else {
        // $(`#${id}`).removeClass("selected");

        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: false,
          group: false,
          message: false,
        });
        setDropdownValues({
          ...dropdownValues,
          type: 'all',
        })
      }
      setSortingValue((prev) => ({
        orderVal: '',
        orderby_field: '',
        orderby_type: ''
      }))
    } else if (id == "group") {
      let status = categoryWiseStatus.group;

      if (!status) {
        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: false,
          group: true,
          message: false,

        });
        setDropdownValues({
          ...dropdownValues,
          type: 'group',
          // classification:'',
        })
        $(`#${id}`).addClass("selected");
      } else {
        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: false,
          group: false,
          message: false,
        });
        setDropdownValues({
          ...dropdownValues,
          type: 'all',
        })
      }
      setSortingValue((prev) => ({
        orderVal: '',
        orderby_field: '',
        orderby_type: ''
      }))
    } else if (id == "message") {
      let status = categoryWiseStatus.message;

      if (!status) {
        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: false,
          group: false,
          message: true,
        });
        setDropdownValues({
          ...dropdownValues,
          type: 'message',
        })
        $(`#${id}`).addClass("selected");
      } else {
        setcategoryWiseStatus({
          ...categoryWiseStatus,
          people: false,
          group: false,
          message: false,
        });
        setDropdownValues({
          ...dropdownValues,
          type: 'all',
        })
      }
      setSortingValue((prev) => ({
        orderVal: '',
        orderby_field: '',
        orderby_type: ''
      }))
    } else {
      $(`#all`).addClass("selected")
      setcategoryWiseStatus({
        ...categoryWiseStatus,
        people: false,
        group: false,
        message: false,
      });
      setDropdownValues({
        ...dropdownValues,
        type: 'all',
      })
      setSortingValue((prev) => ({
        orderVal: '',
        orderby_field: '',
        orderby_type: ''
      }))
    }

    setPage(1);

    // setcategoryWiseStatus({...categoryWiseStatus,people:true,group:true,message:false})
  };

  const postSearchByKeyApiRequest = async (data: Record<string, any>, endpoint: string, httpMethod: THttpMethod) => {
    let searchByKeyData = {
      search: showLabel?.searchStr || null,
    };


    // Append data to the FormData object
    // formData.append('search', {});
    try {
      let res: TApiResponse = await useCallApi({
        headersInfo: {
          ...authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // endpoint: "api/search-keyword",
        endpoint: 'api/' + endpoint,
        httpMethod: httpMethod,
        data: data,
      });

      return res;
    } catch (error: unknown) {
      // setLoaderStatus(false);
      console.log(error);

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
  };
  const pathName = usePathname();
  const callSearchByKeyApi = async () => {
    // console.log("in,debounce");

    try {
      const formData = new FormData();

      // Append data to the FormData object
      formData.append("search", de);
      if (Object.values(dropdownValues).every(value => value === '') === false) {
        formData.append("risk_score", dropdownValues?.risk_score);
        formData.append("classification", dropdownValues?.classification);
        formData.append("country_id", dropdownValues?.country_id);
        formData.append("classification", dropdownValues?.classification);
        formData.append("member_count", dropdownValues?.member_count);
        formData.append("date_range", dropdownValues?.date_range);
      }

      if (Object.values(sortingValue).every(value => value === '') === false) {
        formData.append("orderby_field", sortingValue?.orderby_field);
        formData.append("orderby_type", sortingValue?.orderby_type);
      }
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'search-keyword', 'post');
      if (response) {
        // console.log(response, "responseee");

        let serializedSearchByKeywordApiResponse =
          serializeSearchByKeywordApiResponse(response?.data?.all_result);
        // console.log(
        //   serializedSearchByKeywordApiResponse,
        //   "inside debouncer-----"
        // );

        setPreloadedAutoCompleteOption(() => {
          return [
            ...serializedSearchByKeywordApiResponse?.groups?.result,
            ...serializedSearchByKeywordApiResponse?.entities?.result,
            ...serializedSearchByKeywordApiResponse?.messages?.result,
          ];
        });
      }
    } catch (err) {
      console.error(err);
    }

    // return [...arrangedArr];
  };

  useEffect(() => {
    // console.log("in,debounce")

    if (de.length > 0) {
      callSearchByKeyApi();

    }
    // if (de.length > 0) {
    //   // 'status=active'
    //   const params = new URLSearchParams(searchParams.toString());
    //   params.set('status', 'active');
    //   router.replace(`/search?${params.toString()}`);
    //   const statusFromURL = searchParams.get('status');
    //   setBtnstatus(statusFromURL)
    // }
    // nameAssignedMsg
  }, [de]);

  useEffect(() => {
    const changePageStatusAndFetchingListApi = async () => {


      let id = $(".search_result_content_inner_button button.selected").attr(
        "id"
      );

      // console.log("id------", id);
      // setListDetail(searchByKeyState)
      if (id == "people" && Object.keys(onSearchCallDeciderStatus).length > 0) {
        // setListDetail({...searchByKeyState,groups:{count:"0",result:[]},messages:{count:"0",result:[]},})

        // setSearchResultSectionLoader(true);
        // console.log(searchByKeyState, "resultarrrr");
        //  if (resultArray["peopleCountArr"])
        //  {

        //  }
        // ..................params.................. 
        // try{
        //           const formData = new FormData();

        //           // Append data to the FormData object
        //           formData.append("offset","0" );
        //           formData.append("search",showLabel.searchStr );
        //       formData.append("limit",String(5));



        //           let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'entities','post');
        //           console.log(response,"response from list page")
        //       setSearchResultSectionLoader(false);

        //           if(response?.status=="200"){

        //             let serializedSearchByKeywordApiResponse =
        //             serializeSearchByKeywordApiResponse({entities:response?.data})
        //             console.log(serializedSearchByKeywordApiResponse,"serializeddd")
        //         // setChangePage("search-list");

        //         setListDetailInfo(serializedSearchByKeywordApiResponse);
        //         setChangePage("search-list-entities")

        //       }
        //       else{

        //         const errorMessage: TErrorMessage =generalizedApiError ;

        //         const toastErrorSettingDataCpy: TToastErrorSettingData =
        //           toastSettingData;
        //         toast.error(
        //           allowableServerErrors.includes(errorMessage)
        //             ? errorMessage
        //             : generalizedApiError,
        //           toastErrorSettingDataCpy
        //         )
        //       }
        //     }
        //     catch(error){
        //       setSearchResultSectionLoader(false);


        //       console.error("error",error)
        //       const errorMessage: TErrorMessage =
        //       error instanceof Error ? error.message : "";

        //     const toastErrorSettingDataCpy: TToastErrorSettingData = toastSettingData;
        //     toast.error(
        //       allowableServerErrors.includes(errorMessage)
        //         ? errorMessage
        //         : generalizedApiError,
        //       toastErrorSettingDataCpy
        //     );

        //     }
        // ..................params.................. 
        setListDetail({
          groups: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          entities: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          messages: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
        })

        setChangePage("search-list-entities" + "-" + Date.now());


      } else if (id == "group" && Object.keys(onSearchCallDeciderStatus).length > 0) {
        // setListDetail({...searchByKeyState,entities:{count:"0",result:[]},messages:{count:"0",result:[]},})


        // setSearchResultSectionLoader(true);
        // setChangePage("search-list-groups")

        // ...............off............... 
        //     const formData = new FormData();


        //     // Append data to the FormData object
        //     formData.append("offset","0" );
        //     formData.append("search",showLabel.searchStr );


        //     let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'groups','post');
        //     if(response){

        //       let serializedSearchByKeywordApiResponse =
        //       serializeSearchByKeywordApiResponse({groups:response?.data})
        //   setChangePage("search-list");


        // }
        // ...............off............... 
        // setListDetail(searchByKeyState)
        // setSearchResultSectionLoader(false);
        // setChangePage("search-list");
        setListDetail({
          groups: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          entities: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          messages: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
        })

        setChangePage("search-list-groups" + "-" + Date.now());

      } else if (id == "message" && Object.keys(onSearchCallDeciderStatus).length > 0) {
        // setListDetail({...searchByKeyState,entities:{count:"0",result:[]},groups:{count:"0",result:[]},})

        // setSearchResultSectionLoader(true);
        // ...............off............... 

        // const formData = new FormData();

        // // Append data to the FormData object
        // formData.append("offset","0" );
        // formData.append("search",showLabel.searchStr );


        // let response: TApiData | undefined = await postSearchByKeyApiRequest(formData,'messages','post');
        // console.log(response,"response from list page message")

        // if(response){
        //   let serializedSearchByKeywordApiResponse =
        //   serializeSearchByKeywordApiResponse({messages:response?.data})
        //   setChangePage("search-list")
        //   setListDetail(serializedSearchByKeywordApiResponse);

        // };
        // ...............off............... 
        // setListDetail(searchByKeyState)


        // setSearchResultSectionLoader(false);
        // setChangePage("search-list-messages");
        setListDetail({
          groups: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          entities: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
          messages: {
            totalCount: "0",

            count: "0", // Initialize count with a default value
            result: [], // Assuming you have a list of groups under this structure
          },
        })
        setChangePage("search-list-messages" + "-" + Date.now());

      } else if ((searchByKeyState?.entities?.count == searchByKeyState?.entities?.totalCount && searchByKeyState?.groups?.count == searchByKeyState?.groups?.totalCount && searchByKeyState?.messages?.count == searchByKeyState?.messages?.totalCount)) {
        // console.log(onSearchCallDeciderStatus,'---->outside');
        // console.log(searchByKeyState, '---->outside');
        setChangePage("search-result");
      }
      else {
        // console.log('---->inside');
        // onSearch(showLabel.searchStr)
        // setSearchResultSectionLoader(false);

        // setListDetail([])
        try {
          setLoaderStatus(true);
          // console.log(showLabel, "showlabel");

          // ...............off............... 
          // alert(Object.keys(dropdownValues).length)
          const formData = new FormData();

          // Append data to the FormData object
          formData.append("search", searchInput.inputVal);
          // if(Object.keys(dropdownValues).length> 0){
          if (Object.values(dropdownValues).every(value => value === '') === false) {
            formData.append("risk_score", dropdownValues?.risk_score);
            formData.append("classification", dropdownValues?.classification);
            formData.append("country_id", dropdownValues?.country_id);
            formData.append("classification", dropdownValues?.classification);
            formData.append("member_count", dropdownValues?.member_count);
            formData.append("risk_score", dropdownValues?.risk_score);
            formData.append("date_range", dropdownValues?.date_range);
          }
          if (Object.values(sortingValue).every(value => value === '') === false) {
            formData.append("orderby_field", sortingValue?.orderby_field);
            formData.append("orderby_type", sortingValue?.orderby_type);
          }
          let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'search-keyword', 'post');

          // let response: TApiData | undefined = await postSearchByKeyApiRequest({
          //   search: showLabel.searchStr,
          // });
          if (response) {
            // console.log(response?.data?.all_result, "responseee");
            let serializedSearchByKeywordApiResponse =
              serializeSearchByKeywordApiResponse(response?.data?.all_result);

            // console.log(
            //   response,
            //   serializedSearchByKeywordApiResponse,
            //   "serach function output"
            // );
            setSearchByKeyState({
              ...serializedSearchByKeywordApiResponse,
              entities: serializedSearchByKeywordApiResponse.entities,
              groups: serializedSearchByKeywordApiResponse.groups,
              messages: serializedSearchByKeywordApiResponse.messages,
            });
          }

          // ...............off............... 


          // setListDetail(searchByKeyState)

          setLoaderStatus(false);
        } catch (err) {
          setLoaderStatus(false);

          console.error(err);
        }


        setChangePage("search-result");
      }


    }

    if (Object.keys(searchByKeyState).length > 0) {
      changePageStatusAndFetchingListApi()
    }
    // if (Object.keys(onSearchCallDeciderStatus).length < 0) {
    //   $(".search_result_content_inner_button button").addClass("inactive")
    // } else {
    //   $(".search_result_content_inner_button button").removeClass("inactive")
    // }

    // if(Object.keys(searchByKeyState).length > 0 &&
    //                 searchByKeyState?.entities?.result?.length > 0 ||
    //               searchByKeyState?.groups?.result?.length > 0 ||
    //               searchByKeyState?.messages?.result?.length > 0){
    //                 changePageStatusAndFetchingListApi()
    //               }

    //     if (Object.keys(searchByKeyState).length > 0) {
    //       if (Object.keys(categoryWiseStatus).length > 0) {
    // changePageStatusAndFetchingListApi()
    //       }

    //     }
    // else {
    //   setListDetail("result");
    // }

  }, [categoryWiseStatus, onSearchCallDeciderStatus]);

  useEffect(() => {
    if (params && Object.keys(params).length > 0) {
      // alert(JSON.stringify(searchParams.get('type')))
      // setSelectbtn(JSON.stringify(searchParams.get('type')))
      // console.log(params);

      // setdashboardmsgId(JSON.stringify(searchParams.get("msg_id")).replace(/"/g, ''))
      setShowLabel(() => {
        return { ...showLabel, searchStr: decodeURIComponent(params?.id) };

      });
      setSearchInput(() => { return { ...searchInput, inputVal: decodeURIComponent(params?.id) } })
      // goToDetailsPage(searchParams.get('type') + "-" + searchParams.get('id'))
      onSearch(decodeURIComponent(params?.id));
    }
    else if (searchParams.has("id")) {
      // console.log(params);
      let btnSelction: string = JSON.stringify(searchParams.get('type')).replace(/"/g, '');
      setSelectbtn(btnSelction)
      // alert(searchParams.get("msg_id"))
      // setdashboardmsgId(JSON.stringify(searchParams.get("msg_id")).replace(/"/g, ''))
      // onSearch(searchParams.get("keyword"));
      goToDetailsPage(JSON.stringify({ id: searchParams.get("id"), type: searchParams.get("type") }))
      // --18thNov24
      // goToDetailsPage(JSON.stringify({id:"b8b4b727d6f5d1b61fff7be687f7970f",type:searchParams.get("type")}))
    }
    else {
      // console.log("insidea param useeffect")
      onSearch("")
      setOnSearchCallDeciderStatus({ event: "", date: new Date() })
    }

    if (!searchParams.has("id")) {
      // alert()
      setOnSearchCallDeciderStatus({ event: "", date: new Date() })
    }
  }, [params, searchParams])


  const onSearch = async (event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | string) => {
    try {
      let searchValue = ""
      if (typeof (event) == "string") {
        searchValue = event
      }
      else {

        // console.log("else onserch")

        searchValue = showLabel.searchStr;
      }
      if (Object.values(dropdownValues).every(value => value === '') === true && Object.values(sortingValue).every(value => value === '') === true) {
        setLoaderStatus(true);
      } else {
        setSearchResultSectionLoader(true)
      }
      // console.log(showLabel, "showlabel");


      const formData = new FormData();

      // Append data to the FormData object
      formData.append("search", searchValue);
      if (Object.values(dropdownValues).every(value => value === '') === false) {
        formData.append("risk_score", dropdownValues?.risk_score);
        formData.append("classification", dropdownValues?.classification);
        formData.append("country_id", dropdownValues?.country_id);
        formData.append("classification", dropdownValues?.classification);
        formData.append("member_count", dropdownValues?.member_count);
        formData.append("date_range", dropdownValues?.date_range);
      }
      if (Object.values(sortingValue).every(value => value === '') === false) {
        formData.append("orderby_field", sortingValue?.orderby_field);
        formData.append("orderby_type", sortingValue?.orderby_type);
      }
      let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'search-keyword', 'post');

      // let response: TApiData | undefined = await postSearchByKeyApiRequest({
      //   search: showLabel.searchStr,
      // });
      if (response) {
        // console.log(response?.data?.all_result, "responseee");
        let serializedSearchByKeywordApiResponse =
          serializeSearchByKeywordApiResponse(response?.data?.all_result);

        // console.log(
        //   response,
        //   serializedSearchByKeywordApiResponse,
        //   "serach function output"
        // );
        setSearchByKeyState({
          ...serializedSearchByKeywordApiResponse,
          entities: serializedSearchByKeywordApiResponse.entities,
          groups: serializedSearchByKeywordApiResponse.groups,
          messages: serializedSearchByKeywordApiResponse.messages,
        });
      }
      if (Object.values(dropdownValues).every(value => value === '') === true && Object.values(sortingValue).every(value => value === '') === true) {
        // setLoaderStatus(true);
        setLoaderStatus(false);
      } else {
        setSearchResultSectionLoader(false)
      }
    } catch (err) {
      // setLoaderStatus(false);
      if (Object.values(dropdownValues).every(value => value === '') === true && Object.values(sortingValue).every(value => value === '') === true) {
        // setLoaderStatus(true);
        setLoaderStatus(false);
      } else {
        setSearchResultSectionLoader(false)
      }
      console.error(err);
    }
  };
  // React.MouseEvent<HTMLAnchorElement, MouseEvent>)
  const goToList = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

    // console.log("inside go to list")
    e.preventDefault();
    // setCloneMemberGroup(member_group_map)


    let targetId = (e.target as HTMLButtonElement).id;
    // console.log(targetId, "targetidd")
    if (targetId == "list-entity") {
      goToFilteredList("", "people");
      // https://meet.google.com/xkn-fryh-duz?authuser=0
      // $(".search_result_content_inner_button button#people").click()
    } else if (targetId == "list-group") {
      goToFilteredList("", "group");
    } else {
      goToFilteredList("", "message");
    }
    // $(`${targetId}`).click();

    // setChangePage("result")
    // setChangePage("list")

    // setCategorywiseStatus({})
  };

  const goToDetailsPage = async (event: React.MouseEvent<HTMLDivElement, MouseEvent> | string) => {
    let itemId = ""
    let itemType = ""
    if (typeof (event) == "string") {
      const item = JSON.parse(event)
      itemId = item.id,
        itemType = item.type
    }
    else {
      event.preventDefault();
      let anchor_id = (event.target as HTMLDivElement).id
      let anchor_id_arr = anchor_id.split("-");
      // console.log(anchor_id, " in the go detail section")
      itemId = anchor_id_arr[1]
      itemType = anchor_id_arr[0]

    }
    if (window.matchMedia("(max-width: 767px)").matches) {
      setTimeout(() => {
        $('html, body').animate(
          {
            // #mobile_sec_target
            scrollTop: $(document).height() - $(window).height()
          },
          2
        )
      }, 120)
    }

    //     let anchor_id = (event.target as HTMLDivElement).id 
    //     let anchor_id_arr = anchor_id.split("-");
    //     console.log(anchor_id," in the go detail section")
    // const itemId=anchor_id_arr[1]
    // const itemType=anchor_id_arr[0]
    setShowMoreMediaOffsetCount(0)
    setShowMoreMessageOffsetCount(0)
    setShowMoreMemberOffsetCount(0)
    setDetailPageMedia([])
    setDetailPageMessage({ count: 0, result: [] })
    // setDetailSectionTabLoader(true)
    setDetailSectionLoader(true)
    setDetailPageMembers({

      count: '0',
      result: []
    })

    try {
      if (itemType == "entity") {

        const formData = new FormData();

        formData.append("id", itemId);

        let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'entity', 'post');
        setDetailSectionLoader(false)
        // setDetailSectionTabLoader(false)


        if (response?.status == "200") {

          // console.log(response?.data, "personal_data")

          setActiveTab("personal_details")


          setDetailInformationObject({ ...response?.data, type: 'entity' })



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

      else if (itemType == "group") {


        const formData = new FormData();

        formData.append("id", itemId);

        let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'group', 'post');
        setDetailSectionLoader(false)
        setDetailSectionTabLoader(false)
        // console.log(response, "response");



        if (response?.status == "200") {

          // console.log(response?.data, "group_data")
          setActiveTab("messages_area" + "-" + new Date())
          const graph_data = activityGraphDataBuilder('id')


          setDetailInformationObject({ ...response?.data, type: 'group', activity_graph_data: graph_data, activity_graph_option: activity_graph_option })

          const randomDeleteData = getRandomData()
          setDeletedData(randomDeleteData)

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
      else if (itemType == "message") {

        const formData = new FormData();

        formData.append("id", itemId);

        let response: TApiData | undefined = await postSearchByKeyApiRequest(formData, 'message', 'post');

        setDetailSectionLoader(false)
        // setDetailSectionTabLoader(false)


        if (response?.status == "200") {

          // console.log(response?.data, "dataaa")

          const prevAndNextMsgWithCurrent = preparePrevAndNextMsgWithCurrent(response?.data)

          setDetailInformationObject({ ...response?.data, type: 'message', prevAndNextMsgWithCurrent: prevAndNextMsgWithCurrent })
          const randomDeleteData = getRandomData()
          setDeletedData(randomDeleteData)
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
    }
    // else if(ite)
    catch (error) {
      setDetailSectionLoader(false)

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

  };

  const openLightbox = (e) => {
    let id = e.target.id
    // alert(id)
    if (id) {
      setMediaIdForLightbox(() => (id.split("-")[1]))
    }
    $("#lightBox-popup").css("display", "block");
    $("#overlay-lightbox").css("display", "block");
    // console
  }
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    // window.localStorage.setItem("activeTab", tabName);
  };
  // const onSearchCallDecider=(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> )=>{

  const onSearchCallDecider = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {

    // console.log("inside",searchValue,"searchValue----------------------")

    // if(categoryWiseStatus=="search-result"){

    // }
    // const {name}=event.target 
    event.preventDefault();

    // console.log("inside",searchInput,"searchValue----------------------")
    if (de.length > 0) {
      setOnSearchCallDeciderStatus({ event: "", date: new Date() })
    }
    setSearchInput({ ...searchInput, inputVal: showLabel.searchStr })
    // console.log(event.target,"target-------",event.target.name,event.target.value)
    if (categoryWiseStatus.people || categoryWiseStatus.group || categoryWiseStatus.message) {
      // return
      setOnSearchCallDeciderStatus({ event, date: new Date() })
    }
    else {
      onSearch(event)
    }

  }


  const filterContentRef = useRef(null);
  const dropdownRefs = {
    filter1: useRef(null),
    filter2: useRef(null),
    filter3: useRef(null),
    filter4: useRef(null),
    filter5: useRef(null),
  };

  // Smooth toggle for the Advanced Filter
  const toggleFilter = () => {
    const filterContent = filterContentRef.current;

    if (isFilterOpen && !loaderStatus && Object.keys(onSearchCallDeciderStatus).length > 0) {
      // Collapse the filter content
      setIsFilterOpen(false);
      filterContent.style.maxHeight = 0;
      filterContent.style.opacity = 0;
      setTimeout(() => setIsFilterOpen(false), 300);
    } else {
      // Expand the filter content
      if (!loaderStatus && !searchResultSectionLoader && Object.keys(onSearchCallDeciderStatus).length > 0) {
        setIsFilterOpen(true);
        requestAnimationFrame(() => {
          filterContent.style.maxHeight = `${filterContent.scrollHeight}px`;
          // filterContent.style.maxHeight = `400px`;
          filterContent.style.opacity = 1;
        });
      }
    }
  };

  // Smooth toggle for individual dropdowns
  const toggleDropdown = (dropdownId) => {
    const dropdown = dropdownRefs[dropdownId].current;

    if (openDropdown === dropdownId) {
      // Collapse the dropdown
      dropdown.style.maxHeight = 0;
      dropdown.style.zIndex = -1;
      dropdown.style.opacity = 0;
      setShowDatePicker(false);
      setTimeout(() => setOpenDropdown(null), 300);
    } else {
      // Expand the new dropdown and collapse any open one
      if (openDropdown) {
        const openDropdownElement = dropdownRefs[openDropdown].current;
        openDropdownElement.style.maxHeight = 0;
        openDropdownElement.style.zIndex = -1;
        openDropdownElement.style.opacity = 0;
        setShowDatePicker(false);
      }
      setOpenDropdown(dropdownId);
      requestAnimationFrame(() => {
        // dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
        dropdown.style.maxHeight = `300px`;
        dropdown.style.zIndex = `3`;
        dropdown.style.opacity = 1;
        if (dropdownId == 'filter5') {
          setShowDatePicker(true);
        }
      });
    }
  };

  // Close the filter when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!filterContentRef.current.contains(event.target)) {
        if (isFilterOpen) toggleFilter();
        if (openDropdown) toggleDropdown(openDropdown);
        setShowDatePicker(false);
      }
    };
    if (!loaderStatus && !searchResultSectionLoader && Object.keys(onSearchCallDeciderStatus).length > 0) {
      document.addEventListener("click", handleOutsideClick);
      // Filter btn status change
      if (!(loaderStatus && categoryWiseStatus.people && categoryWiseStatus.group && categoryWiseStatus.message)) {
        // all
        setFilterStatus({
          ...filterStatus,
          all: true,
          people: false,
          group: false,
          message: false,
        })
      } if ((!categoryWiseStatus.group && categoryWiseStatus.people && !categoryWiseStatus.message)) {
        // people
        setFilterStatus({
          ...filterStatus,
          all: false,
          people: true,
          group: false,
          message: false,
        })
      } if ((categoryWiseStatus.group && !categoryWiseStatus.people && !categoryWiseStatus.message)) {
        // people
        setFilterStatus({
          ...filterStatus,
          all: false,
          people: false,
          group: true,
          message: false,
        })
      } if ((!categoryWiseStatus.group && !categoryWiseStatus.people && categoryWiseStatus.message)) {
        // people
        setFilterStatus({
          ...filterStatus,
          all: false,
          people: false,
          group: false,
          message: true,
        })
      }
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isFilterOpen, openDropdown]);

  // Search filter api call
  const searchFilterDropdownApi = async () => {
    try {
      let response: TApiResponse = await useCallApi({
        headersInfo: {
          ...authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        endpoint: 'api/search-filterlist',
        httpMethod: 'get',
      });
      if (response?.status == '200') {

        setFilterData({
          ...filterData,
          country: response?.data?.countries,
          group_classification: response?.data?.group_classifications,
          people_classifications: response?.data?.entity_classifications
        })
      }

    } catch (err) {
      console.log(err);

    }
  }

  useEffect(() => {
    searchFilterDropdownApi()
  }, [])
  // data: Record<string, any>, endpoint: string, httpMethod: THttpMethod
  function filterEmptyFields(obj: any) {
    const filteredObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        filteredObj[key] = value;
      }
    }
    return filteredObj;
  }
  const handleFilterInputChange = async (field: keyof DropdownState, value: string,) => {
    setDropdownValues((prev) => ({
      ...prev,
      [field]: value,
      search: showLabel.searchStr
    }));
    setPage(1)
    // date_range: 
    // type: type
    // await searchFilterApi()
  };
  function getRandomData() {
    const max = 20; // Range is 0 to 5 inclusive
    const dataCount = Math.floor(Math.random() * max); // Randomly choose how many values to return (0 to 5)
    const dataSet = new Set();

    while (dataSet.size < dataCount) {
      const randomValue = Math.floor(Math.random() * max); // Generate random number between 0 and 5
      dataSet.add(randomValue); // Add it to the set to avoid duplicates
    }

    return Array.from(dataSet);
  }

  const clearAll = () => {
    setDropdownValues((prev) => ({
      ...prev,
      classification: '',
      risk_score: '',
      country_id: '',
      member_count: '',
      date_range: '',
    }));
    setdatePick([initialDate])
    setSortingValue({
      orderVal: '',
      orderby_field: '',
      orderby_type: ''
    });
  }

  useEffect(() => {
    if (Object.keys(onSearchCallDeciderStatus).length > 0 && !categoryWiseStatus.people && !categoryWiseStatus.group && !categoryWiseStatus.message && Object.keys(searchByKeyState).length > 0) {
      onSearch()
    }
  }, [dropdownValues])

  useEffect(() => {
    if (Object.keys(searchByKeyState).length > 0 && Object.keys(onSearchCallDeciderStatus).length > 0 && !categoryWiseStatus.people && !categoryWiseStatus.group && !categoryWiseStatus.message) {
      onSearch();
    }
  }, [sortingValue]);
  // }
  // console.log((Object.values(sortingValue).every(value => value === '')), 'dropdownValues');
  // console.log(Object.values(dropdownValues).every(value => value === ''), 'deletedData');
  // console.log(searchByKeyState);

  // searchFilterApi()
  return (
    <>
      <div className="dashboard_main">
        <section className="search_dashboard">
          <div className="container-fluid ">
            <div className="row search_dashboard_inner gx-1 gx-md-2 gx-lg-2">
              <div className="col-lg-12 col-md-12 col-12 align-self-center">
                <div className="search_bar_right">

                  <form className="form"  >
                    <div className="col-md-10 col-9">
                      <div className="search_inp">
                        <Autocomplete
                          freeSolo
                          id="search"
                          disableClearable
                          autoFocus={true}
                          options={preloadedAutoCompleteOption}
                          getOptionLabel={(option) => {
                            if (typeof option === "object" && option.type) {
                              switch (option.type) {
                                case "group":
                                  return (option as TSearchGroupApiSerializerResponse).name;
                                case "entity":
                                  return (option as TSearchEntityApiSerializerResponse).phone;
                                case "message":
                                  return (option as TSearchMsgApiSerializerResponse).message_text;
                                default:
                                  return ""; // Fallback for unknown types
                              }
                            }
                            return typeof option === "string" ? option : "";
                          }}
                          inputValue={showLabel.searchStr}
                          onInputChange={(event, newInputValue) => {
                            // console.log("newInputValue",newInputValue)
                            setShowLabel({
                              ...showLabel,
                              searchStr: newInputValue,
                            });
                            // setDropdownValues((prev) => ({
                            //   ...prev,
                            //   search: newInputValue
                            // }));
                          }}
                          value={searchInput.inputVal}
                          onChange={(event, newValue) => {

                            //   console.log("inside",newValue,event)

                            //   // alert(newValue)
                            // setSearchInput({
                            //   inputVal:newValue})
                            if (typeof newValue === 'string') { setSearchInput({ ...searchInput, inputVal: newValue }); }

                            else if (typeof newValue === "object" && newValue.type) {
                              switch (newValue.type) {
                                case "group":
                                  // return (newValue as TSearchGroupApiSerializerResponse).name;
                                  setSearchInput({ ...searchInput, inputVal: (newValue as TSearchGroupApiSerializerResponse).name })
                                  break;

                                case "entity":
                                  // return (newValue as TSearchEntityApiSerializerResponse).phone;
                                  setSearchInput({ ...searchInput, inputVal: (newValue as TSearchEntityApiSerializerResponse).phone })
                                  break;


                                case "message":
                                  // return (newValue as TSearchMsgApiSerializerResponse).message_text;
                                  setSearchInput({ ...searchInput, inputVal: (newValue as TSearchMsgApiSerializerResponse).message_text })
                                  break;

                                default:
                                  // return ""; // Fallback for unknown types
                                  break;
                              }
                            }
                            else {
                              setSearchInput({ ...searchInput, inputVal: "" });
                              setDropdownValues({ ...dropdownValues, search: '' })
                            }
                          }}
                          className="input"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Search anything (message, group, users etc.)"
                              InputProps={{
                                ...params.InputProps,
                                type: "search",
                              }}
                            />
                          )}
                        />

                        <div className="search">
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr"
                          >
                            <g>
                              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 col-3">
                      <button id="main-search-btn" className="login_form_btn mt-0" onClick={onSearchCallDecider}>
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="search_result_sec">
            <div className="container-fluid">
              <div className="search_result_content col-md-6 col-12">
                <div className="search_result_content_inner d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="search_result_content_inner_title">
                      <h4 className=''>Search Results</h4>
                    </div>
                    <div className="search_result_content_inner_button mobile-view-button">
                      {/* <button  onClick={()=>{setcategoryWiseStatus({...categoryWiseStatus,people:true,group:false,message:false})}}>People</button> */}
                      {/* <button onClick={()=>{setcategoryWiseStatus({...categoryWiseStatus,group:true,people:false,message:false})}}>Groups</button> */}
                      {/* <button onClick={()=>{setcategoryWiseStatus({...categoryWiseStatus,message:true,people:false,group:false})}}>Messages</button> */}
                      <button
                        id="all"
                        onClick={goToFilteredList}
                        className={
                          !(
                            loaderStatus ||
                            categoryWiseStatus.people ||
                            categoryWiseStatus.group ||
                            categoryWiseStatus.message
                          )
                            ? "selected"
                            : ""
                        }
                        disabled={Object.keys(onSearchCallDeciderStatus).length == 0 ? true : false}
                      // disabled={btnStatus !== 'active'}
                      >
                        {/* {selectbtn} */}
                        All
                      </button>
                      <button id="people" onClick={goToFilteredList}
                        disabled={Object.keys(onSearchCallDeciderStatus).length == 0 ? true : false}
                      >People</button>

                      <button id="group" onClick={goToFilteredList}
                        disabled={Object.keys(onSearchCallDeciderStatus).length == 0 ? true : false}
                      >Groups</button>
                      <button id="message" onClick={goToFilteredList}
                        disabled={Object.keys(onSearchCallDeciderStatus).length == 0 ? true : false}
                      >Messages</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="search_result_inner">
          {/* FIlter HTML ADDED (27.11.24) */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="d-flex justify-content-between">
                  <div className={`${styles.advancedsearchFilterWrapper}`}>
                    <div className={styles.filterHeaerWrapper}>
                      <div className={styles.filterHeader} onClick={toggleFilter}>
                        <span>
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.12533 3.95832C6.91536 3.95832 6.714 4.04173 6.56553 4.19019C6.41707 4.33866 6.33366 4.54002 6.33366 4.74999C6.33366 4.95995 6.41707 5.16131 6.56553 5.30978C6.714 5.45825 6.91536 5.54165 7.12533 5.54165C7.33529 5.54165 7.53665 5.45825 7.68512 5.30978C7.83358 5.16131 7.91699 4.95995 7.91699 4.74999C7.91699 4.54002 7.83358 4.33866 7.68512 4.19019C7.53665 4.04173 7.33529 3.95832 7.12533 3.95832ZM4.88491 3.95832C5.04847 3.49477 5.35179 3.09337 5.75305 2.80945C6.15431 2.52552 6.63377 2.37305 7.12533 2.37305C7.61688 2.37305 8.09634 2.52552 8.4976 2.80945C8.89887 3.09337 9.20218 3.49477 9.36574 3.95832H15.042C15.252 3.95832 15.4533 4.04173 15.6018 4.19019C15.7503 4.33866 15.8337 4.54002 15.8337 4.74999C15.8337 4.95995 15.7503 5.16131 15.6018 5.30978C15.4533 5.45825 15.252 5.54165 15.042 5.54165H9.36574C9.20218 6.0052 8.89887 6.4066 8.4976 6.69053C8.09634 6.97446 7.61688 7.12693 7.12533 7.12693C6.63377 7.12693 6.15431 6.97446 5.75305 6.69053C5.35179 6.4066 5.04847 6.0052 4.88491 5.54165H3.95866C3.7487 5.54165 3.54733 5.45825 3.39887 5.30978C3.2504 5.16131 3.16699 4.95995 3.16699 4.74999C3.16699 4.54002 3.2504 4.33866 3.39887 4.19019C3.54733 4.04173 3.7487 3.95832 3.95866 3.95832H4.88491ZM11.8753 8.70832C11.6654 8.70832 11.464 8.79173 11.3155 8.94019C11.1671 9.08866 11.0837 9.29002 11.0837 9.49999C11.0837 9.70995 11.1671 9.91131 11.3155 10.0598C11.464 10.2082 11.6654 10.2917 11.8753 10.2917C12.0853 10.2917 12.2867 10.2082 12.4351 10.0598C12.5836 9.91131 12.667 9.70995 12.667 9.49999C12.667 9.29002 12.5836 9.08866 12.4351 8.94019C12.2867 8.79173 12.0853 8.70832 11.8753 8.70832ZM9.63491 8.70832C9.79847 8.24477 10.1018 7.84337 10.5031 7.55944C10.9043 7.27552 11.3838 7.12305 11.8753 7.12305C12.3669 7.12305 12.8463 7.27552 13.2476 7.55944C13.6489 7.84337 13.9522 8.24477 14.1157 8.70832H15.042C15.252 8.70832 15.4533 8.79173 15.6018 8.94019C15.7503 9.08866 15.8337 9.29002 15.8337 9.49999C15.8337 9.70995 15.7503 9.91131 15.6018 10.0598C15.4533 10.2082 15.252 10.2917 15.042 10.2917H14.1157C13.9522 10.7552 13.6489 11.1566 13.2476 11.4405C12.8463 11.7245 12.3669 11.8769 11.8753 11.8769C11.3838 11.8769 10.9043 11.7245 10.5031 11.4405C10.1018 11.1566 9.79847 10.7552 9.63491 10.2917H3.95866C3.7487 10.2917 3.54733 10.2082 3.39887 10.0598C3.2504 9.91131 3.16699 9.70995 3.16699 9.49999C3.16699 9.29002 3.2504 9.08866 3.39887 8.94019C3.54733 8.79173 3.7487 8.70832 3.95866 8.70832H9.63491ZM7.12533 13.4583C6.91536 13.4583 6.714 13.5417 6.56553 13.6902C6.41707 13.8387 6.33366 14.04 6.33366 14.25C6.33366 14.46 6.41707 14.6613 6.56553 14.8098C6.714 14.9582 6.91536 15.0417 7.12533 15.0417C7.33529 15.0417 7.53665 14.9582 7.68512 14.8098C7.83358 14.6613 7.91699 14.46 7.91699 14.25C7.91699 14.04 7.83358 13.8387 7.68512 13.6902C7.53665 13.5417 7.33529 13.4583 7.12533 13.4583ZM4.88491 13.4583C5.04847 12.9948 5.35179 12.5934 5.75305 12.3094C6.15431 12.0255 6.63377 11.873 7.12533 11.873C7.61688 11.873 8.09634 12.0255 8.4976 12.3094C8.89887 12.5934 9.20218 12.9948 9.36574 13.4583H15.042C15.252 13.4583 15.4533 13.5417 15.6018 13.6902C15.7503 13.8387 15.8337 14.04 15.8337 14.25C15.8337 14.46 15.7503 14.6613 15.6018 14.8098C15.4533 14.9582 15.252 15.0417 15.042 15.0417H9.36574C9.20218 15.5052 8.89887 15.9066 8.4976 16.1905C8.09634 16.4745 7.61688 16.6269 7.12533 16.6269C6.63377 16.6269 6.15431 16.4745 5.75305 16.1905C5.35179 15.9066 5.04847 15.5052 4.88491 15.0417H3.95866C3.7487 15.0417 3.54733 14.9582 3.39887 14.8098C3.2504 14.6613 3.16699 14.46 3.16699 14.25C3.16699 14.04 3.2504 13.8387 3.39887 13.6902C3.54733 13.5417 3.7487 13.4583 3.95866 13.4583H4.88491Z" fill="#108DE5" />
                          </svg>
                        </span>
                        <span>Advanced Filter</span>
                        <span className={`${styles.arrow} ${isFilterOpen ? styles.rotated : ""}`}>
                          <svg width={10} height={5} viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 5L5 0L10 5H0Z" fill="#1391EA" />
                          </svg>
                        </span>
                      </div>
                    </div>

                  </div>
                  <div className="Sorting-dropdown">
                    {
                      (!Object.entries(dropdownValues).filter(([key]) => key !== 'type').every(([, value]) => value === '') || !Object.entries(sortingValue).every(([, value]) => value === '')) && (
                        <div className="clear-allbtn">
                          <button onClick={clearAll}>Clear all
                            <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 16 16">
                              <path fill="none" stroke="#108DE5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5" />
                            </svg>
                          </button>
                        </div>
                      )
                    }
                    <div className="d-flex align-items-center">
                      <div className="sorting-dropdown-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" viewBox="0 0 24 24"><path fill="none" stroke="#108DE5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 10h7m-7 4h5m-5 4h3M11 6h10M7 18.813C6.607 19.255 5.56 21 5 21m-2-2.187C3.393 19.255 4.44 21 5 21m0 0v-6M3 5.188C3.393 4.745 4.44 3 5 3m2 2.188C6.607 4.745 5.56 3 5 3m0 0v6" color="#108DE5"></path></svg>
                      </div>
                      <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <StyledFormControl sx={{ m: 1, minWidth: 200 }} variant="outlined">
                          <Select
                            displayEmpty
                            value={sortingValue.orderVal}
                            onChange={handelSortingChange}
                            disabled={(!loaderStatus && !searchResultSectionLoader && Object.keys(onSearchCallDeciderStatus).length > 0) ? false : true}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <span>Advanced Sorting</span>;
                              }
                              return selected;
                            }}
                          >
                            {/* Placeholder */}
                            {/* <MenuItem value="">
                            <span>Advanced Sorting</span>
                          </MenuItem> */}

                            {/* Common Filters */}
                            {(!categoryWiseStatus.group || !categoryWiseStatus.message || !categoryWiseStatus.people) && [
                              <MenuItem key="risk-asc" value={'Risk Score ASC'}>Risk Score Asc</MenuItem>,
                              <MenuItem key="risk-desc" value={'Risk Score DESC'}>Risk Score Desc</MenuItem>,
                            ]}

                            {/* Group or People-specific Filters */}
                            {/* {(categoryWiseStatus.group || (categoryWiseStatus.people && !categoryWiseStatus.message)) && [
                          <MenuItem key="class-asc" value={'Classification ASC'}>Classification ASC</MenuItem>,
                          <MenuItem key="class-desc" value={'Classification DESC'}>Classification DESC</MenuItem>,
                        ]} */}

                            {/* Group-specific Filters */}
                            {categoryWiseStatus.group && [
                              <MenuItem key="member-asc" value={'Member Count ASC'}>Member Count Asc</MenuItem>,
                              <MenuItem key="member-desc" value={'Member Count DESC'}>Member Count Desc</MenuItem>,
                            ]}

                            {/* People-specific Filters */}
                            {categoryWiseStatus.people && [
                              <MenuItem key="country-asc" value={'Country Name ASC'}>Country Name Asc</MenuItem>,
                              <MenuItem key="country-desc" value={'Country Name DESC'}>Country Name Desc</MenuItem>,
                              <MenuItem
                                key="group-asc"
                                value={"Group Count ASC"}
                              >
                                Group Count Asc
                              </MenuItem>,
                              <MenuItem
                                key="group-desc"
                                value={"Group Count DESC"}
                              >
                                Group Count Desc
                              </MenuItem>,
                            ]}

                            {/* Message-specific Filters */}
                            {categoryWiseStatus.message && [
                              <MenuItem key="date-asc" value={'Date ASC'}>Date Asc</MenuItem>,
                              <MenuItem key="date-desc" value={'Date DESC'}>Date Desc</MenuItem>,
                            ]}
                          </Select>
                        </StyledFormControl>
                      </ThemeProvider>
                    </div>

                  </div>
                </div>
                {/* <div className="">
                </div> */}
                <div className={`${styles.advancedFilter}`}>
                  <div
                    ref={filterContentRef}
                    className={`${styles.filterContent} `}
                    style={{
                      maxHeight: 0,
                      opacity: 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.3s ease",
                    }}
                  >
                    <div className="row">
                      {
                        (filterStatus.all || filterStatus.group || filterStatus.message || filterStatus.people) &&
                        (
                          <div className={`${styles.filter} col-4 gx-2`} style={{ 'paddingLeft': '12px' }}>
                            <div className={styles.filterLabel} onClick={() => toggleDropdown("filter2")}>
                              <label>Risk Score</label>
                              <span className={`${styles.arrow} ${openDropdown === "filter2" ? styles.rotated : ""}`}>&#9662;</span>
                            </div>
                            <ul
                              ref={dropdownRefs.filter2}
                              className={styles.filterDropdown}
                              style={{ maxHeight: 0, opacity: 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease", }}>
                              <li>
                                <input
                                  type="radio"
                                  name="filterriskscore"
                                  id={`filter2Option1234`}
                                  // value={''}
                                  checked={dropdownValues.risk_score === ''}
                                  // onChange={(e) => handleFilterInputChange('risk_score', e.target.value, 'all')}
                                  onChange={(e) => handleFilterInputChange('risk_score', '')}
                                />
                                <label htmlFor={`filter2Option1234`}>{'None'}</label>
                              </li>
                              {
                                filterriskScores && filterriskScores.map((item, index) => {
                                  return (
                                    <li key={index}>
                                      <input
                                        type="radio"
                                        name="filterriskscore"
                                        id={`filter2Option${index}`}
                                        value={item?.value}
                                        checked={dropdownValues.risk_score === `${item?.value}`}
                                        // onChange={(e) => handleFilterInputChange('risk_score', e.target.value, 'all')}
                                        onChange={(e) => handleFilterInputChange('risk_score',
                                          dropdownValues.risk_score === `${item?.value}` ? '' : e.target.value)}
                                      />
                                      <label htmlFor={`filter2Option${index}`}>{item.range}</label>
                                    </li>
                                  )
                                })
                              }

                            </ul>
                          </div>
                        )

                      }
                      {
                        (filterStatus.group || filterStatus.people && !filterStatus.all && !filterStatus.message) &&
                        (
                          <div className={`${styles.filter} col-4 gx-2`}>
                            <div className={styles.filterLabel} onClick={() => toggleDropdown("filter1")}>
                              <label>Classification</label>
                              <span className={`${styles.arrow} ${openDropdown === "filter1" ? styles.rotated : ""}`}>&#9662;</span>
                            </div>
                            <ul
                              ref={dropdownRefs.filter1}
                              className={styles.filterDropdown}
                              style={{ maxHeight: 0, opacity: 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease", }}
                            >
                              <li>
                                <input
                                  type="radio"
                                  name="filtergroupclass"
                                  id={`filter1Option12345`}
                                  // value={''}
                                  checked={dropdownValues.classification === ''}
                                  // onChange={(e) => handleFilterInputChange('risk_score', e.target.value, 'all')}
                                  onChange={(e) => handleFilterInputChange('classification', '')}
                                />
                                <label htmlFor={`filter1Option12345`}>{'None'}</label>
                              </li>
                              {
                                filterStatus.group && (
                                  filterData && filterData?.group_classification.map((item, index) => {
                                    return (
                                      <li key={index}>
                                        <input
                                          type="radio"
                                          name="filtergroupclass"
                                          id={`filter1Option${index}`}
                                          value={item}
                                          checked={dropdownValues.classification === item}
                                          // onChange={(e) => handleFilterInputChange('classification', e.target.value, 'group')}
                                          onChange={(e) => {
                                            handleFilterInputChange('classification', '')
                                            handleFilterInputChange('classification', e.target.value)
                                          }}
                                        />
                                        <label htmlFor={`filter1Option${index}`}>{item}</label>
                                      </li>
                                    )
                                  })
                                )
                              }
                              {
                                filterStatus.people && (
                                  filterData && filterData?.people_classifications.map((item, index) => {
                                    return (
                                      <li key={index}>
                                        <input
                                          type="radio"
                                          name="filterpeopleclass"
                                          id={`filter11ption${index}`}
                                          value={item}
                                          checked={dropdownValues.classification === item}
                                          // onChange={(e) => handleFilterInputChange('classification', e.target.value, 'people')}
                                          onChange={(e) => {
                                            handleFilterInputChange('classification', '')
                                            handleFilterInputChange('classification', e.target.value)
                                          }}
                                        />
                                        <label htmlFor={`filter11ption${index}`}>{item}</label>
                                      </li>
                                    )
                                  })
                                )
                              }
                            </ul>
                          </div>
                        )
                      }
                      {
                        (filterStatus.group) &&
                        (
                          <div className={`${styles.filter} col-4 gx-2`} style={{ 'paddingRight': '12px' }}>
                            <div className={styles.filterLabel} onClick={() => toggleDropdown("filter3")}>
                              <label>Members</label>
                              <span className={`${styles.arrow} ${openDropdown === "filter3" ? styles.rotated : ""}`} >&#9662;</span>
                            </div>
                            <ul
                              ref={dropdownRefs.filter3}
                              className={styles.filterDropdown}
                              style={{ maxHeight: 0, opacity: 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease", }}>
                              <li>
                                <input
                                  type="radio"
                                  name="filtermembercount"
                                  id={`filter3Option123`}
                                  // value={''}
                                  checked={dropdownValues.member_count === ''}
                                  // onChange={(e) => handleFilterInputChange('risk_score', e.target.value, 'all')}
                                  onChange={(e) => handleFilterInputChange('member_count', '')}
                                />
                                <label htmlFor={`filter3Option123`}>{'None'}</label>
                              </li>
                              {
                                filtermemberCounts && filtermemberCounts.map((item, index) => {
                                  return (
                                    <li>
                                      <input
                                        type="radio"
                                        name="filtermembercount"
                                        id={`filter3Option${index}`}
                                        value={item?.value}
                                        checked={dropdownValues.member_count === `${item?.value}`}
                                        // onChange={(e) => handleFilterInputChange('member_count', e.target.value, 'group')}
                                        onChange={(e) => handleFilterInputChange('member_count', e.target.value)}
                                      />
                                      <label htmlFor={`filter3Option${index}`}>{item?.range}</label>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        )
                      }
                      {
                        (filterStatus.people) &&
                        (
                          <div className={`${styles.filter} col-4 gx-2`} style={{ 'paddingRight': '12px' }}>
                            <div className={styles.filterLabel} onClick={() => toggleDropdown("filter4")}>
                              <label>Country</label>
                              <span className={`${styles.arrow} ${openDropdown === "filter4" ? styles.rotated : ""}`} >&#9662;</span>
                            </div>
                            <ul
                              ref={dropdownRefs.filter4}
                              className={styles.filterDropdown}
                              style={{ maxHeight: 0, opacity: 0, overflow: "scroll", transition: "max-height 0.3s ease, opacity 0.3s ease", }}>
                              <li>
                                <input
                                  type="radio"
                                  name="filter1"
                                  id={`filter4Option123`}
                                  // value={''}
                                  checked={dropdownValues.country_id === ''}
                                  // onChange={(e) => handleFilterInputChange('risk_score', e.target.value, 'all')}
                                  onChange={(e) => handleFilterInputChange('country_id', '')}
                                />
                                <label htmlFor={`filter3Option123`}>{'None'}</label>
                              </li>
                              {
                                filterData && filterData?.country.map((item, index) => {
                                  return (
                                    <li key={index} className="d-flex align-items-center">
                                      <input
                                        type="radio"
                                        name={`filter1`}
                                        id={`filter4Option${index}`}
                                        value={item?.id}
                                        checked={dropdownValues.country_id === item?.id}
                                        // onChange={(e) => handleFilterInputChange('country', e.target.value, 'people')}
                                        onChange={(e) => handleFilterInputChange('country_id', e.target.value)}
                                      />
                                      <span className="inner_card_country_svg" style={{ lineHeight: '0' }}>
                                        <img src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item?.alpha2_code}.svg`} className="img-fluid"></img>
                                      </span>
                                      <label htmlFor={`filter4Option${index}`}>{item?.name}</label>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        )
                      }

                      {
                        (filterStatus.message) &&
                        (
                          <div className={`${styles.filter} col-4 gx-2`} >
                            <div className={styles.filterLabel} onClick={() => toggleDropdown("filter5")}>
                              <label>Date Range</label>
                              <span className={`${styles.arrow} ${openDropdown === "filter5" ? styles.rotated : ""}`} >&#9662;</span>
                            </div>
                            <div
                              // className="search_midsec_form"
                              ref={dropdownRefs.filter5}
                              className={`${styles.filterDropdownDate} `}
                              style={{ maxHeight: 0, opacity: 0, overflow: "visible", transition: "max-height 0.3s ease, opacity 0.3s ease", }}
                            >
                              {/* <CalenderSlider
                        getdateRange={(dateRange) => {
                          setInputValue(() => {
                            return { ...inputValue, dateRange: dateRange };
                          });
                        }}
                      /> */}
                              {
                                showDatePicker === true ?
                                  (
                                    <DateRange
                                      editableDateInputs={true}
                                      // showPreview={false}
                                      // preventSnapRefocus={false}
                                      // onChange={
                                      //   item => setdatePick([item.selection])
                                      // }
                                      // minDate={new Date()}
                                      maxDate={new Date()}
                                      onChange={(e: any) => {
                                        setdatePick([e.selection]);
                                        handleFilterInputChange('date_range', formatTimestamps(e.selection));
                                      }}
                                      // onChange={(item) => {
                                      //   setdatePick([item.selection]);
                                      //   setDropdownValues({
                                      //     ...dropdownValues,
                                      //     date_range: [item.selection],
                                      //   });
                                      // }}
                                      autoFocus={true}
                                      moveRangeOnFirstSelection={true}
                                      retainEndDateOnFirstSelection={true}
                                      ranges={datePick}
                                    />
                                  ) : ''
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="varticle_divider"></div>
            {loaderStatus && <Loading />}

            <div className="row" id="parentToBlur">
              {
                changePage == "search-result" ? (
                  <div className="col-md-6 col-lg-6 search-result-content-parent detailPageParentLoading ">
                    <div className="detailPageParentLoading-child">
                      {
                        searchResultSectionLoader &&
                        <Loading />
                      }
                    </div>
                    {(Object.keys(searchByKeyState).length > 0 &&
                      searchByKeyState?.entities?.result?.length > 0) ||
                      searchByKeyState?.groups?.result?.length > 0 ||
                      searchByKeyState?.messages?.result?.length > 0 ? (
                      // Object.keys(searchByKeyState).map((key) => {
                      //   return key == "entities" &&
                      <div>

                        <div>
                          {searchByKeyState?.entities?.result?.length > 0 && (
                            <div className="search_result_inner_people_sec search_people" >
                              {
                                Object.keys(searchByKeyState).length > 0 &&
                                searchByKeyState?.entities?.result.length >
                                0 &&
                                searchByKeyState?.entities?.result
                                  .slice(0, 3)
                                  .map((searchItem, searchItemIndex) => {
                                    return (
                                      <div
                                        className="result_item_mt"
                                        key={searchItemIndex}
                                      >
                                        <div>
                                          {searchItemIndex == 0 && (
                                            <div className="people_result_content">
                                              <p>
                                                People
                                                {/* {console.log(resultArray[1][0], "kolll")} */}
                                                <span>
                                                  (
                                                  {
                                                    searchByKeyState?.entities
                                                      ?.count
                                                  }{" "}
                                                  of{" "}
                                                  {
                                                    searchByKeyState?.entities
                                                      ?.totalCount
                                                  }{" "}
                                                  results)
                                                </span>
                                              </p>
                                            </div>
                                          )}

                                          <a
                                            href="javascript:void(0)"
                                          // onClick={goToDetailsPage}
                                          // id={`result-${searchItem.db_type}-${searchItem.id}`}
                                          >
                                            <div className="search_result_inner_people ">
                                              <div
                                                className="search_result_people_overlay"
                                                onClick={(goToDetailsPage)}
                                                id={`${searchItem.type}-${searchItem.id}`}
                                              ></div>
                                              <div className="search_result_inner_people_card">
                                                <div className="search_result_inner_people_card_left">
                                                  <div
                                                    className="search_result_inner_people_image"
                                                  // style={{
                                                  //   position: "relative",
                                                  //   width: "30px",
                                                  //   height: "30px",
                                                  // }}
                                                  >
                                                    {/* <Image src="/asset/people1.png" fill={true} className="img-fluid" alat="lol"></Image> */}
                                                    {/* <img src={require("@/assets/images/people1.png")} className="img-fluid"/> */}
                                                    {/* {console.log(searchItem.profile_img)} */}
                                                    <img
                                                      src={`${searchItem?.profile_photo_url[0] ||
                                                        "/asset/default_img/default_img.jpg"
                                                        }`}
                                                      // fill={true}
                                                      className="img-fluid"
                                                      alt="people"
                                                    ></img>
                                                  </div>
                                                  <div className="search_result_inner_people_content">
                                                    {/* <p>Jacob'm <span>Doe</span></p> */}
                                                    <p>
                                                      <Highlighter
                                                        highlightClassName="uni-active"
                                                        searchWords={[
                                                          showLabel.searchStr,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={`${searchItem.phone}`}
                                                      />

                                                      {/* {searchItem.common_name_prop} */}
                                                    </p>

                                                    <span>{searchItem.first_name ? searchItem.first_name : searchItem.phone}</span>
                                                    {
                                                      searchItem && searchItem?.alpha2_code && (
                                                        <div className="d-flex">
                                                          <img
                                                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${searchItem.alpha2_code}.svg`}
                                                            className="img-fluid"
                                                          ></img>
                                                          <span>
                                                            {searchItem?.country}
                                                          </span>
                                                        </div>
                                                      )
                                                    }

                                                  </div>
                                                </div>
                                                <div className="search_result_inner_people_card_right">
                                                  <Link
                                                    id={`${searchItem.type}-${searchItem.id}`}
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
                                                    // id={`${searchItem.db_type}-${searchItem.id}`}
                                                    >
                                                      Learn More
                                                    </span>
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                          </a>
                                        </div>
                                        {((searchByKeyState?.entities?.result
                                          .length <
                                          resultArrayUpperLimit + 1 &&
                                          searchItemIndex ==
                                          searchByKeyState?.entities?.result
                                            .length -
                                          1 && searchByKeyState?.entities?.result.length > 1) ||
                                          searchItemIndex ==
                                          resultArrayUpperLimit) && (
                                            <div className="search_result_show_more">
                                              <a
                                                className="search_result_show_more_btn"
                                                id={`list-${searchItem.type}`}
                                                onClick={goToList}
                                                href="javascript:void(0)"
                                              >
                                                Show More
                                              </a>
                                            </div>
                                          )}
                                      </div>
                                    );
                                  })
                                //  }
                              }
                            </div>
                          )}
                        </div>
                        <div className="search-group-new-wrapper">
                          {searchByKeyState?.groups?.result.length > 0 && (
                            <div className="search_result_inner_people_sec">
                              {searchByKeyState?.groups?.result
                                .slice(0, 3)
                                .map((searchItem, searchItemIndex) => {
                                  // {console.log(searchItem?.risk_score,'op')}
                                  return (
                                    <div
                                      key={searchItemIndex}
                                      className="result_item_mt"
                                    >
                                      <div>
                                        {searchItemIndex == 0 && (
                                          <div className="people_result_content">
                                            <p>
                                              Group
                                              <span>
                                                (
                                                {
                                                  searchByKeyState?.groups
                                                    ?.count
                                                }{" "}
                                                of{" "}
                                                {
                                                  searchByKeyState?.groups
                                                    ?.totalCount
                                                }{" "}
                                                results)
                                              </span>
                                            </p>
                                          </div>
                                        )}
                                        <a
                                          href="javascript:void(0)"
                                        // onClick={goToDetailsPage}
                                        // id={`result-${searchItem.db_type}-${searchItem.id}`}
                                        >
                                          <div className="search_result_inner_people dark_bg">
                                            <div
                                              className="search_result_people_overlay"
                                              onClick={goToDetailsPage}
                                              id={`${searchItem?.type}-${searchItem.id}`}
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
                                                      searchWords={[
                                                        showLabel.searchStr,
                                                      ]}
                                                      autoEscape={true}
                                                      textToHighlight={`${searchItem.name}`}
                                                    />
                                                  </p>

                                                  <span>
                                                    Members:{" "}
                                                    <span>
                                                      {searchItem?.member_count}
                                                    </span>
                                                  </span>
                                                  <div className="inner_card_group_risk">
                                                    <span>
                                                      Group Risk Score:{" "}
                                                    </span>
                                                    <div className="inner_card_group_risk_svg">
                                                      {
                                                        (searchItem && searchItem?.risk_score) ? (
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
                                                <Link
                                                  id={`${searchItem?.type}-${searchItem?.id}`}
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
                                                    id={`${searchItem?.type}-${searchItem?.id}`}
                                                  >
                                                    Learn More
                                                  </span>
                                                </Link>
                                                {/* </Link> */}
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      {((searchByKeyState?.groups?.result
                                        .length <
                                        resultArrayUpperLimit + 1 &&
                                        searchItemIndex ==
                                        searchByKeyState?.groups?.result
                                          .length -
                                        1 && searchByKeyState?.groups?.result.length > 1) ||
                                        searchItemIndex ==
                                        resultArrayUpperLimit) && (
                                          <div className="search_result_show_more">
                                            <a
                                              className="search_result_show_more_btn"
                                              id={`list-${searchItem?.type}`}
                                              onClick={goToList}
                                              // href="search_result_show_more_btn"
                                              href="javascript:void(0)"
                                            >
                                              Show More
                                            </a>
                                          </div>
                                        )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                        <div>
                          {searchByKeyState?.messages?.result.length > 0 && (
                            <div className="search_result_inner_people_sec search_people">
                              {searchByKeyState?.messages?.result
                                .slice(0, 3)
                                .map((searchItem, searchItemIndex) => {
                                  return (
                                    <div
                                      key={searchItemIndex}
                                      className="result_item_mt"
                                    >
                                      <div className="">
                                        {searchItemIndex == 0 && (
                                          <div className="people_result_content">
                                            <p>
                                              Messages
                                              <span>
                                                (
                                                {
                                                  searchByKeyState?.messages
                                                    ?.count
                                                }{" "}
                                                of{" "}
                                                {
                                                  searchByKeyState?.messages
                                                    ?.totalCount
                                                }{" "}
                                                results)
                                              </span>
                                            </p>
                                          </div>
                                        )}
                                        <a
                                          href="javascript:void(0)"
                                        // onClick={goToDetailsPage}
                                        // id={`result-${searchItem.db_type}-${searchItem.id}`}
                                        >
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
                                                    <Highlighter
                                                      highlightClassName="uni-active"
                                                      searchWords={[
                                                        showLabel.searchStr,
                                                      ]}
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
                                                    Group:{" "}
                                                    <span>
                                                      {" "}
                                                      {
                                                        searchItem?.group_name
                                                      }{" "}
                                                    </span>
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="search_result_inner_people_card_right">
                                                <Link
                                                  id={`${searchItem?.type}-${searchItem?.id}`}
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
                                                  <span>Learn More</span>
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        </a>
                                        {/* id={`${searchItem.db_type}-${searchItem.id}`} */}
                                      </div>

                                      {((searchByKeyState?.messages?.result
                                        .length <
                                        resultArrayUpperLimit + 1 &&
                                        searchItemIndex ==
                                        searchByKeyState?.messages?.result
                                          .length -
                                        1 && searchByKeyState?.messages?.result.length > 1) ||
                                        searchItemIndex ==
                                        resultArrayUpperLimit) && (
                                          <div className="search_result_show_more">
                                            <a
                                              className="search_result_show_more_btn"
                                              id={`list-${searchItem?.type}`}
                                              onClick={goToList}
                                              href="javascript:void(0)"
                                            >
                                              Show More
                                            </a>
                                          </div>
                                        )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="no_data_text">
                        <p>No result Found</p>
                      </div>
                    )}
                  </div>
                ) :
                  <div className="col-md-6 detailPageParentLoading  col-lg-6 search-result-content-parent">

                    <div className="detailPageParentLoading-child">
                      {
                        searchResultSectionLoader &&
                        <Loading />
                      }
                    </div>
                    {
                      // (Object.keys().length > 0 &&
                      // +(listDetailInfo?.entities?.count) > 0 ||
                      // +(listDetailInfo?.groups?.count) > 0 ||
                      // +(listDetailInfo?.messages?.count) >0)  ?
                      <ListOfDetail
                        //  listDetail={listDetail}
                        listDetailInfo={listDetailInfo}
                        listDetail={listDetail}
                        setListDetail={setListDetail}

                        restrictUseEffectFromInitialRendering={restrictUseEffectFromInitialRendering}
                        changePage={changePage}
                        goToDetailsPage={goToDetailsPage}
                        searchStr={showLabel.searchStr}
                        inputVal={searchInput.inputVal}
                        postSearchByKeyApiRequest={postSearchByKeyApiRequest}
                        setSearchResultSectionLoader={setSearchResultSectionLoader}
                        filterPayload={dropdownValues}
                        sortingValue={sortingValue}
                        page={page}
                        setPage={setPage}
                      // setSortingValue ={setSortingValue}

                      //  flagImgBasePath={flagImgBasePath}

                      />
                      //    :
                      //    <div className="no_data_text">
                      //    <p>No Result Found</p>
                      //  </div>
                    }


                  </div>
              }


              <hr className="bg-divider-mobile" />

              <div id="mobile_sec_target" className="col-md-6 col-lg-6 detailPageParentLoading">
                <div className="detailPageParentLoading-child">
                  {
                    detailSectionLoader &&
                    <Loading />
                  }
                </div>
                {/* <div className="search_result_inner_right_sec">
                  <div className="search_result_inner_right_title">
                    <div className="search_result_inner_right_prev_next">
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M6.21974 9.53024C6.07913 9.38959 6.00015 9.19886 6.00015 8.99999C6.00015 8.80111 6.07913 8.61038 6.21974 8.46974L10.4625 4.22699C10.5317 4.15535 10.6144 4.09822 10.7059 4.05891C10.7974 4.0196 10.8959 3.99891 10.9954 3.99805C11.095 3.99718 11.1938 4.01616 11.286 4.05387C11.3781 4.09158 11.4619 4.14727 11.5323 4.21769C11.6027 4.28811 11.6584 4.37185 11.6961 4.46402C11.7338 4.55619 11.7528 4.65495 11.7519 4.75454C11.7511 4.85412 11.7304 4.95254 11.6911 5.04404C11.6518 5.13554 11.5946 5.2183 11.523 5.28749L7.81049 8.99999L11.523 12.7125C11.6596 12.8539 11.7352 13.0434 11.7335 13.24C11.7318 13.4367 11.6529 13.6248 11.5139 13.7639C11.3748 13.9029 11.1867 13.9818 10.99 13.9835C10.7934 13.9852 10.6039 13.9096 10.4625 13.773L6.21974 9.53024Z"
                            fill="#8E9DAD"
                          />
                        </svg>
                        <span>Previous</span>
                      </button>
                      <button>
                        <span>Next</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1832_222)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11.7803 8.46976C11.9209 8.61041 11.9999 8.80114 11.9999 9.00001C11.9999 9.19889 11.9209 9.38962 11.7803 9.53026L7.53751 13.773C7.46833 13.8446 7.38557 13.9018 7.29407 13.9411C7.20256 13.9804 7.10415 14.0011 7.00456 14.002C6.90498 14.0028 6.80622 13.9838 6.71405 13.9461C6.62188 13.9084 6.53814 13.8527 6.46772 13.7823C6.3973 13.7119 6.34161 13.6282 6.3039 13.536C6.26619 13.4438 6.24721 13.345 6.24808 13.2455C6.24894 13.1459 6.26963 13.0475 6.30894 12.956C6.34824 12.8645 6.40538 12.7817 6.47701 12.7125L10.1895 9.00001L6.47701 5.28751C6.34039 5.14606 6.2648 4.95661 6.26651 4.75996C6.26822 4.56331 6.34709 4.37521 6.48615 4.23615C6.6252 4.09709 6.81331 4.01822 7.00996 4.01651C7.20661 4.0148 7.39606 4.09039 7.53751 4.22701L11.7803 8.46976Z"
                              fill="#8E9DAD"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1832_222">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </div>
                    <div className="search_result_inner_right_icons">
                      <a href="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1834_230)">
                            <path
                              d="M2.33325 2.91663C2.33325 2.4525 2.51763 2.00738 2.84582 1.67919C3.174 1.351 3.61912 1.16663 4.08325 1.16663H9.91659C10.3807 1.16663 10.8258 1.351 11.154 1.67919C11.4822 2.00738 11.6666 2.4525 11.6666 2.91663V12.2663C11.6666 12.978 10.8616 13.3921 10.2829 12.9785L6.99992 10.6335L3.71692 12.9785C3.13767 13.3927 2.33325 12.9785 2.33325 12.2669V2.91663Z"
                              fill="#108DE5"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1834_230">
                              <rect width="14" height="14" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                      <a href="" className="mx-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_1834_234)">
                            <path
                              d="M7.00005 0.972168C3.57005 0.972168 0.777832 3.41439 0.777832 6.41661C0.777832 9.41883 3.57005 11.8611 7.00005 11.8611C7.64178 11.8603 8.28035 11.7713 8.89783 11.5966L11.0484 12.9655C11.1071 13.0032 11.1749 13.0244 11.2446 13.0268C11.3143 13.0293 11.3834 13.013 11.4446 12.9796C11.5058 12.9462 11.557 12.8969 11.5926 12.837C11.6283 12.777 11.6472 12.7086 11.6473 12.6388V10.0216C12.1339 9.55482 12.5222 8.9954 12.7893 8.37629C13.0565 7.75718 13.1971 7.09088 13.2028 6.41661C13.2223 3.41439 10.4301 0.972168 7.00005 0.972168ZM6.58394 3.5505C6.57756 3.47487 6.58694 3.39874 6.6115 3.32693C6.63606 3.25512 6.67526 3.18918 6.72662 3.1333C6.77798 3.07743 6.84038 3.03282 6.90987 3.0023C6.97936 2.97179 7.05443 2.95603 7.13033 2.95603C7.20623 2.95603 7.2813 2.97179 7.35079 3.0023C7.42028 3.03282 7.48269 3.07743 7.53404 3.1333C7.5854 3.18918 7.6246 3.25512 7.64916 3.32693C7.67372 3.39874 7.68311 3.47487 7.67672 3.5505V7.34995C7.68311 7.42557 7.67372 7.5017 7.64916 7.57352C7.6246 7.64533 7.5854 7.71126 7.53404 7.76714C7.48269 7.82302 7.42028 7.86763 7.35079 7.89815C7.2813 7.92866 7.20623 7.94442 7.13033 7.94442C7.05443 7.94442 6.97936 7.92866 6.90987 7.89815C6.84038 7.86763 6.77798 7.82302 6.72662 7.76714C6.67526 7.71126 6.63606 7.64533 6.6115 7.57352C6.58694 7.5017 6.57756 7.42557 6.58394 7.34995V3.5505ZM7.13228 10.2977C6.98845 10.2977 6.84784 10.2551 6.72825 10.1752C6.60866 10.0953 6.51545 9.98168 6.46041 9.8488C6.40537 9.71591 6.39097 9.5697 6.41903 9.42863C6.44709 9.28756 6.51635 9.15798 6.61805 9.05628C6.71976 8.95457 6.84934 8.88531 6.9904 8.85725C7.13147 8.82919 7.27769 8.84359 7.41057 8.89864C7.54345 8.95368 7.65703 9.04689 7.73694 9.16648C7.81685 9.28607 7.8595 9.42667 7.8595 9.5705C7.85847 9.7627 7.7814 9.94667 7.64513 10.0822C7.50886 10.2178 7.32448 10.2938 7.13228 10.2938V10.2977Z"
                              fill="#108DE5"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1834_234">
                              <rect width="14" height="14" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                      <a href="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M14 8.00004L9.33333 3.33337V6.00004C4.66667 6.66671 2.66667 10 2 13.3334C3.66667 11 6 9.93337 9.33333 9.93337V12.6667L14 8.00004Z"
                            fill="#108DE5"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div> */}

                <div className="detailPageParentLoading-child">
                  {
                    detailSectionLoader &&
                    <Loading />
                  }
                </div>

                {
                  Object.keys(detailInformationObject).length > 0 ?
                    detailInformationObject?.type === "entity" ? (
                      <PersonDetailView
                        entityDetails={detailInformationObject}
                        search_str={showLabel.searchStr}
                        postSearchByKeyApiRequest={postSearchByKeyApiRequest}
                        entityMessages={detailPageMessage}
                        setEntityMessages={setDetailPageMessage}
                        entityMedias={detailPageMedia}
                        setEntityMedias={setDetailPageMedia}
                        openLightBox={openLightbox}
                        goToDetailsPage={goToDetailsPage}
                        detailSectionTabLoader={detailSectionTabLoader}
                        setDetailSectionTabLoader={setDetailSectionTabLoader}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        handleTabClick={handleTabClick}
                        showMoreMediaOffsetCount={showMoreMediaOffsetCount}
                        showMoreMessageOffsetCount={showMoreMessageOffsetCount}
                        setShowMoreMessageOffsetCount={setShowMoreMessageOffsetCount}
                        setShowMoreMediaOffsetCount={setShowMoreMediaOffsetCount}



                      />
                    ) : detailInformationObject?.type === "group" ?
                      <GroupDetailView
                        groupDetails={detailInformationObject}
                        search_str={showLabel.searchStr}
                        postSearchByKeyApiRequest={postSearchByKeyApiRequest}
                        groupMessages={detailPageMessage}
                        setGroupMessages={setDetailPageMessage}
                        groupMedias={detailPageMedia}
                        setGroupMedias={setDetailPageMedia}
                        openLightBox={openLightbox}
                        goToDetailsPage={goToDetailsPage}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        handleTabClick={handleTabClick}
                        detailSectionTabLoader={detailSectionTabLoader}
                        setDetailSectionTabLoader={setDetailSectionTabLoader}
                        showMoreMediaOffsetCount={showMoreMediaOffsetCount}
                        showMoreMessageOffsetCount={showMoreMessageOffsetCount}
                        showMoreMemberOffsetCount={showMoreMemberOffsetCount}
                        setShowMoreMessageOffsetCount={setShowMoreMessageOffsetCount}
                        setShowMoreMediaOffsetCount={setShowMoreMediaOffsetCount}
                        setShowMoreMemberOffsetCount={setShowMoreMemberOffsetCount}
                        groupMembers={detailPageMembers}
                        setGroupMembers={setDetailPageMembers}
                        deletedData={deletedData}
                        dashboardmsgId={dashboardmsgId}
                        setdashboardmsgId={setdashboardmsgId}
                      />


                      : <MessageDetailView
                        messageDetails={detailInformationObject}
                        search_str={showLabel.searchStr}
                        postSearchByKeyApiRequest={postSearchByKeyApiRequest}
                        goToDetailsPage={goToDetailsPage}
                        deletedData={deletedData}

                      />
                    :

                    <div className="no_data_text">
                      <p>No data selected</p>
                    </div>

                }








              </div>
            </div>
          </div>
        </section >

        <div id="overlay-lightbox" className="overlay_of_join">
          <LightBOxForMedia mediaArr={detailPageMedia} mediaIdForLightbox={mediaIdForLightbox} />
        </div>
      </div >
    </>
  );
});

export default SearchLeaf;
