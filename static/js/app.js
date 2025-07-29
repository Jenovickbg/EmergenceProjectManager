// Application principale
class EmergenceApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentProject = null;
        this.charts = {};
        this.isMobile = window.innerWidth <= 768;
        
        this.initializeApp();
        this.bindEvents();
        this.setupResponsive();
    }

    initializeApp() {
        // Vérifier si l'utilisateur est connecté
        if (window.databaseManager && window.databaseManager.currentUser) {
            this.showMainApp();
            this.loadDashboard();
        } else {
            this.showLoginPage();
        }
    }

    bindEvents() {
        // Événements de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Menu mobile
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Recherche et filtres
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e.target.value));
        }

        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => this.handleDateFilter(e.target.value));
        }

        // Modal
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Évaluation de projet
        const submitEvaluation = document.getElementById('submitEvaluation');
        if (submitEvaluation) {
            submitEvaluation.addEventListener('click', () => this.handleEvaluation());
        }

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Activité utilisateur pour étendre la session
        document.addEventListener('click', () => this.extendSession());
        document.addEventListener('keypress', () => this.extendSession());
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.updateChartsSize();
        });
    }

    // Gestion de l'authentification
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        console.log('🔐 Tentative de connexion pour:', username);
        
        try {
            const result = await window.databaseManager.login(username, password);
            console.log('🔐 Résultat de la connexion:', result);
            
            if (result.success) {
                console.log('✅ Connexion réussie');
                this.showMainApp();
                this.updateUserInfo();
                this.loadDashboard();
                this.showToast('Connexion réussie', 'success');
            } else {
                console.error('❌ Échec de la connexion:', result.error);
                this.showToast(result.error || 'Identifiants incorrects', 'error');
            }
        } catch (error) {
            console.error('❌ Erreur lors de la connexion:', error);
            this.showToast('Erreur de connexion', 'error');
        }
    }

    async handleLogout() {
        console.log('🚪 Déconnexion...');
        
        try {
            const result = await window.databaseManager.logout();
            console.log('🚪 Résultat de la déconnexion:', result);
            
            if (result.success) {
                this.showLoginPage();
                this.showToast('Déconnexion réussie', 'success');
            }
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        }
    }

    extendSession() {
        // Étendre la session utilisateur
        if (window.databaseManager && window.databaseManager.currentUser) {
            window.databaseManager.extendSession();
        }
    }

    // Gestion des vues
    showLoginPage() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        this.updateUserInfo();
    }

    updateUserInfo() {
        const user = window.databaseManager.currentUser;
        if (user) {
            const userNameElement = document.getElementById('userName');
            const userInitialsElement = document.getElementById('userInitials');
            
            if (userNameElement) {
                userNameElement.textContent = user.username || 'Administrateur';
            }
            
            if (userInitialsElement) {
                const initials = (user.username || 'AD').substring(0, 2).toUpperCase();
                userInitialsElement.textContent = initials;
            }
        }
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
            this.navigateToPage(page);
    }

    navigateToPage(page) {
        // Mettre à jour la navigation active
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Masquer toutes les pages
        document.querySelectorAll('.page').forEach(pageElement => {
            pageElement.classList.remove('active');
        });

        // Afficher la page sélectionnée
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Mettre à jour le titre
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
        const titles = {
                'dashboard': 'Tableau de bord',
                'projects': 'Projets',
                'analytics': 'Statistiques'
            };
            pageTitle.textContent = titles[page] || 'Page';
        }
        
        this.currentPage = page;
        this.loadPageContent(page);
    }

    async loadPageContent(page) {
        switch (page) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    // Gestion du menu mobile
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-open');
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('mobile-open');
    }

    async loadDashboard() {
        try {
            console.log('🔄 Chargement du dashboard...');
            
            // Charger les statistiques
            const statsResult = await window.databaseManager.loadStats();
            console.log('📊 Résultat des statistiques:', statsResult);
            
            if (statsResult.success) {
                this.updateDashboardStats(statsResult.stats);
                this.loadRecentProjects(statsResult.stats.recent_projects);
            } else {
                console.error('❌ Erreur lors du chargement des statistiques:', statsResult.error);
            }
            
            // Charger les projets pour les graphiques
            const projectsResult = await window.databaseManager.loadProjects();
            console.log('📋 Résultat des projets:', projectsResult);
            
            if (projectsResult.success) {
                this.createProjectsChart();
            } else {
                console.error('❌ Erreur lors du chargement des projets:', projectsResult.error);
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement du dashboard:', error);
            this.showToast('Erreur lors du chargement des données', 'error');
        }
    }

    updateDashboardStats(stats) {
        console.log('📈 Mise à jour des statistiques:', stats);
        
        // Mettre à jour les compteurs
        const elements = {
            'pending': document.getElementById('pendingCount'),
            'accepted': document.getElementById('acceptedCount'),
            'rejected': document.getElementById('rejectedCount'),
            'total': document.getElementById('totalCount')
        };
        
        if (elements.pending) elements.pending.textContent = stats.pending || 0;
        if (elements.accepted) elements.accepted.textContent = stats.accepted || 0;
        if (elements.rejected) elements.rejected.textContent = stats.rejected || 0;
        if (elements.total) elements.total.textContent = stats.total || 0;
        
        console.log('✅ Statistiques mises à jour');
    }

    loadRecentProjects(recentProjects) {
        console.log('📝 Chargement des projets récents:', recentProjects);
        
        const container = document.getElementById('recentProjectsList');
        if (!container) {
            console.error('❌ Container recentProjectsList non trouvé');
            return;
        }
        
        container.innerHTML = '';
        
        if (recentProjects && recentProjects.length > 0) {
            recentProjects.forEach(project => {
                const projectElement = this.createProjectElement(project);
                container.appendChild(projectElement);
            });
            console.log(`✅ ${recentProjects.length} projets récents affichés`);
        } else {
            container.innerHTML = '<p class="no-data">Aucun projet récent</p>';
            console.log('ℹ️ Aucun projet récent à afficher');
        }
    }

    createProjectElement(project) {
        console.log('🏗️ Création d\'élément projet:', project);
        
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
                <div class="project-info">
                    <h4>${project.name}</h4>
                <p>${project.author}</p>
                </div>
                <div class="project-meta">
                <span class="status-badge ${project.status}">${window.databaseManager.getStatusText(project.status)}</span>
                <span class="project-date">${window.databaseManager.getRelativeDate(project.date)}</span>
            </div>
        `;
        
        div.addEventListener('click', () => this.showProjectDetails(project.id));
        return div;
    }

    async loadProjects(filters = {}) {
        try {
            console.log('🔄 Chargement des projets avec filtres:', filters);
            
            const result = await window.databaseManager.loadProjects();
            console.log('📋 Résultat du chargement des projets:', result);
            
            if (result.success) {
                this.renderProjectsTable(result.projects);
            } else {
                console.error('❌ Erreur lors du chargement des projets:', result.error);
                this.showToast('Erreur lors du chargement des projets', 'error');
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des projets:', error);
            this.showToast('Erreur de connexion au serveur', 'error');
        }
    }

    renderProjectsTable(projects) {
        console.log('📊 Rendu du tableau des projets:', projects);
        
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) {
            console.error('❌ Element projectsTableBody non trouvé');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (projects && projects.length > 0) {
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="project-name">
                        <strong>${project.name}</strong>
                            <p>${project.description}</p>
                    </div>
                </td>
                    <td>${project.author}</td>
                    <td>${window.databaseManager.formatDate(project.date)}</td>
                <td>
                    <span class="status-badge ${project.status}">
                            ${window.databaseManager.getStatusText(project.status)}
                    </span>
                </td>
                <td>
                        <button class="action-btn" onclick="app.showProjectDetails(${project.id})">
                            Voir détails
                    </button>
                </td>
                `;
                tbody.appendChild(row);
            });
            console.log(`✅ ${projects.length} projets affichés dans le tableau`);
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Aucun projet trouvé</td></tr>';
            console.log('ℹ️ Aucun projet à afficher dans le tableau');
        }
    }

    async handleSearch(query) {
        try {
            const result = await window.databaseManager.searchProjects(query);
            if (result.success) {
                this.renderProjectsTable(result.projects);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    }

    async handleStatusFilter(status) {
        try {
            const result = await window.databaseManager.searchProjects('', status);
            if (result.success) {
                this.renderProjectsTable(result.projects);
            }
        } catch (error) {
            console.error('Erreur lors du filtrage:', error);
        }
    }

    async handleDateFilter(date) {
        try {
            const result = await window.databaseManager.searchProjects('', '', date);
            if (result.success) {
                this.renderProjectsTable(result.projects);
            }
        } catch (error) {
            console.error('Erreur lors du filtrage:', error);
        }
    }

    async showProjectDetails(projectId) {
        try {
            const result = await window.databaseManager.loadProjectDetail(projectId);
            if (result.success) {
                this.currentProject = result.project;
                this.populateProjectModal(result.project);
                this.showModal();
            } else {
                this.showToast('Erreur lors du chargement du projet', 'error');
            }
        } catch (error) {
            console.error('Erreur lors du chargement du projet:', error);
            this.showToast('Erreur de connexion au serveur', 'error');
        }
    }

    populateProjectModal(project) {
        // Remplir les champs du modal
        document.getElementById('modalProjectTitle').textContent = project.name;
        document.getElementById('modalProjectName').textContent = project.name;
        document.getElementById('modalProjectAuthor').textContent = project.author;
        document.getElementById('modalProjectDate').textContent = window.databaseManager.formatDate(project.date);
        document.getElementById('modalProjectDescription').textContent = project.description;
        
        // Statut
        const statusElement = document.getElementById('modalProjectStatus');
        statusElement.textContent = window.databaseManager.getStatusText(project.status);
        statusElement.className = `status-badge ${project.status}`;
        
        // Fichiers
        const filesContainer = document.getElementById('modalProjectFiles');
        filesContainer.innerHTML = '';
        
        if (project.files && project.files.length > 0) {
            project.files.forEach(file => {
                const fileElement = document.createElement('div');
                fileElement.className = 'file-item';
                fileElement.innerHTML = `
                    <span class="file-icon">${window.databaseManager.getFileIcon(file.type)}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${file.size}</span>
                `;
                filesContainer.appendChild(fileElement);
            });
        } else {
            filesContainer.innerHTML = '<p>Aucun fichier joint</p>';
        }
        
        // Commentaire admin
        const commentElement = document.getElementById('adminComment');
        if (commentElement) {
            commentElement.value = project.adminComment || '';
        }
        
        // Statut dans le select
        const statusSelect = document.getElementById('statusSelect');
        if (statusSelect) {
            statusSelect.value = project.status;
        }
    }

    showModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
        modal.classList.add('active');
        }
    }

    closeModal() {
        const modal = document.getElementById('projectModal');
        if (modal) {
        modal.classList.remove('active');
        this.currentProject = null;
        }
    }

    async handleEvaluation() {
        if (!this.currentProject) return;
        
        const statusSelect = document.getElementById('statusSelect');
        const commentTextarea = document.getElementById('adminComment');
        
        const newStatus = statusSelect.value;
        const comment = commentTextarea.value;
        
        try {
            const result = await window.databaseManager.updateProjectStatus(
            this.currentProject.id, 
            newStatus, 
            comment
        );
        
            if (result.success) {
                this.showToast('Statut mis à jour avec succès', 'success');
            this.closeModal();
                // Recharger les données
                await this.loadProjects();
                await this.loadDashboard();
            } else {
                this.showToast(result.error || 'Erreur lors de la mise à jour', 'error');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            this.showToast('Erreur de connexion au serveur', 'error');
        }
    }

    async loadAnalytics() {
        try {
            const result = await window.databaseManager.loadProjects();
            if (result.success) {
        this.createStatusChart();
        this.createMonthlyChart();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des analytics:', error);
        }
    }

    createProjectsChart() {
        const ctx = document.getElementById('projectsChart');
        if (!ctx) return;
        
        if (this.charts.projectsChart) {
            this.charts.projectsChart.destroy();
        }
        
        const chartData = window.databaseManager.getChartData();
        
        this.charts.projectsChart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;
        
        if (this.charts.statusChart) {
            this.charts.statusChart.destroy();
        }
        
        const chartData = window.databaseManager.getChartData();
        
        this.charts.statusChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;
        
        if (this.charts.monthlyChart) {
            this.charts.monthlyChart.destroy();
        }
        
        const chartData = window.databaseManager.getMonthlyChartData();
        
        this.charts.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateChartsSize() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    updateNotifications() {
        // Mettre à jour les notifications si nécessaire
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            const pendingCount = window.databaseManager.projects.filter(p => p.status === 'pending').length;
            badge.textContent = pendingCount;
            badge.style.display = pendingCount > 0 ? 'block' : 'none';
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageElement = toast.querySelector('.toast-message');
        const iconElement = toast.querySelector('.toast-icon');
        
        // Mettre à jour le message et l'icône
        messageElement.textContent = message;
        
        // Changer l'icône selon le type
        if (type === 'success') {
            iconElement.innerHTML = '<polyline points="20,6 9,17 4,12"/>';
        } else if (type === 'error') {
            iconElement.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
        } else {
            iconElement.innerHTML = '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>';
        }
        
        // Afficher le toast
        toast.classList.add('show');
        
        // Masquer après 3 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    getStatusText(status) {
        return window.databaseManager.getStatusText(status);
    }

    handleKeyboard(e) {
        // Raccourcis clavier
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.navigateToPage('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.navigateToPage('projects');
                    break;
                case '3':
                    e.preventDefault();
                    this.navigateToPage('analytics');
                    break;
                case 'Escape':
                    this.closeModal();
                    break;
            }
        }
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EmergenceApp();
});

// Gérer les erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
    if (window.app) {
        window.app.showToast('Une erreur inattendue s\'est produite', 'error');
    }
});

// Gérer la visibilité de la page pour étendre la session
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.databaseManager && window.databaseManager.currentUser) {
        if (window.databaseManager.extendSession) {
            window.databaseManager.extendSession();
        }
    }
});