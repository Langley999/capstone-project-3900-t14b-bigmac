export const url = 'http://localhost:8080';

export const checkProfileInput = (username, email, password) => {
  const regex = '^[a-zA-Z0-9]+[\\._]?[a-zA-Z0-9]*[\\._]*[a-zA-Z0-9]+[@]\\w+[.].*\\w{2,3}$';

  if (username.length > 15 || username.length < 1) {
    return "Username has to be between 1 and 15 characters inclusively.";
  } else if (password.length > 16 || password.length < 8) {
    return "Password has to be between 8 and 16 characters inclusively";
  } else if (email.length < 1) {
    return "Email should not be empty";
  } else if (!email.match(regex)) {
    return "Email is not valid";
  }
  return '';
}

export const createDate = (str) => {
  let li = str.split(' ');
  let time = li[1];
  const date = new Date(li[0].replace(/-/g,"/"));
  return date;
}

export const formatAMPM = (str) => {
  let li = str.split(' ');
  let time = li[1].split(':');
  let hours = time[0];
  let minutes = time[1];
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  let strTime = hours + ':' + minutes + ampm;
  return strTime;
}

export const convertDate = (str) => {
  const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  const strList = str.split(' ');
  if (strList.length === 3) {
    const monthNum = months.indexOf(strList[0])+1;
    let month = monthNum.toString();
    let day = strList[1].substring(0, strList[1].length-2);
    //const year = strList[2].substring(2);
    const year = strList[2];
    if (day.length === 1) day = '0' + day;
    if (month.length === 1) month = '0' + month;
    return day + "/" + month + "/" + year;   
  } else if (strList.length === 2) {
    const monthNum = months.indexOf(strList[0])+1;
    let month = monthNum.toString();
    //const year = strList[2].substring(2);
    const year = strList[1];
    if (month.length === 1) month = '0' + month;
    return month + "/" + year;  
  }
  return str;

}

export const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];