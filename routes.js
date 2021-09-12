const express = require('express');
const router = express.Router();
const jwtHandler = require('express-jwt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const registryItemService = require('./registry-item.service');

const APP_KEY = "AndDRegistry";
const authHandler = jwtHandler({
    secret: APP_KEY,
    algorithms: ['RS256'],
    userProperty: 'payload'
});

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'carry_a_stick@hotmail.com',
        pass: '0tLdqZrZ2%^&P$gI'
    }
});

var mailOptions = {
    from: 'carry_a_stick@hotmail.com',
    to: 'danielmcauliffe@outlook.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

function generateToken(_id, name) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id,
      name,
      exp: parseInt(expiry.getTime() / 1000),
    }, APP_KEY); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

router.route('/registerorlogin').post((req, res) => {
    if (req.body.password !== APP_KEY) {
        res.status(500).json("Incorrect password");
        return;
    }

    var lowerCaseName = req.body.name.toLowerCase();

    global.dbo.collection('users').findOne({ name: lowerCaseName }).then(user => {
        if (!user) {
            global.dbo.collection('users').insertOne({ name: lowerCaseName }).then(newUser => {
                var token = generateToken(newUser._id, newUser.name)
                res.status(200);
                res.json({ token })
            })
        } else {
            var token = generateToken(user._id, user.name)
            res.status(200);
            res.json({ token })
        }
    }).catch(err => {
        res.status(500).send(err);
    });
})

router.route('/rsvp').post((req, res) => {
    console.log(req);
    transporter.sendMail(mailOptions);

    global.dbo.collection('rsvps').insertOne(req.body).then(document => {
        res.status(200).send(document)
    }).catch(err => {
        res.status(500).send(err);
    })
})

router.route('/registry-items').get((req, res) => {
    registryItemService.list(req, res);
})

router.route('/registry-items/register').post((req, res) => {
    registryItemService.register(req, res);
})

router.route('/registry-items/deregister').post((req, res) => {
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
