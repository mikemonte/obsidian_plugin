const utils = require('util');

const nutritionData = [
	{
		title: 'Calorie Information',
		data: {
			'0': { name: 'Calories', value: '160' },
			'1': { daily_value: '8%', name: 'From Carbohydrate', value: '30.6' },
			'2': { daily_value: '', name: 'From Fat', value: '123' },
			'3': { daily_value: '', name: 'From Protein', value: '6.7' },
			'4': { daily_value: '', name: 'From Alcohol', value: '0.0' },
			'5': { daily_value: '' }
		}
	},
	{
		title: 'Carbohydrates',
		data: {
			'0': { name: 'Total Carbohydrate', value: '8.5', units: 'g' },
			'1': {
				daily_value: '3%',
				name: 'Dietary Fiber',
				value: '6.7',
				units: 'g'
			},
			'2': { daily_value: '27%', name: 'Starch', value: '0.1', units: 'g' },
			'3': { daily_value: '', name: 'Sugars', value: '0.7', units: 'g' },
			'4': { daily_value: '', name: 'Sucrose', value: '60.0', units: 'mg' },
			'5': { daily_value: '', name: 'Glucose', value: '370', units: 'mg' },
			'6': { daily_value: '', name: 'Fructose', value: '120', units: 'mg' },
			'7': { daily_value: '', name: 'Lactose', value: '0.0', units: 'mg' },
			'8': { daily_value: '', name: 'Maltose', value: '0.0', units: 'mg' },
			'9': { daily_value: '', name: 'Galactose', value: '100', units: 'mg' },
			'10': { daily_value: '' }
		}
	},
	{
		title: 'Fats & Fatty Acids',
		data: {
			'0': { name: 'Total Fat', value: '14.7', units: 'g' },
			'1': {
				daily_value: '23%',
				name: 'Saturated Fat',
				value: '2.1',
				units: 'g'
			},
			'2': { daily_value: '11%', name: '4:00', value: '0.0', units: 'mg' },
			'3': { daily_value: '', name: '6:00', value: '0.0', units: 'mg' },
			'4': { daily_value: '', name: '8:00', value: '1.0', units: 'mg' },
			'5': { daily_value: '', name: '10:00', value: '0.0', units: 'mg' },
			'6': { daily_value: '', name: '12:00', value: '0.0', units: 'mg' },
			'7': { daily_value: '', name: '13:00', value: '~', units: '' },
			'8': { daily_value: '', name: '14:00', value: '0.0', units: 'mg' },
			'9': { daily_value: '', name: '15:00', value: '0.0', units: 'mg' },
			'10': { daily_value: '', name: '16:00', value: '2075', units: 'mg' },
			'11': { daily_value: '', name: '17:00', value: '0.0', units: 'mg' },
			'12': { daily_value: '', name: '18:00', value: '49.0', units: 'mg' },
			'13': { daily_value: '', name: '19:00', value: '~', units: '' },
			'14': { daily_value: '', name: '20:00', value: '0.0', units: 'mg' },
			'15': { daily_value: '', name: '22:00', value: '0.0', units: 'mg' },
			'16': { daily_value: '', name: '24:00:00', value: '0.0', units: 'mg' },
			'17': {
				daily_value: '',
				name: 'Monounsaturated Fat',
				value: '9.8',
				units: 'g'
			},
			'18': { daily_value: '', name: '14:01', value: '0.0', units: 'mg' },
			'19': { daily_value: '', name: '15:01', value: '0.0', units: 'mg' },
			'20': {
				daily_value: '',
				name: '16:1 undifferentiated',
				value: '698',
				units: 'mg'
			},
			'21': { daily_value: '', name: '16:1 c', value: '~', units: '' },
			'22': { daily_value: '', name: '16:1 t', value: '~', units: '' },
			'23': { daily_value: '', name: '17:01', value: '10.0', units: 'mg' },
			'24': {
				daily_value: '',
				name: '18:1 undifferentiated',
				value: '9065',
				units: 'mg'
			},
			'25': { daily_value: '', name: '18:1 c', value: '~', units: '' },
			'26': { daily_value: '', name: '18:1 t', value: '~', units: '' },
			'27': { daily_value: '', name: '20:01', value: '25.0', units: 'mg' },
			'28': {
				daily_value: '',
				name: '22:1 undifferentiated',
				value: '0.0',
				units: 'mg'
			},
			'29': { daily_value: '', name: '22:1 c', value: '~', units: '' },
			'30': { daily_value: '', name: '22:1 t', value: '~', units: '' },
			'31': { daily_value: '', name: '24:1 c', value: '~', units: '' },
			'32': {
				daily_value: '',
				name: 'Polyunsaturated Fat',
				value: '1.8',
				units: 'g'
			},
			'33': {
				daily_value: '',
				name: '16:2 undifferentiated',
				value: '~',
				units: ''
			},
			'34': {
				daily_value: '',
				name: '18:2 undifferentiated',
				value: '1674',
				units: 'mg'
			},
			'35': { daily_value: '', name: '18:2 n-6 c,c', value: '~', units: '' },
			'36': { daily_value: '', name: '18:2 c,t', value: '~', units: '' },
			'37': { daily_value: '', name: '18:2 t,c', value: '~', units: '' },
			'38': { daily_value: '', name: '18:2 t,t', value: '~', units: '' },
			'39': { daily_value: '', name: '18:2 i', value: '~', units: '' },
			'40': {
				daily_value: '',
				name: '18:2 t not further defined',
				value: '~',
				units: ''
			},
			'41': { daily_value: '', name: '18:03', value: '125', units: 'mg' },
			'42': {
				daily_value: '',
				name: '18:3 n-3, c,c,c',
				value: '111',
				units: 'mg'
			},
			'43': {
				daily_value: '',
				name: '18:3 n-6, c,c,c',
				value: '15.0',
				units: 'mg'
			},
			'44': {
				daily_value: '',
				name: '18:4 undifferentiated',
				value: '0.0',
				units: 'mg'
			},
			'45': {
				daily_value: '',
				name: '20:2 n-6 c,c',
				value: '0.0',
				units: 'mg'
			},
			'46': {
				daily_value: '',
				name: '20:3 undifferentiated',
				value: '16.0',
				units: 'mg'
			},
			'47': { daily_value: '', name: '20:3 n-3', value: '~', units: '' },
			'48': { daily_value: '', name: '20:3 n-6', value: '~', units: '' },
			'49': {
				daily_value: '',
				name: '20:4 undifferentiated',
				value: '0.0',
				units: 'mg'
			},
			'50': { daily_value: '', name: '20:4 n-3', value: '~', units: '' },
			'51': { daily_value: '', name: '20:4 n-6', value: '~', units: '' },
			'52': { daily_value: '', name: '20:5 n-3', value: '0.0', units: 'mg' },
			'53': { daily_value: '', name: '22:02', value: '~', units: '' },
			'54': { daily_value: '', name: '22:5 n-3', value: '0.0', units: 'mg' },
			'55': { daily_value: '', name: '22:6 n-3', value: '0.0', units: 'mg' },
			'56': {
				daily_value: '',
				name: 'Total trans fatty acids',
				value: '~',
				units: ''
			},
			'57': {
				daily_value: '',
				name: 'Total trans-monoenoic fatty acids',
				value: '~',
				units: ''
			},
			'58': {
				daily_value: '',
				name: 'Total trans-polyenoic fatty acids',
				value: '~',
				units: ''
			},
			'59': {
				daily_value: '',
				name: 'Total Omega-3 fatty acids',
				value: '110',
				units: 'mg'
			},
			'60': {
				daily_value: '',
				name: 'Total Omega-6 fatty acids',
				value: '1689',
				units: 'mg'
			},
			'61': { daily_value: '' }
		}
	},
	{
		title: 'Protein & Amino Acids',
		data: {
			'0': { name: 'Protein', value: '2.0', units: 'g' },
			'1': {
				daily_value: '4%',
				name: 'Tryptophan',
				value: '25.0',
				units: 'mg'
			},
			'2': {
				daily_value: '',
				name: 'Threonine',
				value: '73.0',
				units: 'mg'
			},
			'3': {
				daily_value: '',
				name: 'Isoleucine',
				value: '84.0',
				units: 'mg'
			},
			'4': { daily_value: '', name: 'Leucine', value: '143', units: 'mg' },
			'5': { daily_value: '', name: 'Lysine', value: '132', units: 'mg' },
			'6': {
				daily_value: '',
				name: 'Methionine',
				value: '38.0',
				units: 'mg'
			},
			'7': { daily_value: '', name: 'Cystine', value: '27.0', units: 'mg' },
			'8': {
				daily_value: '',
				name: 'Phenylalanine',
				value: '232',
				units: 'mg'
			},
			'9': { daily_value: '', name: 'Tyrosine', value: '49.0', units: 'mg' },
			'10': { daily_value: '', name: 'Valine', value: '107', units: 'mg' },
			'11': { daily_value: '', name: 'Arginine', value: '88.0', units: 'mg' },
			'12': {
				daily_value: '',
				name: 'Histidine',
				value: '49.0',
				units: 'mg'
			},
			'13': { daily_value: '', name: 'Alanine', value: '109', units: 'mg' },
			'14': {
				daily_value: '',
				name: 'Aspartic acid',
				value: '236',
				units: 'mg'
			},
			'15': {
				daily_value: '',
				name: 'Glutamic acid',
				value: '287',
				units: 'mg'
			},
			'16': { daily_value: '', name: 'Glycine', value: '104', units: 'mg' },
			'17': { daily_value: '', name: 'Proline', value: '98.0', units: 'mg' },
			'18': { daily_value: '', name: 'Serine', value: '114', units: 'mg' },
			'19': {
				daily_value: '',
				name: 'Hydroxyproline',
				value: '~',
				units: ''
			},
			'20': { daily_value: '' }
		}
	},
	{
		title: 'Vitamins',
		data: {
			'0': { name: 'Vitamin A', value: '146', units: 'IU' },
			'1': {
				daily_value: '3%',
				name: 'Retinol',
				value: '0.0',
				units: 'mcg'
			},
			'2': {
				daily_value: '',
				name: 'Retinol Activity Equivalent',
				value: '7.0',
				units: 'mcg'
			},
			'3': {
				daily_value: '',
				name: 'Alpha Carotene',
				value: '24.0',
				units: 'mcg'
			},
			'4': {
				daily_value: '',
				name: 'Beta Carotene',
				value: '62.0',
				units: 'mcg'
			},
			'5': {
				daily_value: '',
				name: 'Beta Cryptoxanthin',
				value: '28.0',
				units: 'mcg'
			},
			'6': { daily_value: '', name: 'Lycopene', value: '0.0', units: 'mcg' },
			'7': {
				daily_value: '',
				name: 'Lutein+Zeaxanthin',
				value: '271',
				units: 'mcg'
			},
			'8': {
				daily_value: '',
				name: 'Vitamin C',
				value: '10.0',
				units: 'mg'
			},
			'9': { daily_value: '17%', name: 'Vitamin D', value: '~', units: '' },
			'10': {
				daily_value: '~',
				name: 'Vitamin E (Alpha Tocopherol)',
				value: '2.1',
				units: 'mg'
			},
			'11': {
				daily_value: '10%',
				name: 'Beta Tocopherol',
				value: '0.1',
				units: 'mg'
			},
			'12': {
				daily_value: '',
				name: 'Gamma Tocopherol',
				value: '0.3',
				units: 'mg'
			},
			'13': {
				daily_value: '',
				name: 'Delta Tocopherol',
				value: '0.0',
				units: 'mg'
			},
			'14': {
				daily_value: '',
				name: 'Vitamin K',
				value: '21.0',
				units: 'mcg'
			},
			'15': {
				daily_value: '26%',
				name: 'Thiamin',
				value: '0.1',
				units: 'mg'
			},
			'16': {
				daily_value: '4%',
				name: 'Riboflavin',
				value: '0.1',
				units: 'mg'
			},
			'17': { daily_value: '8%', name: 'Niacin', value: '1.7', units: 'mg' },
			'18': {
				daily_value: '9%',
				name: 'Vitamin B6',
				value: '0.3',
				units: 'mg'
			},
			'19': {
				daily_value: '13%',
				name: 'Folate',
				value: '81.0',
				units: 'mcg'
			},
			'20': {
				daily_value: '20%',
				name: 'Food Folate',
				value: '81.0',
				units: 'mcg'
			},
			'21': {
				daily_value: '',
				name: 'Folic Acid',
				value: '0.0',
				units: 'mcg'
			},
			'22': {
				daily_value: '',
				name: 'Dietary Folate Equivalents',
				value: '81.0',
				units: 'mcg'
			},
			'23': {
				daily_value: '',
				name: 'Vitamin B12',
				value: '0.0',
				units: 'mcg'
			},
			'24': {
				daily_value: '0%',
				name: 'Pantothenic Acid',
				value: '1.4',
				units: 'mg'
			},
			'25': {
				daily_value: '14%',
				name: 'Choline',
				value: '14.2',
				units: 'mg'
			},
			'26': { daily_value: '', name: 'Betaine', value: '0.7', units: 'mg' },
			'27': { daily_value: '' }
		}
	},
	{
		title: 'Minerals',
		data: {
			'0': { name: 'Calcium', value: '12.0', units: 'mg' },
			'1': { daily_value: '1%', name: 'Iron', value: '0.5', units: 'mg' },
			'2': {
				daily_value: '3%',
				name: 'Magnesium',
				value: '29.0',
				units: 'mg'
			},
			'3': {
				daily_value: '7%',
				name: 'Phosphorus',
				value: '52.0',
				units: 'mg'
			},
			'4': {
				daily_value: '5%',
				name: 'Potassium',
				value: '485',
				units: 'mg'
			},
			'5': { daily_value: '14%', name: 'Sodium', value: '7.0', units: 'mg' },
			'6': { daily_value: '0%', name: 'Zinc', value: '0.6', units: 'mg' },
			'7': { daily_value: '4%', name: 'Copper', value: '0.2', units: 'mg' },
			'8': {
				daily_value: '9%',
				name: 'Manganese',
				value: '0.1',
				units: 'mg'
			},
			'9': {
				daily_value: '7%',
				name: 'Selenium',
				value: '0.4',
				units: 'mcg'
			},
			'10': {
				daily_value: '1%',
				name: 'Fluoride',
				value: '7.0',
				units: 'mcg'
			},
			'11': { daily_value: '' }
		}
	},
	{
		title: 'Sterols',
		data: {
			'0': { name: 'Cholesterol', value: '0.0', units: 'mg' },
			'1': {
				daily_value: '0%',
				name: 'Phytosterols',
				value: '~',
				units: ''
			},
			'2': {
				daily_value: '',
				name: 'Campesterol',
				value: '5.0',
				units: 'mg'
			},
			'3': {
				daily_value: '',
				name: 'Stigmasterol',
				value: '2.0',
				units: 'mg'
			},
			'4': {
				daily_value: '',
				name: 'Beta-sitosterol',
				value: '76.0',
				units: 'mg'
			},
			'5': { daily_value: '' }
		}
	},
	{
		title: 'Other',
		data: {
			'0': { name: 'Alcohol', value: '0.0', units: 'g' },
			'1': { daily_value: '', name: 'Water', value: '73.2', units: 'g' },
			'2': { daily_value: '', name: 'Ash', value: '1.6', units: 'g' },
			'3': { daily_value: '', name: 'Caffeine', value: '0.0', units: 'mg' },
			'4': {
				daily_value: '',
				name: 'Theobromine',
				value: '0.0',
				units: 'mg'
			},
			'5': { daily_value: '' }
		}
	}
];

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
		console.log(val, unit);
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

				for(let entry in nutritionData[i]["data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData["calories"] == 'undefined') {
						basicNutritionData["calories"] = {};
					}
					if(nutritionData[i]["data"][entry]["name"] == 'Calories') {
						key = 'total_calories'
						val  = nutritionData[i]["data"][entry]["value"]
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Carbohydrates':
				macro = 'carbohydrates'
				for(let entry in nutritionData[i]["data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					switch (nutritionData[i]["data"][entry]["name"]) {
						case 'Total Carbohydrate':
							key = 'total_carbohydrates'
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Dietary Fiber':
							key = "fiber";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Sugars':
							basicNutritionData[macro]["sugars"] = nutritionData[i]["data"][entry]["value"];
							break;
						default:
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
			case 'Fats & Fatty Acids':
				macro = 'fats';
				for(let entry in nutritionData[i]["data"]) {
					val = -1;
					key = '';

					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}

					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					switch (nutritionData[i]["data"][entry]["name"]) {
						case 'Total Fat':
							key = 'total_fats';
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Saturated Fat':
							key = 'saturates';
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Monounsaturated Fat':
							key = "monounsaturated";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Polyunsaturated Fat':
							key = "polyunsaturated";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Total trans fatty acids':
							key = "transfats";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Total Omega-3 fatty acids':
							key = "omega3";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						case 'Total Omega-6 fatty acids':
							key = "omega6";
							val = nutritionData[i]["data"][entry]["value"];
							break;
						default:
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Protein & Amino Acids':
				macro = 'protein';
				for(let entry in nutritionData[i]["data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["data"][entry]["name"] == 'Protein') {
						key = 'total_protein';
						val  = nutritionData[i]["data"][entry]["value"]
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
					}
					if(key != '') {
						val = convertToGrams(val, unit);
						basicNutritionData[macro][key] = val;
					}
				}
				break;
			case 'Minerals':
				macro = 'minerals';
				for(let entry in nutritionData[i]["data"]) {
					val = -1;
					key = '';
					if (typeof basicNutritionData[macro] == 'undefined') {
						basicNutritionData[macro] = {};
					}
					if(nutritionData[i]["data"][entry]["name"] == 'Sodium') {
						key = 'salt';
						val  = nutritionData[i]["data"][entry]["value"]
					}
					if(nutritionData[i]["data"][entry]["units"]) {
						unit = nutritionData[i]["data"][entry]["units"];
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

const basicNutritionalData = extractBasicMacrosFromNutritionData(nutritionData);

console.log("================== basicNutritionalData ===========================");
console.log(utils.inspect(basicNutritionalData, { maxArrayLength: null , depth: null}));
console.log("================== basicNutritionalData ===========================");

