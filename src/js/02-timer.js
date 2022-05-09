import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/dark.css');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startTimerBtn = document.querySelector('button[data-start]');
const daysContent = document.querySelector('span[data-days]');
const hoursContent = document.querySelector('span[data-hours]');
const minutesContent = document.querySelector('span[data-minutes]');
const secondsContent = document.querySelector('span[data-seconds]');

let intervalId = null;
let targetData = null;
let leftTime = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  disableMobile: true,
  minuteIncrement: 1,
  onChange(selectedDates) {
    /* При изменении даты на корректную: ресетим контент таймера(можно и не ресетить, но так логичнее, как по мне :D), сбрасывает слушателя события и 
    очищаем интервал, чтобы можно было запускать таймер заново на новую дату, не перезагружая страницу */
    if (selectedDates[0].getTime() <= Date.now()) {
      return;
    }
    resetContent(daysContent);
    resetContent(hoursContent);
    resetContent(minutesContent);
    resetContent(secondsContent);
    clearInterval(intervalId);
    startTimerBtn.removeEventListener('click', startTimer);
  },
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= Date.now()) {
      Notify.failure('Please choose a date in the future');
      /* Ставлю в этом месте disabled=true, тк когда выбираешь корректную дату, не запускаешь таймер, а после, не перезагружая страницу, 
      выбираешь некорректную, то просто выдаёт ошибку Notify, но даёт запустить таймер с выбранной последней корректной датой */
      startTimerBtn.disabled = true;
      return;
    }
    targetData = selectedDates[0];
    startTimerBtn.disabled = false;
    startTimerBtn.addEventListener('click', startTimer);
  },
};

flatpickr('#datetime-picker', options);

function startTimer() {
  getLeftTime();
  changeTimerContent();
  intervalId = setInterval(() => {
    getLeftTime();
    if (leftTime >= 0) {
      changeTimerContent();
    }
  }, 1000);
  startTimerBtn.disabled = true;
}

function changeTimerContent() {
  const leftTimeObject = convertMs(leftTime);
  daysContent.textContent = addLeadingZero(leftTimeObject.days);
  hoursContent.textContent = addLeadingZero(leftTimeObject.hours);
  minutesContent.textContent = addLeadingZero(leftTimeObject.minutes);
  secondsContent.textContent = addLeadingZero(leftTimeObject.seconds);
}

function getLeftTime() {
  leftTime = targetData.getTime() - Date.now();
}

function resetContent(element) {
  element.textContent = '00';
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
