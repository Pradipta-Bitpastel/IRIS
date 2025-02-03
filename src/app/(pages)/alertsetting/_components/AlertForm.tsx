'use client';
import React, { useEffect, useState } from 'react'
import Dropdown from './AlertInput';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { SelectedValues } from '../types/type';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { toastSettingData } from '@/constants';
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AlertForm = ({ selectStoreValue, setSelectStoreValue, dropdownOptions, initialValues, selectedValues, setSelectedValues, allAlertApi, getlLocalStorageData, setEditBtnStatus, editBtnstatus, filterData, alertSettingCallApi, sanatisedPayload, fromDate, toDate, setFromDate, setToDate, handleDateChange, fromInputRef, toInputRef, fromPickerRef, toPickerRef }) => {
    const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);
    const [errors, setErrors] = useState<Errors>({});

    type Errors = {
        [key: string]: string;
    };

    const handleDropdownChange = (key: keyof typeof selectedValues, value: any) => {
        setSelectedValues((prevState: any) => ({
            ...prevState,
            [key]: value,

        }));
        getlLocalStorageData()
    }
    const handelSubmit = async () => {
        const validationErrors = validateInitialValues(selectedValues);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // console.log("Validation errors:", validationErrors);
            return; // Prevent proceeding if validation fails
        }
        try {
            const formData = new FormData();
            // Append data to the FormData object
            formData.append("user_id", selectedValues.user_id);
            formData.append("name", selectedValues.alertName);
            formData.append("country_id", selectedValues.countryID);
            formData.append("classification", selectedValues.classification);
            formData.append("risk_score", selectedValues.riskScore);
            formData.append("member_count", selectedValues.memberCount);
            formData.append("date_range_from", selectedValues.date_range_from);
            formData.append("date_range_to", selectedValues.date_range_to);
            formData.append("status", selectedValues.status);

            let response = await alertSettingCallApi('user-alerts/add', 'post', formData)
            if (response?.status === 200) {
                setSelectedValues(initialValues);
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
                fromInputRef.current.value = '';
                toInputRef.current.value = '';
                allAlertApi()
                toast.success(`Alert added successfully.`, toastSettingData as ToastOptions<unknown>);
            }else if(response?.status ==='ERROR'){
                toast.error(response?.errors?.name && response?.errors?.name[0], toastSettingData as ToastOptions<unknown>);     
            }
        } catch (err) {
            console.log(err);
        }

    }
    const handelEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // alert('edit in progress')
        const validationErrors = validateInitialValues(selectedValues);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // console.log("Validation errors:", validationErrors);
            return; // Prevent proceeding if validation fails
        }
        try {
            const formData = new FormData();
            // Append data to the FormData object
            formData.append("id", selectedValues?.id)
            formData.append("user_id", selectedValues?.user_id);
            formData.append("name", selectedValues?.alertName);
            formData.append("country_id", selectedValues?.countryID);
            formData.append("classification", selectedValues?.classification);
            formData.append("risk_score", selectedValues?.riskScore);
            formData.append("member_count", selectedValues?.memberCount);
            formData.append("date_range_from", selectedValues?.date_range_from);
            formData.append("date_range_to", selectedValues?.date_range_to);
            formData.append("status", selectedValues?.status);

            let response = await alertSettingCallApi('user-alerts/update', 'post', formData)
            if (response?.status === 200) {

                toast.success(`Alert updated successfully.`, toastSettingData as ToastOptions<unknown>);
                allAlertApi()
                setSelectedValues(initialValues);
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
                // console.log("response", response);
            }
        } catch (err) {
            console.log(err);
        }
    

    }



    const validateInitialValues = (values: any): any => {
        const errors: any = {};

        // Check if alertName is not empty
        if (!values.alertName?.trim()) {
            errors.alertName = "Alert name is required.";
            return errors; // Return immediately if alertName is invalid
        }

        // Check if at least one other field (excluding 'status' and 'user_id') has a value
        const hasOtherValue = Object.keys(values).some((key) => {
            if (["alertName", "status", "user_id"].includes(key)) return false;
            const value = values[key];
            return value !== null && value !== undefined && String(value).trim() !== "";
        });

        if (!hasOtherValue) {
            errors.general = "At least one other field must have a value.";
        }

        return errors;
    };
    // console.log(selectedValues, 'edit in progress');
    const formValidate = () => {
        const isEveryValueEmptyExceptStatus = Object.entries(selectedValues)
            .filter(([key]) => key !== "status") // Exclude `status`
            .every(([, value]) => value === "");
        if (!isEveryValueEmptyExceptStatus) {
            const validationErrors = validateInitialValues(selectedValues);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length > 0) {
                // console.log("Validation errors:", validationErrors);
            } else {
                // console.log("Validation passed");
            }
        }
    }
    useEffect(() => {
        formValidate()
    }, [selectedValues]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                activePicker === 'from' &&
                fromPickerRef.current &&
                !fromPickerRef.current.contains(target) &&
                fromInputRef.current !== target
            ) {
                setActivePicker(null);
            }
            if (
                activePicker === 'to' &&
                toPickerRef.current &&
                !toPickerRef.current.contains(target) &&
                toInputRef.current !== target
            ) {
                setActivePicker(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activePicker]);


    return (
        <>
            <ToastContainer />
            <div className='row alertSetting-row-form'>
                <div className="col-lg-3">
                    <div className={`textInput-wrapper alertSetting-inputs `}>
                        <label htmlFor="">
                            <svg className='inputlabel-svg' width={14} height={16} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.26405 14.1815C4.59041 14.5942 5.00628 14.9273 5.48026 15.1557C5.95423 15.3841 6.47391 15.5019 7.00005 15.5C7.52618 15.5019 8.04586 15.3841 8.51984 15.1557C8.99381 14.9273 9.40968 14.5942 9.73605 14.1815C7.92032 14.4272 6.07977 14.4272 4.26405 14.1815ZM12.0625 5.75V6.278C12.0625 6.91175 12.2425 7.53125 12.5815 8.0585L13.4125 9.35075C14.1708 10.5312 13.5918 12.1355 12.2725 12.5082C8.82533 13.4845 5.17476 13.4845 1.72755 12.5082C0.408296 12.1355 -0.170703 10.5312 0.587547 9.35075L1.41855 8.0585C1.75846 7.5269 1.93883 6.90899 1.9383 6.278V5.75C1.9383 2.8505 4.2048 0.5 7.00005 0.5C9.7953 0.5 12.0625 2.8505 12.0625 5.75Z" fill="#1391EA" />
                            </svg>
                            <span>Alert Name</span>
                        </label>
                        <input type="text" className={`form-control ${selectedValues?.alertName === '' && errors.alertName ? 'error' : ''}`} placeholder='Enter Alert Name' value={selectedValues.alertName} onChange={(e) => handleDropdownChange("alertName", e.target.value)} />
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className={`alertSetting-inputs ${errors.general ? 'error' : ''}`}>
                        <Dropdown
                            label="Classification"
                            errors={errors}
                            options={dropdownOptions.classification}
                            selected={selectedValues.classification}
                            onChange={(value) => handleDropdownChange("classification", value)}
                        />

                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alertSetting-inputs">

                        <Dropdown
                            label="Country"
                            errors={errors}
                            options={dropdownOptions.country}
                            selected={selectedValues.country !== '' ? (JSON.parse(selectedValues.country))?.name : selectedValues.country}
                            onChange={(value: any) => {
                                handleDropdownChange("country", value)
                                handleDropdownChange("countryID", (JSON.parse(value))?.id)
                            }}
                        />

                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alertSetting-inputs">
                        <Dropdown
                            label="Risk Score"
                            errors={errors}
                            options={dropdownOptions.riskScore}
                            selected={selectedValues.riskScore}
                            onChange={(value) => handleDropdownChange("riskScore", value)}
                        />

                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alertSetting-inputs">
                        <Dropdown
                            label="Member Count"
                            errors={errors}
                            options={dropdownOptions.memberCount}
                            selected={selectedValues.memberCount}
                            onChange={(value) => handleDropdownChange("memberCount", value)}
                        />

                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="alertSetting-inputs">
                        <label htmlFor="">
                            <svg className='inputlabel-svg' width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.416016 12.4584C0.416016 13.6626 1.33685 14.5834 2.54102 14.5834H12.4577C13.6618 14.5834 14.5827 13.6626 14.5827 12.4584V6.79175H0.416016V12.4584ZM12.4577 1.83341H11.041V1.12508C11.041 0.700081 10.7577 0.416748 10.3327 0.416748C9.90768 0.416748 9.62435 0.700081 9.62435 1.12508V1.83341H5.37435V1.12508C5.37435 0.700081 5.09102 0.416748 4.66602 0.416748C4.24102 0.416748 3.95768 0.700081 3.95768 1.12508V1.83341H2.54102C1.33685 1.83341 0.416016 2.75425 0.416016 3.95842V5.37508H14.5827V3.95842C14.5827 2.75425 13.6618 1.83341 12.4577 1.83341Z" fill="#1391EA" />
                            </svg>
                            <span>
                                Date Range
                            </span>
                        </label>
                    </div>
                    <div className='fromtoInput'>
                        <input
                            type="text"
                            ref={fromInputRef}
                            className={`form-control ${errors.general ? "error" : ""}`}
                            placeholder="From"
                            onClick={() => setActivePicker(activePicker === 'from' ? null : 'from')}
                            readOnly
                        />
                        {activePicker === 'from' && (
                            <div
                                ref={fromPickerRef}
                                style={{
                                    position: 'absolute',
                                    zIndex: 100,
                                    backgroundColor: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                }}
                            >
                                <DateRange
                                    value={fromDate || ''}
                                    editableDateInputs={true}
                                    maxDate={new Date()}
                                    onChange={(ranges) => handleDateChange(ranges, 'from')}
                                    moveRangeOnFirstSelection={false}
                                    retainEndDateOnFirstSelection={true}
                                    ranges={fromDate}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-3 align-self-end">
                    <div className="alertSetting-inputs lasttoInput">
                        <div className='fromtoInput'>
                            <input
                                type="text"
                                ref={toInputRef}
                                className={`form-control ${errors.general ? "error" : ""}`}
                                placeholder="To"
                                onClick={() => setActivePicker(activePicker === 'to' ? null : 'to')}
                                readOnly
                            />
                            {activePicker === 'to' && (
                                <div
                                    ref={toPickerRef}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 100,
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <DateRange
                                        value={toDate || ''}
                                        editableDateInputs={true}
                                        maxDate={new Date()}
                                        onChange={(ranges) => handleDateChange(ranges, 'to')}
                                        moveRangeOnFirstSelection={false}
                                        retainEndDateOnFirstSelection={true}
                                        ranges={toDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 align-self-end">
                    <button id="searchFilterSubmit" onClick={editBtnstatus ? handelEdit : handelSubmit} className="login_form_btn">
                        {editBtnstatus ? "Update Alert" : "Add Alert"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default AlertForm
