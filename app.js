document.addEventListener('DOMContentLoaded', function () {

    // ─── Mobile Nav ───────────────────────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger-button');
    const exit = document.querySelector('.exit');
    const mobileNav = document.querySelector('.mobile-nav');
    const navClicks = document.querySelectorAll('.click, .click-1, .click-2, .click-3, .click-4, .click-5');

    if (hamburger) hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    if (exit) exit.addEventListener('click', () => mobileNav.classList.remove('open'));
    navClicks.forEach(el => el.addEventListener('click', () => mobileNav.classList.remove('open')));


    // ─── Projects Grid ────────────────────────────────────────────────────────
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const totalCards = cards.length;
    let cardsPerPage = window.innerWidth <= 576 ? 1 : 6;
    let totalPages = Math.ceil(totalCards / cardsPerPage);
    let currentPage = 0;

    const prevBtn = document.querySelector('.projects-prev-slide');
    const nextBtn = document.querySelector('.projects-next-slide');
    const dotsContainer = document.querySelector('.projects-slider-dot');
    const pageLabel = document.querySelector('.projects-page-label');

    function getCardsPerPage() {
        return window.innerWidth <= 576 ? 1 : 6;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'dots';
        for (let i = 0; i < totalPages; i++) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.setAttribute('aria-label', 'Page ' + (i + 1));
            btn.addEventListener('click', () => goToPage(i));
            li.appendChild(btn);
            ul.appendChild(li);
        }
        dotsContainer.appendChild(ul);
    }

    function renderPage(page, direction) {
        const start = page * cardsPerPage;
        const end = start + cardsPerPage;

        // Determine animation classes
        const enterClass = direction === 'next' ? 'page-enter-right' : 'page-enter-left';

        cards.forEach((card, i) => {
            if (i >= start && i < end) {
                card.style.display = '';
                card.classList.remove('page-enter-left', 'page-enter-right');
                void card.offsetWidth; // reflow to restart animation
                card.classList.add(enterClass);
            } else {
                card.style.display = 'none';
                card.classList.remove('page-enter-left', 'page-enter-right');
            }
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll('li');
        dots.forEach((li, i) => li.classList.toggle('active-dot', i === page));

        // Arrows always enabled (wrapping)
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;

        if (pageLabel) pageLabel.textContent = (page + 1) + ' / ' + totalPages;
    }

    function goToPage(page, direction) {
        const wrapped = (page + totalPages) % totalPages;
        const dir = direction || (wrapped > currentPage ? 'next' : 'prev');
        currentPage = wrapped;
        renderPage(currentPage, dir);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1, 'prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1, 'next'));

    // Keyboard navigation (only when modal is closed)
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('open')) return;
        if (e.key === 'ArrowLeft') goToPage(currentPage - 1, 'prev');
        if (e.key === 'ArrowRight') goToPage(currentPage + 1, 'next');
    });

    buildDots();
    renderPage(0, 'next');

    // Swipe support for mobile
    const gridWrapper = document.querySelector('.project-grid-wrapper');
    let touchStartX = 0;
    if (gridWrapper) {
        gridWrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        gridWrapper.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToPage(currentPage + 1, 'next');
                else goToPage(currentPage - 1, 'prev');
            }
        });
    }

    window.addEventListener('resize', () => {
        const newCpp = getCardsPerPage();
        if (newCpp !== cardsPerPage) {
            cardsPerPage = newCpp;
            totalPages = Math.ceil(totalCards / cardsPerPage);
            currentPage = 0;
            buildDots();
            renderPage(0, 'next');
        }
    });


    // ─── Project Modal ────────────────────────────────────────────────────────
    const modal = document.getElementById('project-modal');
    const modalBody = modal.querySelector('.modal-body');
    const modalClose = modal.querySelector('.modal-close');
    let currentModalIndex = -1;

    function openModal(card) {
        currentModalIndex = parseInt(card.dataset.index, 10);
        renderModal(card);
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        modalClose.focus();
    }

    function renderModal(card) {
        const imgEl = card.querySelector('img');
        const imgSrc = imgEl ? imgEl.src : null;
        const title = card.querySelector('h2');
        const linkBtns = card.querySelector('.link-btns');
        const techStack = card.querySelector('.tech-stack');
        const desc = card.querySelector('p');

        modalBody.innerHTML = '';

        if (imgSrc) {
            const modalImg = document.createElement('img');
            modalImg.className = 'modal-project-img';
            modalImg.src = imgSrc;
            modalBody.appendChild(modalImg);
        }
        if (title) modalBody.appendChild(title.cloneNode(true));
        if (linkBtns) modalBody.appendChild(linkBtns.cloneNode(true));
        if (techStack) {
            const ts = techStack.cloneNode(true);
            ts.style.display = 'flex';
            modalBody.appendChild(ts);
        }
        if (desc) modalBody.appendChild(desc.cloneNode(true));

        modalBody.scrollTop = 0;
    }

    function navigateModal(direction) {
        const newIndex = (currentModalIndex + direction + cards.length) % cards.length;
        currentModalIndex = newIndex;
        // Switch to the page containing this card
        const targetPage = Math.floor(newIndex / cardsPerPage);
        if (targetPage !== currentPage) goToPage(targetPage, direction > 0 ? 'next' : 'prev');
        renderModal(cards[newIndex]);
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    // Open modal on card click (including the image link, but not other links like title/link-btns)
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const imgLink = card.querySelector('a:first-child');
            // If click is on the image or its wrapping anchor, open modal instead of navigating
            if (imgLink && (e.target === imgLink || imgLink.contains(e.target))) {
                e.preventDefault();
                openModal(card);
                return;
            }
            // Don't open modal if clicking title link or link-btns
            if (e.target.closest('.link-btns') || e.target.closest('h2 a')) return;
            if (e.target.closest('a')) return;
            openModal(card);
        });
    });

    // Close modal
    if (modalClose) modalClose.addEventListener('click', closeModal);
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');
    if (modalPrev) modalPrev.addEventListener('click', () => navigateModal(-1));
    if (modalNext) modalNext.addEventListener('click', () => navigateModal(1));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateModal(1);
        if (e.key === 'ArrowLeft') navigateModal(-1);
    });


    // ─── Photo Slider ─────────────────────────────────────────────────────────
    const track = document.querySelector('.photo-track');
    const photoSlides = track ? Array.from(track.querySelectorAll('.photo-slide')) : [];
    const photoCount = photoSlides.length;
    const photoPrev = document.querySelector('.photos-prev-slide');
    const photoNext = document.querySelector('.photos-next-slide');
    const photoDots = document.querySelector('.photos-slider-dot');
    let photoIndex = 0;

    function buildPhotoDots() {
        if (!photoDots) return;
        photoDots.innerHTML = '';
        const ul = document.createElement('ul');
        ul.className = 'dots';
        for (let i = 0; i < photoCount; i++) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.setAttribute('aria-label', 'Photo ' + (i + 1));
            btn.addEventListener('click', () => goToPhoto(i));
            li.appendChild(btn);
            ul.appendChild(li);
        }
        photoDots.appendChild(ul);
    }

    function goToPhoto(index) {
        photoIndex = (index + photoCount) % photoCount;
        if (track) track.style.transform = 'translateX(-' + (photoIndex * 100) + '%)';
        const dots = photoDots ? photoDots.querySelectorAll('li') : [];
        dots.forEach((li, i) => li.classList.toggle('active-dot', i === photoIndex));
        if (photoPrev) photoPrev.disabled = false;
        if (photoNext) photoNext.disabled = false;
    }

    if (photoPrev) photoPrev.addEventListener('click', () => goToPhoto(photoIndex - 1));
    if (photoNext) photoNext.addEventListener('click', () => goToPhoto(photoIndex + 1));

    if (track) {
        buildPhotoDots();
        goToPhoto(0);
    }

});
