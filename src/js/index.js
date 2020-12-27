window.onload = function () {

  /* Price block onclick price shaking animation */
  const priceList = document.querySelector('.prices__list');
  priceList.addEventListener('click', function handler(e) {
    let target = e.target;
    if (target.classList.contains('prices__list-price')) {
      target.classList.add('active');
      target.addEventListener('animationend', function endHandler() {
        this.classList.remove('active');
        this.removeEventListener('transitionend', endHandler);
      });
    }
  });
}
