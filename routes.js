const express = require('express');
const router = express.Router();
const jwtHandler = require('express-jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const registryItemService = require('./registry-item.service');

const APP_KEY = process.env.APP_KEY || "Default";
const EMAIL_PASS = process.env.EMAIL_PASS || "Pass";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "Token";
const authHandler = jwtHandler({
    secret: TOKEN_SECRET,
    algorithms: ['HS256'],
    userProperty: 'payload'
});

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'mattclairewedding@outlook.com',
        pass: EMAIL_PASS
    }
});

function getMailOptions(html) {
    return mailOptions = {
        from: 'mattclairewedding@outlook.com',
        to: 'mattclairewedding@outlook.com',
        subject: 'RSVP',
        html
    };
}


function generateToken(_id, name) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id,
      name,
      exp: parseInt(expiry.getTime() / 1000),
    }, TOKEN_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

router.route('/registerorlogin').post((req, res) => {
    if (req.body.password !== APP_KEY) {
        res.status(500).json("Incorrect passkey");
        return;
    }

    if (!req.body.name) {
        res.status(500).json("Name cannot be empty");
    }

    var lowerCaseName = req.body.name.toLowerCase();

    global.dbo.collection('users').findOne({ name: lowerCaseName }).then(user => {
        if (!user) {
            global.dbo.collection('users').insertOne({ name: lowerCaseName }).then(({ insertedId }) => {
                var token = generateToken(insertedId, lowerCaseName);
                res.status(200).json({ token });
            }).catch(err => {;
                res.status(500).send(err);
            });
        } else {
            var token = generateToken(user._id, user.name)
            res.status(200).json({ token });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
})

router.route('/rsvps').get((req, res) => {
    global.dbo.collection('rsvps').find().toArray().then(document => {
        res.status(200).send(document);
    }).catch(err => {
        res.status(500).send(err);
    });
})

router.route('/rsvp').post((req, res) => {
    const mailText = `
        <h1>${req.body.names}</h1>
        <p>${req.body.canAttend}</p>
        <p>
            ${req.body.dietaryRequirements ? 'Dietary requirements are: ' : 'No dietary requirements'} 
            ${req.body.dietaryRequirements}
        </p>
        <p>${req.body.comments}</p>
    `
    transporter.sendMail(getMailOptions(mailText));

    global.dbo.collection('rsvps').insertOne(req.body).then(document => {
        res.status(200).send(document)
    }).catch(err => {
        res.status(500).send(err);
    })
})

router.route('/registry-items').get((req, res) => {
    registryItemService.list(req, res);
})

router.route('/registry-items/register').post(authHandler, (req, res) => {
    registryItemService.register(req, res);
})

router.route('/registry-items/deregister').post(authHandler, (req, res) => {
    registryItemService.deregister(req, res);
})
// router.route('/persons').get((req, res) => {
//     personService.list(req, res);
// });

// router.route('/persons/:id').get((req, res) => {
//     personService.get(req, res);
// });

// router.route('/persons/:id').put((req, res) => {
//     personService.updatePerson(req, res);
// });

// router.route('/persons/:id/drink').put((req, res) => {
//     personService.upsertDrink(req, res);
// });

// router.route('/persons/:id/hasBowl').put((req, res) => {
//     personService.updateHasBowl(req, res);
// });

// router.route('/persons/createChild').post((req, res) => {
//     personService.createChild(req, res);
// });

// router.route('/persons/createGuardian').post((req, res) => {
//     personService.createGuardian(req, res);
// });

// router.route('/persons/createStaffMember').post((req, res) => {
//     personService.createStaffMember(req, res);
// });

// router.route('/persons/createFamily').post((req, res) => {
//     personService.createFamily(req, res);
// });

// router.route('/terms').get((req, res) => {
//     termService.list(req, res);
// });

// router.route('/terms/:id').get((req, res) => {
//     termService.get(req, res);
// });

// router.route('/terms/:id/register').post((req, res) => {
//     termService.register(req, res);
// });

// router.route('/terms/:id/updateRegistration').post((req, res) => {
//     termService.updateRegistration(req, res);
// });

// router.route('/terms/create').post((req, res) => {
//     termService.create(req, res);
// })

// // router.route('/sessions/:id').get((req, res) => {
// //     sessionService.get(req, res);
// // });

// router.route('/sessions').get((req, res) => {
//     sessionService.listYearAndPreviousSessions(req, res);
// });

// router.route('/terms/:termId/sessions/create').post((req, res) => {
//     sessionService.create(req, res);
// });

// router.route('/terms/:termId/sessions/:sessionId/checkIn').post((req, res) => {
//     sessionService.checkIn(req, res);
// });

// router.route('/terms/:termId/sessions/:sessionId/checkOut').post((req, res) => {
//     sessionService.checkOut(req, res);
// });

// //Transactions
// router.route('/transactions').get((req, res) => {
//     transactionService.getTransactions(req, res);
// });

// router.route('/transactions/create').post((req, res) => {
//     transactionService.createTransaction(req, res);
// });

// router.route('/transactions/createmany').post((req, res) => {
//     transactionService.createManyTransactions(req, res);
// });

// router.route('/transactions/delete/:id').delete((req, res) => {
//     transactionService.deleteTransaction(req, res);
// });

// // Accounts
// router.route('/accounts/delete/:id').delete((req, res) => {
//     accountService.deleteAccount(req, res);    
// });

// router.route('/accounts/:id').get((req, res) => {
//     accountService.getAccountById(req, res);
// });

// router.route('/accounts/:id/update').post((req, res) => {
//     accountService.updateAccount(req, res);
// })

// router.route('/accounts').get((req, res) => {
//     accountService.getAccounts(req, res);
// });

// router.route('/accounts/create').post((req, res) => {
//     accountService.createAccount(req, res);
// });

module.exports=router;
