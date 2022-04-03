
// returns error messages if input not valid
// otherwise return an empty string
const checkProfileInput = (username, email, password) => {
  const regex = '^(?!\.)[0-9a-zA-Z\.]+(?<!\.)@(?!\.)[0-9a-zA-Z\.]+(?<!\.)$';

  if (username.length > 50 || username.length < 1) {
    return "Username has to be between 1 and 50 characters inclusively.";
  } else if (password.length > 16 || password.length < 8) {
    return "Password has to be between 8 and 16 characters inclusively";
  } else if (email.length < 1) {
    return "Email should not be empty";
  } else if (!email.match(regex)) {
    console.log(regex);
    return "Email is not valid";
  }
  return '';
}

export default checkProfileInput;