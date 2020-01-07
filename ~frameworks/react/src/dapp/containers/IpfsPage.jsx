import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showResultPanel } from '../actions';
import Card from '../components/Card.jsx';

class IpfsPage extends Component {

  render() {
    let blockTitle = 'File Storage: IPFS Storage';
    return (
        <section>
          <Card 
              blockTitle={blockTitle} 
              cardTitle="Add Document" 
              cardDescription="Upload a document and store it on IPFS"
              onClick={() => { let self = this; self.props.showResultPanel(blockTitle, 'Add Document'); }}
            >
            <input type="file"></input>
          </Card>

          <Card 
              blockTitle={blockTitle} 
              cardTitle="Get Document Details" 
              cardDescription="Get details for a previously uploaded document"
              onClick={() => { this.props.showResultPanel(blockTitle, 'Get Document Details'); }}
            >
            <input type="text"></input>
          </Card>
          

          <Card 
              blockTitle={blockTitle} 
              cardTitle="Something" 
              cardDescription="xxxxx"
              onClick={() => { this.props.showResultPanel(blockTitle, 'Get Document Details'); }}
            >
            <h2>Hello World</h2>
          </Card>
          



        </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        showResultPanel
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(IpfsPage);

