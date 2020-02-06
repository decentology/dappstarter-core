import DOM from '../dapp/components/shared/dom';
import '../dapp/components/shared/top-navigation';
import '../dapp/components/shared/page-footer';
import '../dapp/components/shared/page-navigation';
import '../dapp/components/shared/page-loader';
import '../dapp/components/pages/home-page';
import '../dapp/components/pages/dapp-page';
import '../dapp/components/pages/admin-page';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbootstrap/css/mdb.min.css';
import './index.css';

DOM.elid('root').appendChild(
    DOM.div({
            className: 'flexible-content'
        },
        [
            DOM.create('top-navigation', { collapse: true }),
            DOM.create('page-navigation'),
            DOM.create('page-loader', {
                id: 'page-loader'
            }),
            DOM.create('page-footer')
        ])
);