function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // UTC offset in hours (e.g. +1, -3)
  const offsetMinutes = -now.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);

  document.getElementById('clock').textContent =
    `${hours}:${minutes}:${seconds} (UTC ${offsetSign}${offsetHours})`;
}

updateClock();
setInterval(updateClock, 1000);