// Initialize Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('bg-white/80', 'backdrop-blur-xl', 'border-b', 'border-slate-100', 'shadow-sm');
        navbar.classList.remove('bg-transparent');
    } else {
        navbar.classList.remove('bg-white/80', 'backdrop-blur-xl', 'border-b', 'border-slate-100', 'shadow-sm');
        navbar.classList.add('bg-transparent');
    }
});

// Scroll Reveal Animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-scale').forEach((el) => {
    observer.observe(el);
});

// Pricing Toggle Logic
const prices = {
    inr: { 
        mon: { sym: '₹', val: '149', orig: '₹299', link: 'https://rzp.io/rzp/aiexportstudio-monthly' }, 
        life: { sym: '₹', val: '299', old: '499', orig: '₹999', link: 'https://rzp.io/rzp/aiexportstudio-lifetime' }, 
        android: { sym: '₹', val: '199', old: '299' },
        agency: { sym: '₹', val: '1499', orig: '₹2999' } 
    },
    usd: { 
        mon: { sym: '$', val: '4.99', orig: '$9.99', link: 'https://www.paypal.com/ncp/payment/87C9X6ZQEZK34' }, 
        life: { sym: '$', val: '12.99', old: '19.99', orig: '$49.99', link: 'https://www.paypal.com/ncp/payment/QBDYQZSFPNL28' }, 
        android: { sym: '$', val: '9.99', old: '14.99' },
        agency: { sym: '$', val: '49', orig: '$99' } 
    }
};

// Waitlist Toggle Logic
const showBtn = document.getElementById('show-waitlist-btn');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistSuccess = document.getElementById('waitlist-success');
const emailInput = document.getElementById('waitlist-email');
const submitBtn = document.getElementById('submit-waitlist');

if (showBtn) {
    showBtn.onclick = () => {
        showBtn.classList.add('hidden');
        waitlistForm.classList.remove('hidden');
        emailInput.focus();
    };
}

if (submitBtn) {
    submitBtn.onclick = () => {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorText = document.getElementById('waitlist-error');

        if (emailRegex.test(email)) {
            // Hide error if previously shown
            if (errorText) errorText.classList.add('hidden');
            
            // Instantly transition to success view
            waitlistForm.classList.add('hidden');
            waitlistSuccess.classList.remove('hidden');

            const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx78R8D2aNnS2BFSUmNAMZrKr15jVWMekMZ7HFM29tMsN61Nrvr4XuFc02iryQa9Uc-ww/exec';
            
            // Fire and forget (don't await) so UI doesn't freeze
            fetch(APPS_SCRIPT_URL + '?action=waitlist', {
                method: 'POST',
                body: JSON.stringify({ email: email, plan: 'Agency Lifetime', source: 'Landing Page' }),
                headers: { 'Content-Type': 'text/plain' }
            }).catch(e => console.error('Waitlist storage failed:', e));

        } else {
            // Show error state
            emailInput.classList.add('border-red-400', 'shake');
            if (errorText) errorText.classList.remove('hidden');
            
            setTimeout(() => {
                emailInput.classList.remove('border-red-400', 'shake');
                if (errorText) errorText.classList.add('hidden');
            }, 3000);
        }
    };

    // Bind 'Enter' key to trigger the submit button instantly
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }
}

let currentCurrency = 'inr';
const toggleBtn = document.getElementById('currency-toggle');
const toggleKnob = document.getElementById('toggle-knob');
const labelInr = document.getElementById('label-inr');
const labelUsd = document.getElementById('label-usd');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        currentCurrency = currentCurrency === 'inr' ? 'usd' : 'inr';
        
        // Update Toggle UI
        if (currentCurrency === 'usd') {
            toggleKnob.classList.replace('translate-x-0', 'translate-x-[24px]');
            labelInr.classList.replace('text-blue-600', 'text-slate-400');
            labelUsd.classList.replace('text-slate-400', 'text-blue-600');
            toggleBtn.classList.replace('bg-emerald-500', 'bg-purple-600');
            const knobSym = document.getElementById('knob-symbol');
            knobSym.classList.replace('text-emerald-600', 'text-purple-600');
            knobSym.textContent = '$';
        } else {
            toggleKnob.classList.replace('translate-x-[24px]', 'translate-x-0');
            labelInr.classList.replace('text-slate-400', 'text-blue-600');
            labelUsd.classList.replace('text-blue-600', 'text-slate-400');
            toggleBtn.classList.replace('bg-purple-600', 'bg-emerald-500');
            const knobSym = document.getElementById('knob-symbol');
            knobSym.classList.replace('text-purple-600', 'text-emerald-600');
            knobSym.textContent = '₹';
        }

        // Update Prices
        const p = prices[currentCurrency];
        
        document.querySelectorAll('.price-sym').forEach(el => el.textContent = p.mon.sym);
        
        document.querySelector('.price-val-mon').textContent = p.mon.val;
        document.querySelector('.price-orig-mon').textContent = p.mon.orig;
        document.getElementById('link-mon').href = p.mon.link;

        document.querySelector('.price-val-life').textContent = p.life.val;
        const oldValEl = document.querySelector('.price-val-life-old');
        if (oldValEl) oldValEl.textContent = p.life.old;
        document.querySelector('.price-orig-life').textContent = p.life.orig;
        document.getElementById('link-life').href = p.life.link;

        const androidValEl = document.querySelector('.price-val-android');
        if (androidValEl) androidValEl.textContent = p.android.val;
        const androidOldEl = document.querySelector('.price-old-android');
        if (androidOldEl) androidOldEl.textContent = p.android.old;

        document.querySelector('.price-val-agency').textContent = p.agency.val;
        document.querySelector('.price-orig-agency').textContent = p.agency.orig;
    });
}