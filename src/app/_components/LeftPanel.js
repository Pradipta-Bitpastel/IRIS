// "use client";

// import React, { useEffect,useRef } from "react";
// import Image from "next/image";

// import iris_logo from "@/assets/images/logo_iris.png";
// import iris_white_logo from "@/assets/images/white-logo.png";
// import $ from "jquery";
// import Link from "next/link";
// import { usePathname ,useRouter} from "next/navigation";
// import profile_icon from "@/assets/images/profile_icon.jpg";












// const LeftPanel = () => {
//   const router=useRouter()
//   const focus = useRef()

//   const expandMenu = (e) => {

// console.log("in outtt")

//     $(".left_sidebar_nevigation li span").addClass("d-block");
//     $(".dashboard_header").addClass("extra_padding");
//     $(".dashboard_main").addClass("extra_padding_inner");
//     $(".left_sidebar").addClass("expand");
//     if ($(".left_sidebar").hasClass("expand")) {
//       $(".left_sidebar").animate({
//         // left: '150px' ,
//         width: "180px",
//         // opacity: '1'
//       });
//       $(".left_sidebar ul li a span").animate(
//         {
//           // left: '150px' ,
//           // width: '180px',
//           opacity: "1",
//         },
//         1000
//       );
//       // alert()
//       $("#logo_1").addClass("d-none");
//       $("#logo_2").addClass("d-block");
//       $("#collapse_bar_svg_1").addClass("d-none");
//       $("#collapse_bar_svg_2").addClass("d-block");
//     }
//   };
//   const collapseMenu = (e,widthCollapse) => {
//   console.log("collapse menuu",widthCollapse)
  
//     // e.preventDefault()


//     // if ($(window).width() < 1024) {
//     //   $(".left_sidebar").animate({
//     //     left: '0px',
//     //     width: '0px',
//     //   });
  
//     // } else {
//     //   $(".left_sidebar").animate({
//     //     left: '0px',
//     //     width: '50px',
//     //   });
  
//     // }
//     // $(".left_sidebar ul li a span").animate({
//     //   // left: '150px' ,
//     //   // width: '180px',
//     //   opacity: '0'
//     // });



//             $('.left_sidebar_nevigation li span').removeClass('d-block')
//             $('.dashboard_header').removeClass('extra_padding')
//             $('.dashboard_main').removeClass('extra_padding_inner')
//             $('.left_sidebar').removeClass('expand')
  
//             $('#logo_1').removeClass('d-none')
//             $('#logo_2').removeClass('d-block')
//             $('#collapse_bar_svg_1').removeClass('d-none')
//             $('#collapse_bar_svg_2').removeClass('d-block')
//             if(widthCollapse || ($(window).width() < 1024)){

          

//               console.log("collap[ase maemyy")
//               $(".left_sidebar").animate({
//                 left: '0px',
//                 width: '0px'
//                 // opacity: '0'
//             }); 

//             }
//             else{
//               console.log("else collap[ase maemyy")


//               $(".left_sidebar").animate({
//                   left: '0px',
//                   width: '50px',
//                   // opacity: '0'
//               });
//             }
//             $(".left_sidebar ul li a span").animate({
//                 // left: '150px' ,
//                 // width: '180px',
//                 opacity: '0'
//             });
//   };
//   const logOutFun=(e)=>{
//     console.log(e.preventDefault())
  
//     router.push(`/`);
    
//   }

//   useEffect(() => {

//     if (window.matchMedia("(max-width: 1024px)").matches) {
//       $('.dashboard_header_wrapper h1').hide()
//       $('.hamburger-menu-icon svg').show()


//       $(document).mouseup(function (e) {

// console.log("message useEffect")

//         if ($(e.target).
//           closest(".left_sidebar.expand").
//           length === 0) {
//           // $(".left_sidebar.expand").animate({
//           //   left: '0px',
//           //   width: '0px',
//           // });
//           // $('.left_sidebar_nevigation li span').removeClass('d-block')
//           // $('.left_sidebar').removeClass('expand')
//           // $('#logo_1').removeClass('d-none')
//           // $('#logo_2').removeClass('d-block')
//           // $('#collapse_bar_svg_1').removeClass('d-none')
//           // $('#collapse_bar_svg_2').removeClass('d-block')
//           collapseMenu('e','0px')

//         }
//       });
//     } else {
//       $('.dashboard_header_wrapper h1').show()
//       $('.hamburger-menu-icon svg').hide()
//       $(document).off('mousedown mouseup');
//       $(".dashboard_header").removeClass("extra_padding");
//       $(".dashboard_main").removeClass("extra_padding_inner");
//     }
//     $(window).resize(function () {
//       if (window.matchMedia("(max-width: 1024px)").matches) {
//         // alert('IF 1024')
//         $(".left_sidebar").css({ 'width': '0px' });
//         $('.dashboard_header_wrapper h1').hide()
//         $('.hamburger-menu-icon svg').show()
//         $(document).mousedown(function (e) {
//           if ($(e.target).
//             closest(".left_sidebar.expand").
//             length === 0) {
//   collapseMenu("e",0)

//           }
//         });
//       } else {
//         // alert()
//         // alert('IF NOT 1024')
//         $(".left_sidebar").css({ 'width': '50px' });
//         $('.dashboard_header_wrapper h1').show()
//         $('.hamburger-menu-icon svg').hide()
//         $(document).off('mousedown mouseup');
//         $(".dashboard_header").removeClass("extra_padding");
//         $(".dashboard_main").removeClass("extra_padding_inner");
//       }
//     });
//   }, [])

//   useEffect(() => {
//     function handleClickOutside (event) {
//       console.log(event.target.ariaExpanded, 'roleee')
//       // console.log(focus.current)
//       if (focus.current && !focus.current.contains(event.target)) {
//         console.log(event.target.id, 'roleee111')
      
//         $("#overlay-join-overlay").css("display","none");
//         $("#overlay-join-popup").css("display","none");
//       }
//       //uncomment to enlatge the width of autocomplete
//       // else if((event.target.id=='controllable-states-demo') &&(event.target.ariaExpanded
//       //   )) {
//       //     console.log("in onlyyy")
//       //  includeClass()

//       // }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [focus])
  
//   // useEffect(()=>{

//   //     $('#collapse_bar').click((e) => {
//   //         e.preventDefault()
//   //         $('.left_sidebar_nevigation li span').toggleClass('d-block')
//   //         $('.dashboard_header').toggleClass('extra_padding')
//   //         $('.dashboard_main').toggleClass('extra_padding_inner')
//   //         $('.left_sidebar').toggleClass('expand')
//   //         if ($(".left_sidebar").hasClass("expand")) {
//   //             $(".left_sidebar").animate({
//   //                 // left: '150px' ,
//   //                 width: '180px',
//   //                 // opacity: '1'
//   //             });
//   //             $(".left_sidebar ul li a span").animate({
//   //                 // left: '150px' ,
//   //                 // width: '180px',
//   //                 opacity: '1'
//   //             }, 1000);
//   //             // alert()
//   //             $('#logo_1').addClass('d-none')
//   //             $('#logo_2').addClass('d-block')
//   //             $('#collapse_bar_svg_1').addClass('d-none')
//   //             $('#collapse_bar_svg_2').addClass('d-block')
//   //         }

//   //         else {
//   //             $('#logo_1').removeClass('d-none')
//   //             $('#logo_2').removeClass('d-block')
//   //             $('#collapse_bar_svg_1').removeClass('d-none')
//   //             $('#collapse_bar_svg_2').removeClass('d-block')
//   //             $(".left_sidebar").animate({
//   //                 left: '0px',
//   //                 width: '50px',
//   //                 // opacity: '0'
//   //             });
//   //             $(".left_sidebar ul li a span").animate({
//   //                 // left: '150px' ,
//   //                 // width: '180px',
//   //                 opacity: '0'
//   //             });
//   //         }
//   //     })

//   // },[])



// //   useEffect(()=>{

// //     $(".left_sidebar_nevigation_ul li a").click(function (e) {
// //         e.preventDefault()
// //         $(this).parent().addClass('selected').siblings().removeClass('selected');
// //     });
// //     $(".logout_nevigation li a").click(function (e) {
// //         e.preventDefault()
// //         $(this).parent().toggleClass('selected').siblings().removeClass('selected');
// //     });
    
// // },[])


// const pathName=usePathname();

//   return (
//     <>
//     {
//      (( pathName.split("/")[1] === "dashboard") || (pathName.split("/")[1] === "search")) &&
//      <section className="common_">

     

//       <section class="left_sidebar">
//         {console.log(pathName,"pathnamee")}
//         <div class="left_sidebar_logo text-center">
//           {/* <img
//             src="./assets/images/white-logo-PNG 2.png"
//             class="img-fluid"
//             id="logo_1"
//           />
//           <img
//             src="./assets/images/logo_iris.png"
//             class="img-fluid "
//             id="logo_2"
//           /> */}

// <Image
//               src={iris_white_logo}
//               alt="Iris White Logo"
//               className="img-fluid"
//               id="logo_1"
             
             
//             />
//         <Image
//               src={iris_logo}
//               alt="Iris Logo"
//               className="img-fluid"
//               id="logo_2"
             
          
//             />

//         </div>
//         <div class="left_sidebar_nevigation">
//           <ul class="left_sidebar_nevigation_ul">
//             <li className={pathName.split("/")[1] === "dashboard" ? "selected" : ""} >

//               <Link  href={"/dashboard"}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <path
//                     d="M13.45 11.55L15.5 9.5M10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   />
//                   <path
//                     d="M6.4 20C4.93815 18.8381 3.87391 17.2502 3.35478 15.4565C2.83564 13.6627 2.88732 11.7519 3.50265 9.98881C4.11797 8.22573 5.26647 6.69771 6.78899 5.6165C8.3115 4.53529 10.1326 3.95444 12 3.95444C13.8674 3.95444 15.6885 4.53529 17.211 5.6165C18.7335 6.69771 19.882 8.22573 20.4974 9.98881C21.1127 11.7519 21.1644 13.6627 20.6452 15.4565C20.1261 17.2502 19.0619 18.8381 17.6 20H6.4Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   />
//                 </svg>
//                 <span>Dashboard</span>
//                 </Link>
              
//             </li>
//             <li className={pathName.split("/")[1] === "search" ? "selected" : ""}>
//               <Link  href={"/search"}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                 >
//                   <path
//                     d="M17.4999 17.5L13.8808 13.8808M13.8808 13.8808C14.4998 13.2617 14.9909 12.5268 15.3259 11.7179C15.661 10.9091 15.8334 10.0422 15.8334 9.16666C15.8334 8.29115 15.661 7.42422 15.326 6.61537C14.9909 5.80651 14.4998 5.07156 13.8808 4.45249C13.2617 3.83342 12.5267 3.34234 11.7179 3.0073C10.909 2.67226 10.0421 2.49982 9.16659 2.49982C8.29109 2.49982 7.42416 2.67226 6.61531 3.0073C5.80645 3.34234 5.0715 3.83342 4.45243 4.45249C3.20215 5.70276 2.49976 7.3985 2.49976 9.16666C2.49976 10.9348 3.20215 12.6305 4.45243 13.8808C5.7027 15.1311 7.39844 15.8335 9.16659 15.8335C10.9347 15.8335 12.6305 15.1311 13.8808 13.8808Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   />
//                 </svg>
//                 <span>Search</span>
//               </Link>
//             </li>
//             {/* <li>
//               <a href="">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="22"
//                   height="22"
//                   viewBox="0 0 22 22"
//                   fill="none"
//                 >
//                   <path
//                     d="M2.82506 12.782C2.34014 11.9112 2.09814 11.4758 2.09814 11C2.09814 10.5243 2.34014 10.0888 2.82506 9.21801L4.06073 6.99418L5.36789 4.81159C5.88031 3.95634 6.13606 3.52826 6.54764 3.28993C6.96014 3.05251 7.45789 3.04518 8.45431 3.02868L10.9999 2.98834L13.5436 3.02868C14.541 3.04518 15.0387 3.05251 15.4503 3.29084C15.8628 3.52918 16.1195 3.95634 16.631 4.81159L17.9391 6.99418L19.1766 9.21801C19.6606 10.0888 19.9026 10.5243 19.9026 11C19.9026 11.4758 19.6606 11.9112 19.1756 12.782L17.9391 15.0058L16.6319 17.1884C16.1195 18.0437 15.8637 18.4718 15.4521 18.7101C15.0396 18.9475 14.5419 18.9548 13.5455 18.9713L10.9999 19.0117L8.45614 18.9713C7.45881 18.9548 6.96106 18.9475 6.54948 18.7092C6.13698 18.4708 5.88031 18.0437 5.36881 17.1884L4.06073 15.0058L2.82323 12.782H2.82506Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                   />
//                   <path
//                     d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                   />
//                 </svg>
//                 <span>Settings</span>
//               </a>
//             </li>
//             <li>
//               <a href="">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="22"
//                   height="22"
//                   viewBox="0 0 22 22"
//                   fill="none"
//                 >
//                   <path
//                     d="M17.4166 19.25V17.4167C17.4166 16.4442 17.0303 15.5116 16.3426 14.8239C15.655 14.1363 14.7224 13.75 13.7499 13.75H8.24992C7.27746 13.75 6.34483 14.1363 5.65719 14.8239C4.96956 15.5116 4.58325 16.4442 4.58325 17.4167V19.25"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   />
//                   <path
//                     d="M10.9999 10.0833C13.025 10.0833 14.6666 8.44171 14.6666 6.41667C14.6666 4.39162 13.025 2.75 10.9999 2.75C8.97487 2.75 7.33325 4.39162 7.33325 6.41667C7.33325 8.44171 8.97487 10.0833 10.9999 10.0833Z"
//                     stroke="#8E9DAD"
//                     stroke-width="1.2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   />
//                 </svg>
//                 <span>Profile</span>
//               </a>
//             </li> */}
//           </ul>
//           <div class="logout_nevigation">
//             <ul>
//               <li id="collapse_bar">
//                 <div className="collapse_bar_inner">
//                 <a onClick={expandMenu} >
//                   <svg
//                     id="collapse_bar_svg_1"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="18"
//                     height="18"
//                     viewBox="0 0 18 18"
//                     fill="none"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M11.4289 13.2525C11.2709 13.0943 11.1821 12.8798 11.1821 12.6562C11.1821 12.4327 11.2709 12.2182 11.4289 12.06L13.6451 9.84375L5.34375 9.84375C5.11997 9.84375 4.90536 9.75485 4.74713 9.59662C4.58889 9.43839 4.5 9.22378 4.5 9C4.5 8.77622 4.58889 8.56161 4.74713 8.40338C4.90536 8.24514 5.11997 8.15625 5.34375 8.15625L13.6451 8.15625L11.4289 5.94C11.2798 5.78005 11.1987 5.5685 11.2026 5.34991C11.2064 5.13132 11.295 4.92276 11.4496 4.76818C11.6041 4.61359 11.8127 4.52503 12.0313 4.52118C12.2499 4.51732 12.4614 4.59846 12.6214 4.7475L16.2776 8.40375L16.875 9L16.2787 9.59625L12.6225 13.2525C12.5441 13.3309 12.4511 13.3931 12.3487 13.4355C12.2463 13.478 12.1365 13.4998 12.0257 13.4998C11.9148 13.4998 11.8051 13.478 11.7027 13.4355C11.6003 13.3931 11.5072 13.3309 11.4289 13.2525ZM2.8125 4.21875C2.8125 3.99497 2.72361 3.78036 2.56537 3.62213C2.40714 3.46389 2.19253 3.375 1.96875 3.375C1.74497 3.375 1.53036 3.46389 1.37213 3.62213C1.21389 3.78036 1.125 3.99497 1.125 4.21875L1.125 13.7812C1.125 14.005 1.21389 14.2196 1.37213 14.3779C1.53036 14.5361 1.74497 14.625 1.96875 14.625C2.19253 14.625 2.40714 14.5361 2.56537 14.3779C2.7236 14.2196 2.8125 14.005 2.8125 13.7812L2.8125 4.21875Z"
//                       fill="#8E9DAD"
//                     />
//                   </svg>
                 
                 
//                 </a>

//                 <a  onClick={collapseMenu}>
                
//                   <svg
//                     id="collapse_bar_svg_2"
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="18"
//                     height="18"
//                     viewBox="0 0 18 18"
//                     fill="none"
//                   >
//                     <path
//                       fill-rule="evenodd"
//                       clip-rule="evenodd"
//                       d="M6.57112 4.7475C6.72913 4.9057 6.81788 5.12016 6.81788 5.34375C6.81788 5.56734 6.72913 5.7818 6.57112 5.94L4.35487 8.15625L12.6562 8.15625C12.88 8.15625 13.0946 8.24514 13.2529 8.40338C13.4111 8.56161 13.5 8.77622 13.5 9C13.5 9.22378 13.4111 9.43839 13.2529 9.59662C13.0946 9.75485 12.88 9.84375 12.6562 9.84375L4.35487 9.84375L6.57112 12.06C6.72017 12.2199 6.8013 12.4315 6.79745 12.6501C6.79359 12.8687 6.70504 13.0772 6.55045 13.2318C6.39586 13.3864 6.1873 13.475 5.96871 13.4788C5.75012 13.4827 5.53857 13.4015 5.37862 13.2525L1.72237 9.59625L1.125 9L1.72125 8.40375L5.3775 4.7475C5.45586 4.66909 5.54889 4.6069 5.6513 4.56446C5.7537 4.52202 5.86346 4.50018 5.97431 4.50018C6.08516 4.50018 6.19492 4.52202 6.29733 4.56446C6.39973 4.6069 6.49277 4.66909 6.57112 4.7475ZM15.1875 13.7812C15.1875 14.005 15.2764 14.2196 15.4346 14.3779C15.5929 14.5361 15.8075 14.625 16.0312 14.625C16.255 14.625 16.4696 14.5361 16.6279 14.3779C16.7861 14.2196 16.875 14.005 16.875 13.7812L16.875 4.21875C16.875 3.99497 16.7861 3.78036 16.6279 3.62213C16.4696 3.46389 16.255 3.375 16.0312 3.375C15.8075 3.375 15.5929 3.46389 15.4346 3.62213C15.2764 3.78036 15.1875 3.99497 15.1875 4.21875L15.1875 13.7812Z"
//                       fill="#8E9DAD"
//                     />
//                   </svg>
//                 <span>Collapse</span>
//                 </a>

//                 </div>
//               </li>
//               <li>
//                 <a onClick={logOutFun}>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H15M19 12L15 8M19 12L15 16M19 12H9"
//                       stroke="#8E9DAD"
//                       stroke-width="1.2"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                     />
//                   </svg>
//                   <span>Logout</span>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </section>
//       <section className="dashboard_header">
//       <div id="overlay-join-overlay" className="overlay_of_join">


//       <div id="overlay-join-popup" className="join_popup_modal" ref={focus}>
//             <div className="popup-head">
//             </div>
//             <div className="popup-body">
//                 <p>
//                 This link will take you to the group page. For operational security reasons, please make sure to use an anonymized device.
//                 </p>
//             </div>

//         </div>
//       </div>
//         <div className="container-fluid">
//           <div className="dashboard_header_content">
//             <div className="dashboard_header_wrapper">
//               <h1 className="text-white">{pathName.split("/")[1] === "dashboard"?"Dashboard":(pathName.split("/")[1] === "search")?"Search":null}</h1>
//               <div className="hamburger-menu-icon">
//                 <svg id="collapse_bar" onClick={expandMenu} xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="none" stroke="#108de5" stroke-linecap="round" stroke-width="1.5" d="M4 7h3m13 0h-9m9 10h-3M4 17h9m-9-5h16" /></svg>
//               </div>
//             </div>
//             <div className="dashboard_user_icon">

//               <Image
//                 src={profile_icon}
//                 alt="Profile-icon"
//                 className="img-fluid"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//       </section>
// }
//     </>
//   );
// };

// export default LeftPanel;
