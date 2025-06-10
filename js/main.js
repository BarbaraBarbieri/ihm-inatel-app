document.addEventListener('DOMContentLoaded', () => {
  const createLoadingScreen = () => {
    const loading = document.createElement('div');
    loading.id = 'loading-screen';
    loading.className = 'loading-screen';
    loading.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando Academic Hub...</p>
      </div>
    `;
    document.body.appendChild(loading);
    return loading;
  };

  const removeLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(loadingScreen)) {
          document.body.removeChild(loadingScreen);
        }
      }, 500);
    }
  };

  const loadingScreen = createLoadingScreen();

  const initApp = async () => {
    try {
      const dataLoaded = await dataManager.init();

      if (!dataLoaded) {
        throw new Error('Failed to load data');
      }

      window.router = new Router();

      window.app = new App();

      removeLoadingScreen();

      setTimeout(() => {
        utils.showToast('Bem-vindo ao Academic Hub!', 'success');
      }, 500);

    } catch (error) {
      console.error('Error initializing application:', error);

      const loadingText = document.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = 'Erro ao carregar dados. Por favor, recarregue a página.';
        loadingText.style.color = 'red';
      }

      const loadingContainer = document.querySelector('.loading-container');
      if (loadingContainer) {
        const retryButton = document.createElement('button');
        retryButton.className = 'btn btn-primary';
        retryButton.textContent = 'Tentar novamente';
        retryButton.addEventListener('click', () => window.location.reload());
        loadingContainer.appendChild(retryButton);
      }
    }
  };

  setTimeout(initApp, 500);
});