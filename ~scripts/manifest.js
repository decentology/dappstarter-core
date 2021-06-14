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

	static get STORAGE_PROVIDER() {
		return 'storage-provider';
	}

	static get STORAGE_PROVIDERS() {
		return 'storage-providers';
	}

	static get WALLET_PROVIDER() {
		return 'wallet-provider';
	}

	static get WALLET_PROVIDERS() {
		return 'wallet-providers';
	}

	static get CATEGORY() {
		return 'category';
	}

	static get CATEGORIES() {
		return 'categories';
	}

	static get PARAMETER() {
		return 'parameter';
	}

	static get PARAMETERS() {
		return 'parameters';
	}

	static get COMPOSABLE() {
		return 'composable';
	}

	static get MODULE() {
		return 'feature';
	}

	static get MODULES() {
		return 'features';
	}

	static get SCRIPTS() {
		return 'scripts';
	}

	static get NAME() {
		return 'name';
	}

	static get SHORTNAME() {
		return 'shortname';
	}

	static get SOURCE() {
		return 'source';
	}

	static get SOURCES() {
		return 'sources';
	}

	static get FOLDER() {
		return 'folder';
	}

	static get CATEGORYFOLDER() {
		return 'categoryFolder';
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
	 * @param category Name of category whose modules should be returned
	 */
	get(blockchain, language, category) {
		const self = this;
		const components = [...self.components];
		console.log('Manifest', components);
		// Filter blockchain
		if (blockchain) {
			const blockchainIndex = components.findIndex(
				(element) => element.name === Manifest.BLOCKCHAINS
			);
			if (blockchainIndex > -1) {
				const blockchainItem = components[blockchainIndex][
					Manifest.CHILDREN
				].find((element) => element.name === blockchain.toLowerCase());
				components[blockchainIndex][Manifest.CHILDREN] = blockchainItem
					? [blockchainItem]
					: [];
			} else {
				components[blockchainIndex][Manifest.CHILDREN] = [];
			}
		}

		// Filter language
		if (language) {
			const languageIndex = components.findIndex(
				(element) => element.name === Manifest.LANGUAGES
			);
			if (languageIndex > -1) {
				let languageItem = components[languageIndex][Manifest.CHILDREN].find(
					(element) => element.name === language.toLowerCase()
				);
				if (blockchain && languageItem) {
					const bcIndex = languageItem[Manifest.BLOCKCHAINS].findIndex(
						(element) => element === blockchain.toLowerCase()
					);
					if (bcIndex < 0) {
						languageItem = null;
					}
				}
				components[languageIndex][Manifest.CHILDREN] = languageItem
					? [languageItem]
					: [];
			} else {
				components[languageIndex][Manifest.CHILDREN] = [];
			}
		}

		if (category) {
			const categoryIndex = components.findIndex(
				(element) => element.name === Manifest.CATEGORIES
			);
			if (categoryIndex > -1) {
				let categoryItem = components[categoryIndex][Manifest.CHILDREN].find(
					(element) => element.name === category.toLowerCase()
				);
				if (blockchain && categoryItem) {
					const bcIndex = categoryItem[Manifest.BLOCKCHAINS].findIndex(
						(element) => element === blockchain.toLowerCase()
					);
					if (bcIndex < 0) {
						categoryItem = null;
					}
				}
				if (language && categoryItem) {
					const langIndex = categoryItem[Manifest.LANGUAGES].findIndex(
						(element) => element === language.toLowerCase()
					);
					if (langIndex < 0) {
						categoryItem = null;
					}
				}
				components[categoryIndex][Manifest.CHILDREN] = categoryItem
					? [categoryItem]
					: [];
			} else {
				components[categoryIndex][Manifest.CHILDREN] = [];
			}
		}
		return components;
	}

	/**  Enumerate and expand all name references with objects
	 *   Basic pattern is when an object's name is encountered,
	 *   the corresponding JSON file is read and the object's
	 *   name (string) is replaced with the JSON file data (object)
	 */
	_expand(entityName) {
		const self = this;
		let log = '';
		const index = self.components.findIndex(
			(element) => element[Manifest.NAME] === entityName
		);
		const children = [...self.components[index][Manifest.CHILDREN]];
		self.components[index][Manifest.CHILDREN] = [];
		children.forEach((entity) => {
			const entityItem = self._readJsonFile(
				`${self.dataRoot}~${entityName}${SLASH}${entity}${SLASH}${entity}.json`
			);
			self.components[index][Manifest.CHILDREN].push(entityItem);
			log += `${entityName.toUpperCase()} — ${entityItem.title}\n`;
		});
		return log;
	}

	_hydrate() {
		const self = this;
		let log = '';

		// NOTE: Use arrays instead of dictionaries to control the order of appearance
		//       of elements which is important for UI.
		try {
			self.components = self._readJsonFile(
				`${self.dataRoot}~${Manifest.ABOUT}${SLASH}${Manifest.ROOT}.json`
			);

			// SOURCES
			self.sources = self.components.find(
				(element) => element[Manifest.NAME] === Manifest.SOURCES
			)[Manifest.CHILDREN];

			log += self._expand(Manifest.RECIPES);
			log += self._expand(Manifest.BLOCKCHAINS);
			log += self._expand(Manifest.LANGUAGES);
			log += self._expand(Manifest.FRAMEWORKS);
			log += self._expand(Manifest.STORAGE_PROVIDERS);
			log += self._expand(Manifest.WALLET_PROVIDERS);

			// CATEGORIES
			const categories = self.components.find(
				(element) => element[Manifest.NAME] === Manifest.CATEGORIES
			)[Manifest.CHILDREN];
			self.sources.forEach((source) => {
				const sourcePath = path.resolve(
					`${self.dataRoot}${SLASH}..${SLASH}${source.folder}`
				);
				const categoryFolders = fs
					.readdirSync(sourcePath, { withFileTypes: true })
					.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
					.map((entry) => entry.name);

				categoryFolders.forEach((categoryFolder) => {
					const categoryItemIndex = categories.findIndex(
						(element) => element[Manifest.NAME] === categoryFolder
					);
					if (categoryItemIndex > -1) {
						// If no prior item exists, initialize the children array
						if (!categories[categoryItemIndex][Manifest.CHILDREN]) {
							categories[categoryItemIndex][Manifest.CHILDREN] = [];
						}

						const categoryFolderPath = `${sourcePath}${SLASH}${categoryFolder}`;
						const moduleFolders = fs
							.readdirSync(categoryFolderPath, { withFileTypes: true })
							.filter(
								(entry) => entry.isDirectory() && !entry.name.startsWith('.')
							)
							.map((entry) => entry.name);
						moduleFolders.forEach((moduleFolder) => {
							const moduleFolderPath = `${categoryFolderPath}${SLASH}${moduleFolder}`;
							log += `${Manifest.BLOCK.toUpperCase()} — ${moduleFolder}\n`;
							const moduleItem = self._readJsonFile(
								`${moduleFolderPath}${SLASH}${moduleFolder}.json`
							);
							moduleItem[Manifest.SHORTNAME] = `${moduleItem[Manifest.NAME]}`;
							moduleItem[Manifest.NAME] = `${source[Manifest.NAME]}-${
								moduleItem[Manifest.NAME]
							}`;
							moduleItem[Manifest.CATEGORYFOLDER] = categoryFolderPath;
							moduleItem[Manifest.SOURCE] = source[Manifest.NAME];
							categories[categoryItemIndex][Manifest.CHILDREN].push(moduleItem);
						});
					}
				});
			});
		} catch (e) {
			throw new Error(`\nLast item: \n${log}\n${e.message}`);
		}
		return log;
	}

	/**
	 * @dev Reads, parses and returns a JSON file
	 *
	 * @param filePath Location of JSON file
	 */
	_readJsonFile(filePath) {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	}
};
