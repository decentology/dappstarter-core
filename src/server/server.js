import express from 'express';
import DappClient from '../lib/dapp-client';


let dappClient = new DappClient({
  config: 'localhost',
  server: true
});

dappClient.contract.events.AddDocument({
    fromBlock: 0
  }, function (error, e) {
    if (error) {
      console.log(error);
    }
    console.log(e.event, e);
    // Decode at https://www.rapidtables.com/convert/number/hex-to-ascii.html
});



const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for My Dapp'
    })
})

export default app;


