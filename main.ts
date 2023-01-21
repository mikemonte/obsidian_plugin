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
import {es2017_object} from "@typescript-eslint/scope-manager/dist/lib/es2017.object";



const yaml = require('js-yaml');
const fronty = require('front-matter');
const pathLib = require('pathlib');
const YML = require('yaml');
const puppeteer = require('puppeteer');
const utils = require('util');


//import ListCalloutsPlugin from 'obsidian_plugins/obsidian-list-callouts/main';
//import {ListCalloutSettings} from "./obsidian_plugins/obsidian-list-callouts/settings";
//import {buildPostProcessor} from "./obsidian_plugins/obsidian-list-callouts/postProcessor";
//import {calloutExtension, calloutsConfigField} from "./obsidian_plugins/obsidian-list-callouts/extension";
const prompt = require('electron-prompt');

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	glossaryTesterCardsPerSession: number;
	glossaryTesterPrioritizeCardsOlderThanDays: number;
	glossaryTestTagsToFilter: string;
	freestyleTestTagsToFilter: string;
	freestyleTesterCardsPerSession: number;
	freestyleTesterPrioritizeCardsOlderThanDays: number;
	findReplaceTagsToFilter: string;
	findReplaceFrontmatterPropertyNamesOriginal: string;
	findReplaceFrontmatterPropertyNamesNew: string;
	findReplaceFrontmatterValuesNew: string;
}


const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	glossaryTesterCardsPerSession: 15,
	glossaryTesterPrioritizeCardsOlderThanDays: 10,
	glossaryTestTagsToFilter: "",
	freestyleTestTagsToFilter: "",
	freestyleTesterCardsPerSession: 15,
	freestyleTesterPrioritizeCardsOlderThanDays: 10,
	findReplaceTagsToFilter: "",
	findReplaceFrontmatterPropertyNamesOriginal: "",
	findReplaceFrontmatterPropertyNamesNew: "",
	findReplaceFrontmatterValuesNew: ""
}

var foodIntakeTrackerInstance: FoodIntakeTracker;

var glossaryTesterInstance: GlossaryTester;

var mikielPlugin: MyPlugin;


var mikielPluginSettings: any;

var apiInstance: MikielAPI;

// @ts-ignore
window.mikielAPI = function(e: string) {

	apiInstance = new MikielAPI(mikielPluginSettings.app);
	return apiInstance;
	//apiInstance.myTestMethod();
}

// @ts-ignore
window.revealCorrectGlossary = function (obj) {
	glossaryTesterInstance.revealCorrectGlossary(false);
}

// @ts-ignore
window.freestyleTextAreaOnFocus = function(textAreaObj, idx) {

	let textAreaControls = document.querySelectorAll('.freestyle-answer-controls');
	for(let i = 0; i < textAreaControls.length; i++) {
			textAreaControls[i].classList.add('hidden');
	}
	let currentTextAreaControl = document.querySelector(`.${idx}`);
	if(currentTextAreaControl) {
		currentTextAreaControl.classList.remove('hidden');
	}
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


interface FoodItem {
	time: string;
	food_item: string;
	quantity: number;
}


const DEFAULT_FOODITEM: FoodItem = {
	time: '0000',
	food_item: '',
	quantity: 0
}

class MikielAPI {
	/**
	 * retrieve the instance of class FoodIntakeTracker
	 */
	get foodIntakeTrackerInstance(): FoodIntakeTracker {
		return this._foodIntakeTrackerInstance;
	}

	/**
	 * set the instance for class FoodIntakeTracker
	 */
	set foodIntakeTrackerInstance(value: FoodIntakeTracker) {
		this._foodIntakeTrackerInstance = value;
	}
	get app(): App {
		return this._app;
	}

	set app(value: App) {
		this._app = value;
	}

	private _app: App;

	private _foodIntakeTrackerInstance: FoodIntakeTracker;

	constructor(app: App) {

		this._app = app;
		this.foodIntakeTrackerInstance = new FoodIntakeTracker(this.app);
	}

	/**
	 * getListOfFoodsConsumedOnGivenDate
	 *
	 * This method will return an array of food items logged on the specified date
	 *   {
     *		"0": {
     *		"time": 730,
	 *		"food_item": "Wild Salmon Caviar",
	 *		"quantity": 30
	 *		},
	 *		"1": {
	 *		"time": 730,
	 *		"food_item": "Smoked Ham",
	 *		"quantity": 40
	 *		},
	 *		...
	 *		...
	 *	}
	 *
	 * @param foodIntakeDate - must be in the format YYYY-MM--DD
	 */
	async getListOfFoodsConsumedOnGivenDate(foodIntakeDate: string): Promise<object> {
		const foodIntakeFrontmatterRoot = "food_intake_tracker";
		foodIntakeDate = foodIntakeDate.trim();
		// TODO sanitize input to conform to YYYY-MM--DD format

		let foodIntake: object = {};
		let fmc = await this.foodIntakeTrackerInstance.getListOfFoodsConsumedOnGivenDate(foodIntakeDate);
		if(fmc && fmc[foodIntakeFrontmatterRoot]) {
			foodIntake = fmc[foodIntakeFrontmatterRoot];

		}

		return foodIntake;
	}

	/**
	 * getMacrosConsumedOnGivenDate
	 *
	 * This method will return an object of macros for food items logged on the specified date
	 *
	 * @param macrosIntakeDate - must be in the format YYYY-MM--DD
	 */
	async getMacrosConsumedOnGivenDate(macrosIntakeDate: string) : Promise<object>{
		const foodItemDefaults = DEFAULT_FOODITEM;

		let foodItems : any = await this.getListOfFoodsConsumedOnGivenDate(macrosIntakeDate);
		let foodMacros: Array<object> = [];
		let foodItemIndex : any;
		for(foodItemIndex in foodItems) {
			let foodItem : FoodItem = foodItems[foodItemIndex];
			foodMacros[foodItemIndex as keyof object] = await this.foodIntakeTrackerInstance.getMacrosForGivenFoodItem(foodItem["food_item"]);
		}
		return foodMacros;
	}

	/**
	 * Return text from given file path
	 *
	 * @param filePath
	 */
	async readTextFromFilePath(filePath: string) {

		let fileContent = 'File not found!';
		let existingFile = this.app.vault.getAbstractFileByPath(filePath);
		if(existingFile) {
			// @ts-ignore
			fileContent = await this.app.vault.read(existingFile);
		}
		return fileContent;
	}

	async getNutritionalData(nutritionSourceURL: string, domain: string = '' ) {

		let nutritionData = await this.foodIntakeTrackerInstance.getNutritionalData(nutritionSourceURL, false, domain);
		return nutritionData;


	}

	myTestMethod () {
		console.log("this is my test api mmethod")
	}
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

		//let myCallout = new ListCalloutsPluginOverride(this.app, this.manifest);

		//myCallout.testMe();

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
		 * This command lists entire glossary ond outputs to console
		 */
		this.addCommand({
			id: 'mikiel-frontmatter-replace',
			name: 'Replace Frontmatter Paths',
			callback: async () => {
				glossaryTesterInstance = new GlossaryTester(this.app, [], [], '');

				let tagArr = mikielPluginSettings.plugin.settings.findReplaceTagsToFilter.split(',');
				tagArr.forEach((tag: string, idx: number) => {
					tagArr[idx] = tag.trim();
				});
				let propArr = mikielPluginSettings.plugin.settings.findReplaceFrontmatterPropertyNamesOriginal.split(',');
				propArr.forEach((prop: string, idx: number) => {
					propArr[idx] = prop.trim();
				});
				let newPropArr = mikielPluginSettings.plugin.settings.findReplaceFrontmatterPropertyNamesNew.split(',');
				newPropArr.forEach((newProp: string, idx: number) => {
					newPropArr[idx] = newProp.trim();
				});

				await glossaryTesterInstance.updateFrontmatterFieldInFilePath('', tagArr, propArr, newPropArr);
			}
		});

		/**
		 * This command will use the source url in the Inventory/foods notes to fetch nutritional data and update the frontmatter
		 */
		this.addCommand({
			id: 'mikiel-update-food-data',
			name: 'Mikiel Update Food Data',
			callback: async () => {
				let domain: string = '';
				let nutritionDataURL: string = '';
				const foodItemFrontmatterField : string = 'nutritional_information_per_100g';
				foodIntakeTrackerInstance = new FoodIntakeTracker(this.app);
				const activeFile = this.app.workspace.getActiveFile();
				let fmc: any = {};

				if (activeFile && activeFile.path) {

					nutritionDataURL = await foodIntakeTrackerInstance.getFoodInventoryItemFrontmatter(activeFile.basename, 'nutritional_data_source');

					if(nutritionDataURL && typeof nutritionDataURL == 'string') {

						domain = Array.from(nutritionDataURL.matchAll(new RegExp('https:\\/\\/(www.)?([\\w\\-\\.]+)+\\/[\\W\\S]*?', 'gmi')))[0][2];
					}
					else{
						console.log('Please set the nutritional_data_source field to a valid nutrition source url');
					}

					let foodNutritionData  = await foodIntakeTrackerInstance.getNutritionalData(nutritionDataURL, false, domain);

					console.log(foodNutritionData)

					fmc = await foodIntakeTrackerInstance.getFoodInventoryItemFrontmatter(activeFile.basename, 'nutritional_information_per_100g');


					
					console.log(fmc)
					for(let i = 0; i < fmc.length; i++) {
				//		if (fmc[i]["name"] == 'energy') {
				//			fmc[i]["amount"] = '555';
				//		}
					}


					let fields = [];
					let values = [];


					let keysIdx = 0;
					fields.push(`["${foodItemFrontmatterField}"]["1"]["name"]`);
					values.push('energy');
					fields.push(`["${foodItemFrontmatterField}"]["1"]["amount"]`);
					values.push(555);

					const entriesUpdatedCount = await foodIntakeTrackerInstance.updateFrontmatterFoodIntakeProperty(activeFile.path, fields, values, foodItemFrontmatterField, false, true);
				}
				//
			}
		});



		/**
		 * This command lists entire glossary ond outputs to console
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
		 * This command processess the Food Intake Tracker
		 */
		this.addCommand({
			id: 'mikiel-food-intake-tracker',
			name: 'Mikiel Food Intake Tracker',
			callback: async () => {
				foodIntakeTrackerInstance = new FoodIntakeTracker(this.app);
				await foodIntakeTrackerInstance.processCurrentNoteFoodIntake();
			}
		});

		/**
		 * This command lists entire glossary ond outputs to console
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

		/**
		 * This command opens the Freestyle Testing Modal
		 */
		this.addCommand({
			id: 'mikiel-modal-freestyle-trainer',
			name: 'Freestyle Trainer Window',
			callback: () => {
				// @ts-ignore
				glossaryTesterInstance = new GlossaryTester(this.app, ["term","tags","memorisation_hints", "recall_attempt_count","recall_success_count", "recall_score"], ["Official Course Notes", "Concise Definition"], 'FREESTYLE');
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

				document.querySelectorAll('.lc-list-callout').forEach((el) => {
					let child = el.querySelector('.lc-list-marker');
					if (child && child.innerHTML && child.innerHTML.trim() == '!') {


						el.removeClass('callout-open');
						el.addClass('callout-closed');
						el.setAttribute("onclick", "window.toggleCallout(this)");
					}
				});
			}

		});

		this.registerEvent(

			this.app.workspace.on("file-open", function(obj) {

				document.querySelectorAll('.lc-list-callout').forEach((el) =>{
					let child = el.querySelector('.lc-list-marker');
					if(child && child.innerHTML && child.innerHTML.trim() == '!') {

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




interface FoodMacro {
	name: string;
	amount: number;
}


const DEFAULT_FOODMACRO: FoodMacro = {
	name: 'Macro Name',
	amount: 0
}


interface PageExtractData {
	url: string;
	status: string;
	title: string;
	raw_nutritional_data?: string;
	basicMacros: any;
	error?: string;
	domain: string;
	fullNutritionalData: any;
}


const DEFAULT_PAGEEXTRACTDATA: PageExtractData = {
	url: '',
	status: '',
	title: '',
	raw_nutritional_data: '',
	basicMacros: {},
	domain: '',
	basicMacros: {},
}


interface BasicNutritionData {
	calories: any;
	carbohydrates: any;
	fats: any;
	protein: any;
	minerals: any;
	other: any;
}

const DEFAULT_BASICNUTRITIONDATA: BasicNutritionData = {
	calories: {},
	carbohydrates: {},
	fats:  {},
	protein:  {},
	minerals:  {},
	other: {}
}

/**
 * FoodIntakeTracker
 *
 * This class provides a number of methods related to retrieving and updating logged intake of food
 *
 */
class FoodIntakeTracker {

	get app(): App {
		return this._app;
	}

	set app(value: App) {
		this._app = value;
	}

	private _app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * parseNutritionDataSelfPage
	 *
	 * parser specific to nutritionvalue.org
	 * @param str
	 */
	parserNutritionValuePage(str: string | undefined)  {

		function convertToGrams(val: string | number, unit: string) : string  {
			if(typeof val == 'string') {
				val = Number(val);
			}

			if((typeof val == 'string' && isNaN(parseFloat(val))) || val == -1) {
				val = 0;
			}
			switch (unit) {
				case 'mg':
					val = 0.001 * val;
					break;
				case 'mcg':
				case 'µg':
					val = 0.000001 * val;
					break;
				case 'g':
				default:
			}
			try {
				// @ts-ignore
				val = parseFloat(String(val).match(/(0.[\d]{1,12})0/gm)[0]);
			}
			catch(err) {}

			return String(val);
		}
		const regex =/(nutrient results([\W\S]*?)<br>|id="calories">([\d]+)<\/td>)/gim;

		var firstPass : Array<any> = [];

		if (typeof str == 'undefined') {
			return firstPass;
		}
		let sectionCount : number = 0;
		let dataCount : number  = -1;
		let key: string = '';

		let val = '';
		let ar = [];
		let title = '';
		let m: any;

		while ((m = regex.exec(str)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}

			m.forEach((match : string, groupIndex: number) => {
				let initialize = false;
				if(groupIndex == 1) {
					ar = match.split('"');
					title = ar[1];
					sectionCount = 0;
					initialize = true;
					if (typeof firstPass[sectionCount] == 'undefined') {
						firstPass[sectionCount] = {};
					}
					if(title == 'calories') {
						firstPass[sectionCount]["title"] = 'Calorie Information';
					}
				}
				if(groupIndex == 3 && sectionCount == 0) {
					firstPass[sectionCount]["raw_nutritional_data"] = [{ name: 'energy', value : match, daily_value: '', units: 'kcal' }];
				}
				if (groupIndex == 2) {

					const regex3 = new RegExp('<th colspan="3">([\\W\\S]*?)<\\/th>',
						'gm');
					const heading = regex3.exec(match);

					if(heading) {
						title = heading[1];

						let initialize = false;

						switch (title) {
							case 'Carbohydrates':
								sectionCount = 1;
								dataCount = 0;
								initialize = true;
								break;
							case 'Fats and Fatty Acids':
								sectionCount = 2;
								dataCount = 0;
								initialize = true;
								break;
							case 'Proteins and Aminoacids':
								sectionCount = 3;
								dataCount = 0;
								initialize = true;
								break;
							case 'Vitamins':
								sectionCount = 4;
								dataCount = 0;
								initialize = true;
								break;
							case 'Minerals':
								sectionCount = 5;
								dataCount = 0;
								initialize = true;
								break;
							case 'Sterols':
								sectionCount = 6;
								dataCount = 0;
								break;
							case 'Other':
								sectionCount = 7;
								dataCount = 0;
								initialize = true;
								break;
							default:
						}
						if (initialize === true) {
							if (typeof firstPass[sectionCount] == 'undefined') {
								firstPass[sectionCount] = {};
							}
							let pseudoTitle = title;
							switch(title) {
								case 'Fats and Fatty Acids':
									pseudoTitle = 'Fats & Fatty Acids';
									break;
								case 'Proteins and Aminoacids':
									pseudoTitle = 'Protein & Amino Acids';
									break;
								default:
							}
							firstPass[sectionCount]["title"] = pseudoTitle;
							firstPass[sectionCount]["raw_nutritional_data"] = {};
						}

						const regex2 = /class="tooltip">([\W\S]*?)<\/a>[\W\S]*?class="right">([\S]+?)<\/td>/gm;

						let m2;

						while ((m2 = regex2.exec(match)) !== null) {
							if (m.index === regex2.lastIndex) {
								regex2.lastIndex++;
							}

							m2.forEach((match2, groupIndex2) => {
								switch (groupIndex2) {
									case 1:
										key = 'name';
										val = match2;

										switch (match2) {
											case 'Carbohydrate':
												val = 'carbohydrates';
												break;
											case 'Fiber':
												val = 'fiber';
												break;
											case 'Fat':
												val = 'fat';
												break;
											case 'Vitamin A, RAE':
												val = 'vitamin_a';
												break;
											case 'Thiamin':
												val = 'vitamin_b1';
												break;
											case 'Riboflavin':
												val = 'vitamin_b2';
												break;
											case 'Niacin':
												val = 'vitamin_b3';
												break;
											case 'Pantothenic acid':
												val = 'vitamin_b5';
												break;
											case 'Carotene, alpha':
												val = 'carotene_alpha';
												break;
											case 'Carotene, beta':
												val = 'carotene_beta';
												break;
											case 'Vitamin B12':
												val = 'vitamin_b12';
												break;
											case 'Folate, DFE':
												val = 'folate';
												break;
											case 'Vitamin E (alpha-tocopherol)':
												val = 'vitamin_e';
												break;
											case 'Choline':
												val = 'choline';
												break;
											case 'Calories':
												val = 'energy';
												break;
											case 'Saturated fatty acids':
												val = 'saturates';
												break;
											case 'Monounsaturated fatty acids':
												val = 'monounsaturated';
												break;
											case 'Polyunsaturated fatty acids':
												val = 'polyunsaturated';
												break;
											case 'Docosahexaenoic n-3 acid (DHA)':
												val = 'DHA';
												break;
											case 'Docosapentaenoic n-3 acid (DPA)':
												val = 'DPA';
												break;
											case 'Eicosapentaenoic n-3 acid (EPA)':
												val = 'EPA';
												break;
											default:
												val = val.toLowerCase();
												val = val.split(',').join('').split(' ').join('_');
										}
										try {
											if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] ==
												'undefined') {
												firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
											}

											firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
										} catch (err) {
										}

										break;
									case 2:
										let ar = match2.split('&nbsp;');

										let unit = ar[1].trim();


										key = 'value';
										val = ar[0];

										val = convertToGrams(val, unit)


										try {
											if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] ==
												'undefined') {
												firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
											}

											firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
										} catch (err) {
										}

										key = 'units';
										val = 'g';
										try {
											if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] ==
												'undefined') {
												firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
											}

											firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
										} catch (err) {}
										dataCount++;
										break;
									default:
								}
							});
						}
					}
				}
			});
		}
		return firstPass;
	}
	/**
	 * parseNutritionDataSelfPage
	 *
	 * parser specific to nutritiondata.self.com
	 * @param str
	 */
	parseNutritionDataSelfPage(str: string | undefined)  {

		function convertToGrams(val: string | number, unit: string) {
			if(typeof val == 'string') {
				val = Number(val);
			}

			if((typeof val == 'string' && isNaN(parseFloat(val))) || val == -1) {
				val = 0;
			}
			switch (unit) {
				case 'mg':
					val = 0.001 * val;
					break;
				case 'mcg':
				case 'µg':
					val = 0.000001 * val;
					break;
				case 'g':
				default:
			}

			return val;
		}
		const regex = /.*"c01">[Calorie Information|Carbohydrates|Fats &amp; Fatty Acids|Protein &amp; Amino Acids|Vitamins|Minerals|Sterols|Other]+<\/div>[\W\S]*?<div class="clearer">([\W\S.]*?)<(br class="clearer"|\/table|div class="groupBorder")>+/gm;

		var firstPass : Array<any> = [];

		if (typeof str == 'undefined') {
			return firstPass;
		}

		let sectionCount : number = 0;
		let dataCount : number  = -1;
		let key: string = '';
		let m;
		while ((m = regex.exec(str)) !== null) {
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			m.forEach((match, groupIndex) => {
				switch(groupIndex) {
					case 0:
						let title = match.replace(/.*<div align="center" class="c01">([\W\S.]+?)<[\/\W\S.]*/gm, '$1');
						title = title.split('&amp;').join('&');
						let initialize = false;
						switch(title) {
							case 'Calorie Information':
								sectionCount = 0;
								dataCount = 0;
								initialize = true;
								break;
							case 'Carbohydrates':
								sectionCount = 1;
								dataCount = 0;
								initialize = true;
								break;
							case 'Fats & Fatty Acids':
								sectionCount = 2;
								dataCount = 0;
								initialize = true;
								break;
							case 'Protein & Amino Acids':
								sectionCount = 3;
								dataCount = 0;
								initialize = true;
								break;
							case 'Vitamins':
								sectionCount = 4;
								dataCount = 0;
								initialize = true;
								break;
							case 'Minerals':
								sectionCount = 5;
								dataCount = 0;
								initialize = true;
								break;
							case 'Sterols':
								sectionCount = 6;
								dataCount = 0;
								break;
							case 'Other':
								sectionCount = 7;
								dataCount = 0;
								initialize = true;
								break;
							default:
						}
						if(initialize === true) {
							if(typeof firstPass[sectionCount] == 'undefined') {
								firstPass[sectionCount] = {};
							}
							firstPass[sectionCount]["title"] = title;
							firstPass[sectionCount]["raw_nutritional_data"] = {};
						}
						break;
					case 1:
						let m2;
						const regex2 = /.*"([DV_]*[NUTRIENT_]+[\d]{1,4}|indented|nf1.*)">(&nbsp;)*["]*(.*)<[\/]*/gm;
						const str = match;
						while ((m2 = regex2.exec(str)) !== null) {
							// This is necessary to avoid infinite loops with zero-width matches
							if (m2.index === regex2.lastIndex) {
								regex2.lastIndex++;
							}
							m2.forEach((match2, groupIndex2) => {
								switch(groupIndex2) {
									case 1:
										let p = match2.split(' ')[0];
										p = p.split('_')[0];
										switch(p) {
											case 'nf1':
											case 'indented':
												key = 'name';
												break;
											case 'NUTRIENT':
												key = 'value';
												break;
											case 'UNIT':

												key = 'units';
												break;
											case 'DV':
												dataCount++;
												key = 'daily_value';
												break;
											default:
										}
										break;
									case 3:
										try {
											if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] == 'undefined') {
												firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
											}
											let val = match2.split('</span>').join('');
											//val = convertToGrams(val, unit);
											firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
										}
										catch(err) {}
										break;
									default:
								}
							});
						}
						break;
					default:
				}
			});
		}
		return firstPass;
	}

	/**
	 * extractBasicMacrosFromNutritionData
	 *
	 * Extracts just the basic macros and returns a json object as follows:
	 *
	 *  {
	 *  calories: {
	 *     total_calories: '160'
	 *     },
	 *  carbohydrates: {
	 *     total_carbohydrates: '8.5',
	 *     fiber: '6.7',
	 *     sugars: '0.7'
	 *     },
	 *  fats: {
	 *    total_fats: '14.7',
	 *    saturates: '2.1',
	 *    monounsaturated: '9.8',
	 *    polyunsaturated: '1.8',
	 *    transfats: 0,
	 *    omega3: 0.11,
	 *    omega6: 1.689
	 *    },
	 *  protein: {
	 *     total_protein: '2.0'
	 *     },
	 *  minerals: {
	 *     salt: 0.007
	 *     }
	 *  }
	 *
	 *
	 * @param nutritionData
	 * @returns json object - see above example
	 */
	extractBasicMacrosFromNutritionData(nutritionData: Array<any> = []) : BasicNutritionData{
		function convertToGrams(val: string | number, unit: string) {
			if(typeof val == 'string') {
				val = Number(val);
			}

			if((typeof val == 'string' && isNaN(parseFloat(val))) || val == -1) {
				val = 0;
			}
			switch (unit) {
				case 'mg':
					val = 0.001 * val;
					break;
				case 'mcg':
				case 'µg':
					val = 0.000001 * val;
					break;
				case 'g':
				default:
			}

			return val;
		}
		let basicNutritionData : BasicNutritionData = DEFAULT_BASICNUTRITIONDATA;
		for(let i = 0; i < nutritionData.length; i++) {
			let key: string = '';
			let val: number = -1;
			let unit: string = 'g';
			let macro: string = '';
			if(nutritionData[i] && nutritionData[i]["title"] ) {
				switch (nutritionData[i]["title"]) {
					case 'Calorie Information':
						macro = 'calories'

						for (let entry in nutritionData[i]["raw_nutritional_data"]) {
							val = -1;
							key = '';
							if (typeof basicNutritionData["calories"] == 'undefined') {
								basicNutritionData["calories"] = {};
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Calories') {
								key = 'total_calories'
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							if (key != '') {
								val = convertToGrams(val, unit);
								basicNutritionData['calories'][key] = val;
							}
						}
						break;
					case 'Carbohydrates':
						macro = 'carbohydrates'
						for (let entry in nutritionData[i]["raw_nutritional_data"]) {
							val = -1;
							key = '';
							if (typeof basicNutritionData['carbohydrates'] == 'undefined') {
								basicNutritionData['carbohydrates'] = {};
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							switch (nutritionData[i]["raw_nutritional_data"][entry]["name"]) {
								case 'Total Carbohydrate':
									key = 'carbohydrates'
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Dietary Fiber':
									key = "fiber";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Sugars':
									basicNutritionData['carbohydrates']["sugars"] = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								default:
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							if (key != '') {
								val = convertToGrams(val, unit);
								basicNutritionData['carbohydrates'][key] = val;
							}
						}
					case 'Fats & Fatty Acids':
						macro = 'fats';
						for (let entry in nutritionData[i]["raw_nutritional_data"]) {
							val = -1;
							key = '';

							if (typeof basicNutritionData['fats'] == 'undefined') {
								basicNutritionData['fats'] = {};
							}

							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							switch (nutritionData[i]["raw_nutritional_data"][entry]["name"]) {
								case 'Total Fat':
									key = 'total_fats';
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Saturated Fat':
									key = 'saturates';
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Monounsaturated Fat':
									key = "monounsaturated";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Polyunsaturated Fat':
									key = "polyunsaturated";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Total trans fatty acids':
									key = "transfats";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Total Omega-3 fatty acids':
									key = "omega3";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								case 'Total Omega-6 fatty acids':
									key = "omega6";
									val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
									break;
								default:
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							if (key != '') {
								val = convertToGrams(val, unit);
								basicNutritionData['fats'][key] = val;
							}
						}
						break;
					case 'Protein & Amino Acids':
						macro = 'protein';
						for (let entry in nutritionData[i]["raw_nutritional_data"]) {
							val = -1;
							key = '';
							if (typeof basicNutritionData['protein'] == 'undefined') {
								basicNutritionData['protein'] = {};
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Protein') {
								key = 'total_protein';
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							if (key != '') {
								val = convertToGrams(val, unit);
								basicNutritionData['protein'][key] = val;
							}
						}
						break;
					case 'Minerals':
						macro = 'minerals';
						for (let entry in nutritionData[i]["raw_nutritional_data"]) {
							val = -1;
							key = '';
							if (typeof basicNutritionData['minerals'] == 'undefined') {
								basicNutritionData['minerals'] = {};
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Sodium') {
								key = 'salt';
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
							}
							if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
								unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
							}
							if (key != '') {
								val = convertToGrams(val, unit);
								basicNutritionData['minerals'][key] = val;
							}
						}
						break;
					default:
				}
			}
		}
		return basicNutritionData;
	}

	/**
	 * getNutritionalData
	 *
	 * This method uses puppeteer to scrape nutrition data about specific food items
	 * the sourceURL that is provided has to exist and can only be from nutritiondata.self.com/
	 * if the url page does not exist or it times out the return status will show the error as follows:
	 * { "status": "An error occurred reading data from https://nutritiondata.self.com/facts/fruits-and-fruit-juices/1843/2"}
	 * if data is retrieved successfully the output will look like this:
	 *
	 *  {
	 *    title: 'Mayonnaise dressing, no cholesterol',
	 *    raw_nutritional_data: '\n' +
	 *      '<table border="0" cellpadding="0" cellspacing="0" width="620">\n' +
	 *      ...
	 *      ...
	 *      '</tbody></table>\n',
	 *    basicMacros: {
	 *      calories: { total_calories: '688' },
	 *      carbohydrates: { total_carbohydrates: '0.3', fiber: '0.0', sugars: '0.3' },
	 *      fats: {
	 *        total_fats: '77.8',
	 *        saturates: '10.8',
	 *        monounsaturated: '18.0',
	 *        polyunsaturated: '45.5',
	 *        transfats: 0,
	 *        omega3: 4.97,
	 *        omega6: 40.567
	 *      },
	 *      protein: { total_protein: '0.0' },
	 *      minerals: { salt: 0.486 }
	 *    },
	 *    status: 'success'
	 *  }
	 *
	 *  by default the "raw_nutritional_data" is NOT returned unless you set the includeRawHTML to true
	 *
	 * @param sourceURL
	 */
	async getNutritionalData (sourceURL: string, includeRawHTML: boolean = false, domain: string) : Promise<PageExtractData> {

		let pageData: PageExtractData = {	url: '',
			status: '',
			title: '',
			domain: domain,
			raw_nutritional_data: '',
			basicMacros: {},
			fullNutritionalData: {}
		};
		pageData["url"] = sourceURL;
		const browser = await puppeteer.launch({
			args: ['--single-process'],
			headless: true,
			defaultViewport: null
		});
		const page = await browser.newPage();
		await page.setUserAgent(
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
		);

		const pageLoadOptions = {
			timeout: 90000
		};

		switch (domain) {
			case 'nutritionvalue.org':
				try {
					await page.goto(sourceURL, pageLoadOptions);
					}
					catch(err) {
						console.log(err);
						pageData["error"] = err
						pageData["status"] = 'error';
						return pageData;
					}
					pageData = await page.evaluate(() => {
						let results : PageExtractData = {
							url: '',
							status: '',
							title: '',
							raw_nutritional_data: '',
							basicMacros: {},
							fullNutritionalData: {}
						};
						let foodTitleEl = document.querySelector(
							'#food-name');
						results["title"] = '';
						if(foodTitleEl) {
							// @ts-ignore
							results["title"] = foodTitleEl.innerText;
						}

						let foodDetailElements = document.querySelector(
							'#main > tbody > tr.food-info');
						results["raw_nutritional_data"] = '';
						if(foodDetailElements) {
							results["raw_nutritional_data"] = foodDetailElements.innerHTML;
						}

						return results;
					});

				break;
			case 'nutritiondata.self.com':
				try {
					await page.goto(sourceURL, pageLoadOptions);
					await page.waitForSelector('#onetrust-accept-btn-handler');
				}
				catch(err) {
					pageData["status"] = 'error';
					return pageData;
				}
				await page.click('#onetrust-accept-btn-handler');

				await page.select('#facts_header > form > select', '100.0');

				pageData = await page.evaluate(() => {
					let results : PageExtractData = {
						url: '',
						status: '',
						title: '',
						raw_nutritional_data: '',
						basicMacros: {},
						fullNutritionalData: {}
					};
					let foodTitleEl = document.querySelector(
						'#facts_header .facts-heading');
					results["title"] = '';
					if(foodTitleEl) {
						// @ts-ignore
						results["title"] = foodTitleEl.innerText;
					}
					let foodDetailElements = document.querySelector(
						'#NutritionInformationSlide');
					results["raw_nutritional_data"] = '';
					if(foodDetailElements) {
						results["raw_nutritional_data"] = foodDetailElements.innerHTML;
					}
					return results;
				});
				break;
			default:
		}

		let fullNutritionalData;
		switch (domain) {
			case 'nutritionvalue.org':
				fullNutritionalData = this.parserNutritionValuePage(pageData["raw_nutritional_data"]);
				pageData["basicMacros"] = this.extractBasicMacrosFromNutritionData(fullNutritionalData);
				break;
			case 'nutritiondata.self.com':
				fullNutritionalData = this.parseNutritionDataSelfPage(pageData["raw_nutritional_data"]);
				pageData["basicMacros"] = this.extractBasicMacrosFromNutritionData(fullNutritionalData);
				break;
			default:

		}

		pageData["fullNutritionalData"] = fullNutritionalData;

		if(includeRawHTML === false ) {
			delete pageData["raw_nutritional_data"];
		}
		pageData["status"] = 'success';

		await browser.close();
		return pageData;
	}

	/**
	 * getMacrosForGivenFoodItem
	 *
	 *
	 *
	 */
	async getMacrosForGivenFoodItem (foodItemName: string) : Promise<FoodMacro> {

		let foodItemMacro : FoodMacro = DEFAULT_FOODMACRO;




		return foodItemMacro;
	}

	/**
	 * getFoodInventoryItemFrontmatter
	 *
	 *
	 */
	async getFoodInventoryItemFrontmatter(foodItemName: string, foodItemFrontmatterField : string = 'nutritional_information_per_100g') : Promise<any> {
		if (foodItemName.indexOf('.md') == -1) {
			foodItemName = `${foodItemName.trim()}.md`;
		}
		const foodInventoryFolderPath : string = 'Inventory/Foods/';

		let foodItemFrontmatter: object = {};
		let foodInventoryItemPath = `${foodInventoryFolderPath}${foodItemName.trim()}`;

		let fmc : object = await this.getFrontmatterSectionFromFilePath(foodInventoryItemPath);

		if(fmc && fmc[foodItemFrontmatterField as keyof object]) {
			foodItemFrontmatter = fmc[foodItemFrontmatterField as keyof object];
		}

		return foodItemFrontmatter;
	}

	/**
	/**
	 * updateFrontmatterProperty
	 *
	 *
	 * @param filePath
	 * @param fields
	 * @param values
	 */
	async updateFrontmatterFoodIntakeProperty(filePath: string, fields: Array<string>, values: Array<string> = [], foodIntakeFrontmatterRootField: string, resetOriginalData: boolean = true, forceTrimYAML: boolean = true) : Promise<number> {

		let numberOfEntriesUpdate: number = 0;
		let fileContent: string = "";


		let existingFile = this.app.vault.getAbstractFileByPath(filePath);

		if (!(existingFile instanceof TFile)) {
			return numberOfEntriesUpdate;
		} else {
			fileContent = await this.app.vault.read(existingFile);
		}
		let metaEndIdx = fileContent.split('---\n');

		let fmc = await this.getFrontmatterSectionFromFilePath(filePath);

		// TODO find alternative way to do this as EVAL is not safe
		if(resetOriginalData === true) {
			eval(`fmc["${foodIntakeFrontmatterRootField}"] = {};`);
		}

		let testValue = null;
		let testKey = '';
		for (let i = 0; i < fields.length; i++) {
			try {
				// TODO find alternative way to do this as EVAL is not safe
				eval(`testValue = fmc${fields[i]};`);
				try {
					eval(`fmc${fields[i]} = ${values[i]};`);
				}
				catch(err) {
					eval(`fmc${fields[i]} = '${values[i]}';`);
				}
				numberOfEntriesUpdate++;
			} catch (error) {
				let tmpAr = fields[i].split('[');

				for (let j = 0; j < tmpAr.length; j++) {
					let tmpField = tmpAr[j].split(']').join('');
					tmpField = tmpField.trim();

					if (tmpField && tmpField.length > 0 && typeof eval(`fmc${testKey}`) != 'undefined') {
						testKey += `[${tmpField}]`;
						if (typeof eval(`fmc${testKey}`) == 'undefined' && j < (tmpAr.length - 1)) {
							// TODO find alternative way to do this as EVAL is not safe
							eval(`fmc${testKey} = {}`);
							try {
								eval(`fmc${fields[i]} = ${values[i]};`);
							}
							catch(err) {
								eval(`fmc${fields[i]} = '${values[i]}';`);
							}
							numberOfEntriesUpdate++;
						}
						if ((j == (tmpAr.length - 1))) {
							testKey = '';
						}
					}
				}
			}
		}

		// @ts-ignore
		var compareFunc, toTAML, trimYAML;

		compareFunc = (a: any, b: any) => {
			if(!isNaN(a) && !isNaN(b)) {
				a = +a;
				b = +b;
			}
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		};

		trimYAML = function(str: string) : string {

			const regex = /('([\d])+':[\W\S]*?([\ ]+)[a-z]*?:)/gmi;
			//const regex = /('([\d])+':[\W\S]*?([\ ]+)[\w\s\ ]*?: [\w\n\ :]*[']?[\w]*[']?)/gmi
			let m;
			let out: string = str;
			while ((m = regex.exec(str)) !== null) {
				if (m.index === regex.lastIndex) {
					regex.lastIndex++;
				}

				m.forEach((match, groupIndex) => {

					if(groupIndex == 1) {

						let ar = match.split('\n');

						let idx = ar[0].split("'")[1];
						let subst = `${String(idx)}:\n${ar[1]}`;

						out = out.split(match).join(subst);
					}
				});
			}
			out = out.split('  ').join(' ');
			return out;
		}
		toTAML = function(obj: any, lKeys: any) {
			var h, i, j, key, len, sortKeys;
			h = {};
			for (i = j = 0, len = lKeys.length; j < len; i = ++j) {
				key = lKeys[i];
				// @ts-ignore
				h[key] = i + 1;
			}
			sortKeys = (a: any, b: any) => {
				// @ts-ignore
				if (h.hasOwnProperty(a)) {
					// @ts-ignore
					if (h.hasOwnProperty(b)) {
						// @ts-ignore
						return compareFunc(h[a], h[b]);
					} else {
						return -1;
					}
				} else {
					// @ts-ignore
					if (h.hasOwnProperty(b)) {
						return 1;
					} else {
						// --- compare keys alphabetically
						// @ts-ignore
						return compareFunc(a, b);
					}
				}
			};
			return yaml.dump(obj, {
				skipInvalid: true,
				indent: 0,
				sortKeys,
				lineWidth: -1
			});
		};

		let tmpFMC3 = toTAML(fmc, ['name', 'amount']);

		if(forceTrimYAML === true) {
			tmpFMC3 = trimYAML(tmpFMC3);
		}

		metaEndIdx[1] = tmpFMC3; //doc.toString();

		metaEndIdx[1] = metaEndIdx[1].replace(/position:[\W\S]*[ ]{2}offset: [\d]*\n/gm, '');
		let tmpMetaAr = metaEndIdx[1].split('\n');

		metaEndIdx[1] = `${tmpMetaAr.join('\n')}\n`;
		metaEndIdx[1] = metaEndIdx[1].split('|').join('');
		fileContent = `${metaEndIdx.join('---\n')}`;

		await this.app.vault.modify(existingFile, fileContent);

		return numberOfEntriesUpdate;
	}

	async getFrontmatterSectionFromFilePath (filePath: string) : Promise<object> {
		let fmc: object = {};
		let existingFile = this.app.vault.getAbstractFileByPath(filePath);
		if(existingFile) {
			// @ts-ignore
			fmc = this.app.metadataCache.getFileCache(existingFile)?.frontmatter;
		}
		return fmc;
	}

	/**
	 * Returns a list of food file names consumed on a given day
	 *
	 * @param foodIntakeDate - YYYY-MM-DD
	 */
	async getListOfFoodsConsumedOnGivenDate(foodIntakeDate: string) {
		const dailyLogRootPath = 'Day Planners/';
		// TODO parse and validate date format

		let tmpAr = foodIntakeDate.split('-');
		let year = tmpAr[0];
		let month = tmpAr[1];
		let day = tmpAr[2];

		let filePath = `${dailyLogRootPath}${year}/${year}-${month}/${year}-${month}-${day}.md`;

		let fmc = null;
		let existingFile = this.app.vault.getAbstractFileByPath(filePath);
		if(existingFile) {
			// @ts-ignore
			fmc = this.app.metadataCache.getFileCache(existingFile)?.frontmatter;
		}
		return fmc;

	}

	/**
	 * processCurrentNoteFoodIntake
	 *
	 * goes through all the food entries summarised in the daily log macros table
	 * transfers this information to the frontmatter meta data
	 *
	 * returns number of entries updates
	 */
	async processCurrentNoteFoodIntake() : Promise<number> {
		const foodItemDefaults = DEFAULT_FOODITEM;
		const foodTrackerFrontmatterAnchor = "food_intake_tracker";
		const keys = ["time", "food_item", "quantity"];


		let foodIntakeData: Array<any> = [];
		let entriesUpdatedCount : number = 0;

		foodIntakeData = this.getCurrentNoteFoodIntakeData();


		const activeFile = this.app.workspace.getActiveFile();

		let fields = [];
		let values = [];


		let keysIdx = 0;
		for(let f=0; f < (3 * foodIntakeData.length); f++) {
			fields.push(`["${foodTrackerFrontmatterAnchor}"]["${Math.floor(f / 3)}"]["${keys[keysIdx]}"]`);
			values.push(foodIntakeData[Math.floor(f / 3)][keysIdx]);
			if(keysIdx == 2) {
				keysIdx = 0;
			}
			else {
				keysIdx++;
			}
		}


		if (activeFile && activeFile.path) {
			entriesUpdatedCount = await this.updateFrontmatterFoodIntakeProperty(activeFile.path, fields, values, foodTrackerFrontmatterAnchor, true, false);
		}
    return entriesUpdatedCount;
	}

	getCurrentNoteFoodIntakeData() {
		function divisible(dividend: number, divisor: number){
			if (dividend % divisor == 0) {
				return dividend;
			} else {
				var num = dividend + (divisor-(dividend % divisor));
				return num;
			}
		}

		let foodTableDiv = document.querySelectorAll('.food-intake-section td');
		let foodIntakeData: Array<any> = [];
		let row = 0;
		let tmpArr = [];
		for(let i = 0; i < foodTableDiv.length; i++) {

			// @ts-ignore
			tmpArr.push(foodTableDiv[i].innerText);
			if(i > 0 && (i+1) == divisible((i+1), 3)) {
				foodIntakeData[row] = tmpArr;
				tmpArr = [];
				row++;
			}

		}
		return foodIntakeData;
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
	get freestyleTestTagsToFilter(): string {
		return this._freestyleTestTagsToFilter;
	}

	/**
	 * set comma delimited list of tags that wil be used to filter out notes for glossary testing
	 */
	set freestyleTestTagsToFilter(value: string) {
		this._freestyleTestTagsToFilter = value;
	}

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

	/**
	 * get the number of the card that is currently visible
	 */
	get currentQuestionNumber(): number {
		return this._currentQuestionNumber;
	}

	/**
	 * set the number of the card that is currently visible
	 */
	set currentQuestionNumber(value: number) {
		this._currentQuestionNumber = value;
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

	get glossaryTimerCounter(): number {
		return this._glossaryTimerCounter;
	}

	set glossaryTimerCounter(value: number) {
		this._glossaryTimerCounter = value;
	}

	get maskMode(): string {
		return this._maskMode;
	}

	set maskMode(value: string) {
		this._maskMode = value;
	}

	get operationalMode(): string {
		return this._operationalMode;
	}

	set operationalMode(value: string) {
		this._operationalMode = value;
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

	private _headerNamesForContent: Array<string> = ["Official Course Notes", "Concise Definition", "This is a test", "Concise Definition"];

	private _glossaryData: Array<any> = [];

	private _maskMode: string = 'SEQUENTIAL_LEFT';

	private _maskPercentage: number = 70;

	private _glossaryTimerCounter: number = 0;

	private _intervalTimer: any = null;

	/**
	 * _operationalMode
	 * determines what type of test to generate.
	 *
	 * possible values are 'GLOSSARY' and 'FREESTYLE'
	 * by the default the value us 'GLOSSARY'
	 * @private
	 */
	private _operationalMode: string = 'GLOSSARY';

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

	/**
	 * comma delimited list of tags that will be used to filter out notes for glossary testing
	 */
	private _freestyleTestTagsToFilter: string = 'freestyletest';

	/**
	 * the number of the card that is currently visible
	 */
	private _currentQuestionNumber: number = 0;

	constructor(app: App, filterableFrontMatter:  Array<string> , headerNames: Array<string>, trainingMode: string = 'GLOSSARY') {
		super(app);

		if ( filterableFrontMatter ) {
			this.frontMatterVariables = filterableFrontMatter;
		}

		if( headerNames ) {
			this._headerNamesForContent = headerNames;
		}

		this.glossaryTimerCounter = 0;

		this.operationalMode = trainingMode;

		this.glossaryTestTagsToFilter = mikielPluginSettings.plugin.settings.glossaryTestTagsToFilter;

		this.freestyleTestTagsToFilter = mikielPluginSettings.plugin.settings.freestyleTestTagsToFilter;
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
			const daysToWait = this.getDaysTillNextTest(recallAttemptCount, recallSuccessCount);
			nextRecallTestDate = moment().add(daysToWait, 'days').startOf('day');
			nextRecallTestDate = moment(nextRecallTestDate).format('YYYY-MM-DD');

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

	/**
	 *
	 * replace the value of a specified frontmatter path inside a note within a specified file path
	 *
	 * Example for the following frontmatter YAML:
	 *  ---
	 *  course: NCI Nutrition Coaching
	 *  glossary_recall:
	 *   recall_attempt_count: 4
	 *   similar_terms:
	 *    term1: hello
	 *    term2: goodbye
	 *  tags: one, two
	 *  ---
	 *
	 *  To change the field "course" to "course_name"
	 *  await this.updatePropertyInFile(glossaryQuestion['file_path'], 'course', 'course_name');
	 *
	 * @param filePath - the path to the file where the substitution will be executed
	 * @param oldField - array of full names of the fields that will be replaced (excluding tabs and colon)
	 * @param newField - array of full name of the fields that will replace the specified old field (excluding tabs and colon)
	 */
	async updateFrontmatterFieldInFilePath  (filePath: string = '', tags: Array<string> = [], oldFields: Array<string>, newFields: Array<string>) {


		let existingFiles = [];
		const cache = this.app.metadataCache;
		const files = this.app.vault.getMarkdownFiles();
		const files_with_tag = [] as TFile [];

		if(filePath != '' && tags.length == 0 ) {
			existingFiles.push(this.app.vault.getAbstractFileByPath(filePath));
		}
		else if(tags.length > 0 ) {

			for(let i = 0; i < tags.length; i++ ) {

				files.forEach( (file) => {
					const file_cache = cache.getFileCache(file);
					if(file_cache) {
						const allTags = getAllTags(file_cache);


						if (allTags && allTags.includes(`#${tags[i]}`)) {
							files_with_tag.push(file);
							existingFiles.push(this.app.vault.getAbstractFileByPath(file.path));
						}
					}
				});

			}

		}

		for(let j= 0; j < existingFiles.length; j++ ) {
			let fmc = await this.getFrontmatterSectionFromFilePath(files_with_tag[j].path);

			// @ts-ignore
			let fileContent = await this.app.vault.read(existingFiles[j]);
			let modifiedFmc = null;




			for (let i = 0; i < oldFields.length; i++) {
				fmc = JSON.parse(JSON.stringify(fmc).split(`"${oldFields[i]}":`).join(`"${newFields[i]}":`));
			}


			const YAML = require('yaml');

			const doc = new YAML.Document();
			// @ts-ignore
			delete fmc.position;
			doc.contents = fmc;



			let fileContentArr = fileContent.split('---\n');

			let modifiedFileContent = `---\n${doc.toString()}---\n`
			if (fileContentArr[0] == '' && fileContentArr[2]) {
				modifiedFileContent += fileContentArr[2];
				// @ts-ignore
				await this.app.vault.modify(existingFiles[j], modifiedFileContent);
			}
		}
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

	/**
	 * updatePropertyInFile
	 *
	 * replace the value of a specified frontmatter path inside a note within a specified file path
	 *
	 * Example for the following frontmatter YAML:
	 *  ---
	 *  course: NCI Nutrition Coaching
     *  glossary_recall:
     *   recall_attempt_count: 4
	 *   similar_terms:
	 *    term1: hello
	 *    term2: goodbye
	 *  tags: one, two
	 *  ---
	 *
	 *  To change the value of "course"
	 *  await this.updatePropertyInFile(glossaryQuestion['file_path'], 'course', 'New name of the course');
	 *
	 *  To change the value of "recall_attempt_count"
	 *  await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_attempt_count', 5);
	 *
	 * limitations:
	 *  The path cannot be longer than two nodes. This means you will not be able to access or modify
	 *  glossary_recall.similar_terms.term1
	 *
	 * @param filePath
	 * @param field
	 * @param value
	 * @param action
	 *
	 * This function returns the file content after the update has been completed
	 */
	async updatePropertyInFile(filePath: string, field: string, value: string | number = '', action: string = 'UPDATE'): Promise<string> {

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
		}



	}

	trimByChar(string: string, character: string) {
		if(!string || (typeof string == 'undefined')) return 'undefined';
		const first = [...string].findIndex(char => char !== character);
		const last = [...string].reverse().findIndex(char => char !== character);
		return string.substring(first, string.length - last);
	}

	/**
	 * generateFreestyleQuestionCard
	 *
	 * Creates html content for a given study material string
	 *
	 * @param sourceContent
	 */
	generateFreestyleQuestionCard(sourceContent: any,  className: string ='freestyle-answers-table', cardIndex: number = 0) : string {


		let placeholder = sourceContent.contentInsideHeaders["Official Course Notes"].split('\n');
		let htmlContent = `<table class="${className}">`;
		let sanitized = '';
		for(let j = 0; j < placeholder.length; j++ ) {
			sanitized = placeholder[j].split('[[').join('').split(']]').join('');
			if( sanitized.indexOf('\t-') > -1) {
				sanitized = sanitized.split('\t- ').join('').split('"').join('&quot;');
				htmlContent += `<tr class="answer-wrapper"><td><div class="freestyle-answer-controls hidden control-${cardIndex}-${j}"><div title="${sanitized}" class="freestyle-peek">&#128065;</div><div class="freestyle-help">Help</div><div class="freestyle-results"><input type="radio" id="bad" name="result[${j}]" value="bad"><label for="bad">Bad</label><input type="radio" id="good" name="result[${j}]" value="good"><label for="good">Good</label>
<input type="radio" id="great" name="result[${j}]" value="great"><label for="great">Great</label></div></div><textarea class="freestyle-answer" onclick="window.freestyleTextAreaOnFocus(this, 'control-${cardIndex}-${j}')" id="freestyle_answer_${j}">${sanitized.substring(0 , 5)}...</textarea><input name="answer_status_${j}" class="answer-status" type="hidden" value="xxx" /></td></tr>`;
			}
			else {
				sanitized = sanitized.substring(2 , sanitized.length);
				htmlContent += `<tr class="prompt-wrapper"><td><div class="glossary-answer" id="glossary_answer_${j}">${sanitized}</div><input name="answer_status_${j}" class="answer-status" type="hidden" value="xxx" /></td></tr>`;
			}
		}
		htmlContent += `</table>`;
		return htmlContent;


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
		let classPrefix = '';
		switch(this.operationalMode) {
			case 'GLOSSARY':
				classPrefix = 'glossary';
				break;
			case 'FREESTYLE':
				classPrefix = 'freestyle';
				break;
			default:
		}



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
			this.currentQuestionNumber = currentQuestionNumber + 1;

			this.correctAnswerCount = this.correctAnswerCount + 1;
			recallAttemptCount = recallAttemptCount + 1;
			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_attempt_count', recallAttemptCount);
			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_attempt_timestamp', new Date().toISOString().slice(0, 19));

			// @ts-ignore
			await this.updatePropertyInFile(glossaryQuestion['file_path'], 'glossary_recall.recall_time', this.glossaryTimerCounter);
			this.sessionDuration += this.glossaryTimerCounter;
			this.glossaryTimerCounter = 0;
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





		let introDiv  = document.querySelector(`.${classPrefix}-intro-panel`);

		if(introDiv) {
			introDiv.classList.add('hidden');
		}
		
		if(isLastCard == 'YES') {


			let completionDiv  = document.querySelector(`.${classPrefix}-completion-panel`);

			if(completionDiv) {
				let compDivHtml = completionDiv.innerHTML;
				compDivHtml = compDivHtml.split('___SESSION_DURATION___').join(String(this.sessionDuration));
				compDivHtml = compDivHtml.split('___CORRECT_ANSWERS___').join(String(this.correctAnswerCount));
				compDivHtml = compDivHtml.split('___INCORRECT_ANSWERS___').join(String(this.incorrectAnswerCount));

				completionDiv.innerHTML = compDivHtml;

				let lastCardDiv  = document.querySelector(`.${classPrefix}-question-wrapper question-number-${(currentQuestionNumber)}`);
				if(lastCardDiv) {
					lastCardDiv.classList.add('hidden');
				}
				completionDiv.classList.remove('hidden');
			}

		}

		let allQuestions = document.querySelectorAll(`.${classPrefix}-question-wrapper`);
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

	getSessionCompletionHTML() {
		let sessionCompleteHTML = ''
		switch(this.operationalMode) {
			case 'GLOSSARY':
				sessionCompleteHTML = `<div class="glossary-completion-panel hidden">
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
				break;
			case 'FREESTYLE':
				sessionCompleteHTML = `<div class="freestyle-completion-panel hidden">
			<div class="freestyle-completion-panel-header">Freestyle Tester</div>
			<div class="freestyle-completion-panel-content">You have covered ${mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession} cards in this session.</div>
			<div class="freestyle-completion-panel-title">Result Summary:</div>
			<div class="freestyle-completion-panel-results">
				<ul>
					<li>Number of correct answers: ___CORRECT_ANSWERS___</li>
					<li>Number of incorrect answers ___INCORRECT_ANSWERS___</li> 
					<li>Total time of session ___SESSION_DURATION___ seconds</li> 
				</ul>
			</div> 
			<button class="freestyle-controls next-question good" onclick="window.gotoGlossaryNumber('1', 'EXIT')">Exit</button>
			</div>`;
				break;
			default:

		}
		return sessionCompleteHTML;
	}

	/**
	 * getIntroHTML
	 * generates appropriate introductory card with instructions
	 * depending on the type of test (glossary, freestyle etc.)
	 *
	 * @param tagOptions
	 */
	getIntroHTML(tagOptions: string = '') : string {
		let introHTML = '';

		switch(this.operationalMode) {
			case 'GLOSSARY':
				introHTML = `<div class="glossary-intro-panel">
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
				break;
				case 'FREESTYLE':
					introHTML = `<div class="freestyle-intro-panel">
			<div class="freestyle-intro-panel-header">Freestyle Recall Tester</div>
			<div class="freestyle-intro-panel-content">This session will display cards that match the hash tags selected below.</div>
			<div class="freestyle-intro-panel-intro">Instructions:</div>
			<div class="freestyle-intro-panel-instructions">
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
			<select class="freestyle-controls tag-selector" onchange="window.glossaryTagSelection(this)">
			${tagOptions}
			</select> 
			<input class="freestyle-controls cards-per-session" onchange="window.glossaryCardsPerSessionSelection(this)" type="text" id="cards_per_session" name="cards_per_session" value="${mikielPluginSettings.plugin.settings.glossaryTesterCardsPerSession}" />
			<button class="freestyle-controls next-question good" onclick="window.gotoGlossaryNumber('0', 'START')">START</button>
			</div>`;
					break;
			default:
		}

	return introHTML;

	}


	/**
	 * Return the appropriate html to display on the intro card
	 * depending on the mode
	 */
	getConfigurationHTML(maskMode: string = '', maskPercentage : number = 90){
		let configurationsHTML = '';

		switch(this.operationalMode) {
			case 'GLOSSARY':
				configurationsHTML = `<table class="glossary-test-settings">
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
				break;
			case 'FREESTYLE':
				configurationsHTML = `<table class="freestyle-test-settings">
  <tr>
  <td>
  <span class="freestyle-settings-label">Mask Percentage:</span>
  </td>
  <td>This is freestyle mode
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
				break;
			default:
		}

		return configurationsHTML;
	}

	/**
	 *
	 * @param questionAnswer
	 * @param maskMode
	 * @param maskPercentage
	 */
	getCardContents(questionAnswer: any, maskMode: string = '', maskPercentage: number = 90 , cardNumber: number = 0) : string {
		let htmlContent = '';
		switch(this.operationalMode) {
			case "GLOSSARY":

				htmlContent += this.obfuscateWord(questionAnswer.frontmatter.term, maskMode, maskPercentage);

				htmlContent += this.obfuscateWord(questionAnswer.frontmatter.term, 'SEQUENTIAL_LEFT', 0, 'glossary-answers-correct hidden');

				break;
			case "FREESTYLE":
				htmlContent += this.generateFreestyleQuestionCard(questionAnswer,'freestyle-answers-table', cardNumber);
				break;
			default:
		}
	return htmlContent;
	}



	// @ts-ignore
	generateGlossaryTest(questionAnswerArray, maskMode='SEQUENTIAL_LEFT', maskPercentage= 80) {

		let classPrefix = '';
		switch(this.operationalMode) {
			case 'GLOSSARY':
				classPrefix = 'glossary';
				break;
			case 'FREESTYLE':
				classPrefix = 'freestyle';
				break;
			default:
		}

		this.maskMode = maskMode;

		this.maskPercentage = maskPercentage;

		const configurationsHTML = this.getConfigurationHTML(maskMode, maskPercentage);
		let tagOptions = '';
		let tagOptionArray = this.getFormattedFilterTags(true);

		for(let i = 0; i < tagOptionArray.length; i++) {

			tagOptions += `<option ${(i==0)?"SELECTED":""} >${tagOptionArray[i]}</option>`;
		}
		this.glossaryTestTagsToFilter = tagOptionArray[0];
		let html = document.createElement('div');
		html.classList.add(`${classPrefix}-wrapper`);
		let htmlContent = '';

		const introHTML = this.getIntroHTML(tagOptions);


		htmlContent += introHTML;
		for(let i = 0; i < questionAnswerArray.length; i++ ) {

			let hint = '';
			if( this.operationalMode == 'GLOSSARY' && questionAnswerArray[i].frontmatter && questionAnswerArray[i].frontmatter.memorisation_hints) {
				hint = questionAnswerArray[i].frontmatter.memorisation_hints;
			}
			else if( this.operationalMode == 'FREESTYLE' && questionAnswerArray[i].frontmatter && questionAnswerArray[i].frontmatter.chapter_section) {
				hint = questionAnswerArray[i].frontmatter.chapter_section;
			}

			htmlContent += `<div class="${classPrefix}-question-wrapper question-number-${i} hidden" data-questionumber="${i}"><div class="${classPrefix}-question" id="${classPrefix}_question_${i}">${hint}</div>`;

			htmlContent += this.getCardContents(questionAnswerArray[i], maskMode, maskPercentage, i);
			let gotoPrevious = -1;
			if(i > 0) {
				gotoPrevious = i - 1;
			}

			let lastCard = 'YES';
			let gotoNext = i + 1;
			if(i < (questionAnswerArray.length - 1)) {
				lastCard = 'NO';
			}

			htmlContent += configurationsHTML;
			htmlContent += `<div class="glossary-status-bar"><span class="glossary-timer-box question-number-${i}">0</span><span class="glossary-progress-box">0</span></div><div class="glossary-controls-wrapper"><button class="glossary-controls previous-question" onclick="window.gotoGlossaryNumber('${gotoPrevious}')">Previous</button><button class="glossary-controls check-answer" data-glossarynumber="${i}" onclick="window.revealCorrectGlossary(this)" >Check</button><button class="glossary-controls next-question bad" onclick="window.gotoGlossaryNumber('${gotoNext}', 'BAD', '${lastCard}')">Bad</button><button class="glossary-controls next-question good" onclick="window.gotoGlossaryNumber('${gotoNext}', 'GOOD', '${lastCard}')">Good</button></div>`
			htmlContent += `</div>`
		}

		htmlContent += this.getSessionCompletionHTML();
		html.innerHTML = htmlContent;

		return html.outerHTML;
	}

	getFormattedFilterTags(getAsArray: boolean = false) : string | Array<any> {
		let tmpTag;
		switch(this.operationalMode) {
			case 'GLOSSARY':
				tmpTag = this.glossaryTestTagsToFilter.split(' ').join('');
				break;
			case 'FREESTYLE':
				tmpTag = this.freestyleTestTagsToFilter.split(' ').join('');
				break;
		}


		if(getAsArray === true && (typeof tmpTag == 'string')) {
			return tmpTag.split(',')
		}
		let tag = `#${tmpTag.split(',').join(',#')}`;

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
			return -Math.round(moment.duration(end.diff(start)).asDays());
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

				const daysTillScheduled = getDaysElapsedSinceLastTest(fullTimeStamp)
				let priorityFactor = 1;
				switch(true) {
					case (daysTillScheduled == 0):
						priorityFactor = 500;
						break;
					case (daysTillScheduled <= -5 && daysTillScheduled > -10 ):
						priorityFactor = 700;
						break;
					case (daysTillScheduled <= -10):
						priorityFactor = 1000;
						break;

					}
				priority = priority * priorityFactor;
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

		pickedDefinitions = tmpDefs.slice(0, (cardsToShow));

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
		this.glossaryTimerCounter++;

		let timerBox = document.querySelector(`.glossary-timer-box.question-number-${this.currentQuestionNumber}`);
		if(timerBox) {

			// @ts-ignore
			timerBox.innerText = String(this.glossaryTimerCounter);

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
		clearInterval(this.intervalTimer);
		this.glossaryTimerCounter = 0;
		this.intervalTimer = window.setInterval(() => this.updateStatusBar(), 1000);
		await this.scanFilesForDefinitions();

		this.constructTestFromDefinitions(this.glossaryData);
	}

	async updateDailyNote() {

		let currentDate = moment(Date.now()).format('YYYY-MM-DD');
		let currentYearMonth = moment(Date.now()).format('YYYY-MM');
		let currentYear = moment(Date.now()).format('YYYY');

		const filePath = `Day Planners/${currentYear}/${currentYearMonth}/${currentDate}.md`;

		let dailyFrontmater = await this.getFrontmatterSectionFromFilePath(filePath);

		let recallSuccessCount = dailyFrontmater.glossary_recall_session.recall_success_count;
		let newRecallSuccessCount = recallSuccessCount + this.correctAnswerCount;
		await this.updatePropertyInFile(filePath, 'glossary_recall_session.recall_success_count', newRecallSuccessCount );

		let sessionCardsAttemptedCount = dailyFrontmater.glossary_recall_session.recall_attempt_count;
		let newSessionCardsAttemptedCount = sessionCardsAttemptedCount + this.sessionCardsAttemptedCount;
		await this.updatePropertyInFile(filePath, 'glossary_recall_session.recall_attempt_count', newSessionCardsAttemptedCount );

		let sessionDuration = dailyFrontmater.glossary_recall_session.recall_session_duration;
		let newSessionDuration = sessionDuration + this.sessionDuration;

		await this.updatePropertyInFile(filePath, 'glossary_recall_session.recall_session_duration', newSessionDuration );

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
/*
class ListCalloutsPluginOverride extends ListCalloutsPlugin {
	async onload() {
		console.log("the callout has landed");
	}

}*/

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	get app(): App {
		return this._app;
	}

	set app(value: App) {
		this._app = value;
	}

	private _app: App;
	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.app = app;
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
		containerEl.createEl('h2', {text: 'Freestyle Tester Settings'});
		new Setting(containerEl)
			.setName('Cards Per Session')
			.setDesc('Number of cards tested in one session')
			.addText(text => text
				.setPlaceholder('cards tested in one session')
				.setValue(String(this.plugin.settings.freestyleTesterCardsPerSession))
				.onChange(async (value: string) => {
					this.plugin.settings.freestyleTesterCardsPerSession = parseInt(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Prioritisation By Days Since Last Test')
			.setDesc('Prioritize cards that have not been tested for longer than a specified number of days')
			.addText(text => text
				.setPlaceholder('prioritize cards older than specified days')
				.setValue(String(this.plugin.settings.freestyleTesterPrioritizeCardsOlderThanDays))
				.onChange(async (value: string) => {

					this.plugin.settings.freestyleTesterPrioritizeCardsOlderThanDays = parseInt(value);
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Tags to match when generating glossary test')
			.setDesc('Enter a list of tags separated by commas. Do not include the # symbol.')
			.addText(textArea => textArea
				.setPlaceholder('tags for filtering glossary test cards')
				.setValue(String(this.plugin.settings.freestyleTestTagsToFilter))
				.onChange(async (value: string) => {

					this.plugin.settings.freestyleTestTagsToFilter = String(value);
					await this.plugin.saveSettings();
				}));
		containerEl.createEl('h2', {text: 'Frontmatter Find & Replace Settings'});
		new Setting(containerEl)
			.setName('Tags to match when performing find/replace')
			.setDesc('Enter a list of tags separated by commas. Do not include the # symbol.')
			.addText(textArea => textArea
				.setPlaceholder('tags for filtering glossary test cards')
				.setValue(String(this.plugin.settings.findReplaceTagsToFilter))
				.onChange(async (value: string) => {

					this.plugin.settings.findReplaceTagsToFilter = String(value);
					await this.plugin.saveSettings();
				}));


		new Setting(containerEl)
			.setName('Original frontformatter property names find/replace')
			.setDesc('Enter a list of property comma delimiled names within the front matter that you would like to either rename ir change the property value.')
			.addText(textArea => textArea
				.setPlaceholder('frontmatter property names you want to change')
				.setValue(String(this.plugin.settings.findReplaceFrontmatterPropertyNamesOriginal))
				.onChange(async (value: string) => {

					this.plugin.settings.findReplaceFrontmatterPropertyNamesOriginal = String(value);
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('List of frontmatter property names you wish to replace with.')
			.setDesc('In case you just want to change property values leave this field empty or copy from original property names above.')
			.addText(textArea => textArea
				.setPlaceholder('frontmatter property names you wish to replace with')
				.setValue(String(this.plugin.settings.findReplaceFrontmatterPropertyNamesNew))
				.onChange(async (value: string) => {

					this.plugin.settings.findReplaceFrontmatterPropertyNamesNew = String(value);
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Frontmatter property values that will be replaced')
			.setDesc('Enter a | delimited list of values that will be repllaced. If you just need to change property names then leave this empty.')
			.addText(textArea => textArea
				.setPlaceholder('tags for filtering glossary test cards')
				.setValue(String(this.plugin.settings.findReplaceFrontmatterValuesNew))
				.onChange(async (value: string) => {

					this.plugin.settings.findReplaceFrontmatterValuesNew = String(value);
					await this.plugin.saveSettings();
				}));
	}
}

