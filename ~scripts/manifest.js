const fs = require('fs');
const path = require('path');
const SLASH = path.sep;

module.exports = class Manifest {
    static get ROOT() {
        return 'dappstarter';
    }
    static get ABOUT() {
        return 'about';
    }
    static get TESTS() {
        return 'tests';
    }
    static get BLOCK() {
        return 'block';
    }
    static get BLOCKS() {
        return 'blocks';
    }
    static get RECIPE() {
        return 'recipe';
    }
    static get RECIPES() {
        return 'recipes';
    }
    static get BLOCKCHAIN() {
        return 'blockchain';
    }
    static get BLOCKCHAINS() {
        return 'blockchains';
    }
    static get FRAMEWORK() {
        return 'framework';
    }
    static get FRAMEWORKS() {
        return 'frameworks';
    }
    static get LANGUAGE() {
        return 'language';
    }
    static get LANGUAGES() {
        return 'languages';
    }
    static get CATEGORY() {
        return 'category';
    }
    static get CATEGORIES() {
        return 'categories';
    }
    static get PARAMETERS() {
        return 'parameters';
    }
    static get FEATURE() {
        return 'feature';
    }
    static get FEATURES() {
        return 'features';
    }
    static get SCRIPTS() {
        return 'scripts';
    }
    static get NAME() {
        return 'name';
    }
    static get CHILDREN() {
        return 'children';
    }
    static get NEWLINE() {
        return '\n';
    }
    static get INDENT() {
        return '    ';
    }
    static get TARGETS() {
        return 'targets';
    }
    static get TARGETS_WILDCARD() {
        return '*';
    }
    static get TARGETS_PATH() {
        return 'path';
    }
    static get TARGETS_CONTENT() {
        return 'content';
    }
    static get TARGETS_NAME() {
        return 'name';
    }
    static get TARGETS_SEQUENCE() {
        return 'sequence';
    }
    static get TARGETS_CONTEXT() {
        return 'context';
    }
    static get TARGETS_BLOCKCHAIN() {
        return 'blockchain';
    }
    static get TARGETS_BLOCK() {
        return 'block';
    }
    static get TARGETS_FRAMEWORK() {
        return 'framework';
    }
    static get TARGETS_ACTIONS() {
        return 'actions';
    }

    constructor(dataRoot) {
        this.dataRoot = dataRoot;
        this.components = null;
        this._hydrate(); // Lookup all configuration object files and load into memory as one data structure
    }

    /**
     * @dev Get subset of manifest data
     *
     * @param blockchain Name of blockchain
     * @param language Smart contract language
     * @param category Name of category whose blocks should be returned
     */
    get(blockchain, language, category) {
        let self = this;
        let components = [...self.components];

        // Filter blockchain
        if (blockchain) {
            let blockchainIndex = components.findIndex(element => element.name === Manifest.BLOCKCHAINS);
            if (blockchainIndex > -1) {
                let blockchainItem = components[blockchainIndex][Manifest.CHILDREN].find(element => element.name == blockchain.toLowerCase());
                components[blockchainIndex][Manifest.CHILDREN] = blockchainItem ? [blockchainItem] : [];
            } else {
                components[blockchainIndex][Manifest.CHILDREN] = [];
            }
        }

        // Filter language
        if (language) {
            let languageIndex = components.findIndex(element => element.name === Manifest.LANGUAGES);
            if (languageIndex > -1) {
                let languageItem = components[languageIndex][Manifest.CHILDREN].find(element => element.name == language.toLowerCase());
                if (blockchain && languageItem) {
                    let bcIndex = languageItem[Manifest.BLOCKCHAINS].findIndex(element => element === blockchain.toLowerCase());
                    if (bcIndex < 0) {
                        languageItem = null;
                    }
                }
                components[languageIndex][Manifest.CHILDREN] = languageItem ? [languageItem] : [];
            } else {
                components[languageIndex][Manifest.CHILDREN] = [];
            }
        }

        if (category) {
            let categoryIndex = components.findIndex(element => element.name === Manifest.CATEGORIES);
            if (categoryIndex > -1) {
                let categoryItem = components[categoryIndex][Manifest.CHILDREN].find(element => element.name == category.toLowerCase());
                if (blockchain && categoryItem) {
                    let bcIndex = categoryItem[Manifest.BLOCKCHAINS].findIndex(element => element === blockchain.toLowerCase());
                    if (bcIndex < 0) {
                        categoryItem = null;
                    }
                }
                if (language && categoryItem) {
                    let langIndex = categoryItem[Manifest.LANGUAGES].findIndex(element => element === language.toLowerCase());
                    if (langIndex < 0) {
                        categoryItem = null;
                    }
                }
                components[categoryIndex][Manifest.CHILDREN] = categoryItem ? [categoryItem] : [];
            } else {
                components[categoryIndex][Manifest.CHILDREN] = [];
            }
        }

        return components;
    }

    /** Enumerate and expand all name references with objects
     *   Basic pattern is when an object's name is encountered,
     *   the corresponding JSON file is read and the object's
     *   name (string) is replaced with the JSON file data (object)
     */
    _expand(entityName) {
        let self = this;
        let log = '';
        let index = self.components.findIndex(element => element[Manifest.NAME] === entityName);
        let children = [...self.components[index][Manifest.CHILDREN]];
        self.components[index][Manifest.CHILDREN] = [];
        children.map(entity => {
            let entityItem = self._readJsonFile(`${self.dataRoot}~${entityName}${SLASH}${entity}${SLASH}${entity}.json`);
            self.components[index][Manifest.CHILDREN].push(entityItem);
            log += `${entityName.toUpperCase()} — ${entityItem.title}\n`;
        });
        return log;
    }

    _hydrate() {
        let self = this;
        let log = '';

        self.components = self._readJsonFile(`${self.dataRoot}~${Manifest.ABOUT}${SLASH}${Manifest.ROOT}.json`);
        log += self._expand(Manifest.RECIPES);
        log += self._expand(Manifest.BLOCKCHAINS);
        log += self._expand(Manifest.LANGUAGES);
        log += self._expand(Manifest.FRAMEWORKS);
        log += self._expand(Manifest.CATEGORIES);

        // NOTE: Use arrays instead of dictionaries to control the order of appearance
        //       of elements which is important for UI.

        try {
            // CATEGORIES
            let index = self.components.findIndex(element => element[Manifest.NAME] === Manifest.CATEGORIES);
            let categories = [...self.components[index][Manifest.CHILDREN]];
            self.components[index][Manifest.CHILDREN] = [];
            categories.map(categoryItem => {
                log += `${Manifest.CATEGORY.toUpperCase()} — ${categoryItem[Manifest.NAME]}\n`;

                // BLOCKS
                let blocks = [...categoryItem[Manifest.CHILDREN]];
                categoryItem[Manifest.CHILDREN] = [];
                blocks.map(block => {
                    log += `${Manifest.BLOCK.toUpperCase()} — ${block}\n`;
                    let blockItem = self._readJsonFile(`${self.dataRoot}~${Manifest.CATEGORIES}${SLASH}${categoryItem[Manifest.NAME]}${SLASH}${block}${SLASH}${block}.json`);
                    categoryItem[Manifest.CHILDREN].push(blockItem);
                });

                self.components[index][Manifest.CHILDREN].push(categoryItem);
            });
        } catch (e) {
            throw '\nLast item: \n' + log + '\n' + e.message;
        }
        return log;
    }

    /**
     * @dev Reads, parses and returns a JSON file
     *
     * @param path Location of JSON file
     */
    _readJsonFile(path) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

};