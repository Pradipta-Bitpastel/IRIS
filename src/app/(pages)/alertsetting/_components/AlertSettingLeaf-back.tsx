'use client'
import React, { useEffect, useRef, useState } from 'react'
import AlertForm from './AlertForm'
import { SelectedValues } from '../types/type';
import styles from '../_assets/ToggleSwitch.module.css'
import { authHeader, filtermemberCounts, filterriskScores } from '@/constants';
import { TApiResponse } from '@/types/type';
import { useCallApi } from '@/app/api/CallApi';
import Loading from '@/app/loading';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
const alertSettingLeaf = () => {
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
  const [selectedValues, setSelectedValues] = useState<SelectedValues>(initialValues);
  const [selectvalueArr, setSelectvalueArray] = useState<any[]>([])

  const [editBtnstatus, setEditBtnStatus] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);
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
    const storedData = sessionStorage.getItem("userId");
    if (storedData) {
      setSelectedValues((prevState: SelectedValues) => ({
        ...prevState,
        user_id: JSON.parse(storedData).userID
      }));
    }
  }
  function convertToDate(dateString) {
    // Debug: Check the input value
    console.log("Input dateString:", dateString);

    // Check for null, undefined, or empty string
    if (dateString != 'null' || dateString === undefined) {
      // Split the input string into year, month, and day
      const [year, month, day] = dateString && dateString.split('-').map(Number);

      // Create and return the Date object
      const date = new Date(year, month - 1, day);

      // Debug: Check the created date object
      // console.log("Generated Date object:", date);
      return date;
    }

  }
  const formatTimestamps = (selection: any, type?: 'from' | 'to') => {
    console.log(selection, 'selection');

    if (type === 'from') {
      return `${format(selection.startDate, 'yyyy-MM-dd')}`
    } else {
      return `${format(selection.endDate, 'yyyy-MM-dd')}`
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
      const userID = await sessionStorage.getItem("userId");
      const formData = new FormData();
      formData.append('user_id', JSON.parse(userID).userID);
      let response = await alertSettingCallApi('user-alerts/list', 'post', formData)
      console.log("response", response);
      setSelectvalueArray(response?.data?.alerts);
    } catch (err) {

    }
  }

  const handelEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Access 'data-id' from currentTarget, which refers to the button element
    const alertMsgId = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
    if (selectvalueArr.length > 0) {

      const selectedItem = selectvalueArr.find(item => item.id === alertMsgId);
      console.log("selectedItem", selectedItem);
      setSelectedValues((prevState: SelectedValues) => ({
        ...prevState,
        id: alertMsgId,
        user_id: selectedItem?.user_id != 'null' ? selectedItem?.user_id : '',
        countryID: selectedItem?.country?.id != 'null' ? selectedItem?.country?.id : '',
        country: selectedItem?.country?.id != 'null' ? JSON.stringify({ id: selectedItem?.country?.id, name: selectedItem?.country?.name }) : '',
        memberCount: selectedItem?.member_count != 'null' ? selectedItem?.member_count : '',
        classification: selectedItem?.classification !== 'null' ? selectedItem?.classification : '',
        riskScore: selectedItem?.risk_score != 'null' ? selectedItem?.risk_score : '',
        alertName: selectedItem?.name != 'null' ? selectedItem?.name : '',
        date_range_from: selectedItem?.date_range_from != 'null' ? selectedItem?.date_range_from : '',
        date_range_to: selectedItem?.date_range_to != 'null' ? selectedItem?.date_range_to : '',
      }));
      let startsDate = selectedItem?.date_range_from != 'null' ? convertToDate(selectedItem?.date_range_from) : ''
      let endsDate = selectedItem?.date_range_to != 'null' ? convertToDate(selectedItem?.date_range_to) : ''

      setFromDate([
        {
          startDate: startsDate || '',
          endDate: endsDate || '',
          key: 'selection',
        }
      ]);
      setToDate([
        {
          startDate: startsDate || '',
          endDate: endsDate || '',
          key: 'selection',
        }
      ]);
      fromInputRef.current.value = formatTimestamps({ startDate: startsDate, endDate: endsDate }, 'from');
      toInputRef.current.value = formatTimestamps({ startDate: startsDate, endDate: endsDate }, 'to');
      setEditBtnStatus(true);
      // if (selectedItem) {
      //   setSelectedValues(selectedItem);
      //   setEditBtnStatus(true);
      // }
    }
  }
  const handelDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const deleteMsgId = (e.currentTarget as HTMLButtonElement).getAttribute('data-id');
    console.log(deleteMsgId, 'deleteMsgId');

    if (!deleteMsgId) return;

    // Retrieve user ID from sessionStorage
    const userId = JSON.parse(sessionStorage.getItem("userId")).userID;
    console.log(userId, 'userId');


    if (!userId) {
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
          formData.append("user_id", userId); // Include user_id in the request

          console.log("Form Data:", Object.fromEntries(formData)); // Debug form data

          let response: TApiResponse = await alertSettingCallApi(
            'user-alerts/delete',
            'post',
            formData
          );

          console.log("API Response:", response); // Debug API response

          if (response.status == "200") { // Compare as a number
            const updatedArray = selectvalueArr.filter(item => item.id !== deleteMsgId);
            setSelectvalueArray(updatedArray);
            setSelectedValues(initialValues);
            await allAlertApi();
            Swal.fire("Deleted!", "Your alert has been deleted.", "success");
            setFromDate([
              {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
              },
            ]);
            setToDate([
              {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection',
              },
            ]);
            setEditBtnStatus(false);
            fromInputRef.current.value = '';
            toInputRef.current.value = '';
          } else {
            console.error("Unexpected Response Status:", response.status);
            Swal.fire("Error!", response.message || "Failed to delete alert.", "error");
          }
        } catch (err) {
          console.error("Error deleting alert:", err);
          Swal.fire("Error!", err.message || "Something went wrong. Please try again.", "error");
        }
      }
    });
  };


  const handleToggleStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const toggleMsgId = e.target.getAttribute("data-id");
    if (!toggleMsgId) return;

    const userId = JSON.parse(sessionStorage.getItem("userId") || "{}").userID;
    if (!userId) {
      console.error("User ID is not available in session storage.");
      alert("Error: User ID is missing. Please log in again.");
      return;
    }

    // const isConfirmed = window.confirm("Do you want to toggle the status of this alert?");
    // if (!isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", toggleMsgId);
      formData.append("user_id", userId);
      formData.append("status", e.target.checked ? "1" : "0");

      console.log("Form Data:", Object.fromEntries(formData)); // Debug form data

      const response: TApiResponse = await alertSettingCallApi(
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
        console.log("Unexpected Response Status:", response);
        alert(response.message || "Failed to toggle alert status.");
      }
    } catch (err: any) {
      console.error("Error toggling alert status:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };




  const searchFilterDropdownApi = async () => {
    try {
      let response = await alertSettingCallApi('search-filterlist', 'get')
      if (response?.status == '200') {
        console.log("response", response);
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
    allAlertApi()
    // getlLocalStorageData();
  }, []);
  console.log(selectedValues, 'dhakgdaw');

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
            {
              selectvalueArr && selectvalueArr.length > 0 && (
                <div className="custom-alert-setting-wrapper">
                  <div className="custom-alert-header-wrapper">
                    <div className="custom-alert-title">
                      <h4>Custom Alerts</h4>
                    </div>
                  </div>
                  <div className="custom-alert-body">
                    {
                      selectvalueArr && selectvalueArr.map((item: any, index) => {
                        return (
                          <div className="custom-alert-name-content" key={index}>
                            <div className="row">
                              <div className="col-md-7 col-lg-9 custom-lg-9">
                                <div className="custom-alert-content">
                                  <h6>{item?.name}</h6>
                                </div>
                              </div>
                              <div className="col-md-5 col-lg-3 custom-lg-3">
                                <div className="custom-alert-actions">
                                  <div className="custom-alert-status">

                                    <span key={item.id} className="d-flex align-items-center">
                                      <svg
                                        width={12}
                                        height={14}
                                        viewBox="0 0 12 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M3.56804 12.4946C3.85814 12.8614 4.22781 13.1575 4.64912 13.3606C5.07043 13.5636 5.53236 13.6682 6.00004 13.6666C6.46772 13.6682 6.92966 13.5636 7.35097 13.3606C7.77228 13.1575 8.14194 12.8614 8.43204 12.4946C6.81807 12.713 5.18202 12.713 3.56804 12.4946ZM10.5 4.99992V5.46925C10.5 6.03259 10.66 6.58325 10.9614 7.05192L11.7 8.20059C12.374 9.24992 11.8594 10.6759 10.6867 11.0073C7.62252 11.875 4.37757 11.875 1.31337 11.0073C0.140708 10.6759 -0.373959 9.24992 0.300041 8.20059L1.03871 7.05192C1.34085 6.57938 1.50118 6.03013 1.50071 5.46925V4.99992C1.50071 2.42259 3.51537 0.333252 6.00004 0.333252C8.48471 0.333252 10.5 2.42259 10.5 4.99992Z"
                                          fill="#108DE5"
                                        />
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
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default alertSettingLeaf
