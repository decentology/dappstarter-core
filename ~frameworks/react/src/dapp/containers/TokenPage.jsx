import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showResultPanel } from '../actions';
import '../../lib/components/action-card.js';

class TokenPage extends Component {

  render() {
    let category = 'Asset Value Tracking';
    let block = 'Token';
    return (
        <section>
          <h1 className="mb-5">{category}: <strong>{block}</strong></h1>

          <action-card 
              category={category} 
              block={block}
              action="Get Total Supply" 
              description="Get total supply of tokens"
              templateId="totalSupply"
              onClick={() => { let self = this; self.props.showResultPanel(category, 'Get Total Supply'); }}
          >
          </action-card>

          <action-card 
              category={category} 
              block={block}
              action="Get Balance" 
              description="Get token balance for current account"
              templateId="balance"
              onClick={() => { this.props.showResultPanel(category, 'Get Balance'); }}
          >
          </action-card>

          <action-card 
              category={category} 
              block={block}
              action="Get Balance for Account" 
              description="Get token balance for any account"
              templateId="balanceOf"
              onClick={() => { this.props.showResultPanel(category, 'Get Balance for Account'); }}
          >
          </action-card>

          <action-card 
              category={category} 
              block={block}
              action="Transfer" 
              description="Transfer tokens to another account"
              templateId="transfer"
              onClick={() => { this.props.showResultPanel(category, 'Get Document Details'); }}
          >
          </action-card>
          
          <template id="totalSupply"
            dangerouslySetInnerHTML={{
              __html: ''
            }}
          />

          <template id="balance"
            dangerouslySetInnerHTML={{
              __html: ''
            }}
          />

          <template id="balanceOf"
            dangerouslySetInnerHTML={{
              __html: 'Account: <input type="text"></input>'
            }}
          />


          <template id="transfer"
            dangerouslySetInnerHTML={{
              __html: 'To: <input type="text"></input>'
            }}
          />


        </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        showResultPanel
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(TokenPage);

