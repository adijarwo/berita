/**
 * popular-posts.js - Menangani tampilan berita populer di halaman utama
 */

let apiPosts = []; // Variable global untuk menyimpan data dari API

// Data mock sebagai fallback jika API gagal
const mockPosts = [
    {
        id: 1,
        title: "BSI Digination Goes To School Hadir di MAN 1 Karanganyar",
        excerpt: "Workshop kreativitas dengan AI di sekolah...",
        date: "7 Oktober 2025",
        category: "Event",
        image: 'assets/image/default-news.jpg',
        url: '#',
        isFeatured: true,
        content: '<p>Full content mock...</p>'
    },
    {
        id: 2,
        title: "Kisah Vania, Mahasiswa UBSI Surakarta",
        excerpt: "Magang di Disdukcapil Surakarta...",
        date: "2 Oktober 2025",
        category: "Pendidikan",
        image: 'assets/image/default-news.jpg',
        url: '#',
        isFeatured: false,
        content: '<p>Full content mock...</p>'
    },
    {
        id: 3,
        title: "UBSI Semakin Kompetitif, Rekor 97 Dosen",
        excerpt: "Raih sertifikasi di tahun 2025...",
        date: "2 Oktober 2025",
        category: "Prestasi",
        image: 'assets/image/default-news.jpg',
        url: '#',
        isFeatured: false,
        content: '<p>Full content mock...</p>'
    },
    {
        id: 4,
        title: "Quantum Tak Lagi Sekadar Teori",
        excerpt: "Cyber University bawa Indonesia ke panggung dunia...",
        date: "2 Oktober 2025",
        category: "Teknologi",
        image: 'assets/image/default-news.jpg',
        url: '#',
        isFeatured: false,
        content: '<p>Full content mock...</p>'
    },
    {
        id: 5,
        title: "Magang Menjadi Guru: Pengalaman Mahasiswa UBSI",
        excerpt: "Di dunia pendidikan...",
        date: "1 Oktober 2025",
        category: "Magang",
        image: 'assets/image/default-news.jpg',
        url: '#',
        isFeatured: false,
        content: '<p>Full content mock...</p>'
    }
];

// Fungsi untuk mengambil data dari API dengan proxy
async function fetchPosts() {
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = 'https://solohitz.com/wp-json/wp/v2/posts?per_page=5&_embed';
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        
        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari API: Status ${response.status}`);
        }
        
        const data = await response.json();
        apiPosts = data.map(post => formatPostData(post));
        return apiPosts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        apiPosts = mockPosts;
        return apiPosts;
    }
}

// Format data dari API
function formatPostData(post) {
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    return {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
        date: new Date(post.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Berita',
        image: featuredMedia?.source_url || 'assets/image/default-news.jpg',
        url: post.link,
        isFeatured: false, // Hanya post pertama yang dianggap featured
        content: post.content.rendered
    };
}

// Fungsi untuk membuat elemen featured post (gambar di atas, judul di bawah)
function createFeaturedPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'col-12 mb-4';
    
    const detailUrl = `berita-detail.html?id=${post.id}`;
    
    postElement.innerHTML = `
        <div class="card featured-post-large border-0 shadow-lg">
            <a href="${detailUrl}">
                <img src="${post.image}" class="card-img-top img-fluid" alt="${post.title}">
            </a>
            <div class="card-body">
                <div class="post-meta mb-2">
                    <span class="badge bg-danger me-2">Featured</span>
                    <span class="badge bg-primary me-2">${post.category}</span>
                    <span class="text-muted"><i class="far fa-calendar-alt me-1"></i> ${post.date}</span>
                </div>
                <h2 class="card-title mb-3">
                    <a href="${detailUrl}" class="text-dark text-decoration-none">${post.title}</a>
                </h2>
                <p class="card-text">${post.excerpt}</p>
                <a href="${detailUrl}" class="btn btn-primary">
                    Baca Selengkapnya <i class="fas fa-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
    `;
    
    return postElement;
}

// Fungsi untuk membuat elemen berita terbaru (kecil)
function createRecentPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'col-md-4 mb-3';
    
    const detailUrl = `berita-detail.html?id=${post.id}`;
    
    postElement.innerHTML = `
        <div class="card h-100 shadow-sm">
            <a href="${detailUrl}">
                <img src="${post.image}" class="card-img-top" alt="${post.title}" style="height: 150px; object-fit: cover;">
            </a>
            <div class="card-body d-flex flex-column">
                <div class="post-meta mb-2 small">
                    <span class="badge bg-primary me-2">${post.category}</span>
                    <span class="text-muted"><i class="far fa-calendar-alt me-1"></i> ${post.date}</span>
                </div>
                <h5 class="card-title">
                    <a href="${detailUrl}" class="text-dark text-decoration-none">${post.title}</a>
                </h5>
                <p class="card-text small flex-grow-1">${post.excerpt.substring(0, 100) + '...'}</p>
                <div class="mt-auto">
                    <a href="${detailUrl}" class="btn btn-outline-primary btn-sm w-100">Baca</a>
                </div>
            </div>
        </div>
    `;
    
    return postElement;
}

// Fungsi untuk menampilkan berita populer dan terbaru
async function displayFeaturedPosts() {
    const featuredContainer = document.getElementById('featured-popular-posts');
    const recentContainer = document.getElementById('articles-container');
    
    if (!featuredContainer || !recentContainer) return;

    featuredContainer.innerHTML = `
        <div class="col-12 text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Memuat...</span>
            </div>
            <p class="mt-2">Memuat berita populer...</p>
        </div>
    `;

    recentContainer.innerHTML = `
        <div class="col-12 text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Memuat...</span>
            </div>
            <p class="mt-2">Memuat berita terbaru...</p>
        </div>
    `;

    try {
        await fetchPosts();
        
        featuredContainer.innerHTML = '';
        recentContainer.innerHTML = '';
        
        if (apiPosts.length > 0) {
            // Hanya post pertama sebagai featured
            const featuredPost = apiPosts[0];
            featuredPost.isFeatured = true;
            const featuredElement = createFeaturedPostElement(featuredPost);
            featuredContainer.appendChild(featuredElement);
            
            // Sisanya sebagai berita terbaru
            const recentPosts = apiPosts.slice(1);
            recentPosts.forEach(post => {
                const recentElement = createRecentPostElement(post);
                recentContainer.appendChild(recentElement);
            });
        } else {
            throw new Error('Tidak ada data berita');
        }
    } catch (error) {
        console.error('Error:', error);
        featuredContainer.innerHTML = `
            <div class="col-12 text-center my-5">
                <div class="alert alert-danger">
                    Gagal memuat berita populer. Silakan coba lagi nanti.
                </div>
            </div>
        `;
        recentContainer.innerHTML = `
            <div class="col-12 text-center my-5">
                <div class="alert alert-danger">
                    Gagal memuat berita terbaru.
                </div>
            </div>
        `;
    }
}

// Fungsi untuk mengambil konten artikel
async function getArticleContent(articleId) {
    try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://solohitz.com/wp-json/wp/v2/posts/${articleId}?_embed`;
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data artikel');
        }
        const post = await response.json();
        return {
            featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/image/default-news.jpg',
            content: post.content.rendered
        };
    } catch (error) {
        console.error('Error fetching article:', error);
        return {
            content: '<p>Gagal memuat konten artikel. Silakan coba lagi nanti.</p>'
        };
    }
}

// Fungsi untuk menangani modal
function setupNewsModal() {
    const modal = document.getElementById('newsModal');
    if (!modal) return;

    modal.addEventListener('show.bs.modal', async function(event) {
        const button = event.relatedTarget;
        const postData = JSON.parse(button.getAttribute('data-post'));
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Memuat...</span>
                </div>
                <p class="mt-2">Memuat berita...</p>
            </div>
        `;

        try {
            const articleData = await getArticleContent(postData.id);
            
            modalBody.innerHTML = `
                <div class="article-header">
                    <h1 class="article-title">${postData.title}</h1>
                    <div class="article-meta">
                        <span class="article-date">
                            <i class="far fa-calendar-alt"></i> ${postData.date}
                        </span>
                        <span class="article-category">
                            <i class="fas fa-tag"></i>
                            <span class="badge bg-primary">${postData.category}</span>
                        </span>
                    </div>
                </div>
                <div class="article-featured-image">
                    <img src="${articleData.featuredImage}" alt="${postData.title}" class="img-fluid rounded">
                </div>
                <div class="article-content">
                    ${articleData.content}
                </div>
                <div class="mt-4 pt-3 border-top text-end">
                    <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i> Tutup
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error:', error);
            modalBody.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Gagal memuat konten berita. Silakan coba lagi nanti.
                </div>
            `;
        }
    });
}

// Fungsi untuk menampilkan berita populer di sidebar (jika diperlukan di tempat lain)
function displaySidebarPopularPosts() {
    const container = document.getElementById('popular-posts');
    if (!container) return;
    
    container.innerHTML = '';
    
    const latestPosts = [...apiPosts]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    latestPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item d-flex mb-3';
        
        postElement.innerHTML = `
            <div class="post-image me-3">
                <img src="${post.image}" alt="${post.title}" class="img-fluid" style="width: 80px; height: 60px; object-fit: contain;">
            </div>
            <div class="post-content">
                <h4 class="h6 mb-1"><a href="${post.url}" target="_blank">${post.title}</a></h4>
                <span class="post-date small text-muted"><i class="far fa-calendar-alt me-1"></i> ${post.date}</span>
            </div>
        `;
        
        container.appendChild(postElement);
    });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', async function() {
    await displayFeaturedPosts();
    displaySidebarPopularPosts();
    setupNewsModal();
});