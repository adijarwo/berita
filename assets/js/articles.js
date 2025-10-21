/**
 * articles.js - Menangani penampilan artikel berita
 */

// Data artikel (akan diisi dari API atau data statis)
const articles = [
    {
        id: 7588,
        title: "Belajar Bahasa Inggris Jadi Menyenangkan, UBSI Ajak Anak Panti Asuhan Mizan Amanah Surakarta",
        excerpt: "Surakarta, 19 Oktober 2025 – Suasana ceria mewarnai aula Panti Asuhan Yatim & Dhuafa Mizan...",
        date: "19 Oktober 2025",
        category: "Pendidikan",
        image: "https://via.placeholder.com/600x400?text=Belajar+Bahasa+Inggris",
        url: "#"
    },
    {
        id: 7575,
        title: "BSI Digination Goes To School Hadir di MAN 1 Karanganyar, Kupas Kreativitas Tanpa Batas dengan AI",
        excerpt: "Karanganyar, 7 Oktober 2025 – Universitas Bina Sarana Informatika (UBSI) Kampus Solo kembali menghadirkan kegiatan...",
        date: "7 Oktober 2025",
        category: "Pendidikan",
        image: "https://via.placeholder.com/600x400?text=BSI+Digination",
        url: "#"
    }
    // Tambahkan artikel lain di sini
];

// Fungsi untuk membuat elemen artikel
function createArticleElement(article) {
    const articleCol = document.createElement('div');
    articleCol.className = 'col-md-6 col-lg-4 mb-4';
    
    articleCol.innerHTML = `
        <article class="article-card h-100">
            <div class="article-image">
                <img src="${article.image}" alt="${article.title}" class="img-fluid">
                <span class="badge">${article.category}</span>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span><i class="far fa-calendar-alt me-1"></i> ${article.date}</span>
                    <span><i class="far fa-user ms-3 me-1"></i> Admin</span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <a href="${article.url}" class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;
    
    return articleCol;
}

// Fungsi untuk menampilkan artikel ke halaman
function displayArticles(articles, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Kosongkan container terlebih dahulu
    container.innerHTML = '';
    
    // Tambahkan setiap artikel ke dalam container
    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        container.appendChild(articleElement);
    });
}

// Fungsi untuk memfilter artikel berdasarkan kategori
function filterArticles(category) {
    if (category === 'all') {
        displayArticles(articles, 'articles-container');
    } else {
        const filteredArticles = articles.filter(article => 
            article.category.toLowerCase() === category.toLowerCase()
        );
        displayArticles(filteredArticles, 'articles-container');
    }
}

// Inisialisasi saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Tampilkan semua artikel saat pertama kali dimuat
    displayArticles(articles, 'articles-container');
    
    // Tambahkan event listener untuk filter kategori
    const categoryLinks = document.querySelectorAll('.category-filter');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter artikel
            filterArticles(category);
        });
    });
    
    // Tambahkan event listener untuk form pencarian
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm) {
                const filteredArticles = articles.filter(article => 
                    article.title.toLowerCase().includes(searchTerm) || 
                    article.excerpt.toLowerCase().includes(searchTerm)
                );
                
                displayArticles(filteredArticles, 'articles-container');
                
                // Tampilkan pesan jika tidak ada hasil
                if (filteredArticles.length === 0) {
                    const container = document.getElementById('articles-container');
                    if (container) {
                        container.innerHTML = `
                            <div class="col-12 text-center py-5">
                                <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                                <h3 class="mb-3">Tidak ada artikel yang ditemukan</h3>
                                <p class="text-muted">Tidak ada artikel yang cocok dengan pencarian Anda: <strong>${searchTerm}</strong></p>
                                <button class="btn btn-primary mt-3" onclick="window.location.reload()">Tampilkan Semua Artikel</button>
                            </div>
                        `;
                    }
                }
            }
        });
    }
});
