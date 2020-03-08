///(import
///)

class sia {

///(functions
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static async addSiaDocument(data) {

        let folder = data.mode === 'folder'; 
        let config = DappLib.getConfig();

        // Push files to SIA
        let siaResult = await DappLib.siaUpload(config, data.files, folder);
        let results = [];
        for(let f=0; f<siaResult.length; f++) {
            let file = siaResult[f];
            let result = await Blockchain.post({
                    config: config,
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: null,
                        gas: 2000000
                    }
                },
                'addSiaDocument',
                file.docId,
                DappLib.fromAscii(data.label || '', 32)
            );
            results.push({
                transactionHash: DappLib.getTransactionHash(result.callData),
                docId: file.docId
            });
        }

        return {
            type: DappLib.DAPP_RESULT_SIA_HASH_ARRAY,
            result: results
        }
    }

    static async getSiaDocument(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                contract: DappLib.DAPP_STATE_CONTRACT,
                params: {
                    from: null
                }
            },
            'getSiaDocument',
            data.id
        );
        if (result.callData) {
            result.callData.docId = result.callData.docId;
            result.callData.docUrl = DappLib.formatSiaHash(result.callData.docId);
            result.callData.label = DappLib.toAscii(result.callData.label);
        }
        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Document Information',
            result: result.callData
        }
    }

    static async getSiaDocumentsByOwner(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                contract: DappLib.DAPP_STATE_CONTRACT,
                params: {
                    from: null
                }
            },
            'getSiaDocumentsByOwner',
            data.account
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'Documents',
            result: result.callData,
            formatter: ['Text-20-5']
        }
    }


    static async onAddSiaDocument(callback) {
        let params = {};
        DappLib.addEventHandler(DappLib.DAPP_STATE_CONTRACT_WS, 'AddSiaDocument', params, callback);
    }

    static async siaUpload(config, files, wrapWithDirectory) {

        // wrapWithDirectory is not supported

        let result = [];
        let apiUrl = `${config.sia.protocol}://${config.sia.host}/skynet/skyfile`;
        for(let f=0; f<files.length; f++) {
            
            let formData = new FormData();
            formData.append('file', files[f]);

            let response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                },
                body: formData
            });

            let data = await response.json();
            result.push({
                docId: data.skylink
            });
        };
        return result;
    }

    static formatSiaHash(a) {
        let config = DappLib.getConfig();
        let url = `${config.sia.protocol}://${config.sia.host}/${a}`;
        return `<strong class="teal lighten-5 p-1 black-text number copy-target" title="${url}"><a href="${url}" target="_new">${a.substr(0,6)}...${a.substr(a.length-4, 4)}</a></strong>${ DappLib.addClippy(a)}`;
    }

///)

    static serverEvent() {
///(server-event
/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FILE STORAGE: SIA  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
DappLib.onAddSiaDocument((result) => {
        console.log(result);
});
///)
    }
    
///(test
                ,siaTestFiles: [
                    "bAAxym_7nhgJ2ik4bigtaAijSE6MPlcxxaPi3Am6860izw",
                    "TABXJcGMxah8uHvHc0EbjPPZs6PprUZoQYdTw8y7cRpywg",
                    "TADiaX-_OmVbuXGr7P1qO4eZtbaIH9U10yRAFBDz8ByEQQ",
                    "nABE5aTWpvRIHRMjWQ-FfPm8oRYwk1K9Fe34SYdXL62qGQ",
                    "VAAEYFNbyjwMBb2u7CAHUhhB0s9mzHtVj-r5GeS0Wyb_Ng",
                    "nAA6F_yfhc8l1cyPziOM0_v8ID810lejD41uJGIs2-wK7g",
                    "XADuEUu7x2LZhMQAMcujCw4b8h9EbzaykKZjtWX9uQnRmQ",
                    "ZAAWYFA9MJn4F7kcczddEfe7i4h_o4-J6SPKJAPkjzXbRA",
                    "ZABYXqcExzRdbkhF4dLP8RZk4HdGcxfCSnteUGs_6H6uYQ",
                    "rABpV_5o0NVE1bweOL0M-ne2TZe60lXIRLQyhn-Hc9FX5g"
                ]
///)

}