import React, { Component } from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { hideResultPanel } from '../actions';

class ResultPanel extends Component {

    render(){
        return (
            <MDBModal isOpen={this.props.visible} animation="right" fullHeight  position="right">
                <MDBModalHeader>{this.props.title}</MDBModalHeader>
                <MDBModalBody className="text-center">
                    {this.props.content}
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="primary" onClick={() => { this.props.hideResultPanel(); }}>Close</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
      )
    }
}

const mapStateToProps = state => {
 //   console.log('State', state);
    return { ...state.resultPanel }
};
  
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        hideResultPanel
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultPanel);