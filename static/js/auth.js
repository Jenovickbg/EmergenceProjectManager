// Gestionnaire d'authentification
class AuthManager {
    constructor() {
        this.users = this.getDefaultUsers();
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.initializeAuth();
    }

    getDefaultUsers() {
        return [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                name: 'Administrateur Principal',
                email: 'admin@emergence-sarl.com',
                role: 'admin',
                permissions: ['read', 'write', 'delete', 'manage'],
                lastLogin: null,
                isActive: true
            },
            {
                id: 2,
                username: 'manager',
                password: 'manager123',
                name: 'Manager Projets',
                email: 'manager@emergence-sarl.com',
                role: 'manager',
                permissions: ['read', 'write'],
                lastLogin: null,
                isActive: true
            },
            {
                id: 3,
                username: 'reviewer',
                password: 'reviewer123',
                name: 'Évaluateur',
                email: 'reviewer@emergence-sarl.com',
                role: 'reviewer',
                permissions: ['read'],
                lastLogin: null,
                isActive: true
            }
        ];
    }

    initializeAuth() {
        // Vérifier si l'utilisateur est déjà connecté
        const savedSession = localStorage.getItem('emergence_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                const now = Date.now();
                
                // Vérifier si la session n'a pas expiré
                if (session.expiresAt > now) {
                    this.currentUser = session.user;
                    this.extendSession();
                    return true;
                } else {
                    // Session expirée
                    this.clearSession();
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la session:', error);
                this.clearSession();
            }
        }
        return false;
    }

    async login(username, password) {
        return new Promise((resolve, reject) => {
            // Simuler un délai de connexion
            setTimeout(() => {
                const user = this.users.find(u => 
                    u.username === username && 
                    u.password === password && 
                    u.isActive
                );

                if (user) {
                    // Mettre à jour la dernière connexion
                    user.lastLogin = new Date().toISOString();
                    
                    // Créer une copie sans le mot de passe
                    const userSession = {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions,
                        lastLogin: user.lastLogin
                    };

                    this.currentUser = userSession;
                    this.createSession(userSession);
                    
                    resolve({
                        success: true,
                        user: userSession,
                        message: 'Connexion réussie'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Nom d\'utilisateur ou mot de passe incorrect'
                    });
                }
            }, 1000); // Simuler 1 seconde de chargement
        });
    }

    logout() {
        this.currentUser = null;
        this.clearSession();
    }

    createSession(user) {
        const session = {
            user: user,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.sessionTimeout
        };

        localStorage.setItem('emergence_session', JSON.stringify(session));
        
        // Programmer l'expiration automatique de la session
        this.scheduleSessionExpiration();
    }

    extendSession() {
        if (this.currentUser) {
            const session = {
                user: this.currentUser,
                createdAt: Date.now(),
                expiresAt: Date.now() + this.sessionTimeout
            };
            localStorage.setItem('emergence_session', JSON.stringify(session));
            this.scheduleSessionExpiration();
        }
    }

    clearSession() {
        localStorage.removeItem('emergence_session');
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
        }
    }

    scheduleSessionExpiration() {
        if (this.sessionTimeoutId) {
            clearTimeout(this.sessionTimeoutId);
        }

        this.sessionTimeoutId = setTimeout(() => {
            this.logout();
            this.onSessionExpired();
        }, this.sessionTimeout);
    }

    onSessionExpired() {
        // Callback appelé quand la session expire
        if (typeof window.onSessionExpired === 'function') {
            window.onSessionExpired();
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }

    getUserInitials(user = null) {
        const currentUser = user || this.currentUser;
        if (!currentUser || !currentUser.name) return 'U';
        
        const names = currentUser.name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return currentUser.name[0].toUpperCase();
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'admin': 'Administrateur',
            'manager': 'Manager',
            'reviewer': 'Évaluateur'
        };
        return roleNames[role] || role;
    }

    // Gestion de la sécurité
    validateSession() {
        const savedSession = localStorage.getItem('emergence_session');
        if (!savedSession) return false;

        try {
            const session = JSON.parse(savedSession);
            return session.expiresAt > Date.now();
        } catch (error) {
            return false;
        }
    }

    // Gestion des tentatives de connexion
    trackFailedAttempt(username) {
        const key = `failed_attempts_${username}`;
        const attempts = parseInt(localStorage.getItem(key) || '0');
        const newAttempts = attempts + 1;
        
        localStorage.setItem(key, newAttempts.toString());
        localStorage.setItem(`last_attempt_${username}`, Date.now().toString());
        
        // Bloquer temporairement après 5 tentatives
        if (newAttempts >= 5) {
            this.blockUser(username, 15 * 60 * 1000); // 15 minutes
        }
        
        return newAttempts;
    }

    clearFailedAttempts(username) {
        localStorage.removeItem(`failed_attempts_${username}`);
        localStorage.removeItem(`last_attempt_${username}`);
        localStorage.removeItem(`blocked_until_${username}`);
    }

    blockUser(username, duration) {
        const blockedUntil = Date.now() + duration;
        localStorage.setItem(`blocked_until_${username}`, blockedUntil.toString());
    }

    isUserBlocked(username) {
        const blockedUntil = localStorage.getItem(`blocked_until_${username}`);
        if (!blockedUntil) return false;
        
        const blockedUntilTime = parseInt(blockedUntil);
        if (Date.now() > blockedUntilTime) {
            // Le blocage a expiré
            this.clearFailedAttempts(username);
            return false;
        }
        
        return true;
    }

    getBlockedTimeRemaining(username) {
        const blockedUntil = localStorage.getItem(`blocked_until_${username}`);
        if (!blockedUntil) return 0;
        
        const remaining = parseInt(blockedUntil) - Date.now();
        return Math.max(0, remaining);
    }

    // Utilitaires de sécurité
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Logging des activités (simulation)
    logActivity(action, details = {}) {
        if (!this.currentUser) return;

        const logEntry = {
            timestamp: new Date().toISOString(),
            userId: this.currentUser.id,
            username: this.currentUser.username,
            action: action,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'xxx.xxx.xxx.xxx' // En production, obtenir la vraie IP
        };

        // En production, envoyer vers un service de logging
        console.log('Activity Log:', logEntry);
        
        // Sauvegarder localement pour la démo
        const logs = JSON.parse(localStorage.getItem('emergence_activity_logs') || '[]');
        logs.push(logEntry);
        
        // Garder seulement les 100 dernières entrées
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('emergence_activity_logs', JSON.stringify(logs));
    }

    getActivityLogs(limit = 50) {
        const logs = JSON.parse(localStorage.getItem('emergence_activity_logs') || '[]');
        return logs.slice(-limit).reverse();
    }
}

// Instance globale du gestionnaire d'authentification
window.authManager = new AuthManager();

// Gérer l'expiration de session
window.onSessionExpired = function() {
    // Afficher une notification
    if (window.app && window.app.showToast) {
        window.app.showToast('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
    }
    
    // Rediriger vers la page de connexion après un délai
    setTimeout(() => {
        if (window.app && window.app.showLoginPage) {
            window.app.showLoginPage();
        }
    }, 3000);
};