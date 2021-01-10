import Swiper, {Navigation, Pagination} from "swiper";
Swiper.use([Navigation, Pagination]);

window.onload = function () {
  /* Prices block onclick price shaking animation */
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

  /* Burger menu */
  const menu = document.querySelector('header.menu');
  const menuBtn = menu.querySelector('.menu__burger');
  menuBtn.addEventListener('click', function handler(e) {
    menu.classList.toggle('active');
  });
}
/* Reviews block slider Swiper */
const swiperReviews = new Swiper('.swiper-container', {
  loop: true,
  autoHeight: true,

  pagination: {
    el: '.reviews__pagination',
  },

  navigation: {
    nextEl: '.reviews__btn-next',
    prevEl: '.reviews__btn-prev',
  },
});
