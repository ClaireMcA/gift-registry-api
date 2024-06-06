const { ObjectId } = require("mongodb");

function list(req, res) {
    global.dbo.collection('registry-items').find().sort({ category: -1, title: 1 }).toArray().then(document => {
        res.status(200).send(document);
    }).catch(err => {
        res.status(500).send(err);
    });
}

function deleteItem(req, res) {
    global.dbo.collection('registry-items').deleteOne({ _id: ObjectId(req.params.id) }).then(document => {
        res.status(200).send(document)
    }).catch(err => {
        res.status(500).send(err);
    })
}

function create(req, res) {
    global.dbo.collection('registry-items').insertOne(req.body).then(({ insertedId }) => {
        res.status(200).send({
            ...req.body,
            _id: insertedId
        });
    }).catch(err => {
        res.status(500).send(err);
    })
}

function register(req, res) {
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
    deregister,
    create,
    deleteItem
}