// Function to create a new comment element
function createCommentElement(text) {
    // Get user's profile picture and name from the left sidebar user info
    const userProfileImg = document.querySelector('.user-info img').src;
    const userName = document.querySelector('.user-info span').textContent || 'User';
    
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <img src="${userProfileImg}" alt="${userName}" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">${userName}</div>
            <div class="comment-text">${text}</div>
        </div>
        <div class="comment-actions">
            <span>Just now</span>
            <span>Like</span>
            <span>Reply</span>
        </div>
    `;
    
    // Add event listener for the like button
    const likeBtn = commentDiv.querySelector('.comment-actions span:first-child');
    if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.textContent = this.textContent === 'Like' ? 'Liked' : 'Like';
        });
    }
    
    return commentDiv;
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle post reactions using event delegation
    document.addEventListener('mouseover', function(e) {
        const likeBtn = e.target.closest('.like-btn');
        if (!likeBtn) return;
        
        const container = likeBtn.nextElementSibling;
        if (container && container.classList.contains('reaction-options')) {
            container.style.display = 'flex';
        }
    });
    
    // Hide reaction options when mouse leaves
    document.addEventListener('mouseout', function(e) {
        const container = e.target.closest('.reaction-options');
        if (container) {
            setTimeout(() => {
                if (!container.matches(':hover')) {
                    container.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Handle reaction selection
    document.addEventListener('click', function(e) {
        const icon = e.target.closest('.reaction-icon');
        if (!icon) return;
        
        e.stopPropagation();
        const container = icon.closest('.reaction-options');
        if (!container) return;
        
        const reaction = icon.getAttribute('data-reaction');
        const post = container.closest('.post');
        const likeBtn = post?.querySelector('.like-btn');
        
        if (likeBtn) {
            likeBtn.innerHTML = `<i class="fas ${getReactionIcon(reaction)}"></i> ${reaction.charAt(0).toUpperCase() + reaction.slice(1)}`;
            likeBtn.className = 'like-btn';
            likeBtn.classList.add(reaction);
            container.style.display = 'none';
            console.log(`Reacted with ${reaction} to post`);
        }
    });
    
    // Handle comment submission
    document.addEventListener('submit', function(e) {
        const form = e.target.closest('.comment-form');
        if (!form) return;
        
        e.preventDefault();
        const commentInput = form.querySelector('input[type="text"]');
        const commentText = commentInput?.value.trim();
        
        if (commentText) {
            const commentsContainer = form.previousElementSibling;
            if (commentsContainer && commentsContainer.classList.contains('comments-section')) {
                const newComment = createCommentElement(commentText);
                commentsContainer.insertBefore(newComment, commentsContainer.firstChild);
                commentInput.value = '';
                console.log('New comment:', commentText);
            }
        }
    });
    
        // Initialize comment forms
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="text"]');
            const commentText = input.value.trim();
            
            if (commentText) {
                const commentsSection = this.previousElementSibling;
                if (commentsSection && commentsSection.classList.contains('comments-section')) {
                    const newComment = createCommentElement(commentText);
                    commentsSection.insertBefore(newComment, commentsSection.firstChild);
                    input.value = '';
                }
            }
        });
    });
    
    // Toggle comment section
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.comment-btn');
        if (!btn) return;
        
        const post = btn.closest('.post');
        if (!post) return;
        
        const commentsSection = post.querySelector('.comments-section');
        const commentForm = post.querySelector('.comment-form');
        
        if (commentsSection && commentForm) {
            // Toggle visibility
            const isHidden = window.getComputedStyle(commentsSection).display === 'none';
            
            // Show/hide comments and form
            commentsSection.style.display = isHidden ? 'block' : 'none';
            commentForm.style.display = isHidden ? 'flex' : 'none';
            
            // Store the current state in the button for reference
            btn.dataset.commentsVisible = isHidden ? 'true' : 'false';
            
            // Focus the comment input when showing the form
            if (isHidden) {
                const input = commentForm.querySelector('input[type="text"]');
                if (input) input.focus();
            }
        }
    });
});

// Helper function to get reaction icon
function getReactionIcon(reaction) {
    const icons = {
        'like': 'fa-thumbs-up',
        'love': 'fa-heart',
        'haha': 'fa-laugh-squint',
        'wow': 'fa-surprise',
        'sad': 'fa-sad-tear',
        'angry': 'fa-angry'
    };
    return icons[reaction] || 'fa-thumbs-up';
}


