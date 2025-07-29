// Gestionnaire de données connecté à la base de données Django
class DatabaseManager {
    constructor() {
        this.baseUrl = '';
        this.projects = [];
        this.stats = {};
        this.currentUser = null;
    }

    // Méthodes d'authentification
    async login(username, password) {
        try {
            const response = await fetch('/api/admin/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentUser = data.user;
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return { success: false, error: 'Erreur de connexion' };
        }
    }

    async logout() {
        try {
            await fetch('/logout/', { method: 'GET' });
            this.currentUser = null;
            this.projects = [];
            this.stats = {};
            return { success: true };
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            return { success: false, error: 'Erreur de déconnexion' };
        }
    }

    // Méthode pour étendre la session
    extendSession() {
        // Cette méthode peut être utilisée pour rafraîchir la session
        // Pour l'instant, on ne fait rien car Django gère automatiquement les sessions
        console.log('🔄 Extension de session...');
        return true;
    }

    // Méthodes pour récupérer les données
    async loadProjects() {
        try {
            console.log('🔄 DatabaseManager: Chargement des projets...');
            
            const response = await fetch('/api/projects/');
            console.log('📡 DatabaseManager: Réponse reçue:', response.status);
            
            const data = await response.json();
            console.log('📋 DatabaseManager: Données reçues:', data);
            
            if (data.success) {
                this.projects = data.projects;
                console.log(`✅ DatabaseManager: ${data.projects.length} projets chargés`);
                return { success: true, projects: data.projects };
            } else {
                console.error('❌ DatabaseManager: Erreur dans la réponse:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('❌ DatabaseManager: Erreur lors du chargement des projets:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    async loadProjectDetail(projectId) {
        try {
            console.log('🔄 DatabaseManager: Chargement du projet', projectId);
            
            const response = await fetch(`/api/projects/${projectId}/`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ DatabaseManager: Projet chargé:', data.project);
                return { success: true, project: data.project };
            } else {
                console.error('❌ DatabaseManager: Erreur lors du chargement du projet:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('❌ DatabaseManager: Erreur lors du chargement du projet:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    async loadStats() {
        try {
            console.log('🔄 DatabaseManager: Chargement des statistiques...');
            
            const response = await fetch('/api/projects/stats/');
            console.log('📡 DatabaseManager: Réponse stats reçue:', response.status);
            
            const data = await response.json();
            console.log('📊 DatabaseManager: Statistiques reçues:', data);
            
            if (data.success) {
                this.stats = data.stats;
                console.log('✅ DatabaseManager: Statistiques chargées');
                return { success: true, stats: data.stats };
            } else {
                console.error('❌ DatabaseManager: Erreur dans les statistiques:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('❌ DatabaseManager: Erreur lors du chargement des statistiques:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    async searchProjects(query, status = '', date = '') {
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (status) params.append('status', status);
            if (date) params.append('date', date);

            const response = await fetch(`/api/projects/search/?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                return { success: true, projects: data.projects };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    async updateProjectStatus(projectId, status, comment = '') {
        try {
            const response = await fetch(`/api/projects/${projectId}/status/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({ status, comment })
            });

            const data = await response.json();
            
            if (data.success) {
                // Mettre à jour le projet localement
                const projectIndex = this.projects.findIndex(p => p.id === projectId);
                if (projectIndex !== -1) {
                    this.projects[projectIndex].status = status;
                    this.projects[projectIndex].adminComment = comment;
                }
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    // Méthodes utilitaires
    getCSRFToken() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Aujourd\'hui';
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
        return this.formatDate(dateString);
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'En attente',
            'accepted': 'Accepté',
            'rejected': 'Rejeté',
            'in-progress': 'En cours'
        };
        return statusMap[status] || status;
    }

    getStatusColor(status) {
        const colorMap = {
            'pending': 'warning',
            'accepted': 'success',
            'rejected': 'error',
            'in-progress': 'info'
        };
        return colorMap[status] || 'default';
    }

    getFileIcon(fileType) {
        const iconMap = {
            'pdf': '📄',
            'document': '📝',
            'image': '🖼️',
            'video': '🎥',
            'archive': '📦',
            'code': '💻',
            'design': '🎨'
        };
        return iconMap[fileType] || '📄';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Méthodes pour les statistiques
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

    getRecentProjects(limit = 5) {
        return this.projects
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // Méthodes de filtrage
    filterProjectsByStatus(status) {
        if (!status) return this.projects;
        return this.projects.filter(project => project.status === status);
    }

    filterProjectsByDate(dateRange) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return this.projects.filter(project => {
            const projectDate = new Date(project.date);
            
            switch (dateRange) {
                case 'today':
                    return projectDate >= today;
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return projectDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return projectDate >= monthAgo;
                default:
                    return true;
            }
        });
    }

    // Méthodes pour les graphiques
    getChartData() {
        const statusCounts = {
            'En attente': this.projects.filter(p => p.status === 'pending').length,
            'Accepté': this.projects.filter(p => p.status === 'accepted').length,
            'Rejeté': this.projects.filter(p => p.status === 'rejected').length,
            'En cours': this.projects.filter(p => p.status === 'in-progress').length
        };

        return {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#F59E0B', // warning
                    '#10B981', // success
                    '#EF4444', // error
                    '#3B82F6'  // info
                ]
            }]
        };
    }

    getMonthlyChartData() {
        // Grouper les projets par mois
        const monthlyData = {};
        
        this.projects.forEach(project => {
            const date = new Date(project.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = 0;
            }
            monthlyData[monthKey]++;
        });

        // Trier par mois
        const sortedMonths = Object.keys(monthlyData).sort();
        
        return {
            labels: sortedMonths.map(month => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            }),
            datasets: [{
                label: 'Projets soumis',
                data: sortedMonths.map(month => monthlyData[month]),
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        };
    }
}

// Instance globale
window.databaseManager = new DatabaseManager();