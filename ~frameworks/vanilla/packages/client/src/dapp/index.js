import DOM from '../lib/components/shared/dom';
import './pages/components/top-navigation';
import './pages/components/page-navigation';
import './pages/components/page-loader';
import './pages/dapp-page';
import './pages/admin-page';

import '@fortawesome/fontawesome-free/css/all.min.css';
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