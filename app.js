$(document).ready(function() {
// document.ready means when the page is loaded, this code is executed
// this is jQuery
    $('.photo-slider').slick({
        arrows: false,
        dots: true,
        appendDots: '.photos-slider-dot',
        dotsClass: 'dots'
    });

    $('.project-slider').slick({
        arrows: false,
        dots: true,
        appendDots: '.projects-slider-dot',
        dotsClass: 'dots'
    });

    let hamburger = document.querySelector('.hamburger-button');
    let exit = document.querySelector('.exit');
    let mobileNav = document.querySelector('.mobile-nav');
    let click = document.querySelector('.click');
    let click1 = document.querySelector('.click-1');
    let click2 = document.querySelector('.click-2');
    let click3 = document.querySelector('.click-3');
    let click4 = document.querySelector('.click-4');
    let click5 = document.querySelector('.click-5');

    hamburger.addEventListener('click', function() {
        mobileNav.classList.add('open');
    });

    exit.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click1.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click2.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click3.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click4.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });

    click5.addEventListener('click', function() {
        mobileNav.classList.remove('open');
    });
    

});
