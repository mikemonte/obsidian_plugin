let fmc = {
	"name": "Mustard Powder",
	"brand": "Fitzgeralds",
	"common_family_name": "n/a",
	"container": "n/a",
	"description": "Only 130 Calories Per Bagel. Delicious Lightly Toasted! Classic bagel taste, just a slimmer bagel! Suitable for Vegetarians and Vegans",
	"expiry_date": "n/a",
	"frequency_of_access": "weekly",
	"ingredients": {
		"1": {
			"name": "wheat flour",
			"percentage": null
		},
		"2": {
			"name": "sourdough",
			"percentage": 19
		},
		"3": {
			"name": "water",
			"percentage": null
		},
		"4": {
			"name": "rye flour",
			"percentage": null
		},
		"5": {
			"name": "yeast",
			"percentage": null
		},
		"6": {
			"name": "sugar",
			"percentage": null
		},
		"7": {
			"name": "rapseed oil",
			"percentage": null
		},
		"8": {
			"name": "salt",
			"percentage": null
		},
		"9": {
			"name": "malted barley flour",
			"percentage": null
		},
		"10": {
			"name": "calcium propionate",
			"percentage": null
		},
		"11": {
			"name": "sorbic acid",
			"percentage": null
		}
	},
	"location": "fridge",
	"nutritional_data_source": "https://www.nutritionvalue.org/Fish%2C_granular%2C_black_and_red%2C_caviar_nutritional_value.html?size=100+g",
	"nutritional_information_per_100g": {
		"1": {
			"name": "energy",
			"amount": "0"
		},
		"2": {
			"name": "protein",
			"amount": "0"
		},

	},
	"portion_data": {
		"type": "weight",
		"weight": "60g"
	},
	"scientific_family_name": "n/a",
	"scientific_genus": "n/a",
	"scientific_name": "n/a",
	"supplier": "https://www.waitrose.com/ecom/products/fitzgeralds-sourdough-bagel-slims/831855-769644-769645",
	"tags": "food, bread, bagels",
	"position": {
		"start": {
			"line": 0,
			"col": 0,
			"offset": 0
		},
		"end": {
			"line": 375,
			"col": 3,
			"offset": 6547
		}
	}
}


let fields = [
	"[\"nutritional_information_per_100g\"][\"1\"][\"name\"]",
	"[\"nutritional_information_per_100g\"][\"1\"][\"amount\"]",

	"[\"nutritional_information_per_100g\"][\"2\"][\"name\"]",
	"[\"nutritional_information_per_100g\"][\"2\"][\"amount\"]",

]

let values = [
	"energy",
	"40",

	"protein",
	"24.6",


]
let numberOfEntriesUpdate = 0;
eval(`fmc["${'nutritional_information_per_100g'}"] = {};`);

let testKey = '';
for (let i = 0; i < fields.length; i++) {
	let val = String(values[i]);
	// @ts-ignore
	if(!isNaN(val)) {
		val = `'${val}'`
	}

	try {
		// TODO find alternative way to do this as EVAL is not safe
		eval(`testValue = fmc${fields[i]};`);
		try {
			eval(`fmc${fields[i]} = ${val};`);
		}
		catch(err) {
			console.log(err)
			eval(`fmc${fields[i]} = '${val}';`);
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
						eval(`fmc${fields[i]} = ${val};`);
					}
					catch(err) {
						try {
							eval(`fmc${fields[i]} = '${val}';`);
						}
						catch(e) {
							console.log(`field:${fields[i]} does not exist`)
						}
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


console.log(fmc)
