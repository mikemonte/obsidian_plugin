const regex = /"name": "([\w]*?)"/gm;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('"name": "([\\w]*?)"', 'gm')

const str = `    "0": {
        "name": "fat",
        "value": "29.52",
        "units": "g"
    },
    "1": {
        "name": "saturates",
        "value": "4.622",
        "units": "g"
    },
    "2": {
        "name": "butanoic_acid",
        "value": "0",
        "units": "g"
    },
    "3": {
        "name": "decanoic_acid",
        "value": "0",
        "units": "g"
    },
    "4": {
        "name": "dodecanoic_acid",
        "value": "0.245",
        "units": "g"
    },
    "5": {
        "name": "hexadecanoic_acid",
        "value": "3.045",
        "units": "g"
    },
    "6": {
        "name": "hexanoic_acid",
        "value": "0",
        "units": "g"
    },
    "7": {
        "name": "octadecanoic_acid",
        "value": "1.169",
        "units": "g"
    },
    "8": {
        "name": "octanoic_acid",
        "value": "0",
        "units": "g"
    },
    "9": {
        "name": "tetradecanoic_acid",
        "value": "0.163",
        "units": "g"
    },
    "10": {
        "name": "monounsaturated",
        "value": "7.095",
        "units": "g"
    },
    "11": {
        "name": "docosenoic_acid",
        "value": "0",
        "units": "g"
    },
    "12": {
        "name": "eicosenoic_acid",
        "value": "0",
        "units": "g"
    },
    "13": {
        "name": "hexadecenoic_acid",
        "value": "0",
        "units": "g"
    },
    "14": {
        "name": "octadecenoic_acid",
        "value": "7.095",
        "units": "g"
    },
    "15": {
        "name": "polyunsaturated",
        "value": "15.441",
        "units": "g"
    },
    "16": {
        "name": "DHA",
        "value": "0",
        "units": "g"
    },
    "17": {
        "name": "DPA",
        "value": "0",
        "units": "g"
    },
    "18": {
        "name": "EPA",
        "value": "0",
        "units": "g"
    },
    "19": {
        "name": "eicosatetraenoic_acid",
        "value": "0",
        "units": "g"
    },
    "20": {
        "name": "octadecadienoic_acid",
        "value": "13.756",
        "units": "g"
    },
    "21": {
        "name": "octadecatetraenoic_acid",
        "value": "0",
        "units": "g"
    },
    "22": {
        "name": "octadecatrienoic_acid",
        "value": "1.686",
        "units": "g"
    }
}`;
let m;
let idx = 1;
while ((m = regex.exec(str)) !== null) {
	// This is necessary to avoid infinite loops with zero-width matches
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	// The result can be accessed through the `m`-variable.

	m.forEach((match, groupIndex) => {
		if(groupIndex == 1) {
			console.log(`${idx}:\n name: ${match}\n amount: 0`);
			idx++;
		}
	}, idx);
}
