// js/reviews-manager.js
class ReviewsManager {
    constructor() {
        this.storageKey = 'product_reviews';
    }
    
    addReview(productId, review) {
        const reviews = this.getReviews(productId);
        const newReview = {
            id: Date.now(),
            rating: review.rating,
            comment: review.comment,
            author: review.author,
            date: new Date().toISOString(),
            verified: false
        };
        
        reviews.push(newReview);
        this.saveReviews(productId, reviews);
        return newReview;
    }
    
    getReviews(productId) {
        const allReviews = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        return allReviews[productId] || [];
    }

    saveReviews(productId, reviews) {
        const allReviews = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        allReviews[productId] = reviews;
        localStorage.setItem(this.storageKey, JSON.stringify(allReviews));
    }
    
    getAverageRating(productId) {
        const reviews = this.getReviews(productId);
        if (reviews.length === 0) return 0;
        
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }
    
    renderReviews(productId, container) {
        const reviews = this.getReviews(productId);
        const averageRating = this.getAverageRating(productId);
        
        container.innerHTML = `
            <div class="reviews-summary mb-6">
                <div class="flex items-center mb-2">
                    <div class="stars mr-2">
                        ${this.renderStars(averageRating)}
                    </div>
                    <span class="text-lg font-semibold">${averageRating}</span>
                    <span class="text-gray-500 ml-2">(${reviews.length} avaliações)</span>
                </div>
            </div>
            
            <div class="reviews-list">
                ${reviews.map(review => this.renderReview(review)).join('')}
            </div>
            
            <button onclick="openReviewModal(${productId})" class="btn btn-primary mt-4">
                Avaliar Produto
            </button>
        `;
    }

    renderReview(review) {
        return `
            <div class="review-item border-b pb-4 mb-4">
                <p class="font-semibold">${review.author} - ${new Date(review.date).toLocaleDateString()}</p>
                <div class="stars">${this.renderStars(review.rating)}</div>
                <p>${review.comment}</p>
            </div>
        `;
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return `
            ${'<i class="fas fa-star text-yellow-400"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt text-yellow-400"></i>' : ''}
            ${'<i class="far fa-star text-gray-300"></i>'.repeat(emptyStars)}
        `;
    }
}