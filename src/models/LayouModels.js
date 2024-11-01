const mongoose = require('mongoose');

// Layout for About 1
const LayoutAbout1 = mongoose.Schema({
    images: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    buttons: {
        type: [{ btnText: String, btnLink: String }],
        required: true,
    },
    bg_color: {
        type: String,
    },
    layout_about: {
        type: String,
        default: "lemarc1"
    }
});

// Layout for About 2


const LayoutAbout2 = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    bg_color: {
        type: String,
    },
    buttons: {
        type: [{ btnText: String, btnLink: String }],
        required: false,
    },
    layout_about: {
        type: String,
        default: "lemarc2"
    }
});

// Layout for About 3
const LayoutAbout3 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,4
    },
    buttons: {
        type: [{ btnText: String, btnLink: String }],
    },
    bg_color: {
        type: String,
    },
    footerText: {
        type: String,
    },
    layout_about: {
        type: String,
        default: "lemarc3"
    }
});

// Layout for About 4
const LayoutAbout4 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: false,
    },
    bg_color: {
        type: String,
    },
    links: {
        type: [{ text: String, link: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc4"
    }
});

// Layout for About 5
const LayoutAbout5 = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    bg_color: {
        type: String,
    },
    images: {
        type: Array,
        required: true,
    },
    contactInfo: {
        type: { email: String, phone: String },
    },
    layout_about: {
        type: String,
        default: "lemarc5"
    }
});

// Layout for About 6
const LayoutAbout6 = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    bg_color: {
        type: String,
    },
    awards: {
        type: [{ year: Number, title: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc6"
    }
});

// Layout for About 7
const LayoutAbout7 = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    bg_color: {
        type: String,
    },
    teamMembers: {
        type: [{ name: String, position: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc7"
    }
});

// Layout for About 8
const LayoutAbout8 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
    },
    bg_color: {
        type: String,
    },
    socialLinks: {
        type: [{ platform: String, url: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc8"
    }
});

// Layout for About 9
const LayoutAbout9 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bg_color: {
        type: String,
    },
    gallery: {
        type: [{ imageUrl: String, caption: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc9"
    }
});

// Layout for About 10
const LayoutAbout10 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    bg_color: {
        type: String,
    },
    milestones: {
        type: [{ year: Number, event: String }],
    },
    layout_about: {
        type: String,
        default: "lemarc10"
    }
});



// Layout for Contact 1

const LayouContact1 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: { email: String, phone: String },
    },
    map: {
        type: String,
    },
    layout_contact: {
        type: String,
        default: "lemarc1"
    }
})


const LayouContact2 = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: { email: String, phone: String },
    },
    map: {
        type: String,
    },
    formFields: {
        type: [{ fieldName: String, fieldType: String }],
    },
    layout_contact: {
        type: String,
        default: "lemarc2"
    }
})


module.exports = mongoose.model('LayoutAbout1',LayoutAbout1 )
module.exports = mongoose.model('LayoutAbout2',LayoutAbout2 )
module.exports = mongoose.model('LayoutAbout3',LayoutAbout3 )
module.exports = mongoose.model('LayoutAbout4',LayoutAbout4 )
module.exports = mongoose.model('LayoutAbout5',LayoutAbout5 )
module.exports = mongoose.model('LayoutAbout6',LayoutAbout6 )
module.exports = mongoose.model('LayoutAbout7',LayoutAbout7 )
module.exports = mongoose.model('LayoutAbout8',LayoutAbout8 )
module.exports = mongoose.model('LayoutAbout9',LayoutAbout9 )
module.exports = mongoose.model('LayoutAbout10',LayoutAbout10)
