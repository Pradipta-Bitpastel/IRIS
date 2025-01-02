'use client'
import React, { memo, useEffect, useRef, useState } from 'react'
import AlertForm from './AlertForm'
import { SelectedValues } from '../types/type';
import styles from '../_assets/ToggleSwitch.module.css'
import { authHeader, filtermemberCounts, filterriskScores, toastSettingData } from '@/constants';
import { TApiResponse } from '@/types/type';
import { useCallApi } from '@/app/api/CallApi';
import Loading from '@/app/loading';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { decryptPassword } from '@/app/auth/_login/helpers';
import { interpretPercentage } from '../helpers';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import { toast, ToastOptions } from 'react-toastify';
const alertSettingLeaf = memo(() => {
  const initialValues: SelectedValues = {
    id: "",
    alertName: "",
    country: "",
    countryID: "",
    classification: "",
    riskScore: "",
    memberCount: "",
    date_range_from: '',
    date_range_to: '',
    // toDate: '',
    status: '1',
    user_id: '',
  };
  const [filterData, setFilterData] = useState({
    country: [],
    group_classification: [],
    people_classifications: [],
    // people: false
  })
  const [fromDate, setFromDate] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [toDate, setToDate] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const pathname = usePathname();
  const [selectedValues, setSelectedValues] = useState<SelectedValues>(initialValues);
  const [selectvalueArr, setSelectvalueArray] = useState<any[]>([])
  const [editBtnstatus, setEditBtnStatus] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const fromPickerRef = useRef<HTMLDivElement>(null);
  const toPickerRef = useRef<HTMLDivElement>(null);
  // const Swal = require('sweetalert2');
  // const [isToggleOn, setIsToggleOn] = useState(false);

  const dropdownOptions = {
    country: filterData?.country,
    classification: filterData?.people_classifications,
    riskScore: filterriskScores,
    memberCount: filtermemberCounts,
  };
  const getlLocalStorageData = () => {
    const storedData = window.localStorage.getItem("sessionCheck");
    let decryptUserID = decryptPassword(JSON.parse(storedData).userID);
    // console.log(storedData, 'storedData');

    if (storedData) {
      setSelectedValues((prevState: SelectedValues) => ({
        ...prevState,
        user_id: decryptUserID
      }));
    }
  }
  // function convertToDate(dateString) {
  //   // Debug: Check the input value
  //   console.log("Input dateString:", dateString);

  //   // Check for null, undefined, or empty string
  //   if (dateString != 'null' || dateString === undefined) {
  //     // Split the input string into year, month, and day
  //     const [year, month, day] = dateString && dateString.split('-').map(Number);

  //     // Create and return the Date object
  //     const date = new Date(year, month - 1, day);

  //     // Debug: Check the created date object
  //     // console.log("Generated Date object:", date);
  //     return date;
  //   }

  // }
  const convertToDate = (dateString: string | null | undefined): Date | null | boolean => {
    if (dateString && dateString != 'null') {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    console.error('Invalid date string:', dateString);
    return false;
  };
  const formatTimestamps = (selection: any, type?: 'from' | 'to') => {
    // console.log(select/ion, 'selection');
    if (selection !== null || selection !== undefined || selection !== '') {
      if (type === 'from') {
        return `${format(selection.startDate, 'yyyy-MM-dd')}`
      } else {
        return `${format(selection.endDate, 'yyyy-MM-dd')}`
      }
    }

    // return `${format(selection.startDate, 'yyyy-MM-dd')} - ${format(selection.endDate, 'yyyy-MM-dd')}`;
  };
  const handleDateChange = (ranges: any, type: 'from' | 'to') => {
    // console.log(ranges.selection, 'ranges');
    if (type === 'from') {
      setFromDate([ranges.selection]);
      if (fromInputRef.current) {
        fromInputRef.current.value = formatTimestamps(ranges.selection, 'from');
        toInputRef.current.value = formatTimestamps(ranges.selection, 'to');
        setToDate([ranges.selection])
        setSelectedValues((prevState: any) => ({
          ...prevState,
          'date_range_from': formatTimestamps(ranges.selection, 'from'),
          'date_range_to': formatTimestamps(ranges.selection, 'to')
        }))
      }
    } else {
      setToDate([ranges.selection]);
      if (toInputRef.current) {
        toInputRef.current.value = formatTimestamps(ranges.selection, 'to');
        fromInputRef.current.value = formatTimestamps(ranges.selection, 'from');
        // (fromPickerRef.current as HTMLInputElement).value = ranges.selection || null
        setFromDate([ranges.selection])
        setSelectedValues((prevState: any) => ({
          ...prevState,
          'date_range_from': formatTimestamps(ranges.selection, 'from'),
          'date_range_to': formatTimestamps(ranges.selection, 'to')
        }))
      }
    }
  };
  const sanatisedPayload = (obj: SelectedValues) => {
    return Object.fromEntries(Object.entries(obj).filter(([index, value]) => value !== ""))
  };
  const alertSettingCallApi = async (url: string, httpMethod: any, data?: any) => {
    try {
      if (httpMethod === 'post') {
        setLoaderStatus(true);
        let response: TApiResponse = await useCallApi({
          headersInfo: {
            ...authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          endpoint: `api/${url}`,
          httpMethod: httpMethod,
          data: data
        });
        setLoaderStatus(false);
        return response;
      } else {
        setLoaderStatus(true);
        let response: TApiResponse = await useCallApi({
          headersInfo: {
            ...authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          endpoint: `api/${url}`,
          httpMethod: httpMethod,
        });
        setLoaderStatus(false);
        return response;
      }

    } catch (err) {
      setLoaderStatus(true);
      // console.log(err);
    }
  }
  const allAlertApi = async () => {
    try {
      const userID = await localStorage.getItem("sessionCheck");
      let decryptUerID = await decryptPassword(JSON.parse(userID).userID);
      const formData = new FormData();
      formData.append('user_id', decryptUerID);
      let response = await alertSettingCallApi('user-alerts/list', 'post', formData)
      // console.log("response", response);
      setSelectvalueArray(response?.data?.alerts);
    } catch (err) {

    }
  }

  const handelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // Access 'data-id' from currentTarget, which refers to the button element
    const alertMsgId = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
    if (selectvalueArr.length > 0) {

      const selectedItem = selectvalueArr.find(item => item.id === alertMsgId);
      // console.log("selectedItem", selectedItem);
      setSelectedValues((prevState: SelectedValues) => ({
        ...prevState,
        id: alertMsgId,
        user_id: selectedItem?.user_id != null ? selectedItem?.user_id : '',
        countryID: selectedItem?.country?.id != null ? selectedItem?.country?.id : '',
        country: selectedItem?.country?.id != null ? JSON.stringify({ id: selectedItem?.country?.id, name: selectedItem?.country?.name }) : '',
        memberCount: selectedItem?.member_count != null ? selectedItem?.member_count : '',
        classification: selectedItem?.classification != null ? selectedItem?.classification : '',
        riskScore: selectedItem?.risk_score != null ? selectedItem?.risk_score : '',
        alertName: selectedItem?.name != null ? selectedItem?.name : '',
        date_range_from: selectedItem?.date_range_from != null ? selectedItem?.date_range_from : '',
        date_range_to: selectedItem?.date_range_to != null ? selectedItem?.date_range_to : '',
        status: selectedItem?.status
      }));
      let startsDate = selectedItem?.date_range_from != null ? convertToDate(selectedItem?.date_range_from) : ''
      let endsDate = selectedItem?.date_range_to != null ? convertToDate(selectedItem?.date_range_to) : ''

      setFromDate([
        {
          startDate: startsDate ? startsDate : new Date(),
          endDate: endsDate ? endsDate : new Date(),
          key: 'selection',
        }
      ]);
      setToDate([
        {
          startDate: startsDate ? startsDate : new Date(),
          endDate: endsDate ? endsDate : new Date(),
          key: 'selection',
        }
      ]);
      fromInputRef.current.value = startsDate ? formatTimestamps({ startDate: startsDate, endDate: endsDate }, 'from') : '';
      toInputRef.current.value = startsDate ? formatTimestamps({ startDate: startsDate, endDate: endsDate }, 'to') : '';
      setEditBtnStatus(true);
      // if (selectedItem) {
      //   setSelectedValues(selectedItem);
      //   setEditBtnStatus(true);
      // }
    }
  }
  const handelDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const deleteMsgId = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
    // console.log(deleteMsgId, 'deleteMsgId');

    if (!deleteMsgId) return;

    // Retrieve user ID from sessionStorage
    // const userId = JSON.parse(sessionStorage.getItem("userId")).userID;
    const storedData = window.localStorage.getItem("sessionCheck");
    let decryptUserID = decryptPassword(JSON.parse(storedData).userID);


    if (!decryptUserID) {
      console.error("User ID is not available in session storage.");
      Swal.fire("Error!", "User ID is missing. Please log in again.", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#108DE5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const formData = new FormData();
          formData.append("id", deleteMsgId);
          formData.append("user_id", decryptUserID); // Include user_id in the request

          // console.log("Form Data:", Object.fromEntries(formData)); // Debug form data

          let response: TApiResponse = await alertSettingCallApi(
            'user-alerts/delete',
            'post',
            formData
          );

          // console.log("API Response:", response); // Debug API response

          if (response.status == "200") { // Compare as a number
            const updatedArray = selectvalueArr.filter(item => item.id !== deleteMsgId);
            setSelectvalueArray(updatedArray);
            setSelectedValues(initialValues);
            await allAlertApi();
            // Swal.fire("Deleted!", "Your alert has been deleted.", "success");
            toast.success(`Your alert deleted successfully.`, toastSettingData as ToastOptions<unknown>);
          } else {
            console.error("Unexpected Response Status:", response.status);
            // Swal.fire("Error!", response.message || "Failed to delete alert.", "error");
            toast.success(`Alert deleted successfully.`, toastSettingData as ToastOptions<unknown>);
          }
        } catch (err) {
          console.error("Error deleting alert:", err);
          Swal.fire("Error!", err.message || "Something went wrong. Please try again.", "error");
        }
      }
    });
  };

  const handleToggleStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const toggleMsgId = e.target.getAttribute("data-id");
      if (!toggleMsgId) {
        console.error("Toggle message ID is missing.");
        alert("Error: Toggle message ID is missing.");
        return;
      }

      const userId = (() => {
        try {
          const storedData = window.localStorage.getItem("sessionCheck");
          let decryptUserID = decryptPassword(JSON.parse(storedData).userID);
          // const storedData = sessionStorage.getItem("userId");
          return storedData ? decryptUserID : null;
        } catch (error) {
          console.error("Error parsing user ID from sessionStorage:", error);
          return null;
        }
      })();

      if (!userId) {
        console.error("User ID is not available in session storage.");
        // alert("Error: User ID is missing. Please log in again.");
        return;
      }

      // Confirm toggle action (uncomment if needed)
      // const isConfirmed = window.confirm("Do you want to toggle the status of this alert?");
      // if (!isConfirmed) return;

      const formData = new FormData();
      formData.append("id", toggleMsgId);
      formData.append("user_id", userId);
      formData.append("status", e.target.checked ? "1" : "0");

      // console.log("Form Data:", Object.fromEntries(formData)); // Debugging purpose

      const response = await alertSettingCallApi(
        "user-alerts/change-status",
        "post",
        formData
      );

      if (response.status == "200") {
        setSelectvalueArray((prev) =>
          prev.map((item) =>
            item.id === toggleMsgId
              ? { ...item, status: e.target.checked ? "1" : "0" }
              : item
          )
        );
        console.log("Success: The alert status has been toggled.");
        allAlertApi();
      } else {
        console.error("Unexpected Response Status:", response);
        alert(response.message || "Failed to toggle alert status.");
      }
    } catch (err) {
      console.error("Error toggling alert status:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      alert(errorMessage);
    }
  };


  const searchFilterDropdownApi = async () => {
    try {
      let response = await alertSettingCallApi('search-filterlist', 'get')
      if (response?.status == '200') {
        // console.log("response", response);
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
  const expandlist = (e: React.MouseEvent<HTMLDivElement>) => {
    const alertMsgId = (e.currentTarget as HTMLDivElement).getAttribute('data-id');
    if (alertMsgId === activeId) {
      setActiveId(null); // Remove active class if the same div is clicked
    } else {
      setActiveId(alertMsgId);
    }
  };
  // const handleClickOutside = (e: MouseEvent) => {
  //   if (!(e.target as HTMLElement).closest('.custom-alert-name-content')) {
  //     setActiveId(null); // Remove active class if clicked outside
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);
  // useEffect(() => {
  //   if (selectvalueArr.length > 0 && !activeId) {
  //     setActiveId(selectvalueArr[0].id);
  //   }
  // }, [selectvalueArr]);
  useEffect(() => {
    searchFilterDropdownApi()
    allAlertApi()
    // getlLocalStorageData();
  }, []);
  // console.log(selectvalueArr[0], 'dhakgdaw');

  return (
    <>
      {
        (loaderStatus) && <Loading />
      }
      <div className="dashboard_main">
        <div className="container-fluid">
          <div className="alert-setting-page-wrapper">
            <div className="alert-setting-form-wrapper">
              <AlertForm
                selectStoreValue={selectvalueArr}
                setSelectStoreValue={setSelectvalueArray}
                selectedValues={selectedValues}
                setSelectedValues={setSelectedValues}
                dropdownOptions={dropdownOptions}
                initialValues={initialValues}
                getlLocalStorageData={getlLocalStorageData}
                setEditBtnStatus={setEditBtnStatus}
                editBtnstatus={editBtnstatus}
                filterData={filterData}
                alertSettingCallApi={alertSettingCallApi}
                sanatisedPayload={sanatisedPayload}
                allAlertApi={allAlertApi}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                handleDateChange={handleDateChange}
                fromInputRef={fromInputRef}
                toInputRef={toInputRef}
                fromPickerRef={fromPickerRef}
                toPickerRef={toPickerRef}
              />
            </div>


            <div className="custom-alert-setting-wrapper">
              <div className="custom-alert-header-wrapper">
                <div className="custom-alert-title">
                  <h4>Custom Alerts</h4>
                </div>
              </div>

              {
                selectvalueArr && selectvalueArr.length > 0 ? (
                  <div className="custom-alert-body">
                    {
                      selectvalueArr && selectvalueArr.map((item: any, index) => {
                        return (
                          <div
                            className={`custom-alert-name-content ${activeId === item.id ? 'active' : ''}`}
                            key={index} onClick={expandlist}
                            data-id={item?.id}
                          >
                            <div className="row">
                              <div className="col-lg-4 col-md-12">
                                <div className="custom-alert-content">
                                  <h6>
                                    {item && item?.name.length > 45 && activeId !== item.id ? item?.name.slice(0, 45) + '...' : item?.name}
                                  </h6>
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-12 align-self-center">
                                <div className="custom-alert-flex-category">
                                  {
                                    item?.classification && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.75 3.25C7.75 2.65666 7.92595 2.07664 8.25559 1.58329C8.58524 1.08994 9.05377 0.705426 9.60195 0.478363C10.1501 0.2513 10.7533 0.19189 11.3353 0.307646C11.9172 0.423401 12.4518 0.709123 12.8713 1.12868C13.2909 1.54824 13.5766 2.08279 13.6924 2.66473C13.8081 3.24667 13.7487 3.84987 13.5216 4.39805C13.2946 4.94623 12.9101 5.41477 12.4167 5.74441C11.9234 6.07405 11.3433 6.25 10.75 6.25H8.5C8.30109 6.25 8.11032 6.17098 7.96967 6.03033C7.82902 5.88968 7.75 5.69891 7.75 5.5V3.25ZM0.25 3.25C0.25 2.45435 0.56607 1.69129 1.12868 1.12868C1.69129 0.566072 2.45435 0.250001 3.25 0.250001C4.04565 0.250001 4.80871 0.566072 5.37132 1.12868C5.93393 1.69129 6.25 2.45435 6.25 3.25V5.5C6.25 5.69891 6.17098 5.88968 6.03033 6.03033C5.88968 6.17098 5.69891 6.25 5.5 6.25H3.25C2.45435 6.25 1.69129 5.93393 1.12868 5.37132C0.56607 4.80871 0.25 4.04565 0.25 3.25ZM0.25 10.75C0.25 9.95435 0.56607 9.19129 1.12868 8.62868C1.69129 8.06607 2.45435 7.75 3.25 7.75H5.5C5.69891 7.75 5.88968 7.82902 6.03033 7.96967C6.17098 8.11032 6.25 8.30109 6.25 8.5V10.75C6.25 11.5457 5.93393 12.3087 5.37132 12.8713C4.80871 13.4339 4.04565 13.75 3.25 13.75C2.45435 13.75 1.69129 13.4339 1.12868 12.8713C0.56607 12.3087 0.25 11.5457 0.25 10.75ZM7.75 8.5C7.75 8.30109 7.82902 8.11032 7.96967 7.96967C8.11032 7.82902 8.30109 7.75 8.5 7.75H10.75C11.3433 7.75 11.9234 7.92595 12.4167 8.25559C12.9101 8.58524 13.2946 9.05377 13.5216 9.60195C13.7487 10.1501 13.8081 10.7533 13.6924 11.3353C13.5766 11.9172 13.2909 12.4518 12.8713 12.8713C12.4518 13.2909 11.9172 13.5766 11.3353 13.6924C10.7533 13.8081 10.1501 13.7487 9.60195 13.5216C9.05377 13.2946 8.58524 12.9101 8.25559 12.4167C7.92595 11.9234 7.75 11.3433 7.75 10.75V8.5Z" fill="#1391EA" /></svg>
                                          <span>Classification</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.country && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.50071 0.416748C3.37625 0.416748 0.834042 2.95896 0.834042 6.07987C0.8135 10.6451 6.28538 14.4304 6.50071 14.5834C6.50071 14.5834 12.1879 10.6451 12.1674 6.08342C12.1674 2.95896 9.62517 0.416748 6.50071 0.416748ZM6.50071 8.91675C4.93529 8.91675 3.66738 7.64883 3.66738 6.08342C3.66738 4.518 4.93529 3.25008 6.50071 3.25008C8.06612 3.25008 9.33404 4.518 9.33404 6.08342C9.33404 7.64883 8.06612 8.91675 6.50071 8.91675Z" fill="#1391EA" /></svg>
                                          <span>Country</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.risk_score && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41151 0.655306C6.76826 0.613263 7.12772 0.707502 7.41795 0.919161C7.70818 1.13082 7.90777 1.44428 7.97676 1.79681L7.99551 1.92206L7.99926 2.00006V7.25006C7.99929 7.43376 8.06673 7.61106 8.1888 7.74833C8.31087 7.88561 8.47907 7.97331 8.66151 7.99481L8.74926 8.00006H13.8493C14.2471 8.00006 14.6286 8.15809 14.9099 8.4394C15.1912 8.7207 15.3493 9.10223 15.3493 9.50006C15.3492 9.55711 15.3427 9.61398 15.3298 9.66956C15.0296 10.9646 14.3907 12.1565 13.4784 13.1234C12.5661 14.0902 11.4132 14.7972 10.1378 15.172C8.86236 15.5467 7.51027 15.5757 6.21995 15.2561C4.92963 14.9364 3.74746 14.2796 2.79449 13.3528C1.84152 12.426 1.152 11.2625 0.79654 9.98163C0.441082 8.70071 0.432459 7.34833 0.771554 6.06299C1.11065 4.77764 1.78528 3.60552 2.72635 2.66664C3.66742 1.72777 4.84113 1.05589 6.12726 0.719806L6.32976 0.669556L6.41151 0.655306Z" fill="#1391EA" /><path d="M9.5 1.62506V5.75006C9.5 5.94897 9.57902 6.13973 9.71967 6.28039C9.86032 6.42104 10.0511 6.50006 10.25 6.50006H14.375C14.4949 6.50002 14.613 6.47125 14.7195 6.41616C14.8259 6.36107 14.9176 6.28126 14.9869 6.18342C15.0562 6.08557 15.101 5.97256 15.1176 5.85383C15.1342 5.73511 15.1221 5.61413 15.0823 5.50106C14.7098 4.44306 14.1047 3.48208 13.3116 2.68888C12.5186 1.89569 11.5577 1.29047 10.4998 0.917805C10.3866 0.877856 10.2656 0.865626 10.1467 0.882141C10.0279 0.898657 9.9148 0.943436 9.81686 1.01272C9.71892 1.082 9.63903 1.17377 9.5839 1.28032C9.52876 1.38687 9.49999 1.50509 9.5 1.62506Z" fill="#1391EA" /></svg>
                                          <span>Risk Score</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.member_count && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.42147 10.6875C9.44676 10.9935 9.38651 11.3004 9.24745 11.5741C9.10839 11.8478 8.89599 12.0775 8.63397 12.2375C8.37272 12.3981 8.07147 12.4825 7.76522 12.4813H1.90709C1.60044 12.4826 1.29952 12.3982 1.03834 12.2375C0.775724 12.0785 0.563101 11.8488 0.42474 11.5748C0.286379 11.3007 0.227854 10.9932 0.255844 10.6875C0.278518 10.3824 0.386837 10.09 0.568344 9.84375C1.06666 9.18074 1.70848 8.63901 2.44576 8.25911C3.18305 7.87921 3.9967 7.67098 4.82584 7.65C5.65783 7.66652 6.47517 7.87204 7.21602 8.25102C7.95687 8.63 8.60183 9.17251 9.10209 9.8375C9.28399 10.0864 9.39485 10.3804 9.42147 10.6875ZM7.90272 3.575C7.90107 4.38751 7.57792 5.16635 7.00385 5.74135C6.42978 6.31636 5.65148 6.64078 4.83897 6.64375C4.38658 6.64264 3.94005 6.54137 3.53143 6.34722C3.12282 6.15308 2.76226 5.87087 2.47564 5.52086C2.18902 5.17085 1.98346 4.76171 1.8737 4.32284C1.76395 3.88396 1.75273 3.42623 1.84084 2.9825C1.92933 2.53867 2.11509 2.11996 2.38476 1.7565C2.65442 1.39304 3.00129 1.09387 3.40041 0.880505C3.79953 0.667139 4.24098 0.544885 4.693 0.522536C5.14502 0.500186 5.59637 0.578299 6.01459 0.751253C6.57391 0.982182 7.05228 1.37363 7.38932 1.87619C7.72636 2.37875 7.90697 2.96989 7.90834 3.575H7.90272Z" fill="#1391EA" /></svg>
                                          <span>Member Count</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.date_range_from && item?.date_range_to && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.416016 12.4584C0.416016 13.6626 1.33685 14.5834 2.54102 14.5834H12.4577C13.6618 14.5834 14.5827 13.6626 14.5827 12.4584V6.79175H0.416016V12.4584ZM12.4577 1.83341H11.041V1.12508C11.041 0.700081 10.7577 0.416748 10.3327 0.416748C9.90768 0.416748 9.62435 0.700081 9.62435 1.12508V1.83341H5.37435V1.12508C5.37435 0.700081 5.09102 0.416748 4.66602 0.416748C4.24102 0.416748 3.95768 0.700081 3.95768 1.12508V1.83341H2.54102C1.33685 1.83341 0.416016 2.75425 0.416016 3.95842V5.37508H14.5827V3.95842C14.5827 2.75425 13.6618 1.83341 12.4577 1.83341Z" fill="#1391EA" /></svg>
                                          <span>Date Range</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="custom-alert-actions">
                                  <div className="custom-alert-status">
                                    <span className='d-flex align-items-center'>
                                      <svg width={12} height={14} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.56804 12.4946C3.85814 12.8614 4.22781 13.1575 4.64912 13.3606C5.07043 13.5636 5.53236 13.6682 6.00004 13.6666C6.46772 13.6682 6.92966 13.5636 7.35097 13.3606C7.77228 13.1575 8.14194 12.8614 8.43204 12.4946C6.81807 12.713 5.18202 12.713 3.56804 12.4946ZM10.5 4.99992V5.46925C10.5 6.03259 10.66 6.58325 10.9614 7.05192L11.7 8.20059C12.374 9.24992 11.8594 10.6759 10.6867 11.0073C7.62252 11.875 4.37757 11.875 1.31337 11.0073C0.140708 10.6759 -0.373959 9.24992 0.300041 8.20059L1.03871 7.05192C1.34085 6.57938 1.50118 6.03013 1.50071 5.46925V4.99992C1.50071 2.42259 3.51537 0.333252 6.00004 0.333252C8.48471 0.333252 10.5 2.42259 10.5 4.99992Z" fill="#108DE5" />
                                      </svg>
                                      <span className="alert-status">Alert :</span>
                                      <span>{item.status}</span>
                                      <label className={styles.toggleSwitch}>
                                        <input
                                          data-id={item.id}
                                          type="checkbox"
                                          checked={item.status == "1"}
                                          onChange={handleToggleStatus}
                                          className={styles.toggleInput}
                                        />
                                        <span className={styles.slider}></span>
                                        <span className={styles.labelText}>
                                          {item.status === "1" ? "On" : "Off"}
                                        </span>
                                      </label>
                                    </span>
                                  </div>
                                  <div className="custom-alert-edit">
                                    <button type="button" className="" data-id={item.id} onClick={handelEdit}>
                                      <span>
                                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M0 12V9.16667L8.8 0.383333C8.93333 0.261111 9.08067 0.166667 9.242 0.1C9.40333 0.0333334 9.57267 0 9.75 0C9.92733 0 10.0996 0.0333334 10.2667 0.1C10.4338 0.166667 10.5782 0.266667 10.7 0.4L11.6167 1.33333C11.75 1.45556 11.8473 1.6 11.9087 1.76667C11.97 1.93333 12.0004 2.1 12 2.26667C12 2.44444 11.9696 2.614 11.9087 2.77533C11.8478 2.93667 11.7504 3.08378 11.6167 3.21667L2.83333 12H0ZM9.73333 3.2L10.6667 2.26667L9.73333 1.33333L8.8 2.26667L9.73333 3.2Z" fill="#08B150" />
                                        </svg>
                                      </span>
                                      <span>
                                        <span>Edit Alert</span>
                                      </span>
                                    </button>
                                  </div>
                                  <div className="custom-alert-delete">
                                    <button type="button" className="" data-id={item.id} onClick={handelDelete}>
                                      <span>
                                        <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M2.66602 12C2.29935 12 1.98557 11.8696 1.72468 11.6087C1.46379 11.3478 1.33313 11.0338 1.33268 10.6667V2H0.666016V0.666667H3.99935V0H7.99935V0.666667H11.3327V2H10.666V10.6667C10.666 11.0333 10.5356 11.3473 10.2747 11.6087C10.0138 11.87 9.69979 12.0004 9.33268 12H2.66602ZM3.99935 9.33333H5.33268V3.33333H3.99935V9.33333ZM6.66602 9.33333H7.99935V3.33333H6.66602V9.33333Z" fill="#F64549" />
                                        </svg>
                                      </span>
                                      <span>
                                        <span>Delete</span>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                {/* <AnimatePresence mode='popLayout'>
                                  <motion.div
                                    key={activeId}
                                    initial={{ opacity: 0, y: -60 }}
                                    animate={{ opacity: 1, y: 0, }}
                                    // exit={{ opacity: 0, y: -50 }}
                                    transition={{
                                      duration: 1,
                                      ease: "easeInOut",
                                      // staggerDirection: 1
                                    }}
                                    layout
                                    style={{ overflow: "hidden" }}
                                  > */}
                                <div className="custom-alert-toggle-section">
                                  {
                                    item?.classification && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.75 3.25C7.75 2.65666 7.92595 2.07664 8.25559 1.58329C8.58524 1.08994 9.05377 0.705426 9.60195 0.478363C10.1501 0.2513 10.7533 0.19189 11.3353 0.307646C11.9172 0.423401 12.4518 0.709123 12.8713 1.12868C13.2909 1.54824 13.5766 2.08279 13.6924 2.66473C13.8081 3.24667 13.7487 3.84987 13.5216 4.39805C13.2946 4.94623 12.9101 5.41477 12.4167 5.74441C11.9234 6.07405 11.3433 6.25 10.75 6.25H8.5C8.30109 6.25 8.11032 6.17098 7.96967 6.03033C7.82902 5.88968 7.75 5.69891 7.75 5.5V3.25ZM0.25 3.25C0.25 2.45435 0.56607 1.69129 1.12868 1.12868C1.69129 0.566072 2.45435 0.250001 3.25 0.250001C4.04565 0.250001 4.80871 0.566072 5.37132 1.12868C5.93393 1.69129 6.25 2.45435 6.25 3.25V5.5C6.25 5.69891 6.17098 5.88968 6.03033 6.03033C5.88968 6.17098 5.69891 6.25 5.5 6.25H3.25C2.45435 6.25 1.69129 5.93393 1.12868 5.37132C0.56607 4.80871 0.25 4.04565 0.25 3.25ZM0.25 10.75C0.25 9.95435 0.56607 9.19129 1.12868 8.62868C1.69129 8.06607 2.45435 7.75 3.25 7.75H5.5C5.69891 7.75 5.88968 7.82902 6.03033 7.96967C6.17098 8.11032 6.25 8.30109 6.25 8.5V10.75C6.25 11.5457 5.93393 12.3087 5.37132 12.8713C4.80871 13.4339 4.04565 13.75 3.25 13.75C2.45435 13.75 1.69129 13.4339 1.12868 12.8713C0.56607 12.3087 0.25 11.5457 0.25 10.75ZM7.75 8.5C7.75 8.30109 7.82902 8.11032 7.96967 7.96967C8.11032 7.82902 8.30109 7.75 8.5 7.75H10.75C11.3433 7.75 11.9234 7.92595 12.4167 8.25559C12.9101 8.58524 13.2946 9.05377 13.5216 9.60195C13.7487 10.1501 13.8081 10.7533 13.6924 11.3353C13.5766 11.9172 13.2909 12.4518 12.8713 12.8713C12.4518 13.2909 11.9172 13.5766 11.3353 13.6924C10.7533 13.8081 10.1501 13.7487 9.60195 13.5216C9.05377 13.2946 8.58524 12.9101 8.25559 12.4167C7.92595 11.9234 7.75 11.3433 7.75 10.75V8.5Z" fill="#1391EA" /></svg>
                                          <span><strong>Classification</strong> : {item?.classification}</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.country && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.50071 0.416748C3.37625 0.416748 0.834042 2.95896 0.834042 6.07987C0.8135 10.6451 6.28538 14.4304 6.50071 14.5834C6.50071 14.5834 12.1879 10.6451 12.1674 6.08342C12.1674 2.95896 9.62517 0.416748 6.50071 0.416748ZM6.50071 8.91675C4.93529 8.91675 3.66738 7.64883 3.66738 6.08342C3.66738 4.518 4.93529 3.25008 6.50071 3.25008C8.06612 3.25008 9.33404 4.518 9.33404 6.08342C9.33404 7.64883 8.06612 8.91675 6.50071 8.91675Z" fill="#1391EA" /></svg>
                                          <span><strong>Country</strong> : {item?.country?.name}</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.risk_score && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.41151 0.655306C6.76826 0.613263 7.12772 0.707502 7.41795 0.919161C7.70818 1.13082 7.90777 1.44428 7.97676 1.79681L7.99551 1.92206L7.99926 2.00006V7.25006C7.99929 7.43376 8.06673 7.61106 8.1888 7.74833C8.31087 7.88561 8.47907 7.97331 8.66151 7.99481L8.74926 8.00006H13.8493C14.2471 8.00006 14.6286 8.15809 14.9099 8.4394C15.1912 8.7207 15.3493 9.10223 15.3493 9.50006C15.3492 9.55711 15.3427 9.61398 15.3298 9.66956C15.0296 10.9646 14.3907 12.1565 13.4784 13.1234C12.5661 14.0902 11.4132 14.7972 10.1378 15.172C8.86236 15.5467 7.51027 15.5757 6.21995 15.2561C4.92963 14.9364 3.74746 14.2796 2.79449 13.3528C1.84152 12.426 1.152 11.2625 0.79654 9.98163C0.441082 8.70071 0.432459 7.34833 0.771554 6.06299C1.11065 4.77764 1.78528 3.60552 2.72635 2.66664C3.66742 1.72777 4.84113 1.05589 6.12726 0.719806L6.32976 0.669556L6.41151 0.655306Z" fill="#1391EA" /><path d="M9.5 1.62506V5.75006C9.5 5.94897 9.57902 6.13973 9.71967 6.28039C9.86032 6.42104 10.0511 6.50006 10.25 6.50006H14.375C14.4949 6.50002 14.613 6.47125 14.7195 6.41616C14.8259 6.36107 14.9176 6.28126 14.9869 6.18342C15.0562 6.08557 15.101 5.97256 15.1176 5.85383C15.1342 5.73511 15.1221 5.61413 15.0823 5.50106C14.7098 4.44306 14.1047 3.48208 13.3116 2.68888C12.5186 1.89569 11.5577 1.29047 10.4998 0.917805C10.3866 0.877856 10.2656 0.865626 10.1467 0.882141C10.0279 0.898657 9.9148 0.943436 9.81686 1.01272C9.71892 1.082 9.63903 1.17377 9.5839 1.28032C9.52876 1.38687 9.49999 1.50509 9.5 1.62506Z" fill="#1391EA" /></svg>
                                          <span><strong>Risk Score</strong> : {interpretPercentage(item?.risk_score)}</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.member_count && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.42147 10.6875C9.44676 10.9935 9.38651 11.3004 9.24745 11.5741C9.10839 11.8478 8.89599 12.0775 8.63397 12.2375C8.37272 12.3981 8.07147 12.4825 7.76522 12.4813H1.90709C1.60044 12.4826 1.29952 12.3982 1.03834 12.2375C0.775724 12.0785 0.563101 11.8488 0.42474 11.5748C0.286379 11.3007 0.227854 10.9932 0.255844 10.6875C0.278518 10.3824 0.386837 10.09 0.568344 9.84375C1.06666 9.18074 1.70848 8.63901 2.44576 8.25911C3.18305 7.87921 3.9967 7.67098 4.82584 7.65C5.65783 7.66652 6.47517 7.87204 7.21602 8.25102C7.95687 8.63 8.60183 9.17251 9.10209 9.8375C9.28399 10.0864 9.39485 10.3804 9.42147 10.6875ZM7.90272 3.575C7.90107 4.38751 7.57792 5.16635 7.00385 5.74135C6.42978 6.31636 5.65148 6.64078 4.83897 6.64375C4.38658 6.64264 3.94005 6.54137 3.53143 6.34722C3.12282 6.15308 2.76226 5.87087 2.47564 5.52086C2.18902 5.17085 1.98346 4.76171 1.8737 4.32284C1.76395 3.88396 1.75273 3.42623 1.84084 2.9825C1.92933 2.53867 2.11509 2.11996 2.38476 1.7565C2.65442 1.39304 3.00129 1.09387 3.40041 0.880505C3.79953 0.667139 4.24098 0.544885 4.693 0.522536C5.14502 0.500186 5.59637 0.578299 6.01459 0.751253C6.57391 0.982182 7.05228 1.37363 7.38932 1.87619C7.72636 2.37875 7.90697 2.96989 7.90834 3.575H7.90272Z" fill="#1391EA" /></svg>
                                          <span><strong>Member Count</strong> : {interpretPercentage(item?.member_count)}</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                  {
                                    item?.date_range_from && item?.date_range_to && (
                                      <div className='textInput-wrapper alertSetting-inputs'>
                                        <label htmlFor="">
                                          <svg className="inputlabel-svg" width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.416016 12.4584C0.416016 13.6626 1.33685 14.5834 2.54102 14.5834H12.4577C13.6618 14.5834 14.5827 13.6626 14.5827 12.4584V6.79175H0.416016V12.4584ZM12.4577 1.83341H11.041V1.12508C11.041 0.700081 10.7577 0.416748 10.3327 0.416748C9.90768 0.416748 9.62435 0.700081 9.62435 1.12508V1.83341H5.37435V1.12508C5.37435 0.700081 5.09102 0.416748 4.66602 0.416748C4.24102 0.416748 3.95768 0.700081 3.95768 1.12508V1.83341H2.54102C1.33685 1.83341 0.416016 2.75425 0.416016 3.95842V5.37508H14.5827V3.95842C14.5827 2.75425 13.6618 1.83341 12.4577 1.83341Z" fill="#1391EA" /></svg>
                                          <span><strong>Date Range</strong> : {`${item?.date_range_from} to ${item?.date_range_to}`}</span>
                                        </label>
                                      </div>
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
                  :
                  <div className="no_record">
                    <p>No Record Found</p>
                  </div>
              }

            </div>

          </div>
        </div>
      </div >
    </>
  )
})

export default alertSettingLeaf
