const Evaluation = require('../models/evaluationModel');

const evaluationController = {
    getEvaluations: async (req, res) => {
        try {
            const evaluations = await Evaluation.find({ evaluator: req.user._id })
                .populate('evaluator', 'name email')
                .sort('-createdAt');
            
            res.status(200).json({
                success: true,
                evaluations
            });
        } catch (error) {
            console.error('Error fetching evaluations:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching evaluations'
            });
        }
    },

    getEvaluation: async (req, res) => {
        try {
            const evaluation = await Evaluation.findOne({
                _id: req.params.id,
                evaluator: req.user._id
            }).populate('evaluator', 'name email');

            if (!evaluation) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluation not found or access denied'
                });
            }

            res.status(200).json({
                success: true,
                evaluation
            });
        } catch (error) {
            console.error('Error fetching evaluation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching evaluation'
            });
        }
    },

    createEvaluation: async (req, res) => {
        try {
            console.log('Creating evaluation with data:', req.body);

            // Add evaluator to the request body
            const evaluationData = {
                ...req.body,
                evaluator: req.user._id,
                status: req.body.status || 'pending'
            };

            // Create new evaluation
            const evaluation = new Evaluation(evaluationData);
            await evaluation.save();

            // Populate evaluator details
            await evaluation.populate('evaluator', 'name email');

            console.log('Created evaluation:', evaluation);

            res.status(201).json({
                success: true,
                evaluation
            });
        } catch (error) {
            console.error('Error creating evaluation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating evaluation'
            });
        }
    },

    updateEvaluation: async (req, res) => {
        try {
            // Find evaluation and check ownership
            const evaluation = await Evaluation.findOne({
                _id: req.params.id,
                evaluator: req.user._id
            });

            if (!evaluation) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluation not found or access denied'
                });
            }

            // Update allowed fields
            const allowedUpdates = [
                'title', 'description', 'category', 'client',
                'status', 'details', 'totalScore'
            ];

            Object.keys(req.body).forEach(update => {
                if (allowedUpdates.includes(update)) {
                    evaluation[update] = req.body[update];
                }
            });

            await evaluation.save();
            await evaluation.populate('evaluator', 'name email');

            res.status(200).json({
                success: true,
                message: 'Evaluation updated successfully',
                evaluation
            });
        } catch (error) {
            console.error('Error updating evaluation:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Error updating evaluation'
            });
        }
    },

    deleteEvaluation: async (req, res) => {
        try {
            const evaluation = await Evaluation.findOneAndDelete({
                _id: req.params.id,
                evaluator: req.user._id
            });

            if (!evaluation) {
                return res.status(404).json({
                    success: false,
                    message: 'Evaluation not found or access denied'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Evaluation deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting evaluation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting evaluation'
            });
        }
    }
};

module.exports = evaluationController;
