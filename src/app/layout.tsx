import "@/_assets/style/style.css"
import 'bootstrap/dist/css/bootstrap.css'
import LeftPanel from '@/components/LeftPanel'
import PageTransition from "./_components/PageTransition"



// if (process.env.NODE_ENV === 'production') {
//     Sentry.init({
//       dsn: process.env.SENTRY_DSN,
//       tracesSampleRate: 1.0,
//       environment: process.env.NODE_ENV,
//     });

//     LogRocket.init('your-app-id');
//   }


if (process.env.REACT_APP_ENV === 'production') {
  console.log("init google analytics")
  // initGoogleAnalytics(user)

}
else {
  console.log("else in dev ")
}
;
export const metadata = {
  title: 'IRIS',
  description: 'IRIS DEMO',
  // name:
}
// import map from '../../public/map'




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <body className="fixMapBody"> */}
      <body className="">
        <LeftPanel />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}