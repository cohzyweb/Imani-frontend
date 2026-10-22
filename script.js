document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close drawer when tapping the backdrop or a nav link
        nav.addEventListener('click', (e) => {
            if (e.target === nav || e.target.closest('a')) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Header scroll state
    const header = document.querySelector('.header');
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Scroll-reveal for below-the-fold sections (no effect on visible content)
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.body.classList.add('reveal-ready');

        document.querySelectorAll('body > section, body > footer').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.92) {
                el.classList.add('will-reveal');
                io.observe(el);
            }
        });
    }
});

function setCookie(name,value,days){
    let expires = "";
    if(days){
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name){
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++){
        let c = ca[i];
        while(c.charAt(0)==' ') c = c.substring(1,c.length);
        if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function(){

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("acceptCookies");

    if(!banner || !acceptBtn) return;

    if(!getCookie("cookieConsent")){
        banner.style.display = "flex";
    }

    acceptBtn.addEventListener("click", function(){
        setCookie("cookieConsent","accepted",365);
        banner.style.display = "none";
    });

});
