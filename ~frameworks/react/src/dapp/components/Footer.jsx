import React from 'react';
import { MDBFooter } from 'mdbreact';

const Footer = () => {
    return (
        <MDBFooter color="blue" className="text-center font-small darken-1 fixed-bottom">
            <p className="footer-copyright mb-0 py-3 text-center">
                Built for you with <span role="img" aria-label="Heart">❤️</span> by <a href="https://www.trycrypto.com/dappstarter">DappStarter</a>
            </p>
        </MDBFooter>
    );
}

export default Footer;