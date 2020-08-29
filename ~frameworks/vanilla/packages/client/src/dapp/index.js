import DOM from '../lib/components/shared/dom';
import './pages/components/top-navigation';
import './pages/components/page-loader';
import './pages/dapp';
import './index.css';

DOM.elid('root').appendChild(
    DOM.div({
            className: 'flexible-content'
        },
        [
            DOM.create('top-navigation', { collapse: true }),
            DOM.create('page-loader', {
                id: 'page-loader'
            }),
        ])
);