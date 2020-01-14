import React from 'react';
import logo from "../assets/img/dappstarter.png";
import { MDBListGroup, MDBListGroupItem } from 'mdbreact';
import { NavLink } from 'react-router-dom';

const SideNavigation = () => {
    return (
        <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                <img alt="DappStarter Logo" className="img-fluid" src={logo}/>
            </a>
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to="/token" activeClassName="activeClass">
                    <MDBListGroupItem>
                        Token
                    </MDBListGroupItem>
                </NavLink>
            </MDBListGroup>
        </div>
    );
}

export default SideNavigation;