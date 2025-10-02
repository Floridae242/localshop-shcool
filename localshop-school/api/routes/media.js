// Media Routes
const express = require('express');
const router = express.Router();
const { query } = require('../middleware/database');
const { requireAdmin } = require('../middleware/auth');

// Get all media items
router.get('/', async (req, res) => {
  try {
    const media = await query('SELECT * FROM media ORDER BY id DESC');
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
});

// Get single media item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const media = await query('SELECT * FROM media WHERE id = ?', [id]);
    
    if (media.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    res.json(media[0]);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
});

// Create media item (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, url, caption } = req.body;
    const result = await query(
      'INSERT INTO media (title, url, caption) VALUES (?, ?, ?)',
      [title, url, caption]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating media:', error);
    res.status(500).json({ message: 'Error creating media' });
  }
});

// Update media item (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, caption } = req.body;
    
    await query(
      'UPDATE media SET title=?, url=?, caption=? WHERE id=?',
      [title, url, caption, id]
    );
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ message: 'Error updating media' });
  }
});

// Delete media item (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM media WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Error deleting media' });
  }
});

module.exports = router;


