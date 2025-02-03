import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LightBOxForMedia from "@/components/LightBoxForMedia";
import $ from "jquery";
const ProfilePicturesComponent = ({ images }) => {
    const mainSliderRef = useRef(null);
    const thumbSliderRef = useRef(null);
    const [mainSlider, setMainSlider] = useState(null);
    const [thumbSlider, setThumbSlider] = useState(null);
    const [mediaIdForLightbox, setMediaIdForLightbox] = useState(null)

    useEffect(() => {
        setMainSlider(mainSliderRef.current);
        setThumbSlider(thumbSliderRef.current);
    }, []);

    // Main slider settings
    const mainSliderSettings = {
        asNavFor: thumbSlider,
        ref: mainSliderRef,
        arrows: false,
        infinite: false,
        fade: true,
        speed: 500,
        centerMode: true,
        centerPadding: "2px",
    };

    // Thumbnail slider settings
    const thumbSliderSettings = {
        asNavFor: mainSlider,
        ref: thumbSliderRef,
        slidesToShow: 4,
        swipeToSlide: false,
        focusOnSelect: true,
        // centerMode: true,
        // centerPadding: "10px",
        arrows: false,
        infinite: false,
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
    // console.log(images, "images");

    return (
        <>
            {
                images && images?.length === 0 ? (
                    <>
                        <div className="profile-pictures-slick-container d-flex align-items-center justify-content-center" style={{ height: "510px" }}>
                            <div className="profiler-slick-main ">
                                <p className="text-white text-center">No Images Available</p>
                            </div>
                        </div >
                    </>
                )
                    :
                    (

                        <>
                            <div className="profile-pictures-slick-container">
                                {/* Main Slider */}
                                <Slider {...mainSliderSettings}>
                                    {images?.map((image, index) => (
                                        <div key={index} className="profiler-slick-main">
                                            <img
                                                src={image?.file_url}
                                                alt={`Slide ${index + 1}`}
                                                style={{ width: "100%", borderRadius: "8px" }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                                <div className="fullscreen-icon" id={`media-${Date.now()}`} onClick={openLightbox}>
                                    <svg className="fullscreen-icon-svg" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 21V15H5V17.6L8.1 14.5L9.5 15.9L6.4 19H9V21H3ZM15.9 9.5L14.5 8.1L17.6 5H15V3H21V9H19V6.4L15.9 9.5Z" fill="#108DE5" />
                                    </svg>
                                </div>
                                {/* Thumbnail Slider */}
                                <div className="nav-slider">
                                    <Slider {...thumbSliderSettings}>
                                        {images?.map((image, index) => (
                                            <div className="profiler-slick-nav" key={index}>
                                                <img
                                                    src={image?.file_url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                            <div id="overlay-lightbox" className="overlay_of_join">
                                <LightBOxForMedia mediaArr={images} mediaIdForLightbox={mediaIdForLightbox} />
                            </div>
                        </>
                    )
            }

        </>


    );
};

export default ProfilePicturesComponent;
