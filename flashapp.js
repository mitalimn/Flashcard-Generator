var inquirer = require("inquirer");
var fs = require("fs");

var BasicFlashCard = require("./BasicFlashCard");
var ClozeFlashCard = require("./ClozeFlashCard");

var basicCardArray = [];
var clozeCardArray = [];

inquirer.prompt([{
	type: "list",
    name: "doWhat",
    message: "\nDo what with Flash Cards ???\n",
    choices: ["create-card", "play-card", "exit"]
}]).then(function(ans){
	if(ans.doWhat === "create-card"){
		makeCard();
		// console.log("Enter front text for the card");
	}
	else if(ans.doWhat === "play-card"){
		playCard();
	}
	else
		return;
});


makeCard = function(){
	inquirer.prompt([{
		type: "list",
        name: "cardType",
        message: "\nBasic or Cloze card\n",
        choices: ["basic-card", "cloze-card"]
	}]).then(function(ans){
		if(ans.cardType === "basic-card"){
			inquirer.prompt([{
                type: "input",
                name: "front",
                message: "\nEnter question- front of the Card\n"
            }, {
                type: "input",
                name: "back",
                message: "\nEnter answer- back of the card\n"
            }]).then(function(ansbasic){
            	var b1 = new BasicFlashCard(ansbasic.front, ansbasic.back);
            	basicCardArray.push(b1);
            	basicJSON = JSON.stringify(basicCardArray);
                console.log("myjson" + basicJSON);
                logEverything(basicJSON);
//Ask the user if wants to create one more 
            	inquirer.prompt({
            		type : "confirm",
            		name : "more",
            		message : "want to create more? (y/n)",
            		default : true
            	})
				makeCard();
            })
		}
		else if(ans.cardType === "cloze-card"){
			inquirer.prompt([{
                type: "input",
                name: "partialtext",
                message: "\nEnter question- with blank (Ex. ---- is capital of India )\n"
            }, {
                type: "input",
                name: "cloze",
                message: "\nEnter answer- which was in the blank\n"
            }]).then(function(anscloze){
            	var c1 = new ClozeFlashCard(anscloze.partialtext, anscloze.cloze);
            	clozeCardArray.push(c1);
            	clozeJSON = JSON.stringify(clozeCardArray);
                console.log("myjson" + clozeJSON);
                logCloze(clozeJSON);
                inquirer.prompt({
            		type : "confirm",
            		name : "more",
            		message : "want to create more? (y/n)",
            		default : true
            	})
				makeCard();
			})
		}
	})
}

playCard = function(){
	inquirer.prompt([{
		type: "list",
        name: "cardType",
        message: "\nBasic or Cloze card\n",
        choices: ["basic-card", "cloze-card"]
	}]).then(function(ans){
		if(ans.cardType === "basic-card"){
			fs.readFile("logBasicCard.json", "utf8", function(err, data) {

                    var data = JSON.parse(data);
                    // console.log(data);
                    //to generate random questions
                    // var qAsked = false;
                    var random = Math.floor(Math.random() * data.length);
                    // console.log("== Random == " + random);
                    console.log("question ==-----", data[random].front);
inquirer.prompt([{	type : "input",
					name :"yourans",
					message : "Go for it.. "
					}]).then(function(basicans){
						if(basicans.yourans.toLowerCase() === data[random].back.toLowerCase()){
							console.log("\nYou guessed it right..");
							playCard();
						}
						console.log("\nWrong answer..");
						console.log("\nCorrect Answer is : ", data[random].back);
					})
					
				
                })
                 //call back fs.read close

                 inquirer.prompt({
            		type : "confirm",
            		name : "playagain",
            		message : "want to play again ?(y/n)",
            		default : true
            	})

			playCard();

		}
		else if(ans.cardType === "cloze-card"){
			
		}
	})
}


function logEverything(logDataObj) {
    fs.appendFile("logBasicCard.json", logDataObj, function(err) {
        if (err) {
            console.log("Error in writing file " + err);
        }
        console.log("File updated");
    });
}


function logCloze(logDataObj) {
    fs.appendFile("logCloze.json", logDataObj, function(err) {
        if (err) {
            console.log("Error in writing file " + err);
        }
        console.log("File updated");
    });
}