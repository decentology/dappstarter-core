import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBBtn} from 'mdbreact';

class Card extends Component {

    render() {
      return (
            <MDBRow className="mb-4">
            <MDBCol lg="8" className="mb-4">
            <MDBCard>
                <MDBCardHeader color="blue-gradient"><h5>{this.props.blockTitle}</h5></MDBCardHeader>
                <MDBCardBody>
                <h4 className="mt-2 dark-grey-text text-center font-bold"><strong>{this.props.cardTitle}</strong></h4>
                <div className="text-center mb-5">
                    <h6>{this.props.cardDescription}</h6>
                </div>
                {this.props.children}
                </MDBCardBody>
                <div class="rounded-bottom mdb-color lighten-5 text-right pt-2 pb-2 pr-2">
                    <MDBBtn color="primary" onClick={this.props.onClick}>Go</MDBBtn>
                </div>
                </MDBCard>            
            </MDBCol>
            </MDBRow>
        );
    }
}

Card.propTypes = {
  onClick: PropTypes.func.isRequired,
  blockTitle: PropTypes.string.isRequired,
  cardTitle: PropTypes.string.isRequired,
  cardDescription: PropTypes.string
}

export default Card;


