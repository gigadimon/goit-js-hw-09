import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.form');
const delayInput = document.querySelector('input[name="delay"]');
const stepInput = document.querySelector('input[name="step"]');
const amountInput = document.querySelector('input[name="amount"]');

form.addEventListener('submit', creatingPromises);

function creatingPromises(e) {
  e.preventDefault();
  const firstDelay = Number(delayInput.value);
  let promiseCallStep = firstDelay;

  for (let position = 1; position <= amountInput.value; position += 1) {
    createPromise(position, promiseCallStep)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
    promiseCallStep += Number(stepInput.value);
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
