const utils = require('util');



// Alternative syntax using RegExp constructor
// const regex = new RegExp('nutrient results([\\W\\S]*?)<br>', 'gim')

const str = `<td><table class="center zero wide fixed"><tbody><tr><td class="left noprint" colspan="3"><table class="wide"><tbody><tr><td class="left"><button id="add-to-diary" class="noprint" onclick="addToDiary(&quot;63101000&quot;, &quot;Apple, raw&quot;, &quot;100 g&quot;, &quot;1 cup = 125 g;1 extra large = 295 g;1 large = 242 g;1 medium = 200 g;1 slice = 25 g;1 small = 165 g;1 single serving package = 34 g;1 g;1 ounce = 28.3495 g;1 pound = 453.592 g;1 kg = 1000 g&quot;);">Add to diary</button></td><td class="right"><button onclick="document.location.href=&quot;/favorites.php?add&amp;id=63101000&amp;name=Apple%2C+raw&amp;serving_size=100+g&quot;;">Add to favorites</button></td></tr></tbody></table></td></tr><tr><td colspan="3"><table class="title"><tbody><tr><td><img src="/images/foods/70/apple.png" srcset="/images/foods/70/apple.png 1x,/images/foods/140/apple.png 2x,/images/foods/210/apple.png 3x" alt="apple" title="apple" height="70" width="106"></td><td><h1 style="font-size:x-large" id="food-name">Apple, raw</h1></td></tr></tbody></table></td></tr><tr><td colspan="3">Select portion size: <form method="get">
          <select class="serving" name="size" onchange="updateCustomSizeForFood(this, &quot;63101000&quot;);" data-value="100 g"><option value="100 g" selected="selected">100 g</option><option value="1 cup = 125 g">1 cup = 125 g</option><option value="1 extra large = 295 g">1 extra large = 295 g</option><option value="1 large = 242 g">1 large = 242 g</option><option value="1 medium = 200 g">1 medium = 200 g</option><option value="1 slice = 25 g">1 slice = 25 g</option><option value="1 small = 165 g">1 small = 165 g</option><option value="1 single serving package = 34 g">1 single serving package = 34 g</option><option value="1 g">1 g</option><option value="1 ounce = 28.3495 g">1 ounce = 28.3495 g</option><option value="1 pound = 453.592 g">1 pound = 453.592 g</option><option value="1 kg = 1000 g">1 kg = 1000 g</option><option value="custom g">custom g</option><option value="custom oz">custom oz</option></select></form></td></tr><tr><td>
<table style="border:solid 2px black" class="center" id="nutrition-label"><tbody><tr><td>
<table class="center zero">
<tbody><tr><td class="center" style="font-size:xx-large; font-weight:bold" colspan="2">
Nutrition Facts
</td></tr>

<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>

<tr><td class="left" style="font-size:large; font-weight: bold;">Portion Size</td><td class="right" style="font-size:large; font-weight: bold;"><span id="serving-size">100 g</span></td></tr>

<tr><td colspan="2" style="background-color:black;padding:0;height:10px"></td></tr>

<tr><td class="left" style="font-size:small"><b>Amount Per Portion</b></td><td rowspan="2" class="right" style="font-size:2.5em; font-weight: bold;" id="calories">52</td></tr>

<tr><td class="left" style="font-size:xx-large; font-weight: bold;">Calories</td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:5px"></td></tr>

<tr><td class="right" colspan="2" style="font-size:small"><b>% Daily Value *</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>
<tr><td class="left"><b>Total&nbsp;Fat</b>&nbsp;0.2g</td>
<td class="right"><b>0&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Sodium</b>&nbsp;1mg</td>
<td class="right"><b>0&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Total&nbsp;Carbohydrate</b>&nbsp;14g</td>
<td class="right"><b>5&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr>
<tr><td class="left">&nbsp;&nbsp;&nbsp;Dietary&nbsp;Fiber&nbsp;2.4g</td>
<td class="right"><b>9&nbsp;%</b></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;Sugar&nbsp;10g</td>
<td class="right"></td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left"><b>Protein</b>&nbsp;0.3g</td>
<td class="right"><b>1&nbsp;%</b></td></tr>

<tr><td colspan="2" style="background-color:black;padding:0px;height:10px"></td></tr><tr><td class="left">Vitamin D&nbsp;0mcg</td>
  <td class="right">0&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Calcium&nbsp;6mg</td>
  <td class="right">0&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Iron&nbsp;0.1mg</td>
  <td class="right">1&nbsp;%</td></tr>
  <tr><td colspan="2" style="background-color:black;padding:0px;height:1px"></td></tr><tr><td class="left">Potassium&nbsp;107mg</td>
<td class="right">2&nbsp;%</td></tr>
<tr><td colspan="2" style="background-color:black;padding:0px;height:5px"></td></tr> <tr><td class="left" colspan="2" style="font-size:small;">
* The % Daily Value (DV) tells you how much a nutrient in a serving of food contribute to a daily diet. <span id="dv-note">2000 calories a day is used for general nutrition advice.</span></td></tr></tbody></table></td></tr></tbody></table></td><td>&nbsp;</td><td>  <a class="noprint copy" href="javascript:void(0);" onclick="copyToClipboard(event, &quot;https:\/\/www.nutritionvalue.org\/Apple%2C_raw_63101000_nutritional_value.html?size=100%20g&amp;utm_source=share-by-url&quot;, &quot;Share-by-URL&quot;, &quot;URL copied&quot;);" title="Copy URL">Share by URL  <svg stroke-linecap="round" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="rgb(128,128,128)" xmlns="http://www.w3.org/2000/svg"><polyline points="1,4 1,22 15,22 15,4 1,4"></polyline><polyline points="4,4 4,1 18,1 18,19 15,19"></polyline><polyline points="4,10 12,10" stroke="rgb(192,192,192)"></polyline><polyline points="4,13 12,13" stroke="rgb(192,192,192)"></polyline><polyline points="4,16 12,16" stroke="rgb(192,192,192)"></polyline><polyline points="4,19 12,19" stroke="rgb(192,192,192)"></polyline></svg></a> <div class="control"><a rel="nofollow" id="toogleFoodA" href="/comparefoods.php?action=add&amp;id=63101000&amp;unit=100+g">Add to comparison</a> <span class="question" title="Add two or more items to see a side by side comparison." data-type="generic" onclick="renderHelp(this);">ⓘ</span></div> <div class="control"><a rel="nofollow" href="/nutritioncalculator.php?action=add&amp;ids=63101000&amp;sizes=100+g">Add to recipe</a> <span class="question" title="Add this food as ingredients to a meal." data-type="generic" onclick="renderHelp(this);">ⓘ</span></div>  <div class="control"><a rel="nofollow" href="#" onclick="return downloadCSV(this);" download="apple_raw.csv">Download spreadsheet (CSV)</a></div> <div class="control"><a href="javascript:window.print();void(0);">Print page 🖶</a></div> <br><img src="https://chart.googleapis.com/chart?cht=p&amp;chs=300x150&amp;chtt=Calories+by+source&amp;chd=t:3%2C2%2C95&amp;chl=Fat%203%25%7CProtein%202%25%20%7CCarbs%2095%25&amp;chco=DDDDAA%2CFFAAAA%2CDDDDFF" width="300" height="150" alt="Apple, raw, calories by source" title="Apple, raw, calories by source">
 <br><br><br><img src="https://chart.googleapis.com/chart?cht=bhs&amp;chs=300x150&amp;chxt=x,y,x&amp;chxl=1:%7CProtein%7CCarbs%7CFat%7CCalories%7C2:%7CPercentile+of+foods+in+the+database%7C&amp;chxp=2,50&amp;chm=N**%25,,0,,10,,e:3&amp;chd=t:16,30,39,25&amp;chco=AAAAAA%7CDDDDAA%7CDDDDFF%7CFFAAAA" width="300" height="150" alt="Apple, raw, percentiles" title="Apple, raw, percentiles">
 <div class="control">Badges: <a href="/lowfatfooddefinition.php">low fat</a></div><br></td></tr><tr><td colspan="3"><div class="noprint ad perm_ad">
<!-- Nutrition value -->
<ins class="adsbygoogle" style="display: block; height: 280px;" data-ad-client="ca-pub-7891406799955373" data-ad-slot="3336797990" data-ad-format="auto" data-adsbygoogle-status="done"><div id="aswift_0_host" style="border: none; height: 280px; width: 944px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-block;"></div></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
<script>
 var top_banner_shown = 42;
</script>
</div></td></tr><tr><td colspan="3"><h3>Apple, raw nutrition facts and analysis per 100 g</h3></td></tr><tr><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Vitamins</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin A, RAE" class="tooltip">Vitamin A, RAE</a> </td><td class="right">3.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_A__RAE" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, alpha" class="tooltip">Carotene, alpha</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Carotene, beta" class="tooltip">Carotene, beta</a> </td><td class="right">27.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Cryptoxanthin, beta" class="tooltip">Cryptoxanthin, beta</a> </td><td class="right">11.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lutein" class="tooltip">Lutein</a> + <a href="#" data-tooltip="zeaxanthin" class="tooltip">zeaxanthin</a> </td><td class="right">29.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Lycopene" class="tooltip">Lycopene</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Retinol" class="tooltip">Retinol</a> </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Thiamin" class="tooltip">Thiamin</a> <span class="gray">[Vitamin B1]</span></td><td class="right">0.017&nbsp;mg</td><td><a href="/daily_values.php#Thiamin" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Riboflavin" class="tooltip">Riboflavin</a> <span class="gray">[Vitamin B2]</span></td><td class="right">0.026&nbsp;mg</td><td><a href="/daily_values.php#Riboflavin" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Niacin" class="tooltip">Niacin</a> <span class="gray">[Vitamin B3]</span></td><td class="right">0.091&nbsp;mg</td><td><a href="/daily_values.php#Niacin" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin B6" class="nowrap tooltip">Vitamin B6</a> </td><td class="right">0.041&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_B6" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin B12" class="tooltip">Vitamin B12</a> <span class="gray">[Cobalamin]</span></td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_B12" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin B12, added </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Folate, DFE" class="tooltip">Folate, DFE</a> <span class="gray">[Vitamin B9]</span></td><td class="right">3.00&nbsp;mcg</td><td><a href="/daily_values.php#Folate__DFE" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Folate, food </td><td class="right">3.00&nbsp;mcg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Folic acid </td><td class="right">0.00&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin C" class="nowrap tooltip">Vitamin C</a> <span class="gray">[Ascorbic acid]</span></td><td class="right">4.6&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_C" target="_blank">5&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin D" class="nowrap tooltip">Vitamin D</a> </td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_D" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin E (alpha-tocopherol)" class="tooltip">Vitamin E (alpha-tocopherol)</a> </td><td class="right">0.18&nbsp;mg</td><td><a href="/daily_values.php#Vitamin_E" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin E, added </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;Tocopherol, alpha </td><td class="right">0.18&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Vitamin K" class="nowrap tooltip">Vitamin K</a> </td><td class="right">2.2&nbsp;mcg</td><td><a href="/daily_values.php#Vitamin_K" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;Vitamin K1 <span class="gray">[Phylloquinone]</span></td><td class="right">2.2&nbsp;mcg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Choline" class="tooltip">Choline</a> </td><td class="right">3.4&nbsp;mg</td><td><a href="/daily_values.php#Choline" target="_blank">1&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Minerals</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Calcium" class="tooltip">Calcium</a> </td><td class="right">6.00&nbsp;mg</td><td><a href="/daily_values.php#Calcium" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Copper" class="tooltip">Copper</a> </td><td class="right">0.03&nbsp;mg</td><td><a href="/daily_values.php#Copper" target="_blank">3&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Iron" class="tooltip">Iron</a> </td><td class="right">0.12&nbsp;mg</td><td><a href="/daily_values.php#Iron" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Magnesium" class="tooltip">Magnesium</a> </td><td class="right">5.00&nbsp;mg</td><td><a href="/daily_values.php#Magnesium" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Phosphorus" class="tooltip">Phosphorus</a> </td><td class="right">11.00&nbsp;mg</td><td><a href="/daily_values.php#Phosphorus" target="_blank">1&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Potassium" class="tooltip">Potassium</a> </td><td class="right">107.00&nbsp;mg</td><td><a href="/daily_values.php#Potassium" target="_blank">2&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Selenium" class="tooltip">Selenium</a> </td><td class="right">0.00&nbsp;mcg</td><td><a href="/daily_values.php#Selenium" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Sodium" class="tooltip">Sodium</a> </td><td class="right">1.00&nbsp;mg</td><td><a href="/daily_values.php#Sodium" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left"><a href="#" data-tooltip="Zinc" class="tooltip">Zinc</a> </td><td class="right">0.04&nbsp;mg</td><td><a href="/daily_values.php#Zinc" target="_blank">0&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Proteins and Aminoacids</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Protein" class="tooltip">Protein</a> </td><td class="right">0.26&nbsp;g</td><td><a href="/daily_values.php#Protein" target="_blank">1&nbsp;%</a></td></tr></tbody></table><br>
</td><td>&nbsp;</td><td style="width: 49%; vertical-align: top;"><table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Carbohydrates</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Carbohydrate" class="tooltip">Carbohydrate</a> </td><td class="right">13.81&nbsp;g</td><td><a href="/daily_values.php#Carbohydrate" target="_blank">5&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Fiber" class="tooltip">Fiber</a> </td><td class="right">2.40&nbsp;g</td><td><a href="/daily_values.php#Fiber" target="_blank">9&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Sugars" class="tooltip">Sugars</a> </td><td class="right">10.39&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Net carbs" class="tooltip">Net carbs</a> </td><td class="right">11.41&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Fats and Fatty Acids</th></tr><tr><td colspan="3"><img src="https://chart.googleapis.com/chart?cht=p&amp;chf=bg,s,ffffff00&amp;chs=360x150&amp;chtt=Fatty+acids+by+type&amp;chd=t:33%2C8%2C59&amp;chl=Saturated%2033%25%7CMonounsaturated%208%25%7CPolyunsaturated%2059%25&amp;chco=AAAAFF%2CFFAAAA%2CAAFFAA" alt="Apple, raw, fatty acids by type" width="360" height="150" title="Apple, raw, fatty acids by type"></td></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Fat" class="tooltip">Fat</a> </td><td class="right">0.170&nbsp;g</td><td><a href="/daily_values.php#Fat" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Saturated fatty acids" class="tooltip">Saturated fatty acids</a> </td><td class="right">0.028&nbsp;g</td><td><a href="/daily_values.php#Saturated_fatty_acids" target="_blank">0&nbsp;%</a></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Butanoic acid" class="tooltip">Butanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Decanoic acid" class="tooltip">Decanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Dodecanoic acid" class="tooltip">Dodecanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexadecanoic acid" class="tooltip">Hexadecanoic acid</a> </td><td class="right">0.024&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexanoic acid" class="tooltip">Hexanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecanoic acid" class="tooltip">Octadecanoic acid</a> </td><td class="right">0.003&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octanoic acid" class="tooltip">Octanoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Tetradecanoic acid" class="tooltip">Tetradecanoic acid</a> </td><td class="right">0.001&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Monounsaturated fatty acids" class="tooltip">Monounsaturated fatty acids</a> </td><td class="right">0.007&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosenoic acid" class="tooltip">Docosenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosenoic acid" class="tooltip">Eicosenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Hexadecenoic acid" class="tooltip">Hexadecenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecenoic acid" class="tooltip">Octadecenoic acid</a> </td><td class="right">0.007&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;<a href="#" data-tooltip="Polyunsaturated fatty acids" class="tooltip">Polyunsaturated fatty acids</a> </td><td class="right">0.051&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosahexaenoic n-3 acid (DHA)" class="tooltip">Docosahexaenoic n-3 acid (DHA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Docosapentaenoic n-3 acid (DPA)" class="tooltip">Docosapentaenoic n-3 acid (DPA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosapentaenoic n-3 acid (EPA)" class="tooltip">Eicosapentaenoic n-3 acid (EPA)</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Eicosatetraenoic acid" class="tooltip">Eicosatetraenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecadienoic acid" class="tooltip">Octadecadienoic acid</a> </td><td class="right">0.043&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecatetraenoic acid" class="tooltip">Octadecatetraenoic acid</a> </td><td class="right">0.000&nbsp;g</td><td></td></tr><tr><td class="left">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" data-tooltip="Octadecatrienoic acid" class="tooltip">Octadecatrienoic acid</a> </td><td class="right">0.009&nbsp;g</td><td></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Sterols</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Cholesterol" class="tooltip">Cholesterol</a> </td><td class="right">0.00&nbsp;mg</td><td><a href="/daily_values.php#Cholesterol" target="_blank">0&nbsp;%</a></td></tr></tbody></table><br>
<table class="center wide cellpadding3 nutrient results"><tbody><tr><th colspan="3">Other</th></tr><tr><th class="left">Nutrient</th><th class="right">Amount</th> <th>DV</th></tr><tr><td class="left"><a href="#" data-tooltip="Alcohol, ethyl" class="tooltip">Alcohol, ethyl</a> </td><td class="right">0.0&nbsp;g</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Caffeine" class="tooltip">Caffeine</a> </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Theobromine" class="tooltip">Theobromine</a> </td><td class="right">0.00&nbsp;mg</td><td></td></tr><tr><td class="left"><a href="#" data-tooltip="Water" class="tooltip">Water</a> </td><td class="right">85.56&nbsp;g</td><td></td></tr></tbody></table><br>
</td></tr>

<tr><td colspan="3"><h3>Foods related to apple, raw</h3></td></tr><tr><td class="related"><div><a href="/Apple%2C_baked_63101310_nutritional_value.html" title="Apple, baked">Apple, baked</a></div></td><td>&nbsp;</td><td class="related"><div><a href="/Apple%2C_candied_63401060_nutritional_value.html" title="Apple, candied">Apple, candied</a></div></td></tr><tr><td class="related"><div><a href="/Apple_pie_filling_63101210_nutritional_value.html" title="Apple pie filling">Apple pie filling</a></div></td><td>&nbsp;</td><td></td></tr><tr><td colspan="3" class="desc"><strong>Apple, raw</strong> contains 52 calories per 100 g serving. This serving contains 0.2 g of fat, 0.3 g of protein and 14 g of carbohydrate. The latter is 10 g sugar and 2.4 g of dietary fiber, the rest is complex carbohydrate. Apple, raw contains 0 g of saturated fat and 0 mg of cholesterol per serving. 100 g of Apple, raw contains 3.00 mcg vitamin A, 4.6 mg vitamin C, 0.00 mcg vitamin D as well as 0.12 mg of iron, 6.00 mg of calcium, 107 mg of potassium. Apple, raw belong to 'Apples' food category. </td></tr><tr><td colspan="3"><table class="wide results"><tbody><tr><th colspan="2">Food properties</th></tr><tr><td>Source</td><td><a href="/categories_in_food_and_nutrient_database_foods.html">USDA Food and nutrient database</a></td></tr><tr><td>Category</td><td><a href="/foods_in_Apples.html">Apples </a></td></tr></tbody></table></td></tr></tbody></table></td>`;

function extractBasicMacrosFromNutritionData(nutritionData) {
	function convertToGrams(val, unit) {
		if(isNaN(val) || val == -1) {
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

		return val;
	}
	let basicNutritionData = {};
	for(let i = 0; i < nutritionData.length; i++) {
		let key = '';
		let val = -1;
		let unit = 'g';
		let macro = '';
		if(nutritionData[i] && nutritionData[i]["title"]) {
			switch (nutritionData[i]["title"]) {
				case 'Calorie Information':
					macro = 'calories'

					for (let entry in nutritionData[i]["raw_nutritional_data"]) {
						val = -1;
						key = '';
						if (typeof basicNutritionData["calories"] == 'undefined') {
							basicNutritionData["calories"] = {};
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["name"] ==
							'Calories') {
							key = 'total_calories'
							val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}

						if (key != '') {
							val = convertToGrams(val, unit);
							basicNutritionData[macro][key] = val;
						}
					}
					break;
				case 'Carbohydrates':
					macro = 'carbohydrates'
					for (let entry in nutritionData[i]["raw_nutritional_data"]) {
						val = -1;
						key = '';
						if (typeof basicNutritionData[macro] == 'undefined') {
							basicNutritionData[macro] = {};
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						switch (nutritionData[i]["raw_nutritional_data"][entry]["name"]) {
							case 'Total Carbohydrate':
								key = 'total_carbohydrates'
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Dietary Fiber':
								key = "fiber";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Sugars':
								basicNutritionData[macro]["sugars"] = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							default:
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						if (key != '') {
							val = convertToGrams(val, unit);
							basicNutritionData[macro][key] = val;
						}
					}
				case 'Fats & Fatty Acids':
					macro = 'fats';
					for (let entry in nutritionData[i]["raw_nutritional_data"]) {
						val = -1;
						key = '';

						if (typeof basicNutritionData[macro] == 'undefined') {
							basicNutritionData[macro] = {};
						}

						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						switch (nutritionData[i]["raw_nutritional_data"][entry]["name"]) {
							case 'Total Fat':
								key = 'total_fats';
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Saturated Fat':
								key = 'saturates';
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Monounsaturated Fat':
								key = "monounsaturated";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Polyunsaturated Fat':
								key = "polyunsaturated";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Total trans fatty acids':
								key = "transfats";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Total Omega-3 fatty acids':
								key = "omega3";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							case 'Total Omega-6 fatty acids':
								key = "omega6";
								val = nutritionData[i]["raw_nutritional_data"][entry]["value"];
								break;
							default:
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						if (key != '') {
							val = convertToGrams(val, unit);
							basicNutritionData[macro][key] = val;
						}
					}
					break;
				case 'Protein & Amino Acids':
					macro = 'protein';
					for (let entry in nutritionData[i]["raw_nutritional_data"]) {
						val = -1;
						key = '';
						if (typeof basicNutritionData[macro] == 'undefined') {
							basicNutritionData[macro] = {};
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["name"] ==
							'Protein') {
							key = 'total_protein';
							val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						if (key != '') {
							val = convertToGrams(val, unit);
							basicNutritionData[macro][key] = val;
						}
					}
					break;
				case 'Minerals':
					macro = 'minerals';
					for (let entry in nutritionData[i]["raw_nutritional_data"]) {
						val = -1;
						key = '';
						if (typeof basicNutritionData[macro] == 'undefined') {
							basicNutritionData[macro] = {};
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["name"] ==
							'Sodium') {
							key = 'salt';
							val = nutritionData[i]["raw_nutritional_data"][entry]["value"]
						}
						if (nutritionData[i]["raw_nutritional_data"][entry]["units"]) {
							unit = nutritionData[i]["raw_nutritional_data"][entry]["units"];
						}
						if (key != '') {
							val = convertToGrams(val, unit);
							basicNutritionData[macro][key] = val;
						}
					}
					break;
				default:
			}
		}
	}
	return basicNutritionData;
}



const regex =/(nutrient results([\W\S]*?)<br>|id="calories">([\d]+)<\/td>)/gim;
var firstPass = [];
let sectionCount = 0;
let dataCount = -1;
let key = null;
let val = '';
let ar = [];
let title = '';
let m;

while ((m = regex.exec(str)) !== null) {
	// This is necessary to avoid infinite loops with zero-width matches
	if (m.index === regex.lastIndex) {
		regex.lastIndex++;
	}

	m.forEach((match, groupIndex) => {
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
			firstPass[sectionCount]["raw_nutritional_data"] = [{ name: 'Calories', value : match, daily_value: '', units: 'kcal' }];
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
										val = 'Total Carbohydrate';
										break;
									case 'Fiber':
										val = 'Dietary Fiber';
										break;
									case 'Fat':
										val = 'Total Fat';
										break;
									default:
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
								key = 'value';
								val = ar[0];
								try {
									if (typeof firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] ==
										'undefined') {
										firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`] = {};
									}

									firstPass[sectionCount]["raw_nutritional_data"][`${dataCount}`][`${key}`] = val;
								} catch (err) {
								}

								key = 'units';
								val = ar[1];
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
console.log(utils.inspect(firstPass, {maxArrayLength: null, depth: null}));

console.log(utils.inspect(extractBasicMacrosFromNutritionData(firstPass), {maxArrayLength: null, depth: null}));
