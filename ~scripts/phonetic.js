/*
 * Phonetic
 * Copyright 2013-2016 Tom Shawver
 * https://github.com/TomFrost/node-phonetic
 */

const blake = require('blakejs');

module.exports = class Phonetic {
	static get ADJECTIVES() {
		return [
			'accurate',
			'acoustic',
			'adamant',
			'adorable',
			'alert',
			'alike',
			'alive',
			'alluring',
			'amazing',
			'ambitious',
			'amiable',
			'amused',
			'amused',
			'amusing',
			'animated',
			'aquatic',
			'aspiring',
			'assorted',
			'average',
			'awake',
			'aware',
			'awesome',
			'bent',
			'berserk',
			'best',
			'better',
			'big',
			'bizarre',
			'blushing',
			'bouncy',
			'boundless',
			'brainy',
			'brave',
			'brave',
			'bright',
			'bright',
			'bubbly',
			'calm',
			'calm',
			'capable',
			'capable',
			'careful',
			'caring',
			'certain',
			'charming',
			'charming',
			'cheerful',
			'cheerful',
			'chief',
			'classy',
			'clean',
			'clear',
			'clever',
			'coherent',
			'colorful',
			'common',
			'confident',
			'cool',
			'courageous',
			'credible',
			'cuddly',
			'cultured',
			'cultured',
			'curious',
			'curly',
			'curved',
			'curvy',
			'cute',
			'dashing',
			'dashing',
			'dazzling',
			'dazzling',
			'debonair',
			'decisive',
			'decisive',
			'delicate',
			'delightful',
			'detailed',
			'determined',
			'diligent',
			'diligent',
			'discreet',
			'dynamic',
			'eager',
			'educated',
			'efficient',
			'elated',
			'elated',
			'electric',
			'elegant',
			'eminent',
			'enchanting',
			'energetic',
			'ethereal',
			'excellent',
			'excited',
			'excited',
			'exciting',
			'exotic',
			'fabulous',
			'fabulous',
			'fair',
			'fair',
			'faithful',
			'faithful',
			'familiar',
			'famous',
			'fancy',
			'fantastic',
			'fearless',
			'fearless',
			'festive',
			'fierce',
			'fine',
			'flawless',
			'flowery',
			'fluffy',
			'frank',
			'fresh',
			'friendly',
			'friendly',
			'funny',
			'funny',
			'furry',
			'generous',
			'generous',
			'gentle',
			'gentle',
			'gleaming',
			'glorious',
			'glorious',
			'glossy',
			'good',
			'gorgeous',
			'graceful',
			'grateful',
			'groovy',
			'handsome',
			'happy',
			'happy',
			'healthy',
			'heavenly',
			'helpful',
			'helpful',
			'hilarious',
			'honorable',
			'humorous',
			'jolly',
			'jolly',
			'joyous',
			'joyous',
			'juicy',
			'kind',
			'kind',
			'level',
			'likable',
			'lively',
			'lovely',
			'lovely',
			'loving',
			'loving',
			'lucky',
			'lyrical',
			'magical',
			'majestic',
			'mature',
			'mellow',
			'melodic',
			'mighty',
			'modern',
			'nice',
			'nice',
			'nifty',
			'nimble',
			'obedient',
			'odd',
			'optimal',
			'ordinary',
			'organic',
			'outgoing',
			'peaceful',
			'peaceful',
			'perfect',
			'perfect',
			'periodic',
			'pleasant',
			'pleasant',
			'plucky',
			'poised',
			'polite',
			'powerful',
			'precious',
			'premium',
			'pretty',
			'proud',
			'punctual',
			'quiet',
			'quirky',
			'regular',
			'reliable',
			'relieved',
			'resolute',
			'right',
			'romantic',
			'romantic',
			'royal',
			'sassy',
			'sedate',
			'sensitive',
			'shrewd',
			'shy',
			'silly',
			'silly',
			'sincere',
			'sincere',
			'skillful',
			'skillful',
			'smart',
			'smiling',
			'smiling',
			'smooth',
			'sneaky',
			'special',
			'splendid',
			'steadfast',
			'stimulating',
			'succinct',
			'supreme',
			'swanky',
			'sweet',
			'talented',
			'talented',
			'tasteful',
			'terrific',
			'thankful',
			'thoughtful',
			'thrifty',
			'tidy',
			'tough',
			'truthful',
			'unbiased',
			'unique',
			'unusual',
			'upbeat',
			'upbeat',
			'uppity',
			'wacky',
			'warm',
			'wiggly',
			'wild',
			'willing',
			'willing',
			'wise',
			'witty',
			'witty',
			'wonderful',
			'yummy',
			'zany',
			'zealous',
			'zesty',
			'zippy',
			'zonked',
		];
	}

	/**
	 * Phonetics that sound best before a vowel.
	 * @type {Array}
	 */
	static get PHONETIC_PRE() {
		return [
			// Simple phonetics
			'b',
			'c',
			'd',
			'f',
			'g',
			'h',
			'j',
			'k',
			'l',
			'm',
			'n',
			'p',
			'qu',
			'r',
			's',
			't',
			// Complex phonetics
			'bl',
			'ch',
			'cl',
			'cr',
			'dr',
			'fl',
			'fr',
			'gl',
			'gr',
			'kl',
			'kr',
			'ph',
			'pr',
			'pl',
			'sc',
			'sh',
			'sl',
			'sn',
			'sr',
			'st',
			'str',
			'sw',
			'th',
			'tr',
			'br',
			'v',
			'w',
			'y',
			'z',
		];
	}

	/**
	 * The number of simple phonetics within the 'pre' set.
	 * @type {number}
	 */
	static get PHONETIC_PRE_SIMPLE_LENGTH() {
		return 16;
	}

	/**
	 * Vowel sound phonetics.
	 * @type {Array}
	 */
	static get PHONETIC_MID() {
		return [
			// Simple phonetics
			'a',
			'e',
			'i',
			'o',
			'u',
			// Complex phonetics
			'ee',
			'ie',
			'oo',
			'ou',
			'ue',
		];
	}

	/**
	 * The number of simple phonetics within the 'mid' set.
	 * @type {number}
	 */
	static get PHONETIC_MID_SIMPLE_LENGTH() {
		return 5;
	}

	/**
	 * Phonetics that sound best after a vowel.
	 * @type {Array}
	 */
	static get PHONETIC_POST() {
		return [
			// Simple phonetics
			'b',
			'd',
			'f',
			'g',
			'k',
			'l',
			'm',
			'n',
			'p',
			'r',
			's',
			't',
			'y',
			// Complex phonetics
			'ch',
			'ck',
			'ln',
			'nk',
			'ng',
			'rn',
			'sh',
			'sk',
			'st',
			'th',
			'x',
			'z',
		];
	}

	/**
	 * The number of simple phonetics within the 'post' set.
	 * @type {number}
	 */
	static get PHONETIC_POST_SIMPLE_LENGTH() {
		return 13;
	}

	/**
	 * A mapping of regular expressions to replacements, which will be run on the
	 * resulting word before it gets returned.  The purpose of replacements is to
	 * address language subtleties that the phonetic builder is incapable of
	 * understanding, such as 've' more pronounceable than just 'v' at the end of
	 * a word, 'ey' more pronounceable than 'iy', etc.
	 * @type {{}}
	 */
	static get REPLACEMENTS() {
		return {
			quu: 'que',
			'qu([aeiou]){2}': 'qu$1',
			'[iu]y': 'ey',
			eye: 'ye',
			'(.)ye$': '$1y',
			'(^|e)cie(?!$)': '$1cei',
			'([vz])$': '$1e',
			'[iu]w': 'ow',
		};
	}

	/**
	 * Adds a single syllable to the word contained in the wordObj.  A syllable
	 * contains, at maximum, a phonetic from each the PRE, MID, and POST phonetic
	 * sets.  Some syllables will omit pre or post based on the
	 * options.compoundSimplicity.
	 *
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      word object on which to operate.
	 */
	static addSyllable(wordObj) {
		const deriv = Phonetic.getDerivative(wordObj.numeric);
		const compound = deriv % wordObj.opts.compoundSimplicity === 0;
		const first = wordObj.word === '';
		const preOnFirst = deriv % 6 > 0;
		if ((first && preOnFirst) || wordObj.lastSkippedPost || compound) {
			wordObj.word += Phonetic.getNextPhonetic(
				Phonetic.PHONETIC_PRE,
				Phonetic.PHONETIC_PRE_SIMPLE_LENGTH,
				wordObj
			);
			wordObj.lastSkippedPre = false;
		} else wordObj.lastSkippedPre = true;
		wordObj.word += Phonetic.getNextPhonetic(
			Phonetic.PHONETIC_MID,
			Phonetic.PHONETIC_MID_SIMPLE_LENGTH,
			wordObj,
			first && wordObj.lastSkippedPre
		);
		if (wordObj.lastSkippedPre || compound) {
			wordObj.word += Phonetic.getNextPhonetic(
				Phonetic.PHONETIC_POST,
				Phonetic.PHONETIC_POST_SIMPLE_LENGTH,
				wordObj
			);
			wordObj.lastSkippedPost = false;
		} else wordObj.lastSkippedPost = true;
	}

	/**
	 * Capitalizes the first letter of a string.
	 *
	 * @param {string} str A string to capitalize
	 * @returns {string} The provided string with the first letter capitalized.
	 */
	static capFirst(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Gets a derivative of a number by repeatedly dividing it by 7 and adding the
	 * remainders together.  It's useful to base decisions on a derivative rather
	 * than the wordObj's current numeric, as it avoids making the same decisions
	 * around the same phonetics.
	 *
	 * @param {number} num A number from which a derivative should be calculated
	 * @returns {number} The derivative.
	 */
	static getDerivative(num) {
		let derivative = 1;
		while (num !== 0) {
			derivative += num % 7;
			num = Math.floor(num / 7);
		}
		return derivative;
	}

	/**
	 * Combines the option defaults with the provided overrides.  Available
	 * options are:
	 *  - syllables: The number of syllables to put in the resulting word.
	 *          Default is 3.
	 *  - seed: A number with which to seed the generator.  Using the
	 *          same seed (with the same other options) will coerce the generator
	 *          into producing the same word.
	 *  - phoneticSimplicity: The greater this number, the simpler the phonetics.
	 *          For example, 1 might produce 'str' while 5 might produce 's' for
	 *          the same syllable.  Minimum is 1, default is 5.
	 *  - compoundSimplicity: The greater this number, the less likely the
	 *          resulting word will sound "compound", such as "ripkuth" instead of
	 *          "riputh".  Minimum is 1, default is 5.
	 *  - capFirst: true to capitalize the first letter of the word; all lowercase
	 *          otherwise.  Default is false.
	 *
	 * @param {{}} overrides A set of options and values with which to override
	 *      the defaults.
	 * @returns {{syllables, seed, phoneticSimplicity, compoundSimplicity, capFirst}}
	 *      An options object.
	 */
	static getOptions(overrides) {
		const options = {};
		overrides = overrides || {};
		options.syllables = overrides.syllables || 3;
		options.seed = overrides.seed;
		options.phoneticSimplicity = overrides.phoneticSimplicity
			? Math.max(overrides.phoneticSimplicity, 1)
			: 5;
		options.compoundSimplicity = overrides.compoundSimplicity
			? Math.max(overrides.compoundSimplicity, 1)
			: 5;
		options.capFirst = Object.prototype.hasOwnProperty.call(
			overrides,
			'capFirst'
		)
			? overrides.capFirst
			: false;
		return options;
	}

	/**
	 * Gets the next pseudo-random phonetic from a given phonetic set,
	 * intelligently determining whether to include "complex" phonetics in that
	 * set based on the options.phoneticSimplicity.
	 *
	 * @param {Array} phoneticSet The array of phonetics from which to choose
	 * @param {number} simpleCap The number of 'simple' phonetics at the beginning
	 *      of the phoneticSet
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      wordObj for which the phonetic is being chosen
	 * @param {boolean} [forceSimple] true to force a simple phonetic to be
	 *      chosen; otherwise, the function will choose whether to include complex
	 *      phonetics based on the derivative of wordObj.numeric.
	 * @returns {string} The chosen phonetic.
	 */
	static getNextPhonetic(phoneticSet, simpleCap, wordObj, forceSimple) {
		const deriv = Phonetic.getDerivative(wordObj.numeric);
		const simple =
			(wordObj.numeric + deriv) % wordObj.opts.phoneticSimplicity > 0;
		const cap = simple || forceSimple ? simpleCap : phoneticSet.length;
		const phonetic = phoneticSet[wordObj.numeric % cap];
		wordObj.numeric = Phonetic.getNumericHash(
			wordObj.numeric + wordObj.word
		);
		return phonetic;
	}

	/**
	 * Generates a numeric hash based on the input data.  The hash is an md5, with
	 * each block of 32 bits converted to an integer and added together.
	 *
	 * @param {string|number} data The string or number to be hashed.
	 * @returns {number}
	 */
	static getNumericHash(data) {
		const hash = blake.blake2b(data);
		let numeric = 0;
		for (let i = 0; i < hash.length; i += 1) {
			numeric += hash[i];
		}
		return numeric;
	}

	/**
	 * Applies post-processing to a word after it has already been generated.  In
	 * this phase, the REPLACEMENTS are executed, applying language intelligence
	 * that can make generated words more pronounceable.  The first letter is
	 * also capitalized.
	 *
	 * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
	 *      word object to be processed.
	 * @returns {string} The processed word.
	 */
	static postProcess(wordObj) {
		let regex = null;
		Object.keys(Phonetic.REPLACEMENTS).forEach((i) => {
			if (
				Object.prototype.hasOwnProperty.call(Phonetic.REPLACEMENTS, i)
			) {
				regex = new RegExp(i);
				wordObj.word = wordObj.word.replace(
					regex,
					Phonetic.REPLACEMENTS[i]
				);
			}
		});
		if (wordObj.opts.capFirst) return Phonetic.capFirst(wordObj.word);
		return wordObj.word;
	}

	/**
	 * Generates a new word based on the given options.  For available options,
	 * see getOptions.
	 *
	 * @param {*} [options] A collection of options to control the word generator.
	 * @returns {string} A generated word.
	 */
	static generate(options) {
		options = Phonetic.getOptions(options);
		let syllables = options.syllables;
		const wordObj = {
			numeric: Phonetic.getNumericHash(options.seed),
			lastSkippedPost: false,
			word: '',
			opts: options,
		};
		// eslint-disable-next-line no-plusplus
		while (syllables--) {
			Phonetic.addSyllable(wordObj);
		}
		return Phonetic.postProcess(wordObj);
	}
};
