const utils = require('util');



// Alternative syntax using RegExp constructor
// const regex = new RegExp('nutrient results([\\W\\S]*?)<br>', 'gim')

const str = `<tr><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Vitamins</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin A, RAE" class="tooltip">Vitamin A, RAE</a> </td><td class="right">1.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_A__RAE" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, alpha" class="tooltip">Carotene, alpha</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, beta" class="tooltip">Carotene, beta</a> </td><td class="right">11.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Cryptoxanthin, beta" class="tooltip" data--hc="true">Cryptoxanthin, beta</a> </td><td class="right">11.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lutein" class="tooltip">Lutein</a> + <a href="#" data-tooltip="zeaxanthin" class="tooltip">zeaxanthin</a> </td><td class="right">11.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lycopene" class="tooltip">Lycopene</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Thiamin" class="tooltip">Thiamin</a> <span class="gray">[Vitamin B1]</span></td><td class="right">0.017&nbsp;mg</td><td><a href="/daily_values.php#Thiamin" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Riboflavin" class="tooltip">Riboflavin</a> <span class="gray">[Vitamin B2]</span></td><td class="right">0.029&nbsp;mg</td><td><a href="/daily_values.php#Riboflavin" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Niacin" class="tooltip">Niacin</a> <span class="gray">[Vitamin B3]</span></td><td class="right">0.075&nbsp;mg</td><td><a href="/daily_values.php#Niacin" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Pantothenic acid" class="tooltip">Pantothenic acid</a> <span class="gray">[Vitamin B5]</span></td><td class="right">0.055&nbsp;mg</td><td><a href="/daily_values.php#Pantothenic_acid" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin B6" class="nowrap tooltip">Vitamin B6</a> </td><td class="right">0.049&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_B6" target="_blank">3&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Folate, DFE" class="tooltip">Folate, DFE</a></td><td class="right"></td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Folate, food </td><td class="right">3.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin E (alpha-tocopherol)" class="tooltip">Vitamin E (alpha-tocopherol)</a> </td><td class="right">0.18&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_E" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Tocopherol, alpha </td><td class="right">0.18&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin K" class="nowrap tooltip">Vitamin K</a> </td><td class="right">1.3&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_K" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin K1 <span class="gray">[Phylloquinone]</span></td><td class="right">1.3&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Dihydro<wbr>phylloquinone </td><td class="right">0.0&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Choline" class="tooltip">Choline</a> </td><td class="right">3.4&nbsp;mg</td><td><a href="/daily_values.php#Choline" target="_blank">1&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Minerals</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Calcium" class="tooltip">Calcium</a> </td><td class="right">7.00&nbsp;mg</td><td><a href="/daily_values.php#Calcium" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Copper" class="tooltip">Copper</a> </td><td class="right">0.02&nbsp;mg</td><td><a href="/daily_values.php#Copper" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Iron" class="tooltip">Iron</a> </td><td class="right">0.12&nbsp;mg</td><td><a href="/daily_values.php#Iron" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Magnesium" class="tooltip">Magnesium</a> </td><td class="right">5.00&nbsp;mg</td><td><a href="/daily_values.php#Magnesium" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Manganese" class="tooltip">Manganese</a> </td><td class="right">0.037&nbsp;mg</td><td><a href="/daily_values.php#Manganese" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Phosphorus" class="tooltip">Phosphorus</a> </td><td class="right">11.00&nbsp;mg</td><td><a href="/daily_values.php#Phosphorus" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Potassium" class="tooltip">Potassium</a> </td><td class="right">108.00&nbsp;mg</td><td><a href="/daily_values.php#Potassium" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Selenium" class="tooltip">Selenium</a> </td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Selenium" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Sodium" class="tooltip">Sodium</a> </td><td class="right">1.00&nbsp;mg</td><td><a href="/daily_values.php#Sodium" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Zinc" class="tooltip">Zinc</a> </td><td class="right">0.05&nbsp;mg</td><td><a href="/daily_values.php#Zinc" target="_blank">0&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Proteins and Aminoacids</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Protein" class="tooltip">Protein</a> </td><td class="right">0.25&nbsp;g</td><td><a href="/daily_values.php#Protein" target="_blank">0&nbsp;%</a></td></tr></tbody></table><br>
</td><td>&nbsp;</td><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Carbohydrates</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Carbohydrate" class="tooltip">Carbohydrate</a> </td><td class="right">13.68&nbsp;g</td><td><a href="/daily_values.php#Carbohydrate" target="_blank">5&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Fiber" class="tooltip">Fiber</a> </td><td class="right">2.30&nbsp;g</td><td><a href="/daily_values.php#Fiber" target="_blank">8&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Starch </td><td class="right">0.05&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Sugars" class="tooltip">Sugars</a> </td><td class="right">10.37&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Fructose" class="tooltip">Fructose</a> </td><td class="right">5.93&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Galactose" class="tooltip">Galactose</a> </td><td class="right">0.00&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Glucose" class="tooltip">Glucose</a> </td><td class="right">1.66&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Lactose" class="tooltip">Lactose</a> </td><td class="right">0.00&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Maltose" class="tooltip">Maltose</a> </td><td class="right">0.00&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Sucrose" class="tooltip">Sucrose</a> </td><td class="right">2.78&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Net carbs" class="tooltip">Net carbs</a> </td><td class="right">11.38&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Fats and Fatty Acids</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Fat" class="tooltip">Fat</a> </td><td class="right">0.120&nbsp;g</td><td><a href="/daily_values.php#Fat" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Fatty acids, total trans" class="tooltip">Fatty acids, total trans</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Other</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Ash" class="tooltip">Ash</a> </td><td class="right">0.20&nbsp;g</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Water" class="tooltip">Water</a> </td><td class="right">85.76&nbsp;g</td><td></td></tr></tbody></table><br>
</td></tr>`;


const regex = /nutrient results([\W\S]*?)<br>/gim;
var firstPass = [];
let sectionCount = 0;
let dataCount = -1;
let key = null;
let val = '';
let m;

while ((m = regex.exec(str)) !== null) {
	// This is necessary to avoid infinite loops with zero-width matches
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	// The result can be accessed through the `m`-variable.
	m.forEach((match, groupIndex) => {
		if (groupIndex == 0) {

			const regex3 = new RegExp('<th colspan="3">([\\W\\S]*?)<\\/th>', 'gm');
			const heading = regex3.exec(match);
			let title = heading[1];

			let initialize = false;

			switch(title) {
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
			if(initialize === true) {
				if(typeof firstPass[sectionCount] == 'undefined') {
					firstPass[sectionCount] = {};
				}
				firstPass[sectionCount]["title"] = title;
				firstPass[sectionCount]["raw_nutritional_data"] = {};
			}



			const regex2 = /class="tooltip">([\W\S]*?)<\/a>[\W\S]*?class="right">([\S]+?)<\/td>/gm;

			let m2;

			while ((m2 = regex2.exec(match)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (m.index === regex2.lastIndex) {
					regex2.lastIndex++;
				}

				// The result can be accessed through the `m`-variable.
				m2.forEach((match2, groupIndex2) => {
					switch (groupIndex2) {
						case 1:

							key = 'name';
							val = match2;
							try {
								if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] == 'undefined') {
									firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
								}

								firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
							}
							catch(err) {}

							console.log(`Found match ${match2}`);
							break;
						case 2:
							let ar = match2.split('&nbsp;');
							key = 'value';
							val = ar[0];
							try {
								if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] == 'undefined') {
									firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
								}

								firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
							}
							catch(err) {}

							key = 'units';
							val = ar[1];
							try {
								if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] == 'undefined') {
									firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
								}

								firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
							}
							catch(err) {}
							//console.log(`Found match ${match2}`);
							dataCount++;
							break;
						default:
					}
				});
			}
		}
	});
}

console.log(utils.inspect(firstPass, {maxArrayLength: null, depth: null}));
