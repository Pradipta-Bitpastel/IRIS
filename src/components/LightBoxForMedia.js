import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { video_icon_path,audio_icon_path,pdf_icon_path } from "@/constants";
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
              className={`thumbnail ${
                currentSlide >= startIndex && currentSlide <= endIndex
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

const LightBOxForMedia = ({ mediaArr,mediaIdForLightbox }) => {
  const finalMediaArr=[...mediaArr]
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

useEffect(()=>{
const mediaIdIndex=finalMediaArr.findIndex((mediaItem)=>mediaItem?.id==mediaIdForLightbox)

console.log(mediaIdIndex,"mediaIdIndexx")
  slider2Ref.current.slickGoTo(mediaIdIndex);

},[mediaIdForLightbox])
  const slider1Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // initialSlide:mediaPath,
    arrows: false,
    // initialSlide:mediaIdForLightbox,
    // centerMode: true,
    // asNavFor: slider2Ref.current,
    // beforeChange: (current, next) => {
    //   slider2Ref.current.slickGoTo(next);
    // },
    beforeChange: (_, next) => {
      // Pause video when changing slide
      setAutoplay(false);
    },
  };

  const slider2Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    asNavFor: slider1Ref.current,
    // initialSlide:mediaIdForLightbox,
    beforeChange: (current, next) => {
      slider1Ref.current.slickGoTo(next);
    },
    focusOnSelect: true,


    responsive: [
  
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  };


  return (
    <>
      <div id="lightBox-popup" className="join_popup_modal lightbox_join_popup_modal" ref={focus}>
        <div className="popup-body">
          {console.log(mediaIdForLightbox,"media iddd")}
          {/* <CustomPaging finalMediaArr={finalMediaArr} currentSlide={currentSlide} /> */}
          <Slider {...slider1Settings} ref={slider1Ref} className="slider1">
            {finalMediaArr.map((eachMediaObj, eachMediaObjIndex) => (
              <div key={eachMediaObjIndex} className="lightbox-media-gallery-card">
                {eachMediaObj["media_type"] === "video" ? (
                  <ReactPlayer
                  ref={playerRef}
                    url={eachMediaObj?.media_url}
                    width="100%"
                    height="430px"
                    max-width="435px"
                    playing={autoplay}
                    onPlay={() => setAutoplay(true)}
            onPause={() => setAutoplay(false)}
                 
                    controls
                  />
                ) : eachMediaObj["media_type"] === "audio" ? (
                  <img
                  src={`${audio_icon_path}`}
                  // fill={true}
                  className="img-fluid"
                  id={`id-${eachMediaObj?.id}`}
                  />
                ) : eachMediaObj["media_type"] == "document" || eachMediaObj["media_type"] === "pdf" ? (
                  <img
                  src={`${pdf_icon_path}`}

                    alt="PDF Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj["media_type"] === "image" ? (
                  <img
                    src={eachMediaObj?.media_url}
                    alt="Image Thumbnail"
                    className="img-fluid"
                  />
                ) : null}
              </div>
            ))}
          </Slider>
          <Slider {...slider2Settings} ref={slider2Ref} className="slider2">
            {finalMediaArr.map((eachMediaObj, eachMediaObjIndex) => (
              <div key={eachMediaObjIndex} className="lightbox-media-gallery-card">
                {eachMediaObj["media_type"] === "video" ? (
                
                  <img
                  src={`${video_icon_path}`}
                  alt="Audio Thumbnail"
                  className="img-fluid"
                />
                ) : eachMediaObj["media_type"] === "audio" ? (
                  <img
                  src={`${audio_icon_path}`}
                    alt="Audio Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj["media_type"] == "document" || eachMediaObj["media_type"] === "pdf" ? (
                  <img
                  src={`${pdf_icon_path}`}
                    alt="PDF Thumbnail"
                    className="img-fluid"
                  />
                ) : eachMediaObj["media_type"] === "image" ? (
                  <img
                  src={`${eachMediaObj?.media_url}`}
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
