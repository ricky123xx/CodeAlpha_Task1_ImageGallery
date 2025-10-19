// Get elements
const filterBtns = document.querySelectorAll('.filter-btn');
const imageFilterBtns = document.querySelectorAll('.image-filter-btn');
let galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageUpload = document.getElementById('image-upload');
const categorySelect = document.getElementById('category-select');
const gallery = document.querySelector('.gallery');

// Current image index for lightbox navigation
let currentIndex = 0;
let filteredItems = Array.from(galleryItems);
let currentImageFilter = 'none';

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter items
        filteredItems = Array.from(galleryItems).filter(item => {
            return filter === 'all' || item.dataset.category === filter;
        });

        // Show/hide items
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('show');
    });
});

// Close lightbox
closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('show');
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('show');
    }
});

// Navigate to previous image
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    const imgSrc = filteredItems[currentIndex].querySelector('img').src;
    lightboxImg.src = imgSrc;
});

// Navigate to next image
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % filteredItems.length;
    const imgSrc = filteredItems[currentIndex].querySelector('img').src;
    lightboxImg.src = imgSrc;
});

// Image filter functionality
imageFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all image filter buttons
        imageFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        currentImageFilter = btn.dataset.imageFilter;

        // Apply filter to all gallery images
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            img.style.filter = currentImageFilter;
        });
    });
});

// Image upload functionality
imageUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    const category = categorySelect.value;

    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgSrc = event.target.result;
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.dataset.category = category;
                galleryItem.innerHTML = `<img src="${imgSrc}" alt="Uploaded Image">`;
                gallery.appendChild(galleryItem);

                // Update galleryItems and add event listener
                galleryItems = document.querySelectorAll('.gallery-item');
                galleryItem.addEventListener('click', () => {
                    currentIndex = Array.from(galleryItems).indexOf(galleryItem);
                    lightboxImg.src = imgSrc;
                    lightbox.classList.add('show');
                });

                // Apply current filter to new image
                const img = galleryItem.querySelector('img');
                img.style.filter = currentImageFilter;
            };
            reader.readAsDataURL(file);
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'Escape') {
            closeBtn.click();
        }
    }
});
