let question = function(id, indication, consigne, type, resp ){
    this.id = id;
    this.consigne = consigne;
    this.type = type;
    this.indication = indication;
    this.reponses = resp;
}

module.exports = question;