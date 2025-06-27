document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');

    sidebar.addEventListener('mouseenter', function () {
        sidebar.classList.add('expanded');
    });

    sidebar.addEventListener('mouseleave', function () {
        sidebar.classList.remove('expanded');
    });
    
    // Adicionar event listener para o botão de perfil do usuário
    const userProfileButton = document.getElementById('userProfileButton');
    if (userProfileButton) {
        userProfileButton.addEventListener('click', function() {
            // Usar a função openGenericModal diretamente
            const modal = document.getElementById('userModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                
                // Focar no primeiro elemento focável do modal
                const focusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElement) {
                    focusableElement.focus();
                }
            }
        });
    }
});
