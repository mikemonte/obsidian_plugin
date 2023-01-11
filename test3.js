const sourceURLs = [
	`https://nutritiondata.self.com/facts/beef-products/3271/2?${Math.random(1000)}`,
	`https://nutritiondata.self.com/facts/fruits-and-fruit-juices/1843/2?${Math.random(1000)}`,
	`https://nutritiondata.self.com/facts/fats-and-oils/7725/2?${Math.random(1000)}`,
	`https://nutritiondata.self.com/facts/dairy-and-egg-products/104/2?${Math.random(1000)}`,
	`https://nutritiondata.self.com/facts/cereal-grains-and-pasta/5707/2?${Math.random(1000)}`,
	`https://nutritiondata.self.com/facts/beverages/3847/2?${Math.random(1000)}`
	]
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
const sourceURL = sourceURLs[randomInteger(0, (sourceURLs.length - 1) )];

console.log(sourceURL);

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
							firstPass[sectionCount]["data"] = {};
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
						firstPass[sectionCount]["data"] = {};
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
										if (typeof firstPass[sectionCount]["data"][`${dataCount}`] == 'undefined') {
											firstPass[sectionCount]["data"][`${dataCount}`] = {};
										}
										let val = match2.split('</span>').join('');
										firstPass[sectionCount]["data"][`${dataCount}`][`${key}`] = val;
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


async function run () {
	const browser = await puppeteer.launch({
		args: ['--start-maximized --single-process'],
		headless: false,
		defaultViewport: null
	});
	const page = await browser.newPage();
	await page.setUserAgent(
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36"
	);

	const pageLoadOptions = {
		timeout: 150000,
		//waitUntil: ['domcontentloaded', 'networkidle0']
	};

	await page.goto(sourceURL, pageLoadOptions);

	await page.waitForSelector('#onetrust-accept-btn-handler');
	await page.click('#onetrust-accept-btn-handler');


	//await page.waitForTimeout(1000);

	await page.select('#facts_header > form > select', '100.0');



	//await page.waitForTimeout(1000);


	let pageData = await page.evaluate(() => {
		let results = {};
		let foodTitleEl = document.querySelector('#facts_header .facts-heading');
		console.log('=====>>>', foodTitleEl.innerText);
		results["title"] = foodTitleEl.innerText;

		let foodDetailElements = document.querySelector('#NutritionInformationSlide' );
		results["data"] = foodDetailElements.innerHTML;
		return results;
	})

	console.log("================== OPTS ===========================");
	console.log(utils.inspect(parsePage(pageData["data"]), { maxArrayLength: null , depth: null}));
	console.log("================== OPTS ===========================");

	//await page.screenshot({path: 'screenshot.png'});
	//browser.close();
}
run();

