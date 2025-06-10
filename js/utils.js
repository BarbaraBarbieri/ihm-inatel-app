const utils = {
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  formatDate: (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  },

  formatTime: (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  },

  truncateText: (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  showToast: (message, type = 'success', duration = 3000) => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    toast.offsetHeight;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';

      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  },

  updateCartCount: () => {
    const cartBadge = document.getElementById('cart-count');
    if (!cartBadge) return;

    const cartItems = dataManager.getCart();

    if (cartItems && cartItems.length > 0) {
      cartBadge.textContent = cartItems.length;
      cartBadge.style.display = 'inline-flex';
    } else {
      cartBadge.style.display = 'none';
    }
  },

  fixCartIssues: () => {
    utils.updateCartCount();

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      const newBtn = cartBtn.cloneNode(true);
      cartBtn.parentNode.replaceChild(newBtn, cartBtn);

      newBtn.addEventListener('click', function () {
        router.navigate('cart');
      });
    }

    if (window.dataManager) {
      const cart = dataManager.getCart();

      const uniqueIds = new Set();
      const cleanCart = cart.filter(item => {
        if (uniqueIds.has(item.id)) {
          return false;
        }
        uniqueIds.add(item.id);
        return true;
      });

      if (cleanCart.length !== cart.length) {
        dataManager.setCart(cleanCart);
        utils.showToast('Itens duplicados foram removidos do carrinho', 'info');
      }
    }
  },

  fixMyMaterialsPageIssues: () => {
    if (window.dataManager) {
      const user = dataManager.getCurrentUser();
      const purchasedMaterials = dataManager.getPurchasedMaterials(user.id);

      if (!purchasedMaterials || purchasedMaterials.length === 0) {
        dataManager.loadPurchasedMaterialsFromStorage(user.id);

        const reloadedMaterials = dataManager.getPurchasedMaterials(user.id);
        if (reloadedMaterials && reloadedMaterials.length > 0) {
          utils.showToast('Materiais adquiridos foram recarregados', 'info');
        }
      }
    }
  },

  validateForm: (form) => {
    let isValid = true;

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    const emailFields = form.querySelectorAll('[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailFields.forEach(field => {
      if (field.value && !emailRegex.test(field.value)) {
        field.classList.add('is-invalid');
        isValid = false;
      }
    });

    return isValid;
  }
};

window.utils = utils;