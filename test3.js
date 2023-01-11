



const puppeteer = require('puppeteer');
const utils = require('util');

function parsePage(str) {
	const regex = /.*"c01">[Calorie Information|Carbohydrates|Fats &amp; Fatty Acids|Protein &amp; Amino Acids|Vitamins|Minerals|Sterols|Other]+<\/div>[\W\S]*?<div class="clearer">([\W\S.]*?)<(br class="clearer"|\/table|div class="groupBorder")>+/gm;

	var firstPass = [];
	let sectionCount = 0;
	let dataCount = -1;
	let key = null;
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

							if(typeof firstPass[sectionCount] == 'undefined') {
								firstPass[sectionCount] = {};

							}
							firstPass[sectionCount]["title"] = title;
							firstPass[sectionCount]["raw_nutritional_data"] = {};
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
					//const regex2 = /.*"([A-Z_]*[NUTRIENT_]+[\d]{1,4}|indented|nf1.*)[">&nbsp;]*["]*(.*)<[\/]*/gm;
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
function extractBasicMacrosFromNutritionData(nutritionData) {
	function convertToGrams(val, unit) {
		if(isNaN(val) || val == -1) {
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
	let basicNutritionData = {};
	for(let i = 0; i < nutritionData.length; i++) {
		let key = '';
		let val = -1;
		let unit = 'g';
		let macro = '';
		switch (nutritionData[i]["title"]) {
			case 'Calorie Information':
				macro = 'calories'

				for(let entry in nutritionData[i]["raw_nutritional_data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData["calories"] == 'undefined') {
						basicNutritionData["calories"] = {};
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Calories') {
						key = 'total_calories'
						val  = nutritionData[i]["raw_nutritional_data"][entry]["value"]
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Carbohydrates':
				macro = 'carbohydrates'
				for(let entry in nutritionData[i]["raw_nutritional_data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					switch (nutritionData[i]["raw_nutritional_data"][entry]["name"]) {
						case 'Total Carbohydrate':
							key = 'total_carbohydrates'
							val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
							break;
						case 'Dietary Fiber':
							key = "fiber";
							val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
							break;
						case 'Sugars':
							basicNutritionData[macro]["sugars"] = nutritionData[i]["raw_nutritional_data"][entry]["value"];
							break;
						default:
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
			case 'Fats & Fatty Acids':
				macro = 'fats';
				for(let entry in nutritionData[i]["raw_nutritional_data"]) {
					val = -1;
					key = '';

					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}

					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
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
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Protein & Amino Acids':
				macro = 'protein';
				for(let entry in nutritionData[i]["raw_nutritional_data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Protein') {
						key = 'total_protein';
						val  = nutritionData[i]["raw_nutritional_data"][entry]["value"]
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Minerals':
				macro = 'minerals';
				for(let entry in nutritionData[i]["raw_nutritional_data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["name"] == 'Sodium') {
						key = 'salt';
						val  = nutritionData[i]["raw_nutritional_data"][entry]["value"]
					}
					if(nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
						unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			default:
		}

	}
	return basicNutritionData;
}



async function getNutritionalData (sourceURL) {
	console.log(sourceURL)
	let pageData = {};
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
		timeout: 30000,
		//waitUntil: ['domcontentloaded', 'networkidle0']
	};

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
		let results = {};
		let foodTitleEl = document.querySelector('#facts_header .facts-heading');
		results["title"] = foodTitleEl.innerText;
		let foodDetailElements = document.querySelector('#NutritionInformationSlide' );
		results["raw_nutritional_data"] = foodDetailElements.innerHTML;
		return results;
	})

	pageData["basicMacros"] = extractBasicMacrosFromNutritionData(parsePage(pageData["raw_nutritional_data"]));
	pageData["status"] = 'success';

	browser.close();
	return pageData;
}




//

let dataPromise = new Promise(async function(myResolve, myReject) {
	const sourceURLs = [
		`https://nutritiondata.self.com/facts/beef-products/3271/2`,
		`https://nutritiondata.self.com/facts/fruits-and-fruit-juices/1843/2`,
		`https://nutritiondata.self.com/facts/fats-and-oils/7725/2`,
		`https://nutritiondata.self.com/facts/dairy-and-egg-products/104/2`,
		`https://nutritiondata.self.com/facts/cereal-grains-and-pasta/5707/2`,
		`https://nutritiondata.self.com/facts/beverages/3847/2`
	]
	function randomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	const url = sourceURLs[randomInteger(0, (sourceURLs.length - 1) )];
	let result = await getNutritionalData(url);
	if(result["status"] == "success") {
		console.log(
			utils.inspect(result["title"], {maxArrayLength: null, depth: null}));
		console.log(utils.inspect(result["basicMacros"],
			{maxArrayLength: null, depth: null}));
	}
	else {
		console.log(`An error occurred reading data from ${result["url"]}`)
	}


});



