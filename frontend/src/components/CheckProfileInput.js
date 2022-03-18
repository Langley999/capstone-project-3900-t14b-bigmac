
// returns error messages if input not valid
// otherwise return an empty string
export const checkProfileInput = (username, email, password) => {
  const regex = '^[a-zA-Z0-9]+[\\._]?[a-zA-Z0-9]+[@]\\w+[.]\\w{2,3}$';

  if (username.length > 50 || username.length < 1) {
    return "Username has to be between 1 and 50 characters inclusively.";
  } else if (password.length > 16 || password.length < 8) {
    return "Password has to be between 8 and 16 characters inclusively";
  } else if (email.length < 1) {
    return "Email should not be empty";
  } else if (!email.match(regex)) {
    return "Email is not valid";
  }
  return '';
}