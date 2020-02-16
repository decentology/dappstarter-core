import express from 'express';
import DappLib from '../lib/dapp-lib';

///+server-event

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for My Dapp'
    })
})

export default app;


