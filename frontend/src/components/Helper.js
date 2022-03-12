export const url = 'http://localhost:8080';

export const checkProfileInput = (username, email, password) => {
  const regex = '^[a-zA-Z0-9]+[\\._]?[a-zA-Z0-9]+[@]\\w+[.]\\w{2,3}$';

  if (username.length > 50 || username.length < 1) {
    alert("Username has to be between 1 and 50 characters inclusively.");
    return false;
  } else if (password.length > 16 || password.length < 8) {
    alert("Password has to be between 8 and 16 characters inclusively");
    return false;
  } else if (email.length < 1) {
    alert("Email should not be empty");
    return false;
  }else if (!email.match(regex)) {
    alert("Email is not valid");
    return false;
  }

  return true;
}