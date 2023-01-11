const regex = /\n([  ]*)"([\d]+)"/gmi;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('\\n([  ]*)"([\\d]+)"', 'gmi')

const str = `---
ketones: 0
glucose: 0
oura_sleep_score: 87
oura_readiness_score: 87
REM_Sleep: 39 min
Deep_Sleep: 37 min
my_field:
  "13": texas
  "2": poop
  "3": tutu
foo_test:
  "1": null
food_intake:
  "1":
    time: 845
    food_items:
      "1":
        name: Egg Hard Boiled
        quantity: 40
      "2":
        name: Caviar
        quantity: 30
      "3":
        name: Stokes Real Mayonnaise
        quantity: 20
glossary_recall_session:
  recall_attempt_count: 0
  recall_success_count: 0
  recall_session_duration: 0
tags: dayplannernote
---`;
const subst = `\n$1$2`;

// The substituted value will be contained in the result variable
const result = str.replace(regex, subst);

const result2 = result.replace(/\n([  ]*)([^\n]+)/gmi, function (match, capture1, capture2) {
	console.log(capture1, capture2);
	return `\n${String(' ').repeat(capture1.length / 2)}${capture2}`;
});
//console.log('Substitution result1: ', result);
console.log('Substitution result2: ', result2);
