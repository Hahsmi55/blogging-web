const axios = require('axios');

exports.getAllPosts = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/posts/all');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        await axios.delete(`http://localhost:3001/posts/delete/${postId}`);  
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};  

exports.getAllUsers = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/users/all');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await axios.delete(`http://localhost:3000/users/delete/${userId}`);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3003/comments/all');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};

exports.deleteCommentByAdmin = async (req, res) => {
    const commentId = req.params.id;
    try {
        await axios.delete(`http://localhost:3003/comments/delete/${commentId}`);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};

exports.createAdminUser = async (req, res) => {
    const { password, role, email, fname, lname } = req.body;
    try {
        const response = await axios.post('http://localhost:3000/users/create-admin', {
            password,
            role,
            email,
            fname,
            lname
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create admin user' });
    }
};  

exports.getAllTags = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3001/tags/all');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
};

exports.createTag = async (req, res) => {
    const { name } = req.body;
    try {
        const response = await axios.post('http://localhost:3001/tags/create', { name });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tag' });
    }
};

exports.deleteTag = async (req, res) => {
    const tagId = req.params.id;
    try {
        await axios.delete(`http://localhost:3001/tags/delete/${tagId}`);
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tag' });
    }
};

exports.updateTag = async (req, res) => {
    const tagId = req.params.id;
    const { name } = req.body;
    try {
        const response = await axios.put(`http://localhost:3001/tags/update/${tagId}`, { name });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tag' });
    }
};  