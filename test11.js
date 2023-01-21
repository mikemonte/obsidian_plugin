

const str = `https://nutrition-value.asdfsdf.sadf-dsa/Bacon%2C_meatless_nutritional_value.html?size=100+g`;
const subst = `axd`;

// The substituted value will be contained in the result variable



let results = Array.from(str.matchAll(new RegExp('https:\\/\\/(www.)?([\\w\\-\\.]+)+\\/[\\W\\S]*?', 'gmi')))[0][2];



console.log(results);

