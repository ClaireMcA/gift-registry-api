const { ObjectId } = require("mongodb");
// const personType = require("./person-type");

function list(req, res) {
    global.dbo.collection('registry-items').find().toArray().then(document => {
        res.status(200).send(document);
    }).catch(err => {
        res.status(500).send(err);
    });
}

function register(req, res) {
    console.log(req.body);
    global.dbo.collection('registry-items').findOne({ _id: ObjectId(req.body.id) }).then(document => {
        if (document.userRegistered) {
            res.status(500).send("Someone else has already registered for this item. Please refresh.");
        } else {
            global.dbo.collection('registry-items').updateOne(
                { _id: ObjectId(req.body.id) },
                { $set: { userRegistered: req.body.user }}
            ).then(document => {
                res.status(200).send(document);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    })
}

function deregister(req, res) {
    global.dbo.collection('registry-items').updateOne(
        { _id: ObjectId(req.body.id) },
        { $set: { userRegistered: null }}
    ).then(document => {
        res.status(200).send(document);
    }).catch(err => {
        res.status(500).send(err);
    });
}

// function get(req, res) {
//     global.dbo.collection('persons').find({ id: req.id }).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function createChild(req, res) {
//     global.dbo.collection('persons').insertOne({ ...req.body, type: personType.child }).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function createGuardian(req, res) {
//     global.dbo.collection('persons').insertOne({ ...req.body, type: personType.guardian }).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function createStaffMember(req, res) {
//     global.dbo.collection('persons').insertOne({ ...req.body, type: personType.staff }).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function createFamily(req, res) {
//     const familyId = new ObjectID();
//     const persons = [ 
//         ...req.body.guardians.map(guardian => ({ ...guardian, familyId, type: personType.guardian})), 
//         ...req.body.children.map(child => ({ ...child, familyId, type: personType.child})), 
//     ];

//     global.dbo.collection('persons').insertMany(persons).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function upsertDrink(req, res) {
//     global.dbo.collection('persons').updateOne(
//         { _id: ObjectId(req.params.id) },
//         { $set: { drink: req.body.drink }}
//     ).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function updateHasBowl(req, res) {
//     global.dbo.collection('persons').updateOne(
//         { _id: ObjectId(req.params.id) },
//         { $set: { hasBowl: req.body.hasBowl }}
//     ).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// function updatePerson(req, res) {
//     global.dbo.collection('persons').updateOne(
//         { _id: ObjectId(req.params.id) },
//         { $set: req.body }
//     ).then(document => {
//         res.status(200).send(document);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// }

// // function getAccounts(req, res) {
// //     const docquery = Account.find({});
// //     docquery
// //         .exec()
// //         .then(accounts => {
// //             res.status(200).json(accounts);
// //         })
// //         .catch(error => {
// //             res.status(500).send(error);
// //             return;
// //         });
// // }

// // function getAccountById(req, res) {
// //     const docquery = Account.findById(req.params.id);
// //     docquery
// //         .exec()
// //         .then(account => {
// //             res.status(200).json(account);
// //         })
// //         .catch(error => {
// //             res.status(500).send(error);
// //             return;
// //         });

// // }

// // function deleteAccount(req, res) {
// //     Account.findByIdAndDelete(req.params.id)
// //         .then(account => {
// //             if (!checkFound(res, account)) return;
// //             res.status(200).json(account);
// //             console.log('Account deleted successfully!');
// //         })
// //         .catch(error => {
// //             if (checkServerError(res, error)) return;
// //         });
// // }

// // function createAccount(req, res) {
// //     let account = new Account(req.body);
// //     account.save(error => {
// //         if (checkServerError(res, error)) return;
// //         res.status(200).json(account);
// //         console.log('Account created successfully');
// //     })
// // }

// // function updateAccount(req, res) {
// //    Account.findByIdAndUpdate(req.params.id, req.body)
// //         .then(account => {
// //             if (!checkFound(res, account)) return;
// //             res.status(200).json(account);
// //             console.log('Account updated successfully')
// //         })
// //         .catch(error => {
// //             if (checkServerError(res, error)) return;
// //         });
// // }

// // function checkFound(res, account) {
// //     if (!account) {
// //         res.status(404).send('Account not found.');
// //         return;
// //     }
// //     return account;
// // }

// // function checkServerError(res, error) {
// //     if (error) {
// //         res.status(500).send(error);
// //         return error;
// //     }
// // }

module.exports = {
    list,
    register,
    deregister
}