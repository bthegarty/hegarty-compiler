//Brendan Hegarty
//Lexer and Token list
/*Gonna see miss eliza*/

//current error with output being instantly whiped
// function Ext.Loader.setConfig(){
//     var disableCaching: false,
//     var enabled: true
// };
//this was for reload crashing. Should be fine now but this is staying commented in just in case i forget
			var space = /[ \s]/; //ignored by lex
	    var ws = /[space]/; //no action - no return
			var newline = /[ \r\n]/; //new line (only works with single chars if they have a space at the end)
			var	T_char = /[a-z]/;
			var	T_digit = /[0-9]/;
			var	T_LParen = /[(]/;
			var	T_RParen = /[)]/;
			var	T_LBrac = /[{]/;
			var	T_RBrac = /[}]/;
			var	T_plus = /[+]/;
			var	T_equal = /[==]/;
			var	T_notequal = /[!=]/;
			var	T_assign = /[=]/;
			var	T_qoute = /["]/;
			var	T_true = /[true]/;
			var	T_false = /[false]/;
			var	T_int = /[int]/;
			var	T_string = /string/;
			var	T_boolean = /[boolean]/;
			var	T_while = /[while]/;
			var	T_if = /[if]/;
			var	T_print = /[print]/;
			var	T_EOP = /[$]/;  //end of program token

			var warnings = new Array(); //stores all of our warnings
			var errors = new Array(); //stores all of our errors
			var amIToken = false; //checks if we accurately matched token
			var tempVar;
			var lexmemeBegin = 0;
			var lexmemeCount;


/*gonna go to mississippi*/

var tokenHole = []; //token array that we will push to
var tokenParse = []; //a copy array that we will push to and not clear so we can parse
var newToken = class {
		constructor (desc, type, currLineNum){
				this.desc = desc;
				this.type = type;
				this.currLineNum = currLineNum;
			}//closes constructor
}//closes var

var forward = 0;//counter for multi char switch

// function Error(message) {
//    this.message = message;
//    this.name = 'Error';
// }

function lexer (){
	//debugger;
	lexmemeCount = 0;
	currLineNum = 1;
	var inputText = document.getElementById("inputText").value;

	console.log("Lexing " + currLineNum);
	document.getElementById("outputText").value += "please hold for lex " + currLineNum + "\n";

	// console.log ("We're checking your shit for you, fam");
	for (lexmemeBegin = 0; lexmemeBegin < inputText.length; lexmemeBegin++){
		//debugger;
		//alert('forwarad at the top of the loop' + forward);
		currToken = inputText[lexmemeBegin];
		status = true;

		//forward for more than one char and match
		console.log('scanning');

		//alert('forward at the bottom of the loop' + forward);
		amIToken = false;
		amIString(lexmemeBegin, newToken, inputText);
		amISymbol(lexmemeBegin, newToken, inputText);
		amIMultiChar(lexmemeBegin, newToken, inputText);
		isWhiteSpace(currToken);
		isLBrac(currToken);
		isRBrac(currToken);
		isLParen(currToken);
		isRParen(currToken);
		isPlus(currToken);
		//isQoute(currToken);
		isDigit(currToken);
		isEOP(currToken);

		if(!amIToken){
			document.getElementById("outputText").value += "LEX ERROR: invalid token detected at: " + currToken
			throw new Error ("Lexical Error: invalid token detected");
			break;

		}//closes else

	}//closes for

	//console.log(tokenParse + 'final output'); for parse

	// if(amIToken == true){
	// 	document.getElementById("outputText").value += "SUCCESS: Here ya go. I'm like 95% sure this is a successful lex... yay!"
	// 	//parser();
	// }//closes if
	// else if(amIToken == false){
	// 	document.getElementById("outputText").value += "ERROR: Something went wrong cause your program didn't Lex. Hold on one sec, I'll call someone.. **I'm not actually gonna call anyone**"
	// }//closes else
	parser();
/*gonna see miss eliza*/
}//close function lexer


//start switch statement
function amISymbol(forward, newToken, inputText){
	state = 0;
	tempVar = '';
	var runSymbolCheck = true;

	while(runSymbolCheck){
		switch (state){
			case 0:
				if ((inputText[forward]).search(T_assign) != -1){
					tempVar += inputText[forward];
					forward++;
					//lexmemeBegin = forward;
					state = 1;
					break;
				}//closes if
				else if ((inputText[forward].search(T_notequal)) != -1){
					tempVar += inputText[forward];
					forward++;
					//lexmemeBegin = forward;
					state = 2;
					break;
				}//closes else if
				else{
					runSymbolCheck = false;
					break;
				}//closes else
			case 1:
				if((inputText[forward]) == '='){
					tempVar += inputText[forward];
					lexmemeBegin = forward;
					var tokenid = new newToken(tempVar, "equals", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					tokenHole = [];
					amIToken = true;
					runSymbolCheck = false;
					break;
				}//closes if
				else {
					var tokenid = new newToken(tempVar, "assign", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					tokenHole = [];
					amIToken = true;
					runSymbolCheck = false;
					break;
				}//closes else
			case 2:
				if ((inputText[forward]).search(T_assign) != -1){
					tempVar +=  inputText[forward];
					lexmemeBegin = forward;
					var tokenid = new newToken(tempVar, "not equals", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					tokenHole = [];
					amIToken = true;
					runSymbolCheck = false;
					break;
				}//closes if
				else {
					document.getElementById("outputText").value += "Look at me I turned myself into an unrecognised token! UNRECOGNISED TOKEN!" + "\n"
					console.log('unrecognized token');
					amIToken = false;
					runSymbolCheck = false;
					//throw new Error ("Lexical Error: invalid token detected");
					break;
				}//closes else
		}//closes switch
	}//closes while
}//closes function amISymbol

//start new switch for strings
//search for "" then look for the char within
function amIString(forward, newToken, inputText){
	tempVar = '';
	state = 0;
	var runStringCheck = true;

	while (runStringCheck){
		switch(state){
			case 0:
			//debugger;
				if ((inputText[forward]) == '"'){
					//debugger;
					var tokenid = new newToken(inputText[forward], "qoute", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					amIToken = true;
					tokenHole = [];
					tempVar = '';
					// amIToken = true;
					forward++;
					state = 1;
					break;
				}//closes if
				else{
					runStringCheck = false;
					break;
				}//closes else
				case 1:
					if((inputText[forward]).search(T_char) != -1){
						tempVar += inputText[forward];
						forward ++;
						state = 2;
						break;
					}//closes if
					else{
						amIToken = false;
						console.log('unrecognized token');
						runStringCheck = false;
						break;
					}//closes else
				case 2:
					if((inputText[forward]).search(T_char) != -1){
						tempVar += inputText[forward];
						forward++;
						state = 2;
						break;
					}//closes if
					else if ((inputText[forward]).search(space) != -1){
						tempVar += inputText[forward];
						forward++;
						state = 2;
						break;
					}
					else if((inputText[forward]) == '"'){
						var tokenid = new newToken(tempVar, "StringExpr", currLineNum);
						tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
						tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
						console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
						document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
						amIToken = true;
						tokenHole = [];
						tempVar = '';
						// amIToken = true;
						tempVar += inputText[forward];
						var tokenid = new newToken(tempVar, "qoute", currLineNum);//finds the closing qoute for string
						lexmemeBegin = forward;
						tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
						tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
						console.log("lexer: " + tokenHole[1] + " " + tokenHole[0]);
						document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
						amIToken = true;
						tokenHole = [];
						// amIToken = true;
						runStringCheck = false;
						break;
					}
					else {
						document.getElementById("outputText").value += "Look at me I turned myself into an unrecognised token! UNRECOGNISED TOKEN!" + "\n"
						amIToken = false;
						console.log('unrecognized token');
						runStringCheck = false;
						break;
					}
		}//closes switch
	}//closes while loop
}//closes function amIString

//start new switch for multichar
//search for two or more chars then look to see if it matches any keywork listed bellow
function amIMultiChar(forward, newToken, inputText){
	tempVar = '';
	state = 0;
	var runMultiCheck = true;

	while (runMultiCheck){
		switch(state){
			case 0:
				if((inputText[forward]).search(T_char) != -1){
					//alert('state 0');
					tempVar += inputText[forward];
					forward++;
					//alert('forward at case 1 ' + forward);
					state = 1;
					break;
				}//closes if
				else{
					runMultiCheck = false;
					break;
				}//closes else
			case 1:
			//alert(inputText[forward]);//running into an issue with finding chars. The if is turning true. it shouldn't
				if(inputText[forward] == undefined){
					var tokenid = new newToken(tempVar, "identifier", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					tokenHole = [];
					amIToken = true;
					lexmemeBegin = forward;
					runMultiCheck = false;
					break;
				}
				else if((inputText[forward]).search(T_char) != -1){
					//alert('state 1');
					//alert(' this is the forawrd counter ' + forward);
					tempVar += inputText[forward];
					forward++;
					state = 2;
					break;
					//put if check here because if we go further its looking for more than 2 char
				}
				else {
					//alert('id success');
					var tokenid = new newToken(tempVar, "identifier", currLineNum);
					tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
					tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
					console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
					document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
					tokenHole = [];
					amIToken = true;
					//lexmemeBegin = forward;
					runMultiCheck = false;
					break;
				} //this still needs a space at the end
				case 2:
				//alert('state 2'); //forward loop where we go too far ahead?
					if (tempVar == 'if'){
						lexmemeBegin = forward;
						var tokenid = new  newToken(tempVar, "if", currLineNum);
						tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
						tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
						document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
						console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
						tokenHole = [];
						amIToken = true;
						runMultiCheck = false;
						break;
					}//closes if
					else if ((inputText[forward]).search(T_char) != -1) {
					tempVar += inputText[forward];
						if (tempVar == 'int'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "int", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'true'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "true", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'false'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "false", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'print'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "print", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'while'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "while", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'string'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "string", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token ---> " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else if (tempVar == 'boolean'){
							lexmemeBegin = forward;
							var tokenid = new newToken(tempVar, "boolean", currLineNum);
							tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
							tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
							console.log("Found Token ---> " + tokenHole[1] + " " + tokenHole[0]);
							document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
							tokenHole = [];
							amIToken = true;
							runMultiCheck = false;
							break;
						}
						else{
							forward++;
							state = 2; //This will loop us back to continue looking for  miltichar
							break;
						}
					}
					else{
						document.getElementById("outputText").value += "Look at me I turned myself into an unrecognised token! UNRECOGNISED TOKEN!" + "\n"
						console.log('Look at me I turned myself into a pickle! Pickle Rick!');//token failure
						amIToken = false;
						runMultiCheck = false;
						//add a stop function here to kill lex
						break;
					}
		}//closes switch statement
	}//closes while
}//closes function amIMultiChar


//single char functions (stuff like ()""a-z0-9)
//these nodes in the grammar all get their own functions cause things arent dependant on them
//I really wish this was all just brackets. that was so much calmer than figuring out that the space in "james bond" was what was causing errors. yay strings!
function isLParen(currToken){
 	if(currToken.search(T_LParen) != -1){
 		var tokenid = new newToken(currToken, "Left Parenthesis", currLineNum);
 		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
		tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
 		//console.log('Lexer' + tokenHole[lexmemeCount][1]+ ' '+ tokenhole[lexmemeCount[0]]); attemping to make a 2D array to store and return tokens... attempting
 		//documet.getElementById("output").value += 'Token on line number ' + tokenHole[lexmemeCount][2]+' "' + tokenhole[lexmemecount][0] + '" -->' +
 		//lexmemeCount++;
 		console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
		document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
		amIToken = true;
		tokenHole = [];
	}
		else{

		}
}//ends function
function isRParen(currToken){
	//debugger;
 	if(currToken.search(T_RParen) != -1){
 		var tokenid = new newToken(currToken, "Right Parenthesis", currLineNum);
 		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
		tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);

 		//lexmemeCount++;
 		console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
		document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
		amIToken = true;
		tokenHole = [];
	}
		else{

		}
}//ends function
function isLBrac(currToken){
 	if(currToken.search(T_LBrac) != -1){
 		var tokenid = new newToken(currToken, "Left Bracket", currLineNum);
 		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
		tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
		//console.log(tokenParse);//put in place for parse testing

 		//lexmemeCount++;
 		console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
		document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
		amIToken = true;
		tokenHole = [];
		//console.log(tokenParse);
	}
		else{

		}
}//ends function

//It's been 7 weeks.... the days blur together. I don't know where the lexer ends and I begin. I don't understand her, yet I am drawn to her complex beauty. I know I can get her to show me her secrets.... in time
function isRBrac(currToken){
 	if(currToken.search(T_RBrac) != -1){
 		var tokenid = new newToken(currToken, "Right Bracket", currLineNum);
 		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
		tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
 		//lexmemeCount++;
 		console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
		document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
		amIToken = true;
		tokenHole = [];
	}
		else{

		}
}//ends function
function isPlus(currToken){
 	if(currToken.search(T_plus) != -1){
 		var tokenid = new newToken(currToken, "Plus", currLineNum);
 		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
		tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
 		//lexmemeCount++;
 		console.log("Found Token: " + tokenHole[1] + " " + tokenHole[0]);
		document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
		amIToken = true;
		tokenHole = [];
	}
		else{

		}
}//ends function

 function isDigit(currToken){
  	if(currToken.search(T_digit) != -1){
  		var tokenid = new newToken(currToken, "Digit", currLineNum);
  		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
			tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
  		//lexmemeCount++;
  		console.log("found Token: " + tokenHole);
 			document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
			amIToken = true;
 			tokenHole = [];
 		}
 		else{

 		}
 }//ends function
 function isEOP(currToken){
  	if(currToken.search(T_EOP) != -1){
  		var tokenid = new newToken(currToken, "End Of Program", currLineNum);
  		tokenHole.push(tokenid.desc, tokenid.type, tokenid.currLineNum);
			tokenParse.push([tokenid.desc, tokenid.type, tokenid.currLineNum]);
  		//lexmemeCount++;
  		console.log("Found Token: " + tokenHole);
 			document.getElementById("outputText").value += "Lexer: " + tokenHole[1] + " --> " + tokenHole[0] + "\n";
			amIToken = true;
 			tokenHole = [];
 		}
 		else{
			//document.getElementById("outputText").value += "Lexer warning: Did not find EOP marker    ";
			//this ran through every token and would output. soooo not ideal. but i like the idea and ill come back to it
 		}
 }//ends function

 function isWhiteSpace(currToken){
	 if(currToken.search(space) != -1){
		  amIToken = true;
	 }
 }//closes funtion

/*gonna go to mississippi*/
