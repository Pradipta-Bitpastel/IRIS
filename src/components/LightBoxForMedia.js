import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { video_icon_path, audio_icon_path, pdf_icon_path } from "@/constants";
import $, { each } from "jquery";

const CustomPaging = ({ finalMediaArr, currentSlide }) => {
  const renderThumbnails = () => {
    const thumbnails = [];

    for (let i = 0; i < finalMediaArr.length; i += 3) {
      const startIndex = i;
      const endIndex = Math.min(i + 2, finalMediaArr.length - 1);

      const thumbnailGroup = finalMediaArr.slice(startIndex, endIndex + 1);

      thumbnails.push(
        <div key={i} className="thumbnail-group">
          {thumbnailGroup.map((media, index) => (
            <div
              key={index}
              className={`thumbnail ${currentSlide >= startIndex && currentSlide <= endIndex
                ? "selected"
                : ""
                }`}
            >
              <img
                src={`/${mediaPath}/${media.thumbnail_img}`}
                alt={`Thumbnail ${index + 1}`}
                className="img-fluid"
              />
            </div>
          ))}
        </div>
      );
    }

    return thumbnails;
  };

  return <div className="custom-paging">{renderThumbnails()}</div>;
};

const LightBOxForMedia = ({ mediaArr, mediaIdForLightbox }) => {
  if(!mediaArr) return null

  const finalMediaArr = [...mediaArr]
  const focus = useRef();
  // const media_path = mediaPath;
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const [autoplay, setAutoplay] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (focus.current && !focus.current.contains(event.target)) {
        $("#overlay-lightbox").css("display", "none");
        $("#lightBox-popup").css("display", "none");
        // $(".search_group_details_main_card_body .search_group_details_inner_card.relative_pos ").attr("style", "");

        if (playerRef.current) {
          playerRef.current.seekTo(0); // Reset video to start (optional)
          playerRef.current.getInternalPlayer().pause(); // Pause the video/audio
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [focus]);

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   afterChange: (index) => setCurrentSlide(index),
  // };

  useEffect(() => {
    const mediaIdIndex = finalMediaArr.findIndex((mediaItem) => mediaItem?.id == mediaIdForLightbox)

    // console.log(mediaIdIndex, "mediaIdIndexx")
    slider2Ref.current.slickGoTo(mediaIdIndex);
    slider1Ref.current.slickGoTo(mediaIdIndex);
  }, [mediaIdForLightbox])
  const slider1Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad:'progressive',
    // initialSlide:mediaPath,
    arrows: false,
    // initialSlide:mediaIdForLightbox,
    // centerMode: true,
    // asNavFor: slider2Ref.current,
    // beforeChange: (current, next) => {
    //   slider2Ref.current.slickGoTo(next);
    // },
    // beforeChange: (_, next) => {
    //   // Pause video when changing slide
    //   setAutoplay(false);
    // },
  };

  const slider2Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: false,
    arrows: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    useTransform:false,
    // lazyLoad:'progressive',
    asNavFor: slider1Ref.current, // Assumes slider1Ref is properly set up
    beforeChange: (current, next) => {
      slider1Ref.current.slickGoTo(next);
    },
    focusOnSelect: true,
    centerMode: true, // This ensures the slides are centered
    centerPadding: '0', // Optional: Adjust this to control the gap between slides
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          centerMode: true, // Center the slides in smaller screens
          centerPadding: '0',
        }
      }
    ]
  };


  const closeLightbox = () => {
    $("#overlay-lightbox").css("display", "none");
    $("#lightBox-popup").css("display", "none");
    if (playerRef.current) {
      playerRef.current.seekTo(0); // Reset video to start (optional)
      playerRef.current.getInternalPlayer().pause(); // Pause the video/audio
    }
  };

  // console.log(finalMediaArr, "finalMediaArr");

  return (
    <>
      <div id="lightBox-popup" className="join_popup_modal lightbox_join_popup_modal" ref={focus}>
        <div className="popup-body" style={{ zIndex: "9999999" }}>
          {/* {console.log(mediaIdForLightbox, "media iddd")} */}
          {/* <CustomPaging finalMediaArr={finalMediaArr} currentSlide={currentSlide} /> */}
          <button
            className="close-button"
            onClick={closeLightbox}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 15 15"><path fill="#fff" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"></path></svg>
          </button>
          <Slider {...slider1Settings} ref={slider1Ref} className="slider1">
            {
              finalMediaArr.map((eachMediaObj, eachMediaObjIndex) => {
                // console.log(eachMediaObj?.message_media?.media_type)
                return (

                  <div key={eachMediaObjIndex} className="lightbox-media-gallery-card">
                    {
                      eachMediaObj?.message_media?.media_type?.split('/')[0] == "video" ? (
                        <ReactPlayer
                          ref={playerRef}
                          url={eachMediaObj?.message_media?.media_url}
                          width="100%"
                          height="430px"
                          style={{
                            zIndex: 15,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            position: 'relative',
                          }}
                          playing={autoplay}
                          // onStart={() => setAutoplay(true)}
                          onPlay={() => setAutoplay(true)}
                          onPause={() => setAutoplay(false)}
                          controls={true}
                          muted={true}
                        />
                      ) : eachMediaObj?.message_media?.media_type?.split('/')[0] == "audio" ? (
                        <img
                          src={`${audio_icon_path}`}
                          // fill={true}
                          className="img-fluid"
                          id={`id-${eachMediaObj?.id}`}
                        />
                      ) : eachMediaObj?.message_media?.media_type?.split('/')[0] == "document" || eachMediaObj?.message_media?.media_type?.split('/')[0] == "pdf" ? (
                        <img
                          src={`${pdf_icon_path}`}

                          alt="PDF Thumbnail"
                          className="img-fluid"
                        />
                      ) : eachMediaObj?.message_media?.media_type?.split('/')[0] == "image" || eachMediaObj?.file_type?.split('/')[0] == "image" ? (
                        <img
                          src={eachMediaObj?.message_media?.media_url || eachMediaObj?.file_url}
                          alt="Image Thumbnail"
                          className="img-fluid"
                        />
                      ) : null

                    }
                  </div>
                )
              })
            }
          </Slider>
          <Slider {...slider2Settings} ref={slider2Ref} className="slider2">
            {finalMediaArr.map((eachMediaObj, eachMediaObjIndex) => (
              <div key={eachMediaObjIndex} className="lightbox-media-gallery-card">
                {eachMediaObj?.message_media?.media_type?.split('/')[0] === "video" ? (
                  <img
                    src={`${video_icon_path || eachMediaObj?.message_media?.thumbnail_url }`}
                    alt="Audio Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj?.message_media?.media_type?.split('/')[0] === "audio" ? (
                  <img
                    src={`${audio_icon_path}`}
                    alt="Audio Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj?.message_media?.media_type?.split('/')[0] == "document" || eachMediaObj?.message_media?.media_type?.split('/')[0] == "pdf" ? (
                  <img
                    src={`${pdf_icon_path}`}
                    alt="PDF Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj?.message_media?.media_type?.split('/')[0] == "image" || eachMediaObj?.file_type?.split('/')[0] == "image" ? (
                  <img
                    src={`${eachMediaObj?.message_media?.media_url || eachMediaObj?.file_url}`}
                    alt="Image Thumbnail"
                    className="img-fluid"
                  />
                ) : null}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default LightBOxForMedia;
