-- ✅ Création de la base de données
CREATE DATABASE IF NOT EXISTS easyreno;
USE easyreno;

-- ✅ Désactivation temporaire des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 0;

-- ✅ Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS Message, Exchange, Activity, Invoice, Employee, Task, Project, Quote, Ad, Chantier, Etape, Company, Owner, User;

-- ✅ Réactivation des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- ✅ Table des utilisateurs
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    userType VARCHAR(50) NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- ✅ Table des propriétaires (vide pour l'instant)
CREATE TABLE Owner (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    complementAdresse VARCHAR(255),
    ville VARCHAR(255) NOT NULL,
    codePostal VARCHAR(20) NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- ✅ Table des entreprises (vide pour l'instant)
CREATE TABLE Company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomEntreprise VARCHAR(255) NOT NULL,
    siret VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    motDePasse VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    complementAdresse VARCHAR(255),
    ville VARCHAR(255) NOT NULL,
    codePostal VARCHAR(20) NOT NULL,
    corpsEtat VARCHAR(255) NOT NULL,
    autreCorpsEtat VARCHAR(255),
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- ✅ Table des annonces
CREATE TABLE Ad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    workArea VARCHAR(255) NOT NULL,
    maxBudget FLOAT NOT NULL,
    description TEXT NOT NULL,
    ownerId INT NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (ownerId) REFERENCES Owner(id) ON DELETE CASCADE
);

-- ✅ Table des projets
CREATE TABLE Project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientName VARCHAR(255) NOT NULL,
    projectTitle VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    budget FLOAT NOT NULL,
    ownerId INT NOT NULL,
    companyId INT,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (ownerId) REFERENCES Owner(id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE SET NULL
);

-- ✅ Table des devis
CREATE TABLE Quote (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    description TEXT NOT NULL,
    fileUrl VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    duration VARCHAR(50) DEFAULT '6 mois',
    adId INT NOT NULL,
    companyId INT,
    ownerId INT,
    projectId INT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (adId) REFERENCES Ad(id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE SET NULL,
    FOREIGN KEY (ownerId) REFERENCES Owner(id) ON DELETE SET NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE SET NULL
);


-- ✅ Table des tâches (`Task`)
CREATE TABLE Task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    date DATETIME NOT NULL,
    `delayed` BOOLEAN DEFAULT FALSE, -- ✅ Utilisation des backticks pour le mot réservé
    projectId INT NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

-- ✅ Table des employés
CREATE TABLE Employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW()
);

-- ✅ Table des factures
CREATE TABLE Invoice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientName VARCHAR(255) NOT NULL,
    projectTitle VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT,
    companyId INT NOT NULL,
    projectId INT NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE CASCADE,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
);

-- ✅ Table des chantiers
CREATE TABLE Chantier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    adId INT UNIQUE NOT NULL,
    companyId INT NOT NULL,
    status VARCHAR(50) DEFAULT 'en cours',
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (adId) REFERENCES Ad(id) ON DELETE CASCADE,
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE CASCADE
);

-- ✅ Table des étapes
CREATE TABLE Etape (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chantierId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    details JSON NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    ownerValidated BOOLEAN DEFAULT FALSE,
    companyValidated BOOLEAN DEFAULT FALSE,
    reserve TEXT,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (chantierId) REFERENCES Chantier(id) ON DELETE CASCADE
);

-- ✅ Table des activités
CREATE TABLE Activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    projectTitle VARCHAR(255) NOT NULL,
    companyId INT NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE CASCADE
);

-- ✅ Table des échanges
CREATE TABLE Exchange (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyId INT NOT NULL,
    ownerId INT NOT NULL,
    quoteId INT,
    createdAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (companyId) REFERENCES Company(id) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES Owner(id) ON DELETE CASCADE,
    FOREIGN KEY (quoteId) REFERENCES Quote(id) ON DELETE SET NULL
);

-- ✅ Table des messages
CREATE TABLE Message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exchangeId INT NOT NULL,
    sender VARCHAR(50) NOT NULL, -- "owner" ou "business"
    content TEXT NOT NULL,
    fileUrl VARCHAR(255),
    timestamp DATETIME DEFAULT NOW(),
    FOREIGN KEY (exchangeId) REFERENCES Exchange(id) ON DELETE CASCADE
);

-- ✅ Vérification des tables créées
SHOW TABLES;
