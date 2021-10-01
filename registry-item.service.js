const { ObjectId } = require("mongodb");

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

module.exports = {
    list,
    register,
    deregister
}