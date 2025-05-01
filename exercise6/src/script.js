document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    hamburger.addEventListener('click', function () {
        mainNav.classList.toggle('show');
    });
});

document.querySelectorAll('.footer-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const column = toggle.closest('.footer-column');
        column.classList.toggle('active');
        toggle.textContent = toggle.textContent.includes('▼')
            ? toggle.textContent.replace('▼', '▲')
            : toggle.textContent.replace('▲', '▼');
    });
});

