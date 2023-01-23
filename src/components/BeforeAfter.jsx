
export default function BeforeAfter() {

    return (
        <div className="item">
            <div className="row g-0">
                <div className="col-6">
                    <div className="item-img odd animated wow fadeIn">
                        <img src={process.env.PUBLIC_URL +"/img/gallery/before1.jpg"} className="img-fluid" alt="" />
                        <div className="ribbon">
                            <span>BEFORE</span>
                        </div>
                        <div className="overlay odd fade-overlay">
                            <div className="text">
                                <i className="fa fa-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="item-img even animated wow fadeIn">
                        <img src={process.env.PUBLIC_URL +"/img/gallery/after1.jpg"} className="img-fluid" alt="" />
                        <div className="ribbon ribbon-cyan">
                            <span>AFTER</span>
                        </div>
                        <div className="overlay even fade-overlay">
                            <div className="text">
                                <i className="fa fa-search"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}