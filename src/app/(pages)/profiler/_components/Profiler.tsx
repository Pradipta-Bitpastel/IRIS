import React, { useState, useRef } from 'react'
import Loading from '@/app/loading';
import ProfilerMapComponent from './ProfilerMapComponent';
import ProfilePicturesComponent from './ProfilePicturesComponent';
import { profilerData } from "@/_assets/datasets/db";
const ProfilePage = (({ profilerData }) => {

    const [loaderStatus, setLoaderStatus] = useState(false);
    const dropdownMenuRef = useRef<HTMLUListElement>(null);
    const dropdownArrowRef = useRef<HTMLSpanElement>(null);
    const [sociaData, setSociaData] = useState([])
    const toggleDropdown = () => {
        const dropdownMenu = dropdownMenuRef.current;
        const dropdownArrow = dropdownArrowRef.current;

        if (dropdownMenu && dropdownArrow) {
            if (dropdownMenu.style.maxHeight === '0px' || dropdownMenu.style.maxHeight === '') {
                dropdownMenu.style.maxHeight = '200px';
                dropdownMenu.style.opacity = '1';
                dropdownArrow.style.transform = 'rotate(180deg)';
            } else {
                dropdownMenu.style.maxHeight = '0';
                dropdownMenu.style.opacity = '0';
                dropdownArrow.style.transform = 'rotate(0deg)';
            }
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const dropdownMenu = dropdownMenuRef.current;
        const dropdownLabel = event.target as HTMLElement;

        if (dropdownMenu && !dropdownMenu.contains(dropdownLabel)) {
            dropdownMenu.style.maxHeight = '0';
            dropdownMenu.style.opacity = '0';
            const dropdownArrow = dropdownArrowRef.current;
            if (dropdownArrow) {
                dropdownArrow.style.transform = 'rotate(0deg)';
            }
        }
    };
    const transformJsonToArray = (obj) => {
        let result = [];

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                // If the value is an object, wrap it inside the key's object
                result.push({ [key]: obj[key] });
            }
        }

        return result;
    };

    React.useEffect(() => {
        const transformedData = transformJsonToArray(profilerData?.social_data);
        setSociaData(transformedData);
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // console.log(sociaData[0]);

    return (
        <>
            {
                (loaderStatus) && <Loading />
            }

            <div className="dashboard_main">
                <div className="container-fluid">
                    <div className="profilerpage_main_wrapper">
                        <div className="profilepage-uppercontent">
                            <div className="row gx-2">
                                <div className="col-lg-4">
                                    <div className="profile-pictures">
                                        <ProfilePicturesComponent images={profilerData?.profile_image_url} />
                                    </div>
                                </div>
                                <div className="col-lg-8" style={{ overflow: 'hidden' }}>
                                    <ProfilerMapComponent profileData={profilerData?.country} />
                                </div>
                            </div>
                        </div>
                        <div className="profilepage-downcontent">
                            <div className="row gx-2">
                                <div className="col-lg-4">
                                    <div className="profile-information-area">
                                        <div className="profile-information-area-header">
                                            <h4>Basic Information</h4>
                                            <span className='information-three-dot'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                                    <path d="M11.7002 19.8252C11.7002 19.3942 11.8714 18.9809 12.1761 18.6761C12.4809 18.3714 12.8942 18.2002 13.3252 18.2002C13.7562 18.2002 14.1695 18.3714 14.4742 18.6761C14.779 18.9809 14.9502 19.3942 14.9502 19.8252C14.9502 20.2562 14.779 20.6695 14.4742 20.9742C14.1695 21.279 13.7562 21.4502 13.3252 21.4502C12.8942 21.4502 12.4809 21.279 12.1761 20.9742C11.8714 20.6695 11.7002 20.2562 11.7002 19.8252ZM11.7002 13.3252C11.7002 12.8942 11.8714 12.4809 12.1761 12.1761C12.4809 11.8714 12.8942 11.7002 13.3252 11.7002C13.7562 11.7002 14.1695 11.8714 14.4742 12.1761C14.779 12.4809 14.9502 12.8942 14.9502 13.3252C14.9502 13.7562 14.779 14.1695 14.4742 14.4742C14.1695 14.779 13.7562 14.9502 13.3252 14.9502C12.8942 14.9502 12.4809 14.779 12.1761 14.4742C11.8714 14.1695 11.7002 13.7562 11.7002 13.3252ZM11.7002 6.8252C11.7002 6.39422 11.8714 5.98089 12.1761 5.67615C12.4809 5.3714 12.8942 5.2002 13.3252 5.2002C13.7562 5.2002 14.1695 5.3714 14.4742 5.67615C14.779 5.98089 14.9502 6.39422 14.9502 6.8252C14.9502 7.25617 14.779 7.6695 14.4742 7.97424C14.1695 8.27899 13.7562 8.4502 13.3252 8.4502C12.8942 8.4502 12.4809 8.27899 12.1761 7.97424C11.8714 7.6695 11.7002 7.25617 11.7002 6.8252Z" fill="#108DE5" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="profile-information-area-content">
                                            <div className='profile-information-area-content-item'>
                                                <span>Name</span>
                                                <span><p>{profilerData?.first_name ? profilerData?.surname + " " + profilerData?.first_name : '-'}</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Date Of Birth</span>
                                                <span><p>{profilerData?.date_of_birth ? profilerData?.date_of_birth : '-'}</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Relevant identifiers</span>
                                                <span><p>{profilerData?.group_memberships ? profilerData?.group_memberships[0]?.group?.group_name : '-'}</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Person</span>
                                                <span><p>{profilerData?.surname ? profilerData?.surname : '-'}</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Phone number</span>
                                                <span>
                                                    <p>{profilerData?.phone_number ? profilerData?.phone_number : '-'}</p>
                                                </span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Email address</span>
                                                <span><p>-</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Username</span>
                                                <span>
                                                    <p>{profilerData?.surname ? profilerData?.surname : '-'}</p>
                                                </span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Residences</span>
                                                <span>
                                                    <p>{profilerData?.location ? profilerData?.location : '-'}</p>
                                                </span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Locations</span>
                                                <span><p>{profilerData?.location ? profilerData?.location : '-'}</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Employment</span>
                                                <span><p>-</p></span>
                                            </div>
                                            <div className='profile-information-area-content-item'>
                                                <span>Education</span>
                                                <span><p>-</p></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-8'>
                                    <div className='social-media-area'>
                                        <div className="profile-information-area-header">
                                            <h4>Social Media</h4>
                                            <span className='information-three-dot'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                                    <path d="M11.7002 19.8252C11.7002 19.3942 11.8714 18.9809 12.1761 18.6761C12.4809 18.3714 12.8942 18.2002 13.3252 18.2002C13.7562 18.2002 14.1695 18.3714 14.4742 18.6761C14.779 18.9809 14.9502 19.3942 14.9502 19.8252C14.9502 20.2562 14.779 20.6695 14.4742 20.9742C14.1695 21.279 13.7562 21.4502 13.3252 21.4502C12.8942 21.4502 12.4809 21.279 12.1761 20.9742C11.8714 20.6695 11.7002 20.2562 11.7002 19.8252ZM11.7002 13.3252C11.7002 12.8942 11.8714 12.4809 12.1761 12.1761C12.4809 11.8714 12.8942 11.7002 13.3252 11.7002C13.7562 11.7002 14.1695 11.8714 14.4742 12.1761C14.779 12.4809 14.9502 12.8942 14.9502 13.3252C14.9502 13.7562 14.779 14.1695 14.4742 14.4742C14.1695 14.779 13.7562 14.9502 13.3252 14.9502C12.8942 14.9502 12.4809 14.779 12.1761 14.4742C11.8714 14.1695 11.7002 13.7562 11.7002 13.3252ZM11.7002 6.8252C11.7002 6.39422 11.8714 5.98089 12.1761 5.67615C12.4809 5.3714 12.8942 5.2002 13.3252 5.2002C13.7562 5.2002 14.1695 5.3714 14.4742 5.67615C14.779 5.98089 14.9502 6.39422 14.9502 6.8252C14.9502 7.25617 14.779 7.6695 14.4742 7.97424C14.1695 8.27899 13.7562 8.4502 13.3252 8.4502C12.8942 8.4502 12.4809 8.27899 12.1761 7.97424C11.8714 7.6695 11.7002 7.25617 11.7002 6.8252Z" fill="#108DE5" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className='social-media-content'>
                                            <div className="social-media-content-wrapper">
                                                <div className="row gx-0">
                                                    {
                                                        profilerData && sociaData.map((item: any, index: number) => {
                                                            return (

                                                                <>
                                                                    {
                                                                        sociaData[index].hiya && (
                                                                            <div className="col-lg-3">
                                                                                <div className='social-content-item-main'>
                                                                                    <div className='social-meadia-content-item'>
                                                                                        <span className="social-tag-main">
                                                                                            <span className='social-tag-icon'>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                                                    <g clipPath="url(#clip0_4653_207)">
                                                                                                        <path d="M15.4927 0.641602H1.50887C1.02989 0.641602 0.641602 1.02989 0.641602 1.50887V15.4927C0.641602 15.9717 1.02989 16.36 1.50887 16.36H15.4927C15.9717 16.36 16.36 15.9717 16.36 15.4927V1.50887C16.36 1.02989 15.9717 0.641602 15.4927 0.641602Z" fill="#3D5A98" />
                                                                                                        <path d="M11.4853 16.3585V10.2717H13.528L13.8334 7.89971H11.4853V6.38565C11.4853 5.69901 11.6766 5.23018 12.6607 5.23018H13.9171V3.10518C13.3087 3.04189 12.6973 3.01174 12.0856 3.01487C10.2767 3.01487 9.03094 4.11721 9.03094 6.15057V7.89971H6.98828V10.2717H9.03094V16.3585H11.4853Z" fill="white" />
                                                                                                    </g>
                                                                                                    <defs>
                                                                                                        <clipPath id="clip0_4653_207">
                                                                                                            <rect width="17" height="17" fill="white" />
                                                                                                        </clipPath>
                                                                                                    </defs>
                                                                                                </svg>
                                                                                            </span>
                                                                                            Facebook
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Name :</span>
                                                                                        <p>{item?.hiya?.name != null ? item?.hiya?.name : '-'}</p>
                                                                                    </div>

                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Type :</span>
                                                                                        <p>{item?.hiya?.type != null ? item?.hiya?.type : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Spam :</span>
                                                                                        <p>{item?.hiya?.is_spam != null ? item?.hiya?.is_spam : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Category :</span>
                                                                                        <p>{item?.hiya?.category != null ? item?.hiya?.category : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Reputation :</span>
                                                                                        <p>{item?.hiya?.reputation != null ? item?.hiya?.reputation : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Spam Score :</span>
                                                                                        <p>{item?.hiya?.spam_score != null ? item?.hiya?.spam_score : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Reputation Score :</span>
                                                                                        <p>{item?.hiya?.reputation_score != null ? item?.hiya?.reputation_score : '-'}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        sociaData[index].callerapi && (
                                                                            <div className="col-lg-3">
                                                                                <div className='social-content-item-main'>
                                                                                    <div className='social-meadia-content-item'>
                                                                                        <span className="social-tag-main">
                                                                                            <span className='social-tag-icon'>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                                                    <g clipPath="url(#clip0_4653_207)">
                                                                                                        <path d="M15.4927 0.641602H1.50887C1.02989 0.641602 0.641602 1.02989 0.641602 1.50887V15.4927C0.641602 15.9717 1.02989 16.36 1.50887 16.36H15.4927C15.9717 16.36 16.36 15.9717 16.36 15.4927V1.50887C16.36 1.02989 15.9717 0.641602 15.4927 0.641602Z" fill="#3D5A98" />
                                                                                                        <path d="M11.4853 16.3585V10.2717H13.528L13.8334 7.89971H11.4853V6.38565C11.4853 5.69901 11.6766 5.23018 12.6607 5.23018H13.9171V3.10518C13.3087 3.04189 12.6973 3.01174 12.0856 3.01487C10.2767 3.01487 9.03094 4.11721 9.03094 6.15057V7.89971H6.98828V10.2717H9.03094V16.3585H11.4853Z" fill="white" />
                                                                                                    </g>
                                                                                                    <defs>
                                                                                                        <clipPath id="clip0_4653_207">
                                                                                                            <rect width="17" height="17" fill="white" />
                                                                                                        </clipPath>
                                                                                                    </defs>
                                                                                                </svg>
                                                                                            </span>
                                                                                            Facebook
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Name :</span>
                                                                                        <p>{item?.callerapi?.name != null ? item?.callerapi?.name : '-'}</p>
                                                                                    </div>

                                                                                    {/* <div className='social-media-content-item'>
                                                                                        <span>Type :</span>
                                                                                        <p>{item?.hiya?.type != null ? item?.hiya?.type : '-'}</p>
                                                                                    </div> */}
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Spam :</span>
                                                                                        <p>{item?.callerapi?.is_spam != null ? item?.callerapi?.is_spam : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Spam Count:</span>
                                                                                        <p>{item?.callerapi?.spam_count != null ? item?.callerapi?.spam_count : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Spam Score:</span>
                                                                                        <p>{item?.callerapi?.spam_score != null ? item?.callerapi?.spam_score : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Block Count:</span>
                                                                                        <p>{item?.callerapi?.block_count != null ? item?.callerapi?.block_count : '-'}</p>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        sociaData[index].truecaller && (
                                                                            <div className="col-lg-3">
                                                                                <div className='social-content-item-main'>
                                                                                    <div className='social-meadia-content-item'>
                                                                                        <span className="social-tag-main">
                                                                                            <span className='social-tag-icon'>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                                                    <g clipPath="url(#clip0_4653_207)">
                                                                                                        <path d="M15.4927 0.641602H1.50887C1.02989 0.641602 0.641602 1.02989 0.641602 1.50887V15.4927C0.641602 15.9717 1.02989 16.36 1.50887 16.36H15.4927C15.9717 16.36 16.36 15.9717 16.36 15.4927V1.50887C16.36 1.02989 15.9717 0.641602 15.4927 0.641602Z" fill="#3D5A98" />
                                                                                                        <path d="M11.4853 16.3585V10.2717H13.528L13.8334 7.89971H11.4853V6.38565C11.4853 5.69901 11.6766 5.23018 12.6607 5.23018H13.9171V3.10518C13.3087 3.04189 12.6973 3.01174 12.0856 3.01487C10.2767 3.01487 9.03094 4.11721 9.03094 6.15057V7.89971H6.98828V10.2717H9.03094V16.3585H11.4853Z" fill="white" />
                                                                                                    </g>
                                                                                                    <defs>
                                                                                                        <clipPath id="clip0_4653_207">
                                                                                                            <rect width="17" height="17" fill="white" />
                                                                                                        </clipPath>
                                                                                                    </defs>
                                                                                                </svg>
                                                                                            </span>
                                                                                            Facebook
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Number Type :</span>
                                                                                        <p>{item?.truecaller?.number_type_label != null ? item?.truecaller?.number_type_label : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Number :</span>
                                                                                        <p>{item?.truecaller?.number != null ? item?.truecaller?.number : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>National Number :</span>
                                                                                        <p>{item?.truecaller?.national_number != null ? item?.truecaller?.national_number : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Country :</span>
                                                                                        <p>{item?.truecaller?.country != null ? item?.truecaller?.country : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Country Code :</span>
                                                                                        <p>{item?.truecaller?.country_code != null ? item?.truecaller?.country_code : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item'>
                                                                                        <span>Provider :</span>
                                                                                        <p>{item?.truecaller?.provider != null ? item?.truecaller?.provider : '-'}</p>
                                                                                    </div>
                                                                                    <div className='social-media-content-item align-items-start'>
                                                                                        <span>Time Zones :</span>
                                                                                        <div>
                                                                                            {
                                                                                                item?.truecaller?.time_zones?.length > 0 ? (
                                                                                                    item?.truecaller?.time_zones?.map((item: any, index: number) => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                <p key={index}>{item}</p>
                                                                                                            </>

                                                                                                        )
                                                                                                    })
                                                                                                ) : (
                                                                                                    <p>-</p>
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                    </div>                                                                             
                                                                                <div className='social-media-content-item'>
                                                                                    <span>Number Type :</span>
                                                                                    <p>{item?.truecaller?.number_type != null ? item?.truecaller?.number_type : '-'}</p>

                                                                                </div>
                                                                                <div className='social-media-content-item'>
                                                                                    <span>Reputation Score :</span>
                                                                                    <p>{item?.hiya?.reputation_score != null ? item?.hiya?.reputation_score : '-'}</p>
                                                                                </div>
                                                                            </div>
                                                                            </div >
                                                                        )

                                                    }
                                                </>
                                                )
                                                        })
                                                    }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-lg-5'>
                                    <div className="instant-meassageing-area-main">
                                        <div className="profile-information-area-header">
                                            <h4>Instant Messaging</h4>
                                            <span className='information-three-dot'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                                    <path d="M11.7002 19.8252C11.7002 19.3942 11.8714 18.9809 12.1761 18.6761C12.4809 18.3714 12.8942 18.2002 13.3252 18.2002C13.7562 18.2002 14.1695 18.3714 14.4742 18.6761C14.779 18.9809 14.9502 19.3942 14.9502 19.8252C14.9502 20.2562 14.779 20.6695 14.4742 20.9742C14.1695 21.279 13.7562 21.4502 13.3252 21.4502C12.8942 21.4502 12.4809 21.279 12.1761 20.9742C11.8714 20.6695 11.7002 20.2562 11.7002 19.8252ZM11.7002 13.3252C11.7002 12.8942 11.8714 12.4809 12.1761 12.1761C12.4809 11.8714 12.8942 11.7002 13.3252 11.7002C13.7562 11.7002 14.1695 11.8714 14.4742 12.1761C14.779 12.4809 14.9502 12.8942 14.9502 13.3252C14.9502 13.7562 14.779 14.1695 14.4742 14.4742C14.1695 14.779 13.7562 14.9502 13.3252 14.9502C12.8942 14.9502 12.4809 14.779 12.1761 14.4742C11.8714 14.1695 11.7002 13.7562 11.7002 13.3252ZM11.7002 6.8252C11.7002 6.39422 11.8714 5.98089 12.1761 5.67615C12.4809 5.3714 12.8942 5.2002 13.3252 5.2002C13.7562 5.2002 14.1695 5.3714 14.4742 5.67615C14.779 5.98089 14.9502 6.39422 14.9502 6.8252C14.9502 7.25617 14.779 7.6695 14.4742 7.97424C14.1695 8.27899 13.7562 8.4502 13.3252 8.4502C12.8942 8.4502 12.4809 8.27899 12.1761 7.97424C11.8714 7.6695 11.7002 7.25617 11.7002 6.8252Z" fill="#108DE5" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="instant-messaging-main-content-area">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="instant-messaging-social-content-area-main">
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                            <g clipPath="url(#clip0_4653_760)">
                                                                                <g filter="url(#filter0_d_4653_760)">
                                                                                    <mask id="path-2-outside-1_4653_760" maskUnits="userSpaceOnUse" x="1.4707" y="1.4707" width="18" height="18" fill="black">
                                                                                        <rect fill="white" x="1.4707" y="1.4707" width="18" height="18" />
                                                                                        <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" />
                                                                                    </mask>
                                                                                    <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" fill="url(#paint0_linear_4653_760)" shape-rendering="crispEdges" />
                                                                                    <path d="M3.60513 14.4061L3.79797 14.4591L3.82021 14.3783L3.77815 14.3058L3.60513 14.4061ZM2.4707 18.5295L2.27787 18.4765L2.18596 18.8106L2.52122 18.723L2.4707 18.5295ZM6.70951 17.4231L6.8048 17.2472L6.73539 17.2096L6.659 17.2296L6.70951 17.4231ZM10.5304 18.3915L10.5303 18.5915H10.5304V18.3915ZM18.5295 10.434L18.7295 10.4341V10.4341L18.5295 10.434ZM16.1896 4.80444L16.0485 4.94612L16.0485 4.94612L16.1896 4.80444ZM10.5335 2.4707L10.5336 2.2707H10.5335V2.4707ZM2.33763 10.4277C2.33723 11.8651 2.71454 13.269 3.43212 14.5064L3.77815 14.3058C3.09604 13.1295 2.73725 11.7949 2.73763 10.4278L2.33763 10.4277ZM3.4123 14.353L2.27787 18.4765L2.66354 18.5826L3.79797 14.4591L3.4123 14.353ZM2.52122 18.723L6.76002 17.6166L6.659 17.2296L2.42019 18.336L2.52122 18.723ZM6.61422 17.5989C7.81591 18.2502 9.16224 18.5914 10.5303 18.5915L10.5304 18.1915C9.22875 18.1914 7.94792 17.8667 6.8048 17.2472L6.61422 17.5989ZM10.5304 18.5915H10.5339V18.1915H10.5304V18.5915ZM10.5339 18.5915C15.0501 18.5915 18.7276 14.9331 18.7295 10.4341L18.3295 10.4339C18.3277 14.7104 14.8309 18.1915 10.5339 18.1915V18.5915ZM18.7295 10.4341C18.7304 8.25463 17.8781 6.20436 16.3308 4.66275L16.0485 4.94612C17.5207 6.41283 18.3303 8.36115 18.3295 10.434L18.7295 10.4341ZM16.3308 4.66276C14.7837 3.12127 12.7254 2.2717 10.5336 2.2707L10.5335 2.6707C12.6198 2.67165 14.5766 3.47955 16.0485 4.94612L16.3308 4.66276ZM10.5335 2.2707C6.01679 2.2707 2.33956 5.92892 2.3377 10.4277L2.7377 10.4278C2.73947 6.15161 6.23596 2.6707 10.5335 2.6707V2.2707Z" fill="black" fill-opacity="0.2" mask="url(#path-2-outside-1_4653_760)" />
                                                                                </g>
                                                                                <g filter="url(#filter1_d_4653_760)">
                                                                                    <path d="M2.53782 10.4278C2.53738 11.8303 2.90542 13.1994 3.60511 14.4061L2.4707 18.5295L6.70942 17.4231C7.87732 18.057 9.19226 18.3913 10.5303 18.3918H10.5337C14.9404 18.3918 18.5276 14.8216 18.5295 10.4342C18.5303 8.3079 17.6992 6.30844 16.1897 4.80433C14.68 3.30041 12.6726 2.47158 10.5337 2.4707C6.12634 2.4707 2.53958 6.04034 2.53782 10.4278ZM5.06213 14.1983L4.90387 13.9482C4.23855 12.895 3.88739 11.678 3.88789 10.4283C3.88927 6.78156 6.87044 3.81463 10.5362 3.81463C12.3115 3.81538 13.9799 4.50432 15.2347 5.75432C16.4895 7.00445 17.18 8.66624 17.1795 10.4337C17.1779 14.0805 14.1967 17.0478 10.5337 17.0478H10.5311C9.33842 17.0472 8.1687 16.7283 7.14859 16.1257L6.90582 15.9824L4.39049 16.6389L5.06213 14.1983Z" fill="url(#paint1_linear_4653_760)" />
                                                                                </g>
                                                                                <path d="M8.37515 6.52058C8.21577 6.19319 8.04803 6.18659 7.89646 6.18084C7.77235 6.17591 7.63046 6.17628 7.48871 6.17628C7.34683 6.17628 7.1163 6.2256 6.92145 6.42224C6.72639 6.61905 6.17676 7.09468 6.17676 8.06204C6.17676 9.0294 6.93915 9.96434 7.04543 10.0957C7.15184 10.2267 8.51724 12.2754 10.6797 13.0635C12.4769 13.7185 12.8426 13.5883 13.2327 13.5554C13.6228 13.5227 14.4914 13.0799 14.6687 12.6208C14.846 12.1617 14.846 11.7682 14.7928 11.6859C14.7397 11.604 14.5978 11.5548 14.385 11.4565C14.1723 11.3582 13.1262 10.8825 12.9313 10.8169C12.7362 10.7513 12.5944 10.7186 12.4525 10.9155C12.3106 11.112 11.9032 11.5548 11.779 11.6859C11.655 11.8174 11.5308 11.8337 11.3181 11.7354C11.1052 11.6367 10.42 11.4294 9.60715 10.7596C8.97468 10.2384 8.5477 9.59478 8.42358 9.39791C8.29947 9.20133 8.41029 9.09478 8.51697 8.9968C8.61256 8.9087 8.72979 8.7672 8.83627 8.65243C8.94235 8.5376 8.97776 8.45567 9.0487 8.32454C9.11971 8.19329 9.08417 8.07846 9.03106 7.98011C8.97776 7.88176 8.56433 6.90934 8.37515 6.52058Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <filter id="filter0_d_4653_760" x="0.185547" y="0.270508" width="20.5439" height="20.54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <filter id="filter1_d_4653_760" x="0.470703" y="0.470703" width="20.0586" height="20.0586" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <linearGradient id="paint0_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#1FAF38" />
                                                                                    <stop offset="1" stop-color="#60D669" />
                                                                                </linearGradient>
                                                                                <linearGradient id="paint1_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#F9F9F9" />
                                                                                    <stop offset="1" stop-color="white" />
                                                                                </linearGradient>
                                                                                <clipPath id="clip0_4653_760">
                                                                                    <rect width="21" height="21" rx="5" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Whatsapp
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                            <g clipPath="url(#clip0_4653_760)">
                                                                                <g filter="url(#filter0_d_4653_760)">
                                                                                    <mask id="path-2-outside-1_4653_760" maskUnits="userSpaceOnUse" x="1.4707" y="1.4707" width="18" height="18" fill="black">
                                                                                        <rect fill="white" x="1.4707" y="1.4707" width="18" height="18" />
                                                                                        <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" />
                                                                                    </mask>
                                                                                    <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" fill="url(#paint0_linear_4653_760)" shape-rendering="crispEdges" />
                                                                                    <path d="M3.60513 14.4061L3.79797 14.4591L3.82021 14.3783L3.77815 14.3058L3.60513 14.4061ZM2.4707 18.5295L2.27787 18.4765L2.18596 18.8106L2.52122 18.723L2.4707 18.5295ZM6.70951 17.4231L6.8048 17.2472L6.73539 17.2096L6.659 17.2296L6.70951 17.4231ZM10.5304 18.3915L10.5303 18.5915H10.5304V18.3915ZM18.5295 10.434L18.7295 10.4341V10.4341L18.5295 10.434ZM16.1896 4.80444L16.0485 4.94612L16.0485 4.94612L16.1896 4.80444ZM10.5335 2.4707L10.5336 2.2707H10.5335V2.4707ZM2.33763 10.4277C2.33723 11.8651 2.71454 13.269 3.43212 14.5064L3.77815 14.3058C3.09604 13.1295 2.73725 11.7949 2.73763 10.4278L2.33763 10.4277ZM3.4123 14.353L2.27787 18.4765L2.66354 18.5826L3.79797 14.4591L3.4123 14.353ZM2.52122 18.723L6.76002 17.6166L6.659 17.2296L2.42019 18.336L2.52122 18.723ZM6.61422 17.5989C7.81591 18.2502 9.16224 18.5914 10.5303 18.5915L10.5304 18.1915C9.22875 18.1914 7.94792 17.8667 6.8048 17.2472L6.61422 17.5989ZM10.5304 18.5915H10.5339V18.1915H10.5304V18.5915ZM10.5339 18.5915C15.0501 18.5915 18.7276 14.9331 18.7295 10.4341L18.3295 10.4339C18.3277 14.7104 14.8309 18.1915 10.5339 18.1915V18.5915ZM18.7295 10.4341C18.7304 8.25463 17.8781 6.20436 16.3308 4.66275L16.0485 4.94612C17.5207 6.41283 18.3303 8.36115 18.3295 10.434L18.7295 10.4341ZM16.3308 4.66276C14.7837 3.12127 12.7254 2.2717 10.5336 2.2707L10.5335 2.6707C12.6198 2.67165 14.5766 3.47955 16.0485 4.94612L16.3308 4.66276ZM10.5335 2.2707C6.01679 2.2707 2.33956 5.92892 2.3377 10.4277L2.7377 10.4278C2.73947 6.15161 6.23596 2.6707 10.5335 2.6707V2.2707Z" fill="black" fill-opacity="0.2" mask="url(#path-2-outside-1_4653_760)" />
                                                                                </g>
                                                                                <g filter="url(#filter1_d_4653_760)">
                                                                                    <path d="M2.53782 10.4278C2.53738 11.8303 2.90542 13.1994 3.60511 14.4061L2.4707 18.5295L6.70942 17.4231C7.87732 18.057 9.19226 18.3913 10.5303 18.3918H10.5337C14.9404 18.3918 18.5276 14.8216 18.5295 10.4342C18.5303 8.3079 17.6992 6.30844 16.1897 4.80433C14.68 3.30041 12.6726 2.47158 10.5337 2.4707C6.12634 2.4707 2.53958 6.04034 2.53782 10.4278ZM5.06213 14.1983L4.90387 13.9482C4.23855 12.895 3.88739 11.678 3.88789 10.4283C3.88927 6.78156 6.87044 3.81463 10.5362 3.81463C12.3115 3.81538 13.9799 4.50432 15.2347 5.75432C16.4895 7.00445 17.18 8.66624 17.1795 10.4337C17.1779 14.0805 14.1967 17.0478 10.5337 17.0478H10.5311C9.33842 17.0472 8.1687 16.7283 7.14859 16.1257L6.90582 15.9824L4.39049 16.6389L5.06213 14.1983Z" fill="url(#paint1_linear_4653_760)" />
                                                                                </g>
                                                                                <path d="M8.37515 6.52058C8.21577 6.19319 8.04803 6.18659 7.89646 6.18084C7.77235 6.17591 7.63046 6.17628 7.48871 6.17628C7.34683 6.17628 7.1163 6.2256 6.92145 6.42224C6.72639 6.61905 6.17676 7.09468 6.17676 8.06204C6.17676 9.0294 6.93915 9.96434 7.04543 10.0957C7.15184 10.2267 8.51724 12.2754 10.6797 13.0635C12.4769 13.7185 12.8426 13.5883 13.2327 13.5554C13.6228 13.5227 14.4914 13.0799 14.6687 12.6208C14.846 12.1617 14.846 11.7682 14.7928 11.6859C14.7397 11.604 14.5978 11.5548 14.385 11.4565C14.1723 11.3582 13.1262 10.8825 12.9313 10.8169C12.7362 10.7513 12.5944 10.7186 12.4525 10.9155C12.3106 11.112 11.9032 11.5548 11.779 11.6859C11.655 11.8174 11.5308 11.8337 11.3181 11.7354C11.1052 11.6367 10.42 11.4294 9.60715 10.7596C8.97468 10.2384 8.5477 9.59478 8.42358 9.39791C8.29947 9.20133 8.41029 9.09478 8.51697 8.9968C8.61256 8.9087 8.72979 8.7672 8.83627 8.65243C8.94235 8.5376 8.97776 8.45567 9.0487 8.32454C9.11971 8.19329 9.08417 8.07846 9.03106 7.98011C8.97776 7.88176 8.56433 6.90934 8.37515 6.52058Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <filter id="filter0_d_4653_760" x="0.185547" y="0.270508" width="20.5439" height="20.54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <filter id="filter1_d_4653_760" x="0.470703" y="0.470703" width="20.0586" height="20.0586" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <linearGradient id="paint0_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#1FAF38" />
                                                                                    <stop offset="1" stop-color="#60D669" />
                                                                                </linearGradient>
                                                                                <linearGradient id="paint1_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#F9F9F9" />
                                                                                    <stop offset="1" stop-color="white" />
                                                                                </linearGradient>
                                                                                <clipPath id="clip0_4653_760">
                                                                                    <rect width="21" height="21" rx="5" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Whatsapp
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                            <g clipPath="url(#clip0_4653_760)">
                                                                                <g filter="url(#filter0_d_4653_760)">
                                                                                    <mask id="path-2-outside-1_4653_760" maskUnits="userSpaceOnUse" x="1.4707" y="1.4707" width="18" height="18" fill="black">
                                                                                        <rect fill="white" x="1.4707" y="1.4707" width="18" height="18" />
                                                                                        <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" />
                                                                                    </mask>
                                                                                    <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" fill="url(#paint0_linear_4653_760)" shape-rendering="crispEdges" />
                                                                                    <path d="M3.60513 14.4061L3.79797 14.4591L3.82021 14.3783L3.77815 14.3058L3.60513 14.4061ZM2.4707 18.5295L2.27787 18.4765L2.18596 18.8106L2.52122 18.723L2.4707 18.5295ZM6.70951 17.4231L6.8048 17.2472L6.73539 17.2096L6.659 17.2296L6.70951 17.4231ZM10.5304 18.3915L10.5303 18.5915H10.5304V18.3915ZM18.5295 10.434L18.7295 10.4341V10.4341L18.5295 10.434ZM16.1896 4.80444L16.0485 4.94612L16.0485 4.94612L16.1896 4.80444ZM10.5335 2.4707L10.5336 2.2707H10.5335V2.4707ZM2.33763 10.4277C2.33723 11.8651 2.71454 13.269 3.43212 14.5064L3.77815 14.3058C3.09604 13.1295 2.73725 11.7949 2.73763 10.4278L2.33763 10.4277ZM3.4123 14.353L2.27787 18.4765L2.66354 18.5826L3.79797 14.4591L3.4123 14.353ZM2.52122 18.723L6.76002 17.6166L6.659 17.2296L2.42019 18.336L2.52122 18.723ZM6.61422 17.5989C7.81591 18.2502 9.16224 18.5914 10.5303 18.5915L10.5304 18.1915C9.22875 18.1914 7.94792 17.8667 6.8048 17.2472L6.61422 17.5989ZM10.5304 18.5915H10.5339V18.1915H10.5304V18.5915ZM10.5339 18.5915C15.0501 18.5915 18.7276 14.9331 18.7295 10.4341L18.3295 10.4339C18.3277 14.7104 14.8309 18.1915 10.5339 18.1915V18.5915ZM18.7295 10.4341C18.7304 8.25463 17.8781 6.20436 16.3308 4.66275L16.0485 4.94612C17.5207 6.41283 18.3303 8.36115 18.3295 10.434L18.7295 10.4341ZM16.3308 4.66276C14.7837 3.12127 12.7254 2.2717 10.5336 2.2707L10.5335 2.6707C12.6198 2.67165 14.5766 3.47955 16.0485 4.94612L16.3308 4.66276ZM10.5335 2.2707C6.01679 2.2707 2.33956 5.92892 2.3377 10.4277L2.7377 10.4278C2.73947 6.15161 6.23596 2.6707 10.5335 2.6707V2.2707Z" fill="black" fill-opacity="0.2" mask="url(#path-2-outside-1_4653_760)" />
                                                                                </g>
                                                                                <g filter="url(#filter1_d_4653_760)">
                                                                                    <path d="M2.53782 10.4278C2.53738 11.8303 2.90542 13.1994 3.60511 14.4061L2.4707 18.5295L6.70942 17.4231C7.87732 18.057 9.19226 18.3913 10.5303 18.3918H10.5337C14.9404 18.3918 18.5276 14.8216 18.5295 10.4342C18.5303 8.3079 17.6992 6.30844 16.1897 4.80433C14.68 3.30041 12.6726 2.47158 10.5337 2.4707C6.12634 2.4707 2.53958 6.04034 2.53782 10.4278ZM5.06213 14.1983L4.90387 13.9482C4.23855 12.895 3.88739 11.678 3.88789 10.4283C3.88927 6.78156 6.87044 3.81463 10.5362 3.81463C12.3115 3.81538 13.9799 4.50432 15.2347 5.75432C16.4895 7.00445 17.18 8.66624 17.1795 10.4337C17.1779 14.0805 14.1967 17.0478 10.5337 17.0478H10.5311C9.33842 17.0472 8.1687 16.7283 7.14859 16.1257L6.90582 15.9824L4.39049 16.6389L5.06213 14.1983Z" fill="url(#paint1_linear_4653_760)" />
                                                                                </g>
                                                                                <path d="M8.37515 6.52058C8.21577 6.19319 8.04803 6.18659 7.89646 6.18084C7.77235 6.17591 7.63046 6.17628 7.48871 6.17628C7.34683 6.17628 7.1163 6.2256 6.92145 6.42224C6.72639 6.61905 6.17676 7.09468 6.17676 8.06204C6.17676 9.0294 6.93915 9.96434 7.04543 10.0957C7.15184 10.2267 8.51724 12.2754 10.6797 13.0635C12.4769 13.7185 12.8426 13.5883 13.2327 13.5554C13.6228 13.5227 14.4914 13.0799 14.6687 12.6208C14.846 12.1617 14.846 11.7682 14.7928 11.6859C14.7397 11.604 14.5978 11.5548 14.385 11.4565C14.1723 11.3582 13.1262 10.8825 12.9313 10.8169C12.7362 10.7513 12.5944 10.7186 12.4525 10.9155C12.3106 11.112 11.9032 11.5548 11.779 11.6859C11.655 11.8174 11.5308 11.8337 11.3181 11.7354C11.1052 11.6367 10.42 11.4294 9.60715 10.7596C8.97468 10.2384 8.5477 9.59478 8.42358 9.39791C8.29947 9.20133 8.41029 9.09478 8.51697 8.9968C8.61256 8.9087 8.72979 8.7672 8.83627 8.65243C8.94235 8.5376 8.97776 8.45567 9.0487 8.32454C9.11971 8.19329 9.08417 8.07846 9.03106 7.98011C8.97776 7.88176 8.56433 6.90934 8.37515 6.52058Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <filter id="filter0_d_4653_760" x="0.185547" y="0.270508" width="20.5439" height="20.54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <filter id="filter1_d_4653_760" x="0.470703" y="0.470703" width="20.0586" height="20.0586" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <linearGradient id="paint0_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#1FAF38" />
                                                                                    <stop offset="1" stop-color="#60D669" />
                                                                                </linearGradient>
                                                                                <linearGradient id="paint1_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#F9F9F9" />
                                                                                    <stop offset="1" stop-color="white" />
                                                                                </linearGradient>
                                                                                <clipPath id="clip0_4653_760">
                                                                                    <rect width="21" height="21" rx="5" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Whatsapp
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                            <g clipPath="url(#clip0_4653_760)">
                                                                                <g filter="url(#filter0_d_4653_760)">
                                                                                    <mask id="path-2-outside-1_4653_760" maskUnits="userSpaceOnUse" x="1.4707" y="1.4707" width="18" height="18" fill="black">
                                                                                        <rect fill="white" x="1.4707" y="1.4707" width="18" height="18" />
                                                                                        <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" />
                                                                                    </mask>
                                                                                    <path d="M2.53763 10.4278C2.53724 11.83 2.90529 13.1992 3.60513 14.4061L2.4707 18.5295L6.70951 17.4231C7.88191 18.0584 9.1955 18.3914 10.5304 18.3915H10.5339C14.9405 18.3915 18.5276 14.8217 18.5295 10.434C18.5304 8.30789 17.6994 6.3086 16.1896 4.80444C14.6801 3.30041 12.6726 2.47167 10.5335 2.4707C6.12638 2.4707 2.53952 6.04026 2.5377 10.4278" fill="url(#paint0_linear_4653_760)" shape-rendering="crispEdges" />
                                                                                    <path d="M3.60513 14.4061L3.79797 14.4591L3.82021 14.3783L3.77815 14.3058L3.60513 14.4061ZM2.4707 18.5295L2.27787 18.4765L2.18596 18.8106L2.52122 18.723L2.4707 18.5295ZM6.70951 17.4231L6.8048 17.2472L6.73539 17.2096L6.659 17.2296L6.70951 17.4231ZM10.5304 18.3915L10.5303 18.5915H10.5304V18.3915ZM18.5295 10.434L18.7295 10.4341V10.4341L18.5295 10.434ZM16.1896 4.80444L16.0485 4.94612L16.0485 4.94612L16.1896 4.80444ZM10.5335 2.4707L10.5336 2.2707H10.5335V2.4707ZM2.33763 10.4277C2.33723 11.8651 2.71454 13.269 3.43212 14.5064L3.77815 14.3058C3.09604 13.1295 2.73725 11.7949 2.73763 10.4278L2.33763 10.4277ZM3.4123 14.353L2.27787 18.4765L2.66354 18.5826L3.79797 14.4591L3.4123 14.353ZM2.52122 18.723L6.76002 17.6166L6.659 17.2296L2.42019 18.336L2.52122 18.723ZM6.61422 17.5989C7.81591 18.2502 9.16224 18.5914 10.5303 18.5915L10.5304 18.1915C9.22875 18.1914 7.94792 17.8667 6.8048 17.2472L6.61422 17.5989ZM10.5304 18.5915H10.5339V18.1915H10.5304V18.5915ZM10.5339 18.5915C15.0501 18.5915 18.7276 14.9331 18.7295 10.4341L18.3295 10.4339C18.3277 14.7104 14.8309 18.1915 10.5339 18.1915V18.5915ZM18.7295 10.4341C18.7304 8.25463 17.8781 6.20436 16.3308 4.66275L16.0485 4.94612C17.5207 6.41283 18.3303 8.36115 18.3295 10.434L18.7295 10.4341ZM16.3308 4.66276C14.7837 3.12127 12.7254 2.2717 10.5336 2.2707L10.5335 2.6707C12.6198 2.67165 14.5766 3.47955 16.0485 4.94612L16.3308 4.66276ZM10.5335 2.2707C6.01679 2.2707 2.33956 5.92892 2.3377 10.4277L2.7377 10.4278C2.73947 6.15161 6.23596 2.6707 10.5335 2.6707V2.2707Z" fill="black" fill-opacity="0.2" mask="url(#path-2-outside-1_4653_760)" />
                                                                                </g>
                                                                                <g filter="url(#filter1_d_4653_760)">
                                                                                    <path d="M2.53782 10.4278C2.53738 11.8303 2.90542 13.1994 3.60511 14.4061L2.4707 18.5295L6.70942 17.4231C7.87732 18.057 9.19226 18.3913 10.5303 18.3918H10.5337C14.9404 18.3918 18.5276 14.8216 18.5295 10.4342C18.5303 8.3079 17.6992 6.30844 16.1897 4.80433C14.68 3.30041 12.6726 2.47158 10.5337 2.4707C6.12634 2.4707 2.53958 6.04034 2.53782 10.4278ZM5.06213 14.1983L4.90387 13.9482C4.23855 12.895 3.88739 11.678 3.88789 10.4283C3.88927 6.78156 6.87044 3.81463 10.5362 3.81463C12.3115 3.81538 13.9799 4.50432 15.2347 5.75432C16.4895 7.00445 17.18 8.66624 17.1795 10.4337C17.1779 14.0805 14.1967 17.0478 10.5337 17.0478H10.5311C9.33842 17.0472 8.1687 16.7283 7.14859 16.1257L6.90582 15.9824L4.39049 16.6389L5.06213 14.1983Z" fill="url(#paint1_linear_4653_760)" />
                                                                                </g>
                                                                                <path d="M8.37515 6.52058C8.21577 6.19319 8.04803 6.18659 7.89646 6.18084C7.77235 6.17591 7.63046 6.17628 7.48871 6.17628C7.34683 6.17628 7.1163 6.2256 6.92145 6.42224C6.72639 6.61905 6.17676 7.09468 6.17676 8.06204C6.17676 9.0294 6.93915 9.96434 7.04543 10.0957C7.15184 10.2267 8.51724 12.2754 10.6797 13.0635C12.4769 13.7185 12.8426 13.5883 13.2327 13.5554C13.6228 13.5227 14.4914 13.0799 14.6687 12.6208C14.846 12.1617 14.846 11.7682 14.7928 11.6859C14.7397 11.604 14.5978 11.5548 14.385 11.4565C14.1723 11.3582 13.1262 10.8825 12.9313 10.8169C12.7362 10.7513 12.5944 10.7186 12.4525 10.9155C12.3106 11.112 11.9032 11.5548 11.779 11.6859C11.655 11.8174 11.5308 11.8337 11.3181 11.7354C11.1052 11.6367 10.42 11.4294 9.60715 10.7596C8.97468 10.2384 8.5477 9.59478 8.42358 9.39791C8.29947 9.20133 8.41029 9.09478 8.51697 8.9968C8.61256 8.9087 8.72979 8.7672 8.83627 8.65243C8.94235 8.5376 8.97776 8.45567 9.0487 8.32454C9.11971 8.19329 9.08417 8.07846 9.03106 7.98011C8.97776 7.88176 8.56433 6.90934 8.37515 6.52058Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <filter id="filter0_d_4653_760" x="0.185547" y="0.270508" width="20.5439" height="20.54" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <filter id="filter1_d_4653_760" x="0.470703" y="0.470703" width="20.0586" height="20.0586" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                    <feOffset />
                                                                                    <feGaussianBlur stdDeviation="1" />
                                                                                    <feComposite in2="hardAlpha" operator="out" />
                                                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4653_760" />
                                                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4653_760" result="shape" />
                                                                                </filter>
                                                                                <linearGradient id="paint0_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#1FAF38" />
                                                                                    <stop offset="1" stop-color="#60D669" />
                                                                                </linearGradient>
                                                                                <linearGradient id="paint1_linear_4653_760" x1="805.412" y1="1608.35" x2="805.412" y2="2.4707" gradientUnits="userSpaceOnUse">
                                                                                    <stop stop-color="#F9F9F9" />
                                                                                    <stop offset="1" stop-color="white" />
                                                                                </linearGradient>
                                                                                <clipPath id="clip0_4653_760">
                                                                                    <rect width="21" height="21" rx="5" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Whatsapp
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="instant-chat-area-main">
                                                        <div className="instant-chat-search-area">
                                                            <input type="text" placeholder='Search' />
                                                        </div>
                                                        <div className='chat-area-wrapper'>
                                                            <div className="chat-dropdown-filter-area">
                                                                <div className="socialplatform-dropdown">

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
        </>

    )

})

export default ProfilePage;
{/* <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                                            <g clipPath="url(#clip0_4653_199)">
                                                                                <path d="M11.4844 0H3.51562C1.574 0 0 1.574 0 3.51562V11.4844C0 13.426 1.574 15 3.51562 15H11.4844C13.426 15 15 13.426 15 11.4844V3.51562C15 1.574 13.426 0 11.4844 0Z" fill="url(#paint0_radial_4653_199)" />
                                                                                <path d="M11.4844 0H3.51562C1.574 0 0 1.574 0 3.51562V11.4844C0 13.426 1.574 15 3.51562 15H11.4844C13.426 15 15 13.426 15 11.4844V3.51562C15 1.574 13.426 0 11.4844 0Z" fill="url(#paint1_radial_4653_199)" />
                                                                                <path d="M7.50053 1.64062C5.90924 1.64062 5.70949 1.6476 5.08453 1.67602C4.46074 1.70461 4.03494 1.80334 3.6624 1.94824C3.27697 2.09789 2.95008 2.29811 2.62441 2.62389C2.29846 2.94961 2.09824 3.2765 1.94813 3.66176C1.80281 4.03441 1.70396 4.46039 1.6759 5.08389C1.64795 5.70891 1.64062 5.90871 1.64062 7.50006C1.64062 9.09141 1.64766 9.29051 1.67602 9.91547C1.70473 10.5393 1.80346 10.9651 1.94824 11.3376C2.09801 11.723 2.29822 12.0499 2.624 12.3756C2.94961 12.7015 3.2765 12.9022 3.66164 13.0519C4.03447 13.1968 4.46033 13.2955 5.084 13.3241C5.70902 13.3525 5.90859 13.3595 7.49982 13.3595C9.09129 13.3595 9.29039 13.3525 9.91535 13.3241C10.5391 13.2955 10.9654 13.1968 11.3382 13.0519C11.7235 12.9022 12.0499 12.7015 12.3755 12.3756C12.7014 12.0499 12.9016 11.723 13.0518 11.3378C13.1958 10.9651 13.2947 10.5391 13.324 9.91559C13.3521 9.29062 13.3594 9.09141 13.3594 7.50006C13.3594 5.90871 13.3521 5.70902 13.324 5.084C13.2947 4.46021 13.1958 4.03447 13.0518 3.66193C12.9016 3.2765 12.7014 2.94961 12.3755 2.62389C12.0496 2.29799 11.7236 2.09777 11.3379 1.9483C10.9644 1.80334 10.5383 1.70455 9.91453 1.67602C9.28951 1.6476 9.09053 1.64062 7.49871 1.64062H7.50053ZM6.97488 2.69654C7.13092 2.69631 7.305 2.69654 7.50053 2.69654C9.06504 2.69654 9.25043 2.70217 9.86824 2.73023C10.4395 2.75637 10.7496 2.85182 10.9562 2.93203C11.2296 3.0382 11.4246 3.16518 11.6295 3.37031C11.8346 3.57539 11.9615 3.77068 12.068 4.04414C12.1482 4.25039 12.2438 4.56047 12.2698 5.13176C12.2978 5.74945 12.3039 5.93496 12.3039 7.49871C12.3039 9.06246 12.2978 9.24803 12.2698 9.86566C12.2436 10.437 12.1482 10.747 12.068 10.9533C11.9618 11.2268 11.8346 11.4215 11.6295 11.6265C11.4244 11.8315 11.2297 11.9585 10.9562 12.0647C10.7498 12.1453 10.4395 12.2405 9.86824 12.2666C9.25055 12.2947 9.06504 12.3008 7.50053 12.3008C5.93596 12.3008 5.75051 12.2947 5.13287 12.2666C4.56158 12.2402 4.2515 12.1448 4.04479 12.0646C3.77139 11.9583 3.57604 11.8314 3.37096 11.6263C3.16588 11.4213 3.03896 11.2264 2.9325 10.9529C2.85229 10.7466 2.75672 10.4365 2.7307 9.86519C2.70264 9.2475 2.69701 9.06199 2.69701 7.49725C2.69701 5.9325 2.70264 5.74799 2.7307 5.13029C2.75684 4.559 2.85229 4.24893 2.9325 4.04238C3.03873 3.76893 3.16588 3.57363 3.37102 3.36855C3.57615 3.16348 3.77139 3.0365 4.04484 2.9301C4.25139 2.84953 4.56158 2.75432 5.13287 2.72807C5.6734 2.70363 5.88287 2.69631 6.97488 2.69508V2.69654ZM10.6283 3.66943C10.2401 3.66943 9.92514 3.98408 9.92514 4.37232C9.92514 4.76051 10.2401 5.07545 10.6283 5.07545C11.0164 5.07545 11.3314 4.76051 11.3314 4.37232C11.3314 3.98414 11.0164 3.6692 10.6283 3.6692V3.66943ZM7.50053 4.49098C5.83881 4.49098 4.4915 5.83828 4.4915 7.50006C4.4915 9.16184 5.83881 10.5085 7.50053 10.5085C9.1623 10.5085 10.5091 9.16184 10.5091 7.50006C10.5091 5.83834 9.16219 4.49098 7.50041 4.49098H7.50053ZM7.50053 5.54689C8.57918 5.54689 9.45369 6.42129 9.45369 7.50006C9.45369 8.57871 8.57918 9.45322 7.50053 9.45322C6.42188 9.45322 5.54742 8.57871 5.54742 7.50006C5.54742 6.42129 6.42182 5.54689 7.50053 5.54689Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <radialGradient id="paint0_radial_4653_199" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.98437 16.1553) rotate(-90) scale(14.8661 13.8267)">
                                                                                    <stop stop-color="#FFDD55" />
                                                                                    <stop offset="0.1" stop-color="#FFDD55" />
                                                                                    <stop offset="0.5" stop-color="#FF543E" />
                                                                                    <stop offset="1" stop-color="#C837AB" />
                                                                                </radialGradient>
                                                                                <radialGradient id="paint1_radial_4653_199" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-2.51256 1.08053) rotate(78.681) scale(6.64523 27.3919)">
                                                                                    <stop stop-color="#3771C8" />
                                                                                    <stop offset="0.128" stop-color="#3771C8" />
                                                                                    <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
                                                                                </radialGradient>
                                                                                <clipPath id="clip0_4653_199">
                                                                                    <rect width="15" height="15" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Instagram
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 17 17" fill="none">
                                                                            <g clipPath="url(#clip0_4653_207)">
                                                                                <path d="M15.4927 0.641602H1.50887C1.02989 0.641602 0.641602 1.02989 0.641602 1.50887V15.4927C0.641602 15.9717 1.02989 16.36 1.50887 16.36H15.4927C15.9717 16.36 16.36 15.9717 16.36 15.4927V1.50887C16.36 1.02989 15.9717 0.641602 15.4927 0.641602Z" fill="#3D5A98" />
                                                                                <path d="M11.4853 16.3585V10.2717H13.528L13.8334 7.89971H11.4853V6.38565C11.4853 5.69901 11.6766 5.23018 12.6607 5.23018H13.9171V3.10518C13.3087 3.04189 12.6973 3.01174 12.0856 3.01487C10.2767 3.01487 9.03094 4.11721 9.03094 6.15057V7.89971H6.98828V10.2717H9.03094V16.3585H11.4853Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <clipPath id="clip0_4653_207">
                                                                                    <rect width={17} height={17} fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>

                                                                    </span>
                                                                    Facebook
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div>
                                                        <div className='social-content-item-main'>
                                                            <div className='social-meadia-content-item'>
                                                                <span className="social-tag-main">
                                                                    <span className='social-tag-icon'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                            <g clipPath="url(#clip0_4653_207)">
                                                                                <path d="M15.4927 0.641602H1.50887C1.02989 0.641602 0.641602 1.02989 0.641602 1.50887V15.4927C0.641602 15.9717 1.02989 16.36 1.50887 16.36H15.4927C15.9717 16.36 16.36 15.9717 16.36 15.4927V1.50887C16.36 1.02989 15.9717 0.641602 15.4927 0.641602Z" fill="#3D5A98" />
                                                                                <path d="M11.4853 16.3585V10.2717H13.528L13.8334 7.89971H11.4853V6.38565C11.4853 5.69901 11.6766 5.23018 12.6607 5.23018H13.9171V3.10518C13.3087 3.04189 12.6973 3.01174 12.0856 3.01487C10.2767 3.01487 9.03094 4.11721 9.03094 6.15057V7.89971H6.98828V10.2717H9.03094V16.3585H11.4853Z" fill="white" />
                                                                            </g>
                                                                            <defs>
                                                                                <clipPath id="clip0_4653_207">
                                                                                    <rect width="17" height="17" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span>
                                                                    Facebook
                                                                </span>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Profile:</span>
                                                                <p>100000517484267</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Bio:</span>
                                                                <p>Sed ut perspiciatis unde omnis </p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Status:</span>
                                                                <p>Active</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Last active:</span>
                                                                <p>8:30am, Today</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>private account:</span>
                                                                <p>Yes</p>
                                                            </div>
                                                            <div className='social-media-content-item'>
                                                                <span>Groups:</span>

                                                            </div>
                                                        </div> */}