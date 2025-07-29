// Données simulées pour l'application
class DataManager {
    constructor() {
        this.projects = [];
        this.currentUser = null;
        this.initializeData();
    }

    initializeData() {
        // Vérifier si des données existent déjà dans localStorage
        const savedProjects = localStorage.getItem('emergence_projects');
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
        } else {
            // Créer des données d'exemple
            this.projects = this.generateSampleProjects();
            this.saveProjects();
        }
    }

    generateSampleProjects() {
        const sampleProjects = [
            {
                id: 1,
                name: "Plateforme E-commerce Mobile",
                author: "Marie Dubois",
                authorEmail: "marie.dubois@email.com",
                authorPhone: "+33 6 12 34 56 78",
                description: "Développement d'une application mobile e-commerce avec système de paiement intégré, gestion des stocks en temps réel, et interface utilisateur moderne. L'application ciblera principalement les jeunes consommateurs et intégrera des fonctionnalités de réalité augmentée pour l'essai virtuel de produits.",
                status: "pending",
                date: new Date(2025, 0, 15).toISOString(),
                files: [
                    { name: "cahier_des_charges.pdf", size: "2.5 MB", type: "pdf" },
                    { name: "maquettes_ui.fig", size: "15.3 MB", type: "design" },
                    { name: "business_plan.docx", size: "1.2 MB", type: "document" }
                ],
                adminComment: "",
                priority: "high"
            },
            {
                id: 2,
                name: "Système de Gestion Hospitalière",
                author: "Dr. Jean Martin",
                authorEmail: "j.martin@hopital.fr",
                authorPhone: "+33 1 23 45 67 89",
                description: "Solution complète de gestion hospitalière incluant la gestion des patients, planification des rendez-vous, suivi médical électronique, et système de facturation. Le système devra être compatible avec les standards de sécurité RGPD et intégrer les protocoles médicaux existants.",
                status: "accepted",
                date: new Date(2025, 0, 12).toISOString(),
                files: [
                    { name: "specifications_techniques.pdf", size: "4.1 MB", type: "pdf" },
                    { name: "schema_base_donnees.sql", size: "856 KB", type: "code" },
                    { name: "prototype_interface.zip", size: "8.7 MB", type: "archive" }
                ],
                adminComment: "Projet très prometteur avec un fort potentiel d'impact social. L'équipe technique est solide et le business plan est bien structuré.",
                priority: "high"
            },
            {
                id: 3,
                name: "Application de Covoiturage Écologique",
                author: "Sophie Laurent",
                authorEmail: "sophie.laurent@gmail.com",
                authorPhone: "+33 7 89 12 34 56",
                description: "Plateforme de covoiturage axée sur l'impact environnemental, avec calcul d'empreinte carbone, système de récompenses pour les utilisateurs écoresponsables, et intégration avec les transports en commun locaux.",
                status: "in-progress",
                date: new Date(2025, 0, 10).toISOString(),
                files: [
                    { name: "etude_marche.pdf", size: "3.2 MB", type: "pdf" },
                    { name: "wireframes.pdf", size: "2.8 MB", type: "pdf" }
                ],
                adminComment: "Projet en cours de développement. Première phase validée avec succès.",
                priority: "medium"
            },
            {
                id: 4,
                name: "Plateforme d'Apprentissage IA",
                author: "Thomas Bernhard",
                authorEmail: "t.bernhard@tech.com",
                authorPhone: "+33 6 78 90 12 34",
                description: "Plateforme éducative utilisant l'intelligence artificielle pour personnaliser l'apprentissage selon le profil de chaque étudiant. Intégration de technologies de reconnaissance vocale et de traitement du langage naturel.",
                status: "rejected",
                date: new Date(2025, 0, 8).toISOString(),
                files: [
                    { name: "concept_technique.pdf", size: "1.9 MB", type: "pdf" }
                ],
                adminComment: "Le concept est intéressant mais manque de faisabilité technique. Budget insuffisant pour la complexité du projet.",
                priority: "low"
            },
            {
                id: 5,
                name: "Système IoT pour Agriculture",
                author: "Pierre Moreau",
                authorEmail: "p.moreau@agritech.fr",
                authorPhone: "+33 5 43 21 09 87",
                description: "Solution IoT complète pour l'agriculture de précision : capteurs de sol, stations météo connectées, drones de surveillance, et tableau de bord analytics pour optimiser les rendements agricoles.",
                status: "pending",
                date: new Date(2025, 0, 18).toISOString(),
                files: [
                    { name: "architecture_iot.pdf", size: "5.1 MB", type: "pdf" },
                    { name: "prototype_capteurs.zip", size: "12.4 MB", type: "archive" },
                    { name: "demo_dashboard.mp4", size: "45.2 MB", type: "video" }
                ],
                adminComment: "",
                priority: "medium"
            },
            {
                id: 6,
                name: "Application de Méditation Guidée",
                author: "Amélie Chen",
                authorEmail: "amelie.chen@wellness.com",
                authorPhone: "+33 6 55 44 33 22",
                description: "Application mobile de bien-être proposant des séances de méditation personnalisées, suivi de l'humeur, programmes de respiration, et communauté d'entraide pour la santé mentale.",
                status: "accepted",
                date: new Date(2025, 0, 5).toISOString(),
                files: [
                    { name: "guide_utilisateur.pdf", size: "2.1 MB", type: "pdf" },
                    { name: "sessions_audio.zip", size: "128 MB", type: "archive" }
                ],
                adminComment: "Excellent projet répondant à un vrai besoin sociétal. L'approche est innovante et le marché cible bien défini.",
                priority: "high"
            },
            {
                id: 7,
                name: "Plateforme de Freelancing Local",
                author: "Lucas Petit",
                authorEmail: "l.petit@freelance.fr",
                authorPhone: "+33 7 11 22 33 44",
                description: "Marketplace connectant les freelances locaux avec les entreprises de leur région, avec système de géolocalisation, évaluations communautaires, et outils de gestion de projet intégrés.",
                status: "in-progress",
                date: new Date(2025, 0, 3).toISOString(),
                files: [
                    { name: "model_economique.pdf", size: "1.8 MB", type: "pdf" },
                    { name: "mvp_demo.zip", size: "25.6 MB", type: "archive" }
                ],
                adminComment: "Développement en cours. Bons retours des premiers tests utilisateurs.",
                priority: "medium"
            },
            {
                id: 8,
                name: "Solution de Recyclage Intelligent",
                author: "Emma Rousseau",
                authorEmail: "e.rousseau@ecotech.fr",
                authorPhone: "+33 6 99 88 77 66",
                description: "Système de tri automatique des déchets utilisant la vision par ordinateur et l'IA, avec application mobile pour sensibiliser les citoyens au recyclage et gamification du processus.",
                status: "pending",
                date: new Date(2025, 0, 20).toISOString(),
                files: [
                    { name: "impact_environnemental.pdf", size: "3.7 MB", type: "pdf" },
                    { name: "algorithme_tri.py", size: "45 KB", type: "code" },
                    { name: "partenariats.docx", size: "890 KB", type: "document" }
                ],
                adminComment: "",
                priority: "high"
            }
        ];

        return sampleProjects;
    }

    // Gestion des projets
    getProjects() {
        return this.projects;
    }

    getProjectById(id) {
        return this.projects.find(project => project.id === parseInt(id));
    }

    updateProject(id, updates) {
        const projectIndex = this.projects.findIndex(project => project.id === parseInt(id));
        if (projectIndex !== -1) {
            this.projects[projectIndex] = { ...this.projects[projectIndex], ...updates };
            this.saveProjects();
            return this.projects[projectIndex];
        }
        return null;
    }

    updateProjectStatus(id, status, comment) {
        const project = this.updateProject(id, { 
            status: status,
            adminComment: comment,
            updatedAt: new Date().toISOString()
        });
        return project;
    }

    deleteProject(id) {
        const projectIndex = this.projects.findIndex(project => project.id === parseInt(id));
        if (projectIndex !== -1) {
            const deletedProject = this.projects.splice(projectIndex, 1)[0];
            this.saveProjects();
            return deletedProject;
        }
        return null;
    }

    // Filtres et recherche
    searchProjects(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.projects.filter(project => 
            project.name.toLowerCase().includes(lowercaseQuery) ||
            project.author.toLowerCase().includes(lowercaseQuery) ||
            project.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    filterProjectsByStatus(status) {
        if (!status) return this.projects;
        return this.projects.filter(project => project.status === status);
    }

    filterProjectsByDate(dateRange) {
        if (!dateRange) return this.projects;
        
        const now = new Date();
        let startDate;
        
        switch (dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                return this.projects;
        }
        
        return this.projects.filter(project => new Date(project.date) >= startDate);
    }

    // Statistiques
    getProjectStats() {
        const stats = {
            total: this.projects.length,
            pending: this.projects.filter(p => p.status === 'pending').length,
            accepted: this.projects.filter(p => p.status === 'accepted').length,
            rejected: this.projects.filter(p => p.status === 'rejected').length,
            inProgress: this.projects.filter(p => p.status === 'in-progress').length
        };
        return stats;
    }

    getMonthlyStats() {
        const monthlyData = {};
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        
        // Initialiser les données pour les 6 derniers mois
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
            monthlyData[monthKey] = { submitted: 0, accepted: 0, rejected: 0 };
        }
        
        // Compter les projets par mois
        this.projects.forEach(project => {
            const projectDate = new Date(project.date);
            const monthKey = `${months[projectDate.getMonth()]} ${projectDate.getFullYear()}`;
            
            if (monthlyData[monthKey]) {
                monthlyData[monthKey].submitted++;
                if (project.status === 'accepted') {
                    monthlyData[monthKey].accepted++;
                } else if (project.status === 'rejected') {
                    monthlyData[monthKey].rejected++;
                }
            }
        });
        
        return monthlyData;
    }

    getRecentProjects(limit = 5) {
        return this.projects
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Gestion de l'utilisateur
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('emergence_current_user', JSON.stringify(user));
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('emergence_current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('emergence_current_user');
    }

    // Persistance des données
    saveProjects() {
        localStorage.setItem('emergence_projects', JSON.stringify(this.projects));
    }

    // Utilitaires de date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return "Aujourd'hui";
        } else if (diffDays === 1) {
            return "Hier";
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`;
        } else if (diffDays < 30) {
            return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
        } else {
            return `Il y a ${Math.floor(diffDays / 30)} mois`;
        }
    }

    // Utilitaires pour les fichiers
    getFileIcon(fileType) {
        const icons = {
            pdf: 'M4 2h10l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
            document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
            code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
            design: 'M12 2l3.09 6.26L22 9l-5 4.74L18.18 22 12 18.77 5.82 22 7 13.74 2 9l6.91-.74L12 2z',
            archive: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
            video: 'M23 7l-7 5 7 5V7z'
        };
        return icons[fileType] || icons.document;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Instance globale du gestionnaire de données
window.dataManager = new DataManager();