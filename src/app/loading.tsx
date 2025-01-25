import '@/_assets/style/style.css'

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (<>
               {/* <section className="loader ">
                <div className="hourglassBackground">
                    <div className="hourglassContainer">
                        <div className="hourglassCurves" />
                        <div className="hourglassCapTop" />
                        <div className="hourglassGlassTop" />
                        <div className="hourglassSand" />
                        <div className="hourglassSandStream" />
                        <div className="hourglassCapBottom" />
                        <div className="hourglassGlass" />
                    </div>
                </div>
            </section> */}



<div id="imageParent" className="loadingParent">
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  </div>
    </>)
  }