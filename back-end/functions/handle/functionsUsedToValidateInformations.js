// FUNCTIONS TO VALIDATE SOME INFORMATIONS THAT USER PUT ON
const emptyString = (string) => {
  if (string.trim() === '') return true;
  else return false;
};
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};
const isWhatsapp = (whatsappNumber) => {
  if (whatsappNumber.toString().length === 11) return true;
  else return false;
};

module.exports = { emptyString, isEmail, isWhatsapp };