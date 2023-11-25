

var question = function(description, libelle, type, resp ){
    this.libelle = libelle;
    this.type = type;
    this.consigne = description;
    this.reponses = resp;
}

module.exports = question;