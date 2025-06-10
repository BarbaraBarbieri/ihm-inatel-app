class App {
  constructor() {
    this.init();
  }

  async init() {
    this.initializeNavigation();
    utils.updateCartCount();

    window.addEventListener('resize', this.handleResize.bind(this));

    this.handleResize();
    this.initializeGlobalHandlers();
  }

  initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const cartBtn = document.getElementById('cart-btn');
    const profileBtn = document.getElementById('profile-btn');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }

    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        router.navigate('cart');
      });
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        router.navigate('profile');
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-page]')) {
        e.preventDefault();
        const page = e.target.dataset.page;
        router.navigate(page);

        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  }

  handleResize() {
    const navMenu = document.getElementById('nav-menu');

    if (navMenu && window.innerWidth > 768) {
      navMenu.classList.remove('active');
    }

    if (window.innerWidth < 576) {
      document.body.classList.add('mobile');
      document.body.classList.remove('tablet', 'desktop');
    } else if (window.innerWidth < 992) {
      document.body.classList.add('tablet');
      document.body.classList.remove('mobile', 'desktop');
    } else {
      document.body.classList.add('desktop');
      document.body.classList.remove('mobile', 'tablet');
    }
  }

  initializeGlobalHandlers() {
    utils.fixCartIssues();

    document.addEventListener('click', (e) => {
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');

      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          navMenu.classList.remove('active');
        }
      }
    });

    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error || e.message);
      utils.showToast('Ocorreu um erro na aplicação', 'error');
    });

    window.addEventListener('online', () => {
      utils.showToast('Conexão restabelecida', 'success');
    });

    window.addEventListener('offline', () => {
      utils.showToast('Sem conexão com a internet', 'warning');
    });
  }
}

window.App = App;