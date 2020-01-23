import express from 'express';

// Server code is not available in this beta release of DappStarter

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for My Dapp'
    })
})

export default app;


