// Brendan Hegarty
// existence is pain for a meeeseeeks, jerry!!
var parseCounter = 0;//counter to move us through the array we have brought over from lex
var CST = new Tree();//New tree creation


function matchAndConsume (currTokenParse, parseCounter){
//console.log(tokenParse[0][0]);
//console.log(parseCounter);
	if(currTokenParse == tokenParse[parseCounter][0]){
    console.log('Compairing ' + currTokenParse[0] + ' to the token in the array ' + tokenParse[parseCounter][0]);
		document.getElementById('outputText').value += 'PARSER: Compairing ' + currTokenParse[0] + ' to the token in the array ' + tokenParse[parseCounter][0] + tokenParse[parseCounter][0] + "\n"
	}
	else{
		document.getElementById('outputParse').value += 'PARSER: expected: ' + currTokenParse + ' Found: ' + tokenParse[parseCounter][0] + "\n";
		document.getElementById('outputParse').value += 'Parse Failure. Killing program' + "\n";
		console.log('Error: expected: ' + currTokenParse + ' Found: ' + tokenParse[parseCounter][0])
		throw new Error('Error');
		//the log works just need to attach this to some kind of kill function
	}

}

function parser(){
//we kick off right here. This is the call function from lex
  parseProgram();

	// if(tokenParse == true){
	// 	document.getElementById("outputText").value += "Ooooo weeee we're Parsing with fire now"
	// }//closes if
	// else if(tokenParse == false){
	// 	document.getElementById("outputText").value += "Something went wrong. The Parser totally found an error so we're just gonna stop now. k?"
	// }//closes else
}

function parseProgram(){
	console.log('were in program');
	CST.addNode('Program', 'branch');
  parseBlock();
	//parseCounter--;
  if (tokenParse[parseCounter]){
		 matchAndConsume('$', parseCounter);//apparently I need the counter here because I wasn't passing through anything and outputing an empty array
	}
	else{
		document.getElementById('outputParse').value += "Hey pal you've forgotten that thingy at the end: $" + "\n"
	}
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	document.getElementById('outputParse').value += CST.toString() + "\n" //outputs our CST
	console.log(CST.toString());
	parseCounter++;
	CST.endChildren();
	astBegin();//automatically runs our AST if parse checks out
	//document.getElementById(outputParse).value += CST.toString() + '\n';
}

function parseBlock(){
	console.log('we made it to block');
  CST.addNode('Block', 'branch');
  matchAndConsume('{', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++; // denotes new scope

	parseStatementList();


	matchAndConsume('}', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;
	CST.endChildren();
}

function parseStatementList(){
	console.log('statementlist');
  CST.addNode('StatementList', 'branch');
  if (tokenParse[parseCounter][0] == 'print'){
		console.log('if 1');
    parseStatement();
    parseStatementList();
  }
	else if (tokenParse[parseCounter][1] == 'identifier'){
		parseStatement();
    parseStatementList();
		console.log('if id');
	}
	else if (tokenParse[parseCounter][0] == 'int'){
    parseStatement();
		parseStatementList();
	}
	else if (tokenParse[parseCounter][0] == 'string'){
    parseStatement();
		parseStatementList();

	}
	else if (tokenParse[parseCounter][0] == 'boolean'){
    parseStatement();
    //CST.endChildren();
		parseStatementList();
    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][1] == 'while'){
    parseStatement();
    //CST.endChildren();
		parseStatementList();
    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][1] == 'if'){
    parseStatement();
    //CST.endChildren();
		parseStatementList();
    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][0] == '{'){
		parseStatement();
		//CST.endChildren();
		parseStatementList();
		//CST.endChildren();
	}
  else if (tokenParse[parseCounter][0] == '}'){
		console.log('this is nothing and thats okay')
		// epsilon production
  }
	else{
		console.log('Found: ' + tokenParse[parseCounter][0])
		document.getElementById('outputParse').value += 'Error. Found: ' + tokenParse[parseCounter][0] + "\n"
		throw new Error('Not a Statement Error. Found: ' + tokenParse[parseCounter][0]);
		// epsilon production
	}
	CST.endChildren();
}

function parseStatement(){
	console.log('statement');
  CST.addNode('Statement', 'branch');
  if (tokenParse[parseCounter][0] == 'print'){
    parsePrintStatement();
		//CST.endChildren();
  }
  else if (tokenParse[parseCounter][1] == 'identifier'){
		console.log('gotpastiD')
    parseAssignmentStatement();
		//CST.endChildren();
  }
	else if (tokenParse[parseCounter][0] == 'int'){
			parseVarDecl();
	    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][0] == 'string'){
		console.log('stringy');
			parseVarDecl();
	    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][0] == 'boolean'){
			parseVarDecl();
	    //CST.endChildren();
	}
  else if (tokenParse[parseCounter][0] == 'while'){
    parseWhileStatement();
		//CST.endChildren();
  }
	else if (tokenParse[parseCounter][0] == 'if'){
		parseIfStatement();
		//CST.endChildren();
	}
  else if (tokenParse[parseCounter][0] == '{'){
    parseBlock();
		//CST.endChildren();
  }
	else{
		console.log('error');
	}
  // kick(currTokenParse);
	CST.endChildren();
}

function parsePrintStatement(){
	console.log('printState');
  CST.addNode('PrintStatement', 'branch');
  matchAndConsume('print', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

	matchAndConsume('(', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

	parseExpr();
  matchAndConsume(')', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;
  // kick(currTokenParse);
	CST.endChildren();
}

function parseAssignmentStatement(){
	console.log('assignState');
  CST.addNode('AssignmentStatement', 'branch');
  parseId();
	//CST.endChildren();
  matchAndConsume('=', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

	parseExpr();
  CST.endChildren();
}

function parseVarDecl(){
  CST.addNode('VarDecl', 'branch');
  parseType();
	//CST.endChildren();
  parseId();
	CST.endChildren();
}

function parseWhileStatement(){
  CST.addNode('WhileStatement', 'branch');
  matchAndConsume('while', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

  parseBooleanExpr();
	//CST.endChildren();
  parseBlock();
	CST.endChildren();
}

function parseIfStatement(){
  CST.addNode('IfStatement', 'branch');
  matchAndConsume('if', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

  parseBooleanExpr();
	//CST.endChildren();
  parseBlock();
	CST.endChildren();
}

function parseExpr(){
	//debugger;
	console.log('expr');
  CST.addNode('Expr', 'branch');
  if(tokenParse[parseCounter][1] == "Digit"){
		console.log('got the digit');
		//force in a new node for digit. this will be our work around
		parseIntExpr();
		//CST.endChildren();
	}
	else if (tokenParse[parseCounter][1] == 'qoute'){
		parseStringExpr();
		//CST.endChildren();
	}
	else if (tokenParse[parseCounter][0] == '(' || tokenParse[parseCounter][0] == 'false' || tokenParse[parseCounter][0] == 'true'){
		parseBooleanExpr();
    //CST.endChildren();
    //CST.endChildren();
	}
	else if (tokenParse[parseCounter][1] == 'identifier'){
		parseId();
		//CST.endChildren();
	}
	else{
		document.getElementById('outputParse').value += 'Error: unexpected expression, Found: ' + tokenParse[parseCounter][0] + "\n"
		throw new Error('Unexpected Expression. Found: ' + tokenParse[parseCounter][0]);
	}
	CST.endChildren();
}


//*****************************************************************************
//fix this. there be an error in these parts
function parseIntExpr(){
	console.log('intexpr');
  CST.addNode('IntExpr', 'branch');
	console.log('current: ' + tokenParse[parseCounter+1][0]);
	//alert('comparing: ' + tokenParse[parseCounter][1])
  if (tokenParse[parseCounter][1] == 'Digit'){ // this needed to be a capital D
		console.log('current: ' + tokenParse[parseCounter+1][0]);
		parseDigit();
		//CST.endChildren();
		if (tokenParse[parseCounter][0] == '+'){
			console.log('current: ' + tokenParse[parseCounter+1][0]);
			parseIntOp();
			//CST.endChildren();
	  	parseExpr();
			console.log('current: ' + tokenParse[parseCounter+1][0]);
		}
	}
	else if(tokenParse[parseCounter][1] == 'identifier'){
		parseId();
		if (tokenParse[parseCounter][0] == '+'){
			console.log('current: ' + tokenParse[parseCounter+1][0]);
			parseIntOp();
			//CST.endChildren();
	  	parseExpr();
			console.log('current: ' + tokenParse[parseCounter+1][0]);
		}
	}
	else{
		document.getElementById('outputParse').value += 'Error: Expected digit, Found: ' + tokenParse[parseCounter][0] + "\n"
		throw new Error('Not a Digit. Found: ' + tokenParse[parseCounter][0]);
	}
	CST.endChildren();
}

function parseStringExpr(){
	//debugger;
  CST.addNode('StringExpr', 'branch');
  matchAndConsume('"', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;

  parseCharList();
	//CST.endChildren();
  matchAndConsume('"', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;
	CST.endChildren();
}

function parseBooleanExpr(){
	//debugger;
  CST.addNode('BooleanExpr', 'branch');
	if (tokenParse[parseCounter][0] == '('){
		matchAndConsume('(', parseCounter);
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;

  	parseExpr();
		//CST.endChildren();
  	parseBoolOp();
		//CST.endChildren();
  	parseExpr();
		//CST.endChildren();
  	matchAndConsume(')', parseCounter);
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;
		//parseCounter++;
	}
	else{
		parseBoolVal();
		//CST.endChildren();
	}
	CST.endChildren();
}

function parseId(){
  CST.addNode('Id', 'branch');
  parseChar();
	CST.endChildren();

}

function parseCharList(){
	//console.log(charlist);
  CST.addNode('CharList', 'branch');
	if (tokenParse[parseCounter][1] == 'StringExpr'){
		parseChar();
		//CST.endChildren();
  	parseCharList();
		//CST.endChildren();
	}
  else{
  // epsilon production
	}
	CST.endChildren();
}
// //the madness has sunk in at this point. She has gotten into my head. I wonder who is writing the code that appears before you. Is it still brendan or has the darkness overcome the personallity. Time will tell...

function parseType(){
	CST.addNode('Type', 'branch')
	if (tokenParse[parseCounter][1] == 'int'){
		matchAndConsume('int', parseCounter);
		CST.addNode(tokenParse[parseCounter][1], 'leaf');
		parseCounter++;
	}
	else if (tokenParse[parseCounter][1] == 'string'){
		console.log('are we even strings');
		matchAndConsume('string', parseCounter);
		CST.addNode(tokenParse[parseCounter][1], 'leaf');
		parseCounter++;
	}
	else if (tokenParse[parseCounter][1] == 'boolean'){
		matchAndConsume('boolean', parseCounter);
		CST.addNode(tokenParse[parseCounter][1], 'leaf');
		parseCounter++;
	}
	CST.endChildren();
}

function parseChar(){
	//debugger;
	CST.addNode('Char', 'branch');
	if (tokenParse[parseCounter][1].search(T_char) != -1){
			//matchAndConsume(tokenParse[parseCounter][0], 'leaf');
		  CST.addNode(tokenParse[parseCounter][0] , 'leaf');
      parseCounter++;
			//parseCounter++;
	}
  else {
    console.log('errors with Char');
  }
	CST.endChildren();
}

// function parseSpace(){
// 	//idk if this requires a branch
// 	//matchAndConsume(/ \s/, parseCounter);
// 	//idk if it needs leaf either
// }

function parseDigit(){
	CST.addNode('Digit', 'branch');
	//matchAndConsume('digit', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;
	CST.endChildren();
}

function parseBoolOp(){
	CST.addNode('BoolOp', 'branch');
	if(tokenParse[parseCounter][0] == '=='){
		matchAndConsume('==', parseCounter);
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;
	}
	else if (tokenParse[parseCounter][0] == '!='){
		matchAndConsume('!=', parseCounter);
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;
	}
	CST.endChildren();
}

function parseBoolVal(){
	CST.addNode('BoolVal', 'branch');
	if (tokenParse[parseCounter][1] == 'false'){
		matchAndConsume('false', parseCounter)
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;
	}
	else if (tokenParse[parseCounter][1] == 'true'){
		matchAndConsume('true', parseCounter);
		CST.addNode(tokenParse[parseCounter][0], 'leaf');
		parseCounter++;
	}
	CST.endChildren();
}

function parseIntOp(){
	CST.addNode('IntOP', 'branch');
	matchAndConsume('+', parseCounter);
	CST.addNode(tokenParse[parseCounter][0], 'leaf');
	parseCounter++;
	CST.endChildren();
}

function Tree() {
    // Attributes

    this.root = null;  // Note the NULL root node of this tree.
    this.cur = {};     // Note the EMPTY current node of the tree we're building.

    // -- Methods --

    // Add a node: kind in {branch, leaf}.
    this.addNode = function(name, kind) {
        // Construct the node object.
        var node = { name: name,
                     children: [],
                     parent: {}
                   };

        // Check to see if it needs to be the root node.
        if ( (this.root == null) || (!this.root) )
        {
            // We are the root node.
            this.root = node;
        }
        else
        {
            // We are the children.
            // Make our parent the CURrent node...
            node.parent = this.cur;
            // and add ourselves (via the unfortunately-named
            // "push" function) to the children array of the current node.
            this.cur.children.push(node);
        }
        // If we are an interior/branch node, then...
        if (kind == "branch")
        {
            // ... update the CURrent node pointer to ourselves.
            this.cur = node;
        }
    };

    // Note that we're done with this branch of the tree...
    this.endChildren = function() {
        // ...by moving "up" to our parent node (if possible).
        if ((this.cur.parent !== null) && (this.cur.parent.name !== undefined))
        {
            this.cur = this.cur.parent;
        }
        else
        {
            // TODO: Some sort of error logging.
            // This really should not happen, but it will, of course.
        }
    };

    // Return a string representation of the tree.
    this.toString = function() {
        // Initialize the result string.
        var traversalResult = "";

        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth)
        {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            for (var i = 0; i < depth; i++)
            {
                traversalResult += "-";
            }

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0)
            {
                // ...note the leaf node.
                traversalResult += "[" + node.name + "]";
                traversalResult += "\n";
            }
            else
            {
                //There are children, so note these interior/branch nodes and...
                traversalResult += "<" + node.name + "> \n";
                // ...recursively expand them.
                for (var i = 0; i < node.children.length; i++)
                {
                    expand(node.children[i], depth + 1);
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.root, 0);
        // Return the result.
        return traversalResult;
    };
}
