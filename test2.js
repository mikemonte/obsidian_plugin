let fmc = {
	"ketones": 0,
	"glucose": 0,
	"oura_sleep_score": 87,
	"oura_readiness_score": 87,
	"REM_Sleep": "39 min",
	"Deep_Sleep": "37 min",
	"food_intake_tracker": {
		"1": {
			"time": "asd",
			"food_item": "Eadsiled",
			"quantity": 0
		},
		"2": {
			"time": null,
			"food_item": null,
			"quantity": null
		}
	},
	"my_field": {
		"1": "texas",
		"2": "poop",
		"3": "tutu"
	},
	"more_date": {
		"d1": {
			"1": "hello",
			"2": "fd"
		}
	},
	"kuku": "clock",
	"ama": {
		"1": {
			"name": "foo",
			"count": 144
		}
	},
	"position": {
		"start": {
			"line": 1,
			"col": 0,
			"offset": 1
		},
		"end": {
			"line": 30,
			"col": 3,
			"offset": 357
		}
	}
}

let foodIntakeData = [
	[
		"0845",
		"Egg Hard Boiled",
		"40"
	],
		[
			"0845",
			"Caviar",
			"30"
		],
		[
			"0845",
			"Stokes Real Mayonnaise",
			"20"
		],
		[
			"1130",
			"Cado Smoked Ham Crackers",
			"1"
		],
		[
			"1600",
			"Brown Rice Smoked Ham & Onion, Carrot, Cabbage",
			"1"
		]
	];

let fields = [
	'["food_intake_tracker"]["5"]["time"]',
	'["food_intake_tracker"]["5"]["food_item"]',
	'["food_intake_tracker"]["5"]["quantity"]'
	];
let values = [
	"0845x",
	"Egg Hard Boiledx",
	"40x"
	]

fields = [];
values = [];
keys = ["time", "food_item", "quantity"];
keysIdx = 0;
for(let f=0; f < (3 * foodIntakeData.length); f++) {
	fields.push(`["food_intake_tracker"]["${Math.floor(f / 3)}"]["${keys[keysIdx]}"]`);
	values.push(foodIntakeData[Math.floor(f / 3)][keysIdx]);
	if(keysIdx == 2) {
		keysIdx = 0;
	}
	else {
		keysIdx++;
	}
}

console.log(fields);

console.log(values);

let testValue = null;
let testKey = '';
for( let i = 0; i < fields.length; i++ ) {
	try {
		eval(`testValue = fmc${fields[i]};`);
		eval(`fmc${fields[i]} = '${values[i]}';`);
	}
	catch (error) {
		let tmpAr = fields[i].split('[');
		for(let j = 0; j < tmpAr.length; j++) {
			let tmpField = tmpAr[j].split(']').join('');
			tmpField = tmpField.trim();

			if(tmpField && tmpField.length > 0 && typeof eval(`fmc${testKey}`) != 'undefined') {
				testKey += `[${tmpField}]`;
				if(typeof eval(`fmc${testKey}`) == 'undefined' && j < (tmpAr.length - 1)) {
					eval(`fmc${testKey} = {}`);
					eval(`fmc${fields[i]} = '${values[i]}';`);
				}
				if((j == (tmpAr.length - 1))) {
					testKey = '';
				}
			}
		}
	}
}

console.log(fmc)
