const fse = require('fs-extra');
const path = require('path');
const { join } = require('path');
const { merge, padStart } = require('lodash');
const walk = require('walkdir');
const ethers = require('ethers');
const escape = require('escape-string-regexp');
const Phonetic = require('./phonetic');
const Manifest = require('./manifest');

const SKIP_FOLDER_PREFIX = '~';
const FIXED_OUTPUT_FOLDER_KEY = '__outputFolder';
const FRAMEWORKS_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.FRAMEWORKS;
const BLOCKCHAINS_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.BLOCKCHAINS;
const LANGUAGES_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.LANGUAGES;
const TESTS_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.TESTS;
const RECIPES_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.RECIPES;
const ABOUT_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.ABOUT;
const SCRIPTS_FOLDER_NAME = SKIP_FOLDER_PREFIX + Manifest.SCRIPTS;
const DAPPSTARTER_CONFIG_FILE_NAME = 'manifest.json';
const DAPPSTARTER_SETTINGS_FILE_NAME = 'settings.json';
const PROJECT_FILENAME_REPLACE_TEXT = '.project';

const SLASH = path.sep;
const DIRECTIVE_PREFIX = '///';
const DIRECTIVE_LITERAL = `${DIRECTIVE_PREFIX}$`;
const DIRECTIVE_SECTION_BEGIN = `${DIRECTIVE_PREFIX}(`;
const DIRECTIVE_SECTION_END = `${DIRECTIVE_PREFIX})`;
const DIRECTIVE_REPLACE = `${DIRECTIVE_PREFIX}+`;
const DIRECTIVE_PARAMETERS = `${DIRECTIVE_PREFIX}@`;
const IGNORE_ITEMS = [
	FRAMEWORKS_FOLDER_NAME,
	BLOCKCHAINS_FOLDER_NAME,
	RECIPES_FOLDER_NAME,
	TESTS_FOLDER_NAME,
	ABOUT_FOLDER_NAME,
	SCRIPTS_FOLDER_NAME,
	'.DS_Store',
	'.git',
	'.npmignore',
	'.npmrc',
	'generate.js',
	'build',
	'dist',
	'prod',
	'node_modules',
	'package-lock.json',
	'DEVSETUP.md',
];
const NEWLINE = '\n';
const SWAP_PAGES = '___page-list___';
const SWAP_ACCOUNTS = '___test-accounts___';
const SWAP_MNEMONIC = '___test-mnemonic___';
const SWAP_PARAMETERS = 'swap-parameters';
const SWAP_COMPOSABLE = '___composable-list___';
const ACTION_ACCOUNTS = 'accounts';
const DEFAULT_MNEMONIC =
	'pottery movie angle day assault faculty banana rural lyrics hammer believe learn';

module.exports = class Hypergrep {
	static get PROCESSOR() {
		return 'processor';
	}

	static get PROCESSOR_MERGE_BLOCKS() {
		return 'merge-blocks';
	}

	static get PROCESSOR_MERGE_BLOCK_FOLDERS() {
		return 'merge-block-folders';
	}

	static get PROCESSOR_COPY_BLOCK_COMPOSER_FOLDERS() {
		return 'copy-block-composer-folders';
	}

	static get PROCESSOR_FILTER() {
		return 'filter';
	}

	static get PROCESSOR_FILE_BLOCKS() {
		return 'file-blocks';
	}

	static get PROCESSOR_MERGE_JSON() {
		return 'merge-json';
	}

	static get PROCESSOR_COPY_FOLDER() {
		return 'copy-folder';
	}

	static get PROCESSOR_COPY_FILE() {
		return 'copy-file';
	}

	static get PROCESSOR_FRAMEWORK() {
		return 'framework';
	}

	static get PROCESSOR_REPLACE_PARAMETERS() {
		return 'replace-parameters';
	}

	/**
	 * @dev Required options are:
	 *      manifestRoot - Location of the manifest data files
	 */
	constructor(options) {
		this.options = options || {
			sourceRoot: `.${SLASH}dapp`,
			targetRoot: path.join(
				path.dirname(require.main.filename || process.mainModule.filename),
				'.temp'
			),
		};

		this.logLevel = this.options.logLevel || 5; // 0 = none ... 7 = verbose

		function addSlash(o) {
			const n = path.normalize(o);
			return n.endsWith(SLASH) ? n : n + SLASH;
		}
		this.sourceFolder = addSlash(this.options.sourceRoot);
		this.targetFolder = addSlash(this.options.targetRoot);
	}

	_unflatten(config) {
		const newConfig = {
			repository: { ...config.repository },
			__outputFolder: config.__outputFolder || null,
		};
		newConfig[Manifest.BLOCKS] = [];
		Object.keys(config[Manifest.BLOCK]).forEach((blockPath) => {
			// for (const blockPath in config[Manifest.BLOCKS]) {
			const blockFrags = blockPath.split('/').slice(1);
			switch (blockFrags[0]) {
				case Manifest.BLOCKCHAINS:
				case Manifest.BLOCKCHAIN:
					newConfig[Manifest.BLOCKCHAIN] = blockFrags[1];
					if (blockFrags.length > 2) {
						newConfig[Manifest.LANGUAGE] = blockFrags[2];
					}
					break;
				case Manifest.LANGUAGE:
				case Manifest.LANGUAGES:
					newConfig[Manifest.LANGUAGE] = blockFrags[1];
					break;
				case Manifest.CATEGORY:
				case Manifest.CATEGORIES: {
					// This is actually a block...category is just the top level item

					const thisCategory = blockFrags[1];
					const thisBlock = blockFrags[2];

					// Does it already exist?
					let blockItem = newConfig[Manifest.BLOCKS].find(
						(element) =>
							element[Manifest.CATEGORY] === thisCategory &&
							element[Manifest.NAME] === thisBlock
					);

					if (!blockItem) {
						blockItem = {};
						blockItem[Manifest.CATEGORY] = thisCategory;
						blockItem[Manifest.NAME] = thisBlock;
						blockItem[Manifest.PARAMETERS] = {};
						newConfig[Manifest.BLOCKS].push(blockItem);
					}
					if (blockFrags.length > 3) {
						// This is a property value
						blockItem[Manifest.PARAMETERS][blockFrags[3]] =
							config[Manifest.BLOCKS][blockPath];
					}
					break;
				}
				case Manifest.FRAMEWORKS:
				case Manifest.FRAMEWORK:
					newConfig[Manifest.FRAMEWORK] = blockFrags[1];
					break;
				default:
					break;
			}
		});

		return newConfig;
	}

	log(level, depth, info) {
		if (level <= this.logLevel) {
			console.log(
				' '.repeat((depth - 1) * 5) +
					(info.length > 0 && !info.startsWith('{') ? ' ⚙️  ' : '') +
					info
			);
		}
	}

	_enumerateBlockDependencies(config, outputInfo) {
		const self = this;
		self.log(2, 1, `Enumerating selected blocks for dependencies...`);

		// Recurse through the block dependencies
		function getDependencies(
			manifestCategories,
			category,
			block,
			blockParams,
			language
		) {
			self.log(3, 2, `Getting dependencies for: ${category} => ${block}`);
			const categoryInfo = manifestCategories.find(
				(element) => element.name === category
			);
			if (!categoryInfo) {
				return false;
			}
			const moduleInfo = categoryInfo.children.find(
				(element) => element.name === block
			);
			if (!moduleInfo) {
				return false;
			}
			const blockKey = self._getBlockKey(categoryInfo.name, moduleInfo.name);
			if (outputInfo[Manifest.BLOCKS][blockKey]) {
				return true; // Prevent duplicate block processing
			}
			outputInfo[Manifest.BLOCKS][blockKey] = {};
			outputInfo[Manifest.BLOCKS][blockKey][Manifest.CATEGORY] =
				categoryInfo[Manifest.NAME];
			outputInfo[Manifest.BLOCKS][blockKey][Manifest.NAME] =
				moduleInfo[Manifest.NAME];
			outputInfo[Manifest.BLOCKS][blockKey][Manifest.SHORTNAME] =
				moduleInfo[Manifest.SHORTNAME];
			outputInfo[Manifest.BLOCKS][blockKey][Manifest.PARAMETERS] =
				blockParams || {};
			outputInfo[Manifest.BLOCKS][blockKey][Manifest.CATEGORYFOLDER] =
				moduleInfo[Manifest.CATEGORYFOLDER];

			let dependentCategories = [];
			if (moduleInfo.dependencies && moduleInfo.dependencies[language]) {
				dependentCategories = Object.keys(moduleInfo.dependencies[language]);
			}
			dependentCategories.forEach((dependentCategoryName) => {
				const dependentBlockNames =
					moduleInfo.dependencies[language][dependentCategoryName];
				dependentBlockNames.forEach((dependentBlockName) => {
					const dependentBlockKey = `${dependentCategoryName}:${dependentBlockName}`;
					if (!outputInfo[Manifest.BLOCKS][dependentBlockKey]) {
						self.log(
							3,
							3,
							`Found dependency on: ${dependentCategoryName} => ${dependentBlockName}`
						);
						getDependencies(
							manifestCategories,
							dependentCategoryName,
							dependentBlockName,
							{}
						);
					}
				});
			});
			return true;
		}

		for (let b = 0; b < config[Manifest.BLOCKS].length; b += 1) {
			getDependencies(
				outputInfo.categories,
				config[Manifest.BLOCKS][b][Manifest.CATEGORY],
				config[Manifest.BLOCKS][b][Manifest.NAME],
				config[Manifest.BLOCKS][b][Manifest.PARAMETERS],
				config[Manifest.LANGUAGE]
			);
		}
	}

	_getBlockKey(category, name) {
		return `${category}:${name}`;
	}

	_extractCodeSnippets(
		filePath,
		blockKeys,
		parameterValues,
		swapParameterValues,
		sourceFolder
	) {
		const self = this;
		self.log(
			4,
			3,
			`Extracting code snippets from ${filePath.replace(sourceFolder, '')}`
		);
		const snippets = {};
		if (fse.existsSync(filePath)) {
			const code = fse.readFileSync(filePath, 'utf8').split(NEWLINE);

			let openTag = null;
			let codeBlock = '';
			code.forEach((lineText) => {
				if (lineText.trimStart().startsWith(DIRECTIVE_PREFIX)) {
					lineText = lineText.trimStart();
					const tag = `${lineText} `.substr(0, `${lineText} `.indexOf(' '));
					if (tag.startsWith(DIRECTIVE_SECTION_BEGIN)) {
						if (openTag) {
							throw new Error(
								`The section "${openTag}" must end before a new section can be started.`
							);
						}
						openTag = tag
							.replace(DIRECTIVE_SECTION_BEGIN, '')
							.replace(/\r|\n/, '');
						self.log(5, 4, `Found directive to begin section "${openTag}"`);
					} else if (tag.startsWith(DIRECTIVE_SECTION_END)) {
						if (!openTag) {
							throw new Error(
								`End section encountered when no section has been started.`
							);
						}
						// Save accumulated block
						snippets[openTag] = (snippets[openTag] || '') + codeBlock; // Add code to code from other blocks that were already processed
						self.log(6, 4, `Code block: "${codeBlock}"`);
						self.log(5, 4, `Found directive to end section "${openTag}"`);
						openTag = null;
						codeBlock = '';
					} else if (tag.startsWith(DIRECTIVE_LITERAL)) {
						const conditionBlock = tag.replace(DIRECTIVE_LITERAL, '');
						if (blockKeys.indexOf(conditionBlock) > -1) {
							codeBlock += self._replaceCodeParameters(
								lineText.replace(DIRECTIVE_LITERAL + conditionBlock, ''),
								parameterValues,
								swapParameterValues
							);
							self.log(5, 4, `Found conditional literal directive`);
						}
					}
				} else if (openTag) {
					codeBlock += self._replaceCodeParameters(
						lineText,
						parameterValues,
						swapParameterValues
					);
				}
			});
		}
		return snippets;
	}

	_replaceCodeParameters(lineText, parameterValues, swapParameterValues) {
		const self = this;

		if (lineText.indexOf(DIRECTIVE_PARAMETERS) > -1) {
			const lineFrags = lineText.split(DIRECTIVE_PARAMETERS);
			// 0: original line
			// 1: parameter info

			lineText = lineFrags[0]; // Line code without parameter info
			const parameterInfo = JSON.parse(lineFrags[1]);
			self.log(
				5,
				4,
				`Parameter info: ${JSON.stringify(parameterInfo, null, 4)}`
			);
			self.log(
				5,
				4,
				`Parameter values: ${JSON.stringify(parameterValues, null, 4)}`
			);
			self.log(5, 4, `Before replace: ${lineText}`);
			Object.keys(parameterInfo).forEach((key) => {
				if (key === SWAP_PAGES) {
					lineText = lineText.replace(
						parameterInfo[key],
						JSON.stringify(swapParameterValues[SWAP_PAGES], null, 4)
					);
				} else if (key === SWAP_COMPOSABLE) {
					lineText = lineText.replace(
						parameterInfo[key],
						JSON.stringify(swapParameterValues[SWAP_COMPOSABLE], null, 4)
					);
				} else if (key === SWAP_ACCOUNTS) {
					lineText = lineText.replace(
						parameterInfo[key],
						swapParameterValues[SWAP_ACCOUNTS]
					);
				} else if (key === SWAP_MNEMONIC) {
					lineText = lineText.replace(
						parameterInfo[key],
						swapParameterValues[SWAP_MNEMONIC]
					);
				} else {
					if (parameterValues && !parameterValues[key]) {
						throw new Error(
							`Value for required parameter "${key}" not specified`
						);
					}
					lineText = lineText.replace(parameterInfo[key], parameterValues[key]);
				}
			});
			self.log(5, 4, `After replace: ${lineText}`);
		}
		return lineText + NEWLINE;
	}

	_filterContext(sourceContent, outputInfo) {
		const self = this;
		const code = sourceContent.split(NEWLINE);

		let filteredContent = '';
		let openTag = null;
		let include = false;
		code.forEach((lineText) => {
			if (lineText.trimStart().startsWith(DIRECTIVE_PREFIX)) {
				lineText = lineText.trimStart();
				const tag = `${lineText} `.substr(0, `${lineText} `.indexOf(' '));
				if (tag.startsWith(DIRECTIVE_SECTION_BEGIN)) {
					if (openTag) {
						throw new Error(
							`The section "${openTag}" must end before a new section can be started.`
						);
					}
					openTag = tag.replace(DIRECTIVE_SECTION_BEGIN, '');
					const context = openTag.split(':')[0];
					// The context can be any config property
					if (context === Manifest.BLOCKCHAIN) {
						include = openTag.indexOf(outputInfo[Manifest.BLOCKCHAIN]) > -1;
					} else if (context === Manifest.FRAMEWORK) {
						include = openTag.indexOf(outputInfo[Manifest.FRAMEWORK]) > -1;
					} else if (context === Manifest.LANGUAGE) {
						include = openTag.indexOf(outputInfo[Manifest.LANGUAGE].name) > -1;
					} else {
						include = false;
					}
					self.log(5, 4, `Found directive to begin section "${openTag}"`);
				} else if (tag.startsWith(DIRECTIVE_SECTION_END)) {
					if (!openTag) {
						throw new Error(
							`End section encountered when no section has been started.`
						);
					}
					self.log(5, 4, `Found directive to end section "${openTag}"`);
					openTag = null;
				}
			} else {
				// Include code for context or code outside of a directive
				if (openTag) {
					if (include) {
						filteredContent += self._replaceCodeParameters(
							lineText,
							null,
							outputInfo[SWAP_PARAMETERS]
						);
					} else {
						// do nothing
					}
				} else {
					filteredContent += self._replaceCodeParameters(
						lineText,
						null,
						outputInfo[SWAP_PARAMETERS]
					);
				}
			}
		});

		return filteredContent;
	}

	_filterContextIntoFile(filePath, sourceFolder, targetFolder, outputInfo) {
		const self = this;

		self.log(
			3,
			2,
			`Filtering context into ${filePath.replace(sourceFolder, '')}`
		);
		// STEP 1: Process directives in file
		let filteredContent = '';
		if (fse.existsSync(filePath)) {
			const sourceContent = fse.readFileSync(filePath, 'utf8');

			// STEP 2: Look for directives matching the context name. For example,
			//         if name = 'blockchain' and current blockchain is 'ethereum'
			//         then look for directive ///(ethereum and include that code
			//         while skipping other directive code blocks
			filteredContent = self._filterContext(sourceContent, outputInfo);

			// STEP 3: Write the file with filtered code to the output folder
			const outfilePath = filePath.replace(sourceFolder, targetFolder);
			self.log(
				3,
				2,
				`Writing file: ${outfilePath.replace(outputInfo.targetFolder, '')}`
			);
			fse.writeFileSync(outfilePath, filteredContent);
		}
	}

	_mergeBlockFolders(
		filePath,
		blockPathTemplate,
		sourceFolder,
		targetFolder,
		outputInfo,
		sequence
	) {
		const self = this;
		self.log(
			3,
			2,
			`Merging code folders for ${filePath.replace(sourceFolder, '')}`
		);

		const blockKeys = Object.keys(outputInfo[Manifest.BLOCKS]);
		blockKeys.forEach((blockKey) => {
			self.log(3, 2, `Merging Block folder: ${blockKey}`);
			const block = outputInfo[Manifest.BLOCKS][blockKey];

			// JS doesn't support template literals in a string variable so we
			// have to replace "blockPath" values with regex + function
			block[Manifest.NAME] = block[Manifest.SHORTNAME];
			const blockPath = blockPathTemplate.replace(
				/\$\{(\w+)\}/g,
				(_, key) => block[key] || '?'
			);
			let outfilePath = filePath.replace(sourceFolder, targetFolder);
			outfilePath = outfilePath.replace(
				SLASH +
					LANGUAGES_FOLDER_NAME +
					SLASH +
					outputInfo[Manifest.LANGUAGE].name,
				''
			);
			outfilePath = outfilePath.substr(0, outfilePath.lastIndexOf(SLASH) + 1);

			// Copy all files from subfolders of blockPath to outfilePath
			const folders = fse
				.readdirSync(blockPath, { withFileTypes: true })
				.filter((dir) => dir.isDirectory())
				.map((dir) => dir.name);

			folders.forEach((folder) => {
				if (folder !== 'composer') {
					fse.copy(blockPath + folder, outfilePath + folder, (err) => {
						if (err) return console.error(err);
						return null;
					});
				}
			});
		});
	}

	_copyBlockComposerFolders(
		filePath,
		blockPathTemplate,
		targetFolder,
		outputInfo
	) {
		const self = this;
		self.log(3, 2, `Copying composer code folders`);

		const blockKeys = Object.keys(outputInfo[Manifest.BLOCKS]);
		const outputPath = path.join(targetFolder, 'workspace', 'composer');
		const packagesPath = path.join(targetFolder, 'packages');
		blockKeys.forEach((blockKey, index) => {
			self.log(3, 2, `Merging Block folder: ${blockKey}`);
			const block = outputInfo[Manifest.BLOCKS][blockKey];
			const category = outputInfo[Manifest.CATEGORIES].find(
				(item) => item[Manifest.NAME] === block[Manifest.CATEGORY]
			);
			const module = category.children.find(
				(item) => item[Manifest.NAME] === block[Manifest.NAME]
			);
			const composable = module.composable || false;
			if (composable === true) {
				fse.ensureDirSync(path.join(outputPath, module[Manifest.SHORTNAME]));

				// JS doesn't support template literals in a string variable so we
				// have to replace "blockPath" values with regex + function
				block[Manifest.NAME] = block[Manifest.SHORTNAME];
				let blockPath = blockPathTemplate.replace(
					/\$\{(\w+)\}/g,
					(_, key) => block[key] || '?'
				);
				blockPath = path.join(blockPath, 'composer');

				const blockConfigPath = path.join(blockPath, 'composer.json');
				const blockConfig = JSON.parse(fse.readFileSync(blockConfigPath));

				fse.copy(
					blockConfigPath,
					path.join(outputPath, module[Manifest.SHORTNAME], 'composer.json'),
					(err) => {
						if (err) return console.error(err);
						return null;
					}
				);

				// Copy all files from subfolders of blockPath to outfilePath
				// These will be in the format {option name}-{option value}
				const folders = fse
					.readdirSync(blockPath, { withFileTypes: true })
					.filter((dir) => dir.isDirectory())
					.map((dir) => dir.name);

				folders.forEach((folder) => {
					const optionName = folder.split('-')[0];
					const optionValue = folder.split('-')[1];
					let isDefault = false;
					if (blockConfig[optionName].default === optionValue) {
						isDefault = true;
					}

					if (fse.existsSync(path.join(blockPath, folder, 'preview.png'))) {
						fse.copy(
							path.join(blockPath, folder, 'preview.png'),
							path.join(
								outputPath,
								module[Manifest.SHORTNAME],
								folder,
								'preview.png'
							),
							(err) => {
								if (err) return console.error(err);
								return null;
							}
						);
					}

					const subfolders = fse
						.readdirSync(path.join(blockPath, folder), { withFileTypes: true })
						.filter((dir) => dir.isDirectory())
						.map((dir) => dir.name);

					subfolders.forEach((subfolder) => {
						if (subfolder === 'client') {
							fse.copy(
								path.join(blockPath, folder, subfolder),
								path.join(
									outputPath,
									module[Manifest.SHORTNAME],
									folder,
									subfolder,
									'src',
									'components',
									module[Manifest.SHORTNAME],
									optionName
								),
								(err) => {
									if (err) return console.error(err);
									return null;
								}
							);

							if (isDefault === true) {
								const clientRoot = path.join(
									packagesPath,
									'client',
									'src',
									'components',
									module[Manifest.SHORTNAME],
									optionName
								);

								fse.copy(
									path.join(blockPath, folder, subfolder),
									clientRoot,
									(err) => {
										if (err) return console.error(err);
										return null;
									}
								);
							}
						} else if (subfolder === 'dapplib') {
							let blockTargetPath = path.join(
								'dapplib',
								'contracts',
								'imports',
								module[Manifest.SHORTNAME],
								optionName
							);

							// Imports folder needs to be in a specific place for Cadence
							if (outputInfo[Manifest.LANGUAGE].name === 'cadence') {
								blockTargetPath = path.join(
									'dapplib',
									'contracts',
									'project',
									'imports'
								);
							}

							fse.copy(
								path.join(blockPath, folder, subfolder),
								path.join(
									outputPath,
									module[Manifest.SHORTNAME],
									folder,
									blockTargetPath
								),
								(err) => {
									if (err) return console.error(err);
									return null;
								}
							);

							if (isDefault === true) {
								const dapplibRoot = path.join(packagesPath, blockTargetPath);

								fse.copy(
									path.join(blockPath, folder, subfolder),
									dapplibRoot,
									(err) => {
										if (err) return console.error(err);
										return null;
									}
								);
							}
						}
					});
				});
			}
		});
	}

	_mergeBlocksIntoFile(
		expand,
		filePath,
		blockPathTemplate,
		sourceFolder,
		targetFolder,
		outputInfo,
		sequence
	) {
		const self = this;
		self.log(
			3,
			2,
			`Merging code snippets for ${filePath.replace(sourceFolder, '')}`
		);
		// STEP 1: Get the source file template and decide if:
		//         a) merge block code and write it to same file name as input file to output
		//         b) for each block code, create a separate file with name of block in output
		const sourceCodeText = fse.readFileSync(filePath, 'utf8');

		// STEP 2: Create a dictionary of all the replacement block code using
		//         the directive suffix as key
		let codeSnippets = {};
		const blockKeys = Object.keys(outputInfo[Manifest.BLOCKS]);
		const padLength =
			String(blockKeys.length).length < 2 ? 2 : String(blockKeys.length).length;

		blockKeys.forEach((blockKey, index) => {
			self.log(3, 2, `Merging BlockKey: ${blockKey}`);
			const block = outputInfo[Manifest.BLOCKS][blockKey];
			// JS doesn't support template literals in a string variable so we
			// have to replace "blockPath" values with regex + function
			block[Manifest.NAME] = block[Manifest.SHORTNAME]; // Fully qualified name is not used in folder names
			const blockPath = blockPathTemplate.replace(
				/\$\{(\w+)\}/g,
				(_, key) => block[key] || '?'
			);
			const snippets = self._extractCodeSnippets(
				blockPath,
				blockKeys,
				block[Manifest.PARAMETERS],
				outputInfo[SWAP_PARAMETERS],
				sourceFolder
			);
			Object.keys(snippets).forEach((snippetKey) => {
				if (codeSnippets[snippetKey]) {
					codeSnippets[snippetKey] += snippets[snippetKey];
				} else {
					codeSnippets[snippetKey] = snippets[snippetKey];
				}
			});

			// STEP 3: Write the file with merged/replaced code to the output folder
			if (expand || index === blockKeys.length - 1) {
				let finalText = sourceCodeText;

				// Reduce any snippets that have a key with a filter in the format
				// [key]:[filter]:[filter-value]  example: functions:language:solidity
				// We aggregate these key values and send them off to be filtered, then
				// cleanup codeSnippets so it has only the key value sans filter stuff
				const filteredCodeSnippets = {};
				Object.keys(codeSnippets).forEach((key) => {
					const keyFrags = key.split(':');
					if (keyFrags.length === 3) {
						const filteredCode = self._filterContext(
							`${DIRECTIVE_SECTION_BEGIN}${keyFrags[1]}:${keyFrags[2]}\n${codeSnippets[key]}\n${DIRECTIVE_SECTION_END}`,
							outputInfo
						);
						if (filteredCode.length > 0) {
							if (
								Object.prototype.hasOwnProperty.call(
									filteredCodeSnippets,
									keyFrags[0]
								)
							) {
								filteredCodeSnippets[keyFrags[0]] += filteredCode;
							} else {
								filteredCodeSnippets[keyFrags[0]] = filteredCode;
							}
						}
					} else {
						filteredCodeSnippets[key] = codeSnippets[key];
					}
				});
				Object.keys(filteredCodeSnippets).forEach((key) => {
					finalText = finalText.replace(
						DIRECTIVE_REPLACE + key,
						filteredCodeSnippets[key]
					);
				});

				let outfilePath = filePath.replace(sourceFolder, targetFolder);
				outfilePath = outfilePath.replace(
					SLASH +
						LANGUAGES_FOLDER_NAME +
						SLASH +
						outputInfo[Manifest.LANGUAGE].name,
					''
				);
				if (expand) {
					const outfileName = path.parse(blockPath).name;
					outfilePath = outfilePath.replace(
						path.parse(filePath).name,
						sequence
							? `${padStart(index, padLength, '0')}-${outfileName}`
							: outfileName
					);
					if (Object.keys(snippets).length > 0) {
						self.log(
							3,
							2,
							`Writing file: ${outfilePath.replace(
								outputInfo.targetFolder,
								''
							)}`
						);
						fse.writeFileSync(outfilePath, finalText);
					}

					codeSnippets = {};
				} else {
					self.log(
						3,
						2,
						`Writing file: ${outfilePath.replace(outputInfo.targetFolder, '')}`
					);
					fse.writeFileSync(outfilePath, finalText);
				}
			}
		});
		if (blockKeys.length === 0) {
			const finalText = sourceCodeText;
			let outfilePath = filePath.replace(sourceFolder, targetFolder);
			outfilePath = outfilePath.replace(
				SLASH +
					LANGUAGES_FOLDER_NAME +
					SLASH +
					outputInfo[Manifest.LANGUAGE].name,
				''
			);
			self.log(
				3,
				2,
				`Writing file: ${outfilePath.replace(outputInfo.targetFolder, '')}`
			);
			fse.writeFileSync(outfilePath, finalText);
		}
	}

	_replaceParametersInFile(filePath, sourceFolder, targetFolder, outputInfo) {
		const self = this;
		const swapParameterValues = outputInfo[SWAP_PARAMETERS];
		self.log(
			3,
			2,
			`Replacing parameters in file for ${filePath.replace(sourceFolder, '')}`
		);

		if (fse.existsSync(filePath)) {
			const code = self
				._filterContext(fse.readFileSync(filePath, 'utf8'), outputInfo)
				.split(NEWLINE);

			let codeBlock = '';
			code.forEach((lineText) => {
				codeBlock += self._replaceCodeParameters(
					lineText,
					null,
					swapParameterValues
				);
			});
			const outfilePath = filePath.replace(sourceFolder, targetFolder);
			self.log(3, 2, `Writing file: ${outfilePath.replace(targetFolder, '')}`);
			fse.writeFileSync(outfilePath, codeBlock);
		}
	}

	_injectJsonIntoFile(
		filePath,
		blockchainContent,
		frameworkContent,
		blockContent,
		sourceFolder,
		targetFolder,
		outputInfo
	) {
		const self = this;
		self.log(
			3,
			2,
			`Injecting JSON content for ${filePath.replace(sourceFolder, '')}`
		);

		// Get the source file and parse JSON
		const sourceJson = JSON.parse(fse.readFileSync(filePath, 'utf8'));

		// Inject JSON content into source
		const targetJson = merge(
			{},
			sourceJson,
			blockchainContent[Manifest.TARGETS_WILDCARD],
			blockchainContent[outputInfo[Manifest.BLOCKCHAIN]],
			frameworkContent[Manifest.TARGETS_WILDCARD],
			frameworkContent[outputInfo[Manifest.FRAMEWORK]],
			blockContent
		);

		// Write the file with injected code to the output folder
		const outfilePath = filePath.replace(sourceFolder, targetFolder);
		self.log(
			3,
			2,
			`Writing file: ${outfilePath.replace(outputInfo.targetFolder, '')}`
		);
		fse.writeFileSync(outfilePath, JSON.stringify(targetJson, null, 4));
	}

	_copyFolder(context, name, sourceFolder, targetFolder) {
		const self = this;
		self.log(3, 2, `Copying ${context} folder for "${name}"`);
		fse.copySync(sourceFolder, targetFolder);
	}

	static _stringToBuffer(string) {
		const arrayBuffer = new ArrayBuffer(string.length * 1);
		const newUint = new Uint8Array(arrayBuffer);
		newUint.forEach((_, i) => {
			newUint[i] = string.charCodeAt(i);
		});
		return newUint;
	}

	_generateAccounts(accountSeed, count = 10) {
		const hdPath = "m/44'/60'/0'/0";
		const bytes = Hypergrep._stringToBuffer(
			`${accountSeed}0000000000000000`.substr(0, 16)
		);
		const mnemonic = accountSeed
			? ethers.utils.HDNode.entropyToMnemonic(bytes)
			: DEFAULT_MNEMONIC;
		const accounts = [];
		for (let c = 0; c < count; c += 1) {
			const wallet = ethers.Wallet.fromMnemonic(mnemonic, `${hdPath}/${c}`);
			accounts.push(wallet.signingKey.privateKey);
		}
		const keysTemp = JSON.stringify(accounts, null, 4);
		// Truffle HDWalletprovider is dumb and uses a space character to
		// distinguish between mnemonic string and private key array
		// so we have to remove spaces
		return {
			accounts: keysTemp.replace(/ /g, ''),
			mnemonic: mnemonic,
		};
	}

	_copyFile(context, name, sourceFile, targetFile, actions, outputInfo) {
		const self = this;
		const swapParameterValues = outputInfo[SWAP_PARAMETERS];
		self.log(
			3,
			2,
			`Copying file "${name}" with context customization for ${context}`
		);

		const code = self
			._filterContext(fse.readFileSync(sourceFile, 'utf8'), outputInfo)
			.split(NEWLINE);

		let codeBlock = '';
		code.forEach((lineText) => {
			if (actions) {
				actions.forEach((action) => {
					switch (action) {
						case ACTION_ACCOUNTS:
							if (lineText.indexOf(DIRECTIVE_PARAMETERS) > -1) {
								lineText = self._replaceCodeParameters(
									lineText,
									null,
									swapParameterValues
								);
							} else {
								lineText += NEWLINE;
							}
							break;
						default:
							lineText += NEWLINE;
							break;
					}
				});
				codeBlock += lineText;
			} else {
				codeBlock += lineText + NEWLINE;
			}
		});
		fse.writeFileSync(targetFile, codeBlock);
	}

	static _generateFolderName() {
		const hash = Math.random().toString(16).substr(2);
		const adjIndex = Math.floor(Math.random() * Phonetic.ADJECTIVES.length);

		const name = Phonetic.generate({
			seed: hash,
		});
		return `${Phonetic.ADJECTIVES[adjIndex]}-${name}`;
	}

	_processFile(filePath, sourceFolder, targetFolder, outputInfo) {
		const self = this;

		let pathFrag = filePath.replace(sourceFolder, SLASH);
		if (outputInfo[Manifest.TARGETS][pathFrag]) {
			self.log(2, 1, `Processing file: ${pathFrag}`);
			switch (outputInfo[Manifest.TARGETS][pathFrag][Hypergrep.PROCESSOR]) {
				// Merge each block with source file and save as a single file
				case Hypergrep.PROCESSOR_MERGE_BLOCKS:
					self._mergeBlocksIntoFile(
						false,
						filePath,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_PATH],
						sourceFolder,
						targetFolder,
						outputInfo
					);
					break;

				case Hypergrep.PROCESSOR_MERGE_BLOCK_FOLDERS:
					self._mergeBlockFolders(
						filePath,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_PATH],
						sourceFolder,
						targetFolder,
						outputInfo
					);
					break;

				case Hypergrep.PROCESSOR_COPY_BLOCK_COMPOSER_FOLDERS:
					self._copyBlockComposerFolders(
						filePath,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_PATH],
						targetFolder,
						outputInfo
					);
					break;

				// Merge each block with source file and save as a separate file
				case Hypergrep.PROCESSOR_FILE_BLOCKS:
					self._mergeBlocksIntoFile(
						true,
						filePath,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_PATH],
						sourceFolder,
						targetFolder,
						outputInfo,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_SEQUENCE]
					);
					break;

				// Replace parameters in a file
				case Hypergrep.PROCESSOR_REPLACE_PARAMETERS:
					self._replaceParametersInFile(
						filePath,
						sourceFolder,
						targetFolder,
						outputInfo
					);
					break;

				// Merge JSON at block, language and blockchain level into a file
				case Hypergrep.PROCESSOR_MERGE_JSON: {
					// Filter block content only for selected blocks
					const blockContentRaw =
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_BLOCK];
					let blockContent = {};
					Object.keys(blockContentRaw).forEach((blockKey) => {
						if (outputInfo[Manifest.BLOCKS][blockKey]) {
							blockContent = merge(blockContent, blockContentRaw[blockKey]);
						}
					});
					self._injectJsonIntoFile(
						filePath,
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_BLOCKCHAIN],
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_FRAMEWORK],
						blockContent,
						sourceFolder,
						targetFolder,
						outputInfo
					);
					break;
				}
				case Hypergrep.PROCESSOR_FILTER:
					self._filterContextIntoFile(
						filePath,
						sourceFolder,
						targetFolder,
						outputInfo
					);
					break;

				// Copy folder or copy file with contextual parameter replacement
				case Hypergrep.PROCESSOR_COPY_FOLDER:
				case Hypergrep.PROCESSOR_COPY_FILE: {
					const copy =
						outputInfo[Manifest.TARGETS][pathFrag][Hypergrep.PROCESSOR] ===
						Hypergrep.PROCESSOR_COPY_FOLDER;
					let info = '';
					const context =
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_CONTEXT];
					const actions =
						outputInfo[Manifest.TARGETS][pathFrag][Manifest.TARGETS_ACTIONS];
					pathFrag = copy
						? pathFrag.replace(path.basename(pathFrag), '')
						: pathFrag;
					if (context === Manifest.BLOCKCHAIN) {
						info = `${Manifest.BLOCKCHAIN} "${
							outputInfo[Manifest.BLOCKCHAIN]
						}"`;
						sourceFolder =
							sourceFolder +
							BLOCKCHAINS_FOLDER_NAME +
							SLASH +
							outputInfo[Manifest.BLOCKCHAIN] +
							pathFrag;
					} else if (context === Manifest.FRAMEWORK) {
						info = `${Manifest.FRAMEWORK} "${outputInfo[Manifest.FRAMEWORK]}"`;
						sourceFolder =
							sourceFolder +
							FRAMEWORKS_FOLDER_NAME +
							SLASH +
							outputInfo[Manifest.FRAMEWORK] +
							pathFrag;
					}
					targetFolder += pathFrag.substr(1);
					targetFolder = targetFolder.replace(
						PROJECT_FILENAME_REPLACE_TEXT,
						''
					);
					if (copy) {
						self._copyFolder(info, pathFrag, sourceFolder, targetFolder);
					} else {
						// Source and target are a file, not folder
						sourceFolder = sourceFolder.replace(
							SLASH +
								LANGUAGES_FOLDER_NAME +
								SLASH +
								outputInfo[Manifest.LANGUAGE].name,
							''
						);
						targetFolder = targetFolder.replace(
							SLASH +
								LANGUAGES_FOLDER_NAME +
								SLASH +
								outputInfo[Manifest.LANGUAGE].name,
							''
						);
						self._copyFile(
							info,
							pathFrag,
							sourceFolder,
							targetFolder,
							actions,
							outputInfo
						);
					}
					break;
				}
				default:
					break;
			}
		} else {
			let destFile = filePath.replace(sourceFolder, targetFolder);
			destFile = destFile.replace(
				SLASH +
					LANGUAGES_FOLDER_NAME +
					SLASH +
					outputInfo[Manifest.LANGUAGE].name,
				''
			);
			fse.copyFile(filePath, destFile, () => {});
			self.log(5, 1, `Copying file: ${pathFrag}`);
		}
	}

	_mustIgnore(p, folder) {
		if (p.includes(join('dappstarter-core', 'node_modules'))) {
			return true;
		}

		if (p.indexOf('@decentology') > -1) {
			p = p.substr(p.indexOf('@decentology'));
		}

		// Filter out langage configuration files from languages folder
		if (
			!folder &&
			p.indexOf(LANGUAGES_FOLDER_NAME) > -1 &&
			p.endsWith('.json')
		) {
			const lastPart = p
				.split(LANGUAGES_FOLDER_NAME + SLASH)[1]
				.replace('.json', '');
			if (lastPart.indexOf(SLASH) > 0) {
				const frags = lastPart.split(SLASH);
				if (frags[0] === frags[1]) {
					return true;
				}
			}
		}
		for (let f = 0; f < IGNORE_ITEMS.length; f += 1) {
			const search = new RegExp(
				`${
					escape(SLASH + IGNORE_ITEMS[f]) + (folder ? `${escape(SLASH)}.*` : '')
				}$`
			);
			if (p.match(search) || p.startsWith(IGNORE_ITEMS[f])) {
				if (folder) {
					IGNORE_ITEMS.push(p);
				}
				return true;
			}
		}
		return false;
	}

	_isOtherLanguage(p, currentLanguage) {
		if (p.indexOf(LANGUAGES_FOLDER_NAME) > -1) {
			if (p.indexOf(LANGUAGES_FOLDER_NAME + SLASH + currentLanguage) > -1) {
				return false;
			}
			return true;
		}
		return false;
	}

	getManifest(blockchain, language, category) {
		const self = this;
		return new Manifest(self.sourceFolder).get(blockchain, language, category);
	}

	_generatePages(outputInfo) {
		const pages = [];
		Object.keys(outputInfo[Manifest.BLOCKS]).forEach((blockKey) => {
			const category = outputInfo[Manifest.CATEGORIES].find(
				(element) =>
					element[Manifest.NAME] ===
					outputInfo[Manifest.BLOCKS][blockKey][Manifest.CATEGORY]
			);
			const categoryBlocks = category[Manifest.CHILDREN];
			const moduleItem = categoryBlocks.find(
				(element) =>
					element[Manifest.NAME] ===
					outputInfo[Manifest.BLOCKS][blockKey][Manifest.NAME]
			);
			pages.push({
				name: moduleItem.name,
				title: moduleItem.title,
				description: moduleItem.description,
				category: category.title,
				route: `/${moduleItem.name}`,
			});
		});
		pages.sort((a, b) => (a.title > b.title ? 1 : -1));
		outputInfo[SWAP_PARAMETERS][SWAP_PAGES] = pages;
	}

	_generateComposable(outputInfo) {
		const composable = [];
		Object.keys(outputInfo[Manifest.BLOCKS]).forEach((blockKey) => {
			const category = outputInfo[Manifest.CATEGORIES].find(
				(element) =>
					element[Manifest.NAME] ===
					outputInfo[Manifest.BLOCKS][blockKey][Manifest.CATEGORY]
			);
			const categoryBlocks = category[Manifest.CHILDREN];
			const moduleItem = categoryBlocks.find(
				(element) =>
					element[Manifest.NAME] ===
					outputInfo[Manifest.BLOCKS][blockKey][Manifest.NAME]
			);
			if (moduleItem.composable === true) {
				composable.push({
					name: `${moduleItem.name}-composer`,
					title: moduleItem.title,
					description: moduleItem.description,
					category: category.title,
					route: `/${moduleItem.name}`,
				});
			}
		});
		composable.sort((a, b) => (a.title > b.title ? 1 : -1));
		outputInfo[SWAP_PARAMETERS][SWAP_COMPOSABLE] = composable;
	}

	process(settings, callback) {
		return new Promise((resolve, reject) => {
			try {
				const self = this;
				let gracefulCompletion = true;
				const config = self._unflatten(settings);
				const outputInfo = {
					manifest: self.getManifest(
						config[Manifest.BLOCKCHAIN],
						config[Manifest.LANGUAGE]
					),
				};
				outputInfo[Manifest.BLOCKS] = {};
				outputInfo[SWAP_PARAMETERS] = {};
				const accountSeed = config[FIXED_OUTPUT_FOLDER_KEY]
					? null
					: Hypergrep._generateFolderName();
				const accountInfo = self._generateAccounts(accountSeed);

				outputInfo[SWAP_PARAMETERS][SWAP_ACCOUNTS] = accountInfo.accounts;
				outputInfo[SWAP_PARAMETERS][SWAP_MNEMONIC] = accountInfo.mnemonic;

				const sourceFolder = path.normalize(self.sourceFolder + SLASH);
				const targetFolder = path.normalize(
					self.targetFolder +
						(config[FIXED_OUTPUT_FOLDER_KEY] || accountSeed) +
						SLASH
				);

				if (callback == null) {
					callback = () => {}; // Using promises. Noop callback
				}
				outputInfo[Manifest.BLOCKCHAIN] = config[Manifest.BLOCKCHAIN];
				outputInfo[Manifest.FRAMEWORK] = config[Manifest.FRAMEWORK];
				outputInfo[Manifest.LANGUAGE] = outputInfo.manifest.find(
					(element) => element[Manifest.NAME] === Manifest.LANGUAGES
				)[Manifest.CHILDREN][0];
				outputInfo[Manifest.CATEGORIES] = outputInfo.manifest.find(
					(element) => element[Manifest.NAME] === Manifest.CATEGORIES
				)[Manifest.CHILDREN];

				const languageTarget =
					outputInfo[Manifest.LANGUAGE] &&
					outputInfo[Manifest.LANGUAGE][Manifest.TARGETS] &&
					outputInfo[Manifest.LANGUAGE][Manifest.TARGETS][
						Manifest.TARGETS_WILDCARD
					];
				const languageTargetBlockchain =
					outputInfo[Manifest.LANGUAGE] &&
					outputInfo[Manifest.LANGUAGE][Manifest.TARGETS] &&
					outputInfo[Manifest.LANGUAGE][Manifest.TARGETS][Manifest.BLOCKCHAIN];

				outputInfo[Manifest.TARGETS] = merge(
					{},
					outputInfo.manifest.find(
						(x) => x[Manifest.NAME] === Manifest.BLOCKCHAINS
					)[Manifest.TARGETS][Manifest.TARGETS_WILDCARD],
					languageTarget,
					languageTargetBlockchain
				);
				self.log(1, 1, 'START');
				self.log(1, 1, 'Configuration:');
				self.log(1, 1, '');
				self.log(1, 1, '');
				self.log(1, 2, JSON.stringify(config, null, 4));
				self.log(1, 1, '');
				self.log(1, 1, '');

				self.log(2, 1, `Project root folder: ${sourceFolder}`);

				self.log(3, 1, `Creating output folder: ${targetFolder}`);
				// if (!fse.existsSync(targetFolder)) {
				//     fse.mkdirSync(targetFolder, {
				//         recursive: true
				//     });
				// }

				fse.ensureDirSync(`${targetFolder}packages${SLASH}dapplib`);
				fse.writeFileSync(
					`${targetFolder}packages${SLASH}dapplib${SLASH}${DAPPSTARTER_CONFIG_FILE_NAME}`,
					JSON.stringify(config, null, 4)
				);

				// Write input file as-is for diagnostics
				fse.writeFileSync(
					`${targetFolder}${SLASH}${DAPPSTARTER_SETTINGS_FILE_NAME}`,
					JSON.stringify(settings, null, 4)
				);

				// Copy base language-specific files
				// self._copyFolder(
				//     `${Manifest.LANGUAGE}`,
				//     `${outputInfo[Manifest.LANGUAGE]}`,
				//     path.join(sourceFolder, `~${Manifest.LANGUAGES}`, `${outputInfo[Manifest.LANGUAGE].name}`),
				//     targetFolder
				// );

				self._enumerateBlockDependencies(config, outputInfo);
				self._generatePages(outputInfo);
				self._generateComposable(outputInfo);

				const emitter = walk(sourceFolder);

				emitter.on('directory', (dirPath) => {
					try {
						if (
							!dirPath.endsWith(LANGUAGES_FOLDER_NAME) &&
							!self._mustIgnore(dirPath + SLASH, true) &&
							!self._isOtherLanguage(
								dirPath,
								outputInfo[Manifest.LANGUAGE].name
							)
						) {
							let dest = dirPath.replace(sourceFolder, targetFolder);
							dest = dest.replace(
								SLASH +
									LANGUAGES_FOLDER_NAME +
									SLASH +
									outputInfo[Manifest.LANGUAGE].name,
								''
							);
							self.log(
								4,
								1,
								`Creating child folder: ${dest.replace(targetFolder, '')}`
							);
							if (!fse.existsSync(dest)) {
								fse.mkdirSync(dest);
							}
						} else {
							self.log(7, 1, `Ignoring folder: ${dirPath}`);
						}
					} catch (error) {
						console.error(error);
						gracefulCompletion = false;
						emitter.end();
					}
				});

				emitter.on('file', (filePath) => {
					try {
						if (
							!self._mustIgnore(filePath, false) &&
							!self._isOtherLanguage(
								filePath,
								outputInfo[Manifest.LANGUAGE].name
							)
						) {
							self._processFile(
								filePath,
								sourceFolder,
								targetFolder,
								outputInfo
							);
						} else {
							self.log(7, 1, `Ignoring file: ${filePath}`);
						}
					} catch (error) {
						console.error(error);
						gracefulCompletion = false;
						emitter.end();
					}
				});

				emitter.on('end', () => {
					self.log(1, 1, '');
					self.log(
						1,
						1,
						gracefulCompletion ? 'SUCCESS! 😃' : 'Miserable failure! 😫'
					);
					self.log(1, 1, '');
					self.log(1, 1, `Output project in ${targetFolder}`);
					self.log(1, 1, '');
					callback(gracefulCompletion ? targetFolder : null);
					if (gracefulCompletion) {
						resolve(targetFolder);
					} else {
						reject();
					}
				});
			} catch (error) {
				callback(null);
				return reject(error);
			}
			return null;
		});
	}
};
