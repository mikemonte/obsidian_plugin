const regex = /.*"([A-Z_]+[NUTRIENT_]+[\d]{1,4}|<div class="(nf1) left" style="width:113px;")[">&nbsp;]*["]*(.*)<[\/]*/gm;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('.*"([A-Z_]+[NUTRIENT_]+[\\d]{1,4}|<div class="(nf1) left" style="width:113px;")[">&nbsp;]*["]*(.*)<[\\/]*', 'gm')

const str = `
                <div class="nf1 left" style="width:113px;">Calories</div>
                <div class="nf2 left" style="width:38px;">
                  <span id="NUTRIENT_0">160</span>
                </div>
                <div class="nf3 left" style="width:65px;">
                  <span id="KJ_NUTRIENT_0">(670 kJ)</span>
                </div>
                <div class="nf4 left" style="width:40px;">
                  <span id="DV_NUTRIENT_0">8%</span>
                </div>
              </div>
              <div class="clearer">
                <div class="nf1 left" style="width:113px;">&nbsp;&nbsp;From Carbohydrate</div>
                <div class="nf2 left" style="width:38px;">
                  <span id="NUTRIENT_1">30.6</span>
                </div>
                <div class="nf3 left" style="width:65px;">
                  <span id="KJ_NUTRIENT_1">(128 kJ)</span>
                </div>
                <div class="nf4 left" style="width:40px;">
                  <span id="DV_NUTRIENT_1">&nbsp;</span>
                </div>
              </div>
              <div class="clearer">
                <div class="nf1 left" style="width:113px;">&nbsp;&nbsp;From Fat</div>
                <div class="nf2 left" style="width:38px;">
                  <span id="NUTRIENT_2">123</span>
                </div>
                <div class="nf3 left" style="width:65px;">
                  <span id="KJ_NUTRIENT_2">(515 kJ)</span>
                </div>
                <div class="nf4 left" style="width:40px;">
                  <span id="DV_NUTRIENT_2">&nbsp;</span>
                </div>
              </div>
              <div class="clearer">
                <div class="nf1 left" style="width:113px;">&nbsp;&nbsp;From Protein</div>
                <div class="nf2 left" style="width:38px;">
                  <span id="NUTRIENT_3">6.7</span>
                </div>
                <div class="nf3 left" style="width:65px;">
                  <span id="KJ_NUTRIENT_3">(28.1 kJ)</span>
                </div>
                <div class="nf4 left" style="width:40px;">
                  <span id="DV_NUTRIENT_3">&nbsp;</span>
                </div>
              </div>
              <div class="clearer">
                <div class="nf1 left" style="width:113px;">&nbsp;&nbsp;From Alcohol</div>
                <div class="nf2 left" style="width:38px;">
                  <span id="NUTRIENT_138">0.0</span>
                </div>
                <div class="nf3 left" style="width:65px;">
                  <span id="KJ_NUTRIENT_138">(0.0 kJ)</span>
                </div>
                <div class="nf4 left" style="width:40px;">
                  <span id="DV_NUTRIENT_138">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        `;
let m;

while ((m = regex.exec(str)) !== null) {
	// This is necessary to avoid infinite loops with zero-width matches
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	// The result can be accessed through the `m`-variable.
	m.forEach((match, groupIndex) => {
		console.log(`Found match, group ${groupIndex}: ${match}`);
	});
}
