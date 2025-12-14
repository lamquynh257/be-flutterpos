const prisma = require('../config/database');

// Clear all data except users, floors, tables, categories, and dishes
exports.clearData = async (req, res) => {
    try {
        // Use transaction to ensure all deletions succeed or none
        const result = await prisma.$transaction(async (tx) => {
            // Delete in correct order to respect foreign key constraints
            // 1. Delete payments first (references orders and tableSessions)
            const deletedPayments = await tx.payment.deleteMany({});
            
            // 2. Delete order items (references orders and dishes)
            const deletedOrderItems = await tx.orderItem.deleteMany({});
            
            // 3. Delete orders (references tableSessions and tables)
            const deletedOrders = await tx.order.deleteMany({});
            
            // 4. Delete table sessions (references tables)
            const deletedSessions = await tx.tableSession.deleteMany({});
            
            // 5. Reset all table statuses to EMPTY
            const updatedTables = await tx.table.updateMany({
                data: { status: 'EMPTY' }
            });

            return {
                payments: deletedPayments.count,
                orderItems: deletedOrderItems.count,
                orders: deletedOrders.count,
                tableSessions: deletedSessions.count,
                tablesReset: updatedTables.count
            };
        });

        res.json({ 
            message: 'All data cleared successfully',
            deleted: result,
            kept: {
                users: 'all',
                floors: 'all',
                tables: 'all',
                categories: 'all',
                dishes: 'all'
            }
        });
    } catch (error) {
        console.error('Clear data error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

