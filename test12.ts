// @ts-ignore
const utils = require('util');
// @ts-ignore
function parserNutritionValuePage(str: string | undefined)  {

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


let str = `<td><table class="center zero wide fixed"><tbody><tr><td class="left noprint" colspan="3"><table class="wide"><tbody><tr><td class="left"><button id="add-to-diary" class="noprint" onclick="addToDiary(&quot;172439&quot;, &quot;Bacon, meatless&quot;, &quot;100 g&quot;, &quot;1 cup = 144 g;1 oz cooked, yield = 16 g;1 strip = 5 g;1 g;1 ounce = 28.3495 g;1 pound = 453.592 g;1 kg = 1000 g&quot;);">Add to diary</button></td><td class="right"><button onclick="document.location.href=&quot;/favorites.php?add&amp;id=172439&amp;name=Bacon%2C+meatless&amp;serving_size=100+g&quot;;">Add to favorites</button></td></tr></tbody></table></td></tr><tr><td colspan="3"><table class="title"><tbody><tr><td><img src="/images/foods/70/bacon.png" srcset="/images/foods/70/bacon.png 1x,/images/foods/140/bacon.png 2x,/images/foods/210/bacon.png 3x" alt="bacon" title="bacon" height="70" width="70"></td><td><h1 style="font-size:x-large" id="food-name">Bacon, meatless</h1></td></tr></tbody></table></td></tr><tr><td colspan="3">Select portion size: <form method="get">
          <select class="serving" name="size" onchange="updateCustomSizeForFood(this, &quot;172439&quot;);" data-value="100 g"><option value="100 g" selected="selected">100 g</option><option value="1 cup = 144 g">1 cup = 144 g</option><option value="1 oz cooked, yield = 16 g">1 oz cooked, yield = 16 g</option><option value="1 strip = 5 g">1 strip = 5 g</option><option value="1 g">1 g</option><option value="1 ounce = 28.3495 g">1 ounce = 28.3495 g</option><option value="1 pound = 453.592 g">1 pound = 453.592 g</option><option value="1 kg = 1000 g">1 kg = 1000 g</option><option value="custom g">custom g</option><option value="custom oz">custom oz</option></select></form></td></tr><tr><td>
<table style="border:solid 2px black" class="center" id="nutrition-label"><tbody><tr><td>
<table class="center zero">
<tbody><tr><td class="center" style="font-size:xx-large; font-weight:bold" colspan="2">
Nutrition Facts
</td></tr>

<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>

<tr><td class="left" style="font-size:large; font-weight: bold;">Portion Size</td><td class="right" style="font-size:large; font-weight: bold;"><span id="serving-size">100 g</span></td></tr>

<tr><td colspan="2" style="background-color:black;padding:0;height:10px"></td></tr>

<tr><td class="left" style="font-size:small"><b>Amount Per Portion</b></td><td rowspan="2" class="right" style="font-size:2.5em; font-weight: bold;" id="calories">309</td></tr>

<tr><td class="left" style="font-size:xx-large; font-weight: bold;">Calories</td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:5px"></td></tr>

<tr><td class="right" colspan="2" style="font-size:small"><b>% Daily Value *</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>
<tr><td class="left"><b>Total&nbsp;Fat</b>&nbsp;30g</td>
<td class="right"><b>38&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;Saturated&nbsp;Fat&nbsp;4.6g</td>
<td class="right"><b>23&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Sodium</b>&nbsp;1465mg</td>
<td class="right"><b>64&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Total&nbsp;Carbohydrate</b>&nbsp;5.3g</td>
<td class="right"><b>2&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>
<tr><td class="left">&nbsp;&nbsp;&nbsp;Dietary&nbsp;Fiber&nbsp;2.6g</td>
<td class="right"><b>9&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;Sugar&nbsp;0g</td>
<td class="right"></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Protein</b>&nbsp;12g</td>
<td class="right"><b>24&nbsp;%</b></td></tr>

<tr><td colspan="2" style="background-color:black;padding:0px;height:10px"></td></tr><tr><td class="left">Vitamin D&nbsp;0mcg</td>
  <td class="right">0&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Calcium&nbsp;23mg</td>
  <td class="right">2&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Iron&nbsp;2.4mg</td>
  <td class="right">13&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Potassium&nbsp;170mg</td>
<td class="right">4&nbsp;%</td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:5px"></td></tr> <tr><td class="left" colspan="2" style="font-size:small;">
* The % Daily Value (DV) tells you how much a nutrient in a serving of food contribute to a daily diet. <span id="dv-note">2000 calories a day is used for general nutrition advice.</span></td></tr></tbody></table></td></tr></tbody></table></td><td>&nbsp;</td><td>  <a class="noprint copy" href="javascript:void(0);" onclick="copyToClipboard(event, &quot;https:\\/\\/www.nutritionvalue.org\\/Bacon%2C_meatless_nutritional_value.html?size=100+g&amp;utm_source=share-by-url&quot;, &quot;Share-by-URL&quot;, &quot;URL copied&quot;);" title="Copy URL">Share by URL  <svg stroke-linecap="round" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="rgb(128,128,128)" xmlns="http://www.w3.org/2000/svg"><polyline points="1,4 1,22 15,22 15,4 1,4"></polyline><polyline points="4,4 4,1 18,1 18,19 15,19"></polyline><polyline points="4,10 12,10" stroke="rgb(192,192,192)"></polyline><polyline points="4,13 12,13" stroke="rgb(192,192,192)"></polyline><polyline points="4,16 12,16" stroke="rgb(192,192,192)"></polyline><polyline points="4,19 12,19" stroke="rgb(192,192,192)"></polyline></svg></a> <div class="control"><a rel="nofollow" id="toogleFoodA" href="/comparefoods.php?action=add&amp;id=172439&amp;unit=100+g">Add to comparison</a> <span class="question" title="Add two or more items to see a side by side comparison." data-type="generic" onclick="renderHelp(this);">ⓘ</span></div> <div class="control"><a rel="nofollow" href="/nutritioncalculator.php?action=add&amp;ids=172439&amp;sizes=100+g">Add to recipe</a> <span class="question" title="Add this food as ingredients to a meal." data-type="generic" onclick="renderHelp(this);">ⓘ</span></div>  <div class="control"><a rel="nofollow" href="#" onclick="return downloadCSV(this);" download="bacon_meatless.csv">Download spreadsheet (CSV)</a></div> <div class="control"><a href="javascript:window.print();void(0);">Print page 🖶</a></div> <br><img src="https://chart.googleapis.com/chart?cht=p&amp;chs=300x150&amp;chtt=Calories+by+source&amp;chd=t:80%2C13%2C7&amp;chl=Fat%2080%25%7CProtein%2013%25%20%7CCarbs%207%25&amp;chco=DDDDAA%2CFFAAAA%2CDDDDFF" width="300" height="150" alt="Bacon, meatless, calories by source" title="Bacon, meatless, calories by source">
 <br><br><br><img src="https://chart.googleapis.com/chart?cht=bhs&amp;chs=300x150&amp;chxt=x,y,x&amp;chxl=1:%7CProtein%7CCarbs%7CFat%7CCalories%7C2:%7CPercentile+of+foods+in+the+database%7C&amp;chxp=2,50&amp;chm=N**%25,,0,,10,,e:3&amp;chd=t:56,87,21,78&amp;chco=AAAAAA%7CDDDDAA%7CDDDDFF%7CFFAAAA" width="300" height="150" alt="Bacon, meatless, percentiles" title="Bacon, meatless, percentiles">
 <div class="control">Badges: <a href="/lowcarbfooddefinition.php">low carb</a></div><br></td></tr><tr><td colspan="3"><div class="noprint ad perm_ad">
<!-- Nutrition value -->
<ins class="adsbygoogle" style="display: block; height: 280px;" data-ad-client="ca-pub-7891406799955373" data-ad-slot="3336797990" data-ad-format="auto" data-adsbygoogle-status="done"><div id="aswift_0_host" style="border: none; height: 280px; width: 784px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-block;"></div></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
<script>
 var top_banner_shown = 42;
</script>
</div></td></tr><tr><td colspan="3"><h3>Bacon, meatless nutrition facts and analysis per 100 g</h3></td></tr><tr><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Vitamins</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin A, RAE" class="tooltip">Vitamin A, RAE</a> </td><td class="right">4.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_A__RAE" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, alpha" class="tooltip">Carotene, alpha</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, beta" class="tooltip">Carotene, beta</a> </td><td class="right">53.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Cryptoxanthin, beta" class="tooltip">Cryptoxanthin, beta</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lutein" class="tooltip">Lutein</a> + <a href="#" data-tooltip="zeaxanthin" class="tooltip">zeaxanthin</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lycopene" class="tooltip">Lycopene</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Retinol" class="tooltip">Retinol</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Thiamin" class="tooltip">Thiamin</a> <span class="gray">[Vitamin B1]</span></td><td class="right">4.400&nbsp;mg</td><td><a href="/daily_values.php#Thiamin" target="_blank">367&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Riboflavin" class="tooltip">Riboflavin</a> <span class="gray">[Vitamin B2]</span></td><td class="right">0.481&nbsp;mg</td><td><a href="/daily_values.php#Riboflavin" target="_blank">37&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Niacin" class="tooltip">Niacin</a> <span class="gray">[Vitamin B3]</span></td><td class="right">7.560&nbsp;mg</td><td><a href="/daily_values.php#Niacin" target="_blank">47&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Pantothenic acid" class="tooltip">Pantothenic acid</a> <span class="gray">[Vitamin B5]</span></td><td class="right">0.113&nbsp;mg</td><td><a href="/daily_values.php#Pantothenic_acid" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin B6" class="nowrap tooltip">Vitamin B6</a> </td><td class="right">0.479&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_B6" target="_blank">28&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin B12" class="tooltip">Vitamin B12</a> <span class="gray">[Cobalamin]</span></td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_B12" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin B12, added </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Folate, DFE" class="tooltip">Folate, DFE</a> <span class="gray">[Vitamin B9]</span></td><td class="right">42.00&nbsp;mcg</td><td><a href="/daily_values.php#Folate__DFE" target="_blank">10&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Folate, food </td><td class="right">42.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Folic acid </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin C" class="nowrap tooltip">Vitamin C</a> <span class="gray">[Ascorbic acid]</span></td><td class="right">0.0&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_C" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin D" class="nowrap tooltip">Vitamin D</a> </td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_D" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin E (alpha-tocopherol)" class="tooltip">Vitamin E (alpha-tocopherol)</a> </td><td class="right">6.90&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_E" target="_blank">46&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin E, added </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Tocopherol, alpha </td><td class="right">6.90&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin K" class="nowrap tooltip">Vitamin K</a> </td><td class="right">0.0&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_K" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin K1 <span class="gray">[Phylloquinone]</span></td><td class="right">0.0&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Choline" class="tooltip">Choline</a> </td><td class="right">45.0&nbsp;mg</td><td><a href="/daily_values.php#Choline" target="_blank">8&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Minerals</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Calcium" class="tooltip">Calcium</a> </td><td class="right">23.00&nbsp;mg</td><td><a href="/daily_values.php#Calcium" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Copper" class="tooltip">Copper</a> </td><td class="right">0.10&nbsp;mg</td><td><a href="/daily_values.php#Copper" target="_blank">11&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Iron" class="tooltip">Iron</a> </td><td class="right">2.41&nbsp;mg</td><td><a href="/daily_values.php#Iron" target="_blank">13&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Magnesium" class="tooltip">Magnesium</a> </td><td class="right">19.00&nbsp;mg</td><td><a href="/daily_values.php#Magnesium" target="_blank">5&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Manganese" class="tooltip">Manganese</a> </td><td class="right">0.205&nbsp;mg</td><td><a href="/daily_values.php#Manganese" target="_blank">9&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Phosphorus" class="tooltip">Phosphorus</a> </td><td class="right">70.00&nbsp;mg</td><td><a href="/daily_values.php#Phosphorus" target="_blank">6&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Potassium" class="tooltip">Potassium</a> </td><td class="right">170.00&nbsp;mg</td><td><a href="/daily_values.php#Potassium" target="_blank">4&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Selenium" class="tooltip">Selenium</a> </td><td class="right">7.40&nbsp;mcg</td><td><a href="/daily_values.php#Selenium" target="_blank">13&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Sodium" class="tooltip">Sodium</a> </td><td class="right">1465.00&nbsp;mg</td><td><a href="/daily_values.php#Sodium" target="_blank">64&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Zinc" class="tooltip">Zinc</a> </td><td class="right">0.42&nbsp;mg</td><td><a href="/daily_values.php#Zinc" target="_blank">4&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Proteins and Aminoacids</th></tr><tr><td colspan="3"><img src="https://chart.googleapis.com/chart?cht=p&amp;chf=bg,s,ffffff00&amp;chs=360x180&amp;chtt=Protein+by+amino+acid&amp;chd=t:4.2%2C7.5%2C11.4%2C1.5%2C20.8%2C4%2C2.6%2C4.8%2C7.8%2C6.2%2C1.2%2C5.2%2C5.5%2C5.4%2C3.9%2C1.4%2C3.4%2C5.1&amp;chl=Alanine%204.2%25%7CArginine%207.5%25%7CAspartic%20acid%2011.4%25%7CCystine%201.5%25%7CGlutamic%20acid%2020.8%25%7CGlycine%204%25%7CHistidine%202.6%25%7CIsoleucine%204.8%25%7CLeucine%207.8%25%7CLysine%206.2%25%7CMethionine%201.2%25%7CPhenylalanine%205.2%25%7CProline%205.5%25%7CSerine%205.4%25%7CThreonine%203.9%25%7CTryptophan%201.4%25%7CTyrosine%203.4%25%7CValine%205.1%25" alt="Bacon, meatless, amino acids" width="360" height="180" title="Bacon, meatless, amino acids"></td></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Protein" class="tooltip">Protein</a> </td><td class="right">11.69&nbsp;g</td><td><a href="/daily_values.php#Protein" target="_blank">23&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Alanine" class="tooltip">Alanine</a> </td><td class="right">0.492&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Arginine" class="tooltip">Arginine</a> </td><td class="right">0.875&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Aspartic acid" class="tooltip">Aspartic acid</a> </td><td class="right">1.330&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Cystine" class="tooltip">Cystine</a> </td><td class="right">0.176&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Glutamic acid" class="tooltip">Glutamic acid</a> </td><td class="right">2.429&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Glycine" class="tooltip">Glycine</a> </td><td class="right">0.473&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Histidine" class="tooltip">Histidine</a> </td><td class="right">0.299&nbsp;g</td><td><a href="/daily_values.php#Histidine" target="_blank">26&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Isoleucine" class="tooltip">Isoleucine</a> </td><td class="right">0.559&nbsp;g</td><td><a href="/daily_values.php#Isoleucine" target="_blank">36&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Leucine" class="tooltip">Leucine</a> </td><td class="right">0.914&nbsp;g</td><td><a href="/daily_values.php#Leucine" target="_blank">27&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lysine" class="tooltip">Lysine</a> </td><td class="right">0.727&nbsp;g</td><td><a href="/daily_values.php#Lysine" target="_blank">23&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Methionine" class="tooltip">Methionine</a> </td><td class="right">0.146&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Phenylalanine" class="tooltip">Phenylalanine</a> </td><td class="right">0.611&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Proline" class="tooltip">Proline</a> </td><td class="right">0.643&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Serine" class="tooltip">Serine</a> </td><td class="right">0.626&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Threonine" class="tooltip">Threonine</a> </td><td class="right">0.453&nbsp;g</td><td><a href="/daily_values.php#Threonine" target="_blank">28&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Tryptophan" class="tooltip">Tryptophan</a> </td><td class="right">0.161&nbsp;g</td><td><a href="/daily_values.php#Tryptophan" target="_blank">39&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Tyrosine" class="tooltip">Tyrosine</a> </td><td class="right">0.400&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Valine" class="tooltip">Valine</a> </td><td class="right">0.593&nbsp;g</td><td><a href="/daily_values.php#Valine" target="_blank">30&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Phenylalanine" class="tooltip">Phenylalanine</a> + <a href="#" data-tooltip="Tyrosine" class="tooltip">Tyrosine</a> </td><td class="right">1.011&nbsp;g</td><td><a href="/daily_values.php#Phenylalanine_+_Tyrosine" target="_blank">38&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Methionine" class="tooltip">Methionine</a> + <a href="#" data-tooltip="Cysteine" class="tooltip">Cysteine</a> </td><td class="right">0.146&nbsp;g</td><td><a href="/daily_values.php#Methionine_+_Cysteine" target="_blank">9&nbsp;%</a></td></tr></tbody></table><br>
</td><td>&nbsp;</td><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Carbohydrates</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Carbohydrate" class="tooltip">Carbohydrate</a> </td><td class="right">5.31&nbsp;g</td><td><a href="/daily_values.php#Carbohydrate" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Fiber" class="tooltip">Fiber</a> </td><td class="right">2.60&nbsp;g</td><td><a href="/daily_values.php#Fiber" target="_blank">9&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Sugars" class="tooltip">Sugars</a> </td><td class="right">0.00&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Net carbs" class="tooltip">Net carbs</a> </td><td class="right">2.71&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Fats and Fatty Acids</th></tr><tr><td colspan="3"><img src="https://chart.googleapis.com/chart?cht=p&amp;chf=bg,s,ffffff00&amp;chs=360x150&amp;chtt=Fatty+acids+by+type&amp;chd=t:17%2C26%2C57&amp;chl=Saturated%2017%25%7CMonounsaturated%2026%25%7CPolyunsaturated%2057%25&amp;chco=AAAAFF%2CFFAAAA%2CAAFFAA" alt="Bacon, meatless, fatty acids by type" width="360" height="150" title="Bacon, meatless, fatty acids by type"></td></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Fat" class="tooltip">Fat</a> </td><td class="right">29.520&nbsp;g</td><td><a href="/daily_values.php#Fat" target="_blank">38&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Saturated fatty acids" class="tooltip">Saturated fatty acids</a> </td><td class="right">4.622&nbsp;g</td><td><a href="/daily_values.php#Saturated_fatty_acids" target="_blank">23&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Butanoic acid" class="tooltip">Butanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Decanoic acid" class="tooltip">Decanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Dodecanoic acid" class="tooltip">Dodecanoic acid</a> </td><td class="right">0.245&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexadecanoic acid" class="tooltip">Hexadecanoic acid</a> </td><td class="right">3.045&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexanoic acid" class="tooltip">Hexanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecanoic acid" class="tooltip">Octadecanoic acid</a> </td><td class="right">1.169&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octanoic acid" class="tooltip">Octanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Tetradecanoic acid" class="tooltip">Tetradecanoic acid</a> </td><td class="right">0.163&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Monounsaturated fatty acids" class="tooltip">Monounsaturated fatty acids</a> </td><td class="right">7.095&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosenoic acid" class="tooltip">Docosenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosenoic acid" class="tooltip">Eicosenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexadecenoic acid" class="tooltip">Hexadecenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecenoic acid" class="tooltip">Octadecenoic acid</a> </td><td class="right">7.095&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Polyunsaturated fatty acids" class="tooltip">Polyunsaturated fatty acids</a> </td><td class="right">15.441&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosahexaenoic n-3 acid (DHA)" class="tooltip">Docosahexaenoic n-3 acid (DHA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosapentaenoic n-3 acid (DPA)" class="tooltip">Docosapentaenoic n-3 acid (DPA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosapentaenoic n-3 acid (EPA)" class="tooltip">Eicosapentaenoic n-3 acid (EPA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosatetraenoic acid" class="tooltip">Eicosatetraenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecadienoic acid" class="tooltip">Octadecadienoic acid</a> </td><td class="right">13.756&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecatetraenoic acid" class="tooltip">Octadecatetraenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecatrienoic acid" class="tooltip">Octadecatrienoic acid</a> </td><td class="right">1.686&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Sterols</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Cholesterol" class="tooltip">Cholesterol</a> </td><td class="right">0.00&nbsp;mg</td><td><a href="/daily_values.php#Cholesterol" target="_blank">0&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Other</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Alcohol, ethyl" class="tooltip">Alcohol, ethyl</a> </td><td class="right">0.0&nbsp;g</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Ash" class="tooltip">Ash</a> </td><td class="right">4.50&nbsp;g</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Caffeine" class="tooltip">Caffeine</a> </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Theobromine" class="tooltip">Theobromine</a> </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Water" class="tooltip">Water</a> </td><td class="right">48.98&nbsp;g</td><td></td></tr></tbody></table><br>
</td></tr>

<tr><td colspan="3"><h3>Foods related to bacon, meatless</h3></td></tr><tr><td class="related"><div><a href="/Bacon_bits%2C_meatless_nutritional_value.html" title="Bacon bits, meatless">Bacon bits, meatless</a></div></td><td>&nbsp;</td><td class="related"><div><a href="/Chicken%2C_meatless_nutritional_value.html" title="Chicken, meatless">Chicken, meatless</a></div></td></tr><tr><td class="related"><div><a href="/Frankfurter%2C_meatless_nutritional_value.html" title="Frankfurter, meatless">Frankfurter, meatless</a></div></td><td>&nbsp;</td><td class="related"><div><a href="/Meatballs%2C_meatless_nutritional_value.html" title="Meatballs, meatless">Meatballs, meatless</a></div></td></tr><tr><td class="related"><div><a href="/Sausage%2C_meatless_nutritional_value.html" title="Sausage, meatless">Sausage, meatless</a></div></td><td>&nbsp;</td><td class="related"><div><a href="/Luncheon_slices%2C_meatless_nutritional_value.html" title="Luncheon slices, meatless">Luncheon slices, meatless</a></div></td></tr><tr><td class="related"><div><a href="/Sandwich_spread%2C_meatless_nutritional_value.html" title="Sandwich spread, meatless">Sandwich spread, meatless</a></div></td><td>&nbsp;</td><td class="related"><div><a href="/Chicken%2C_fried%2C_breaded%2C_meatless_nutritional_value.html" title="Chicken, fried, breaded, meatless">Chicken, fried, breaded, meatless</a></div></td></tr><tr><td colspan="3" class="desc"><strong>Bacon, meatless</strong> contains 309 calories per 100 g serving. This serving contains 30 g of fat, 12 g of protein and 5.3 g of carbohydrate. The latter is 0 g sugar and 2.6 g of dietary fiber, the rest is complex carbohydrate. Bacon, meatless contains 4.6 g of saturated fat and 0 mg of cholesterol per serving. 100 g of Bacon, meatless contains 4.00 mcg vitamin A, 0.0 mg vitamin C, 0.00 mcg vitamin D as well as 2.41 mg of iron, 23.00 mg of calcium, 170 mg of potassium. Bacon, meatless belong to 'Legumes and Legume Products' food category. </td></tr><tr><td colspan="3"><table class="wide results"><tbody><tr><th colspan="2">Food properties</th></tr><tr><td>Source</td><td><a href="/categories_in_standard_reference_foods.html">USDA Standard reference</a></td></tr><tr><td>Category</td><td><a href="/foods_in_Legumes_and_Legume_Products.html">Legumes and Legume Products </a></td></tr></tbody></table></td></tr></tbody></table></td>`;
let result  = parserNutritionValuePage(str);

console.log('====== RESULT =======')
console.log(utils.inspect(result, {maxArrayLength: null, depth: null}));
