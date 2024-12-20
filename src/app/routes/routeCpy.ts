// import { request } from 'http';
// import { NextResponse } from 'next/server';
// // API Urls
// // import { GROUP_BASE_URL, PEOPLE_BASE_URL } from '../../../config';
// // // Basic fetch function
// import { basicFetch,basicPost } from '@/lib/apiFunction';
// import { TCustomApiProp,TCustomApiPropWithURL } from '@/types/type';
// import { stringify } from 'querystring';
// import { error } from 'console';
// // import { NodeNextRequest } from 'next/dist/server/base-http/node';

// const customApiPropWithURLBuilder=(request:Request)=>{

// }
// export async function GET(request:Request) {
//   console.log("inside get request handler");
//   // console.log("inRoute",req.json());
//   const { searchParams } = new URL(request.url);
//   const contentType:string = request.headers.get('content-type') || '';

//   const endpoint:string = searchParams.get('endpoint') ||'';

// const customApiProp:TCustomApiProp={
//   headersInfo:{"Content-Type":contentType},
//   endpoint:"",
//   httpMethod:"get"
// }
// console.log(process.env.API_BASE_URL,"env variable")

//   const urlBuild:string =process.env.API_BASE_URL?`${process.env.API_BASE_URL}/${endpoint}`:'' ;
// console.log(urlBuild,"endpointttt")


//   const data = await basicFetch({customApiProp,URL:urlBuild});
//   // console.log(data.data,"dataaaa")

//   return NextResponse.json({data:data.data},{status:data.status,statusText:data.statusText})
// }



// export async function POST(request:Request) {
//   console.log("inRoute",request.body);
//   // const { searchParams } = new URL(req.url);
//   // console.log(searchParams.get('lol'),"mmmmm")
//   // const body =new URL(req.body)
//   // const data=await request.json();
//   // console.log(nData,"ndata")

// const contentType:string = request.headers.get('content-type') || '';
// let body: Record<string,any> = {};
// const { searchParams } = new URL(request.url);
// const endpoint:string = searchParams.get('endpoint') ||'';


// if(contentType=="application/json"){
//   body=await request.json();
// }
// else if(contentType=="application/x-www-form-urlencoded"){
//   const formData = await request.formData();
//   formData.forEach((value, key) => {
//     body[key] = value.toString();
//   });

// }

// const customApiProp:TCustomApiProp={
//   headersInfo:{"Content-Type":contentType},
//   endpoint:"",
//   httpMethod:"post",
//   data:body
// }

//   const urlBuild:string =process.env.API_BASE_URL?`${process.env.API_BASE_URL}/${endpoint}`:'' ;
// console.log(urlBuild,"endpointttt")


//   const data = await basicPost({customApiProp,URL:urlBuild});

//   // console.log(data,"datataaa")

//   // return NextResponse.json({data:data.data},{status:data.status,statusText:data.statusText})
//   return NextResponse.json(data)


// }
// // export async function POST(req:Request) {
// //   console.log("inRoute",req.body);
// //   // const { searchParams } = new URL(req.url);
// //   // console.log(searchParams.get('lol'),"mmmmm")
// //   // const body =new URL(req.body)
// //   const nData=await req.json();
// //   console.log(nData,"ndata")
// //   // const formData = await req.formData();
// //   // const body: Record<string, string> = {};
// //   // formData.forEach((value, key) => {
// //   //   body[key] = value.toString();
// //   // });

// //   // console.log("inRoute", body);

// //   // const limit = searchParams.get('limit');
// //   // const offset = searchParams.get('offset');
// //   // const reqType = searchParams.get('type');


// // //   const endpoint = (reqType=="group") ? `${GROUP_BASE_URL}?limit=${limit}&offset=${offset}` : (reqType=="people") ? `${PEOPLE_BASE_URL}?limit=${limit}&offset=${offset}`:none;
// // // console.log(endpoint,"endpointttt")

// // // const re= req.headers
// // // console.log(re,"reeeee")
// // const contentType = req.headers.get('content-type');
// // const body: Record<string, string> = {};

// // if(contentType=="application/json"){
  
// // }
// // else if(contentType=="application/x-www-form-urlencoded"){
// //   const formData = await req.formData();
// //   formData.forEach((value, key) => {
// //     body[key] = value.toString();
// //   });

// // }
// //   const data = await basicFetch(endpoint);

// // //   console.log(data,"dataaaa")
// //   //  console.log(,"reeeee")


// //   return NextResponse.json({});
// // }