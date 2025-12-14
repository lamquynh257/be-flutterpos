const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../config/database');

// Import from tableController since sessions are managed there
const tableController = require('../controllers/tableController');

router.use(authMiddleware);

// Get completed sessions for reporting
router.get('/completed', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const where = {
            endTime: {
                not: null,
            },
        };

        // Add date filter if provided
        if (startDate || endDate) {
            where.endTime = {
                not: null,
            };
            if (startDate) {
                where.endTime.gte = new Date(startDate);
            }
            if (endDate) {
                // Include the entire end date (set to end of day)
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                where.endTime.lte = endDateTime;
            }
        }

        const sessions = await prisma.tableSession.findMany({
            where,
            include: {
                table: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orders: {
                    where: {
                        status: 'COMPLETED',
                    },
                    include: {
                        items: {
                            include: {
                                dish: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                endTime: 'desc',
            },
        });

        res.json(sessions);
    } catch (error) {
        console.error('Get completed sessions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
