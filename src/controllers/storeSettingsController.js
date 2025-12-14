const prisma = require('../config/database');

// Get store settings (only one record should exist)
exports.get = async (req, res) => {
    try {
        // Get the first (and should be only) store settings record
        let settings = await prisma.storeSettings.findFirst();
        
        // If no settings exist, create default
        if (!settings) {
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: '',
                    storeAddress: null,
                    storePhone: null,
                },
            });
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Get store settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update store settings (upsert - create if not exists, update if exists)
exports.update = async (req, res) => {
    try {
        const { storeName, storeAddress, storePhone } = req.body;

        console.log('📝 Update store settings request:', { storeName, storeAddress, storePhone });

        // Allow empty storeName (user might want to clear it)
        const finalStoreName = storeName || '';

        // Check if settings exist
        const existing = await prisma.storeSettings.findFirst();
        
        let settings;
        if (existing) {
            console.log('📝 Updating existing settings (ID: ${existing.id})');
            // Update existing
            settings = await prisma.storeSettings.update({
                where: { id: existing.id },
                data: {
                    storeName: finalStoreName,
                    storeAddress: storeAddress || null,
                    storePhone: storePhone || null,
                },
            });
        } else {
            console.log('📝 Creating new settings');
            // Create new
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: finalStoreName,
                    storeAddress: storeAddress || null,
                    storePhone: storePhone || null,
                },
            });
        }

        console.log('✅ Store settings saved:', settings);
        res.json(settings);
    } catch (error) {
        console.error('❌ Update store settings error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

