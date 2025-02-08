USE easyreno;

-- ✅ Désactiver temporairement les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 0;

-- ✅ Vider toutes les tables sauf `Owner` et `Company`
TRUNCATE TABLE Message;
TRUNCATE TABLE Exchange;
TRUNCATE TABLE Activity;
TRUNCATE TABLE Etape;
TRUNCATE TABLE Chantier;
TRUNCATE TABLE Invoice;
TRUNCATE TABLE Task;
TRUNCATE TABLE Project;
TRUNCATE TABLE Quote;
TRUNCATE TABLE Ad;
TRUNCATE TABLE Employee;

-- ✅ Réactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- ✅ Insérer des annonces (`Ad`)
INSERT INTO Ad (title, location, workArea, maxBudget, description, ownerId, createdAt, updatedAt) VALUES
    ('Rénovation maison', 'Paris', 'Plomberie', 15000, 'Rénovation complète de la plomberie.', 1, NOW(), NOW()),
    ('Isolation thermique', 'Lyon', 'Isolation', 8000, 'Amélioration de l’isolation.', 1, NOW(), NOW()),
    ('Aménagement extérieur', 'Marseille', 'Jardinage', 5000, 'Création d’un jardin.', 1, NOW(), NOW());

-- ✅ Vérifier et ajouter `projectId` dans `Quote` si elle n'existe pas
SET @column_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                       WHERE TABLE_NAME = 'Quote' AND COLUMN_NAME = 'projectId');

SET @sql := IF(@column_exists = 0, 
              'ALTER TABLE Quote ADD COLUMN projectId INT NULL;', 
              'SELECT "Column already exists";');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ✅ Insérer des devis (`Quote`)
INSERT INTO Quote (title, price, description, fileUrl, status, duration, adId, companyId, ownerId, projectId, createdAt, updatedAt) VALUES
    ('Devis plomberie', 14000, 'Devis pour la rénovation complète.', NULL, 'pending', '6 mois', 1, 1, 1, NULL, NOW(), NOW()),
    ('Devis isolation', 7800, 'Isolation thermique et phonique.', NULL, 'accepted', '3 mois', 2, 1, 1, NULL, NOW(), NOW()),
    ('Devis jardin', 4800, 'Aménagement avec éclairage LED.', NULL, 'rejected', '4 mois', 3, 1, 1, NULL, NOW(), NOW());

-- ✅ Insérer des projets (`Project`)
INSERT INTO Project (clientName, projectTitle, description, location, startDate, endDate, status, budget, ownerId, companyId, createdAt, updatedAt) VALUES
    ('Jean Dupont', 'Rénovation salle de bain', 'Modernisation de la salle de bain.', 'Paris', '2024-02-01', '2024-06-01', 'en cours', 12000, 1, 1, NOW(), NOW()),
    ('Marie Curie', 'Isolation extérieure', 'Isolation thermique complète.', 'Lyon', '2024-03-15', '2024-09-15', 'terminé', 8500, 1, 1, NOW(), NOW()),
    ('Paul Martin', 'Création d’un espace vert', 'Installation de gazon et plantes.', 'Marseille', '2024-04-20', '2024-08-20', 'en cours', 6000, 1, 1, NOW(), NOW());

-- ✅ Insérer des tâches (`Task`)
INSERT INTO Task (description, completed, date, `delayed`, projectId, createdAt, updatedAt) VALUES
    ('Démolition ancienne salle de bain', TRUE, '2024-02-05', FALSE, 1, NOW(), NOW()),
    ('Pose de l’isolation extérieure', TRUE, '2024-03-20', FALSE, 2, NOW(), NOW()),
    ('Plantation des arbres', FALSE, '2024-04-25', FALSE, 3, NOW(), NOW());

-- ✅ Insérer des employés (`Employee`)
INSERT INTO Employee (name, createdAt, updatedAt) VALUES
    ('Marc Lefebvre', NOW(), NOW()),
    ('Elodie Moreau', NOW(), NOW()),
    ('Alexandre Dubois', NOW(), NOW());

-- ✅ Insérer des factures (`Invoice`)
INSERT INTO Invoice (clientName, projectTitle, amount, date, status, details, companyId, projectId, createdAt, updatedAt) VALUES
    ('Jean Dupont', 'Rénovation salle de bain', 12000, '2024-06-02', 'payé', 'Facture réglée en totalité.', 1, 1, NOW(), NOW()),
    ('Marie Curie', 'Isolation extérieure', 8500, '2024-09-16', 'en attente', 'Reste 20% à payer.', 1, 2, NOW(), NOW());

-- ✅ Insérer des chantiers (`Chantier`)
INSERT INTO Chantier (adId, companyId, status, createdAt, updatedAt) VALUES
    (1, 1, 'en cours', NOW(), NOW()),
    (2, 1, 'terminé', NOW(), NOW()),
    (3, 1, 'en cours', NOW(), NOW());

-- ✅ Insérer des étapes (`Etape`)
INSERT INTO Etape (chantierId, name, details, completed, ownerValidated, companyValidated, reserve, createdAt, updatedAt) VALUES
    (1, 'Démolition', '{"tâches": ["Retrait ancien carrelage", "Démontage des meubles"]}', TRUE, TRUE, TRUE, NULL, NOW(), NOW()),
    (2, 'Installation Isolation', '{"tâches": ["Pose laine de roche", "Enduit de finition"]}', TRUE, TRUE, TRUE, NULL, NOW(), NOW()),
    (3, 'Aménagement jardin', '{"tâches": ["Plantation", "Irrigation"]}', FALSE, FALSE, FALSE, 'Problème d’arrosage automatique.', NOW(), NOW());

-- ✅ Vérification des données insérées
SELECT * FROM Ad;
SELECT * FROM Quote;
SELECT * FROM Project;
SELECT * FROM Task;
SELECT * FROM Employee;
SELECT * FROM Invoice;
SELECT * FROM Chantier;
SELECT * FROM Etape;
SELECT * FROM Activity;
SELECT * FROM Exchange;
SELECT * FROM Message;

-- ✅ Réactiver les contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;
