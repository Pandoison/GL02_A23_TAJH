let question = function(indication, consigne, type, resp ){
    this.consigne = consigne;
    this.type = type;
    this.indication = indication;
    this.reponses = resp;
}

module.exports = question;