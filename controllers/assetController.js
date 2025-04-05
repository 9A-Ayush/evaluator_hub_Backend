const Asset = require('../models/assetModel');

const assetController = {
    getAllAssets: async (req, res) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const { type } = req.query;
            let query = { createdBy: req.user._id }; // Filter by current user
            
            if (type && type !== 'all') {
                query.type = type;
            }

            const assets = await Asset.find(query)
                .sort({ createdAt: -1 });
                
            res.status(200).json({
                success: true,
                assets
            });
        } catch (error) {
            console.error('Error in getAllAssets:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching assets'
            });
        }
    },

    getAssetById: async (req, res) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const asset = await Asset.findOne({
                _id: req.params.id,
                createdBy: req.user._id // Only return if owned by current user
            });

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: 'Asset not found or access denied'
                });
            }

            res.status(200).json({
                success: true,
                asset
            });
        } catch (error) {
            console.error('Error in getAssetById:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching asset'
            });
        }
    },

    createAsset: async (req, res) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Validate required fields
            const {
                title, type, description,
                value, condition, ownerName, ownerPhone,
                location
            } = req.body;

            if (!title || !type || !description ||
                !value || !condition || !ownerName || !ownerPhone ||
                !location) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Create asset with current user as creator
            const asset = new Asset({
                ...req.body,
                createdBy: req.user._id
            });

            await asset.save();

            res.status(201).json({
                success: true,
                message: 'Asset created successfully',
                asset
            });
        } catch (error) {
            console.error('Error in createAsset:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error creating asset'
            });
        }
    },

    updateAsset: async (req, res) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Find asset and verify ownership
            const asset = await Asset.findOne({
                _id: req.params.id,
                createdBy: req.user._id // Only allow update if owned by current user
            });

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: 'Asset not found or access denied'
                });
            }

            // Update asset
            Object.assign(asset, req.body);
            await asset.save();

            res.status(200).json({
                success: true,
                message: 'Asset updated successfully',
                asset
            });
        } catch (error) {
            console.error('Error in updateAsset:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error updating asset'
            });
        }
    },

    deleteAsset: async (req, res) => {
        try {
            // Ensure user is authenticated
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const asset = await Asset.findOneAndDelete({
                _id: req.params.id,
                createdBy: req.user._id // Only allow deletion if owned by current user
            });

            if (!asset) {
                return res.status(404).json({
                    success: false,
                    message: 'Asset not found or access denied'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Asset deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteAsset:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error deleting asset'
            });
        }
    }
};

module.exports = assetController;
