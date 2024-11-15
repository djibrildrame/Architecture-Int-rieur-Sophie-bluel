// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const authenticateToken = require("./middleware/authenticateToken"); // Import du middleware d'authentification

const app = express(); // Initialisation de app
app.use(cors());
app.use(express.json());

// Configuration du dossier statique pour les uploads
app.use('/uploads', express.static('uploads'));

// Configuration de stockage de multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("Le fichier doit être au format JPG ou PNG."));
        }
    },
    limits: {
        fileSize: 4 * 1024 * 1024 // Limite de taille à 4 Mo
    }
});

// Route de connexion pour générer un token JWT
app.post('/api/users/login', (req, res) => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
});

// Route pour ajouter un projet avec un fichier image
app.post("/api/works", authenticateToken, upload.single("image"), (req, res) => {
    const { title, category } = req.body;
    const image = req.file;

    if (!title || !category || !image) {
        return res.status(400).json({ error: "Tous les champs (title, category, image) sont requis." });
    }

    const newProject = {
        id: Date.now(),
        title,
        category: { name: category },
        imageUrl: `/uploads/${image.filename}`
    };

    // Simulez l'ajout dans une base de données (par exemple, dans un tableau en mémoire)
    projects.push(newProject); // Variable `projects` à simuler pour stocker les données

    res.status(201).json(newProject);
});

// Route pour supprimer un projet par ID
app.delete('/api/works/:id', authenticateToken, (req, res) => {
    const projectId = req.params.id;
    console.log(`Projet avec ID ${projectId} supprimé`);
    res.json({ message: `Travail avec ID ${projectId} supprimé.` });
});

// Gestion des erreurs globales pour multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// Démarrage du serveur sur le port 5000
app.listen(5000, () => {
    console.log('Serveur démarré sur le port 5000');
});
