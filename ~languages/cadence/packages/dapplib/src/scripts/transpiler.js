const fs = require("fs");
const path = require("path");
const NEWLINE = '\n';
const TAB = '\t';

(async () => {

  const rootFolder = __dirname + path.sep + '..' + path.sep + '..' + path.sep;
  const cadenceFolder =  rootFolder + 'cadence' + path.sep;
  const destFolder = rootFolder + 'src' + path.sep + 'lib' + path.sep;

  console.log('Transpiler activated');

  // Create dapp-scripts.js from packages/dapplib/cadence/scripts
  generate('scripts');
  
  // Create dapp-transactions.js from packages/dapplib/cadence/transactions
  generate('transactions');

  function generate(type) {

    let sourceFolder = cadenceFolder + type + path.sep;

    // Read the 'scripts' or 'transactions' folder as determined by 'type'
    let items = fs.readdirSync(sourceFolder);
    let prefix = TAB + TAB + TAB + TAB;
    let isTransaction = type === 'transactions';
    // Outermost class wrapper
    let outSource = '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE;
    outSource += '// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/cadence CHANGES' + NEWLINE;
    outSource += '// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN' + NEWLINE;
    outSource += '// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨' + NEWLINE + NEWLINE;
    outSource += 'const fcl = require("@onflow/fcl");' + NEWLINE + NEWLINE;
    outSource += 'module.exports = class Dapp' + (isTransaction ? 'Transactions' : 'Scripts') + ' {' + NEWLINE;

    // For each Cadence file found we are going to create a JS wrapper function
    items.forEach((item) => {
      let code = fs.readFileSync(sourceFolder + item, 'utf8');
      let codeLines = code.split(NEWLINE);

      // Function name (imports only for transactions)
      outSource += NEWLINE + TAB + 'static ' + item.replace('.cdc', '') + '(imports) {' + NEWLINE;

      // All the code is added into a JS template literal so line breaks
      // are preserved. We also need to inject imports at run-time which 
      // a template literal enables quite easily
      outSource += TAB + TAB + 'return fcl.' + (isTransaction ? 'transaction' : 'script') + '`' + NEWLINE;

      // Function body
      codeLines.forEach((line) => {
        if (line.indexOf('import ') > -1) {
          // Skip because we will inject these based on the passed parameter 'imports'
        } else if ((line.indexOf('transaction') > -1) || (line.indexOf('pub ') > -1)) {
          // If it's a transaction, we need to inject imports which
          // are passed as a parameter named 'imports'
          // Each import has a key which is the imported Type
          // and a value which is the account from which to import the type
          outSource += prefix + '${Dapp' +  (isTransaction ? 'Transactions' : 'Scripts') 
                                         + '.injectImports(imports)}' + NEWLINE;
          outSource += prefix + line + NEWLINE;
        } else {
            outSource += prefix + line + NEWLINE;
        }
      });
      outSource += TAB + TAB + '`;';
      outSource += NEWLINE + TAB + '}' + NEWLINE;
    });

    // We include a function that will enumerate the 'imports' parameter 
    // and expand it into individual import lines
      outSource += `
      
      static injectImports(imports) {
        let importCode = '';
        if (imports) {
          for(let key in imports) {
            importCode += '${prefix}import ' + key + ' from 0x' + imports[key].trim().replace('0x','') + '\\n'; 
          };
        }
        return importCode;
      }     

      `  
    outSource += NEWLINE + '}' + NEWLINE;

    // Create dapp-*.js output file based on the type
    fs.writeFileSync(destFolder + 'dapp-' + type + '.js', outSource, 'utf8' )
  }

})();
