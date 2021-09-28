// React
import React from 'react';
import ReactDOM from 'react-dom';

// Integrated Redux
import {StoreContext} from 'redux-react-hook';
import {store} from './Redux/store';

// Components
import App from './components/App';
import Logo from './components/Logo';
import AccountDetails from './components/OtoCo/UIComponents/AccountDetails';

// Style Sheets
import 'semantic-ui-less/semantic.less'
import './stylesheets/index.less'

import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: 'GTM-NT2CJB3'
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <div id="welcome-pnl">
      <div className="logo-container">
          <Logo />
      </div>
      <App />
    </div>
    <AccountDetails />
    <div className='footer'>
      <a href="http://copyrightFlow.us" target="blank">Documentation and FAQs</a><br/>
      ©️ 2021 Copyright Flow llc.
      </div>
  </StoreContext.Provider>,
  document.getElementById('app')
);




