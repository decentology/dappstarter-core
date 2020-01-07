import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBIcon } from 'mdbreact';

class TopNavigation extends Component {
    state = {
        collapse: false
    }

    onClick = () => {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
                <MDBNavbarBrand href="/">
                    <strong>DappStarter</strong>
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick = { this.onClick } />
                <MDBCollapse isOpen = { this.state.collapse } navbar>
                    <MDBNavbarNav left>
                        <MDBNavItem>
                            <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://www.trycrypto.com/dappstarter" target="_blank">About</a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://support.trycrypto.com" target="_blank">Support</a>
                        </MDBNavItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav right>
                        <MDBNavItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://facebook.com/trycrypto/"><MDBIcon fab icon="facebook" /></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/trycrypto"><MDBIcon fab icon="twitter" /></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" href="https://github.com/trycrypto/dappstarter" target="_blank"><MDBIcon fab icon="github" className="mr-2"/></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a className="btn peach-gradient nav-link Ripple-parent" rel="noopener noreferrer" href="https://demo.photoblock.org/" target="_blank">Sign in with PhotoBlock</a>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        );
    }
}

export default TopNavigation;