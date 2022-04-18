const USER = "connectly_user";
const DATE = "connectly_date";

export function getUser() {
  const user = localStorage.getItem(USER);

  if (!user) return user;

  return JSON.parse(user);
}

export function login(user) {
  if (Object.keys(user).length === 0) return;

  const userString = JSON.stringify(user);
  localStorage.setItem(USER, userString);
}

export function logout() {
  localStorage.removeItem(USER);
  localStorage.removeItem(DATE);
}

export function setSessionStart() {
  const date = Date.now();
  const dateString = JSON.stringify(date);

  localStorage.setItem(DATE, dateString);
}

export function getSessionStart() {
  const dateString = localStorage.getItem(DATE);

  return JSON.parse(dateString);
}
