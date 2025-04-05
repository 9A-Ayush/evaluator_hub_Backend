const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Asset routes
router.route('/')
    .get(assetController.getAllAssets)
    .post(assetController.createAsset);

router.route('/:id')
    .get(assetController.getAssetById)
    .put(assetController.updateAsset)
    .delete(assetController.deleteAsset);

module.exports = router;
