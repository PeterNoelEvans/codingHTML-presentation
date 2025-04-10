// Browser-compatible module definition
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof module === 'object') {
        // CommonJS
        const schoolConfig = require('../config/schools');
        module.exports = factory(schoolConfig);
    } else {
        // Browser globals
        root.PathManager = factory(root.schoolConfig || {
            schools: [],
            getSchool: () => null,
            getClass: () => null
        });
    }
}(typeof self !== 'undefined' ? self : this, function(schoolConfig) {
    class PathManager {
        static formatUsername(username) {
            // If already in correct format, return as is but ensure proper capitalization
            if (username.match(/^[A-Za-z]+_\d+_\d{3}$/)) {
                const [name, number, suffix] = username.split('_');
                return `${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}_${number}_${suffix}`;
            }
            
            // Extract name and number
            const matches = username.match(/^([A-Za-z]+)(\d+)$/i);
            if (!matches) {
                throw new Error('Invalid username format. Must be either Nickname42 or Nickname_42_001');
            }
            
            const [, name, number] = matches;
            // Capitalize first letter, rest lowercase
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            return `${formattedName}_${number}_001`;
        }

        static getPortfolioPath(schoolId, classId, username) {
            const formattedUsername = this.formatUsername(username);
            return `/portfolios/${schoolId}/classes/${classId}/${formattedUsername}/${formattedUsername}.html`;
        }

        static getAvatarPath(schoolId, classId, username) {
            const formattedUsername = this.formatUsername(username);
            return `/portfolios/${schoolId}/classes/${classId}/${formattedUsername}/images/${formattedUsername}.jpg`;
        }

        static getClassBasePath(schoolId, classId) {
            return `/portfolios/${schoolId}/classes/${classId}`;
        }

        static validatePath(path) {
            const parts = path.split('/');
            if (parts.length !== 7) {
                return false;
            }

            const [empty, portfolios, schoolId, classes, classId, username, file] = parts;
            return (
                empty === '' &&
                portfolios === 'portfolios' &&
                classes === 'classes' &&
                file === `${username}.html` &&
                // Updated regex to allow capital first letter
                username.match(/^[A-Z][a-z]*_\d+_\d{3}$/)
            );
        }
    }

    return PathManager;
})); 