/**
 * SoloHitz News - Main JavaScript
 * Menambahkan interaktivitas dan fungsionalitas pada website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    // Tampilkan/sembunyikan tombol back to top saat scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    // Animasi scroll ke atas saat tombol diklik
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animasi scroll halus untuk semua link anchor
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Sesuaikan dengan tinggi header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animasi saat elemen masuk ke viewport
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.article-card, .sidebar-widget');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-fadeInUp');
            }
        });
    };
    
    // Jalankan animasi saat scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Jalankan animasi saat halaman pertama kali dimuat
    animateOnScroll();
    
    // Tambahkan kelas aktif pada menu navigasi saat di-scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Tambahkan efek hover pada kartu artikel
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Fungsi untuk menangani pencarian
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchQuery = this.querySelector('input[type="search"]').value.trim();
            
            if (searchQuery) {
                // Lakukan sesuatu dengan query pencarian
                console.log('Mencari:', searchQuery);
                // Di sini Anda bisa menambahkan logika pencarian
                // Misalnya: window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                
                // Contoh notifikasi
                alert(`Hasil pencarian untuk: ${searchQuery}\n(Fitur pencarian dalam pengembangan)`);
            }
        });
    }
    
    // Tambahkan tahun saat ini di footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Inisialisasi tooltip Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Fungsi untuk menambahkan efek loading
function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
        document.body.style.overflow = '';
    }
}

// Contoh penggunaan loading
// showLoading();
// setTimeout(hideLoading, 2000); // Hapus ini di produksi

// Fungsi untuk menangani form kontak
function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Tampilkan loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Mengirim...';
    
    // Simulasi pengiriman form
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Tampilkan pesan sukses
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success mt-3';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = 'Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda kembali.';
        
        form.appendChild(alertDiv);
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
        
        // Reset tombol
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }, 1500);
}

// Inisialisasi form kontak jika ada
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Tampilkan notifikasi
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Sembunyikan notifikasi setelah 5 detik
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Contoh penggunaan notifikasi
// showNotification('Ini adalah pesan sukses!', 'success');
// showNotification('Terjadi kesalahan!', 'error');
// showNotification('Ini adalah pesan informasi', 'info');

// Fungsi untuk menangani langganan newsletter
function handleNewsletter(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Mohon masukkan alamat email Anda', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Mohon masukkan alamat email yang valid', 'error');
        return;
    }
    
    // Simulasi pengiriman data
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification('Terima kasih telah berlangganan newsletter kami!', 'success');
        emailInput.value = '';
    }, 1500);
}

// Fungsi untuk memvalidasi email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Inisialisasi form newsletter jika ada
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletter);
}
