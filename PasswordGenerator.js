

"use strict";

const d = document;
const w = window;

let range = function(start, end, step) {
    let range = [];
    let typeofStart = typeof start;
    let typeofEnd = typeof end;
    if (step === 0) { throw TypeError("Step cannot be zero."); }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {
      while (step > 0 ? end >= start : end <= start) {
          range.push(start);
          start += step;
      }

	  } else if (typeofStart == "string") {

      if (start.length != 1 || end.length != 1) { throw TypeError("Only strings with one character are supported."); }
      start = start.charCodeAt(0);
      end = end.charCodeAt(0);
      while (step > 0 ? end >= start : end <= start) {
          range.push(String.fromCharCode(start));
          start += step;
      }
	  } else { throw TypeError("Only string and number types are supported"); }
    return range;
}

let shuffle = function(a) {
	let j, x;
	for (let i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return a;
}

let random = function(min, max) { return Math.round(Math.random() * (max - min) + min); }
let numeric = range('0','9');
let latinBig = range('A','Z');
let latinSmall = range('a','z');
let symbols = ['!','?','.',',',':',';','"','`','^','%','$','#','@','&','_','+','-','*','=','/','\\','ǀ','<','>','(',')','[',']','{','}'];

w.addEventListener('load', function(){

    /*** SELECTBOX ***/
    let select = d.getElementById('length');
    for(let i=8; i <= 128; i++){
		let node = d.createElement("option");
		let textnode = d.createTextNode(i);
		node.appendChild(textnode);
		if(i==12){node.setAttribute('selected','selected');}
      select.appendChild(node);
    }
    select.addEventListener("change", generate, true);
    /****/

    /*** CHECKBOX ***/
    let special = d.getElementById('holder');
    special.addEventListener("mouseover", function(){
      this.parentNode.classList.add('checkbox_hovered_yes');
    }, true);
    special.addEventListener("mouseout", function(){
      this.parentNode.classList.remove('checkbox_hovered_yes');
    }, true);

    special.addEventListener("focus", function() {
      this.classList.add('checkbox__box_focused_yes');
    }, true);
    special.addEventListener("blur", function() {
      this.classList.remove('checkbox__box_focused_yes');
    }, true);

    special.addEventListener('click', function(){
      if(this.children[0].hasAttribute('checked')) {
        this.classList.remove('checkbox__box_checked_yes'); 
        this.children[0].removeAttribute('checked');
      } else {
        this.classList.add('checkbox__box_checked_yes');
        this.children[0].setAttribute('checked','checked');
      }
      return generate();
    }, true);
    /**/

    /*** BUTTON ***/
    let generateButton = document.getElementById('generate');
    generateButton.addEventListener("click", generate, true);
    /*****/

    generate();
});


let generate = function(){
	let select = d.getElementById('length');
	let checkbox = d.getElementById('special');
  let passholder = d.getElementById('password');
    
	let count_small = latinSmall.length-1,
		  count_big   = latinBig.length-1,
		  count_spec  = symbols.length-1,
		  count_num   = numeric.length-1,
		  password	= [],
		  allsymbols  = [];
  
	let small = latinSmall[random(0,count_small)],
			big   = latinBig[random(0,count_big)],
			num   = numeric[random(0,count_num)];

	if(checkbox.hasAttribute("checked")){
		allsymbols  = latinSmall.concat(latinBig,numeric,symbols);
		let	count_symbol = symbols.length-1,
			  symbol = symbols[random(0,count_symbol)];

		password.push(small);
		password.push(big);
		password.push(num);
		password.push(symbol);
	} else {
		allsymbols  = latinSmall.concat(latinBig,numeric);
		password.push(num);
		password.push(big);
		password.push(small);
	}

	let count_all  = allsymbols.length-1,
		  count_pass = password.length-1,
		  forcount   = select.value-1;

	for (let i = count_pass; i < forcount; i++) {
		let symbol = allsymbols[random(0,count_all)];
		password.push(symbol);
	}

	password = shuffle(password);

	return passholder.setAttribute('value', password.join(''));
}