const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfficeSchema = new Schema({
    Monday:{
        1:  Boolean, 2: Boolean,  3: Boolean,  4: Boolean,
        5:  Boolean, 6: Boolean,  7: Boolean,  8: Boolean,
        9:  Boolean,10: Boolean, 11: Boolean, 12: Boolean,
        13: Boolean,14: Boolean, 15: Boolean, 16: Boolean,
        17: Boolean,18: Boolean, 19: Boolean, 20: Boolean,
        21: Boolean,22: Boolean, 23: Boolean, 24: Boolean,
        25: Boolean,26: Boolean, 27: Boolean, 28: Boolean,
        29: Boolean,30: Boolean, 31: Boolean, 32: Boolean, 
    },
    Tuesday:{
        1:  Boolean, 2: Boolean,  3: Boolean,  4: Boolean,
        5:  Boolean, 6: Boolean,  7: Boolean,  8: Boolean,
        9:  Boolean,10: Boolean, 11: Boolean, 12: Boolean,
        13: Boolean,14: Boolean, 15: Boolean, 16: Boolean,
        17: Boolean,18: Boolean, 19: Boolean, 20: Boolean,
        21: Boolean,22: Boolean, 23: Boolean, 24: Boolean,
        25: Boolean,26: Boolean, 27: Boolean, 28: Boolean,
        29: Boolean,30: Boolean, 31: Boolean, 32: Boolean
        
    },
    Wednesday:{
        1:  Boolean, 2: Boolean,  3: Boolean,  4: Boolean,
        5:  Boolean, 6: Boolean,  7: Boolean,  8: Boolean,
        9:  Boolean,10: Boolean, 11: Boolean, 12: Boolean,
        13: Boolean,14: Boolean, 15: Boolean, 16: Boolean,
        17: Boolean,18: Boolean, 19: Boolean, 20: Boolean,
        21: Boolean,22: Boolean, 23: Boolean, 24: Boolean,
        25: Boolean,26: Boolean, 27: Boolean, 28: Boolean,
        29: Boolean,30: Boolean, 31: Boolean, 32: Boolean
        
    },
    Thursday:{
        1:  Boolean, 2: Boolean,  3: Boolean,  4: Boolean,
        5:  Boolean, 6: Boolean,  7: Boolean,  8: Boolean,
        9:  Boolean,10: Boolean, 11: Boolean, 12: Boolean,
        13: Boolean,14: Boolean, 15: Boolean, 16: Boolean,
        17: Boolean,18: Boolean, 19: Boolean, 20: Boolean,
        21: Boolean,22: Boolean, 23: Boolean, 24: Boolean,
        25: Boolean,26: Boolean, 27: Boolean, 28: Boolean,
        29: Boolean,30: Boolean, 31: Boolean, 32: Boolean
        
    },
    Friday:{
        1:  Boolean, 2: Boolean,  3: Boolean,  4: Boolean,
        5:  Boolean, 6: Boolean,  7: Boolean,  8: Boolean,
        9:  Boolean,10: Boolean, 11: Boolean, 12: Boolean,
        13: Boolean,14: Boolean, 15: Boolean, 16: Boolean,
        17: Boolean,18: Boolean, 19: Boolean, 20: Boolean,
        21: Boolean,22: Boolean, 23: Boolean, 24: Boolean,
        25: Boolean,26: Boolean, 27: Boolean, 28: Boolean,
        29: Boolean,30: Boolean, 31: Boolean, 32: Boolean
        
    }
})



module.exports = mongoose.model('eastOffice', OfficeSchema);