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

makeMore = function() {
        inquirer.prompt({
                type: "confirm",
                name: "more",
                message: "\nwant to create more? (y/n)",
                default: true
            }).then(function(ans) {
                if (ans.more === true) {
                    makeCard();
                } else {
                    console.log("\nGo back to main menu and exit ");
                    init();
                }

            }) //promise clse
    } //fn close

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
                basicCardArray.push(b1);
                fs.readFile('logBasicCard.json', "utf8", function(err, content) {
                        if (err) {
                            console.log("Errrrrrrrr" + err);
                        }
                        var parseJson = JSON.parse(content);
                        console.log(parseJson);
                        parseJson.push(b1);
                        // console.log("=========adding new=========");
                        fs.writeFile('logBasicCard.json', JSON.stringify(parseJson), function(err) {
                                if (err) throw err;
                                // console.log("file updated")
                            }) //file write close
                        makeMore();
                    }) //fs read        
            }) //calback promis
    } //fn close 

makeCardCloze = function() {
        inquirer.prompt([{
                type: "input",
                name: "partial",
                message: "\nEnter question- partial Text of the Card\n"
            }, {
                type: "input",
                name: "anscloze",
                message: "\nEnter answer\n"
            }]).then(function(ans) {
                var c1 = new ClozeFlashCard(ans.partial, ans.anscloze);
                clozeCardArray.push(c1);
                fs.readFile('logCloze.json', "utf8", function(err, content) {
                        if (err) {
                            console.log("Errrrrrrrr" + err);
                        }
                        var parseJson = JSON.parse(content);
                        parseJson.push(c1);
                        // console.log("=========adding new=========");
                        fs.writeFile('logCloze.json', JSON.stringify(parseJson), function(err) {
                                if (err) throw err;
                                // console.log("file updated")
                            }) //file write close
                        makeMore();
                    }) //fs read        
            }) //calback promis
    } //fn close 


playCard = function() {
        inquirer.prompt([{
                type: "list",
                name: "cardType",
                message: "\nBasic or Cloze card\n",
                choices: ["basic-card", "cloze-card"]
            }]).then(function(ans) {

                switch (ans.cardType) {
                    case "basic-card":
                        playCardBasic();
                        break;
                    case "cloze-card":
                        playCardCloze();
                        break;
                    case "Exit":
                        return;
                } //close switch case
            }) //call back close
    } //makecard fn closed

playCardBasic = function() {
        fs.readFile("logBasicCard.json", "utf8", function(err, data) {
                var data = JSON.parse(data);
                var random = Math.floor(Math.random() * data.length);
                // console.log("== Random == " + random);
                console.log("\n\nQuestion : ", data[random].front);
                inquirer.prompt([{
                        type: "input",
                        name: "yourans",
                        message: "Go for it.. - "
                    }]).then(function(basicans) {
                        if (basicans.yourans.toLowerCase() === data[random].back.toLowerCase()) {
                            console.log("\nYou guessed it right..");
                            playCard();
                        } else {
                            this.guessed++;
                            console.log("\nWrong answer..");
                            console.log("\nCorrect Answer is : ", data[random].back);
                        }

                        playAgain();
                    }) //promise
            }) //readfile close
    } //fn close

function playAgain() {
    inquirer.prompt({
            type: "confirm",
            name: "more",
            message: "\nwant to play again (y/n)",
            default: true
        }).then(function(ans) {
            if (ans.more === true) {
                playCard();
            } else {
                console.log("\nGo back to main menu and exit ");
                init();
            }

        }) //promise clse
}
playCardCloze = function() {
    fs.readFile("logCloze.json", "utf8", function(err, data) {
            var data = JSON.parse(data);
            var random = Math.floor(Math.random() * data.length);
            // console.log("== Random == " + random);
            console.log("\n\nQuestion ==-----", data[random].partialText);
            inquirer.prompt([{
                    type: "input",
                    name: "yourans",
                    message: "Go for it.. - "
                }]).then(function(clozeans) {
                    if (clozeans.yourans.toLowerCase() === data[random].answer.toLowerCase()) {
                        console.log("\nYou guessed it right..");
                        playCard();
                    } else {
                        console.log("\nWrong answer..");
                        data[random].partialText = data[random].partialText.replace("----",
                            data[random].answer);
                        console.log("\nCorrect Answer is : " + data[random].partialText);
                    }

                    playAgain();
                }) //promise
        }) //readfile close
}

init();
