import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import ReactPlayer from "react-player";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { video_icon_path, audio_icon_path, pdf_icon_path } from "@/constants";
import $ from "jquery";

const LightBoxForMedia = ({ mediaArr, mediaIdForLightbox }) => {
    if (!mediaArr) return null;

    const finalMediaArr = [...mediaArr];
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mainSwiper, setMainSwiper] = useState(null);
    const [autoplay, setAutoplay] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const playerRef = useRef(null);
    const lightboxRef = useRef(null);

    const mediaIndex = mediaArr.findIndex((media) => media?.id == mediaIdForLightbox);

    useEffect(() => {
        function handleClickOutside(event) {
            if (lightboxRef.current && !lightboxRef.current.contains(event.target)) {
                $("#overlay-lightbox, #lightBox-popup").hide();
                if (playerRef.current) {
                    playerRef.current.seekTo(0);
                    playerRef.current.getInternalPlayer().pause();
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        if (mainSwiper && mediaIndex !== -1) {
            mainSwiper.slideTo(mediaIndex); // Update to selected media
        }
    }, [mediaIndex, mainSwiper]);
    const handleSlideChange = () => {
        // Pause any active media
        const allPlayers = document.querySelectorAll("video, audio");
        allPlayers.forEach((player) => {
            player.pause(); // Pause all media elements
            player.currentTime = 0; // Reset media to start
        });
    
        // Reset the ReactPlayer instance
        if (playerRef.current) {
            try {
                playerRef.current.seekTo(0);
                playerRef.current.getInternalPlayer()?.pause?.();
                setAutoplay(false);
            } catch (error) {
                console.error("Error pausing media:", error);
            }
        }
    };
    
    const closeLightbox = () => {
        $("#overlay-lightbox, #lightBox-popup").hide();
        if (playerRef.current) {
            playerRef.current.seekTo(0);
            playerRef.current.getInternalPlayer().pause();
        }
    };
    console.log(mediaArr, "mediaArr");
    // console.log(mediaIdForLightbox, "mediaIdForLightbox");
    // console.log(mediaIndex, "mediaIndex");
    return (
        <div id="lightBox-popup" className="join_popup_modal lightbox_join_popup_modal" ref={lightboxRef}>
            <div className="popup-body" style={{ zIndex: "9999999" }}>
                <button className="close-button" onClick={closeLightbox}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14px"
                        height="14px"
                        viewBox="0 0 15 15"
                    >
                        <path
                            fill="#fff"
                            d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"
                        ></path>
                    </svg>
                </button>

                {/* Main Swiper */}
                <Swiper
                    spaceBetween={10}
                    navigation={false}
                    onSlideChange={handleSlideChange} 
                    thumbs={{ swiper: thumbsSwiper }}
                    onSwiper={setMainSwiper}  // Get Swiper instance
                    modules={[Navigation, Thumbs]}
                    className="main-swiper"
                >
                    {finalMediaArr.map((media, index) => (
                        <SwiperSlide key={index} className="lightbox-media-gallery-card">
                            {media?.message_media?.media_type?.startsWith("video") ? (
                                // <ReactPlayer
                                //     ref={playerRef}
                                //     url={media?.message_media?.media_url}
                                //     width="100%"
                                //     height="510px"
                                //     playing={autoplay}
                                //     onPlay={() => setAutoplay(true)}
                                //     onPause={() => setAutoplay(false)}
                                //     controls
                                //     muted
                                // />
                                <div style={{ position: "relative" }}>
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={media?.message_media?.media_url}
                                        width="100%"
                                        height="510px"
                                        playing={autoplay}
                                        onPlay={() => setAutoplay(true)}
                                        onPause={() => setAutoplay(false)}
                                        // onBuffer={() => setIsBuffering(true)} // Start loader on buffering
                                        // onBufferEnd={() => setIsBuffering(false)} // Hide loader when done
                                        controls
                                        muted
                                    />
                                </div>
                            ) : media?.message_media?.media_type == "unknown" || media?.message_media?.media_type?.startsWith("audio") ? (
                                // <ReactPlayer
                                //     ref={playerRef}
                                //     url={media?.message_media?.media_url}
                                //     width="100%"
                                //     height="510px"
                                //     playing={autoplay}
                                //     onPlay={() => setAutoplay(true)}
                                //     onPause={() => setAutoplay(false)}
                                //     controls
                                //     muted
                                // />
                                <div style={{ position: "relative" }}>
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={media?.message_media?.media_url}
                                        width="100%"
                                        height="510px"
                                        playing={autoplay}
                                        onPlay={() => setAutoplay(true)}
                                        onPause={() => setAutoplay(false)}
                                        // onBuffer={() => setIsBuffering(true)} // Start loader on buffering
                                        // onBufferEnd={() => setIsBuffering(false)} // Hide loader when done
                                        controls
                                        muted
                                    />
                                </div>
                            ) : media?.message_media?.media_type?.startsWith("application") ? (
                                // <img src={pdf_icon_path} alt="PDF Thumbnail" className="img-fluid" />
                                <button
                                    onClick={() => {
                                        const pdfUrl = media?.message_media?.media_url;
                                        window.open(pdfUrl, "_blank");
                                    }}
                                    className="pdf-preview-button w-100"
                                >
                                    <img src={pdf_icon_path} alt="PDF Thumbnail" className="img-fluid" style={{'width':'100% !important'}} />
                                    <p className="text-black">Click to download PDF</p>
                                </button>
                                
                            ) : (
                                <img src={media?.message_media?.media_url || media?.file_url || media} alt="Image Thumbnail" className="img-fluid" />
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Thumbnail Swiper */}
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={5}
                    watchSlidesProgress
                    className="thumbnail-swiper"
                >
                    {finalMediaArr.map((eachMediaObj, eachMediaObjIndex) => (
                        <SwiperSlide key={eachMediaObjIndex} className="lightbox-media-gallery-card">
                            {eachMediaObj?.message_media?.media_type?.split("/")[0] ===
                                "video" ? (
                                <img
                                    src={`${video_icon_path ||
                                        eachMediaObj?.message_media?.thumbnail_url
                                        }`}
                                    alt="Audio Thumbnail"
                                    className="img-fluid"
                                />
                            ) : eachMediaObj?.message_media?.media_type?.split("/")[0] == "audio" ? (
                                <img
                                    src={`${audio_icon_path}`}
                                    alt="Audio Thumbnail"
                                    className="img-fluid bg-white"
                                />
                            ) : eachMediaObj?.message_media?.media_type?.split("/")[0] ==
                                "application" ||
                                eachMediaObj?.message_media?.media_type?.split("/")[0] ==
                                "pdf" ? (
                                <img
                                    src={`${pdf_icon_path}`}
                                    alt="PDF Thumbnail"
                                    className="img-fluid"
                                />
                            ) : eachMediaObj?.message_media?.media_type?.split("/")[0] ==
                                "image" ||
                                eachMediaObj?.file_type?.split("/")[0] == "image" ? (
                                <img
                                    src={`${eachMediaObj?.message_media?.media_url ||
                                        eachMediaObj?.file_url ||
                                        eachMediaObj
                                        }`}
                                    alt="Image Thumbnail"
                                    className="img-fluid"
                                />
                            ) : 
                            (
                                <img src={eachMediaObj?.message_media?.media_url || eachMediaObj?.file_url || eachMediaObj} alt="Image Thumbnail" className="img-fluid" />
                            )
                            }
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default LightBoxForMedia;
