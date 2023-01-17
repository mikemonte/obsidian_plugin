const regex = /('([\d])+':[\W\S]*?([\ ]+)[a-z]*?:)/gm;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('\'([\\d])+\':[\\W\\S]*?([\\ ]+)', 'gm')

const str = `nutritional_information_per_100g:
  '1':
    name: energy
    amount: '555'
  '2':
    name: protein
    amount: 0
  '3':
    name: carbohydrates
    amount: 0
    '1':
      name: fiber
      amount: 0
    '2':
      name: sugar
      amount: 0
      '1':
        name: glucose
        amount: 0
      '2':
        name: fructose
        amount: 0
      '3':
        name: sucrose
        amount: 0
      '4':
        name: lactose
        amount: 0
      '5':
        name: maltose
        amount: 0
      '6':
        name: galactose
        amount: 0
    '3':
      name: starch
      amount: 0
  '4':`;
let m;
let out = str;
while ((m = regex.exec(str)) !== null) {
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	// The result can be accessed through the `m`-variable.
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
console.log(out)
