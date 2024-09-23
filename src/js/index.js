import { createApi } from 'unsplash-js';

// Initialize Unsplash API
const unsplash = createApi({
    accessKey: 'fGu1lgAmLBhRgtCTDzG9SEgdUxAyVro1rRrDUWVakgc'
});

// Function to fetch photos based on a query (art category)
const fetchPhotos = async (query, photoCount = 4) => {
    const result = await unsplash.search.getPhotos({
        query: query,
        page: 1,
        perPage: photoCount,  // Fetch the number of photos based on photoCount
        orientation: 'portrait'
    });
    return result;
};

// Function to detect which page is being viewed
const getPageType = () => {
    const path = window.location.pathname;
    
    if (path.includes('Mordern-art.html')) return { artType: 'Modern Art', containerId: 'modern-art-images', photoCount: 20 };
    if (path.includes('classic.html')) return { artType: 'Classic Art', containerId: 'classic-art-images', photoCount: 20 };
    if (path.includes('sculptures.html')) return { artType: 'Sculpture Art', containerId: 'sculpture-art-images', photoCount: 20 };
    if (path.includes('cubisum.html')) return { artType: 'Cubism', containerId: 'cubism-art-images', photoCount: 20 };
    if (path.includes('abstract.html')) return { artType: 'Abstract Art', containerId: 'abstract-art-images', photoCount: 20 };
    
    // Default to homepage
    return { artType: null, containerId: null, photoCount: 4 };
};

// Function to display photos under the correct headings
const displayPhotos = async () => {
    const artTypes = [
        { name: 'Modern Art', id: 'modern-art-images', link: './Mordern-art.html' },
        { name: 'Classic Art', id: 'classic-art-images', link: './classic.html' },
        { name: 'Sculpture Art', id: 'sculpture-art-images', link: './sculptures.html' },
        { name: 'Cubism', id: 'cubism-art-images', link: './cubisum.html' },
        { name: 'Abstract Art', id: 'abstract-art-images', link: './abstract.html' }
    ];

    const { artType, containerId, photoCount } = getPageType();

    if (artType) {
        // Dedicated page (fetch 20 photos for a specific art category)
        try {
            const result = await fetchPhotos(artType, photoCount);
            const photos = result.response.results;

            const imageContainer = document.getElementById(containerId);

            photos.forEach((photo) => {
                const img = document.createElement('img');
                img.src = photo.urls.small;
                img.alt = `${artType} Image`;

                imageContainer.appendChild(img);
            });
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    } else {
        // Homepage (fetch 4 photos for each category)
        try {
            for (const artType of artTypes) {
                const result = await fetchPhotos(artType.name, 4);
                const photos = result.response.results;

                const imageContainer = document.getElementById(artType.id);

                photos.forEach((photo) => {
                    const img = document.createElement('img');
                    img.src = photo.urls.small;
                    img.alt = `${artType.name} Image`;

                    // Add click event to redirect to the respective page
                    img.addEventListener('click', () => {
                        window.location.href = artType.link;
                    });

                    imageContainer.appendChild(img);
                });
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    }
};

// Call the function to display photos
displayPhotos();
