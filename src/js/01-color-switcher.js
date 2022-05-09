const startBtn = document.querySelector('button[data-start]');
const stopBtn = document.querySelector('button[data-stop]');
let timerId = null;

startBtn.addEventListener('click', startChangingBcgColor);
stopBtn.addEventListener('click', stopChangingBcgColor);

function startChangingBcgColor() {
  changeBodyBcgColor();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  timerId = setInterval(() => {
    changeBodyBcgColor();
  }, 1000);
}

function stopChangingBcgColor() {
  clearInterval(timerId);
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function changeBodyBcgColor() {
  document.body.style.backgroundColor = getRandomHexColor();
}
