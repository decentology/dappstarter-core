
import DOM from './dom';
import DappLib from '../../../../src/lib/dapp-lib';

import './dapp-starter.css';
import './img/icon.png';

(async() => {

    let options = {
        network: 'localhost',
        ipfsGateway: {
            host: 'ipfs.infura.io',
            protocol: 'https',
            port: '5001'
        }
    }

    let dappLib = new DappLib(options);
        
    // Read transaction
    dappLib.isActive((error, result) => {
        DOM.display('Active Status', 'Check if contract is active', [{
            label: 'Active Status',
            error: error,
            value: result
        }]);
    });

    // User uploaded file
    DOM.elid('upload').addEventListener('change', async () => {

        let domFiles = DOM.elid('upload').files;
        let files = [];
        for (let f = 0; f < domFiles.length; f++) {
            files.push(domFiles[f]);
        }
        await dappLib.ipfsUpload(files,
            (bytes) => {
                DOM.elid('progress').innerHTML = bytes;
            },
            (result) => {
                if (result.folder) {
                    let fileResults = [];
                    fileResults.push({
                        label: 'Folder',
                        value: `${dappLib.options.ipfsGateway.protocol}://${dappLib.options.ipfsGateway.host}/ipfs/${result.folder}`
                    })
                    result.files.map((file, index) => {
                        fileResults.push({
                            label: `File #${index}`,
                            value: `${file.path} – ${dappLib.options.ipfsGateway.protocol}://${dappLib.options.ipfsGateway.host}/ipfs/${file.hash}`
                        })
                    });
                    DOM.display('IPFS Upload Result', '', fileResults);

                } else {
                    DOM.display('IPFS Upload Result', '', [{
                        label: 'URL',
                        value: 'Upload failed'
                    }]);
                }
            });
    });

    // User-submitted add transaction
    DOM.elid('add-test').addEventListener('click', () => {
        let user = DOM.elid('user').value;
        let ipfsFolderHash = DOM.elid('ipfsfolderhash').value;
        let ipfsDocumentHash = DOM.elid('ipfsdochash').value;

        dappLib.addIpfsDocument(ipfsFolderHash, ipfsDocumentHash, user, (error, result, trackId) => {
            DOM.display('Add Document Result', 'Test addDocument()', [{
                label: 'Result',
                error: error,
                value: trackId
            }]);
        });

    });

    // User-submitted get docs by owner transaction
    DOM.elid('docs-test').addEventListener('click', () => {
        let owner = DOM.elid('owner').value;
        dappLib.getIpfsDocumentsByOwner(owner, (error, result) => {
            let results = [];
            results.push({
                label: 'Owner',
                error: '',
                value: owner
            });
            for (let r = 0; r < result.length; r++) {
                results.push({
                    label: `Document ${r+1}`,
                    error: error ? 'Document error' : '',
                    value: result[r]
                });
            }
            DOM.display('Get Documents Result', 'Test getDocumentsByOwner()', results);
        });
    });

    // User-submitted generate wallet
    DOM.elid('wallet-test').addEventListener('click', () => {
        let wallet = dappLib.createWallet();

        DOM.display('Generate Wallet Result', '', [{
            label: 'Address',
            value: wallet.signingKey.address
        }, {
            label: 'Mnemonic',
            value: wallet.signingKey.mnemonic
        }]);

    });


})();








