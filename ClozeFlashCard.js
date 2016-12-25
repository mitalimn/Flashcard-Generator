ClozeFlashCard = function(partialText, answer){
	this.partialText = partialText;
	this.answer = answer;
}

ClozeFlashCard.prototype.question = function() {
	// body...
	return this.partialText;
};

ClozeFlashCard.prototype.cloze = function() {
	// body...
	return this.answer;
};

module.exports = ClozeFlashCard;