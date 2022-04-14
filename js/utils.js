function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").textContent = timer;
  }
  if (timer === 0) {
    determineWinner({
      player,
      enemy,
      timerId,
    });
  }
}
