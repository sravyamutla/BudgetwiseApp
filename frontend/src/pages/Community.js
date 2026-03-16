import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, User } from 'lucide-react';
import './Community.css';

const MOCK_POSTS = [
    {
        id: 1,
        author: 'Sarah Jenkins',
        role: 'Financial Advisor',
        avatar: 'SJ',
        time: '2 hours ago',
        title: '5 Ways to Combat Lifestyle Creep',
        content: 'As our income grows, so do our expenses. This is known as lifestyle creep. The best way to combat this is to "pay yourself first" by automatically directing a portion of any raise into your savings or investments before you even see it in your checking account. What are your strategies?',
        likes: 342,
        comments: [
            { id: 101, author: 'Mike T.', text: 'I started doing this last year and it changed my life. I don\'t even miss the extra money.' },
            { id: 102, author: 'Anna L.', text: 'Great advice! I also try to wait 48 hours before any non-essential purchase over $50.' }
        ],
        isLiked: false
    },
    {
        id: 2,
        author: 'David Chen',
        role: 'Top Contributor',
        avatar: 'DC',
        time: '5 hours ago',
        title: 'Just hit my $10k emergency fund goal!',
        content: 'It took me 18 months of strict budgeting using this app, cutting out daily coffee runs, and taking on a small side hustle, but I finally hit my $10,000 emergency fund goal today. Keep pushing everyone, the peace of mind is absolutely worth the sacrifice.',
        likes: 891,
        comments: [
            { id: 201, author: 'Elena R.', text: 'Congratulations!! That is a massive milestone. What\'s the next goal?' }
        ],
        isLiked: true
    },
    {
        id: 3,
        author: 'BudgetWise Team',
        role: 'Official',
        avatar: 'BW',
        time: '1 day ago',
        title: 'Market Update: Navigating high interest rates',
        content: 'With interest rates remaining high, now is an excellent time to ensure your emergency fund is sitting in a High-Yield Savings Account (HYSA) rather than a traditional checking account. Some banks are currently offering upwards of 4.5% APY.',
        likes: 523,
        comments: [],
        isLiked: false
    }
];

const Community = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [activeTab, setActiveTab] = useState('popular');
    const [newPostContent, setNewPostContent] = useState('');
    const [expandedPosts, setExpandedPosts] = useState({});
    const [commentInputs, setCommentInputs] = useState({});

    const toggleComments = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleCommentChange = (postId, text) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: text
        }));
    };

    const handleCommentSubmit = (postId, e) => {
        e.preventDefault();
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        setPosts(posts.map(post => {
            if (post.id === postId) {
                const newComment = {
                    id: Date.now(),
                    author: 'You',
                    text: text.trim()
                };
                return {
                    ...post,
                    comments: [...post.comments, newComment]
                };
            }
            return post;
        }));

        setCommentInputs(prev => ({
            ...prev,
            [postId]: ''
        }));
    };

    const handleShare = (post) => {
        const shareText = `${post.title} - Check it out on BudgetWise!`;
        navigator.clipboard.writeText(shareText)
            .then(() => alert('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link.'));
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    isLiked: !post.isLiked
                };
            }
            return post;
        }));
    };

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: 'You',
            role: 'Member',
            avatar: 'U',
            time: 'Just now',
            title: 'New Discussion',
            content: newPostContent,
            likes: 0,
            comments: [],
            isLiked: false
        };

        setPosts([newPost, ...posts]);
        setNewPostContent('');
    };

    return (
        <div className="community-container">
            <div className="community-header">
                <div>
                    <h1>Community Forum</h1>
                    <p>Share tips, ask questions, and celebrate your financial wins together.</p>
                </div>
                <button className="primary-btn">Join Discussion</button>
            </div>

            <div className="community-layout">
                <div className="main-feed">
                    {/* Create Post Card */}
                    <div className="create-post-card">
                        <div className="create-post-header">
                            <div className="avatar small">U</div>
                            <input
                                type="text"
                                placeholder="Share a financial tip or ask a question..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                        </div>
                        <div className="create-post-actions">
                            <button
                                className="post-btn"
                                onClick={handlePostSubmit}
                                disabled={!newPostContent.trim()}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    <div className="feed-filters">
                        <button
                            className={`filter-btn ${activeTab === 'popular' ? 'active' : ''}`}
                            onClick={() => setActiveTab('popular')}
                        >
                            Popular
                        </button>
                        <button
                            className={`filter-btn ${activeTab === 'recent' ? 'active' : ''}`}
                            onClick={() => setActiveTab('recent')}
                        >
                            Recent
                        </button>
                        <button
                            className={`filter-btn ${activeTab === 'following' ? 'active' : ''}`}
                            onClick={() => setActiveTab('following')}
                        >
                            Following
                        </button>
                    </div>

                    {/* Posts Feed */}
                    <div className="posts-list">
                        {posts.map(post => (
                            <div className="post-card" key={post.id}>
                                <div className="post-header">
                                    <div className="post-author-info">
                                        <div className={`avatar ${post.avatar === 'BW' ? 'official' : ''}`}>
                                            {post.avatar}
                                        </div>
                                        <div>
                                            <h4 className="author-name">{post.author}</h4>
                                            <div className="author-meta">
                                                <span className="author-role">{post.role}</span>
                                                <span className="dot">•</span>
                                                <span className="post-time">{post.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="icon-btn"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className="post-body">
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-text">{post.content}</p>
                                </div>

                                <div className="post-footer">
                                    <div className="post-actions">
                                        <button
                                            className={`action-btn ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => handleLike(post.id)}
                                        >
                                            <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                                            <span>{post.likes}</span>
                                        </button>
                                        <button
                                            className={`action-btn ${expandedPosts[post.id] ? 'active' : ''}`}
                                            onClick={() => toggleComments(post.id)}
                                        >
                                            <MessageSquare size={18} />
                                            <span>{post.comments.length}</span>
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleShare(post)}
                                        >
                                            <Share2 size={18} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Comments section preview */}
                                {expandedPosts[post.id] && (
                                    <div className="comments-section">
                                        {post.comments.length > 0 ? (
                                            post.comments.map(comment => (
                                                <div className="comment" key={comment.id}>
                                                    <div className="comment-avatar">{comment.author.charAt(0)}</div>
                                                    <div className="comment-content">
                                                        <span className="comment-author">{comment.author}</span>
                                                        <span className="comment-text">{comment.text}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-comments-text">No comments yet. Be the first to share your thoughts!</p>
                                        )}

                                        <form className="comment-input-form" onSubmit={(e) => handleCommentSubmit(post.id, e)}>
                                            <div className="avatar small">U</div>
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={commentInputs[post.id] || ''}
                                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="comment-submit-btn"
                                                disabled={!commentInputs[post.id]?.trim()}
                                            >
                                                Post
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="community-sidebar">
                    <div className="sidebar-card">
                        <h3>Trending Topics</h3>
                        <div className="trending-tags">
                            <span className="tag">#Investing101</span>
                            <span className="tag">#EmergencyFund</span>
                            <span className="tag">#DebtFreeJourney</span>
                            <span className="tag">#FrugalLiving</span>
                            <span className="tag">#StockMarket</span>
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <h3>Top Contributors</h3>
                        <div className="contributors-list">
                            <div className="contributor">
                                <div className="avatar small">DC</div>
                                <div className="contributor-info">
                                    <h4>David Chen</h4>
                                    <p>12k points</p>
                                </div>
                                <button className="follow-btn">Follow</button>
                            </div>
                            <div className="contributor">
                                <div className="avatar small">SJ</div>
                                <div className="contributor-info">
                                    <h4>Sarah Jenkins</h4>
                                    <p>8.5k points</p>
                                </div>
                                <button className="follow-btn">Follow</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
