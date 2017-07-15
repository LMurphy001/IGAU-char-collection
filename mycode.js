
if (typeof LAM == "undefined"){
var LAM = (function() {
	/*jshint asi:true*/

	function nowString()
	{
		return (new Date()).toString()
	}

	function $g(id) {
		return document.getElementById(id)
	}

	function gelbi(elementId) {
		var el = $g(elementId)
		if (el) {} 
		else {
			console.log("MISSING ELEMENT: \"" + elementId + "\"")
		}
		return el
	}

	function $clog(msg){console.log(msg)}

	function $cerror(errmsg){console.error(errmsg)}

	function $cobj(obj){
		if (typeof obj == "object") 
			console.log("%o", obj)
		else if(typeof obj == "function")
			$clog("(function)")
		else
			$clog(obj)
	}

	function isNumeric(n) {
		if (typeof n == "string")
			n = n.replace(/,/g, "")
		return !isNaN(parseFloat(n)) && isFinite(n)
	}
	function parseNumber(val) { // returns the decimal part too
		var  f
		try{
			//ignore comma separation:
			if(typeof val == "string")
				val = val.replace(/,/g, "")
			
			// try to convert comma-less variable to a floating number:
			f = parseFloat(val)
			// if is a number and is not infinity, then return the floating number
			if(!isNaN(f) && isFinite(f))
				return f
			else
				return Number.isNaN
			//if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/ .test(v))
			//	return Number(v)
		}
		catch(e){
			$cerror(e)
			$cerror("parseNumber, type of val: "+typeof val)
			if (typeof val == "object")
				$cobj(val)
			else
				$cerror("val: " + val)
		}
		return NaN
	}

	function parseInteger(val) { // returns only the integer part, rounding up or down
		var num = parseNumber(val)
		if (isNaN(num))
			return num
		else
			return Math.round(parseNumber(val))
	}
	function fraction(val) { // returns only the fractional part
		return parseNumber(val) - parseInteger(val)
	}
	function isInteger(val){
		var v1,v2
		if (!isNumeric(val))
			return false
		v1 = parseNumber(val)
		v2 = parseInteger(val)
		return Math.abs(v2-v1) === 0
	}

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Any element belonging to class 'oldc' - change it to belong to class 'newc':
	function toggle_class_name(oldc, newc) {
		var els = [].slice.apply(document.getElementsByClassName(oldc));
		var re = new RegExp(" *" + oldc, "g"); //var re = new RegExp(" *\b" + oldc + "\b", "g");
		for (var i = 0; i < els.length; i++) {
			els[i].className = els[i].className.replace(re, newc);
		}
	}

	function getPairedElementName(buttonElement) {
		var buttonId = buttonElement.id;
		var cutLen = "-expand-button".length;
		var buttonIdLen = buttonId.length;
		var expansionId = buttonId.substring(0, buttonIdLen-cutLen ) + "-expansion";
		return expansionId;
	}

	function onToggleShow(elementName, displayType) {
		var el = gelbi(elementName);
		if ((el.style.display == "none") || (el.style.display === "") ) {
			el.style.display = displayType; // e.g. block or inline
			if(typeof LogUsage != 'undefined')
				if(typeof LogUsage.LogKeyValue == 'function')
					LogUsage.LogKeyValue(elementName, "display:" + displayType);
		}
		else {
			el.style.display = "none";
			if(typeof LogUsage != 'undefined')
				if(typeof LogUsage.LogKeyValue == 'function')
					LogUsage.LogKeyValue(elementName, "display:none");
		}
	}

	function toggleExpansion(buttonElement) {
		if (buttonElement.value == "Expand") {
			buttonElement.value = "Collapse";
		}
		else { /* value is not Expand */
			buttonElement.value = "Expand";
		}
		onToggleShow(getPairedElementName(buttonElement), "inline");
	}
	
	if (!String.prototype.replaceSpcs) {
		String.prototype.replaceSpcs = function(replaceWith) {
		'use strict';
		return this.replace(/ /g, replaceWith)
	} }

	if (!String.prototype.replace_) {
		String.prototype.replace_ = function(replaceWith) {
		'use strict';
		return this.replace(/_/g, replaceWith)
	} }

	function extend(destination,source) { // merge source into destination and return destination
		for (var property in source)
		{
			if (source.hasOwnProperty(property))
			{
				if (typeof destination[property] != 'undefined')
				{
					// destination[property] already exists:
					if (typeof destination[property] == "object" && typeof source[property] == "object")
					{
						// both are objects, so do recursion:
						extend(destination[property], source[property])
					}
					else
					{
						if (destination[property] !== source[property])
						{
							console.log("Warning: destination[%s] is already set to %s - overwriting with %s", 
								property, typeof destination[property], typeof source[property])
							destination[property] = source[property]
						}
					}
				}
				else 
					destination[property] = source[property]
			}
		}
		return destination;
	}

	return { 
		nowString:nowString, 
		$g:$g, 
		gelbi:gelbi, 
		$clog:$clog, 
		$cerror:$cerror,
		$cobj:$cobj,
		parseNumber:parseNumber,
		parseInteger:parseInteger,
		isInteger:isInteger,
		toggle_class_name:toggle_class_name,
		numberWithCommas:numberWithCommas,
		toggleExpansion:toggleExpansion,
		extend: extend,
		isNumeric: isNumeric
	}
})();
}

function showMessage(msg, textAreaID) {
	/*jshint asi:true*/
	var el
	if((typeof textAreaID == "string") && (textAreaID!=='') )
		el = document.querySelector('#' + textAreaID)
	else
		el = document.querySelector('#taMsgs')
	if (el) {
		el.value += "\n" + msg
		el.scrollTop = el.scrollHeight;
	}
	else if (typeof Popup != 'undefined') {
		Popup.show(null,null,null,
			{
				'content':msg + "<br><br>Close: Click outside the box",
				'width':250,
				'height':120,
				'style':
				{
					'border':'1px solid indigo',
					'backgroundColor':'#fffacd',
					'color':'indigo'
				}
			} )
	}
	else
		console.log(msg)
}
if(typeof Ajax=='undefined'){
var Ajax = (function() {
	var _doAjax = true;
	
	function doAjax(flag) {
		_doAjax = flag;
	}

	function CreateRequestObj () {
		var doActiveX = (window.ActiveXObject && location.protocol === "file:");
		if (window.XMLHttpRequest && !doActiveX) {
			return new XMLHttpRequest();
		}
		else {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		}
	}
	
	function httpRequestDoNothing(){
		switch (this.readyState) {
			case 4:
				console.log((new Date()).toString()+ " RESPONSE: [" + this.responseText + "]");
				// prevent memory leaks
				this.onreadystatechange = null;
				break;
		}
	}

	function AjaxSend(url, method, data, readyStateChangeHandler){ // use for POST not GET
		if (!_doAjax) return;
		
        var httpRequest = CreateRequestObj ();
		try {
			if(typeof readyStateChangeHandler == "undefined")
				httpRequest.onreadystatechange = httpRequestDoNothing;
			else
				httpRequest.onreadystatechange = readyStateChangeHandler;
			httpRequest.open (method, url, true); // asynchronous
			httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			httpRequest.send(data);
		}
		catch (ex) {
			console.log("AjaxSend: Cannot connect to the server. " + ex.message);
			return;
		}
		return httpRequest;
	}
	
	/*function PostAndGetTextFile(file_ext, text) {
		if (!_doAjax) return;
		
		var data="";
		if (typeof GlobalRandomPageId != "undefined")
			data += encodeURIComponent("sessionid") + "=" + encodeURIComponent(GlobalRandomPageId) + "&";
		
		data += encodeURIComponent("fileextension") + "=" + encodeURIComponent(file_ext);
		data += "&" + encodeURIComponent("text") + "=" + encodeURIComponent(text);

		var httpRequest = CreateRequestObj();
		// try..catch is required if working offline
		try {
			httpRequest.onreadystatechange =
				function () { 
					switch (httpRequest.readyState) {
						case 4:
							console.log((new Date()).toString()+ " RESPONSE: [" + httpRequest.responseText + "]");
							var resp = httpRequest.responseText;
							var index = resp.indexOf('\r');
							if (index >= 0)
								resp = resp.substring(0, index);
							index = resp.indexOf('\n');
							if (index >= 0)
								resp = resp.substr(0, index);
							if(typeof LogUsage != "undefined" && typeof LogUsage.LogKeyValue != "undefined")
								LogUsage.LogKeyValue("Open", resp);
							window.open(resp);
							// prevent memory leaks
							httpRequest.onreadystatechange = null;
							break;
					}//end switch
				};//end assignment of onreadystatechange event handler
				
			httpRequest.open('post', 'savetext.php', true); 
			// open() 3rd param: false=synchronous, true=asynchronous. 
			// If I use asynchronous, Firefox asks for popup confirmation. 
			// If I use synchronous,  Firefox warns about the impact on the user experience.
			httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			httpRequest.send(data);
		}
		catch (e) {
			console.log("Cannot connect to the server");
			return;
		}
	}//end function PostAndGetTextFile()*/
		
	return { doAjax:doAjax, AjaxSend:AjaxSend};//, PostAndGetTextFile: PostAndGetTextFile };
})();
}
else{
	console.log("Ajax is already defined");
}
/* file characters.js: */
var Characters = (function() {
	/*jshint asi:true*/

function maxAug() { return 300; }

function idxTitle() { return 0; }
function idxName() { return 1; }
function idxColor() { return 2; }
function idxStoreDamage() { return 3; }
function idxStoreHealth() { return 4; }
function idxCost() { return 5; }
function idxAbbr() { return 6; }

var private_arrCharacterCardBasics =
[
    [ "-", "Aquaman", "Gold", 950, 1050, 220, "AM" ],
    [ "Injustice 2", "Aquaman", "Gold", 1400, 1400, 479, "I2AM" ],
    [ "Regime", "Aquaman", "Gold", 800, 1050, 192, "RAM" ],
    [ "-", "Ares", "Gold", 1200, 900, 241, "Ares" ],
    [ "-", "Bane", "Gold", 650, 1000, 157, "Bane" ],
    [ "Arkham Origins", "Bane", "Gold", 1100, 1100, 262, "AOB"],
    [ "Luchador", "Bane", "Gold", 1100, 800, 201, "LB"],
    [ "-", "Batgirl", "Gold", 850, 1000, 192, "BG" ],
    [ "Cassandra Cain", "Batgirl", "Gold", 1150, 950, 241, "CCBG" ],
    [ "-", "Batman", "Gold", 700, 1100, 182, "BM" ],
    [ "Arkham Knight", "Batman", "Gold", 1200, 1300, 395, "AKBM" ],
    [ "Arkham Origins", "Batman", "Gold", 1000, 1150, 375, "AOBM"],
    [ "Beyond", "Batman", "Gold", 850, 900, 174, "BBM"],
    [ "Beyond Animated", "Batman", "Gold", 1100, 1050, 252, "ABB" ],
    [ "Blackest Night", "Batman", "Gold", 1250, 1000, 400, "BNBM" ],
    [ "Dawn of Justice", "Batman", "Gold", 1300, 1200, 400, "DOJBM" ],
    [ "Insurgency", "Batman", "Gold", 750, 1050, 182, "IBM" ],
    [ "Red Son", "Batman", "Gold", 900, 1000, 201, "RSBM" ],
    [ "Kahndaq", "Black Adam", "Gold", 1100, 1200, 341, "KBA" ],
    [ "Regime", "Black Adam", "Gold", 750, 750, 133, "RBA" ],
    [ "Ame-Comi", "Catwoman", "Gold", 1200, 1400, 416, "ACCW" ],
    [ "Arkham Knight", "Catwoman", "Gold", 1300, 1000, 351, "AKCW"],
    [ "Batman Returns", "Catwoman", "Gold", 950, 850, 182, "BRCW" ],
    [ "Teen Titans", "Cyborg", "Gold", 700, 1000, 165, "TTCY" ],
    [ "-", "Darkseid", "Gold", 1050, 1200, 274, "DKSD" ],
    [ "Apokolips", "Darkseid", "Gold", 1100, 1400, 333, "ADKSD" ],
	[ "Suicide Squad", "Deadshot", "Gold", 1450, 1250, 495, "SSQDS" ],
    [ "Arkham Origins", "Deathstroke", "Gold", 850, 1100, 211, "AODS"],
    [ "Red Son", "Deathstroke", "Gold", 950, 900, 192, "RSDS" ],
    [ "-", "Doomsday", "Gold", 850, 1050, 201, "DD" ],
    [ "Blackest Night", "Doomsday", "Gold", 1050, 1400, 350, "BNDD" ],
    [ "Containment", "Doomsday", "Gold", 700, 600, 220, "CSDD" ],
    [ "Man of Steel", "General Zod", "Gold", 800, 1200, 220, "MOSZOD" ],
    [ "Arrow", "Green Arrow", "Gold", 900, 950, 192, "AGA" ],
    [ "John Stewart", "Green Lantern", "Gold", 750, 950, 165, "JSGL" ],
    [ "Red Son", "Green Lantern", "Gold", 850, 1150, 220, "RSGL"],
    [ "Red Lantern", "Hal Jordan", "Gold", 950, 1400, 325, "RLHJ" ],
    [ "Animated", "Harley Quinn", "Gold", 700, 900, 148, "ANHQ" ],
    [ "Arkham", "Harley Quinn", "Gold", 900, 950, 192, "ARHQ" ],
    [ "Arkham Knight", "Harley Quinn", "Gold", 1100, 1000, 285, "AKHQ" ],
	[ "Suicide Squad", "Harley Quinn", "Gold", 1250, 1450, 491, "SSQHQ "],
    [ "-", "Hawkgirl", "Gold", 900, 950, 192, "HG" ],
    [ "Blackest Night", "Hawkgirl", "Gold", 1240, 1360, 426, "BNHG" ],
    [ "Regime", "Hawkgirl", "Gold", 1100, 1000, 241, "RHG" ],
    [ "-", "Killer Frost", "Gold", 850, 1200, 231, "KFP" ],
    [ "Regime", "Killer Frost", "Gold", 700, 1250, 211, "RKF" ],
    [ "Krypto", "Lex Luthor", "Gold", 800, 950, 174, "KLL" ],
    [ "-", "Lobo", "Gold", 850, 1000, 182, "LOBO" ],
    [ "Bounty Hunter", "Lobo", "Gold", 1250, 950, 262, "BHL" ],
    [ "-", "Martian Manhunter", "Gold", 750, 1200, 211, "MMH" ],
    [ "Blackest Night", "Martian Manhunter", "Gold", 1000, 1300, 330, "BNMMH" ],
    [ "New 52", "Nightwing", "Gold", 850, 950, 182, "N52NW" ],
    [ "-", "Raven", "Gold", 1050, 1000, 231, "RP" ],
    [ "Regime", "Raven", "Gold", 950, 950, 201, "RR" ],
    [ "Teen Titans", "Raven", "Gold", 1400, 1200, 426, "TTR" ],
    [ "-", "Reverse Flash", "Gold", 1000, 1000, 300, "RVF" ],
    [ "Mortal Kombat", "Scorpion", "Gold", 950, 850, 182, "MKS" ],
    [ "Mortal Kombat X", "Scorpion", "Gold", 1200, 1000, 262, "MKXS" ],
    [ "-", "Shazam", "Gold", 950, 1350, 395, "SHAZAM" ],
    [ "Antimatter", "Sinestro", "Gold", 1200, 1200, 369, "AMS"],
    [ "Green Lantern", "Sinestro", "Gold", 900, 950, 192, "GLS" ],
    [ "Boss", "Solomon Grundy", "Gold", 550, 1250, 182, "BSG" ],
	[ "Earth 2", "Solomon Grundy", "Gold", 1100, 1300, 335, "E2SG"],
    [ "Red Son", "Solomon Grundy", "Gold", 800, 900, 165, "RSSG" ],
    [ "-", "Static", "Gold", 1050, 1050, 241, "STATIC" ],
    [ "-", "Superman", "Gold", 800, 1200, 220, "SM" ],
    [ "Dawn of Justice", "Superman", "Gold", 1300, 1300, 430, "DOJSM"], 
    [ "Godfall", "Superman", "Gold", 1000, 1250, 274, "GFSM" ],
    [ "Injustice 2", "Superman", "Gold", 1300, 1500, 491, "I2SM"],
    [ "Man of Steel", "Superman", "Gold", 800, 1200, 220, "MOSSM" ],
    [ "Prison", "Superman", "Gold", 700, 800, 133, "PSM" ],
    [ "Red Son", "Superman", "Gold", 1000, 1100, 241, "RSSM" ],
    [ "Regime", "Superman", "Gold", 900, 1100, 220, "RSM" ],
    [ "Arkham Knight", "The Arkham Knight", "Gold", 1100, 1200, 310, "AKAK" ],
    [ "Elseworld", "The Flash", "Gold", 750, 750, 133, "EWF" ],
    [ "Metahuman", "The Flash", "Gold", 1200, 1200, 365, "MHF" ],
    [ "Arkham Origins", "The Joker", "Gold", 1150, 850, 220, "AOJ" ],
    [ "Insurgency", "The Joker", "Gold", 750, 850, 148, "IJ" ],
	[ "Suicide Squad", "The Joker", "Gold", 1350, 1350, 493, "SSQJO"],
	[ "Suicide Squad", "The Joker Unhinged", "Gold", 1400, 1300, 496, "SSQJU"],
    [ "The Killing Joke", "The Joker", "Gold", 950, 750, 60, "KJJ" ],
    [ "600", "Wonder Woman", "Gold", 800, 1100, 201, "600WW" ],
	[ "Dawn of Justice", "Wonder Woman", "Gold", 1100, 1400, 395, "DOJWW" ],
    [ "Justice League", "Wonder Woman", "Gold", 1300, 1200, 370, "JLWW" ],
    [ "Red Son", "Wonder Woman", "Gold", 900, 1000, 201, "RSWW"],
    [ "Regime", "Wonder Woman", "Gold", 750, 1050, 182, "RWW" ],
    [ "-", "Zatanna", "Gold", 900, 1150, 231, "ZAT" ],
    [ "-", "Zod", "Gold", 800, 1200, 220, "ZOD" ],

    [ "Knightfall", "Bane", "Silver", 470, 420, 50, "KFB" ],
    [ "Regime", "Bane", "Silver", 460, 400, 47, "RBANE" ],
    [ "-", "Black Adam", "Silver", 500, 400, 51, "BA" ],
    [ "-", "Catwoman", "Silver", 400, 300, 35, "CW" ],
    [ "Regime", "Cyborg", "Silver", 370, 450, 44, "RCY" ],
    [ "-", "Deathstroke", "Silver", 460, 400, 47, "DS" ],
    [ "Regime", "Doomsday", "Silver", 400, 500, 51, "RDD" ],
    [ "-", "Green Arrow", "Silver", 380, 420, 42, "GA" ],
    [ "Regime", "Green Lantern", "Silver", 450, 400, 47, "RGL" ],
    [ "Insurgency", "Harley Quinn", "Silver", 380, 320, 35, "IHQ" ],
    [ "Insurgency", "Lex Luthor", "Silver", 420, 420, 46, "ILL" ],
    [ "Regime", "Nightwing", "Silver", 420, 380, 42, "RNW" ],
    [ "Regime", "Sinestro", "Silver", 450, 400, 47, "RSIN" ],
    [ "-", "Solomon Grundy", "Silver", 350, 480, 45, "SG" ],
    [ "Regime", "The Flash", "Silver", 480, 370, 47, "RF" ],
    [ "-", "The Joker", "Silver", 470, 400, 48, "JOK" ],
    [ "-", "Wonder Woman", "Silver", 420, 460, 49, "WW" ],

    [ "Regime", "Catwoman", "Bronze", 220, 180, 8, "RCW" ],
    [ "-", "Cyborg", "Bronze", 190, 250, 10, "CY" ],
    [ "Insurgency", "Deathstroke", "Bronze", 270, 200, 12, "IDS" ],
    [ "Insurgency", "Green Arrow", "Bronze", 190, 230, 9, "IGA" ],
    [ "-", "Green Lantern", "Bronze", 260, 200, 11, "GL" ],
    [ "New 52", "Green Lantern", "Bronze", 270, 210, 12, "N52GL" ],
    [ "-", "Harley Quinn", "Bronze", 200, 200, 8, "HQ" ],
    [ "-", "Lex Luthor", "Bronze", 220, 220, 10, "LL" ],
    [ "-", "Nightwing", "Bronze", 210, 210, 9, "NW" ],
    [ "-", "Sinestro", "Bronze", 260, 200, 11, "SIN" ],
    [ "Regime", "Solomon Grundy", "Bronze", 200, 260, 11, "RSG" ],
    [ "-", "The Flash", "Bronze", 280, 180, 11, "TF" ],
    [ "New 52", "The Flash", "Bronze", 280, 180, 11, "N52F" ]
];


/*function getIndexOfCharacterCard(CardName, CardTitle) {
	console.log("from %s, getIdx of %s,%s", arguments.callee.caller.name.toString(), CardName, CardTitle)
	var i, len;
	len= private_arrCharacterCardBasics.length
	for (i = 0; i < len; i++) {
	    var arrChar = private_arrCharacterCardBasics[i];
	    if ( (arrChar[idxTitle()] === CardTitle) && (arrChar[idxName()] === CardName) ) {
			return i; }
	}
	return -1;
}*/


/*function numCharacters() {
	console.log("from %s, numCharacter()", arguments.callee.caller.name.toString())
	return private_arrCharacterCardBasics.length;
}*/

/*function getCharacterByIndex(index) {
	console.log("from %s, getCharByIdx %d", arguments.callee.caller.name.toString(), index)
	var arr = private_arrCharacterCardBasics[index];
	return arr.slice(); /* slice prevents client code from modifying the character's array data* /
}*/


	/*function getCharacterByName(charName, charTitle){
		console.log("from %s, getCharByName %s,%s", arguments.callee.caller.name.toString(), charName, charTitle)
		var idx = getIndexOfCharacterCard(charName, charTitle)
		if(idx>=0)
			return private_arrCharacterCardBasics[idx]
			//return getCharacterByIndex(idx)
		return null
	}*/

	function getAllCharacters(){
		//console.log("from %s, getAllCharacters()", arguments.callee.caller.name.toString())
		var arr=[],len=private_arrCharacterCardBasics.length
		for(var i=0; i<len; ++i){ 
			arr.push(private_arrCharacterCardBasics[i]) // getCharacterByIndex(i))
		}
		return arr;
	}

	return {
		maxAug: maxAug,
		idxTitle: idxTitle,
		idxName: idxName,
		idxColor: idxColor,
		idxStoreDamage: idxStoreDamage,
		idxStoreHealth: idxStoreHealth,
		idxCost: idxCost,
		idxAbbr: idxAbbr,
		
		//numCharacters: numCharacters,
		//getCharacterByIndex: getCharacterByIndex,
		//getIndexOfCharacterCard: getIndexOfCharacterCard,
		//getCharacterByName: getCharacterByName,
		getAllCharacters: getAllCharacters,
	};
})();
/* file doCalcRank.js:*/
var DoCalcRank = (function() {
	var APIList = {}; /* different versions of the API of this module*/
	function getAPIByVersion(versionStr) {
		return APIList[versionStr];
	}

function doCalcRank(Rank, inputs) {
  var LevelsForRank = []; /* local version of array variable*/
  var RankDamageBonusMultiplier = 0;
  var RankHealthBonusMultiplier = 0;
	
  if (inputs.characterArr[Characters.idxColor()]=== "Gold")
  {
    if (Rank === 0) RankDamageBonusMultiplier = 1.0;
    else if (Rank === 1) RankDamageBonusMultiplier = 1.5;
    else if (Rank === 2) RankDamageBonusMultiplier = 2.0;
    else if (Rank === 3) RankDamageBonusMultiplier = 3.0;
    else if (Rank === 4) RankDamageBonusMultiplier = 3.5;
    else if (Rank === 5) RankDamageBonusMultiplier = 4.0;
    else if (Rank === 6) RankDamageBonusMultiplier = 4.5;
    else if (Rank === 7) RankDamageBonusMultiplier = 5.0;
    else if (Rank === 8) RankDamageBonusMultiplier = 5.5;
    else if (Rank === 9) RankDamageBonusMultiplier = 6.0;
    else if (Rank === 10) RankDamageBonusMultiplier = 6.5;

    if (Rank === 4) /* as of version 2.6, the health multiplier is not the same as the damage multiplier, for Gold IV cards */
        RankHealthBonusMultiplier = RankDamageBonusMultiplier + 0.1;
    else
        RankHealthBonusMultiplier = RankDamageBonusMultiplier;
  }

  else if (inputs.characterArr[Characters.idxColor()]=== "Silver")
  {
	RankDamageBonusMultiplier = 1 + (Rank * 0.4);
	RankHealthBonusMultiplier = RankDamageBonusMultiplier;
  }

  else if (inputs.characterArr[Characters.idxColor()]=== "Bronze")
  {
    RankDamageBonusMultiplier = 1 + (Rank * 0.2);
    RankHealthBonusMultiplier = RankDamageBonusMultiplier;
  }

  var HealthRate = 0.2;
  var DamRateThruLvl10 = 0.20;
  var DamRateThruLvl30 = 0.10;
  var DamRateThruLvl50 = 0.05;

  /* initialize the array with zero'd records: */
  var augIdx = 0;
  for (var Lvl = 1; Lvl <= inputs.EndXPLevel; Lvl++) {
    var thisLevel = {
      XPLevel: 0,
      arrDamageNoBonus: [],
      arrHealthNoBonus: [],
      arrDamageWithBonus: [],
      arrHealthWithBonus: [],
      arrMeleeDamage: []
    };
    for (augIdx = 0; augIdx <= inputs.EndAugmentationDamage; augIdx++) {
		thisLevel.arrDamageNoBonus[augIdx] = 0;
		thisLevel.arrDamageWithBonus[augIdx] = 0;
		thisLevel.arrMeleeDamage[augIdx] = 0;
	}
    for (augIdx = 0; augIdx <= inputs.EndAugmentationHealth; augIdx++) {
		thisLevel.arrHealthNoBonus[augIdx] =  0;
		thisLevel.arrHealthWithBonus[augIdx] = 0;
	}
    LevelsForRank[Lvl - 1] = thisLevel;
  }

  var level = LevelsForRank[0];
  /* Initialize the first xp level: */
  level.XPLevel = 1;
  for (augIdx = inputs.StartAugmentationDamage; augIdx <= inputs.EndAugmentationDamage; augIdx++) {
      level.arrDamageNoBonus[augIdx] = ((inputs.characterArr[Characters.idxStoreDamage()] + augIdx) * RankDamageBonusMultiplier);
      level.arrDamageWithBonus[augIdx] = (level.arrDamageNoBonus[augIdx] * inputs.DamageBonusMultiplier);
      level.arrMeleeDamage[augIdx] = calcMeleeDamage(
		  level.arrDamageWithBonus[augIdx],
          inputs.characterArr[Characters.idxName()],
          inputs.characterArr[Characters.idxTitle()]);
  }
  for (augIdx = inputs.StartAugmentationHealth; augIdx <= inputs.EndAugmentationHealth; augIdx++) {
      level.arrHealthNoBonus[augIdx] = ((inputs.characterArr[Characters.idxStoreHealth()] + augIdx) * RankHealthBonusMultiplier);
      level.arrHealthWithBonus[augIdx] = (level.arrHealthNoBonus[augIdx] * inputs.HealthBonusMultiplier);
  }
  /* Calculate the rest of the xp levels: */
  for (var Lev = 2; Lev <= inputs.EndXPLevel; Lev++) {
    var idx = Lev - 1;
    var prevIdx = Lev - 2;

    var DamRate;
    if (Lev <= 10) DamRate = DamRateThruLvl10;
    else if (Lev <= 30) DamRate = DamRateThruLvl30;
    else DamRate = DamRateThruLvl50;

    level = LevelsForRank[idx];
    level.XPLevel = Lev;

    for (augIdx = inputs.StartAugmentationDamage; augIdx <= inputs.EndAugmentationDamage; augIdx++) {
        level.arrDamageNoBonus[augIdx] =
        	LevelsForRank[prevIdx].arrDamageNoBonus[augIdx] + (DamRate * (inputs.characterArr[Characters.idxStoreDamage()] + augIdx) * RankDamageBonusMultiplier);

        level.arrDamageWithBonus[augIdx] = (level.arrDamageNoBonus[augIdx] * inputs.DamageBonusMultiplier);

        level.arrMeleeDamage[augIdx] = calcMeleeDamage(
			level.arrDamageWithBonus[augIdx],
			inputs.characterArr[Characters.idxName()],
			inputs.characterArr[Characters.idxTitle()]);
    }

    for (augIdx = inputs.StartAugmentationHealth; augIdx <= inputs.EndAugmentationHealth; augIdx++) {
        level.arrHealthNoBonus[augIdx] =
        	LevelsForRank[prevIdx].arrHealthNoBonus[augIdx] + (HealthRate * (inputs.characterArr[Characters.idxStoreHealth()] + augIdx) * RankHealthBonusMultiplier);

        level.arrHealthWithBonus[augIdx] = (level.arrHealthNoBonus[augIdx] * inputs.HealthBonusMultiplier);
    }
  }
  return LevelsForRank; /* return local version of array variable */
} /* DoCalcRank */

function calcMeleeDamage(damage, CharName, CharTitle)
{
  var LightHit = damage * 0.02;
  var KnockdownHit = LightHit * 1.5;
  var HeavyHit1 = damage * 0.04;
  var HeavyHit2 = HeavyHit1;

  var loCharName = CharName.toLowerCase();
  var loCharTitle = CharTitle.toLowerCase();

  /* Exceptions: */
  if (loCharName === "shazam" || ( (loCharName === "harley quinn") && (loCharTitle !== "arkham knight") ) ) {
	HeavyHit1 = damage * 0.05;
    HeavyHit2 = damage * 0.07;
  }
  else if (loCharName === "doomsday" && (loCharTitle === "regime" || loCharTitle === "-")) {
	HeavyHit1 = damage * 0.05;
    HeavyHit2 = damage * 0.07;
  }

  var MeleeDamage = {
        Light: LightHit,
        Knockdown: KnockdownHit,
        Heavy1: HeavyHit1,
        Heavy2: HeavyHit2
    };
  return MeleeDamage;
}

function findAppliedAugLevel(actualVal, arrWithBonus, which) {
	var augIdx;
	var delta = 0;
	var smallestDelta = 1000000;
	var closestIdx = 0;
	var closestVal = 0;
	var str = "";
	
	for (augIdx = 0; augIdx < arrWithBonus.length; augIdx+=2) {
		delta = actualVal - arrWithBonus[augIdx];
		delta = Math.abs(delta);
		if (delta < smallestDelta) {
			smallestDelta = delta;
			closestIdx = augIdx;
			closestVal = arrWithBonus[augIdx];
		}
		if (delta <= 2) {
			return { found: true, augmentationLevel : augIdx };			
		}
	}
	str = "<span class='micsc_error_msg'>Please fix '" + which + " for Owned Card:' value to match your character card. " + 
				actualVal + " doesn't appear to be correct. Closest: " + Math.round(closestVal) + ", level " + closestIdx + ".</span><br />";
	return { found: false, errMsg : str, closest: Math.round(closestVal), closestIdx:closestIdx };
}

	APIList["1.9"] = {
		doCalcRank: doCalcRank,
		//calcMeleeDamage: calcMeleeDamage,
		findAppliedAugLevel: findAppliedAugLevel,
		getAPIByVersion: getAPIByVersion
	};
	return getAPIByVersion("1.9");
})();
/* file handleSpSup.js: */
var HandleSpSup = (function() {

	var APIList = {}; /* different versions of the API of this module */
	var getAPIByVersion = function(versionStr) {
		return APIList[versionStr];
	};
	//var csv = "";

var Sp1NormalBaseFactor = 0.020;
var Sp1EffectStartArr = [
	["*","Aquaman"], [ "*","Batman"], ["*","Catwoman"], 
	["*","Cyborg"], ["*","Green Arrow"], ["*","Hawkgirl"], 
	["*","Lex Luthor"], ["*","Nightwing"], ["-","Zatanna"] ];

var Sp1AbnormalStartArr = [
	["*", "Black Adam",           0.021], /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.34644] ], 10, 0.34644], */
	/*["Regime", "Black Adam",      0.021], /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.346477] ],*/
	/*10, 0.346477], */
	["Red Lantern", "Hal Jordan", 0.015], /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.2474937] ],*/
	["-", "Static",				  0.025] ]; /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.4125] ] ]; 10, 0.4125] ];*/

var Sp1NormalEnd = 2.0;

var Sp1AbnormalEndArr = [
	["*","Batman", 1.8],
	["-","Harley Quinn", 1.95],
	["-","Static", 1.6],
	["Arkham Knight","The Arkham Knight", 1.5] ];


var Sp2EffectStartArr = [["-","Black Adam"], ["Regime","Black Adam"], ["-","Darkseid"], ["-","Deathstroke"], ["New 52","Green Lantern"], [ "Regime", "Green Lantern" ],
	["Red Lantern", "Hal Jordan"], ["-","Lobo"], ["-","Sinestro"], ["Regime","Sinestro"], ["-","Solomon Grundy"], ["Regime", "Solomon Grundy"],
	["Regime", "Superman"], ["New 52", "The Flash"], ["-","The Joker"], ["Insurgency","The Joker"], ["The Killing Joke", "The Joker"],
	["600","Wonder Woman"] ];

var Sp2NormalBaseFactor = 0.060;
var Sp2AbnormalStartArr = [
	["-","Aquaman",                 0.020], /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.33] ], 10,0.33], */
	["Arkham Knight", "Batman",		0.062],
	["-","Catwoman",                0.080], /*[-1, 0.80, 0.88, 0.96, 1.04, 1.12, 1.16,  1.20, 1.24,  1.28, 1.32 ] ], 10,1.32], */
	["Apokolips", "Darkseid",		0.062],
	["Mortal Kombat X", "Scorpion", 0.040], /*[-1, 0.4, 0.44, 0.48, 0.52, 0.56, 0.58, 0.6, 0.62, 0.64, 0.66] ],*/
	["-","Static",                  0.080], /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1.32] ], 10,1.32],*/
	["Godfall","Superman",          0.052],
	["Dawn of Justice", "Wonder Woman", 0.061],
	["Arkham Knight", "Catwoman",	0.045]
	]; /*[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0.86] ] ]; 10,0.86]];*/
	
var Sp2NormalEnd = 2.0;

var Sp2AbnormalEndArr = [
	["-","Catwoman",1.5],
	["Arkham Knight", "Batman",2.0324],
	["*","Harley Quinn",1.0],
	["Apokolips", "Darkseid", 1.9678],
	["Mortal Kombat X","Scorpion",1.5],
	["-","Static",1.5],
	["Arkham Knight", "The Arkham Knight",1.75],
	["Dawn of Justice", "Superman", 2.06666],//2.067075384 ],
	["Dawn of Justice", "Wonder Woman", 1.9836907 ]
	];

	
var SuperNormalBaseFactor = 0.15;
var SupAbnormalArr = [
	["Red Lantern", "Hal Jordan", 0.12], /* [-1, 1.20, 1.32, 1.44, 1.56, 1.68, 1.74, 1.80, 1.86, 1.92, 1.98] ],  1.20 is a guess for 1 bar*/
	["-","Shazam",                0.03] ];/* [-1, -1, -1, -1, -1, 0.420, 0.435, 0.450, 0.465, 0.480, 0.495] ] ];*/

function indexInSpecialArray(outerArray, lowerName, lowerTitle) {
	var arrayLength = outerArray.length;
	for (var i = 0; i < arrayLength; i++) {
		var arr = outerArray[i];
		if (arr && (arr[1].toLowerCase() === lowerName) ) {
			if (arr[0] === "*") /* star matches all char titles */
				return i;
			else if (arr[0].toLowerCase() === lowerTitle)
				return i;
		}
	}
	return -1000;
}

/* Formula: 10 * baseFactor + (numBars-1) * baseFactor 
   - IF (numBars < 6; 0; (baseFactor / 2) * (numBars - 5)) */
function getSpecialOrSuperStartDamage(damage, numBars, baseFactor) {
	var factor = 10 * baseFactor + (numBars - 1) * baseFactor;
	if (numBars > 5)
		factor = factor - (baseFactor / 2) * (numBars - 5);
	return factor * damage;
}

function getEffectStart(NormalStart) {
	return NormalStart/2;
}

function getSpStart(charName, charTitle, damage, numBars, 
	NormalBaseFactor, EffectStartCharacters, AbnormalStartCharacters) {
	
	var lowerName = charName.toLowerCase();
	var lowerTitle = charTitle.toLowerCase();
	var normalStart = getSpecialOrSuperStartDamage(damage, numBars,NormalBaseFactor);
	var idx;
	
	if (EffectStartCharacters) {
		idx = indexInSpecialArray(EffectStartCharacters, lowerName, lowerTitle);
		if (idx >= 0)
			return getEffectStart(normalStart);
	}
	
	idx = indexInSpecialArray(AbnormalStartCharacters, lowerName, lowerTitle);
	if (idx >= 0) {
		var arr = AbnormalStartCharacters[idx];
		return getSpecialOrSuperStartDamage(damage, numBars, arr[2]);
	}
	
	return normalStart; /* Default is normal start value */
} /* getSpStart */

function getSp1Start(charName, charTitle, damage, numBars) {
	return getSpStart(charName, charTitle, damage, numBars,
		Sp1NormalBaseFactor, Sp1EffectStartArr, Sp1AbnormalStartArr);
}

function getSp2Start(charName, charTitle, damage, numBars) {
	return getSpStart(charName, charTitle, damage, numBars,
		Sp2NormalBaseFactor, Sp2EffectStartArr, Sp2AbnormalStartArr);
}

function getSuper(charName, charTitle, damage, numBars) {
	return getSpStart(charName, charTitle, damage, numBars,
		SuperNormalBaseFactor, false, SupAbnormalArr);
}

function getSpEnd(charName, charTitle, SpStart, NormalEnd, CharactersWithAbnormalEnd)
{
	if (SpStart < 0) /* if not able to get SpStart, then don't even try to get Sp1End */
		return SpStart;
	
	var idx = indexInSpecialArray(CharactersWithAbnormalEnd, charName.toLowerCase(), charTitle.toLowerCase());
	if (idx >= 0) {
		var arr = CharactersWithAbnormalEnd[idx];
		return SpStart * arr[2];
	}
	else 
		return SpStart * NormalEnd;
} /* getSpEnd */

function getSp1End(charName, charTitle, Sp1Start) {
	return getSpEnd(charName, charTitle, Sp1Start, Sp1NormalEnd, Sp1AbnormalEndArr);
}

function getSp2End(charName, charTitle, Sp2Start) {
	return getSpEnd(charName, charTitle, Sp2Start, Sp2NormalEnd, Sp2AbnormalEndArr);
}

	APIList["1.9"] = {
		getSp1Start: getSp1Start,
		getSp1End: getSp1End,
		getSp2Start: getSp2Start,
		getSp2End: getSp2End,
		getSuper: getSuper,
		getAPIByVersion: getAPIByVersion
	};
	return getAPIByVersion("1.9");
})();
if(typeof CCIM_Data == 'undefined'){
var CCIM_Data = (function() {
	/*jshint asi:true*/

	var	allCharKeys=[], allCharKeysLen, // an array of strings
		allCharNames=[], // an array of strings
		allCharTitles=[], // an array of strings
		allCharBasics={} // an assoc array of objects. Keys: charKey, Values: {Name:,Title:,Color:, etc}
	
	var eliteNames = ["e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","e10"]
	var colorNames = ["Gold", "Silver", "Bronze" ]
	var allSupportCardBonuses = {
			damage: {
				Ravager: 4,
				Starfire: 5,
				TaliaAlGhul: 6, 
				TheSpectre: 7, 
				TimDrake: 3 },
			health: { 
				BlackManta: 5,
				Hawkman: 4, 
				Kilowog: 3, 
				Parallax: 6, 
				SwampThing: 7 }
	}

	var collection = {
		origHash: '', // origHash: tie together how saved collections evolve
		tag: '',
		chars: {}, // assoc array, key = 'charName:charTitle'
		hidden: [], // array of strings, each 'charName:charTitle'
		supportCards: {}, // assoc array, key = 'charName'. values = assoc array: {DamageBonus:1 HealthBonus:1 }
		allSupportCards: {}, // assoc array of 'Kilowog', etc values: 1 or 0
		curChar: '', // a string, charName:charTitle
		sortKey: 'Name'
	}
	var filters = {}

	var preferences = { // mainly user interface items:
		charsPerPage: 10,
		theme: 'blackonwhite',
		columns: ["Select", "Elite", "XP", "Damage", "Health", "ExtraCards", "ElitePlusExtraCards"] //, "Damage", "Health", "BaseDamage", "BaseHealth", "Cost"]
	}
	// Columns always displayed: Name, Title, Select
	// Optionally displayed: See template_charrow1 in tbody of TemplateTable for the list of valid columns
	var sortedCharList = [] // array of strings, visible charName:charTitle cards, sorted by sortKey
	var damageAugLevels = {} // index is charKey, value is a string 
	var healthAugLevels = {} // same
	
	// END OF THIS MODULE'S INTERNAL VARIABLES
	
	function getCharKey(charName, charTitle){ return (charName + ":" + charTitle) } //.replaceSpcs('_') }
	function getCharKeyParts(charKey) { return charKey.split(":") }

	function getDataToSave(compress) {
		var dataObj = 
		{ 
			collection: collection, 
			preferences: preferences,
			filters: filters
		}		
		var dataStr
		if (compress)
			dataStr = JSON.stringify(dataObj)
		else
			dataStr = JSON.stringify(dataObj, null, "\t") 
		//optional args to stringify: null, "\t" for 'pretty-print' for debugging
		return dataStr
	}

	function getCharsPerPage() { return preferences.charsPerPage }

	function getNumHidden() { return collection.hidden.length }

	function getNumPages() {
		var num = Math.trunc(sortedCharList.length / preferences.charsPerPage)
		if (num * preferences.charsPerPage < sortedCharList.length)
			num++
		return num
	}

	function isRestoreDataOkay(dataStr) {
		var dataObj = JSON.parse(dataStr)
		if (!dataObj)
			return null
		
		if (!dataObj.collection)
			return null
		return dataObj
	}

	function restoreSavedData(restorePreferences, restoreFilters, dataObj, newHash) {
		collection = dataObj.collection
		if (typeof newHash != 'undefined')
			collection.origHash = newHash
		
		if (restorePreferences && dataObj.preferences)
			preferences = dataObj.preferences
		
		if (restoreFilters && dataObj.filters){
				initializeFilters()
				//filters = dataObj.filters
				LAM.extend(filters, dataObj.filters)
				//console.log("Filters: %o", filters)
		}
		
		foreachCharKey( // make sure all charkeys are in collection.chars
			function (charKey,idx,arr) {
				if (typeof collection.chars[charKey] != 'object'){
					console.log("Adding %s to collection.chars. typeof was %s", charKey, typeof collection.chars[charKey])
					initChar(charKey,idx,arr)
				}
			}, null)
		
		//todo: make sure all names are in collection.supportCards
		
		//console.log("restoreSavedData: sorting by %s", collection.sortKey)
		setSortedCharList()
	}

	function initChar(charKey,idx,arr) {
			collection.chars[charKey] = {
				selected: 0,
				elite: 0,
				xp: 0,
				damage: 0,
				health: 0,
				gearSlots: 1,
				sp1Bars: 1,
				sp2Bars: 0,
				superBars: 0,
				critChance: 0,
				critDamage: 150,
				extraCards: 0,
				inStore: 0
			}
	}
	function initBonuses(name,idx,arr) {
		collection.supportCards[name] = {DamageBonus: 1, HealthBonus: 1}
	}

	function setAllSupportCards(flag) {
		var val = flag? 1 : 0
		collection.allSupportCards = {
			damage: { 
				Ravager: val,
				Starfire: val,
				TaliaAlGhul: val, 
				TheSpectre: val, 
				TimDrake: val },
			health: { 
				BlackManta: val,
				Hawkman: val, 
				Kilowog: val, 
				Parallax: val, 
				SwampThing: val }
		}
	}
	function initializeCollection(){
		collection.origHash = ''
		collection.tag = ''		
		collection.chars={}
		collection.supportCards={}

		foreachCharKey(initChar,null)
		foreachName(initBonuses,null)
		//console.log("After init, collection.supportCards: %o", collection.supportCards)
		
		setAllSupportCards(true)
		setSortedCharList()
		collection.curChar = sortedCharList[0]
	}

	function initializeFilters() {
		filters = {}
		filters.range = {}
		// use same case as prop names in initChar and initializeCharacterArrays
		filters.range.damage = { min:0, max:500000 }
		filters.range.health = { min:0, max:500000 }
		filters.range.DamagePlusHealth = { min:0, max:500000 }
		filters.range.StoreDamage = { min:0, max:9999}
		filters.range.StoreHealth = { min:0, max:9999}
		filters.range.BaseDamagePlusHealth = { min:0, max:9999 }
		filters.range.ElitePlusExtraCards = { min:0, max:1000 }
		filters.range.Sp1Min = { min:0, max:500000 }
		filters.range.Sp2Min = { min:0, max:500000 }
		filters.range.Super = { min:0, max:500000 }
		filters.range.xp = { min:0, max:60 }
		filters.range.Cost = { min:0, max:1000 }
		filters.range.gearSlots = { min:1, max:3 }

		filters.elite = {}
		eliteNames.forEach(setFilterTo1, filters.elite)

		filters.color = {} 
		colorNames.forEach(setFilterTo1, filters.color)
		
		filters.names = {}
		foreachName(setFilterTo1, filters.names)

		filters.titles = {}
		foreachTitle(setFilterTo1, filters.titles)
	}
	function setFilterTo0(currVal, idx, arr) { this[currVal] = 0 }
	function setFilterTo1(currVal, idx, arr) { this[currVal] = 1 }
	
	function getNameOrTitle_FilterVal(which, key) {
		if (which.toLowerCase()=="name") 
			return filters.names[key]
		else
			return filters.titles[key]
	}
	function getRangeFilter(which){
		if (!filters.range[which]) {
			console.log("Missing range filter: " + which + ", creating one on the fly")
			filters.range[which] = { min:0, max:100000 }
		}
		return filters.range[which]
	}
	function getColorsFilter() {
		return filters.color
	}
	function getEliteFilter() {
		return filters.elite
	}
	function setFilterRange(propName, min, max) {
		if (filters.range) {
			filters.range[propName].min = min
			filters.range[propName].max = max 
		}
		else
			showMessage("setFilterRange: unknown property: " + propName)
	}
	function setFilter(inputSet, objToSet) {
		var len=inputSet.length
		for(var i=0; i<len; ++i) 
			objToSet[inputSet[i]] = 1
	}
	function setEliteFilter(eliteSet) {
		eliteNames.forEach(setFilterTo0, filters.elite)
		setFilter(eliteSet, filters.elite)
	}
	function setNameAndTitleFilters(nameSet, titleSet) {
		foreachName(setFilterTo0, filters.names)
		setFilter(nameSet, filters.names)
		foreachTitle(setFilterTo0, filters.titles)
		setFilter(titleSet, filters.titles)
	}
	function setColorFilter(colorSet) {
		colorNames.forEach(setFilterTo0, filters.color)
		setFilter(colorSet, filters.color)
	}

	function InitializeFiltersAndCollection() {
		initializeFilters()
		initializeCollection()
	}
	
	function getAllCharBonusCards() { return collection.allSupportCards }

	function setAllCharsBonuses(dmgChks, hthChks) {
		collection.allSupportCards = {
			damage: { Ravager: 0, Starfire: 0, TaliaAlGhul: 0, TheSpectre: 0, TimDrake: 0 },
			health: { BlackManta: 0, Hawkman: 0,  Kilowog: 0,  Parallax: 0, SwampThing: 0 } }
		setFilter(dmgChks, collection.allSupportCards.damage)
		setFilter(hthChks, collection.allSupportCards.health)
	}

	function getBonusForCharName(name) { return collection.supportCards[name] }// returns obj with DamageBonus and HealthBonus
	function setCharBonuses(Bonuses) {
		for (var name in Bonuses)
			if (Bonuses.hasOwnProperty(name)) {
				collection.supportCards[name] = {
					DamageBonus: Bonuses[name].damage,
					HealthBonus: Bonuses[name].health
				}
				//console.log('supportCards for %s changed to %o', name, collection.supportCards[name])
			}
	}
	function recalcCharacter(charkey) {
		var chr = collection.chars[charkey]
		var arrChar = allCharBasics[charkey].arrChar
		var parts,name
		
		if(!chr) {
			console.log("recalcCharacter(): cannot find charkey %s", charkey)
			return false
		}

		parts = getCharKeyParts(charkey)
		name = parts[0]

		var suppCards = collection.supportCards[name]
		if (!suppCards) {
			console.log("recalcCharacter(): Unable to find supportCards for name %s", name)
			return false
		}

		var dmgLvl = damageAugLevels[charkey]
		if(!dmgLvl)
			dmgLvl = 0

		var hthLvl = healthAugLevels[charkey]
		if(!hthLvl)
			hthLvl = 0
		
		if (suppCards) {
			if  (chr.xp > 0) {
				var augLevels = { 	StartDamageLevel: dmgLvl, EndDamageLevel: dmgLvl, 
									StartHealthLevel: hthLvl, EndHealthLevel: hthLvl }

				var lvl = calcStats(arrChar, chr.xp, chr.elite, augLevels, suppCards.DamageBonus, suppCards.HealthBonus)
				if(lvl) {
					if (lvl.arrDamageWithBonus){
						chr.damage = Math.round(lvl.arrDamageWithBonus[dmgLvl])
						//todo: ??add code to recalc sp1min&max, sp2min&max, super
					}
					if (lvl.arrHealthWithBonus)
						chr.health = Math.round(lvl.arrHealthWithBonus[hthLvl])
				}
			}
			else {
				chr.damage = 0
				chr.health = 0
			}
		}		
	}
	function recalculateAfterBonusesChange() {
		foreachCharKey(recalcCharacter)
	}
	function initializeCharacterArrays(){
		var allCharacters = Characters.getAllCharacters()
		var allCharactersLen  = allCharacters.length
		var charArray, name, title, charKey
		
		allCharKeys = []
		allCharNames = []
		allCharTitles = []
		for (var ch=0; ch<allCharactersLen; ch++) 
		{
			charArray = allCharacters[ch]
			name = charArray[Characters.idxName()]
			title = charArray[Characters.idxTitle()]
			charKey = getCharKey(name, title)
			allCharBasics[charKey] = 
			{
				Name : name,
				Title : title,
				Color : charArray[Characters.idxColor()],
				StoreDamage : charArray[Characters.idxStoreDamage()],
				StoreHealth : charArray[Characters.idxStoreHealth()],
				Cost : charArray[Characters.idxCost()],
				Abbr : charArray[Characters.idxAbbr()],
				arrChar : charArray
			}
			allCharKeys.push(charKey)
			
			if (allCharNames.indexOf(name) < 0) 
				allCharNames.push(name)
			
			if (allCharTitles.indexOf(title) < 0)
				allCharTitles.push(title)
		}
		allCharKeysLen = allCharKeys.length
		allCharNames.sort()
		allCharTitles.sort()
	}

	function addLeadingZeros(val, totalLen){
		var str = String(val)
		var len = str.length
		while (len<totalLen) {
			str = '0' + str
			len = str.length
		}
		return str
	}

	function getCharSortVal(charKey, i) {
		var val = "",
			charBasics = allCharBasics[charKey]
			
		var charName = charBasics.Name, 
			charTitle = charBasics.Title
		
		switch (collection.sortKey) {
			case "Name" : break;
			
			case "Title" :
				val += charTitle+" "+charName
				break;
				
			case "Color" :
				switch(charBasics.Color) {
					case "Gold"   : val += "1" 
						break;
					case "Silver" : val += "2" 
						break;
					case "Bronze" : val += "3" 
						break;
				}
				break
			case "Selected" : val = (collection.chars[charKey]).selected; break;
			case "Elite" : val = addLeadingZeros(99-(collection.chars[charKey]).elite,2); break;
			case "XP" : val = addLeadingZeros(99-(collection.chars[charKey]).xp,2); break;
			case "Damage" : val = addLeadingZeros(9999999-(collection.chars[charKey]).damage,7); break;
			case "Health" : val = addLeadingZeros(9999999-(collection.chars[charKey]).health,7); break;
			case "DamagePlusHealth" : var collChar = collection.chars[charKey]; 
				val = addLeadingZeros(99999999-collChar.damage + collChar.health,8); break;
			case "GearSlots" : val = 9-(collection.chars[charKey]).gearSlots; break;
			case "InStore" : val = (collection.chars[charKey]).inStore; break;
			case "Sp1Bars" : val = addLeadingZeros(99-(collection.chars[charKey]).sp1Bars,2); break;
			case "Sp2Bars" : val = addLeadingZeros(99-(collection.chars[charKey]).sp2Bars,2); break;
			case "SuperBars" : val = addLeadingZeros(99-(collection.chars[charKey]).superBars,2); break;
			case "CritChance" : val = addLeadingZeros(999-(collection.chars[charKey]).critChance,3); break;
			case "CritDamage" : val = addLeadingZeros(9999-(collection.chars[charKey]).critDamage,4); break;
			case "ExtraCards" : val = addLeadingZeros(999-(collection.chars[charKey]).extraCards,3); break;
			case "DamageBonus" : val = (collection.supportCards[charName]).DamageBonus; break;
			case "HealthBonus" : val = (collection.supportCards[charName]).HealthBonus; break;
			case "BaseDamage" : val = addLeadingZeros(99999-charBasics.StoreDamage,5); break;
			case "BaseHealth" : val = addLeadingZeros(99999-charBasics.StoreHealth,5); break;
			case "BaseDamagePlusHealth" : val = addLeadingZeros(99999-(charBasics.StoreDamage + charBasics.StoreHealth),5); break;
			case "Cost" : val = addLeadingZeros(9999-charBasics.Cost,4); break;
			case "Abbr" : val = charBasics.Abbr; break;
			case "ElitePlusExtraCards" : var collChar = collection.chars[charKey]; 
				val = addLeadingZeros(99 - (collChar.elite + collChar.extraCards), 2); break;
			default : console.log("Sort key " + collection.sortKey + " isn't implemented"); break;
		}//end switch
		if ("Title" != collection.sortKey) {
			val = String(val) + " " + charName+" "+charTitle
		}
		return { idx: i, val:val }
	}//end getCharSortVal()

	function doSortCharMap(a,b) {
		return String(a.val).localeCompare(String(b.val))
	}

	function getVisible(charkey) {
		if (collection.hidden.indexOf(charkey) < 0)
			this.push(charkey) // visible, add it to list to be sorted
	}
	function setSortedCharList() {
		var list = []
		var mapped,curCharkey,curIdx
		
		foreachCharKey(getVisible,list)
		
		// hidden[] may have changed before this re-sort function was called.
		// If current char is now hidden, then go to a previous character which is visible
		curCharkey = collection.curChar
		while (list.indexOf(curCharkey) < 0) {
			curIdx = (sortedCharList.indexOf(curCharkey)) - 1
			if (curIdx < 0)
				break
			curCharkey = sortedCharList[curIdx]
		}
		if (list.indexOf(curCharkey) >= 0)
			collection.curChar = curCharkey

		// list now contains the string keys of all visible characters. not sorted yet
		mapped = list.map(getCharSortVal)//getCharSortVal is a function
		mapped.sort(doSortCharMap)//doSortCharMap is a function
		sortedCharList = mapped.map( 
			function (elem) { 
				return list[elem.idx]
			} )
	}

	function setSortKey(newSortKey) {
		if(newSortKey != collection.sortKey){
			collection.sortKey = newSortKey
			setSortedCharList()
			return true
		}
		else
			return false // no sort needed
	}
	function getSortKey() {
		return collection.sortKey 
	}

	function getCharData(charkey) {
		var retval = {}
		if(!charkey)
			return retval
		
		retval.charkey = charkey
		retval = LAM.extend(retval, allCharBasics[retval.charkey])
		if(retval.Name)
			retval = LAM.extend(retval, collection.supportCards[retval.Name])
		retval = LAM.extend(retval, collection.chars[retval.charkey])
		retval.damageAugLevel = damageAugLevels[retval.charkey]
		retval.healthAugLevel = healthAugLevels[retval.charkey]
		return retval
	}
	function getCharDataForOffset(offset) { // merges together data for the character
		var curCharIdx = indexOfCurChar()
		var retval={}
		
		if (curCharIdx < 0)
			return retval
		
		retval.thisCharIdx = curCharIdx + offset // thisCharIdx is the index into sortedCharList
		if(retval.thisCharIdx < 0 || retval.thisCharIdx >= sortedCharList.length) {
			// thisCharIdx is out of bounds: ' + retval.thisCharIdx + ' max: ' + (sortedCharList.length-1)
		}
		else {
			retval = LAM.extend(retval, getCharData(sortedCharList[retval.thisCharIdx]) )
			if(!retval.charkey)
				console.log("Unable to find charKey for thisCharIdx %d", retval.thisCharIdx)
		}
		return retval
	}
	function indexOfCharKey(charKey) {
		return sortedCharList.indexOf(charKey)
	}
	function indexOfCurChar() {
		return indexOfCharKey(collection.curChar)
	}
	function getSpMinAndMax(which, charName, charTitle, damage, numBars) {
		var num1,num2
		if(damage < 1 || isNaN(numBars) || numBars < 1) {
			return { "Min": 0, "Max" : 0}
		}		
		if(which==1){
			num1 = HandleSpSup.getSp1Start(charName, charTitle, damage, numBars)
			num2 = HandleSpSup.getSp1End(charName, charTitle, num1)
		}
		else{
			num1 = HandleSpSup.getSp2Start(charName, charTitle, damage, numBars)
			num2 = HandleSpSup.getSp2End(charName, charTitle, num1)
		}
		return { 
			"Min": LAM.numberWithCommas(Math.round(num1)),
			"Max": LAM.numberWithCommas(Math.round(num2)) }
	}

	function getSuper(charName, charTitle, damage, numBars){
		if(damage < 1 || isNaN(numBars) || numBars<1)
			return 0
		else{
			var num1 = HandleSpSup.getSuper(charName, charTitle, damage, numBars);
			return LAM.numberWithCommas(Math.round(num1));
		}
		return false
	}
	function setDamageAugLevel(charData) {
		damageAugLevels[charData.charkey] =
						get_Damage_Aug(
							charData.damage, charData.xp, charData.elite, 
							charData.DamageBonus, charData.HealthBonus,
							charData.arrChar )
		return damageAugLevels[charData.charkey]
	}
	function setHealthAugLevel(charData) {
		healthAugLevels[charData.charkey] =
						get_Health_Aug(
							charData.health, charData.xp, charData.elite, 
							charData.DamageBonus, charData.HealthBonus,
							charData.arrChar )
		return healthAugLevels[charData.charkey]
	}
	function get_Damage_Aug(damage, xp, elite, hasDmgBonus, hasHlthBonus, arrChar){
		var level, arrWithBonus, alObj
		if (xp < 1)
			return 0
		level = calcStats(arrChar, xp, elite, 
				{ StartDamageLevel: 0, EndDamageLevel: Characters.maxAug(), 
				  StartHealthLevel: 0, EndHealthLevel: 0 }, 
				hasDmgBonus, hasHlthBonus);
		if (level) {
			arrWithBonus = level.arrDamageWithBonus
			alObj = DoCalcRank.findAppliedAugLevel(damage, arrWithBonus, 'damage')
			if (alObj.found)
				return Math.round(alObj.augmentationLevel)
			else
				return Math.round(alObj.closestIdx)
		}
		else
			return 0
	}

	function get_Health_Aug(health, xp, elite, hasDmgBonus, hasHlthBonus, arrChar){
		var level, arrWithBonus, alObj
		if (xp < 1)
			return 0

		level = calcStats(arrChar, xp, elite, 
				{ StartDamageLevel: 0, EndDamageLevel: 0, 
				  StartHealthLevel: 0, EndHealthLevel: Characters.maxAug() }, 
				hasDmgBonus, hasHlthBonus);
		if (level) {
			arrWithBonus = level.arrHealthWithBonus
			alObj = DoCalcRank.findAppliedAugLevel(health, arrWithBonus, 'health')
			if (alObj.found)
				return  Math.round(alObj.augmentationLevel)
			else
				return Math.round(alObj.closestIdx)
		}
		else
			return 0
	}

	function getCurPageNum() {
		return Math.round( (indexOfCurChar() / preferences.charsPerPage) + 1 )
	}
	function changeCurChar(pageNum){
		var idx = (pageNum-1) * preferences.charsPerPage
		if (idx < 0) {
			console.log('idx out of range: ' + idx + ', pageNum ' + pageNum)
			return -1
		}
		else if (idx >= sortedCharList.length) {
			console.log('idx out of range: ' + idx + ', pageNum ' + pageNum)
			return 1
		}
		else {
			collection.curChar = sortedCharList[idx]
			return 0
		}
	}
	function getColorTheme(){
		return preferences.theme
	}
	function setColorTheme(newTheme) {
		preferences.theme = newTheme
	}
	function getAllCharsDmgBonus() {
		var bonus = 0
		
		for (var prop in collection.allSupportCards.damage)
			if (collection.allSupportCards.damage.hasOwnProperty(prop))
				if (collection.allSupportCards.damage[prop])
					bonus += allSupportCardBonuses.damage[prop]
		/*if (collection.allSupportCards.damage.Ravager)
			bonus += 4;
		if (collection.allSupportCards.damage.Starfire)
			bonus += 5;
		if (collection.allSupportCards.damage.TaliaAlGhul)
			bonus += 6;
		if (collection.allSupportCards.damage.TheSpectre)
			bonus += 7;
		if (collection.allSupportCards.damage.TimDrake)
			bonus += 3;*/
		return bonus
	}
	function getAllCharsHthBonus() {
		var bonus = 0
		for (var prop in collection.allSupportCards.health)
			if (collection.allSupportCards.health.hasOwnProperty(prop))
				if (collection.allSupportCards.health[prop])
					bonus += allSupportCardBonuses.health[prop]
		/*if (collection.allSupportCards.health.BlackManta)
			bonus += 5;
		if (collection.allSupportCards.health.Hawkman)
			bonus += 4;
		if (collection.allSupportCards.health.Kilowog)
			bonus += 3;
		if (collection.allSupportCards.health.Parallax)
			bonus += 6;
		if (collection.allSupportCards.health.SwampThing)
			bonus += 7;*/
		return bonus
	}
	function calcStats(arrChar, XPLevel, EliteLevel, augLevels, hasCharDamageBonus, hasCharHealthBonus){
		var allCharsDmgBonus = getAllCharsDmgBonus();
		var allCharsHthBonus = getAllCharsHthBonus();
		var inputs = {};
		if (typeof(XPLevel) == "string")
			XPLevel = LAM.parseInteger(XPLevel)
		if (typeof(EliteLevel) == "string")
			EliteLevel = LAM.parseInteger(EliteLevel)
		
		if(XPLevel < 0 || XPLevel > 60) {
			showMessage("XP value " + XPLevel + " is out of range 0 to 60")
			return null
		}
		if(EliteLevel < 0 || EliteLevel > 10) {
			showMessage("Elite value " + EliteLevel + " is out of range 0 to 10")
			return null
		}

		inputs.characterArr = arrChar;
		inputs.EndXPLevel = XPLevel;
		
		inputs.StartAugmentationDamage = augLevels.StartDamageLevel ? augLevels.StartDamageLevel : 0;
		inputs.EndAugmentationDamage = augLevels.EndDamageLevel ? augLevels.EndDamageLevel : 0;
		
		inputs.StartAugmentationHealth = augLevels.StartHealthLevel ? augLevels.StartHealthLevel : 0;
		inputs.EndAugmentationHealth = augLevels.EndHealthLevel ? augLevels.EndHealthLevel : 0;

		inputs.DamageBonusMultiplier = 1+(allCharsDmgBonus/100);
		if (hasCharDamageBonus)
			inputs.DamageBonusMultiplier += 0.10;
		
		inputs.HealthBonusMultiplier = 1+(allCharsHthBonus/100);
		if (hasCharHealthBonus)
			inputs.HealthBonusMultiplier += 0.10;

		var levels = DoCalcRank.doCalcRank(EliteLevel, inputs);
		return levels[XPLevel-1];
	}
	function userChangedHealth(name, title, newHealth) {
		var charkey, chr
		charkey = getCharKey(name, title)
		chr = collection.chars[charkey]
		healthAugLevels[charkey] = null
		if (chr)
			chr.health = newHealth
	}

	function userChangedDamage(name, title, newDamage) {
		var charkey, chr
		charkey = getCharKey(name, title)
		chr = collection.chars[charkey]
		damageAugLevels[charkey] = null
		if (chr)
			chr.damage = newDamage
	}
	function userChangedDataVal(name, title, newVal, whichField) {
		var charkey, chr
		charkey = getCharKey(name, title)
		chr = collection.chars[charkey]
		if (chr) {
			chr[whichField] = newVal
		}
	}
	function userChangedExtraCards(name, title, newValStr) {
		userChangedDataVal(name, title, newValStr, "extraCards")
	}
	function userChangedElite(name, title, newElite) {
		setDamageAndHealth(newElite, 'elite', name, title)
	}

	function userChangedXP(name, title, newXP) {
		setDamageAndHealth(newXP, 'xp', name, title)
	}
	function setDamageAndHealth(newValStr, which, name, title)
	{
		var charkey = getCharKey(name, title)

		var chr = collection.chars[charkey]
		if(!chr) {
			showMessage("setDamageAndHealth(): cannot find charkey " + charkey)
			return false
		}
		if (typeof chr[which] != 'undefined')
				chr[which] = newValStr

		var newVal = LAM.parseInteger(newValStr)
		if (isNaN(newVal)) {
			showMessage(which + " value '" + newValStr + "' isn't an integer")
			return false
		}
		
		var arrChar = allCharBasics[charkey].arrChar

		var suppCards = collection.supportCards[name]
		if (!suppCards) {
			showMessage("setDamageAndHealth(): Unable to find supportCards for name " + name)
			return false
		}

		var dmgLvl = damageAugLevels[charkey]
		if(!dmgLvl)
			dmgLvl = 0

		var hthLvl = healthAugLevels[charkey]
		if(!hthLvl)
			hthLvl = 0
		
		if (suppCards) {
			if  (chr.xp > 0) {
				var augLevels = { 	StartDamageLevel: dmgLvl, EndDamageLevel: dmgLvl, 
									StartHealthLevel: hthLvl, EndHealthLevel: hthLvl }

				var lvl = calcStats(arrChar, chr.xp, chr.elite, augLevels, suppCards.DamageBonus, suppCards.HealthBonus)
				if(lvl) {
					if (lvl.arrDamageWithBonus)
						chr.damage = Math.round(lvl.arrDamageWithBonus[dmgLvl])
					if (lvl.arrHealthWithBonus)
						chr.health = Math.round(lvl.arrHealthWithBonus[hthLvl])
				}
			}
			else {
				chr.damage = 0
				chr.health = 0
			}
		}
	}
	function setSelectedVal(name, title, checked) {
		var charkey = getCharKey(name, title)
		var chr = collection.chars[charkey]
		if (chr)
			chr.selected = checked		
	}
	function SelAllVal(val) {
		for (var charKey in collection.chars)
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				collection.chars[charKey].selected = val 
			}
		}
	}
	function SelVisibleVal(val) {
		for (var charKey in collection.chars)
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				if (indexOfCharKey(charKey) >= 0)
					collection.chars[charKey].selected = val
			}
		}
	}
	function InvertSel(){
		for (var charKey in collection.chars)
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				if (collection.chars[charKey].selected)
					collection.chars[charKey].selected = 0
				else
					collection.chars[charKey].selected = 1
			}
		}
	}
	function ShowAll() {
		if (collection.hidden.length > 0) {
			collection.hidden = []
			// anytime hidden list changes, sortedCharList must also change
			setSortedCharList()
			return true
		}
		else
			return false
	}
	function InvertHidden() {
		var idx, newHidden =[]
		for (var charKey in collection.chars)//for each character in collection
		{
			if (collection.chars.hasOwnProperty(charKey)) {				
				idx = collection.hidden.indexOf(charKey)
				if (idx < 0) // not hidden, so needs to become hidden
					newHidden.push(charKey)
			}
		}
		collection.hidden = newHidden//replace the hidden list with all which had been shown
		setSortedCharList()
	}
	function ChangeSelVisibility(makeVisible) { // for all selected characters, add to hidden. then set sorted list again
		var idx,changed=false
		for (var charKey in collection.chars)//for each character in collection
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				
				if (collection.chars[charKey].selected) { // if character is selected
				
					idx = collection.hidden.indexOf(charKey)
					if(idx < 0) { // character is not hidden
						if (!makeVisible) {// it's supposed to be hidden
							changed=true
							collection.hidden.push(charKey) //put it onto the hidden list
						}
					}
					else { // character is already hidden
						if (makeVisible) { // it's supposed to be visible
							changed=true
							collection.hidden.splice(idx, 1)//remove it from hidden list
						}
					}
				}
			}
		}
		if(changed) {
			setSortedCharList()
		}
		return changed
	}
	function getOffsetCharSelectVal(offset) {
		var thisCharIdx = indexOfCurChar() + offset
		if(thisCharIdx >= 0 && thisCharIdx < sortedCharList.length)
		{
			var charkey = sortedCharList[thisCharIdx]
			if (charkey && charkey !== '') {
				var chr = collection.chars[charkey]
				if(chr)
					return chr.selected
			}
		}
		return 0
	}
	function SelCurPageVal(val) {
		var c, chr, charKey, idx = sortedCharList.indexOf(collection.curChar), sortedCharIdx
		if (idx >= 0) { 
			for (c=0; c<preferences.charsPerPage; c++) {
				sortedCharIdx = c + idx
				if (sortedCharIdx >= 0 && sortedCharIdx < sortedCharList.length) {
					charKey = sortedCharList[sortedCharIdx]
					chr = collection.chars[charKey]
					if (chr)
						chr.selected = val
				}
			}
		}
	}
	function getNumSelected() {
		var num = 0
		for (var charKey in collection.chars)
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				if (collection.chars[charKey].selected)
					num++
			}
		}
		return num
	}
	function getTotalNumChars() { return allCharKeysLen }

	function changeSelectedChars(which, newValStr) {
		var keyparts
		for (var charKey in collection.chars)
		{
			if (collection.chars.hasOwnProperty(charKey)) {
				if (collection.chars[charKey].selected) {
					keyparts = getCharKeyParts(charKey)
					switch(which) {
						case 'XP' : userChangedXP(keyparts[0], keyparts[1], newValStr); break;
						case 'Elite' : userChangedElite(keyparts[0], keyparts[1], newValStr); break;
						case 'Extra_Cards' : userChangedExtraCards(keyparts[0], keyparts[1], newValStr); break;
					}
				}
			}
		}
	}
	function ChangePageDimensions(which, min, max, prompt, defVal) {
		var resultStr = window.prompt(prompt + " (" + min + " to " + max + ")", defVal)
		var num, set=false //, saveStr, hash
		if (resultStr) {
			if (LAM.isInteger(resultStr)) {
				num = LAM.parseInteger(resultStr)
				if (num >= min && num <= max) {
					preferences.charsPerPage = num
					set = true
				}
			}
			if (!set)
				showMessage('Failed to set preference to ' + resultStr)
		}
		return set
	}
	function setTag(newTag) { collection.tag = newTag }
	function getTag() {
		return collection.tag
	}
	
	function userChangedSp1Bars(name,title,newVal) {userChangedDataVal(name, title, newVal, "sp1Bars")}
	function userChangedSp2Bars(name,title,newVal) {userChangedDataVal(name, title, newVal, "sp2Bars")}
	function userChangedSuperBars(name,title,newVal) {userChangedDataVal(name, title, newVal, "superBars")}
	function userChangedCritChance(name,title,newVal) {userChangedDataVal(name, title, newVal, "critChance")}
	function userChangedCritDamage(name,title,newVal) {userChangedDataVal(name, title, newVal, "critDamage")}
	function userChangedGearSlots(name,title,newVal) {userChangedDataVal(name, title, newVal, "gearSlots")}
	function userChangedInStore(name,title,newVal) {userChangedDataVal(name, title, newVal, "inStore")}
	
	function foreachName(callback, thisArg) { allCharNames.forEach(callback, thisArg) }
	function foreachTitle(callback, thisArg) { allCharTitles.forEach(callback, thisArg) }
	function foreachCharKey(callback, thisArg) { allCharKeys.forEach(callback, thisArg) }
	
	function setHidden(hiddenList) {
		collection.hidden = hiddenList
		setSortedCharList()
	}
	function getColumnsToShow() {
		return ["Name", "Title"].concat(preferences.columns)
	}
	function setColumnsToShow(newCols) {
		var c,len,newlist
		newlist = []
		len = newCols.length
		for (c=0; c<len; ++c) {
			if (typeof newCols[c] == 'string') {
				newlist.push(newCols[c])
			}
		}
		preferences.columns = newlist
	}
	function changeToMaxLevels(charKey) { //  ,idx,arr) {
		collection.chars[charKey].elite = 10
		collection.chars[charKey].xp = 60
		damageAugLevels[charKey] = this.aug
		healthAugLevels[charKey] = this.aug
		recalcCharacter(charKey)
	}
	function changeAllToMaxWithAug(aug) {
		// set maximum bonuses:
		foreachName(initBonuses,null)
		setAllSupportCards(true)
		// set each character:
		foreachCharKey(changeToMaxLevels,{aug:aug})
	}
	
	// Initialize this module:
	initializeCharacterArrays()
	InitializeFiltersAndCollection()

	return {
		isRestoreDataOkay: isRestoreDataOkay,
		getDataToSave: getDataToSave,
		restoreSavedData: restoreSavedData,
		getCharsPerPage: getCharsPerPage,
		getCharDataForOffset: getCharDataForOffset,
		getSpMinAndMax: getSpMinAndMax,
		getSuper: getSuper,
		
		setDamageAugLevel: setDamageAugLevel,
		setHealthAugLevel: setHealthAugLevel,
		
		getCurPageNum: getCurPageNum,
		getNumPages: getNumPages,
		
		changeCurChar: changeCurChar,
		getColorTheme: getColorTheme,
		setColorTheme: setColorTheme,
		setSortKey: setSortKey, 
		getSortKey: getSortKey,
		InitializeFiltersAndCollection: InitializeFiltersAndCollection,

		SelAllVal: SelAllVal,
		InvertSel: InvertSel,
		getOffsetCharSelectVal: getOffsetCharSelectVal,
		SelVisibleVal: SelVisibleVal,
		SelCurPageVal: SelCurPageVal,
		ChangeSelVisibility: ChangeSelVisibility,
		ShowAll: ShowAll,
		InvertHidden: InvertHidden,
		getNumSelected: getNumSelected, 
		getTotalNumChars: getTotalNumChars, 
		getNumHidden: getNumHidden,
		setSelectedVal: setSelectedVal,
		changeSelectedChars: changeSelectedChars,

		ChangePageDimensions: ChangePageDimensions,
		setTag: setTag,

		userChangedDamage: userChangedDamage,
		userChangedHealth: userChangedHealth,
		userChangedElite: userChangedElite,
		userChangedXP: userChangedXP,
		userChangedSp1Bars: userChangedSp1Bars,
		userChangedSp2Bars: userChangedSp2Bars,
		userChangedSuperBars: userChangedSuperBars,
		userChangedCritChance: userChangedCritChance,
		userChangedCritDamage: userChangedCritDamage,
		userChangedGearSlots: userChangedGearSlots,
		userChangedInStore: userChangedInStore,
		userChangedExtraCards: userChangedExtraCards,
		
		foreachName: foreachName,
		foreachTitle: foreachTitle,
		foreachCharKey: foreachCharKey,
		setHidden: setHidden,
		getColumnsToShow: getColumnsToShow,
		setColumnsToShow: setColumnsToShow,
		getCharData: getCharData,
		getNameOrTitle_FilterVal: getNameOrTitle_FilterVal,
		setFilterRange: setFilterRange,
		setEliteFilter: setEliteFilter,
		setNameAndTitleFilters: setNameAndTitleFilters,
		setColorFilter: setColorFilter,
		getRangeFilter: getRangeFilter,
		getColorsFilter: getColorsFilter,
		getEliteFilter: getEliteFilter,
	
		getAllCharBonusCards: getAllCharBonusCards,
		setAllCharsBonuses: setAllCharsBonuses,
		getBonusForCharName: getBonusForCharName,
		setCharBonuses: setCharBonuses,
		recalculateAfterBonusesChange: recalculateAfterBonusesChange,
		getTag: getTag,
		changeAllToMaxWithAug: changeAllToMaxWithAug
	}
})();
}
if(typeof CCIM_Restore == 'undefined'){
var CCIM_Restore = (function() {
	/*jshint asi:true*/

	var fileToLoadPopup=null
	var loadFromServerPopup=null
	var lastLoadStr = '';
	var lastHash = '';
	var requestedHash='';

	function restoreNonTableValues() {
		CCIM_MakeCharTable.replaceCharTable()
		CCIM_CurrentPage.displayCurrentPage()

		CCIM_Main.setColor(CCIM_Data.getColorTheme())
		document.querySelector('#darkThemeCheckBox').checked = CCIM_Data.getColorTheme() == "whiteonblack"

		document.querySelector('#tag').value = CCIM_Data.getTag()
		
		var sortKey = CCIM_Data.getSortKey()
		var sortedBySelect = document.querySelector('#sortCharsBy')
		var opt=0
		for (; opt < sortedBySelect.options.length; opt++) {
			if (sortedBySelect.options[opt].value.replaceSpcs("") == sortKey){
				sortedBySelect.selectedIndex = opt
				break
			}
		}
	}

	function onChangeFileToLoad(e1)
	{
		var fileSelected = document.getElementById('txtfiletoload');
		if (!fileSelected) {
			console.log("Can't find element 'txtfiletoload'")
			return
		}
		if(fileSelected.files.length < 1) {
			console.log("onChangeFileToLoad: Can't find file")
			return
		}			
		var fileExtension = /text.*/;
		var fileTobeRead = fileSelected.files[0];
		if (fileTobeRead.type.match(fileExtension))
		{
			var fileReader = new FileReader();
			fileReader.onload = function (e2)
			{
				var tempStr = fileReader.result;
				var restoreData = CCIM_Data.isRestoreDataOkay(tempStr)
				if(restoreData) {
					lastLoadStr = tempStr
					lastHash = ''
					CCIM_Data.restoreSavedData(LAM.gelbi('restorePrefsFromFile').checked, LAM.gelbi('restoreFiltersFromFile').checked, restoreData, lastHash)
					CCIM_MakeCharTable.replaceCharTable()
					CCIM_CurrentPage.displayCurrentPage()
					//CCIM_Main.setColor(CCIM_Data.getColorTheme())
					//document.querySelector('#sortCharsBy').value = CCIM_Data.getSortKey()
					restoreNonTableValues()
					doCloseLoadFromFile()
				}
			};
			fileReader.readAsText(fileTobeRead);
		}
		else 
			alert("Please select a text file");
		return false
	}

	function LoadFromFileCmd() {
		if(!fileToLoadPopup) {
			fileToLoadPopup = Popup.show('loadFromFileDiv')
			fileToLoadPopup.autoHide = false
		}
		else
			fileToLoadPopup.show()
	}
	function doCloseLoadFromFile(){
		if(fileToLoadPopup)
		fileToLoadPopup.hide()
	}

	function getToCFromServer() {
		var divEl = LAM.gelbi('savedcollections')
		if(divEl) {
			switch (this.readyState) {
				case 4:
				console.log(LAM.nowString() + " Server responded to 'get toc'. Length: " + this.responseText.length)
				divEl.innerHTML = this.responseText;
				this.onreadystatechange = null;
				break;
			}
		}
	}
	
	function refreshSavedCollections() {
		var divEl = LAM.gelbi('savedcollections')
		if(divEl) {
			var php_file = 'gettoc.php'
			var method='POST'
			var data="data="
			console.log(LAM.nowString() + " Contacting server to get toc.")
			Ajax.AjaxSend(php_file, method, data, getToCFromServer)
		}
	}
	
	function showLoadFromServer() {
		refreshSavedCollections()
		loadFromServerPopup.show()
	}

	function restoreDataFromServer(){
		switch (this.readyState) {
			case 4:
				console.log(LAM.nowString()+": Server response received. Response length: " + this.responseText.length);
				CCIM_Main.showMessagesPopup(false,"Processing server response...<br>")
				var splits = this.responseText.split('\n', 1);
				if (splits.length > 0){
					var firstLine = splits[0];
					var diff = this.responseText.length - firstLine.length - 1;
					var parts = firstLine.split('=');
					if(parts.length > 1){
						var target = LAM.parseInteger(parts[1]);
						console.log(LAM.nowString()+": Verifying...");
						CCIM_Main.showMessagesPopup(false,"Verifying data...<br>")
						if (target == diff){ //basic check - is the length what the server said it should be?
							var toBeHashed = this.responseText.substr(-1 * target);
							var hash = MD5(toBeHashed);
							if (requestedHash == hash){
								var restoreData = CCIM_Data.isRestoreDataOkay(toBeHashed)
								if(restoreData) {
									CCIM_Main.showMessagesPopup(false,"Restoring data...<br>")
									console.log(LAM.nowString()+": restoring")
									lastLoadStr = toBeHashed
									lastHash = hash
									CCIM_Data.restoreSavedData(
										LAM.gelbi('restorePrefsFromServer').checked, 
										LAM.gelbi('restoreFiltersFromServer').checked, 
										restoreData, lastHash)
									console.log(LAM.nowString()+": calling replaceCharTable")
									restoreNonTableValues()
									console.log(LAM.nowString()+": Finished, hiding popup")
									loadFromServerPopup.hide()
									CCIM_Main.showMessagesPopup(false, "Finished<br>")
								}
							}
						}
					}
				}
				// prevent memory leaks:
				this.onreadystatechange = null;
				break;
		}
	}
	
	function restoreFromHash(hashCode){
		CCIM_Main.showMessagesPopup(true,"")

		console.log("hashCode: '%s'", hashCode)
		if(hashCode!=''){
			CCIM_Main.showMessagesPopup(true,"Contacting server...<br>")
			console.log(LAM.nowString()+": Restoring collection");
			requestedHash = hashCode
			var php_file = 'getCCIM.php';
			var method='POST';
			var data="data="+encodeURIComponent(hashCode);
			console.log(LAM.nowString() + " Contacting server to get data to restore.")
			Ajax.AjaxSend(php_file, method, data, restoreDataFromServer)
			console.log(LAM.nowString()+": Request sent to server. Waiting for response");
		}
	}

	loadFromServerPopup = new Popup('loadFromServerDiv')
	loadFromServerPopup.constrainToScreen = true
	loadFromServerPopup.autoHide = false

return {
	onChangeFileToLoad: onChangeFileToLoad,
	LoadFromFileCmd: LoadFromFileCmd,
	doCloseLoadFromFile: doCloseLoadFromFile,
	loadFromServerPopup: loadFromServerPopup,
	showLoadFromServer: showLoadFromServer,
	restoreFromHash: restoreFromHash
	}
})();
}

if(typeof CCIM_Save == 'undefined'){
var CCIM_Save = (function() {
	/*jshint asi:true*/

	function saveToFile()
	{
		var elem  = document.querySelector(".save_data_link");
		if(elem)
			elem.click();
		return true;
	}

	function createSaveLink(parentNode)
	{
		var link = document.createElement('a')
		link.innerHTML = 'Save to File'
		link.className += "save_data_link"
		link.addEventListener('click',
			function(ev)
			{
				link.target = '_blank'
				link.href = 'data:text/plain;charset=utf-8,' + encodeURI(CCIM_Data.getDataToSave() )
				link.download = 'igauCharacters.txt'
			}, false)
		parentNode.appendChild(link)
		return false
	}

	function createSaveLinks()
	{
		var elements = document.getElementsByClassName("savedata")
		for (var i=0; i<elements.length; i++)
			createSaveLink(elements[i])
		return false
	}

	function rangeCheck(fld, min, max, charData, result) {
		var val = charData[fld], num

		while (fld.length < 10) fld = fld + ' '
		//fld = fld.replace(/ /g, "&nbsp;")
		
		var TitleName = charData.Title + " " + charData.Name 
		while(TitleName.length < 34) TitleName = ' ' + TitleName
		//TitleName = TitleName.replace(/ /g, "&nbsp;")
		
		if (!LAM.isInteger(val)) {
			result.push(TitleName + ": " + fld + " '" + val + "' isn't an integer")
			return false
		}
		else {
			num = LAM.parseNumber(val)
			if (num < min || num > max) {
				result.push(TitleName+": " + fld + ": '" + val + "' isn't in the range " + min + " to " + max)
				return false
			}
		}
		return true
	}
	
	function ValidateCharData(charKey) {
		var charData = CCIM_Data.getCharData(charKey)

		rangeCheck('elite', 0, 10, charData, this)
		rangeCheck('xp', 0, 60, charData, this)
		rangeCheck('damage', 0, 1000000, charData, this)
		rangeCheck('health', 0, 1000000, charData, this)
		rangeCheck('gearSlots', 1, 3, charData, this)
		rangeCheck('sp1Bars', 1, 10, charData, this)
		rangeCheck('sp2Bars', 0, 10, charData, this)
		rangeCheck('superBars', 0, 10, charData, this)
		rangeCheck('extraCards', 0, 10000, charData, this)
	}
	
	function validateUserData() {		
		var result = []
		CCIM_Data.foreachCharKey(ValidateCharData, result)
		
		if(result.length > 0) {
			showMessage("Results:<br>" + result.join('<br>'))
		}
		else {
			showMessage("Data is valid")
		}
	}

	function getServerResponseToSave()
	{
		switch (this.readyState) {
			case 4:
				console.log("Received Server Response to Save at " + LAM.nowString() + ", " + this.responseText + ".")
				showMessage("Received Server Response to Save at " + LAM.nowString() + "<br>Response: [" + this.responseText + "]")
				this.onreadystatechange=null;
				break;
		}
	}
	
	function saveToServer(){
		if(typeof Ajax.AjaxSend != 'function'){
			alert('Save: Ajax.Ajaxsend() is not available');
			return false
		}
		if (CCIM_Data.getTag() === "") {
			alert("'Tag' is a required field")
			return false
		}
		var php_save_file = 'saveCCIM.php'
		var method='POST'
		var data= "tag=" + encodeURIComponent(CCIM_Data.getTag()) + "&form="+encodeURIComponent(CCIM_Data.getDataToSave(true))
		console.log(LAM.nowString() + " Contacting server to save data.")
		Ajax.AjaxSend(php_save_file, method, data, getServerResponseToSave)
	}

	createSaveLinks()

return {
	saveToFile: saveToFile,
	validateUserData: validateUserData,
	saveToServer: saveToServer
	}
})();
}
if(typeof CCIM_Filters == 'undefined'){
var CCIM_Filters = (function() {
	/*jshint asi:true*/

	var changeFiltersPopup = new Popup('filtersFormDiv')
	changeFiltersPopup.autoHide = false
	changeFiltersPopup.constrainToScreen = true
	var rangeDefinitions = [ /* minElId, maxElId, characterData property name, type of data to expect in minEl/maxEl */
				['minDamageFilter', 'maxDamageFilter', 'damage', 'integer'],
				['minHealthFilter', 'maxHealthFilter', 'health', 'integer'],
				['minDamagePlusHealthFilter', 'maxDamagePlusHealthFilter', 'DamagePlusHealth', 'integer'],
				['minSp1MinFilter', 'maxSp1MinFilter', 'Sp1Min', 'integer'],
				['minSp2MinFilter', 'maxSp2MinFilter', 'Sp2Min', 'integer'],
				['minSuperFilter', 'maxSuperFilter', 'Super', 'integer'],
				['minXPFilter', 'maxXPFilter', 'xp', 'integer'],
				['minBaseDamageFilter', 'maxBaseDamageFilter', 'StoreDamage', 'integer'],
				['minBaseHealthFilter', 'maxBaseHealthFilter', 'StoreHealth', 'integer'],
				['minBaseDamagePlusHealthFilter', 'maxBaseDamagePlusHealthFilter', 'BaseDamagePlusHealth', 'integer'],
				['minCostFilter', 'maxCostFilter', 'Cost', 'integer'],
				['minGearSlotsFilter', 'maxGearSlotsFilter', 'gearSlots', 'integer'],
				['minElitePlusExtraCardsFilter', 'maxElitePlusExtraCardsFilter', 'ElitePlusExtraCards', 'integer']
				]

	function setRangesElementValues() {//get range values from Data and put onto the form
		var numRanges = rangeDefinitions.length
		var range, minElId, maxElId, minEl, maxEl, minAndMax,propName

		for(var i=0; i<numRanges; ++i) {
			range = rangeDefinitions[i]
			minElId = range[0]
			maxElId = range[1]
			propName = range[2]
				
			minEl = LAM.gelbi(minElId)
			maxEl = LAM.gelbi(maxElId)
			minAndMax = CCIM_Data.getRangeFilter(propName)
			if(minAndMax) {
				minEl.value = minAndMax.min
				maxEl.value = minAndMax.max
			}
		}
	}
	function setColorFilterValues() {
		var filt = CCIM_Data.getColorsFilter()
		LAM.gelbi('colorFilterGold').checked = filt.Gold? true : false
		LAM.gelbi('colorFilterSilver').checked = filt.Silver? true : false
		LAM.gelbi('colorFilterBronze').checked = filt.Bronze? true : false
	}
	function setEliteFilterValues() {//id=eliteFilter0 thru eliteFilter7
		var filt = CCIM_Data.getEliteFilter(), el
		for (var e=0; e<8; ++e) {
			el = LAM.gelbi('eliteFilter' + e)
			el.checked = filt['e' + e] ? true : false
		}
	}

	function saveFilters(composite) {
		var i, numRanges, range
		
		numRanges = composite.rangesData.length
		for(i=0; i<numRanges; ++i) {
			range = composite.rangesData[i]
			CCIM_Data.setFilterRange(range.propName, range.minVal, range.maxVal)
		}
		CCIM_Data.setEliteFilter(composite.eliteSet)
		CCIM_Data.setNameAndTitleFilters(composite.nameSet, composite.titleSet)
		CCIM_Data.setColorFilter(composite.colorSet)
	}

	function applyFilters() {
		var composite = {
			nonMatchingChars:[],
			rangesData: getRangesData(),
			nameSet: getChecked('nameFilterSet'),
			titleSet: getChecked('titleFilterSet'),
			eliteSet: getChecked('eliteFilterSet'),
			colorSet: getChecked('colorFilterSet')
		}//end of composite object

		CCIM_Data.foreachCharKey(matchCharacter, composite)
		CCIM_Data.setHidden(composite.nonMatchingChars)//Hide any characters which did not match the filters
		saveFilters(composite)// save the filters to Data
	}

	function getChecked(id){
		//returns an array of values which were checked
		var elements,i,len,element,list;
		try{
			elements = document.querySelectorAll('#'+id + ' input[type="checkbox"]:checked')
			len = elements.length
			list = []

			for (i=0; i<len; ++i){
				element = elements[i]
				list.push(element.value)
			}
		}
		catch(e){
			LAM.$cerror(e)
		}
		return list
	}

	function matchCharacter(charKey,idx,arr) {
		var matchesSoFar = true
		var characterData = CCIM_Data.getCharData(charKey)
		var SpMinMax
		
		if (!characterData.Sp1Min) {
			SpMinMax = CCIM_Data.getSpMinAndMax(1, characterData.Name, characterData.Title, characterData.damage, characterData.sp1Bars)
			characterData.Sp1Min = SpMinMax.Min
		}
		if(!characterData.Sp2Min) {
			SpMinMax = CCIM_Data.getSpMinAndMax(2, characterData.Name, characterData.Title, characterData.damage, characterData.sp1Bars)
			characterData.Sp2Min = SpMinMax.Min
		}
		characterData.Super = CCIM_Data.getSuper(characterData.Name, characterData.Title, characterData.damage, characterData.superBars)
		characterData.DamagePlusHealth = characterData.damage + characterData.health
		characterData.BaseDamagePlusHealth = characterData.StoreDamage + characterData.StoreHealth
		characterData.ElitePlusExtraCards = LAM.parseInteger(characterData.elite) + LAM.parseInteger(characterData.extraCards);

		if (matchesSoFar && !matchRanges(characterData, this.rangesData)) {
			//console.log("%s didn't match ranges", characterData.charkey)
			matchesSoFar = false
		}		
		if(matchesSoFar && this.nameSet.indexOf(characterData.Name)<0 ) {
			//console.log("Name %s didn't match", characterData.Name)
			matchesSoFar = false		
		}
		if(matchesSoFar && this.titleSet.indexOf(characterData.Title)<0) {
			//console.log("Title %s didn't match", characterData.Title)
			matchesSoFar = false
		}
		
		if (matchesSoFar && (this.eliteSet.indexOf('e'+characterData.elite) < 0)) {
			//console.log("%s, %s didn't match %o", characterData.charkey, 'e'+characterData.elite, this.eliteSet)
			matchesSoFar = false
		}
		
		if (matchesSoFar && (this.colorSet.indexOf(characterData.Color) < 0)) {
			//console.log("%s, %s didn't match %o", characterData.charkey, characterData.Color, this.colorSet)
			matchesSoFar = false
		}
		
		if(!matchesSoFar) {
			this.nonMatchingChars.push(charKey)
		}
	}

	function getRangesData() { // get user input range values from the form
			var numRanges = rangeDefinitions.length// rangeDefinitions = a constant array in this module
			var range, minElId, maxElId, propType, minEl, maxEl
			var retval = [], rangeObj
			
			for(var i=0; i<numRanges; ++i) {
				rangeObj = {} // new object
				range = rangeDefinitions[i]
				minElId = range[0]
				maxElId = range[1]
				rangeObj.propName = range[2]
				propType = range[3]
				
				minEl = LAM.gelbi(minElId)
				maxEl = LAM.gelbi(maxElId)
				
				if (propType == 'integer') {
					rangeObj.minVal = LAM.parseInteger(minEl.value)
					rangeObj.maxVal = LAM.parseInteger(maxEl.value)
				}
				else {
					rangeObj.minVal = LAM.parseNumer(minEl.value)
					rangeObj.maxVal = LAM.parseNumer(maxEl.value)
				}
				retval.push( rangeObj )
			}
			return retval // an array of rangeObj objects, from the form. propName, minVal, maxVal
	}

	function matchRanges(characterData, rangesData) {
		try {
			var i, numRanges, range, val
			
			numRanges = rangesData.length
			for (i=0; i < numRanges; ++i) {
				range = rangesData[i]
				val = characterData[range.propName]
				if (val < range.minVal || val > range.maxVal) {
					//console.log("%s %s val %d not in range %d to %d", characterData.charkey, range.propName, val, range.minVal, range.maxVal)
					return false
				}
			}
		}
		catch (ex) {
			showMessage(ex.message)
		}
		return true
	}

	function createNameOrTitleCheckbox(nameOrTitle)
	{
		var key, keyNoSpaces, label, input, li

		key=nameOrTitle
		keyNoSpaces = key.replaceSpcs('_')

		label = document.createElement("label")
		label.textContent = key
				
		input = document.createElement("input")	

		input.type = "checkbox"
		input.id=this.which+"Filter["+keyNoSpaces+"]"
		input.name=this.which+"Filter[]"
		input.value=key
		input.checked=CCIM_Data.getNameOrTitle_FilterVal(this.which,nameOrTitle)

		li = document.createElement("li")
		li.appendChild(input)
		li.appendChild(label)//put label into a new list element
		this.ul.appendChild(li)//put list element into unordered list
	}
	function initNameOrTitleFilter(which){
		var parent, docFragment, ul
		try{
			docFragment = document.createDocumentFragment()
			ul = document.createElement("ul")
			docFragment.appendChild(ul)

			if (which.toLowerCase()=="name")
				CCIM_Data.foreachName(createNameOrTitleCheckbox, {which:which, ul:ul} )
			else
				CCIM_Data.foreachTitle(createNameOrTitleCheckbox, {which:which, ul:ul} )
			
			parent = LAM.gelbi(which+'FilterSet')
			if(parent){
				parent.appendChild(docFragment)//put doc fragment inside the filter section
			}
		}
		catch(e){
			LAM.$cerror(e)
		}
		return false
	}
	function addNameAndTitleFilters() {
		initNameOrTitleFilter('name')
		initNameOrTitleFilter('title')
	}
	function showFilters() {
		addNameAndTitleFilters()
		setRangesElementValues()
		setColorFilterValues()
		setEliteFilterValues()
		changeFiltersPopup.show()
	}
	
	function hideFilters() {
		var composite = {// get the user input data from the form
			rangesData: getRangesData(),
			nameSet: getChecked('nameFilterSet'),
			titleSet: getChecked('titleFilterSet'),
			eliteSet: getChecked('eliteFilterSet'),
			colorSet: getChecked('colorFilterSet')
		}//end of composite object
		
		saveFilters(composite)//save user input filters to Data

		changeFiltersPopup.hide()

		removeNameOrTitleFilterSetChild('name')
		removeNameOrTitleFilterSetChild('title')		
	}
	function removeNameOrTitleFilterSetChild(which){
		var elements,i,el,par
		elements = document.querySelectorAll("#" + which + "FilterSet ul")
		for (i=elements.length-1; i>=0; --i){
			el = elements[i]
			par = el.parentNode
			par.removeChild(el)
		}
	}

	function setCheckboxes(whichSet, flag) {
		var elements,i,len;
		elements = document.querySelectorAll('#' + whichSet + ' input[type="checkbox"]')
		len = elements.length
		for (i=0; i<len; ++i){
			elements[i].checked = flag
		}
		return false
	}

	return {
		showFilters: showFilters, // show filters popup form. add name/title checks, initialize all elements from Data
		hideFilters: hideFilters, // save filters to Data, hide filters popup form, remove name/title checkboxes
		setCheckboxes: setCheckboxes, // change the whole set of checkboxes for name(or title) to true or false
		applyFilters: applyFilters // match filters against characters, hide chars which don't match, save filters to Data
	}
})();
}
if(typeof CCIM_ConfigColumns == 'undefined'){
var CCIM_ConfigColumns = (function() {
	/*jshint asi:true*/

	var configColsPopup=null

	function showConfigureColumns() {
		selectColumnOptionsFromData()
		onchangeDisplayColumns()
		configColsPopup.show()
	}
	function onchangeDisplayColumns() {
		var els = document.querySelectorAll('#displayColumns option' )
		var par, el, c,len,selectedCols,selectedColNames, parts, removeFromList, leaveOnList, addToList,addToListNames,colname
		selectedCols = []
		selectedColNames = []
		
		len = els.length
		for(c=0;c<len;++c) {
			if(els[c].selected) {
				selectedCols.push(els[c].value)
				selectedColNames.push(els[c].innerHTML)
			}
		}
		
		els = document.querySelectorAll('#selectedDisplayColumns li')
		
		removeFromList = []
		leaveOnList = []
		len = els.length
		for(c=0;c<len;++c) {
			parts = els[c].id.split('_')
			if (selectedCols.indexOf(parts[1]) < 0)
				removeFromList.push(parts[1])
			else
				leaveOnList.push(parts[1])
		}
		addToList = []
		addToListNames = []
		len = selectedCols.length
		for(c=0;c<len;++c) {
			if (leaveOnList.indexOf(selectedCols[c]) < 0) {
				addToList.push(selectedCols[c])
				addToListNames.push(selectedColNames[c])
			}
		}
		
		len = removeFromList.length
		for(c=0;c<len;++c) {
			el = document.querySelector('#selCol_' + removeFromList[c])
			if(el) {
				if (el.onclick){
					console.log("Removing 'onclick' handler for '%s'", el.id)
					el.onclick = null
				}
				el.parentNode.removeChild(el)
			}
		}
		
		par = document.querySelector('#selectedDisplayColumns')
		len = addToList.length
		for(c=0;c<len;++c) { // add newly selected columns to the list:
			el = document.createElement("li")
			colname = addToList[c]
			el.id = "selCol_" + colname
			el.innerHTML = addToListNames[c]
			par.appendChild(el)
			
			console.log("Adding 'onclick' handler for '%s'", el.id)
			el.onclick = onClickHandlerFunc
		}//end for loop
	}// end onchangeDisplayColumns()

	function onClickHandlerFunc() {
		var prevSelected, prev
		var par = this.parentNode
		
		if (typeof par.selected != 'string') {
			prevSelected = ''
			prev = null
		}
		else {
			prevSelected = par.selected
			prev = document.querySelector('#' + prevSelected)
		}

		if (this.id == prevSelected) { // deselect previously selected
			par.selected = null 
		}
		else { // current is different from previously selected
			this.style.color = "white"
			this.style.backgroundColor = "#3399FF"
			par.selected = this.id
		}
		if(prev){
			prev.style.color = "indigo"
			prev.style.backgroundColor = "#fffacd"
		}						
	} // end onclick handler function

	function moveSelectedColToBottom() {
		var par,  selectedStr, selected, lastEl
		
		par = document.querySelector('#selectedDisplayColumns')
		if (par) {
			lastEl = par.lastElementChild
			
			selected = null
			selectedStr = par.selected
			if(typeof selectedStr == 'string')
				if (selectedStr !== '')
					selected = document.querySelector('#' + selectedStr)
				
			if (lastEl && selected && lastEl.id != selected.id) {
				par.insertBefore(selected, null)
			}
		}		
	}
	function moveSelectedColToTop() {
		var par, firstEl, selectedStr, selected
		
		par = document.querySelector('#selectedDisplayColumns')
		if (par) {
			firstEl = par.firstElementChild
			
			selected = null
			selectedStr = par.selected
			if(typeof selectedStr == 'string')
				if (selectedStr !== '')
					selected = document.querySelector('#' + selectedStr)
				
			if (firstEl && selected && firstEl.id != selected.id) {
				par.insertBefore(selected, firstEl)
			}
		}
	}
	function moveSelectedColUp() {
		var par, selected, selectedStr,previousSib
		
		par = document.querySelector('#selectedDisplayColumns')
		if (par) {
			selected = null
			selectedStr = par.selected
			if(typeof selectedStr == 'string') {
				if (selectedStr !== '') {
					selected = document.querySelector('#' + selectedStr)
					if (selected) {
						previousSib = selected.previousElementSibling
						if (previousSib) {
							par.insertBefore(selected, previousSib)
						}
					}
				}
			}
		}
	}
	function selectColumnOptionsFromData() {
		var colList = CCIM_Data.getColumnsToShow()
		var optionEls = document.querySelectorAll('#displayColumns option' )
		var o, numOpts, opt
		
		numOpts = optionEls.length
		for(o=0; o<numOpts; ++o) {
			opt = optionEls[o]
			if (colList.indexOf(opt.value) >= 0) // if this <option> of <select> is in preferences to be shown, select it 
				opt.selected = true
			else
				opt.selected = false
		}
	}
	function moveSelectedColDown() {
		var par, selected, selectedStr,nextSib
		
		par = document.querySelector('#selectedDisplayColumns')
		if (par) {
			selected = null
			selectedStr = par.selected
			if(typeof selectedStr == 'string') {
				if (selectedStr !== '') {
					selected = document.querySelector('#' + selectedStr)
					if (selected) {
						nextSib = selected.nextElementSibling
						if(nextSib) {
							nextSib = nextSib.nextElementSibling
							par.insertBefore(selected, nextSib)
						}
					}
				}
			}
		}
	}
	function applyChangedConfig() {
		var list = []
		var selectedColEls = document.querySelectorAll('#selectedDisplayColumns li')
		var numSel = selectedColEls.length
		var c,selColEl,parts,selCol,saveStr,dataObj
		
		for(c=0;c<numSel;++c) {
			selColEl = selectedColEls[c]
			parts = selColEl.id.split('_')
			selCol = parts[1]
			list.push(selCol)
		}
		CCIM_Data.setColumnsToShow(list)
		
		saveStr = CCIM_Data.getDataToSave()
		dataObj = CCIM_Data.isRestoreDataOkay(saveStr)
		
		if(dataObj) {
			CCIM_MakeCharTable.replaceCharTable() // destroys unsaved data on the form
			CCIM_Data.restoreSavedData(true, true, dataObj) // restore the data to the form. Is this really necessary?
			CCIM_CurrentPage.displayCurrentPage() // redisplay the current page, with the new columns
		}
		configColsPopup.hide()
		CCIM_MakeCharTable.handleResize()
	}
	function doClose() {
		configColsPopup.hide()
	}
	
	configColsPopup = new Popup('configColsDiv')
	configColsPopup.constrainToScreen = true;
	configColsPopup.autoHide = false;
	
	return {
		showConfigureColumns: showConfigureColumns,
		onchangeDisplayColumns: onchangeDisplayColumns,
		moveSelectedColToTop: moveSelectedColToTop,
		moveSelectedColToBottom: moveSelectedColToBottom,
		moveSelectedColDown: moveSelectedColDown,
		moveSelectedColUp: moveSelectedColUp,
		applyChangedConfig: applyChangedConfig,
		doClose: doClose
	}

})();
}
if(typeof CCIM_Bonuses == 'undefined'){
var CCIM_Bonuses = (function() {
	/*jshint asi:true*/

	var supportCardsPopup=null
	supportCardsPopup = new Popup('supportCardsDiv')
	supportCardsPopup.autoHide = false

	function setChecks (assocArray) {
		for (var prop in assocArray) {
			if (assocArray.hasOwnProperty(prop)) {
				LAM.gelbi(prop).checked = assocArray[prop] ? true : false
			}
		}
	}
	function showChangeBonuses() {
		addCharBonusesRows() //sets checked from Data
		var allCharBonuses = CCIM_Data.getAllCharBonusCards()
		setChecks(allCharBonuses.damage)
		setChecks(allCharBonuses.health)
		supportCardsPopup.show()
	}
	function getChecked(id){
		//returns an array of values which were checked
		var elements,i,len,list;
		try{
			elements = document.querySelectorAll('#'+id + ' input[type="checkbox"]:checked')
			len = elements.length
			list = []
			for (i=0; i<len; ++i)
				list.push(elements[i].value)
		}
		catch(e){
			LAM.$cerror(e)
		}
		return list
	}
	
	function applyBonusChanges() {
		CCIM_Data.setAllCharsBonuses( getChecked('dmgBonusSet'), getChecked('hthBonusSet') ) //save user checks to Data
		
		var checked = getChecked('CharBonusesTable')
		var i,len=checked.length,parts,Bonuses={},name,which
		for(i=0; i<len; ++i) {
			parts = checked[i].split('.')
			name=parts[1]
			which=parts[0]
			if (!Bonuses[name])
				Bonuses[name] = {damage:0,health:0}
			Bonuses[name][which] = 1
		}
		CCIM_Data.setCharBonuses(Bonuses)
		supportCardsPopup.hide()
		removeCharBonusesRows()
	}

	function addCharBonusRow(name) {
		var row, nameTxt, nameCell, dmgChkbx, dmgCell, hthChkbx, hlthCell
		var dataBonuses = CCIM_Data.getBonusForCharName(name)
		
		row = document.createElement("tr")
		nameTxt = document.createTextNode(name)
		nameCell = document.createElement("td")
		nameCell.style.border = "1px solid indigo"
		
		dmgChkbx = document.createElement("input")
		dmgChkbx.type="checkbox"
		dmgChkbx.checked = dataBonuses.DamageBonus?true:false
		dmgChkbx.value = "damage."+name

		dmgCell = document.createElement("td")
		dmgCell.style.border = "1px solid indigo"
		dmgCell.style.backgroundColor = "#9cdeff"
		dmgCell.style.color = "black"
		
		hthChkbx = document.createElement("input")
		hthChkbx.type="checkbox"
		hthChkbx.checked = dataBonuses.HealthBonus?true:false
		hthChkbx.value = "health."+name

		hlthCell = document.createElement("td")
		hlthCell.style.border = "1px solid indigo"
		hlthCell.style.backgroundColor = "#FF3c3c"
		hlthCell.style.color = "black"
						
		nameCell.appendChild(nameTxt)
		dmgCell.appendChild(dmgChkbx)
		hlthCell.appendChild(hthChkbx)				
		row.appendChild(nameCell)
		row.appendChild(dmgCell)
		row.appendChild(hlthCell)				
		this.appendChild(row)
	}

	function addCharBonusesRows() {
		var tbody = document.querySelector("#CharBonusesTable tbody")
		if(tbody && tbody.rows)
			CCIM_Data.foreachName(addCharBonusRow, tbody)
	}

	function setCheckboxes(flag) {
		var elements,i,len;
		try{
			elements = document.querySelectorAll('#CharBonusesTable input[type="checkbox"]')
			len = elements.length
			for (i=0; i<len; ++i)
				elements[i].checked = flag
		}
		catch(e){
			LAM.$cerror(e)
		}
	}
	
	function removeCharBonusesRows() {
		var toRemv = document.querySelector("#CharBonusesTable tbody")
		var len = toRemv.length
		for(var r=0; r<len; ++r)
			toRemv[r].parentNode.removeChild(toRemv[r])
		
		document.querySelector("#CharBonusesTable").appendChild(document.createElement("tbody"))
	}

	return {
		showChangeBonuses: showChangeBonuses,
		setCheckboxes: setCheckboxes,
		applyBonusChanges: applyBonusChanges
	}
})();
}
if(typeof CCIM_CurrentPage == 'undefined'){
var CCIM_CurrentPage = (function() {
	/*jshint asi:true*/

	var changeSelectedPopup=null
	changeSelectedPopup = new Popup('changeSelectedDiv')
	changeSelectedPopup.constrainToScreen = true;

	function displayCurrentPage() {
		var el = document.querySelector('#CharTable tbody')
		var charData, cpp
		cpp = CCIM_Data.getCharsPerPage()
		var tdEls = get_elements_from_body(cpp, "td", el, 
			["Name", "Title", "Color", "BaseDamage", "BaseHealth", //5
				"BaseDamagePlusHealth", "DamagePlusHealth", "Cost", "Resale",  //4
				"Sp1Min", "Sp1Max", "Sp2Min", "Sp2Max", "Super", // 5
				"DamageAug", "HealthAug", "ElitePlusExtraCards"]) //3
		var inputEls = get_elements_from_body(cpp, "input", el,
			[ "Select", "Elite", "XP", "Damage", "Health", "Sp1Bars", "Sp2Bars", "SuperBars",
				"CritChance", "CritDamage", "GearSlots", "InStore", "ExtraCards" ])		
		// for each character on page
		for(var c=0; c<cpp; ++c) {
			charData = CCIM_Data.getCharDataForOffset(c)
			if (!charData.charkey || charData.charkey === '') {
				clearRowDisplay(c, tdEls, inputEls, el)
			}
			else {
				displayCharRow(c, tdEls, inputEls, el, charData)
			}
		}//end for each char
		displayCurPageNum()
	}//end displayCurrentPage()

	function displayCurPageNum() {
		var els = document.querySelectorAll('#curPageNum')
		var pageNumStr = CCIM_Data.getCurPageNum() + "/" + CCIM_Data.getNumPages() 
		
		for(var c=0; c<els.length; ++c) {
			els[c].innerHTML = pageNumStr
		}
	}
	
	function clearRowDisplay(c, tdEls, inputEls, el) {
		var color
				if (CCIM_Data.getColorTheme() == 'whiteonblack')
					color = 'black'
				else
					color = 'white'
		
				setValue('innerHTML', c, tdEls.Name, '')
				setValue('innerHTML', c, tdEls.Title, '')
				setValue('innerHTML', c, tdEls.BaseDamage, '')
				setValue('innerHTML', c, tdEls.BaseHealth, '')
				setValue('innerHTML', c, tdEls.BaseDamagePlusHealth, '')
				setValue('innerHTML', c, tdEls.Cost, '')
				setValue('innerHTML', c, tdEls.Resale, '')
				setValue('checkbox', c, inputEls.Select, 0)
				setValue('', c, inputEls.Elite, '')
				setValue('', c, inputEls.XP, '')
				setValue('', c, inputEls.Damage, '')
				setValue('', c, inputEls.Health, '')
				setValue('', c, inputEls.GearSlots, '')
				setValue('checkbox', c, inputEls.InStore, 0)
				setValue('', c, inputEls.ExtraCards, '')
				setValue('', c, inputEls.Sp1Bars, '')
				setValue('', c, inputEls.Sp2Bars, '')
				setValue('', c, inputEls.SuperBars, '')
				setValue('', c, inputEls.CritChance, '')
				setValue('', c, inputEls.CritDamage, '')
				setValue('innerHTML', c, tdEls.DamagePlusHealth, '')

				setValue('innerHTML', c, tdEls.Sp1Min, '')
				setValue('innerHTML', c, tdEls.Sp1Max, '')

				setValue('innerHTML', c, tdEls.Sp2Min, '')
				setValue('innerHTML', c, tdEls.Sp2Max, '')
				
				setValue('innerHTML', c, tdEls.Super, '')
				setValue('innerHTML', c, tdEls.ElitePlusExtraCards, '')
				
				if(c >= 0 && c < el.rows.length) 
				{
					el.rows[c].style.color = color
					el.rows[c].style.backgroundColor = color
					el.rows[c].style.border = "1px solid"
				}
	}
	
	function setValue(which, offset, subEls, newVal) {
		if (!subEls)
			return false
		if(offset >= 0 && offset < subEls.length) {
			if (which == 'innerHTML') {
				if (subEls[offset].innerHTML != newVal)//only change innerHTML if it is different
					subEls[offset].innerHTML = newVal
			}
			else if (which == 'checkbox') {
				subEls[offset].checked = newVal ? true : false
			}
			else {
				if (subEls[offset].value != newVal)//on change value if it is different
					subEls[offset].value = newVal
			}
			return true
		}
		else
			return false
	}

	function displayCharRow(c, tdEls, inputEls, el, charData) {
			// 7 constant values:
			setValue('innerHTML', c, tdEls.Name, charData.Name)
			setValue('innerHTML', c, tdEls.Title, charData.Title)
			setValue('innerHTML', c, tdEls.BaseDamage, charData.StoreDamage)
			setValue('innerHTML', c, tdEls.BaseHealth, charData.StoreHealth)
			setValue('innerHTML', c, tdEls.BaseDamagePlusHealth, (charData.StoreDamage + charData.StoreHealth) )
			setValue('innerHTML', c, tdEls.Cost, charData.Cost)
			setValue('innerHTML', c, tdEls.Resale, Math.round(0.3 * charData.Cost) )
	
			var colorStr = charData.Color
			var displayIdx

			setValue('innerHTML', c, tdEls.Color, colorStr)
			
			if(colorStr == "Bronze")
				colorStr = 'peru'
			displayIdx = c
			if(displayIdx >= 0 && displayIdx < el.rows.length) {
				/*console.log("Changing colors of '%s' from '%s on %s' to '%s on %s'", 
					el.rows[displayIdx].id,
					el.rows[displayIdx].style.color, 
					el.rows[displayIdx].style.backgroundColor,
					"black", colorStr) */
				el.rows[displayIdx].style.color = 'black'
				el.rows[displayIdx].style.backgroundColor = colorStr
			}
			
			// 12 user-input values:
			setValue('checkbox', c, inputEls.Select, charData.selected)
			setValue('', c, inputEls.Elite, charData.elite)
			setValue('', c, inputEls.XP, charData.xp)
			setValue('', c, inputEls.Damage, LAM.numberWithCommas(charData.damage))
			setValue('', c, inputEls.Health, LAM.numberWithCommas(charData.health))
			setValue('', c, inputEls.GearSlots, charData.gearSlots)
			setValue('checkbox', c, inputEls.InStore, charData.InStore)
			setValue('', c, inputEls.ExtraCards, charData.extraCards)
			setValue('', c, inputEls.Sp1Bars, charData.sp1Bars)
			setValue('', c, inputEls.Sp2Bars, charData.sp2Bars)
			setValue('', c, inputEls.SuperBars, charData.superBars)
			setValue('', c, inputEls.CritChance, charData.critChance)
			setValue('', c, inputEls.CritDamage, charData.critDamage)
			setValue('innerHTML', c, tdEls.ElitePlusExtraCards, LAM.parseInteger(charData.elite) + LAM.parseInteger(charData.extraCards) )
			
			// 8 calculated values:
			// "DamagePlusHealth", "Sp1Min", "Sp1Max", "Sp2Min", "Sp2Max", "Super", 
			// "DamageAug", "HealthAug"
			setValue('innerHTML', c, tdEls.DamagePlusHealth, LAM.numberWithCommas(Math.round(charData.damage + charData.health)))

			var SpMinMax = CCIM_Data.getSpMinAndMax(1, charData.Name, charData.Title, charData.damage, charData.sp1Bars)
			setValue('innerHTML', c, tdEls.Sp1Min, SpMinMax.Min)
			setValue('innerHTML', c, tdEls.Sp1Max, SpMinMax.Max)

			SpMinMax = CCIM_Data.getSpMinAndMax(2, charData.Name, charData.Title, charData.damage, charData.sp2Bars)
			setValue('innerHTML', c, tdEls.Sp2Min, SpMinMax.Min)
			setValue('innerHTML', c, tdEls.Sp2Max, SpMinMax.Max)			
			
			var Super = CCIM_Data.getSuper(charData.Name, charData.Title, charData.damage, charData.superBars)
			setValue('innerHTML', c, tdEls.Super, Super)
			
			if (!charData.damageAugLevel || !charData.healthAugLevel)
			{
				if (!charData.damageAugLevel) {
					charData.damageAugLevel = CCIM_Data.setDamageAugLevel(charData)
				}
				if (!charData.healthAugLevel) {
					charData.healthAugLevel = CCIM_Data.setHealthAugLevel(charData)
				}
			}
			setValue('innerHTML', c, tdEls.DamageAug, charData.damageAugLevel)
			setValue('innerHTML', c, tdEls.HealthAug, charData.healthAugLevel)
	}
	
	function displayCurrentCharacter(NameAndTitle) {
		var el = document.querySelector('#CharTable tbody')
		var cpp = CCIM_Data.getCharsPerPage()
		var tdEls = get_elements_from_body(cpp, "td", el, 
			["Name", "Title", "Color", "BaseDamage", "BaseHealth", //5
				"BaseDamagePlusHealth", "DamagePlusHealth", "Cost", "Resale", //4
				"Sp1Min", "Sp1Max", "Sp2Min", "Sp2Max", "Super", // 5
				"DamageAug", "HealthAug", "ElitePlusExtraCards" ]) //3
		var inputEls = get_elements_from_body(cpp, "input", el,
			[ "Select", "Elite", "XP", "Damage", "Health", "Sp1Bars", "Sp2Bars", "SuperBars",
				"CritChance", "CritDamage", "GearSlots", "InStore", "ExtraCards" ])
				
		var charData = CCIM_Data.getCharDataForOffset(NameAndTitle.Num)
		
		displayCharRow(NameAndTitle.Num, tdEls, inputEls, el, charData)
	}

	function userChangedElite(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedElite(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedXP(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedXP(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedDamage(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedDamage(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedHealth(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedHealth(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedSp1Bars(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedSp1Bars(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedSp2Bars(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedSp2Bars(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedSuperBars(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedSuperBars(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedCritChance(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedCritChance(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedCritDamage(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedCritDamage(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedGearSlots(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedGearSlots(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedInStore(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedInStore(NameAndTitle.Name, NameAndTitle.Title, sender.checked?1:0)
		displayCurrentCharacter(NameAndTitle)
	}
	function userChangedExtraCards(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)
		CCIM_Data.userChangedExtraCards(NameAndTitle.Name, NameAndTitle.Title, sender.value)
		displayCurrentCharacter(NameAndTitle)
	}
	function get_elements_from_body(charsPerPage, elType, bodyEl, suffixes) {
		var numEls
		var results = {}
		for(var suf=0; suf<suffixes.length; ++suf) {
			results[suffixes[suf]] = 
				bodyEl.querySelectorAll(elType + "[id$='_" +suffixes[suf] + "']")
			numEls = results[suffixes[suf]].length 
			if (numEls != charsPerPage && numEls > 0 ) {
				console.error("Wrong number of elements, %d for %s suffix %s. %o", 
					numEls, elType, suffixes[suf], results[suffixes[suf]] )
			}
		}
		return results
	}

	function getCharNameAndTitle(sender) {
		var name='', title='', grandparent,charNum
		try {
			grandparent = sender.parentNode.parentNode
			name = grandparent.children[0].textContent
			title = grandparent.children[1].textContent
			var parts = grandparent.id.split("_")
			charNum = Number(parts[1])-1
			}
		catch(ex) {
			console.error("getCharNameAndTitle(): ", ex.message);
		}
		return {Name: name, Title: title, Num: charNum}
	}
	function goToPage(pageNum) {
		CCIM_Data.changeCurChar(pageNum)
		displayCurrentPage()
	}
	function changeSelectedCharactersValue() {
		var whichField = LAM.gelbi('selCharChgField').value // which field to change. Elite, XP, Extra_Cards, none
		var newValStr  = LAM.gelbi('selCharNewVal').value // whatever value the user typed in
		if (whichField == 'none')
			showMessage('Please select a field to change')
		else {
			CCIM_Data.changeSelectedChars(whichField, newValStr)
			displayCurrentPage()
		}
	}
	function changeSelectedRows(){
		changeSelectedPopup.show()
	}
	function displayNumSelected(){
		var el = document.querySelectorAll('.NumSelected')
		for(var e=0; e<el.length; ++e)
			el[e].innerHTML = String(CCIM_Data.getNumSelected() + " of " + CCIM_Data.getTotalNumChars())
	}
	function displayCurrentPageSelectBoxes() {
		var el = document.querySelector('#CharTable tbody')
		var inputEls = get_elements_from_body(CCIM_Data.getCharsPerPage(), "input", el, [ "Select" ])
		
		for(var offset=0; offset<CCIM_Data.getCharsPerPage(); offset++) {
			setValue('checkbox', offset, inputEls.Select, CCIM_Data.getOffsetCharSelectVal(offset))
		}
	}

	function SelAll() {
		CCIM_Data.SelAllVal(1)
		displayNumSelected()
		displayCurrentPageSelectBoxes()
	}
	function SelNone() {
		CCIM_Data.SelAllVal(0)
		displayNumSelected()
		displayCurrentPageSelectBoxes()
	}
	function SelCurPage() {
		CCIM_Data.SelCurPageVal(1)
		displayNumSelected()
		displayCurrentPageSelectBoxes()
	}
	function DeselCurPage() {
		CCIM_Data.SelCurPageVal(0)
		displayNumSelected()
		displayCurrentPageSelectBoxes()
	}
	function InvertSel() {
		CCIM_Data.InvertSel()
		displayNumSelected()
		displayCurrentPageSelectBoxes()
	}
	function SelVisible() {
		CCIM_Data.SelVisibleVal(1)
		displayCurrentPage()
		displayNumSelected()
	}
	function DeselVisible() {
		CCIM_Data.SelVisibleVal(0)
		displayCurrentPage()
		displayNumSelected()
	}
	function applyFilters() {
		CCIM_Filters.applyFilters()
		displayNumHidden()
		goToPage(1)
		displayCurrentPage()
	}
	function applyBonusChanges() {
		CCIM_Bonuses.applyBonusChanges()
		CCIM_Data.recalculateAfterBonusesChange()
		displayCurrentPage()
	}
	function HideSel() {
		if (CCIM_Data.ChangeSelVisibility(false)) {
			displayCurrentPage()
			displayNumHidden() 
		}
	}
	function ShowSel(){
		if (CCIM_Data.ChangeSelVisibility(true)) {
			displayCurrentPage()
			displayNumHidden() 
		}		
	}
	function InvertHidden(){
		CCIM_Data.InvertHidden()
		displayCurrentPage()
		displayNumHidden()
	}
	function ShowAll() {
		if (CCIM_Data.ShowAll()) {
			displayCurrentPage()
			displayNumHidden()
		}
	}
	function displayNumHidden(){
		var el = document.querySelectorAll('.NumHidden')
		var numHidden = CCIM_Data.getNumHidden()
		var totalNumChars = CCIM_Data.getTotalNumChars()

		for(var e=0; e<el.length; ++e)
			el[e].innerHTML = String(numHidden + " of " + totalNumChars)
		if (numHidden == totalNumChars)
			showMessage("You have hidden all characters!")
		return numHidden
	}
	function userChangedSelectChecked(sender) {
		var NameAndTitle = getCharNameAndTitle(sender)

		CCIM_Data.setSelectedVal(NameAndTitle.Name, NameAndTitle.Title, sender.checked?1:0)
		displayNumSelected()
	}
	function InitializeFiltersAndCollection() {
		CCIM_Data.InitializeFiltersAndCollection()
		displayCurrentPage()
	}
	function onClickSortCharacters() {
		CCIM_Data.setSortKey(document.querySelector('#sortCharsBy').value.replaceSpcs(""))
		goToPage(1)
	}
	function changeToMaximums(percnt) {
		CCIM_Data.changeAllToMaxWithAug(percnt * Characters.maxAug())
		displayCurrentPage()
	}

	return {
		InitializeFiltersAndCollection: InitializeFiltersAndCollection,
		displayCurrentPage: displayCurrentPage,
		changeSelectedRows: changeSelectedRows,
		SelAll: SelAll,
		SelCurPage: SelCurPage,
		SelVisible: SelVisible,
		SelNone: SelNone,
		DeselCurPage: DeselCurPage,
		DeselVisible: DeselVisible,
		InvertSel: InvertSel,
		ShowAll: ShowAll,
		HideSel: HideSel,
		ShowSel: ShowSel,
		InvertHidden: InvertHidden,
		goToPage: goToPage,
		userChangedSelectChecked: userChangedSelectChecked,
		userChangedElite: userChangedElite,
		userChangedXP: userChangedXP,
		userChangedDamage: userChangedDamage,
		userChangedHealth: userChangedHealth,
		userChangedSp1Bars: userChangedSp1Bars,
		userChangedSp2Bars: userChangedSp2Bars,
		userChangedSuperBars: userChangedSuperBars,
		userChangedCritChance: userChangedCritChance,
		userChangedCritDamage: userChangedCritDamage,
		userChangedGearSlots: userChangedGearSlots,
		userChangedInStore: userChangedInStore,
		userChangedExtraCards: userChangedExtraCards,
		changeSelectedCharactersValue: changeSelectedCharactersValue,
		applyFilters: applyFilters,
		applyBonusChanges: applyBonusChanges,
		onClickSortCharacters: onClickSortCharacters,
		changeToMaximums: changeToMaximums
	}
})();
}
if(typeof CCIM_MakeCharTable == 'undefined'){
var CCIM_MakeCharTable = (function() {
	/*jshint asi:true*/

	var resizeTimerId

	function replaceCharTable() { //WARNING: deletes any unsaved data in char table on the form
		// Template Table: row 0 = 1st header, row 1 = 2nd header, row 2 = 3rd header
		//		row 3 = 1st char row, row 4 = 2nd char row, row 5 = 3rd char row
		//var rpc = CCIM_Data.getRowsPerChar()
		var cpp = CCIM_Data.getCharsPerPage()
		var templateEl = document.querySelector('#TemplateTable')
		
		var frag = document.createDocumentFragment()
		var columns = CCIM_Data.getColumnsToShow()
		
		var tableEl = createTableStart(frag, templateEl, columns)
		createTableBody(tableEl, templateEl, cpp, columns)//, rpc)
		fixTableAppearance(tableEl)
		removeAndAppendTable(frag, 'CharTable') // WARNING! Deletes any unsaved data in existing Table
	}
	function createTableStart(frag, templateEl, columns) {
		var colgroup=null
		var tableEl = document.createElement("table")
		var el, numCols, c, template_tHead, thead, tfoot

		frag.appendChild(tableEl)

		/*tableEl.appendChild(templateEl.caption.cloneNode(true))*/

		numCols = columns.length
		
		colgroup = document.createElement("colgroup")
		colgroup.span = numCols
		tableEl.appendChild(colgroup)
		
		template_tHead = templateEl.tHead
		thead = document.createElement("thead")
		for(c=0;c<numCols;++c){
			el = template_tHead.querySelector("#th_" + columns[c])
			if (el)
				thead.appendChild(el.cloneNode(true))
		}
		tableEl.appendChild(thead)
		
		tfoot = templateEl.tFoot.cloneNode(true)
		try {
			//console.log("first cell of first row: %o\n", tfoot.rows[0].cells[0])
			//console.log("first cell of first row of tfoot, colspan: changing from %d to %d", tfoot.rows[0].cells[0].colspan, numCols - 2)
			tfoot.rows[0].cells[0].colspan = numCols - 2 // 2: Name and Title
			//console.log("first cell of first row of tfoot, colspan: %d", tfoot.rows[0].cells[0].colspan)
		}
		catch(ex) {
			console.log(ex.message)
		}
		tableEl.appendChild(tfoot)
		return tableEl
	}
	function createTableBody(tableEl, templateEl, cpp, columns) {
		var tbody = document.createElement("tbody")
		var templateRow = templateEl.querySelector("#template_charrow1")
		var numCols = columns.length
		var templateCols = []
		var c, found, newRow, cloned
		
		tableEl.appendChild(tbody)
		// get a list of the needed <td> from the template table's character row:
		for (c=0; c<numCols; ++c) {
			found = templateRow.querySelector("#template_" + columns[c])
			if (found) { 
				while(found.tagName.toLowerCase() != "td" && found.tagName.toLowerCase() != "tr") {
					found = found.parentNode
				}
				templateCols.push(found) // put the <td> on the list of templateCols
			}
		}
		
		for (var charNum=1; charNum<=cpp; ++charNum)
		{
			newRow = document.createElement("tr")
			newRow.id = 'char_' + charNum
			tbody.appendChild(newRow) // add a new row to body for this character
			for (c=0; c<numCols; ++c) {
				if (c < templateCols.length) {
					cloned = templateCols[c].cloneNode(true) // clone the template <td> column
					cloned.id = newRow.id + "_" + columns[c]
					newRow.appendChild(cloned) // add a new col to row for this character
				}
			}
		}
		return tbody
	}
	function fixTableAppearance(tableEl) {
		tableEl.style.textAlign = "center"
		tableEl.style.borderCollapse = 'collapse';

		var elements = tableEl.querySelectorAll("tr,th,td,caption")
		var len = elements.length, i;
		
		for(i=0; i<len; ++i) {
			elements[i].style.border = "1px solid"
			elements[i].style.margin = "0"
			elements[i].style.padding = "1px"
		}
		elements = tableEl.querySelectorAll("th,th a")
		len = elements.length
		for(i=0; i<len; ++i) {
			elements[i].style.backgroundColor = 'darkgray'
			elements[i].style.color = 'black'
			elements[i].style.border = '1px solid white'
			elements[i].style.textDecoration = "none"
		}
	}

	function removeAndAppendTable(frag, id) {
		var tableEl = document.querySelector('#' + id)
		var par = tableEl.parentNode
		if(par) 
		{
			par.removeChild(tableEl)
			frag.children[0].id = id
			par.appendChild(frag)
		}
	}
	function handleResize() {
		var chartablediv 	= LAM.gelbi('chartablediv')
		var chartable		= LAM.gelbi('CharTable')
		var ctdRect			= chartablediv.getBoundingClientRect()
		var ctRect			= chartable.getBoundingClientRect()

		if (ctdRect.width < ctRect.width) {
			chartablediv.style.overflowX = 'scroll';
		}
		else {
			chartablediv.style.overflowX = 'visible';
		}
	}
	
	window.addEventListener('resize', function() {
			clearTimeout(resizeTimerId);
			resizeTimerId = setTimeout(handleResize, 250);//throttle resize event handling
			} )
	
	function doAfterLoaded() {
		setTimeout(handleResize, 500)
	}
	document.addEventListener("DOMContentLoaded", doAfterLoaded())

	return {
		replaceCharTable: replaceCharTable,
		handleResize: handleResize
	}
})();
}
if(typeof CCIM_Main == 'undefined'){
var CCIM_Main = (function() {
	/*jshint asi:true*/

	var helperPopup=null
	var messagesPopup=null
	var cprtpopup=null

	function fixTopSpace() {
		var headerEl  = document.getElementById('header')
		var topspaceEl   = document.getElementById('topspace')
		var headerRect = headerEl.getBoundingClientRect()
		var topspaceRect  = topspaceEl.getBoundingClientRect()
		topspaceEl.style.height = Math.round(headerRect.bottom - topspaceRect.top + 1) + 'px';
	}

	function fixTag() {
		var el = LAM.gelbi('tag');
		if(el){
			var val = el.value;
			var val2 = "";
			for(var i=0; i<val.length; i++){
				if ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 _".indexOf(val[i]) >= 0)
					val2 = val2 + val[i];
			}
			if (val !== val2) {
				console.log("Changing %s to %s", el.value, val2)
				el.value = val2
			}
			console.log("Setting tag to %s", val2)
			CCIM_Data.setTag(val2)
		}
	}

	function ChangeCharsPerPage() {
		if (CCIM_Data.ChangePageDimensions(
			'cpp', 1, CCIM_Data.getTotalNumChars(), 
			"How many characters to show per page?", CCIM_Data.getCharsPerPage()))
		{
				CCIM_MakeCharTable.replaceCharTable()
				CCIM_CurrentPage.goToPage(1)
		}
	}

	function setColor(newtheme) {
		var oldtheme
		if (newtheme == 'whiteonblack'){
			CCIM_Data.setColorTheme('whiteonblack')
			oldtheme = 'blackonwhite'
		}
		else {
			CCIM_Data.setColorTheme('blackonwhite')
			oldtheme = 'whiteonblack'
		}
		LAM.toggle_class_name(oldtheme, newtheme)
	}
	function changeColorTheme(sender) {
		setColor(sender.checked ? "whiteonblack" : "blackonwhite")
	}
	function showMessagesPopup(clearPrevious, message) {
		var msgEl = LAM.gelbi('MsgsDiv')
		if (clearPrevious)
			msgEl.innerHTML = "(Close: click outside box)<br><br>"
		msgEl.innerHTML += message
		messagesPopup.show()
	}
	function showCopyright() {
		if(!cprtpopup)
			cprtpopup = new Popup('copyrightDiv')
		cprtpopup.show()
	}

	function doMain(){
		fixTopSpace()
		CCIM_MakeCharTable.replaceCharTable()	
		CCIM_CurrentPage.displayCurrentPage()
		
		helperPopup = new Popup('helper'); // Pass an ID to link with an existing DIV in page
		helperPopup.autoHide = false;
		helperPopup.position = "below left"
		helperPopup.constrainToScreen = false;
		
		messagesPopup = new Popup('MsgsDiv')
		messagesPopup.autoHide = true
		messagesPopup.constrainToScreen = true
	}
	document.addEventListener("DOMContentLoaded", doMain())
	//doMain()
	
	return {
		helperPopup: helperPopup,
		fixTag: fixTag,
		ChangeCharsPerPage: ChangeCharsPerPage,
		changeColorTheme: changeColorTheme,
		setColor: setColor,
		showMessagesPopup: showMessagesPopup,
		showCopyright: showCopyright
	}
})();
}
