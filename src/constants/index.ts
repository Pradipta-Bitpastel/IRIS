// 'use server'
import yellow_circle from "@/_assets/images/yellow_circle.png";
import red_circle from "@/_assets/images/red_circle.png";
import green_circle from "@/_assets/images/green_circle.png";
export const allowableServerErrors = ['']
import { ChartOptions } from "chart.js";
export const authHeader = {
  'Content-Type': 'application/json',
  'Client-Secret': "asdfdsgvbrggre"

}
export const pageApiHeader = {
  'Content-Type': 'application/json',

}
export const generalizedApiError = 'We apologize, but we were unable to process the request. Kindly reach out to the developer team for assistance.'
export const toastSettingData =
{
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  // transition: Bounce,
}


export const risk_factor_db = [
  {
    photo: green_circle,
    risk_factor: "<30",
    className: "bg_card_green",
  },
  {
    photo: yellow_circle,
    risk_factor: "<70",
    className: "bg_card_yellow",
  },
  {
    photo: red_circle,
    // photo:,
    risk_factor: "<100",
    className: "bg_card_red",
  },
];

export const regexExp400 = /^4\d{2}$/i
// export puplic_

export const imgBasePath = "/asset/country_flags"

export const defaultImgPath = "/_assets/images/default_img_icon/"

export const audio_icon_path = "/asset/default_img_icon/audio_icon_default.png"
export const video_icon_path = "/asset/default_img_icon/video_icon_default.png"
export const pdf_icon_path = "/asset/default_img_icon/pdf_icon_default.png"



export const activity_graph_dataset = {
  dataSet1: [
    [
      { x: 0, y: 30 },
      { x: 500, y: 48 },
      { x: 1000, y: 40 },
      { x: 1500, y: 19 },
      { x: 2000, y: 60 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 90 }


    ],
    [
      { x: 0, y: 20 },
      { x: 500, y: 70 },
      { x: 1000, y: 50 },
      { x: 1800, y: 19 },
      { x: 2000, y: 40 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 80 }


    ],





  ],
  dataSet2: [

    [
      { x: 0, y: 35 },
      { x: 500, y: 32 },
      { x: 1000, y: 30 },
      { x: 1500, y: 25 },
      { x: 2000, y: 50 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 80 }


    ],
    [
      { x: 0, y: 20 },
      { x: 500, y: 40 },
      { x: 1000, y: 50 },
      { x: 1800, y: 16 },
      { x: 2000, y: 30 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 70 }


    ],


  ],
  dataSet3: [
    [
      { x: 0, y: 30 },
      { x: 500, y: 45 },
      { x: 1000, y: 35 },
      { x: 1500, y: 20 },
      { x: 2000, y: 70 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 100 }


    ],
    [
      { x: 0, y: 15 },
      { x: 500, y: 40 },
      { x: 1000, y: 30 },
      { x: 1800, y: 18 },
      { x: 2000, y: 60 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 90 }


    ],
  ],

  dataSet4: [
    [
      { x: 0, y: 45 },
      { x: 500, y: 60 },
      { x: 1000, y: 35 },
      { x: 1500, y: 55 },
      { x: 2000, y: 80 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 100 }


    ],
    [
      { x: 0, y: 30 },
      { x: 500, y: 50 },
      { x: 1000, y: 35 },
      { x: 1800, y: 55 },
      { x: 2000, y: 60 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 80 }


    ],

  ],

  dataSet5: [
    [
      { x: 0, y: 40 },
      { x: 500, y: 48 },
      { x: 1000, y: 45 },
      { x: 1500, y: 19 },
      { x: 2000, y: 60 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 90 }


    ],
    [
      { x: 0, y: 35 },
      { x: 500, y: 42 },
      { x: 1000, y: 43 },
      { x: 1800, y: 19 },
      { x: 2000, y: 40 },
      // { x: 5000, y: 27 },
      { x: 2500, y: 85 }


    ],

  ],
  dataSet6: [
    [
      { x: 0, y: 55 },
      { x: 500, y: 60 },
      { x: 1000, y: 55 },
      { x: 1500, y: 29 },
      { x: 2000, y: 70 },
      // { x: 5000, y: 37 },
      { x: 2500, y: 100 }
    ],
    [
      { x: 0, y: 45 },
      { x: 500, y: 52 },
      { x: 1000, y: 53 },
      { x: 1800, y: 29 },
      { x: 2000, y: 50 },
      // { x: 5000, y: 37 },
      { x: 2500, y: 95 }
    ]
  ],
  dataSet7: [
    [
      { x: 0, y: 55 },
      { x: 500, y: 60 },
      { x: 1000, y: 55 },
      { x: 1500, y: 29 },
      { x: 2000, y: 70 },
      // { x: 5000, y: 37 },
      { x: 2500, y: 100 }
    ],
    [
      { x: 0, y: 45 },
      { x: 500, y: 52 },
      { x: 1000, y: 60 },
      { x: 1800, y: 40 },
      { x: 2000, y: 50 },
      // { x: 5000, y: 37 },
      { x: 2500, y: 95 }
    ]
  ],
  dataSet8: [
    [
      { x: 0, y: 30 },
      { x: 500, y: 70 },
      { x: 1000, y: 30 },
      { x: 1500, y: 70 },
      { x: 2000, y: 30 },
      { x: 2500, y: 70 }
    ],
    [
      { x: 0, y: 70 },
      { x: 500, y: 30 },
      { x: 1000, y: 70 },
      { x: 1800, y: 30 },
      { x: 2000, y: 70 },
      { x: 2500, y: 30 }
    ]
  ],
  dataSet9: [
    [
      { x: 0, y: 20 },
      { x: 500, y: 40 },
      { x: 1000, y: 60 },
      { x: 1500, y: 80 },
      { x: 2000, y: 100 },
      { x: 2500, y: 120 }
    ],
    [
      { x: 0, y: 120 },
      { x: 500, y: 100 },
      { x: 1000, y: 80 },
      { x: 1800, y: 60 },
      { x: 2000, y: 40 },
      { x: 2500, y: 20 }
    ]
  ],
  dataSet10: [
    [
      { x: 0, y: 20 },
      { x: 500, y: 25 },
      { x: 1000, y: 60 },
      { x: 1500, y: 78 },
      { x: 2000, y: 90 },
      { x: 2500, y: 120 }
    ],
    [
      { x: 0, y: 5 },
      { x: 500, y: 32 },
      { x: 1000, y: 60 },
      { x: 1800, y: 40 },
      { x: 2000, y: 30 },
      { x: 2500, y: 20 }
    ]
  ]

}
// const graph
export const activity_graph_data = {
  // for pre set label like ["January", "February", "March", "April", "May", "June"];
  // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      // label: 'Digital Goods',
      // backgroundColor: 'rgba(60,141,188,0.9)',
      borderColor: '#108DE5',
      pointRadius: false,
      lineWidth: "2",
      // pointColor: '#3b8bba',
      // pointStrokeColor: 'rgba(60,141,188,1)',
      // pointHighlightFill: '#fff',
      // pointHighlightStroke: 'rgba(60,141,188,1)',
      // for pre set label like ["January", "February", "March", "April", "May", "June"];

      // data: [28, 48, 40, 19, 86, 27, 90],
      // for dynamoc dataset
      // data: [
      //     { x: 0, y: 30 },
      //     { x: 500, y: 48 },
      //     { x: 1000, y: 40 },
      //     { x: 1500, y: 19 },
      //     { x: 2000, y: 60 },
      //     // { x: 5000, y: 27 },
      //     { x: 2500, y: 90 }


      //   ],
      // cubicInterpolationMode: 'monotone'
    },


    {
      // label: 'Electronics',
      // backgroundColor: 'rgba(210, 214, 222, 1)',
      borderColor: '#3B4043',
      pointRadius: false,
      lineWidth: "2",
      // pointColor: 'rgba(210, 214, 222, 1)',
      // pointStrokeColor: '#c1c7d1',
      // pointHighlightFill: '#fff',
      // pointHighlightStroke: 'rgba(220,220,220,1)',
      // for string lebel like ['January', 'February', 'March', 'April', 'May', 'June', 'July']
      // data: [65, 59, 80, 81, 56, 55, 40],
      // for numeric value and pre dataset
      // data: [
      //     { x: 0, y: 20 },
      //     { x: 500, y: 70 },
      //     { x: 1000, y: 50 },
      //     { x: 1800, y: 19 },
      //     { x: 2000, y: 40 },
      //     // { x: 5000, y: 27 },
      //     { x: 2500, y: 80 }


      //   ],
      cubicInterpolationMode: 'monotone'

    }

  ]
}


export const activity_graph_option: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    x: {
      // for numeric value, for  string x axis label like ['January', 'February', 'March', 'April', 'May', 'June', 'July'] not required.
      type: 'linear',
      //   unit: 'millisecond',
      grid: {
        // display: true,
        // color:"#8E9DAD",
        color: "#1F272D",
        // #1F272D
        //  lineWidth:"1",
        tickColor: 'transparent',
        // z:"5555"
      },
      ticks: {
        display: false
      },
      title: {
        display: true,
        text: 'Time'
      },
      border: {

        color: '#8E9DAD'
      }
    },
    y: {
      grid: {
        display: false,


      },
      ticks: {
        display: false
      },
      title: {
        display: true,
        text: 'Message Count'
      },
      border: {
        color: '#8E9DAD',
        z: 999

        // lineWidth:2
      }
    },
  }
}
interface Option {
  value: string;
  range: string;
}

export const filterriskScores: Option[] = [
  { range: '1', value: '1' },
  { range: '2', value: '2' },
  { range: '3', value: '3' },
  { range: '4', value: '4' },
  { range: '5', value: '5' },
  // { range: 'Above 100%', value: 1000 }
];
export const filtermemberCounts = [
  { range: 'Less than 10', value: '<10' },
  { range: 'Less than 25', value: '<25' },
  { range: 'Less than 50', value: '<50' },
  { range: 'Less than 100', value: '<100' },
  { range: 'Less than 500', value: '<500' },
  { range: 'Less than 1000', value: '<1000' },
  { range: 'Less than 10000', value: '<10000' },
  { range: 'Above 10000', value: '>10000' }
];
export function formatTimestamps(dateObj: Record<string, any>) {
  // Extract the startDate and endDate from the object
  const { startDate, endDate } = dateObj;
  function formatDate(date) {
    // if (!date) return "Not Selected";
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // // Convert ISO date strings to the desired format (YYYY-MM-DD)
  // const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
  // const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
  console.log(`${formattedStartDate} to ${formattedEndDate}`, '000000');

  // Return the formatted string
  return `${formattedStartDate} to ${formattedEndDate}`;
}