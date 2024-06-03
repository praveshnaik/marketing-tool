const express = require("express");
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const csvtojson = require('csvtojson');
const fs = require('fs');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const cors = require("cors");
const bodyParser = require('body-parser');
const { User, Organisation, Role ,Template,TransEmail } = require("./mongo"); // Import the User model
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm'
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

  // Endpoint for image uploads
  app.post('/upload-image', upload.array('image', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No files uploaded' });
    }
    console.log(req.file)
    const filePaths = req.files.map(file => file.path);
    

    // File paths can be stored in the database if required
    res.json({
        success: true,
        files: filePaths.map(path => ({ url: `http://localhost:3000/${path}` })),
        message: 'Files uploaded successfully',
        filePaths: filePaths
    });
});

app.post('/upload-csv', upload.single('file'), async (req, res) => {
    try {
        const csvFilePath = req.file.path;
        const jsonFilePath = path.join(__dirname, 'uploads', `${req.file.filename}.json`);

        const jsonArray = await csvtojson().fromFile(csvFilePath);

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));

        // Remove the CSV file after conversion
        fs.unlinkSync(csvFilePath);

        res.json({ data: jsonArray, filepath: jsonFilePath });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
});

// Route to send email
app.post('/send-email', async (req, res) => {
    const { sender, recipient, cc, bcc, attachments,organisationId,templateId } = req.body;
    try {
        const newEmail = new TransEmail({ sender, recipient, cc, bcc, attachments,organisationId,templateId });
        await newEmail.save();
        res.json({ message: 'Email data saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving email data' });
    }
});




   // Endpoint for saving the template
app.post('/templates', async (req, res) => {
    console.log(req.body)
    try {
        const { formData, orgid } = req.body;
        const newTemplate = new Template({
            tname: formData.tname,
            status: formData.status,
            content: formData.content,
            organisationId: orgid,
            attachments: formData.attachments
        });
        await newTemplate.save();
        res.status(200).send({ message: 'Template saved successfully' });
    }
     catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error saving template' });
    }
});
app.put('/templates/:id', async (req, res) => {
    try {
      const updatedTemplate = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTemplate) {
        return res.status(404).send('Template not found');
      }
      res.json(updatedTemplate);
    } catch (err) {
      res.status(400).send('Bad request');
    }
  });
  
app.get('/templates', async (req, res) => {
    try {
      const templates = await Template.find();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.get('/templates/:id', async (req, res) => {
    try {
      const template = await Template.findById(req.params.id);
      if (!template) {
        return res.status(404).send('Template not found');
      }
      res.json(template);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  const transporter = nodemailer.createTransport({
    service: 'Gmail', // use your email service
    auth: {
        user: process.env.EMAIL, // your email
        pass: process.env.PASSWORD  // your email password
    }
});

app.post('/sending-emails', async (req, res) => {
    const { recipients, subject, message } = req.body;

    let emailPromises = recipients.map(recipient => {
        let mailOptions = {
            from: process.env.EMAIL,
            to: recipient,
            subject: subject,
            text: message
        };

        return transporter.sendMail(mailOptions);
    });

    try {
        await Promise.all(emailPromises);
        res.status(200).send('Emails sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending emails');
    }
});
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // use your email service
//     auth: {
//         user: process.env.EMAIL, // your email
//         pass: process.env.PASSWORD  // your email password
//     }
// });

// app.post('/send-emails', async (req, res) => {
//     console.log(req.body);
//     const { recipient } = req.body;
//     console.log(recipient);

//     let emailPromises = recipient.map(recipients => {
//         let mailOptions = {
//             from: process.env.EMAIL,
//             to: recipients,
//             subject: "huraaah",
//             text: "hiiii"
//         };

//         return transporter.sendMail(mailOptions);
//     });

//     try {
//         await Promise.all(emailPromises);
//         res.status(200).json({ status: 'sent', message: 'Emails sent successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'failed', message: 'Error sending emails' });
//     }
// });


app.post('/send-emails', async (req, res) => {
    const { recipient, sub, attachments, templateId } = req.body;
    console.log('Recipients:', recipient);
    console.log('JSON File Path:', attachments);

    try {
        // Read the JSON file
        const template = await Template.findById(templateId);
        const jsonData = JSON.parse(fs.readFileSync(attachments, 'utf8'));

        let emailPromises = recipient.map(async (email, index) => {
            let message = template.content.replace('{name}', jsonData[index].Name);
            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: sub,
                html: message
            };

            try {
                await transporter.sendMail(mailOptions);
                // Update JSON data on success
                jsonData[index].status = 'sent';
                jsonData[index].message = 'Successfully sent';
            } catch (error) {
                // Update JSON data on failure
                jsonData[index].status = 'failed';
                jsonData[index].message = `Error sending email: ${error.message}`;
                console.error(`Error sending email to ${email}:`, error);
            }
        });

        await Promise.all(emailPromises);

        // Write the updated JSON data back to the file
        fs.writeFileSync(attachments, JSON.stringify(jsonData, null, 2));

        res.status(200).json({ status: 'completed', message: 'Emails processed', jsonData });
    } catch (error) {
        console.error('Error processing emails:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// Login route


app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('roleId').populate('organisationId');
        if (user) {
            // Compare the provided password with the hashed password stored in the database
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Passwords match, generate JWT token
                Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        console.error("Error generating token:", err);
                        res.status(500).json({ result: "something went wrong" });
                    }
                    res.json({ user, auth: token });
                });
            } else {
                // Passwords don't match
                res.status(401).json("Invalid email or password");
            }
        } else {
            // User not found
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json("Server error");
    }
});




app.post('/organisation', async (req, res) => {
    
    const { organizationName, address, startDate, endDate, status } = req.body;

    //Perform additional validation checks
    // if (!organizationName || organizationName.length < 2) {
    //     return res.status(400).json({ error: 'Organization name is required and must be at least 2 characters long' });
    // }
    // if (!address || address.length < 5) {
    //     return res.status(400).json({ error: 'Address is required and must be at least 5 characters long' });
    // }
    // if (!startDate) {
    //     return res.status(400).json({ error: 'Start date is required' });
    // }
    // if (!endDate) {
    //     return res.status(400).json({ error: 'End date is required' });
    // }
    // if (new Date(startDate) > new Date(endDate)) {
    //     return res.status(400).json({ error: 'Start date must be before end date' });
    // }
    // if (!status || !['active', 'inactive'].includes(status)) {
    //     return res.status(400).json({ error: 'Status is required and must be either "active" or "inactive"' });
    // }

    try {
        const newOrganization = new Organisation({ organizationName, address, startDate, endDate, status });
        await newOrganization.save();
        res.json({ message: 'Form data saved successfully!' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.get('/organisation', async (req, res) => {
//     try {
//       const organisations = await Organisation.find(); // Fetch all organisations from the database
//       res.json(organisations); // Send the organisations as JSON response
//     } catch (error) {
//       console.error('Error fetching organisations:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
app.get('/organisations', async (req, res) => {
    try {
        const organisations = await Organisation.find({ deleted: 0 });
        res.json(organisations);
    } catch (error) {
        console.error('Error fetching organisations:', error);
        res.status(500).json({ message: 'Error fetching organisations' });
    }
});
app.get('/users', async (req, res) => {
    try {
        const organisations = await User.find({ deleted: 0 });
        res.json(organisations);
    } catch (error) {
        console.error('Error fetching organisations:', error);
        res.status(500).json({ message: 'Error fetching organisations' });
    }
});
app.put('/organisation/:id', async (req, res) => {
    const organisationId = req.params.id;
    const formData = req.body;

    try {
        const updatedOrganisation = await Organisation.findByIdAndUpdate(organisationId, formData, { new: true });
        if (!updatedOrganisation) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(updatedOrganisation);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.put('/organisations/:id', async (req, res) => {
    try {
        const updatedOrganisation = await Organisation.findByIdAndUpdate(req.params.id, { deleted: 1 }, { new: true });
        res.json(updatedOrganisation);
    } catch (error) {
        console.error('Error updating organisation:', error);
        res.status(500).json({ message: 'Error updating organisation' });
    }
});
app.put('/user/:id', async (req, res) => {
    try {
        const updatedOrganisation = await User.findByIdAndUpdate(req.params.id, { deleted: 1 }, { new: true });
        res.json(updatedOrganisation);
    } catch (error) {
        console.error('Error updating organisation:', error);
        res.status(500).json({ message: 'Error updating organisation' });
    }
});


// GET route to get organization by ID
app.get('/organisation/:id', async (req, res) => {
    const organisationId = req.params.id;
    console.log(organisationId);

    try {
        const organisation = await Organisation.findById(organisationId);
        if (!organisation) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(organisation);
    } catch (error) {
        console.error('Error fetching organization by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find({ role: { $ne: 'Superadmin' } });
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/roles/:id', async (req, res) => {
    const roleId = req.params.id;
    try {
        const roles = await Role.findById(roleId);
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/users', async (req, res) => {
    console.log(req);
    const { name, contactno, email, password, roleId, organisationId } = req.body;

    // Perform additional validation checks
    if (!name || name.length < 2) {
        return res.status(400).json({ error: 'Name is required and must be at least 2 characters long' });
    }
    if (!contactno || !/^\d{10}$/.test(contactno)) {
        return res.status(400).json({ error: 'A valid 10-digit contact number is required' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password is required and must be at least 6 characters long' });
    }
    if (!roleId) {
        return res.status(400).json({ error: 'Role ID is required' });
    }
    if (!organisationId) {
        return res.status(400).json({ error: 'Organisation ID is required' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            contactno,
            email,
            password: hashedPassword,
            roleId,
            organisationId
        });
        await newUser.save();
        console.log(newUser);
        res.json({ message: 'Form data saved successfully!' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.post('/users', async (req, res) => {
//     const formData = req.body;

//     // Save form data to MongoDB
//     try {
//         formData.password = await bcrypt.hash(formData.password, 12);
//         const newUser = new User(formData);
//         await newUser.save();
//         console.log(newUser);
//         res.json({ message: 'Form data saved successfully!' });
//     } catch (error) {
//         console.error('Error saving form data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.get('/user', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).populate('roleId').populate('organisationId');
        if (!user) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching organization by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const formData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, formData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating organization:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
function verifyToken(req,res,next){
    console.warn(req.headers['authorization'])
}
app.post('/templates',async(req,res)=>{
    const {formData,orgid} = req.body;
    console.log(formData)
    console.log(orgid)
    try{
        const newTemplate = new Template({...formData,organisationId:orgid});
        await newTemplate.save();
        res.json({message:'Template saved Successfully'});
    }
    catch(error){
        console.error("Error saving template",error);
        res.status(500).json({error:'Internal server error'});
    }
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});