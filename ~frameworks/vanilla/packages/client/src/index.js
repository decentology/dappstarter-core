import DOM from './components/dom';
import './components/top-navigation';
import './components/page-loader';
import './pages/dapp';
import './assets/index.css';

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