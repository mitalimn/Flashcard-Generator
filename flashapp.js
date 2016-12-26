var inquirer = require("inquirer");
var fs = require("fs");

var BasicFlashCard = require("./BasicFlashCard");
var ClozeFlashCard = require("./ClozeFlashCard");

var basicCardArray = [];
var clozeCardArray = [];

init = function() {
    inquirer.prompt([{
        type: "list",
        name: "doWhat",
        message: "\nDo what with Flash Cards ???\n",
        choices: ["create-card", "play-card", "exit"]
    }]).then(function(ans) {
        if (ans.doWhat === "create-card") {
            makeCard();
        } else if (ans.doWhat === "play-card") {
            playCard();
        } else
            return;
    });

}

makeCard = function() {
        inquirer.prompt([{
                type: "list",
                name: "cardType",
                message: "\nBasic or Cloze card\n",
                choices: ["basic-card", "cloze-card"]
            }]).then(function(ans) {

                switch (ans.cardType) {
                    case "basic-card":
                        makeCardBasic();
                        break;
                    case "cloze-card":
                        makeCardCloze();
                        break;
                    case "Exit":
                        return;
                } //close switch case
            }) //call back close
    } //makecard fn closed

makeCardBasic = function() {
        inquirer.prompt([{
            type: "input",
            name: "front",
            message: "\nEnter question- front of the Card\n"
        }, {
            type: "input",
            name: "back",
            message: "\nEnter answer- back of the card\n"
        }]).then(function(ansbasic) {

            var b1 = new BasicFlashCard(ansbasic.front, ansbasic.back);
            // basicCardArray.push(b1);
            // fs.exists('myjsonfile.json', function(exists){
            // 	if(exists){}
            // }
            fs.readFile('logBasicCard.json', "utf8", function(err, content) {
                if (err)
                    console.log("Errrrrrrrr" + err);
                var parseJson = JSON.parse(content);
                // console.log(parseJson);
                parseJson.push(b1);
                // console.log("=========adding new=========");
                fs.writeFile('logBasicCard.json', JSON.stringify(parseJson), function(err) {
                        if (err) throw err;
                        // console.log("file updated")
                    }) //file write close
                makeMore();

            })//fs read
        })//calback promis
    } //fn close 

makeMore = function() {
    inquirer.prompt({
        type: "confirm",
        name: "more",
        message: "\nwant to create more? (y/n)",
        default: true
    }).then(function(ans) {
        if (ans.more === true) {
            makeCard();
        } else{
            console.log("\nGo back to main menu and exit ");
            init();	
        }
        
    })
}


























playCard = function() {
    inquirer.prompt([{
        type: "list",
        name: "cardType",
        message: "\nBasic or Cloze card\n",
        choices: ["basic-card", "cloze-card"]
    }]).then(function(ans) {
        if (ans.cardType === "basic-card") {
            fs.readFile("logBasicCard.json", "utf8", function(err, data) {

                    var data = JSON.parse(data);
                    // console.log(data);
                    //to generate random questions
                    // var qAsked = false;
                    var random = Math.floor(Math.random() * data.length);
                    // console.log("== Random == " + random);
                    console.log("question ==-----", data[random].front);
                    inquirer.prompt([{
                        type: "input",
                        name: "yourans",
                        message: "Go for it.. "
                    }]).then(function(basicans) {
                        if (basicans.yourans.toLowerCase() === data[random].back.toLowerCase()) {
                            console.log("\nYou guessed it right..");
                            playCard();
                        }
                        console.log("\nWrong answer..");
                        console.log("\nCorrect Answer is : ", data[random].back);
                    })


                })
                //call back fs.read close

            inquirer.prompt({
                type: "confirm",
                name: "playagain",
                message: "want to play again ?(y/n)",
                default: true
            })

            playCard();

        } else if (ans.cardType === "cloze-card") {
            fs.readFile("logCloze.json", "utf8", function(err, data) {

                    var data = JSON.parse(data);
                    console.log(data);

                    var random = Math.floor(Math.random() * data.length);
                    // console.log("== Random == " + random);
                    console.log("question : ", data[random].partialText);

                    inquirer.prompt([{
                        type: "input",
                        name: "clozeyourans",
                        message: "Go for it..."
                    }]).then(function(anscloze) {
                        if (anscloze.clozeyourans.toLowerCase() === data[random].answer.toLowerCase()) {
                            console.log("You guessed it right");
                        } else
                            console.log("Thats a wrong answer");
                        console.log("\n Correct ans is : ", data[random].answer);
                    })

                }) //close read file 
        } //else closed
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

init();
