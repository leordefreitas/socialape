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

// VALIDATING CREATE USERS
exports.validateUsersSignUp = data => {
  let validationErrorsCreateUser = {};
    
  // emails
  if (emptyString(data.email)) {
    validationErrorsCreateUser.email = 'Email must be not empty'
  } else if (!isEmail(data.email)) {
    validationErrorsCreateUser.email = 'This is not a email adress'
  }
  // password
  if (emptyString(data.password)) {
    validationErrorsCreateUser.password = 'Password must be not empty'
  } else if (data.password !== data.confirmPassword) {
    validationErrorsCreateUser.password = 'Password must be equal to confirm password'
  }
  // whatsapp
  if (emptyString(data.whatsapp)) {
    validationErrorsCreateUser.whatsapp = 'Whatsapp must be not empty'
  } else if (!isWhatsapp(data.whatsapp)) {
    validationErrorsCreateUser.whatsapp = 'Whatsapp need 11 numbers'
  }
  // name
  if (emptyString(data.name)) {
    validationErrorsCreateUser.name = 'Name must be not empty'
  }
  // validationErrorsCreateUser
  return {
    validationErrorsCreateUser,
    valid: Object.keys(validationErrorsCreateUser).length === 0 ? true : false
  }
};

// VALIDATIG TO LOGIN
exports.validateUsersLogin = data => {
  let validationErrorsLogin = {};
  if (emptyString(data.email)) return validationErrorsLogin.email = 'Must not be empty';
  if (emptyString(data.password)) return validationErrorsLogin.password = 'Must not be empty';
    return {
    validationErrorsLogin,
    valid: Object.keys(validationErrorsLogin).length === 0 ? true : false
  }
};

// VALIDATE REDUCE USER DETAIL
exports.reduceUserDetails = (data) => {
  let userDetail = {};
  // to user put his biography
  if (!emptyString(data.bio.trim())) userDetail.bio = data.bio;
  // to user put his website
  if (!emptyString(data.website.trim())) {
    // just to know if the web site has http://
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetail.website = `http://${data.website.trim()}`;
    } else userDetail.website = data.website;
  }
  // to user put his location
  if (!emptyString(data.location.trim())) userDetail.location = data.location;
  // just to if has something in this box they add if not just pass a empty box
  return userDetail;
};
