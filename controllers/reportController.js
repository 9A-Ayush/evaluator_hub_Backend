const PDFDocument = require('pdfkit');
const Report = require('../models/reportModel');
const Evaluation = require('../models/evaluationModel');

const reportController = {
    // Get all reports
    getAllReports: async (req, res) => {
        try {
            const reports = await Report.find({ createdBy: req.user._id })
                .populate('evaluation')
                .populate('createdBy', 'name email')
                .sort('-createdAt');

            res.status(200).json({
                success: true,
                reports
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching reports'
            });
        }
    },

    // Get single report
    getReportById: async (req, res) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                createdBy: req.user._id
            })
            .populate('evaluation')
            .populate('createdBy', 'name email');
            
            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found or access denied'
                });
            }
            
            res.status(200).json({
                success: true,
                report
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching report'
            });
        }
    },

    // Create new report
    createReport: async (req, res) => {
        try {
            const { title, type, content, evaluation, findings, recommendations } = req.body;

            // Validate required fields
            if (!title || !type || !content || !findings || !recommendations) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Validate evaluation if report type is evaluation
            if (type === 'evaluation' && !evaluation) {
                return res.status(400).json({
                    success: false,
                    message: 'Evaluation is required for evaluation reports'
                });
            }

            // Verify evaluation exists and belongs to user if type is evaluation
            if (type === 'evaluation') {
                const evaluationExists = await Evaluation.findOne({
                    _id: evaluation,
                    evaluator: req.user._id
                });

                if (!evaluationExists) {
                    return res.status(404).json({
                        success: false,
                        message: 'Evaluation not found or access denied'
                    });
                }
            }

            // Create report
            const report = new Report({
                title,
                type,
                content,
                evaluation: type === 'evaluation' ? evaluation : undefined,
                findings,
                recommendations,
                createdBy: req.user._id,
                status: 'draft',
                metadata: {
                    lastModified: new Date(),
                    version: 1
                }
            });

            await report.save();
            await report.populate([
                { path: 'evaluation' },
                { path: 'createdBy', select: 'name email' }
            ]);

            res.status(201).json({
                success: true,
                message: 'Report created successfully',
                report
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error creating report'
            });
        }
    },

    // Update report
    updateReport: async (req, res) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                createdBy: req.user._id
            });

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found or access denied'
                });
            }

            // Don't allow updating if report is approved
            if (report.status === 'approved') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update an approved report'
                });
            }

            // Update allowed fields
            const allowedUpdates = [
                'title', 'content', 'findings', 'recommendations',
                'status', 'evaluation'
            ];

            Object.keys(req.body).forEach(update => {
                if (allowedUpdates.includes(update)) {
                    report[update] = req.body[update];
                }
            });

            // Update metadata
            report.metadata = {
                lastModified: new Date(),
                version: (report.metadata?.version || 1) + 1
            };

            await report.save();
            await report.populate([
                { path: 'evaluation' },
                { path: 'createdBy', select: 'name email' }
            ]);

            res.status(200).json({
                success: true,
                message: 'Report updated successfully',
                report
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Error updating report'
            });
        }
    },

    // Delete report
    deleteReport: async (req, res) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                createdBy: req.user._id
            });

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found or access denied'
                });
            }

            // Don't allow deleting if report is approved
            if (report.status === 'approved') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete an approved report'
                });
            }

            await report.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Report deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting report'
            });
        }
    },

    // Get reports by type
    getReportsByType: async (req, res) => {
        try {
            const { type } = req.params;
            const reports = await Report.find({
                type,
                createdBy: req.user._id
            })
            .populate('evaluation')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

            res.status(200).json({
                success: true,
                reports
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching reports'
            });
        }
    },

    // Download report as PDF
    downloadReport: async (req, res) => {
        try {
            const report = await Report.findOne({
                _id: req.params.id,
                createdBy: req.user._id
            })
            .populate('evaluation')
            .populate('createdBy', 'name email');

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: 'Report not found or access denied'
                });
            }

            // Create PDF document
            const doc = new PDFDocument({
                margin: 50,
                size: 'A4'
            });

            const filename = `report-${report._id}.pdf`;

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            // Pipe PDF to response
            doc.pipe(res);

            // Add content to PDF
            doc.fontSize(24)
               .text(report.title, { align: 'center' })
               .moveDown();

            doc.fontSize(12)
               .text(`Report Type: ${report.type}`)
               .text(`Created by: ${report.createdBy.name}`)
               .text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`)
               .text(`Status: ${report.status}`)
               .moveDown();

            doc.fontSize(16)
               .text('Content', { underline: true })
               .moveDown();
            doc.fontSize(12)
               .text(report.content)
               .moveDown();

            doc.fontSize(16)
               .text('Findings', { underline: true })
               .moveDown();
            doc.fontSize(12)
               .text(report.findings)
               .moveDown();

            doc.fontSize(16)
               .text('Recommendations', { underline: true })
               .moveDown();
            doc.fontSize(12)
               .text(report.recommendations)
               .moveDown();

            // Add evaluation details if it exists
            if (report.evaluation) {
                doc.fontSize(16)
                   .text('Evaluation Details', { underline: true })
                   .moveDown();
                doc.fontSize(12)
                   .text(`Evaluation ID: ${report.evaluation._id}`);
                // Add more evaluation details as needed
            }

            // Add footer
            doc.moveDown(2)
               .fontSize(10)
               .text('Generated by Evaluator\'s Hub', { align: 'center' })
               .text(new Date().toLocaleString(), { align: 'center' });

            // Finalize PDF
            doc.end();
        } catch (error) {
            console.error('PDF Generation Error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error generating PDF report'
            });
        }
    }
};

module.exports = reportController;
