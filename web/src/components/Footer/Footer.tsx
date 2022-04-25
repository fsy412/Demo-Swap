import React from "react"
import "./footer.scss"
 
const Footer = () => {
    return (
        <div className="page-footer font-small blue pt-4">
            <div className="container-fluid text-center text-md-left">
                <div className="row">
                    <div className=" ">
                        {/* <h5 className="text-uppercase">About Dante</h5> */}
                        {/* <p>Dante network is a middleware to empower multiple ecosystems to interoperate and interconnect in web3.</p> */}
                    </div>

                    <hr className="clearfix w-100 d-md-none pb-0" />

                    {/* <div className="col-md-3 mb-md-0 mb-3">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="#!">Link 1</a></li>
                            <li><a href="#!">Link 2</a></li>
                            <li><a href="#!">Link 3</a></li>
                            <li><a href="#!">Link 4</a></li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-md-0 mb-3">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="#!">Link 1</a></li>
                            <li><a href="#!">Link 2</a></li>
                            <li><a href="#!">Link 3</a></li>
                            <li><a href="#!">Link 4</a></li>
                        </ul>
                    </div> */}
                </div>
            </div>

            <div className="footer-copyright text-center py-3">© 2022 Copyright 
                <a href="https://mdbootstrap.com/">   DateNetwork.com</a>
            </div>

        </div>
    )
}
export default Footer;