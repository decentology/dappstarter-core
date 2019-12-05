
import DOM from './dom';
import Contract from './contract';
import DappClient from '../lib/dapp-client';

import './dapp-starter.css';
import './icon.png';

(async() => {

    let dappClient = new DappClient({
        config: 'localhost',
        server: false
    });

    let contract = new Contract(dappClient, harness);
        

    function harness(accounts) {

        // User-submitted check active status
        DOM.elid('active').addEventListener('click', () => {
            contract.isActive((error, result) => {
                DOM.display('Active Status', 'Check if contract is active', [ { label: 'Active Status', error: error, value: result} ]);
            });
        });

    
        DOM.elid('sample-account').innerHTML = accounts[0];

        // User uploaded file
        DOM.elid('upload').addEventListener('change', async () => {

            let domFiles = DOM.elid('upload').files;
            let files = [];
            for(let f=0; f<domFiles.length; f++) {
                files.push(domFiles[f]);
            }
            await trqkClient.ipfsUpload(files, { host: host, protocol: protocol, port: port }, true,
            (bytes) => {
                DOM.elid('progress').innerHTML = bytes;
            }, 
            (result) => {
                if (result.folder) {
                    let fileResults = [];
                    fileResults.push({ label: 'Folder', value: `${protocol}://${host}/ipfs/${result.folder}`})
                    result.files.map((file, index) => {
                        fileResults.push({ label: `File #${index}`, value: `${file.path} – ${protocol}://${host}/ipfs/${file.hash}`})
                    });
                    DOM.display('IPFS Upload Result', '', fileResults);

                } else {
                    DOM.display('IPFS Upload Result', '', [ { label: 'URL', value: 'Upload failed'} ]);
                }   
            });
        });
    

        // User-submitted add transaction
        DOM.elid('add-test').addEventListener('click', () => {
            let ipfsHash = DOM.elid('ipfshash').value;
            let owner = DOM.elid('registrant').value;

            contract.addDocument(ipfsHash, owner, (error, result, docId) => {                
                DOM.display('Add Document Result', 'Test addDocument()', [ { label: 'Result', error: error ? 'Document addition failed (possible duplicate)' : '', value: docId} ]);
            });

        });

        // User-submitted get documents by owner transaction
        DOM.elid('docs-test').addEventListener('click', () => {
            let owner = DOM.elid('owner').value;
            contract.getDocumentsByOwner(owner, (error, result) => {    
                let results = [];
                results.push({ label: 'Owner', error: '', value: owner});
                for(let r=0;r<result.length;r++) {
                    results.push({ label: `Document ${r+1}`, error: error ? 'Document error' : '', value: result[r]});
                }            
                DOM.display('Get Documents Result', 'Test getDocumentsByOwner()', results);
            });
        });

        // User-submitted get document transaction
        DOM.elid('doc-test').addEventListener('click', () => {
            let docId = DOM.elid('docid').value;

            contract.getDocument(docId, (error, result) => {    
                let results = [];
                results.push({ label: 'Document ID', error: '', value: docId});
                results.push({ label: 'Timestamp', error: '', value: result.timestamp});
                results.push({ label: 'Owner', error: '', value: result.owner});
                results.push({ label: 'IPFS Hash', error: '', value: result.ipfsHash});
                DOM.display('Get Document Detail Result', 'Test getDocument()', results);
            });

        });
        
    };
    

})();








