const mongoose=require("mongoose")
const bcrypt = require('bcryptjs')
mongoose.connect("mongodb://0.0.0.0:27017/Mydatabase")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log('failed');
})


const { Schema } = mongoose;

// Define schema for the "role" collection
const roleSchema = new Schema({
    role: {
        type: String,
        required: true
    }
});


const organisationSchema = new Schema({
    organizationName: {
        type: String,
        required: [true, 'Organization name is required']
        // minlength: [2, 'Organization name must be at least 2 characters long']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
        // minlength: [5, 'Address must be at least 5 characters long']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
        // validate: {
        //     validator: function(value) {
        //         return value <= this.endDate; // Ensure start date is before end date
        //     },
        //     message: 'Start date must be before end date'
        // }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
        // validate: {
        //     validator: function(value) {
        //         return value >= this.startDate; // Ensure end date is after start date
        //     },
        //     message: 'End date must be after start date'
        // }
    },
    status: {
        type: String,
        required: [true, 'Status is required']
        // enum: ['active', 'inactive'] // Define acceptable status values
    },
    deleted: {
        type: Number,
        default: 0 // Set default value to 0
    }
});
//Define schema for the "user" collection
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters long']
    },
    contactno: {
        type: Number,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v); // Validate that contact number is 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit contact number!`
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensure email is unique
        match: [/\S+@\S+\.\S+/, 'Email is not valid'] // Basic email format validation
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'Role ID is required']
    },
    organisationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        required: [true, 'Organisation ID is required']
    },
    deleted: {
        type: Number,
        default: 0 // Set default value to 0
    }
});

// const userSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     contactno: {
//         type: Number,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     roleId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Role',
//         required: true
//     },
//     organisationId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Organisation',
//         required: true
//     },
//     deleted: {
//         type: Number,
//         default: 0 // Set default value to 0
//     }
// });

const TemplateSchema = new Schema({
    tname: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    organisationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },
    attachments: {
        type: [[String]], // Array of arrays of strings
        required: true
      }
});

const TransEmailSchema = new Schema({
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    cc: {
        type: String,
        required: true
    },
    bcc: {
        type: String,
        required: true
    },
    attachments: {
        type: String,
        required: true
    },
    organisationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        required: true
    },
    templateId: {
        type: Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    }
});

const EmaillistSchema = new Schema({
    
    recipient_email: {
        type: String,
        required: true
    },
    status: {
        type: String
        
    },
    message: {
        type: String
    
    },
    date:{
        type:Date
    },

    time:{
        type:"string"
    },
    transEmailID: {
        type: Schema.Types.ObjectId,
        ref: 'TransEmail',
        required: true
    }
});


const EmaillogsSchema = new Schema({
    sourceip: {
        type: Number,
        required: true
    },
    from:{
        type:String,
        required:true
    },
    recipient_email: {
        type: String,
        required: true
    },
    Date:{
     type:Date,
     required:true
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

// userSchema.pre('save',async function(next){
//     if(this.isModified('password')){
//         this.password = bcrypt.hash(this.password,12);
//     }
//     next();
// });


// Define models for the collections
const Role = mongoose.model('Role', roleSchema);
const Organisation = mongoose.model('Organisation', organisationSchema);
const User = mongoose.model('User', userSchema);
const Template = mongoose.model('Template', TemplateSchema);
const TransEmail = mongoose.model('TransEmail', TransEmailSchema);
const Emaillist = mongoose.model('Emaillist', EmaillistSchema);
const Emaillogs = mongoose.model('Emaillogs', EmaillogsSchema);



module.exports = { Role, Organisation, User, Template,TransEmail,Emaillist,Emaillogs };


