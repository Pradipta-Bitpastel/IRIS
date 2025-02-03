"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import iris_logo from "@/_assets/images/logo_iris.png";
import iris_white_logo from "@/_assets/images/white-logo.png";
import $ from "jquery";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import profile_icon from "@/_assets/images/profile_icon.jpg";
import "@/_assets/style/style.css";
const LeftPanel = () => {
  const router = useRouter()
  const focus = useRef()

  const expandMenu = (e) => {
    $(".left_sidebar_nevigation li span").addClass("d-block");
    $(".dashboard_header").addClass("extra_padding");
    $(".dashboard_main").addClass("extra_padding_inner");
    $(".left_sidebar").addClass("expand");
    if ($(".left_sidebar").hasClass("expand")) {
      $(".left_sidebar").animate({ width: "180px", });
      $(".left_sidebar ul li a span").animate({ opacity: "1", }, 1000);
      $("#logo_1").addClass("d-none");
      $("#logo_2").addClass("d-block");
      $("#collapse_bar_svg_1").addClass("d-none");
      $("#collapse_bar_svg_2").addClass("d-block");
    }
  };
  const collapseMenu = (e, widthCollapse) => {
    console.log("collapse menuu", widthCollapse)
    $('.left_sidebar_nevigation li span').removeClass('d-block')
    $('.dashboard_header').removeClass('extra_padding')
    $('.dashboard_main').removeClass('extra_padding_inner')
    $('.left_sidebar').removeClass('expand')

    $('#logo_1').removeClass('d-none')
    $('#logo_2').removeClass('d-block')
    $('#collapse_bar_svg_1').removeClass('d-none')
    $('#collapse_bar_svg_2').removeClass('d-block')
    if (widthCollapse || ($(window).width() < 1024)) {
      console.log("collap[ase maemyy")
      $(".left_sidebar").animate({
        left: '0px',
        width: '0px'
      });

    }
    else {
      console.log("else collap[ase maemyy")
      $(".left_sidebar").animate({
        left: '0px',
        width: '50px',
      });
    }
    $(".left_sidebar ul li a span").animate({
      opacity: '0'
    });
  };
  const logOutFun = (e) => {
    console.log(e.preventDefault())
    window.localStorage.removeItem(`sessionCheck`);
    // window.sessionStorage.removeItem(`userID`);
    router.push(`/`);
  }

  useEffect(() => {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      $('.dashboard_header_wrapper h1').hide()
      $('.hamburger-menu-icon svg').show()
      $(document).mouseup(function (e) {
        console.log("message useEffect")
        if ($(e.target).
          closest(".left_sidebar.expand").
          length === 0) {
          collapseMenu('e', '0px')
        }
      });
    } else {
      $('.dashboard_header_wrapper h1').show()
      $('.hamburger-menu-icon svg').hide()
      $(document).off('mousedown mouseup');
      $(".dashboard_header").removeClass("extra_padding");
      $(".dashboard_main").removeClass("extra_padding_inner");
    }
    $(window).resize(function () {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        // alert('IF 1024')
        $(".left_sidebar").css({ 'width': '0px' });
        $('.dashboard_header_wrapper h1').hide()
        $('.hamburger-menu-icon svg').show()
        $(document).mousedown(function (e) {
          if ($(e.target).
            closest(".left_sidebar.expand").
            length === 0) {
            collapseMenu("e", 0)
          }
        });
      } else {
        $(".left_sidebar").css({ 'width': '50px' });
        $('.dashboard_header_wrapper h1').show()
        $('.hamburger-menu-icon svg').hide()
        $(document).off('mousedown mouseup');
        $(".dashboard_header").removeClass("extra_padding");
        $(".dashboard_main").removeClass("extra_padding_inner");
      }
    });
  }, [])
  // useEffect(() => {
  //   const dashboardHeader = document.querySelector('.dashboard_header_wrapper h1');
  //   const hamburgerMenuIcon = document.querySelector('.hamburger-menu-icon svg');
  //   const leftSidebar = document.querySelector('.left_sidebar');
  //   const dashboardHeaderEl = document.querySelector('.dashboard_header');
  //   const dashboardMainEl = document.querySelector('.dashboard_main');

  //   const collapseMenu = () => {
  //     if (leftSidebar) {
  //       leftSidebar.classList.remove('expand');
  //       leftSidebar.style.width = '0px';
  //     }
  //   };

  //   const handleMouseUp = (e) => {
  //     if (!e.target.closest('.left_sidebar.expand')) {
  //       collapseMenu();
  //     }
  //   };

  //   const handleResize = () => {
  //     if (window.matchMedia("(max-width: 1024px)").matches) {
  //       if (leftSidebar) {
  //         leftSidebar.style.width = '0px';
  //         leftSidebar.classList.remove('expand');
  //         leftSidebar.classList.add('collapsed');
  //       }
  //       if (dashboardHeader) dashboardHeader.style.display = 'none';
  //       if (hamburgerMenuIcon) hamburgerMenuIcon.style.display = 'block';

  //       document.addEventListener('mousedown', handleMouseUp);
  //     } else {
  //       if (leftSidebar) {
  //         leftSidebar.style.width = '50px';
  //         leftSidebar.classList.add('expand');
  //       }
  //       if (dashboardHeader) dashboardHeader.style.display = 'block';
  //       if (hamburgerMenuIcon) hamburgerMenuIcon.style.display = 'none';

  //       document.removeEventListener('mousedown', handleMouseUp);
  //       if (dashboardHeaderEl) dashboardHeaderEl.classList.remove('extra_padding');
  //       if (dashboardMainEl) dashboardMainEl.classList.remove('extra_padding_inner');
  //     }
  //   };

  //   if (window.matchMedia("(max-width: 1024px)").matches) {
  //     if (dashboardHeader) dashboardHeader.style.display = 'none';
  //     if (hamburgerMenuIcon) hamburgerMenuIcon.style.display = 'block';

  //     document.addEventListener('mouseup', handleMouseUp);
  //   } else {
  //     if (dashboardHeader) dashboardHeader.style.display = 'block';
  //     if (hamburgerMenuIcon) hamburgerMenuIcon.style.display = 'none';

  //     document.removeEventListener('mousedown', handleMouseUp);
  //     if (dashboardHeaderEl) dashboardHeaderEl.classList.remove('extra_padding');
  //     if (dashboardMainEl) dashboardMainEl.classList.remove('extra_padding_inner');
  //   }

  //   window.addEventListener('resize', handleResize);

  //   // Cleanup on component unmount
  //   return () => {
  //     document.removeEventListener('mouseup', handleMouseUp);
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      // console.log(event.target.ariaExpanded, 'roleee')
      // console.log(focus.current)
      if (focus.current && !focus.current.contains(event.target)) {
        // console.log(event.target.id, 'roleee111')

        $("#overlay-join-overlay").css("display", "none");
        $("#overlay-join-popup").css("display", "none");
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [focus])
  const pathName = usePathname();

  return (
    <>
      {
        ((pathName.split("/")[1] === "dashboard") || (pathName.split("/")[1] === "search") || (pathName.split("/")[1] === "alertsetting") || (pathName.split("/")[1] === "profiler")) &&
        <section className="common_">
          <section className="left_sidebar">
            {console.log(pathName, "pathnamee")}
            <div className="left_sidebar_logo text-center">
              <Link href={'/dashboard'} prefetch={true}>
                <Image
                  src={iris_white_logo}
                  alt="Iris White Logo"
                  className="img-fluid"
                  id="logo_1"
                />
              </Link>

              <Link href={'/dashboard'}>
                <Image
                  src={iris_logo}
                  alt="Iris Logo"
                  className="img-fluid"
                  id="logo_2"
                />
              </Link>
            </div>

            <div className="left_sidebar_nevigation">
              <ul className="left_sidebar_nevigation_ul">
                <li className={pathName.split("/")[1] === "dashboard" ? "selected" : ""} >
                  <Link href={"/dashboard"} prefetch={true}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M13.45 11.55L15.5 9.5M10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13Z"
                        stroke="#8E9DAD"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.4 20C4.93815 18.8381 3.87391 17.2502 3.35478 15.4565C2.83564 13.6627 2.88732 11.7519 3.50265 9.98881C4.11797 8.22573 5.26647 6.69771 6.78899 5.6165C8.3115 4.53529 10.1326 3.95444 12 3.95444C13.8674 3.95444 15.6885 4.53529 17.211 5.6165C18.7335 6.69771 19.882 8.22573 20.4974 9.98881C21.1127 11.7519 21.1644 13.6627 20.6452 15.4565C20.1261 17.2502 19.0619 18.8381 17.6 20H6.4Z"
                        stroke="#8E9DAD"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className={pathName.split("/")[1] === "search" ? "selected" : ""}>
                  <Link href={"/search"} prefetch={true}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M17.4999 17.5L13.8808 13.8808M13.8808 13.8808C14.4998 13.2617 14.9909 12.5268 15.3259 11.7179C15.661 10.9091 15.8334 10.0422 15.8334 9.16666C15.8334 8.29115 15.661 7.42422 15.326 6.61537C14.9909 5.80651 14.4998 5.07156 13.8808 4.45249C13.2617 3.83342 12.5267 3.34234 11.7179 3.0073C10.909 2.67226 10.0421 2.49982 9.16659 2.49982C8.29109 2.49982 7.42416 2.67226 6.61531 3.0073C5.80645 3.34234 5.0715 3.83342 4.45243 4.45249C3.20215 5.70276 2.49976 7.3985 2.49976 9.16666C2.49976 10.9348 3.20215 12.6305 4.45243 13.8808C5.7027 15.1311 7.39844 15.8335 9.16659 15.8335C10.9347 15.8335 12.6305 15.1311 13.8808 13.8808Z"
                        stroke="#8E9DAD"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Search</span>
                  </Link>
                </li>
                <li className={pathName.split("/")[1] === "alertsetting" ? "selected" : ""}>
                  <Link href={"/alertsetting"} prefetch={true}>
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_4540_78)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 9.74397L15.9995 11.398L16.9245 13.62C16.9471 13.674 16.9648 13.7297 16.9775 13.787L16.9935 13.873L17.0015 14.005C17.0004 14.2257 16.9263 14.4398 16.7908 14.614C16.6554 14.7881 16.4661 14.9126 16.2525 14.968L16.1365 14.995L16.0015 15.005L12.5005 15.004L12.4955 15.165C12.4553 15.7994 12.1749 16.3947 11.7114 16.8298C11.248 17.2648 10.6361 17.507 10.0005 17.507C9.36478 17.507 8.75297 17.2648 8.28948 16.8298C7.826 16.3947 7.54565 15.7994 7.50546 15.165L7.50046 15.004H3.99946C3.91168 15.0041 3.82426 14.9927 3.73946 14.97L3.61546 14.928C3.4136 14.8429 3.24526 14.6939 3.13633 14.5038C3.02739 14.3138 2.98387 14.0932 3.01246 13.876L3.03346 13.748L3.07646 13.62L3.99946 11.401L4.00046 7.793L4.00446 7.568C4.12746 4.451 6.77146 2 9.99846 2C10.5052 2 10.9977 2.06047 11.4682 2.17455C11.1849 2.433 10.9347 2.72717 10.7248 3.04995C10.4877 3.01703 10.2452 3 9.99846 3C7.37546 3 5.22846 4.924 5.01846 7.385L5.00446 7.597L5.00046 7.802V11.5L4.96246 11.692L3.99946 14.005L15.9575 14.007L16.0025 14.005L15.0385 11.692L15.0005 11.5V9.97248C15.347 9.93414 15.6817 9.85645 15.9999 9.74397ZM8.50046 15.004H11.5005L11.4935 15.145C11.4574 15.516 11.2846 15.8603 11.0086 16.1108C10.7326 16.3612 10.3732 16.5 10.0005 16.5L9.85646 16.493C9.51017 16.4596 9.18626 16.3069 8.94016 16.061C8.69407 15.8151 8.54111 15.4913 8.50746 15.145L8.50046 15.004Z" fill="#8E9DAD" />
                        <g clipPath="url(#clip1_4540_78)">
                          <path d="M16.176 3.24174C16.1067 3.19033 16.0382 3.14417 15.9645 3.09879L15.9556 2.22358C15.9547 2.03608 15.8106 1.8778 15.6223 1.85474L14.2317 1.69595C14.1411 1.68472 14.0496 1.70735 13.9747 1.7595C13.8998 1.81165 13.8468 1.88964 13.8259 1.97849L13.6194 2.82928C13.4584 2.88259 13.302 2.94862 13.1531 3.02962L12.3927 2.60067C12.2288 2.50699 12.0182 2.55155 11.9065 2.70211L11.0728 3.8253C10.9589 3.97887 10.9772 4.19328 11.1143 4.32309L11.7451 4.92669C11.7107 5.09262 11.6928 5.26146 11.6884 5.43098L10.9338 5.87502C10.7708 5.96884 10.7043 6.17167 10.781 6.34529L11.3387 7.63251C11.4153 7.80613 11.6055 7.89593 11.7882 7.84476L12.6285 7.5998C12.7544 7.71272 12.8905 7.81372 13.035 7.90152L13.0439 8.77674C13.0448 8.96424 13.1889 9.12252 13.3773 9.14557L14.7678 9.30436C14.9562 9.32742 15.1311 9.20504 15.1737 9.02183L15.3802 8.17103C15.5411 8.11773 15.6976 8.05169 15.8464 7.9707L16.6068 8.39964C16.7708 8.49332 16.9813 8.44877 17.0931 8.29821L17.9267 7.17502C18.0384 7.02446 18.0201 6.81005 17.883 6.68023L17.2522 6.07663C17.2866 5.91071 17.3045 5.74187 17.3089 5.57234L18.0634 5.12831C18.2265 5.03449 18.293 4.83166 18.2163 4.65804L17.6617 3.37305C17.585 3.19943 17.3948 3.10963 17.2121 3.1608L16.3718 3.40576C16.3092 3.34532 16.2452 3.29314 16.176 3.24174ZM15.5626 6.27034C15.1313 6.85151 14.3076 6.97339 13.7265 6.54204C13.1453 6.1107 13.0234 5.28705 13.4548 4.70588C13.8861 4.12471 14.7098 4.00284 15.2909 4.43418C15.8721 4.86553 15.994 5.68918 15.5626 6.27034Z" fill="#8E9DAD" />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_4540_78">
                          <rect width={20} height={20} fill="white" />
                        </clipPath>
                        <clipPath id="clip1_4540_78">
                          <rect width={9} height={9} fill="white" transform="translate(8.2041 6.43164) rotate(-53.417)" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>Alert Setting</span>
                  </Link>
                </li>
              </ul>
              <div className="logout_nevigation">
                <ul>
                  <li id="collapse_bar">
                    <div className="collapse_bar_inner">
                      <a onClick={expandMenu} >
                        <svg
                          id="collapse_bar_svg_1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.4289 13.2525C11.2709 13.0943 11.1821 12.8798 11.1821 12.6562C11.1821 12.4327 11.2709 12.2182 11.4289 12.06L13.6451 9.84375L5.34375 9.84375C5.11997 9.84375 4.90536 9.75485 4.74713 9.59662C4.58889 9.43839 4.5 9.22378 4.5 9C4.5 8.77622 4.58889 8.56161 4.74713 8.40338C4.90536 8.24514 5.11997 8.15625 5.34375 8.15625L13.6451 8.15625L11.4289 5.94C11.2798 5.78005 11.1987 5.5685 11.2026 5.34991C11.2064 5.13132 11.295 4.92276 11.4496 4.76818C11.6041 4.61359 11.8127 4.52503 12.0313 4.52118C12.2499 4.51732 12.4614 4.59846 12.6214 4.7475L16.2776 8.40375L16.875 9L16.2787 9.59625L12.6225 13.2525C12.5441 13.3309 12.4511 13.3931 12.3487 13.4355C12.2463 13.478 12.1365 13.4998 12.0257 13.4998C11.9148 13.4998 11.8051 13.478 11.7027 13.4355C11.6003 13.3931 11.5072 13.3309 11.4289 13.2525ZM2.8125 4.21875C2.8125 3.99497 2.72361 3.78036 2.56537 3.62213C2.40714 3.46389 2.19253 3.375 1.96875 3.375C1.74497 3.375 1.53036 3.46389 1.37213 3.62213C1.21389 3.78036 1.125 3.99497 1.125 4.21875L1.125 13.7812C1.125 14.005 1.21389 14.2196 1.37213 14.3779C1.53036 14.5361 1.74497 14.625 1.96875 14.625C2.19253 14.625 2.40714 14.5361 2.56537 14.3779C2.7236 14.2196 2.8125 14.005 2.8125 13.7812L2.8125 4.21875Z"
                            fill="#8E9DAD"
                          />
                        </svg>


                      </a>

                      <a onClick={collapseMenu}>

                        <svg
                          id="collapse_bar_svg_2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.57112 4.7475C6.72913 4.9057 6.81788 5.12016 6.81788 5.34375C6.81788 5.56734 6.72913 5.7818 6.57112 5.94L4.35487 8.15625L12.6562 8.15625C12.88 8.15625 13.0946 8.24514 13.2529 8.40338C13.4111 8.56161 13.5 8.77622 13.5 9C13.5 9.22378 13.4111 9.43839 13.2529 9.59662C13.0946 9.75485 12.88 9.84375 12.6562 9.84375L4.35487 9.84375L6.57112 12.06C6.72017 12.2199 6.8013 12.4315 6.79745 12.6501C6.79359 12.8687 6.70504 13.0772 6.55045 13.2318C6.39586 13.3864 6.1873 13.475 5.96871 13.4788C5.75012 13.4827 5.53857 13.4015 5.37862 13.2525L1.72237 9.59625L1.125 9L1.72125 8.40375L5.3775 4.7475C5.45586 4.66909 5.54889 4.6069 5.6513 4.56446C5.7537 4.52202 5.86346 4.50018 5.97431 4.50018C6.08516 4.50018 6.19492 4.52202 6.29733 4.56446C6.39973 4.6069 6.49277 4.66909 6.57112 4.7475ZM15.1875 13.7812C15.1875 14.005 15.2764 14.2196 15.4346 14.3779C15.5929 14.5361 15.8075 14.625 16.0312 14.625C16.255 14.625 16.4696 14.5361 16.6279 14.3779C16.7861 14.2196 16.875 14.005 16.875 13.7812L16.875 4.21875C16.875 3.99497 16.7861 3.78036 16.6279 3.62213C16.4696 3.46389 16.255 3.375 16.0312 3.375C15.8075 3.375 15.5929 3.46389 15.4346 3.62213C15.2764 3.78036 15.1875 3.99497 15.1875 4.21875L15.1875 13.7812Z"
                            fill="#8E9DAD"
                          />
                        </svg>
                        <span>Collapse</span>
                      </a>

                    </div>
                  </li>
                  <li>
                    <a onClick={logOutFun}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H15M19 12L15 8M19 12L15 16M19 12H9"
                          stroke="#8E9DAD"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="dashboard_header">
            <div id="overlay-join-overlay" className="overlay_of_join">
              <div id="overlay-join-popup" className="join_popup_modal" ref={focus}>
                <div className="popup-head">
                </div>
                <div className="popup-body">
                  <p>
                    This link will take you to the group page. For operational security reasons, please make sure to use an anonymized device.
                  </p>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <div className="dashboard_header_content">
                <div className="dashboard_header_wrapper">
                  <h1 className="text-white">{pathName.split("/")[1] === "dashboard" ? "Dashboard" : (pathName.split("/")[1] === "search") ? "Search" : (pathName.split("/")[1] === "alertsetting") ? "Alert" : (pathName.split("/")[1] === "profiler") ? 'Profiler Page' : null}</h1>
                  <div className="hamburger-menu-icon">
                    <svg id="collapse_bar" onClick={expandMenu} xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="none" stroke="#108de5" strokeLinecap="round" strokeWidth="1.5" d="M4 7h3m13 0h-9m9 10h-3M4 17h9m-9-5h16" /></svg>
                  </div>
                </div>
                <div className="dashboard_user_icon">
                  <Image
                    src={profile_icon}
                    alt="Profile-icon"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </section>
        </section>
      }
    </>
  );
};

export default LeftPanel;



