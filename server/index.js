const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');

const multer = require("multer");

// ovo je upload middleware 
const upload = multer({ dest: "./uploads/" });

const port = 3000;

async function connect_to_db() {
    // Connection URL
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    // Database Name
    const dbName = 'wp_13';    

    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
  
    return db;
}

(async () => {
    const app = express();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    const db = await connect_to_db();
    // await db.collection("data").drop();

    app.get("/api/files", async (req, res) => {
        const files = await db.collection("data").find({}).toArray();
        res.send(files);
    });  

    
    app.get("/api/files/:_id", async (req, res) => {
        const _id = ObjectId.createFromHexString(req.params._id); 
        const data = await db.collection("data").findOne({ _id });
        res.download(data.path, data.originalname);
    });

    app.post("/api/files/", upload.single("file"), async (req, res) => {
        const db_res = await db.collection("data").insertOne({ ...req.file, ...req.body });

        

        req.file["_id"] = db_res.insertedId;
        // trebalo bi se dodati i description
        res.send({ message: "Successfully uploaded", file: req.file });
    });

    app.listen(port, () => {
        console.log(`Express: I'm listening at ${port}`);
    });

})();