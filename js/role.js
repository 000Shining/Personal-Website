/* === Role Management === */
(function() {
  window.getRole = function() {
    return localStorage.getItem('userRole') || 'visitor';
  };

  window.setRole = function(role) {
    localStorage.setItem('userRole', role);
  };

  window.clearRole = function() {
    localStorage.removeItem('userRole');
  };

  window.requireRole = function(requiredRole) {
    if (window.getRole() !== requiredRole) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  };
})();
