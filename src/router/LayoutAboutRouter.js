const express = require('express');
const LayoutAbout1 = require('../models/LayouModels');
const LayoutAbout2  = require('../models/LayouModels'); 
const LayoutAbout3  = require('../models/LayouModels'); 
const LayoutAbout4  = require('../models/LayouModels'); 
const LayoutAbout5  = require('../models/LayouModels'); 
const LayoutAbout6  = require('../models/LayouModels'); 
const LayoutAbout7  = require('../models/LayouModels'); 
const LayoutAbout8  = require('../models/LayouModels'); 
const LayoutAbout9  = require('../models/LayouModels'); 
const LayoutAbout10  = require('../models/LayouModels');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/layouts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 1 layout



router.get('/layou/about/1', async (req, res) => {
    try {
        const layouts = await LayoutAbout1.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});
router.get('/laoyu/about/1/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/1', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout1({ description, title, bg_color, buttons, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});
router.put('/update/layout/about/1/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.buttons = buttons || layout.buttons;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/update/laout/about/1/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout1.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout1.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});



// 2 layout
router.get('/layout/about/2', async (req, res) => {
    try {
        const layouts = await LayoutAbout2.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/2/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout2.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/2', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout2({ description, title, bg_color, buttons, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/2/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, buttons } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout2.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.buttons = buttons || layout.buttons;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/2/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout2.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout2.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

// 3 layout 

router.get('/layout/about/3', async (req, res) => {
    try {
        const layouts = await LayoutAbout3.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/3/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout3.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/3', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, buttons, footerText } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout3({ title, description, bg_color, buttons, footerText, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/3/:id', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, buttons, footerText } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout3.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.bg_color = bg_color || layout.bg_color;
        layout.buttons = buttons || layout.buttons;
        layout.footerText = footerText || layout.footerText;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/3/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout3.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout3.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});



// 4 layout 
router.get('/layout/about/4', async (req, res) => {
    try {
        const layouts = await LayoutAbout4.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/4/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout4.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/4', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, links } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout4({ title, description, bg_color, links, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/4/:id', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, links } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout4.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.bg_color = bg_color || layout.bg_color;
        layout.links = links || layout.links;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/4/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout4.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout4.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// 5 layout

router.get('/layout/about/5', async (req, res) => {
    try {
        const layouts = await LayoutAbout5.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/5/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout5.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/5', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, contactInfo } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout5({ description, title, bg_color, contactInfo, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/5/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, contactInfo } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout5.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.contactInfo = contactInfo || layout.contactInfo;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/5/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout5.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout5.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});



// 6 layout 

router.get('/layout/about/6/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout6.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/6', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, awards } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout6({ description, title, bg_color, awards, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/6/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, awards } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout6.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.awards = awards || layout.awards;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/6/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout6.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout6.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// 7 layout

router.get('/layout/about/7', async (req, res) => {
    try {
        const layouts = await LayoutAbout7.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/7/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout7.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/7', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, teamMembers } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout7({ description, title, bg_color, teamMembers, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/7/:id', upload.array('images', 5), async (req, res) => {
    const { description, title, bg_color, teamMembers } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout7.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.description = description || layout.description;
        layout.title = title || layout.title;
        layout.bg_color = bg_color || layout.bg_color;
        layout.teamMembers = teamMembers || layout.teamMembers;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/7/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout7.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout7.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// 8 layout 

router.get('/layout/about/8', async (req, res) => {
    try {
        const layouts = await LayoutAbout8.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/8/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout8.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/8', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, socialLinks } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout8({ title, description, bg_color, socialLinks, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/8/:id', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, socialLinks } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout8.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.bg_color = bg_color || layout.bg_color;
        layout.socialLinks = socialLinks || layout.socialLinks;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/8/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout8.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout8.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// 9 layout 

router.get('/layout/about/9', async (req, res) => {
    try {
        const layouts = await LayoutAbout9.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/9/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout9.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/9', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, gallery } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout9({ title, description, bg_color, gallery, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/9/:id', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, gallery } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout9.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.bg_color = bg_color || layout.bg_color;
        layout.gallery = gallery || layout.gallery;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/9/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout9.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout9.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});


// 10 layout 

router.get('/layout/about/10', async (req, res) => {
    try {
        const layouts = await LayoutAbout10.find();
        res.status(200).json({ data: layouts });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.get('/layout/about/10/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout10.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

router.post('/create/layout/about/10', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, milestones } = req.body;
    const images = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = new LayoutAbout10({ title, description, bg_color, milestones, images });
        await layout.save();
        res.status(201).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.put('/update/layout/about/10/:id', upload.array('images', 5), async (req, res) => {
    const { title, description, bg_color, milestones } = req.body;
    const newImages = req.files.map(file => `/uploads/layouts/${file.filename}`);

    try {
        const layout = await LayoutAbout10.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.title = title || layout.title;
        layout.description = description || layout.description;
        layout.bg_color = bg_color || layout.bg_color;
        layout.milestones = milestones || layout.milestones;

        if (newImages.length > 0) {
            layout.images.forEach(imagePath => {
                const fullImagePath = path.join(__dirname, '../', imagePath);
                if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
            });
            layout.images = newImages;
        }

        await layout.save();
        res.status(200).json({ data: layout });
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
});

router.delete('/delete/layout/about/10/:id', async (req, res) => {
    try {
        const layout = await LayoutAbout10.findById(req.params.id);
        if (!layout) return res.status(404).json({ data: 'Layout not found' });

        layout.images.forEach(imagePath => {
            const fullImagePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(fullImagePath)) fs.unlinkSync(fullImagePath);
        });

        await LayoutAbout10.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: 'Layout and associated images deleted successfully' });
    } catch (err) {
        res.status(500).json({ data: err.message });
    }
});

module.exports = router;
