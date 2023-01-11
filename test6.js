const utils = require('util');

const regex = /.*"c01">[Calorie Information|Carbohydrates|Fats &amp; Fatty Acids|Protein &amp; Amino Acids|Vitamins|Minerals|Sterols|Other]+<\/div>[\W\S]*?<div class="clearer">([\W\S.]*?)<(br class="clearer"|\/table|div class="groupBorder")>+/gm;
// Alternative syntax using RegExp constructor
// const regex = new RegExp('.*"c01">[Calorie Information|Carbohydrates|Fats &amp; Fatty Acids|Vitamins|Minerals|Sterols|Other]+<\\/div>[\\W\\S.]*?<div class="clearer">([\\W\\S.]*?)<(br class="clearer"|\\/table)>+', 'gm')

const str = `<table border="0" cellpadding="0" cellspacing="0" width="620">
  <tbody>
    <tr>
      <td valign="top">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder" style="height: 150px;">
            <div align="center" class="c01">Calorie Information</div>
            <div style="width: 286px;">
              <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
              <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
              <div class="clearer">
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
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Carbohydrates</div>
            <div id="GROUP_CARBOHYDRATES">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Total Carbohydrate</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_4">8.5</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_4">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_4">3%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Dietary Fiber</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_5">6.7</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_5">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_5">27%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Starch</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_6">0.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_6">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_6">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Sugars</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_7">0.7</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_7">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_7">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Sucrose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_8">60.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_8">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_8">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Glucose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_9">370</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_9">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_9">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Fructose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_10">120</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_10">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_10">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Lactose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_11">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_11">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_11">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Maltose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_12">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_12">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_12">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Galactose</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_13">100</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_13">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_13">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img id="CARBOHYDRATES" class="expand_collapse" src="/images/analysis/moreDetails.gif">
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Fats &amp; Fatty Acids</div>
            <div id="GROUP_FATS">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Total Fat</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_14">14.7</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_14">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_14">23%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Saturated Fat</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_15">2.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_15">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_15">11%</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">4:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_16">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_16">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_16">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">6:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_17">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_17">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_17">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">8:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_18">1.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_18">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_18">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">10:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_19">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_19">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_19">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">12:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_20">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_20">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_20">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">13:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_21">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_21">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_21">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">14:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_22">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_22">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_22">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">15:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_23">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_23">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_23">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">16:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_24">2075</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_24">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_24">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">17:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_25">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_25">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_25">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_26">49.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_26">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_26">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">19:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_27">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_27">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_27">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_28">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_28">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_28">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_29">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_29">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_29">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">24:00:00</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_30">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_30">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_30">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Monounsaturated Fat</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_31">9.8</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_31">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_31">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">14:01</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_32">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_32">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_32">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">15:01</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_33">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_33">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_33">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">16:1 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_34">698</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_34">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_34">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">16:1 c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_35">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_35">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_35">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">16:1 t</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_36">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_36">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_36">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">17:01</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_37">10.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_37">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_37">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:1 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_38">9065</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_38">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_38">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:1 c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_39">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_39">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_39">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:1 t</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_40">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_40">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_40">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:01</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_41">25.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_41">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_41">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:1 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_42">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_42">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_42">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:1 c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_43">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_43">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_43">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:1 t</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_44">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_44">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_44">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">24:1 c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_45">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_45">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_45">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Polyunsaturated Fat</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_46">1.8</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_46">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_46">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">16:2 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_47">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_47">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_47">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_48">1674</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_48">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_48">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 n-6 c,c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_49">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_49">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_49">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 c,t</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_50">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_50">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_50">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 t,c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_51">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_51">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_51">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 t,t</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_52">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_52">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_52">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 i</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_53">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_53">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_53">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:2 t not further defined</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_54">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_54">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_54">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:03</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_55">125</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_55">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_55">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:3 n-3, c,c,c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_56">111</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_56">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_56">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:3 n-6, c,c,c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_57">15.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_57">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_57">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">18:4 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_58">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_58">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_58">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:2 n-6 c,c</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_59">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_59">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_59">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:3 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_60">16.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_60">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_60">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:3 n-3</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_61">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_61">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_61">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:3 n-6</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_62">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_62">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_62">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:4 undifferentiated</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_63">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_63">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_63">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:4 n-3</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_64">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_64">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_64">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:4 n-6</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_65">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_65">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_65">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">20:5 n-3</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_66">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_66">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_66">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:02</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_67">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_67">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_67">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:5 n-3</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_68">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_68">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_68">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">22:6 n-3</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_69">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_69">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_69">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Total trans fatty acids</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_70">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_70">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_70">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Total trans-monoenoic fatty acids</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_71">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_71">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_71">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Total trans-polyenoic fatty acids</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_132">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_132">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_132">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Total Omega-3 fatty acids</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_139">110</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_139">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_139">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Total Omega-6 fatty acids</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_140">1689</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_140">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_140">&nbsp;</span>
                  </div>
                </div>
              </div>
              <div style="padding-top:2px">
                <a class="nf" href="/topics/fatty-acids" onclick="s_objectID=&quot;https://nutritiondata.self.com/topics/fatty-acids_2&quot;;return this.s_oc?this.s_oc(e):true">Learn more about these fatty acids <br>and their equivalent names </a>
              </div>
            </div>
          </div>
        </div>
        <img id="FATS" class="expand_collapse" src="/images/analysis/moreDetails.gif">
      </td>
      <td class="p-l13" valign="top">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Protein &amp; Amino Acids</div>
            <div id="GROUP_PROTEINS">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Protein</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_77">2.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_77">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_77">4%</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Tryptophan</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_78">25.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_78">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_78">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Threonine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_79">73.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_79">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_79">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Isoleucine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_80">84.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_80">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_80">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Leucine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_81">143</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_81">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_81">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Lysine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_82">132</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_82">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_82">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Methionine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_83">38.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_83">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_83">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Cystine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_84">27.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_84">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_84">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Phenylalanine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_85">232</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_85">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_85">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Tyrosine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_86">49.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_86">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_86">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Valine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_87">107</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_87">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_87">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Arginine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_88">88.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_88">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_88">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Histidine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_89">49.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_89">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_89">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Alanine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_90">109</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_90">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_90">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Aspartic acid</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_91">236</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_91">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_91">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Glutamic acid</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_92">287</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_92">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_92">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Glycine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_93">104</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_93">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_93">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Proline</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_94">98.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_94">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_94">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Serine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_95">114</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_95">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_95">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Hydroxyproline</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_96">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_96">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_96">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img id="PROTEINS" class="expand_collapse" src="/images/analysis/moreDetails.gif">
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Vitamins</div>
            <div id="GROUP_VITAMINS">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin A</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_97">146</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_97">IU</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_97">3%</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Retinol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_98">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_98">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_98">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Retinol Activity Equivalent</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_99">7.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_99">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_99">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Alpha Carotene</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_133">24.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_133">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_133">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Beta Carotene</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_134">62.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_134">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_134">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Beta Cryptoxanthin</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_135">28.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_135">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_135">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Lycopene</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_136">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_136">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_136">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Lutein+Zeaxanthin</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_137">271</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_137">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_137">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin C</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_100">10.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_100">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_100">17%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin D</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_101">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_101">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_101">~</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin E (Alpha Tocopherol)</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_102">2.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_102">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_102">10%</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Beta Tocopherol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_104">0.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_104">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_104">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Gamma Tocopherol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_105">0.3</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_105">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_105">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Delta Tocopherol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_106">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_106">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_106">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin K</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_103">21.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_103">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_103">26%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Thiamin</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_107">0.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_107">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_107">4%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Riboflavin</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_108">0.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_108">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_108">8%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Niacin</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_109">1.7</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_109">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_109">9%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin B6</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_110">0.3</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_110">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_110">13%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Folate</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_111">81.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_111">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_111">20%</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Food Folate</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_112">81.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_112">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_112">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Folic Acid</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_113">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_113">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_113">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Dietary Folate Equivalents</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_114">81.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_114">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_114">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Vitamin B12</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_115">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_115">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_115">0%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Pantothenic Acid</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_116">1.4</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_116">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_116">14%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Choline</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_143">14.2</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_143">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_143">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Betaine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_144">0.7</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_144">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_144">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img id="VITAMINS" class="expand_collapse" src="/images/analysis/moreDetails.gif">
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Minerals</div>
            <div id="GROUP_MINERALS">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Calcium</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_117">12.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_117">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_117">1%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Iron</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_118">0.5</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_118">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_118">3%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Magnesium</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_119">29.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_119">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_119">7%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Phosphorus</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_120">52.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_120">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_120">5%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Potassium</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_121">485</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_121">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_121">14%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Sodium</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_122">7.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_122">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_122">0%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Zinc</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_123">0.6</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_123">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_123">4%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Copper</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_124">0.2</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_124">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_124">9%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Manganese</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_125">0.1</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_125">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_125">7%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Selenium</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_126">0.4</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_126">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_126">1%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Fluoride</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_145">7.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_145">mcg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_145">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Sterols</div>
            <div id="GROUP_STEROLS">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Cholesterol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_72">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_72">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_72">0%</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Phytosterols</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_73">~</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_73">&nbsp;</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_73">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Campesterol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_74">5.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_74">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_74">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Stigmasterol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_75">2.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_75">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_75">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer" style="display: none;">
                  <div class="nf1 left" id="nfacts">
                    <div class="indentation">
                      <!--Indent Nutrients-->
                    </div>
                    <span class="indented">Beta-sitosterol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_76">76.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_76">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_76">y</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img id="STEROLS" class="expand_collapse" src="/images/analysis/moreDetails.gif">
        <br class="clearer">
        <div class="clearer m-t13" style="width: 300px;">
          <div class="groupBorder">
            <div align="center" class="c01">Other</div>
            <div id="GROUP_OTHER" style="height: 120px;">
              <div style="width: 286px;" class="nutList">
                <div class="c02 left" style="width: 225px;">Amounts Per Selected Serving</div>
                <div class="c02 left" style="width: 41px; text-align: right;">%DV</div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Alcohol</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_127">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_127">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_127">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Water</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_128">73.2</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_128">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_128">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Ash</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_129">1.6</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_129">g</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_129">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Caffeine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_130">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_130">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_130">&nbsp;</span>
                  </div>
                </div>
                <div class="clearer">
                  <div class="nf1 left" id="nfacts">
                    <span class="indented">Theobromine</span>
                  </div>
                  <div class="nf2 left" style="width:38px;">
                    <span id="NUTRIENT_131">0.0</span>
                  </div>
                  <div class="nf3 left" style="width:20px;">
                    <span id="UNIT_NUTRIENT_131">mg</span>
                  </div>
                  <div class="nf4 left" style="width:31px;">
                    <span id="DV_NUTRIENT_131">x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>`;


function divisible(dividend, divisor){
	if (dividend % divisor == 0) {
		return dividend;
	} else {
		var num = dividend + (divisor-(dividend % divisor));
		return num;
	}
}



var firstPass = [];
let sectionCount = 0;
let dataCount = -1;
let key = null;
let m;
while ((m = regex.exec(str)) !== null) {
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	m.forEach((match, groupIndex) => {
		switch(groupIndex) {
			case 0:
				let title = match.replace(/.*<div align="center" class="c01">([\W\S.]+?)<[\/\W\S.]*/gm, '$1');
				title = title.split('&amp;').join('&');
				let initialize = false;
				switch(title) {
					case 'Calorie Information':
						sectionCount = 0;
						dataCount = 0;
						initialize = true;
						break;
					case 'Carbohydrates':
						sectionCount = 1;
						dataCount = 0;
						initialize = true;
						break;
					case 'Fats & Fatty Acids':
						sectionCount = 2;
						dataCount = 0;
						initialize = true;
						break;
					case 'Protein & Amino Acids':
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

						if(typeof firstPass[sectionCount] == 'undefined') {
							firstPass[sectionCount] = {};

						}
						firstPass[sectionCount]["title"] = title;
						firstPass[sectionCount]["data"] = {};
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
					firstPass[sectionCount]["data"] = {};
				}
				break;
			case 1:
				let m2;
				const regex2 = /.*"([A-Z_]+[NUTRIENT_]+[\d]{1,4}|indented|nf1.*)[">&nbsp;]*["]*(.*)<[\/]*/gm;
				const str = match;
				while ((m2 = regex2.exec(str)) !== null) {
					// This is necessary to avoid infinite loops with zero-width matches
					if (m2.index === regex2.lastIndex) {
						regex2.lastIndex++;
					}
					m2.forEach((match2, groupIndex2) => {
						switch(groupIndex2) {
							case 1:
								let p = match2.split(' ')[0];
								p = p.split('_')[0];
								switch(p) {
									case 'nf1':
									case 'indented':
										key = 'name';
										break;
									case 'NUTRIENT':
										key = 'value';
										break;
									case 'UNIT':

										key = 'units';
										break;
									case 'DV':
										dataCount++;
										key = 'daily_value';
										break;
									default:
								}
								break;
							case 2:
								try {

									if (typeof firstPass[sectionCount]["data"][`${dataCount}`] == 'undefined') {

										firstPass[sectionCount]["data"][`${dataCount}`] = {};
									}
									firstPass[sectionCount]["data"][`${dataCount}`][`${key}`] = match2;
								}
								catch(err) {}
								break;
							default:
						}
					});
				}
				break;
			default:
		}
	});
}

console.log("================== OPTS ===========================");
console.log(utils.inspect(firstPass, { maxArrayLength: null , depth: null}));
console.log("================== OPTS ===========================");
