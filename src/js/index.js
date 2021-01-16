import Swiper, {Navigation, Pagination} from "swiper";

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

  /* Sales scrolling image effect */
  const salesImg = document.querySelector('.sales__bg-person') ;
  const salesOffset = salesImg.offsetTop - document.documentElement.clientHeight;
  let isSalesScrolled = false;
  let timer = setInterval(function() {
    if (isSalesScrolled) clearInterval(timer);
    if (window.pageYOffset >= salesOffset) {
      salesImg.classList.add('scrolled');
      isSalesScrolled = true;
    }
  }, 200);

  /* Prices show more button */
  const pricesWrapper = document.querySelector('.prices__wrapper');
  const pricesBtn = prices.querySelector('.prices__show-btn');
  const pricesContent = prices.querySelector('.prices__content');
  pricesBtn.addEventListener('click', function handler(e) {
    pricesContent.addEventListener('transitionend', function trHandler(e) {
      pricesWrapper.removeChild(pricesBtn);
      this.removeEventListener('transitionend', trHandler);
    });
    pricesContent.classList.add('open');
    this.removeEventListener('click', handler);
  });

  /* <a> smooth scrolling */
  const anchors = document.querySelectorAll('a[data-scroll]');
  anchors.forEach(anchor =>
    anchor.addEventListener('click', function handler(e) {
      e.preventDefault();

      const targetID = this.getAttribute('href');
      document.querySelector(targetID).scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  );
}

window.addEventListener('scroll', function handler() {
  /* Reviews block slider Swiper */
  Swiper.use([Navigation, Pagination]);
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

  this.removeEventListener('scroll', handler);
});

