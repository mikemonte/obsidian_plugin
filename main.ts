import {
	App,
	Editor,
	Events,
	getAllTags,
	MarkdownView,
	Modal,
	moment,
	Notice,
	normalizePath,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile
} from 'obsidian';

const fronty = require('front-matter');
const pathLib = require('pathlib');


import ListCalloutsPlugin from 'obsidian_plugins/obsidian-list-callouts/main';
import {ListCalloutSettings} from "./obsidian_plugins/obsidian-list-callouts/settings";
import {buildPostProcessor} from "./obsidian_plugins/obsidian-list-callouts/postProcessor";
import {calloutExtension, calloutsConfigField} from "./obsidian_plugins/obsidian-list-callouts/extension";
const prompt = require('electron-prompt');

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	glossaryTesterCardsPerSession: number;
	glossaryTesterPrioritizeCardsOlderThanDays: number;
	glossaryTestTagsToFilter: string;
}


const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	glossaryTesterCardsPerSession: 15,
	glossaryTesterPrioritizeCardsOlderThanDays: 10,
	glossaryTestTagsToFilter: ""
}

var glossaryTesterInstance: GlossaryTester;

var mikielPlugin: MyPlugin;

var mikielPluginSettings: any;

// @ts-ignore
window.revealCorrectGlossary = function (obj) {
	glossaryTesterInstance.revealCorrectGlossary(false);
}


// @ts-ignore
window.glossaryMaskMode = function (obj) {
	glossaryTesterInstance.glossaryMaskMode(obj);
}

// @ts-ignore
window.glossaryMaskPercentage = function (obj) {
	glossaryTesterInstance.glossaryMaskPercentage(obj);
}


// @ts-ignore
window.toggleCallout = function (obj) {


	if (obj.classList.contains('callout-closed') ) {
		obj.removeClass('callout-closed');
		obj.addClass('callout-open');
	}
	else {
		obj.addClass('callout-closed');
		obj.removeClass('callout-open');
	}


}

// @ts-ignore
window.glossaryCardsPerSessionSelection = function(obj) {

	glossaryTesterInstance.glossaryCardsPerSessionSelection(obj);

}

// @ts-ignore
window.glossaryTagSelection = function(obj) {
	glossaryTesterInstance.glossaryTagSelection(obj);


}


// @ts-ignore
window.gotoGlossaryNumber = function (questionNumber, outcome, isLastCard = 'NO') {
	glossaryTesterInstance.revealCorrectGlossary(true);
	glossaryTesterInstance.gotoGlossaryNumber(questionNumber, outcome, isLastCard);
}

// @ts-ignore
window.gotoQuestionNumber = function (questionNumber) {
	let plugin = new SampleModal(MyPlugin.returnApp());
	plugin.gotoQuestionNumber(questionNumber);


}
// @ts-ignore
window.revealCorrectAnswers = function( ){

	let plugin = new SampleModal(MyPlugin.returnApp());
	plugin.revealCorrectAnswers();

}


export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private static app: App;

	static returnApp () {
		return this.app;
	}
	async addTextToFile(fileToEdit: TFile) {
		const fullExistingFileText = await this.app.vault.read(fileToEdit);
		return fullExistingFileText;
	}

	async getFileForUpdate(fileName: string) {

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		var filesWithName: TFile[] = [];
		if (view!=null) {

			let newContent = "";
			let inlineSetting = "";
			let newTitle = "";
			let newAlias = "";


			const files = this.app.vault.getMarkdownFiles();


			var baseTitleName = fileName;


			if (baseTitleName.includes("/")) {
				var pathParts = baseTitleName.split("/");
				baseTitleName = pathParts[pathParts.length - 1];
			}

			var heading = "";
			if (newTitle.includes("#")) {
				heading = newTitle.split("#")[1];
				newTitle = newTitle.split("#")[0];
			}

			for (let i = 0; i < files.length; i++) {
				if (files[i].basename == baseTitleName) {
					filesWithName.push(files[i]);
					break;
				}
			}
		}
	return filesWithName;
	}

	async addEntryToFileByName(fileName: string, entry: string) {
		const result = await this.getFileForUpdate(fileName);

		const content = await this.addTextToFile(result[0]);
		if(entry) {
			entry = entry.split(', ').join(',');
			let arr = entry.split(',');
			entry = `${arr.join('\n- [ ] ')}`
			await this.app.vault.modify(result[0], content + `\n- [ ] ${entry}`);
			return true;
		}
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);

		let selection = "";

		if (!view) {
			// View can be null some times. Can't do anything in this case.
		} else {
			let view_mode = view.getViewType(); // "preview" or "source" (can also be "live" but I don't know when that happens)


			switch (view_mode) {
				case "preview":
					// The leaf is in preview mode, which makes things difficult.
					// I don't know how to get the selection when the editor is in preview mode :(
					break;
				case "source":
				case "markdown":
					// Ensure that view.editor exists!
					if ("editor" in view) {
						// Good, it exists.
						// @ts-ignore We already know that view.editor exists.
						selection = view.editor.getSelection(); // THIS IS THE SELECTED TEXT, use it as you wish.
					}
					// If we get here, then 'view' does not have a property named 'editor'.
					break;
				default:
					// If we get here, then we did not recognise 'view_mode'.
					break;
			}
		}

		await this.app.vault.modify(result[0], content + `\n- ${selection}`);
	}

	async onload() {
		await this.loadSettings();

		let myCallout = new ListCalloutsPluginOverride(this.app, this.manifest);

		myCallout.testMe();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'mikiel-modal-simple',
			name: 'Mikiel Open Quiz Window',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		/**
		 * This command lists entire glossary oand outputs to console
		 */
		this.addCommand({
			id: 'mikiel-glossary-list',
			name: 'Mikiel List Glossary',
			callback: async () => {
				glossaryTesterInstance = new GlossaryTester(this.app, ["term","tags","memorisation_hints", "recall_attempt_count","recall_success_count", "recall_score"], ["Concise Definition"]);
				await glossaryTesterInstance.scanFilesForDefinitions();
				await glossaryTesterInstance.listGlossaryTerms();
			}
		});

		/**
		 * This command lists entire glossary oand outputs to console
		 */
		this.addCommand({
			id: 'mikiel-glossary-reset-next-testing-date',
			name: 'Mikiel Glossary Reset Next Testing Date',
			callback: async () => {
				glossaryTesterInstance = new GlossaryTester(this.app, ["term","tags","memorisation_hints", "recall_attempt_count","recall_success_count", "recall_score"], ["Concise Definition"]);
				await glossaryTesterInstance.resetNextTestDate(null, 'UPDATE');

			}
		});

		this.addCommand({
			id: 'mikiel-modal-glossary-trainer',
			name: 'Glossary Trainer Window',
			callback: () => {
				// @ts-ignore
				glossaryTesterInstance = new GlossaryTester(this.app, ["term","tags","memorisation_hints", "recall_attempt_count","recall_success_count", "recall_score"], ["Concise Definition"]);
				glossaryTesterInstance.open();
			}
		});


		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {

				editor.replaceSelection('Mikiel');
			}
		});

		/***
		 * Testing adding a custom command
		 */
		this.addCommand({
			id: "mikiel-list-files",
			name: "Mikiel File Lister",
			callback: async () => {
				await this.addEntryToFileByName("Things I Need To Learn", "xyz")
			},
		});


		this.addCommand({
			id: 'mikiel-get-card',
			name: 'Mikiel - Get Flash Content',
			callback: () => {
				let item = document.getElementById('sr-flashcard-view');
				if(item) {
					console.log(item.innerHTML);
				}
				else{
					console.log('cannot find sr-flashcard-view ');
				}
			}
		});


		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complexxx)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		mikielPluginSettings = new SampleSettingTab(this.app, this);
		this.addSettingTab(mikielPluginSettings);



		this.addCommand({
			id: 'mikiel-hide-answers',
			name: 'Mikiel - Hide Answers',
			callback: () => {
				console.log("quick preview");
				document.querySelectorAll('.lc-list-callout').forEach((el) => {
					let child = el.querySelector('.lc-list-marker');
					if (child && child.innerHTML && child.innerHTML.trim() == '!') {

						console.log(`~>${child.innerHTML.trim()}<~`)
						el.removeClass('callout-open');
						el.addClass('callout-closed');
						el.setAttribute("onclick", "window.toggleCallout(this)");
					}
				});
			}

		});

		this.registerEvent(

			this.app.workspace.on("file-open", function(obj) {
				console.log("quick preview");
				document.querySelectorAll('.lc-list-callout').forEach((el) =>{
					let child = el.querySelector('.lc-list-marker');
					if(child && child.innerHTML && child.innerHTML.trim() == '!') {

						console.log(`~>${child.innerHTML.trim()}<~`)
						el.removeClass('callout-open');
						el.addClass('callout-closed');
						el.setAttribute("onclick" , "window.toggleCallout(this)");
					}

				});
			})
		);

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {

			// @ts-ignore We already know that view.editor exists.
			if(evt && evt.target && evt.target && evt.target && evt.target.innerHTML && evt.path && evt.path[2].id == 'sr-flashcard-view' && evt.path[0].nodeName == "P") {


				// @ts-ignore
				let val = String(evt.target.innerHTML?evt.target.innerHTML:"");
				prompt({
					title: "Learn These Words",
					label: 'Select text you want to remember (use comma symbol for separate text',
					value: val,
					inputAttrs: {
						type: 'text'
					},
					type: 'input'
				})
					.then(async (r: string) => {
						if(r === null) {
							console.log('user cancelled');
						} else {
							await this.addEntryToFileByName("Things I Need To Learn", r)
						}
					})
					.catch(console.error);

			}
		});

	this.resetCalloutBoxes();


	//	let callOutArray = document.getElementsByClassName('lc-list-callout');
	//	for(let el in callOutArray) {
	//		callOutArray[el].addClass('callout-open');
	//	}


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	resetCalloutBoxes () {
		document.querySelectorAll('.lc-list-callout').forEach((el) =>{
			let child = el.querySelector('.lc-list-marker');
			if(child && child.innerHTML && child.innerHTML.trim() == '!') {
				//&& child.innerHTML.trim() == '?'
				console.log(`->${child.innerHTML.trim()}<-`)
				el.addClass('callout-closed');
				el.setAttribute("onclick" , "window.toggleCallout(this)");
			}
			//el.addClass('callout-closed');
			//el.setAttribute("onclick" , "window.toggleCallout(this)");
		});
	}

	onunload() {

	}



	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


}

interface GlossaryAnswers {
	frontmatter: any;
	contentInsideHeaders: any;

}

/**
 * Class for opening a modal pane which displays definition notes tagged with #nciglossary
 *
 */
class GlossaryTester extends Modal {
	plugin: MyPlugin;


	/**
	 * get comma delimited list of tags that wil be used to filter out notes for glossary testing
	 */
	get glossaryTestTagsToFilter(): string {
		return this._glossaryTestTagsToFilter;
	}

	/**
	 * set comma delimited list of tags that wil be used to filter out notes for glossary testing
	 */
	set glossaryTestTagsToFilter(value: string) {
		this._glossaryTestTagsToFilter = value;
	}

	get sessionCardsAttemptedCount(): number {
		return this._sessionCardsAttemptedCount;
	}

	set sessionCardsAttemptedCount(value: number) {
		this._sessionCardsAttemptedCount = value;
	}
	get incorrectAnswerCount(): number {
		return this._incorrectAnswerCount;
	}

	set incorrectAnswerCount(value: number) {
		this._incorrectAnswerCount = value;
	}

	get correctAnswerCount(): number {
		return this._correctAnswerCount;
	}

	set correctAnswerCount(value: number) {
		this._correctAnswerCount = value;
	}

	get sessionDuration(): number {
		return this._sessionDuration;
	}

	set sessionDuration(value: number) {
		this._sessionDuration = value;
	}

	get intervalTimer(): any {
		return this._intervalTimer;
	}

	set intervalTimer(value: any) {
		this._intervalTimer = value;
	}

	get timerCounter(): number {
		return this._timerCounter;
	}

	set timerCounter(value: number) {
		this._timerCounter = value;
	}

	get maskMode(): string {
		return this._maskMode;
	}

	set maskMode(value: string) {
		this._maskMode = value;
	}

	get maskPercentage(): number {
		return this._maskPercentage;
	}

	set maskPercentage(value: number) {
		this._maskPercentage = value;
	}

	get glossaryData(): Array<any> {
		return this._glossaryData;
	}

	set glossaryData(value: Array<any>) {
		this._glossaryData = value;
	}

	/**
	 * get a list of headers (defined by hash space followed by text eg. # This Is A Header)
	 * these will be used to pull text from under these headers
	 *
	 */
	get headerNamesForContent(): Array<string> {
		return this._headerNamesForContent;
	}

	/**
	 * set a list of headers (defined by hash space followed by text eg. # This Is A Header)
	 * these will be used to pull text from under these headers
	 * Note that the hash and teh space must not be provided here so  "# This Is A Header"
	 * will be provided as  "This Is A Header"
	 *
	 */
	set headerNamesForContent(value: Array<string>) {
		this._headerNamesForContent = value;
	}

	/**
	 * get a list of front matter variables that will be captured
	 *
	 */
	get frontMatterVariables(): Array<string> {
		return this._frontMatterVariables;
	}

	/**
	 * set a list of front matter variables that will be captured
	 * Default is ["term"]
	 */
	set frontMatterVariables(value: Array<string>) {
		this._frontMatterVariables = value;
	}





	private _frontMatterVariables: Array<string> = ["term", "tags", "memorisation_hints", "recall_score"];

	private _headerNamesForContent: Array<string> = ["Concise Definition", "This is a test", "Concise Definition"];

	private _glossaryData: Array<any> = [];

	private _maskMode: string = 'SEQUENTIAL_LEFT';

	private _maskPercentage: number = 70;

	private _timerCounter: number = 0;

	private _intervalTimer: any = null;

	/**
	 * Keeps a score of the number of cards answered correctly during one session
	 */
	private _correctAnswerCount: number = 0;

	/**
	 * Keeps a score of the number of cards answered incorrectly during one session
	 */
	private _incorrectAnswerCount: number = 0;

	/**
	 * Session duration in seconds
	 * This starts counting up when the user hits the START button and stops when the last card is processedf
	 */
	private _sessionDuration: number = 0

	/**
	 * number of cards tested during the session
	   This increments every time you answer a card
	 */
	private _sessionCardsAttemptedCount: number = 0;


	/**
	 * comma delimited list of tags that will be used to filter out notes for glossary testing
	 */
	private _glossaryTestTagsToFilter: string = 'nciglossary, glossary';



	constructor(app: App, filterableFrontMatter:  Array<string> , headerNames: Array<string>) {
		super(app);

		if ( filterableFrontMatter ) {
			this.frontMatterVariables = filterableFrontMatter;
		}

		if( headerNames ) {
			this._headerNamesForContent = headerNames;
		}

		this.glossaryTestTagsToFilter = mikielPluginSettings.plugin.settings.glossaryTestTagsToFilter;
	}

	/**
	 * resetNextTestDate
	 *
	 * @param nextTestDate: string | null
	 * can be:
	 *  a valid timestamp in format "2022-12-17T15:00:48" -- this will set all next_recall_test_date attributes to the specified time stamp
	 *  null -- this will calculate the next_recall_test_date attributes according to certain criteria such as last tested date, success rate etc
	 *
	 * @param action: string
	 * can be:
	 *  UPDATE  - will make the change permanent
	 *  CHECK - will simply return the data
	 *
	 *
	 */
	async resetNextTestDate(nextTestDate: string | null = null, action: string = 'UPDATE') {



		await glossaryTesterInstance.scanFilesForDefinitions();
		for( let i = 0; i < this.glossaryData.length; i++) {
			let frontmatter = this.glossaryData[i].frontmatter;
			const recallAttemptTimestamp = frontmatter.glossary_recall.recall_attempt_timestamp;
			let nextRecallTestDate = frontmatter.glossary_recall.next_recall_test_date;
			const recallAttemptCount = frontmatter.glossary_recall.recall_attempt_count;
			const recallSuccessCount = frontmatter.glossary_recall.recall_success_count;
			console.log(`term: ${frontmatter.term}`);
			console.log(`next_recall_test_date: ${nextRecallTestDate}`);
			console.log(`recall_attempt_count: ${recallAttemptCount}`);
			console.log(`recall_success_count: ${recallSuccessCount}`);

			const daysToWait = this.getDaysTillNextTest(recallAttemptCount, recallSuccessCount);
			nextRecallTestDate = moment().add(daysToWait, 'days').startOf('day');
			nextRecallTestDate = moment(nextRecallTestDate).format('YYYY-MM-DD');
			console.log(`file_path: ${this.glossaryData[i].file_path} action: ${action} calculated next_recall_test_date: ${nextRecallTestDate}`);

			if(action == 'UPDATE') {
				// @ts-ignore
				await this.updatePropertyInFile(this.glossaryData[i].file_path, 'glossary_recall.next_recall_test_date', nextRecallTestDate);
			}

		}
	}

	/**
	 * getDaysTillNextTest
	 * calculates number of days to delay subsequent testing of a specific glossary item
	 *
	 * @param recallAttemptCount: number -- how many times has this card been tested
	 * @param recallSuccessCount: number -- how many times has this card been answered correctly
	 *
	 * returns: number of days to delay the next test
	 */
	getDaysTillNextTest(recallAttemptCount: number, recallSuccessCount: number ) : number {
		const successTreshHold = 0.7; // 70 percent of the tests are correct
		const nextRecallDaysIfNeverTested = 0;
		const nextRecallDaysIfSuccessGreaterTreshold = 10;
		const nextRecallDaysIfSuccessLessThanThreshold = 2;
		let daysToWait = 0;
		let status  = (recallAttemptCount==0)?"NEVER_TESTED":((recallSuccessCount  > (successTreshHold * recallAttemptCount))?"TESTED_SUCCESSFULLY":"TESTED_UNSUCCESSFULLY")
		switch(status) {
			case "NEVER_TESTED":
				daysToWait = nextRecallDaysIfNeverTested
				break;
			case "TESTED_SUCCESSFULLY":
				daysToWait = nextRecallDaysIfSuccessGreaterTreshold
				break;
			case "TESTED_UNSUCCESSFULLY":
				daysToWait = nextRecallDaysIfSuccessLessThanThreshold
				break;
			default:


		}

		return daysToWait;

	}
	async listGlossaryTerms() {
		console.log(this.glossaryData);
	}
	async getFrontmatterSectionFromFile (file: TFile) {

		let fmc = this.app.metadataCache.getFileCache(file)?.frontmatter;
		return fmc;
	}

	async getFrontmatterSectionFromFilePath (filePath: string) {
		let fmc = null;
		let existingFile = this.app.vault.getAbstractFileByPath(filePath);
		if(existingFile) {
			// @ts-ignore
			fmc = this.app.metadataCache.getFileCache(existingFile)?.frontmatter;
		}
		return fmc;
	}

	async getPropertyInFile(filePath: string, field: string ) {

	}

	async updatePropertyInFile(filePath: string, field: string, value: string | number = '', action: string = 'UPDATE'): Promise<void> {
		if(filePath == 'Definitions/beta agonist.md') {
			console.log(`filePath:${filePath}`);
		}
		let variables = field.split('.');

		let file = this.app.vault.getAbstractFileByPath(filePath);
		// @ts-ignore
		let fileContent = await this.app.vault.read(file);

		let fmc = await this.getFrontmatterSectionFromFilePath(filePath);


		let regex = null;
		if (variables.length == 1) {
			regex = new RegExp(`.*[\\W\\S]*[\\n]+(${variables[0]}:.*\\n).*`, "gm");
		} else if (variables.length == 2) {
			regex = new RegExp(`${variables[0]}:[\\W\\S]*[\\n]+(\\s${variables[1]}:.*\\n).*`, "gm")
		} else {
			// todo handle multiple depth of fields larger than 2
		}

		const str = fileContent;
		let m;
		if(regex) {
			while ((m = regex.exec(str)) !== null) {
				if (m.index === regex.lastIndex) {
					regex.lastIndex++;
				}
				m.forEach((match, groupIndex) => {
					if (groupIndex == 1) {
						fileContent = fileContent.split(match).join(` ${variables[(variables.length -1)]}: ${value}\n`)
					}
				});
			}
		}
	if(action == 'UPDATE') {
		// @ts-ignore
		await this.app.vault.modify(file, fileContent);
	}

	return fileContent;


	}

	async updateFrontmatter (filePath: string, field: string, value: string | number = '') {
		if(!field || field.length < 1) {
			return false;
		}
		value = 8;

		let file  = this.app.vault.getAbstractFileByPath(filePath);
		let fmc = await this.getFrontmatterSectionFromFilePath(filePath);


		if (fmc && fmc.term && fmc.term == 'carboxypeptidase') {
			// @ts-ignore
			const {update} = this.app.plugins.plugins["metaedit"].api;
			await update(` ${field}`, value ,file);
			console.log(`Field:${field} updated with value ${value}.`)

		}



	}

	trimByChar(string: string, character: string) {
		if(!string || (typeof string == 'undefined')) return 'undefined';
		const first = [...string].findIndex(char => char !== character);
		const last = [...string].reverse().findIndex(char => char !== character);
		return string.substring(first, string.length - last);
	}


	/**
	 * obfuscateWord
	 *
	 * wordToObfuscate - the string that needs to be obfuscated
	 * mode - mode can be :
	 *  1. SEQUENTIAL_LEFT - Reveal characters from left to right
	 *  2. SEQUENTIAL_RIGHT - Reveal characters from right to left
	 *  3. SEQUENTIAL_CENTER - Reveal characters in sequence in the middle only
	 *  4. SYMMETRIC - Reveal left, center and right
	 *                 Priority is: First reveal left
	 *                              Then reveal left and right
	 *                              Then reveal left right and center
	 *                              After that increase the left reveal count by 1
	 *                              After that increase the right reveal count by 1
	 *                              After that increase the center reveal count by 1
	 *                              Further reveals will follow same sequence increasing, left, right and center by 1
	 *  5. RANDOM - Reveal randomly
	 *  6. VOWELS - Reveal only vowels
	 *  7. CONSONANTS - Reveal only consonants
	 *  8. SCRAMBLE - Reveal all letters in a random order
	 *
	 * maskingPercentage - percentage of word that will be revealed (0-100%)
	 *  If 0 it provides only the first character
	 *  any number greater than 0 will reveal more character
	 *  100 will reveal all characters
	 *
	 */
	obfuscateWord(wordToObfuscate: string, mode = 'SEQUENTIAL_LEFT', maskingPercentage = 10, className: string ='glossary-answers-table') {



		function scramble(a: any){
			a=a.split("");for(var b=a.length-1;0<b;b--){var c=Math.floor(Math.random()*(b+1));let d=a[b];a[b]=a[c];a[c]=d}return a.join("")}

		function calculateCharactersToReveal(placeholder = [], word: string, maskPercent = 0, direction = 'LEFT') {
			const vowels = ['A', 'E', 'I', 'O', 'U'];
			const consonants = ['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','X','Z','W','Y']
			const revealPercentage = (100 - maskPercent);
			const wordLen = word.length;
			let output = [];
			switch (direction) {
				case "LEFT":
					let charsFromLeft = Math.round(0.01 * revealPercentage * wordLen);
					charsFromLeft = (charsFromLeft < 1)?1:charsFromLeft;
					for( let i = 0; i < charsFromLeft; i++) {
						// @ts-ignore
						placeholder[i] = word.substring(i, i +1);
					}
					break;
				case "RIGHT":
					let charsFromRight = wordLen - Math.round(0.01 * revealPercentage * wordLen);
					charsFromRight = (charsFromRight < 1)?1:charsFromRight;
					for( let i = (wordLen - 1); i > (charsFromRight -1); i--) {
						// @ts-ignore
						placeholder[i] = word.substring(i, i +1);
					}
					break;
				case "CENTER":
					let charsFromRightC = wordLen - Math.round(0.01 * (100 - revealPercentage) * 0.5 * wordLen);

					charsFromRightC = ((0.5 * wordLen - charsFromRightC) >= 0)?(Math.round(0.5 * wordLen) + 1):charsFromRightC;

					for( let i = (charsFromRightC - 1); i > (wordLen - charsFromRightC - 1 ); i--) {
						// @ts-ignore
						placeholder[i] = word.substring((i), i +1);
					}
					break;
				case "RANDOM":
					let charsToReveal = Math.round(0.01 * revealPercentage * wordLen);
					for( let i = 0; i < word.length; i++) {
						let dice = Math.round(Math.random());
						if ( charsToReveal == 9) {
							break;
						}
						if( dice === 1 ) {
							// @ts-ignore
							placeholder[i] = word.substring(i, i + 1);
							charsToReveal--;
						}
					}
					break;
				case "VOWELS":
					for( let i = 0; i < word.length; i++) {
						if( vowels.includes(word.substring(i, i + 1)) ) {
							// @ts-ignore
							placeholder[i] = word.substring(i, i + 1);
						}
					}
					break;
				case "CONSONANTS":
					for( let i = 0; i < word.length; i++) {
						if( consonants.includes(word.substring(i, i + 1)) ) {
							// @ts-ignore
							placeholder[i] = word.substring(i, i + 1);
						}
					}
					break;
				case "SCRAMBLE":
					let arr = word.split(' ');
					let outArr = [];
					for(let i = 0; i < arr.length; i++) {
						outArr.push(scramble(arr[i]));
					}
					// @ts-ignore
					placeholder =  outArr.join(' ');
					break;
				default:
			}
			return placeholder
		}

		if(wordToObfuscate && (typeof wordToObfuscate != 'undefined') && wordToObfuscate.length > 0) {
			wordToObfuscate = wordToObfuscate.toUpperCase();
		}
		else {
		 	console.log(`undefined term: ${wordToObfuscate}`);
		 	wordToObfuscate = 'UNDEFINED'
		}
		const wordLen = wordToObfuscate.length;
		const charsToReveal  = Math.round(0.01 * maskingPercentage * wordLen);
		let placeholder = Array(wordLen).fill(" ")


		switch (mode) {

			case "SEQUENTIAL_LEFT":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'LEFT' );
				break;
			case "SEQUENTIAL_RIGHT":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'RIGHT' );
				break;
			case "SEQUENTIAL_CENTER":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'CENTER' );
				break;
			case "SYMMETRIC":
				// @ts-ignore
				let placeholderLeft = calculateCharactersToReveal(placeholder, wordToObfuscate, 1.1 * maskingPercentage, 'LEFT' );

				// @ts-ignore
				let placeholderRight = calculateCharactersToReveal(placeholder, wordToObfuscate ,  1.1 *  maskingPercentage, 'RIGHT' );
				for(let i = 0; i < placeholderLeft.length; i++) {
					if(placeholderLeft[i] == ' ') {
						placeholderLeft[i] = placeholderRight[i];
					}
				}
				placeholder = placeholderLeft;
				break;
			case "RANDOM":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'RANDOM' );
				break;
			case "VOWELS":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'VOWELS' );
				break;
			case "CONSONANTS":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'CONSONANTS' );
				break;
			case "SCRAMBLE":
				// @ts-ignore
				placeholder = calculateCharactersToReveal(placeholder, wordToObfuscate, maskingPercentage, 'SCRAMBLE' );
				break;
			default:

		}


		let htmlContent = `<table class="${className}"><tr class="answer-wrapper">`;
		for(let j = 0; j < placeholder.length; j++ ) {

			htmlContent += `<td><div class="glossary-answer" id="glossary_answer_${j}">${placeholder[j]}</div><input name="answer_status_${j}" class="answer-status" type="hidden" value="xxx" /></td>`;
		}
		htmlContent += `</tr></table>`;
		return htmlContent;

	}

	glossaryCardsPerSessionSelection(obj: any) {
		mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession = obj.value;
	}


	glossaryTagSelection(obj: any) {
		this.glossaryTestTagsToFilter = `${obj.value}`;

	}



	async gotoGlossaryNumber(nextQuestionNumber: string | number, outcome: string, isLastCard: string = 'NO') {
		let currentQuestionNumber = parseInt(String(Number(nextQuestionNumber) - 1));
		if(outcome == 'START') {
			currentQuestionNumber = 0;
		}


		if(typeof nextQuestionNumber == 'string') {
			nextQuestionNumber = parseInt(nextQuestionNumber);
		}


		let glossaryQuestion = this.glossaryData[(currentQuestionNumber)];

		// @ts-ignore
		let frontmatter = glossaryQuestion['frontmatter'];

		let recallAttemptCount = frontmatter['glossary_recall']['recall_attempt_count'];
		let recallSuccessCount = frontmatter['glossary_recall']['recall_success_count'];
		let recallAttemptTimestamp = frontmatter['glossary_recall']['recall_attempt_timestamp'];
		let recallScore = frontmatter['glossary_recall']['recall_score'];

		if(outcome == 'EXIT') {
			this.close();
		}

		if(outcome == 'START') {
			this.sessionDuration = 0;
			this.correctAnswerCount = 0;
			this.incorrectAnswerCount = 0;
			await this.scanFilesForDefinitions();
		}

		if(outcome == 'GOOD' || outcome == 'BAD') {
			this.correctAnswerCount = this.correctAnswerCount + 1;
			recallAttemptCount = recallAttemptCount + 1;
			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_attempt_count', recallAttemptCount);
			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_attempt_timestamp', new Date().toISOString().slice(0, 19));

			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_time', this.timerCounter);
			this.sessionDuration += this.timerCounter;
			this.timerCounter = 0;
			this.sessionCardsAttemptedCount = this.sessionCardsAttemptedCount + 1;
			if (outcome == 'GOOD') {
				recallSuccessCount = recallSuccessCount + 1;
				// @ts-ignore
				await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_success_count', recallSuccessCount);
				// @ts-ignore
				await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_score', Math.round(recallSuccessCount / recallAttemptCount));
			}
			if(outcome == 'BAD') {
				this.incorrectAnswerCount = this.incorrectAnswerCount + 1;
			}
			const daysToWait = this.getDaysTillNextTest(recallAttemptCount, recallSuccessCount);
			let nextRecallTestDate = moment().add(daysToWait, 'days').startOf('day');
			// @ts-ignore
			nextRecallTestDate = String(moment(nextRecallTestDate).format('YYYY-MM-DD'));
			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.next_recall_test_date', nextRecallTestDate);
		}





		let introDiv  = document.querySelector('.glossary-intro-panel');

		if(introDiv) {
			introDiv.classList.add('hidden');
		}
		
		if(isLastCard == 'YES') {


			let completionDiv  = document.querySelector('.glossary-completion-panel');

			if(completionDiv) {
				let compDivHtml = completionDiv.innerHTML;
				compDivHtml = compDivHtml.split('___SESSION_DURATION___').join(String(this.sessionDuration));
				compDivHtml = compDivHtml.split('___CORRECT_ANSWERS___').join(String(this.correctAnswerCount));
				compDivHtml = compDivHtml.split('___INCORRECT_ANSWERS___').join(String(this.incorrectAnswerCount));

				completionDiv.innerHTML = compDivHtml;

				let lastCardDiv  = document.querySelector(`.glossary-question-wrapper question-number-${(currentQuestionNumber)}`);
				if(lastCardDiv) {
					lastCardDiv.classList.add('hidden');
				}
				completionDiv.classList.remove('hidden');
			}

		}

		let allQuestions = document.querySelectorAll('.glossary-question-wrapper');
		for(let i = 0; i < allQuestions.length; i++) {
			allQuestions[i].classList.add('hidden');
		}
		let currentQuestion = document.querySelector(`.question-number-${nextQuestionNumber}`);
		if(currentQuestion) {
			currentQuestion.classList.remove('hidden');
		}



	}




	/**
	 * parse the contents of the page and return an array
	 *
	 *
	 *
	 */
	async getDefinition(str: string, filePath: string) {

		let frontMatterObject = await this.getFrontmatterSectionFromFilePath(filePath);

		//const regex = /(---\n[\w\n\:\-\s\/]*---\n)?.*(?:\r?\n(?!(?:\d+\.|[*+#]) ).*)*/gm;
		const regex = /.*(?:\r?\n(?!(?:\d+\.|[*+#]) ).*)*/gm;

		let answers: GlossaryAnswers = {
			frontmatter: frontMatterObject,
			contentInsideHeaders: {}
		};

		let m;

		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			m.forEach((matched, groupIndex) => {
				if( groupIndex == 0 && matched ) {
						let r = new RegExp(`#[\\s]+([\\w\\-\\s\\/+\\,\\:\\[\\]]+?)[\\n]`, "mg");
						let matchingContent;
						while (matchingContent = r.exec(matched)) {
							let matchingHeader = this.trimByChar(matchingContent[1], '\n').trim();
							if( this._headerNamesForContent.includes(matchingHeader) ){

								let lenOfHeader = String(`# ${matchingHeader}`).length;

								let subContent = String(matched).substring(lenOfHeader,matched.length);
								subContent = this.trimByChar(subContent, '\n').trim();

								if(!answers.contentInsideHeaders) {
									answers.contentInsideHeaders = {};
								}
								if(matchingHeader) {
									answers.contentInsideHeaders[matchingHeader] = subContent;
								}
							}
						}
				}
			});
		}
		return answers;
	}


	revealCorrectGlossary(forceHide: boolean = false) {


		let hiddenAnswers = document.querySelectorAll('.glossary-answers-correct');
		if ( hiddenAnswers && forceHide === true) {
			for(let i = 0; i < hiddenAnswers.length; i++) {
				hiddenAnswers[i].addClass('hidden');
				hiddenAnswers[i].removeClass('revealed');
			}
			return false;
		}
		if(hiddenAnswers) {
			for(let i = 0; i < hiddenAnswers.length; i++) {
				if (hiddenAnswers[i].classList.contains('hidden')) {
					hiddenAnswers[i].removeClass('hidden');
					hiddenAnswers[i].addClass('revealed');
				} else {
					hiddenAnswers[i].addClass('hidden');
					hiddenAnswers[i].removeClass('revealed');
				}

			}
		}
	}


	glossaryMaskMode(obj: any) {

		this.maskMode = obj.value;
		// @ts-ignore
		this.constructTestFromDefinitions(this.glossaryData);
	}

	glossaryMaskPercentage(obj: any) {

		this.maskPercentage = obj.value;
		// @ts-ignore
		this.constructTestFromDefinitions(this.glossaryData);
	}

	// @ts-ignore
	generateGlossaryTest(questionAnswerArray, maskMode='SEQUENTIAL_LEFT', maskPercentage= 80) {

		this.maskMode = maskMode;

		this.maskPercentage = maskPercentage;
		const configurationsHTML = `<table class="glossary-test-settings">
  <tr>
  <td>
  <span class="glossary-settings-label">Mask Percentage:</span>
  </td>
  <td>
  <select id="mask_mode" class="mask-mode-selector" onchange="window.glossaryMaskMode(this)">

      <option ${(maskMode=="SEQUENTIAL_LEFT")?"SELECTED":""} value="SEQUENTIAL_LEFT">SEQUENTIAL LEFT</option>
      <option ${(maskMode=="SEQUENTIAL_RIGHT")?"SELECTED":""} value="SEQUENTIAL_RIGHT">SEQUENTIAL RIGHT</option>
      <option ${(maskMode=="SEQUENTIAL_CENTER")?"SELECTED":""} value="SEQUENTIAL_CENTER">SEQUENTIAL CENTER</option>
      <option ${(maskMode=="SYMMETRIC")?"SELECTED":""} value="SYMMETRIC">SYMMETRIC</option>
      <option ${(maskMode=="RANDOM")?"SELECTED":""} value="RANDOM">RANDOM</option>
      <option ${(maskMode=="VOWELS")?"SELECTED":""} value="VOWELS">VOWELS</option>
      <option ${(maskMode=="CONSONANTS")?"SELECTED":""} value="CONSONANTS">CONSONANTS</option>
      <option ${(maskMode=="SCRAMBLE")?"SELECTED":""} value="SCRAMBLE">SCRAMBLE</option>
      </select>
      </td>
      </tr>
      <tr>
      <td>
      <span class="glossary-settings-label">Mask Percentage:</span>
  </td>
  <td>
  <input class="glossary-settings-input" type="text" value="${maskPercentage}" id="mask_percent" onchange="window.glossaryMaskPercentage(this)" />
      </td>
      </tr>
      </table>`;

		let tagOptions = '';
		let tagOptionArray = this.getFormattedFilterTags(true);
		console.log('tagOptionArray', tagOptionArray);
		for(let i = 0; i < tagOptionArray.length; i++) {

			tagOptions += `<option ${(i==0)?"SELECTED":""} >${tagOptionArray[i]}</option>`;
		}
		this.glossaryTestTagsToFilter = tagOptionArray[0];
		let html = document.createElement('div');
		html.classList.add("glossary-wrapper");
		let htmlContent = '';

		const introHTML = `<div class="glossary-intro-panel">
			<div class="glossary-intro-panel-header">Glossary Tester</div>
			<div class="glossary-intro-panel-content">This session will display cards that match the hash tags selected below.</div>
			<div class="glossary-intro-panel-intro">Instructions:</div>
			<div class="glossary-intro-panel-instructions">
				<ul>
					<li>Select the hash tag from the list shown below</li>
					<li>You can optionally set the number of cards for this session</li>
					<li>Read the hint</li>
					<li>Recall the hidden characters</li> 
					<li>Click on "Check" to confirm the correct response</li> 
					<li>Click on "Good" to mark the card as correct and proceed to the next card</li>
					<li>Click on "Bad" to mark the card as incorrect and proceed to the next card</li>		
				</ul>
			</div>
			<select class="glossary-controls tag-selector" onchange="window.glossaryTagSelection(this)">
			${tagOptions}
			</select> 
			<input class="glossary-controls cards-per-session" onchange="window.glossaryCardsPerSessionSelection(this)" type="text" id="cards_per_session" name="cards_per_session" value="${mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession}" />
			<button class="glossary-controls next-question good" onclick="window.gotoGlossaryNumber('0', 'START')">START</button>
			</div>`;

		const sessionCompletionHTML = `<div class="glossary-completion-panel hidden">
			<div class="glossary-completion-panel-header">Glossary Tester</div>
			<div class="glossary-completion-panel-content">You have covered ${mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession} cards in this session.</div>
			<div class="glossary-completion-panel-title">Result Summary:</div>
			<div class="glossary-completion-panel-results">
				<ul>
					<li>Number of correct answers: ___CORRECT_ANSWERS___</li>
					<li>Number of incorrect answers ___INCORRECT_ANSWERS___</li> 
					<li>Total time of session ___SESSION_DURATION___ seconds</li> 
				</ul>
			</div> 
			<button class="glossary-controls next-question good" onclick="window.gotoGlossaryNumber('1', 'EXIT')">Exit</button>
			</div>`;


		htmlContent += introHTML;
		for(let i = 0; i < questionAnswerArray.length; i++ ) {

			let hint = '';
			if( questionAnswerArray[i].frontmatter && questionAnswerArray[i].frontmatter.memorisation_hints) {
				hint = questionAnswerArray[i].frontmatter.memorisation_hints;
			}

			htmlContent += `<div class="glossary-question-wrapper question-number-${i} hidden" data-questionumber="${i}"><div class="glossary-question" id="glossary_question_${i}">${hint}</div>`;

			htmlContent += this.obfuscateWord(questionAnswerArray[i].frontmatter.term, maskMode, maskPercentage);

			htmlContent += this.obfuscateWord(questionAnswerArray[i].frontmatter.term, 'SEQUENTIAL_LEFT', 0, 'glossary-answers-correct hidden');
			let gotoPrevious = -1;
			if(i > 0) {
				gotoPrevious = i - 1;
			}

			let lastCard = 'YES';
			let gotoNext = i + 1;
			if(i < (questionAnswerArray.length - 1)) {
				lastCard = 'NO';
			}
			console.log(`gotoNext: ${gotoNext} , questionAnswerArray.length: ${questionAnswerArray.length}, i: ${i}`)
			htmlContent += configurationsHTML;
			htmlContent += `<div class="glossary-status-bar"><span class="glossary-timer-box">0</span><span class="glossary-progress-box">0</span></div><div class="glossary-controls-wrapper"><button class="glossary-controls previous-question" onclick="window.gotoGlossaryNumber('${gotoPrevious}')">Previous</button><button class="glossary-controls check-answer" data-glossarynumber="${i}" onclick="window.revealCorrectGlossary(this)" >Check</button><button class="glossary-controls next-question bad" onclick="window.gotoGlossaryNumber('${gotoNext}', 'BAD', '${lastCard}')">Bad</button><button class="glossary-controls next-question good" onclick="window.gotoGlossaryNumber('${gotoNext}', 'GOOD', '${lastCard}')">Good</button></div>`
			htmlContent += `</div>`
		}

		htmlContent += sessionCompletionHTML;
		html.innerHTML = htmlContent;

		return html.outerHTML;
	}

	getFormattedFilterTags(getAsArray: boolean = false) : string | Array<any> {
		const tmpTag = this.glossaryTestTagsToFilter.split(' ').join('');
		if(getAsArray === true && (typeof tmpTag == 'string')) {
			return tmpTag.split(',')
		}
		let tag = `#${tmpTag.split(',').join(',#')}`;
		console.log(`tag:${tag}`);
		tag = tag.split(' ').join('');
		return tag;
	}

	async scanFilesForDefinitions() {
		// @ts-ignore
		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
		const {contentEl} = this;
		let tag = this.getFormattedFilterTags();

		let tagList = tag;
		if(typeof tag == 'string') {
			tagList = tag.split(',');
		}
		const workspace = this.app.workspace;
		const cache = this.app.metadataCache;
		const files = this.app.vault.getMarkdownFiles();
		const files_with_tag = [] as TFile [];
		let definitions: any[][] = [];

		await Promise.all(files.map(async (file) => {
			const file_cache = cache.getFileCache(file);
			if(file_cache) {
				const tags = getAllTags(file_cache);

				if(tags) {
					let tagMatch = false;
					for(let i = 0; i < tagList.length; i++ ){

						if(tags.includes(tagList[i].trim())) {
							tagMatch = true;
						}
					}
					if (tagMatch === true) {
						files_with_tag.push(file);

						const fullExistingFileText = await this.app.vault.read(file);
						let definition = await this.getDefinition(fullExistingFileText, file.path );
						// @ts-ignore
						definition["file_path"] = file.path;
						// @ts-ignore
						definitions.push(definition);
					}
				}
			}

		}));

		definitions = this.computeGlossaryUnknownProbability(definitions);

		definitions = this.getDefinitionsAccordingToUserPreference(definitions);
		//shuffleArray(definitions);

		this.glossaryData = definitions;



	}
	/**
	 * goes through all candidates and evaluates the likelihood that the term is unknown
	 *
	 * Factors used:
	 * 	1. Has it ever been tested
	 * 	2. If it has been tested then
	 * 		a) what is the ratio of trials to errors
	 * 		b) how many days have elapsed since it was last tested
	 *  3. Is the glossary term complex? (i.e. very long, consists of multiple words etc)
	 *
	 */
	computeGlossaryUnknownProbability(definitions: any){


		function computePriorityScore(term: string, attemptsCount: number, successCount: number, recallTime: number, elapsedDays: number) : Array<any>  {

			let complexityFactor = term.length * 0.2;
			let hitRate = 1;
			if (successCount > 0 && attemptsCount > 0) {
				hitRate = 0.05 * (successCount / attemptsCount);
			}
			else if(attemptsCount > 0) {
				hitRate = (successCount / attemptsCount);
			}
			if(attemptsCount == 0){
				hitRate = 0.0005;
			}



			recallTime = recallTime * 0.1;
			if (recallTime < 1) {
				recallTime = 300;
			}
			if (isNaN(elapsedDays)) {
				elapsedDays = 100;
			}
			if (elapsedDays < 1) {
				elapsedDays = 0.9;
			}

			let priority = Math.round((complexityFactor * elapsedDays * recallTime) / hitRate);



			const priorityCalculation = `priority = (${complexityFactor} * ${elapsedDays} * ${recallTime}) / ${hitRate} = ${priority}`;

			return [priority, priorityCalculation];
			}




		/**
		 * returns an object:
		 *  {
		 *      "attemptsCount" : number
		 *      "successCount" : number
		 *      "recallTime" : number
		 *  }
		 *
		 */
		function getCumulativeAttemptsAndSuccessCounts(glossaryRecall: object) {
			let attemptCount = 0;
			let successCount = 0;
			let recallTime = 0;
			let result = {
				attemptCount: attemptCount,
				successCount: successCount,
				recallTime: recallTime
			};

			// @ts-ignore
			if(glossaryRecall.recall_attempt_count && !isNaN(glossaryRecall.recall_attempt_count)) {
				// @ts-ignore
				result.attemptCount = glossaryRecall.recall_attempt_count;
			}
			// @ts-ignore
			if(glossaryRecall.recall_success_count && !isNaN(glossaryRecall.recall_success_count)) {
				// @ts-ignore
				result.successCount = glossaryRecall.recall_success_count;
			}

			// @ts-ignore
			if(glossaryRecall.recall_time && !isNaN(glossaryRecall.recall_time)) {
				// @ts-ignore
				result.recallTime = glossaryRecall.recall_time;
			}

		return result;
		}

		/**
		 * calculate number of days elapsed since the term was last tested
		 * returns number of days elapsed
		 * if empty timestamp is provided it assumes 100 days prior to curent date
		 */
		function getDaysElapsedSinceLastTest(recallTimestamp: any) {
			let timestamp = recallTimestamp;
			if(!timestamp || (String(timestamp).trim()) == "" || timestamp == 0 || (String(timestamp).trim().slice(10, 11) != 'T') ) {
				timestamp = moment().subtract(100, 'days').startOf('day');
			}
			let currentDate = moment(Date.now()).format('YYYY-MM-DD');

			var start = moment(timestamp, "YYYY-MM-DD");
			var end = moment(currentDate, "YYYY-MM-DD");
			return Math.round(moment.duration(end.diff(start)).asDays());
		}

		for (let idx = 0 ; idx < definitions.length; idx++) {
			let def = definitions[idx];
			if(!def.frontmatter.term) {
				definitions[idx].frontmatter.term = 'undefined';
			}
			if(!def.frontmatter.glossary_recall.recall_time) {

				definitions[idx].frontmatter.glossary_recall.recall_time = '0';
			}

	 		const term = def.frontmatter.term;
			const glossaryRecall = def.frontmatter.glossary_recall;
			let daysElapsedSinceTesting = getDaysElapsedSinceLastTest(def.frontmatter.glossary_recall.recall_attempt_timestamp);
	 		let testStatus = getCumulativeAttemptsAndSuccessCounts(glossaryRecall);

			// @ts-ignore
			const probabilities = computePriorityScore(def.frontmatter.term, glossaryRecall.recall_attempt_count ,glossaryRecall.recall_success_count ,glossaryRecall.recall_time, daysElapsedSinceTesting );
			let priority = probabilities[0];
			const priorityCalculation = probabilities[1];


			let scheduledTestingDate = getDaysElapsedSinceLastTest(def.frontmatter.glossary_recall.next_recall_test_date);
			if(scheduledTestingDate && def.frontmatter.glossary_recall.next_recall_test_date) {
				const fullTimeStamp = `${def.frontmatter.glossary_recall.next_recall_test_date}T00:00:00`;

				console.log(`daysTillNextTest = ${Math.abs(getDaysElapsedSinceLastTest(fullTimeStamp))}`);
				const daysTillScheduled = Math.abs(getDaysElapsedSinceLastTest(fullTimeStamp));
				if(daysTillScheduled == 0 ) {
					priority = priority * 1000;
				}
			}

			// @ts-ignore
			definitions[idx].priority = priority;
			definitions[idx].priorityCalculation = priorityCalculation;

			// @ts-ignore
			//console.log(`${term} was tested ${testStatus.attemptCount} times out of which ${testStatus.successCount} were correct with latest recall time ${testStatus.recallTime} seconds responses ${daysElapsedSinceTesting} days ago so priority is ${priority}`);

		}
		return definitions;
	}


	getDefinitionsAccordingToUserPreference(definitions: any[][]): any[][] {
		/**
		 * sortByKey - sorts an array of objects by a specified key
		 *
		 * @param arrayToSort - an array of objects
		 * @param key - the object key to use for sorting
		 * @param sortOrder - can be "ASCENDING" or "DESCENDING"
		 */
		function sortByKey(arrayToSort: Array<any>, key: string, sortOrder: string = 'ASCENDING'): any[][] {
			if(sortOrder == 'ASCENDING') {
				return arrayToSort.sort(function (a, b) {
					var x = a[key];
					var y = b[key];
					return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				});
			}
			else if(sortOrder == 'DESCENDING') {
				return arrayToSort.sort(function (a, b) {
					var x = a[key];
					var y = b[key];
					return ((x > y) ? -1 : ((x < y) ? 1 : 0));
				});
			}
			return arrayToSort;
		}

		function randomInteger(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		let cardsToShow = mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession;
		if(cardsToShow > definitions.length) {
			cardsToShow = definitions.length;
		}
		let unusedCards = (definitions.length - cardsToShow);
		let cardsPicked = 0;
		let pickedDefinitions: any[][] = [];
		let tmpDefs = [...definitions];

		tmpDefs = sortByKey(tmpDefs, 'priority', 'DESCENDING');
		console.log(tmpDefs);
		pickedDefinitions = tmpDefs.slice(0, (cardsToShow));
		/*
		for (let i=0; i < definitions.length; i++ ) {
			let pointer = randomInteger(0, (tmpDefs.length -1));
			pickedDefinitions.push(tmpDefs[pointer]);
			tmpDefs.splice(pointer, 1);
			cardsPicked = cardsPicked + 1;
			if(cardsPicked >= cardsToShow) {
				break;
			}
		}
		*/
		console.log(pickedDefinitions);
		return pickedDefinitions;
	}

	constructTestFromDefinitions(definitions: any[][] = []) {
		if(definitions) {

			let glossaryHTML = this.generateGlossaryTest(definitions, this.maskMode, this.maskPercentage);
			let modalDiv = document.querySelector('.modal-container .modal-content');
			if(modalDiv) {
				modalDiv.innerHTML = glossaryHTML;
			}
		}
	}

	updateStatusBar() {
		this.timerCounter++;
		let timerBox = document.querySelectorAll('.glossary-timer-box');
		if(timerBox) {
			for(let i = 0; i < timerBox.length; i++) {
				if(timerBox[i]) {
					// @ts-ignore
					timerBox[i].innerText = String(this.timerCounter);
				}
			}
		}

		let progressBox = document.querySelectorAll('.glossary-progress-box');
		if(progressBox) {
			for(let i = 0; i < progressBox.length; i++) {
				if(progressBox[i]) {
					// @ts-ignore
					progressBox[i].innerText = `${String(this.correctAnswerCount)} / ${String(this.glossaryData.length)}`;
				}
			}
		}

	}

	async onLoad() {


	}

	async onOpen() {
		this.intervalTimer = window.setInterval(() => this.updateStatusBar(), 1000);
		await this.scanFilesForDefinitions();

		this.constructTestFromDefinitions(this.glossaryData);
	}

	async updateDailyNote() {
		let currentDate = moment(Date.now()).format('YYYY-MM-DD');
		let currentYearMonth = moment(Date.now()).format('YYYY-MM');
		let dailyFrontmater = await this.getFrontmatterSectionFromFilePath(`Day Planners/${currentYearMonth}/${currentDate}.md`);
		let recallSuccessCount = dailyFrontmater.glossary_recall_session.recall_success_count;
		let newRecallSuccessCount = recallSuccessCount + this.correctAnswerCount;
		await this.updatePropertyInFile(`Day Planners/${currentYearMonth}/${currentDate}.md`, 'glossary_recall_session.recall_success_count', newRecallSuccessCount );

		let sessionCardsAttemptedCount = dailyFrontmater.glossary_recall_session.recall_attempt_count;
		let newSessionCardsAttemptedCount = sessionCardsAttemptedCount + this.sessionCardsAttemptedCount;
		await this.updatePropertyInFile(`Day Planners/${currentYearMonth}/${currentDate}.md`, 'glossary_recall_session.recall_attempt_count', newSessionCardsAttemptedCount );

		let sessionDuration = dailyFrontmater.glossary_recall_session.recall_session_duration;
		let newSessionDuration = sessionDuration + this.sessionDuration;
		await this.updatePropertyInFile(`Day Planners/${currentYearMonth}/${currentDate}.md`, 'glossary_recall_session.recall_session_duration', newSessionDuration );

	}

	async onClose() {
		await this.updateDailyNote();
		clearInterval(this.intervalTimer);
		const {contentEl} = this;
		contentEl.empty();
	}

}


class SampleModal extends Modal {

	generateQuiz (questionAnswerArray: Array<any>) {

		let html = document.createElement('div');
		html.classList.add("quiz-wrapper");
		let htmlContent = '';

		for(let i = 0; i < questionAnswerArray.length; i++ ) {
			let showStatus = 'hidden';
			if(i == 0) {
				showStatus = '';
			}
			htmlContent += `<div class="quiz-question-wrapper question-number-${i} ${showStatus}" data-questionumber="${i}"><div class="quiz-question" id="quiz_question_${i}">${questionAnswerArray[i]["question"]}</div>`;
			let rightAnswers = 0;
			let inputType = "radio";
			for(let j = 0; j< questionAnswerArray[i]["answers"].length; j++ ) {
				let rawAnswer = questionAnswerArray[i]["answers"][j];
				let rawAnswerArray = rawAnswer.split('::');
				if(rawAnswerArray[1].toLowerCase().trim() == 'true') {
					rightAnswers++;
				}
			}
			if(rightAnswers > 1) {
				inputType = 'checkbox';
			}
			htmlContent += `<table class="answers-table">`;
			for(let j = 0; j< questionAnswerArray[i]["answers"].length; j++ ) {
				let rawAnswer = questionAnswerArray[i]["answers"][j];
				let rawAnswerArray = rawAnswer.split('::');
				const path = "/media/plugin/assets/"; // DEBUG: don't use the settings.multilineFolder for now
				//const folder = this.app.vault.getAbstractFileByPath(path);
				let folder = this.app.vault.adapter.getResourcePath(path);
				const parts = folder.split('?');
				folder = parts[0];

				// @ts-ignore
				const myPluginPath = `${this.app.vault.adapter.getBasePath()}/.obsidian/plugins/mikiel`; //this.app.vault.getResourcePath(`${this.app.vault.adapter.basePath}/.obsidian/plugins/mikiel/`);

				let statusImage = `${folder}/bad_small.png`;
				if(rawAnswerArray[1].trim().toLowerCase() == 'true') {
					statusImage = `${folder}/good_small.png`;
				}
				htmlContent += `<tr class="answer-wrapper"><td><input name="answer_${i}" class="answer-choice" type="${inputType}" /></td><td><div class="quiz-answer" id="quiz_answer_${i}_${j}">${rawAnswerArray[0]}</div></td><td><input name="answer_status_${i}" class="answer-status" type="hidden" value="${rawAnswerArray[1]}" /></td><td><div class="correct-answer-flag hidden"><img src="${statusImage}" /></div></td></tr>`;
			}
			htmlContent += `</table>`;
			let gotoPrevious = -1;
			if(i > 0) {
				gotoPrevious = i - 1;
			}

			let gotoNext = -1;
			if(i < (questionAnswerArray.length)) {
				gotoNext = i + 1;
			}
			htmlContent += `<div class="quiz-controls-wrapper"><button class="quiz-controls previous-question" onclick="window.gotoQuestionNumber('${gotoPrevious}')">Previous</button><button class="quiz-controls check-answer" onclick="window.revealCorrectAnswers()" >Check</button><button class="quiz-controls next-question" onclick="window.gotoQuestionNumber('${gotoNext}')">Next</button></div>`
			htmlContent += `</div>`
		}
		html.innerHTML = htmlContent;

		return html.outerHTML;

	}

	revealCorrectAnswers(forceHide = false) {
		let allAnswerStatuses = document.querySelectorAll('.correct-answer-flag');
		for(let i = 0; i < allAnswerStatuses.length; i++) {
			if ( forceHide === true) {
				allAnswerStatuses[i].classList.add('hidden');
				allAnswerStatuses[i].classList.remove('reveal');
			}
			else {
				if (allAnswerStatuses[i].classList.contains('hidden')) {
					allAnswerStatuses[i].classList.remove('hidden');
					allAnswerStatuses[i].classList.add('reveal');
				} else {
					allAnswerStatuses[i].classList.add('hidden');
					allAnswerStatuses[i].classList.remove('reveal');
				}
			}
		}
	}

	gotoQuestionNumber(questionNumber: number) {
		this.revealCorrectAnswers(true);

		if ( questionNumber < 0 ) return false;

		let allQuestions = document.querySelectorAll('.quiz-question-wrapper');
		for(let i = 0; i < allQuestions.length; i++) {
			allQuestions[i].classList.add('hidden');
		}
		let currentQuestion = document.querySelector(`.question-number-${questionNumber}`);
		if(currentQuestion) {
			currentQuestion.classList.remove('hidden');
		}

	}
	getIndentedList(str: string) {

		const regex = /(---\n[\w\n\:\-\s\/]*---\n)?^(?:\d+\.|[*+-]) .*(?:\r?\n(?!(?:\d+\.|[*+-]) ).*)*/gm;
		let answers = new Array();
		let m;

		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			var answerIndex = 0;
			m.forEach((match, groupIndex) => {

				if( groupIndex == 0 && match ) {
					answerIndex = answers.length;
					answers[answerIndex] = {};
					let arr = match.split('\n\t');
					let question = arr[0].split('- ').join('');

					answers[answerIndex]["question"] = question;
					answers[answerIndex]["answers"] = [];
					arr.shift();
					for(let i = 0 ; i < arr.length; i++) {
						let ans = arr[i].split('- ').join('');

						answers[answerIndex]["answers"].push(ans);

					}

				}
			}, answerIndex);
		}
		return answers;
	}

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		const tag = "#nciquiz";
		const workspace = this.app.workspace;
		const cache = this.app.metadataCache;
		const files = this.app.vault.getMarkdownFiles();
		const files_with_tag = [] as TFile [];

		files.forEach( async (file) => {
			const file_cache = cache.getFileCache(file);
			if(file_cache) {
				const tags = getAllTags(file_cache);
				if(tags) {
					if (tags.includes(tag)) {
						files_with_tag.push(file);
						const fullExistingFileText = await this.app.vault.read(file);
						let str = this.getIndentedList(fullExistingFileText);
						let quizHTML = this.generateQuiz(str);
						let modalDiv = document.querySelector('.modal-container .modal-content');
						if(modalDiv) {
							modalDiv.innerHTML = quizHTML;
						}
					}
				}
			}


		});
		//contentEl.setText('Woah!');

	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class ListCalloutsPluginOverride extends ListCalloutsPlugin {
	async onload() {
		console.log("the callout has landed");
	}

}
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));


		containerEl.createEl('h2', {text: 'Glossary Tester Settings'});
		new Setting(containerEl)
			.setName('Cards Per Session')
			.setDesc('Number of cards tested in one session')
			.addText(text => text
				.setPlaceholder('cards tested in one session')
				.setValue(String(this.plugin.settings.glossaryTesterCardsPerSession))
				.onChange(async (value: string) => {
					this.plugin.settings.glossaryTesterCardsPerSession = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Prioritisation By Days Since Last Test')
			.setDesc('Prioritize cards that have not been tested for longer than a specified number of days')
			.addText(text => text
				.setPlaceholder('prioritize cards older than specified days')
				.setValue(String(this.plugin.settings.glossaryTesterPrioritizeCardsOlderThanDays))
				.onChange(async (value: string) => {

					this.plugin.settings.glossaryTesterPrioritizeCardsOlderThanDays = parseInt(value);
					await this.plugin.saveSettings();
				}));
		/**
		 * Set which tags will be used for testing
		 */
		new Setting(containerEl)
			.setName('Tags to match when generating glossary test')
			.setDesc('Enter a list of tags separated by commas. Do not include the # symbol.')
			.addText(textArea => textArea
				.setPlaceholder('tags for filtering glossary test cards')
				.setValue(String(this.plugin.settings.glossaryTestTagsToFilter))
				.onChange(async (value: string) => {

					this.plugin.settings.glossaryTestTagsToFilter = String(value);
					await this.plugin.saveSettings();
				}));
	}
}
