const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// ===== Mongo =====
const DB_NAME = 'wp_ficok_tin';
const COLLECTION = 'files';

const MONGO_URL = 'mongodb://localhost:27017';
const client = new MongoClient(MONGO_URL);

let filesCollection;

// ===== Upload folder =====
const UPLOAD_DIR = path.join(__dirname, '.', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOAD_DIR),
    filename: (_, file, cb) => {
        const safe = `${Date.now()}-${file.originalname}`.replace(/\s+/g, '_');
        cb(null, safe);
    },
});
const upload = multer({ storage });

// ===== LOGIN (JWT) =====
const JWT_SECRET = 'super_secret_key_change_me';

app.post('/api/login', (req, res) => {
    const name = 'Tin'; // TODO: stavi svoje ime
    const token = jwt.sign({ name }, JWT_SECRET, { expiresIn: '5m' }); // 5 min
    res.json({ token });
});

// ===== FILES API =====

// list
app.get('/api/files', async (req, res) => {
    const items = await filesCollection
        .find({}, { projection: { storedName: 1, originalName: 1, mimetype: 1, size: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .toArray();

    res.json(items);
});

// upload
app.post('/api/files', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    const doc = {
        storedName: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        createdAt: new Date(),
    };

    const result = await filesCollection.insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
});

// download
app.get('/api/files/:id/download', async (req, res) => {
    const id = req.params.id;
    const item = await filesCollection.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: 'Not found' });

    const filePath = path.join(UPLOAD_DIR, item.storedName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File missing on disk' });

    res.download(filePath, item.originalName);
});

// delete (full) – DB + disk (4 boda)
app.delete('/api/files/:id', async (req, res) => {
    const id = req.params.id;
    const item = await filesCollection.findOne({ _id: new ObjectId(id) });
    if (!item) return res.status(404).json({ message: 'Not found' });

    // 1) delete from disk
    const filePath = path.join(UPLOAD_DIR, item.storedName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    // 2) delete from DB
    await filesCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(204).send();
});

// ===== Start =====
async function start() {
    await client.connect();
    const db = client.db(DB_NAME);
    filesCollection = db.collection(COLLECTION);

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});
