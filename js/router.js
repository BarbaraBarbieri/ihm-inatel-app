class Router {
  constructor() {
    this.routes = {
      home: () => this.renderHome(),
      materials: () => this.renderMaterials(),
      mentorships: () => this.renderMentorships(),
      'my-materials': () => this.renderMyMaterials(),
      'my-schedule': () => this.renderMySchedule(),
      cart: () => this.renderCart(),
      payment: () => this.renderPayment(),
      profile: () => this.renderProfile(),
      material: (id) => this.renderMaterialDetail(id),
      mentor: (id) => this.renderMentorDetail(id),
    };

    this.currentPage = 'home';
    this.pageContent = document.getElementById('page-content');
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [page, id] = hash.split('/');

    this.currentPage = page;
    this.updateNavigation();

    try {
      if (this.routes[page]) {
        this.routes[page](id);

        utils.updateCartCount();
      } else {
        this.renderNotFound();
      }
    } catch (error) {
      console.error(`Error rendering page ${page}:`, error);
      this.renderError();
    }
  }

  navigate(page, id = null) {
    window.location.hash = id ? `${page}/${id}` : page;
  }

  updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('data-page');

      if (linkPage === this.currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  renderHome() {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderHome(), 500);
      return;
    }

    const featuredMaterials = dataManager.getFeaturedMaterials(8);
    const featuredMentors = dataManager.getFeaturedMentors(8);

    this.pageContent.innerHTML = pageTemplates.home(featuredMaterials, featuredMentors);

    this.setupMaterialCardListeners();
    this.setupMentorCardListeners();

    this.initializeCarousel();
  }

  initializeCarousel() {
    const carousel = document.getElementById('materials-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prevBtn = carousel.querySelector('#carousel-prev');
    const nextBtn = carousel.querySelector('#carousel-next');

    if (!track || !items.length) return;

    let currentIndex = 0;

    const scrollToItem = (index) => {
      if (index < 0) index = 0;
      if (index >= items.length) index = items.length - 1;

      currentIndex = index;

      indicators.forEach((indicator, i) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });

      items[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        scrollToItem(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        scrollToItem(currentIndex - 1);
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        scrollToItem(index);
      });
    });

    if (track) {
      track.addEventListener('scroll', utils.debounce(() => {
        const scrollPosition = track.scrollLeft;
        const itemWidth = items[0].offsetWidth;
        const currentItemIndex = Math.round(scrollPosition / itemWidth);

        indicators.forEach((indicator, i) => {
          if (i === currentItemIndex) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });

        currentIndex = currentItemIndex;
      }, 100));
    }
  }

  renderMaterials() {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMaterials(), 500);
      return;
    }

    const materials = dataManager.getMaterials();

    this.pageContent.innerHTML = pageTemplates.materials(materials);

    this.setupMaterialCardListeners();
    this.setupMaterialFilters();
  }

  renderMaterialDetail(id) {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMaterialDetail(id), 500);
      return;
    }

    const material = dataManager.getMaterialById(parseInt(id));

    if (!material) {
      this.renderNotFound();
      return;
    }

    this.pageContent.innerHTML = pageTemplates.materialDetail(material);

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const cart = dataManager.getCart();
        const exists = cart.some(item => item.id === material.id && item.type === 'material');

        if (exists) {
          utils.showToast('Este material já está no carrinho', 'warning');
        } else {
          const success = dataManager.addToCart({
            ...material,
            type: 'material'
          });

          if (success) {
            utils.showToast('Material adicionado ao carrinho', 'success');
            utils.updateCartCount();

            addToCartBtn.disabled = true;
            addToCartBtn.textContent = 'Adicionado';
          }
        }
      });
    }

    const backButton = document.querySelector('.material-detail-back');
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
      });
    }
  }

  renderMentorships() {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMentorships(), 500);
      return;
    }

    const mentors = dataManager.getMentors();

    this.pageContent.innerHTML = pageTemplates.mentorships(mentors);

    this.setupMentorCardListeners();
    this.setupMentorFilters();
  }

  renderMentorDetail(id) {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMentorDetail(id), 500);
      return;
    }

    const mentor = dataManager.getMentorById(parseInt(id));

    if (!mentor) {
      this.renderNotFound();
      return;
    }

    this.pageContent.innerHTML = pageTemplates.mentorDetail(mentor);
    const scheduleBtn = document.getElementById('schedule-btn');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        this.showSchedulingModal(mentor);
      });
    }

    const backButton = document.querySelector('.mentor-detail-back');
    if (backButton) {
      backButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
      });
    }
  }

  renderMyMaterials() {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMyMaterials(), 500);
      return;
    }

    const user = dataManager.getCurrentUser();
    const purchasedMaterials = dataManager.getPurchasedMaterials(user.id);

    utils.fixMyMaterialsPageIssues();

    this.pageContent.innerHTML = pageTemplates.myMaterials(purchasedMaterials);
  }

  renderMySchedule() {
    if (!this.pageContent) return;

    if (!dataManager.dataLoaded) {
      this.renderLoading();
      setTimeout(() => this.renderMySchedule(), 500);
      return;
    }

    const user = dataManager.getCurrentUser();
    let schedule = dataManager.getUserSchedule(user.id);

    try {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);
        if (parsedAppointments && parsedAppointments.length) {
          schedule = [...schedule, ...parsedAppointments.filter(app =>
            !schedule.some(s => s.mentorId === app.mentorId &&
              s.date === app.date &&
              s.time === app.time)
          )];
        }
      }
    } catch (e) {
      console.error('Error loading saved appointments:', e);
    }

    this.pageContent.innerHTML = pageTemplates.mySchedule(schedule);

    document.querySelectorAll('.join-session-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        utils.showToast('Entrando na sessão de mentoria...', 'info');
      });
    });

    document.querySelectorAll('.reschedule-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const appointment = schedule.find(a => a.id == id);
        if (appointment) {
          const mentor = dataManager.getMentorById(appointment.mentorId);
          if (mentor) {
            this.showSchedulingModal(mentor);
          } else {
            utils.showToast('Mentor não encontrado', 'error');
          }
        }
      });
    });

    document.querySelectorAll('.review-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        utils.showToast('Funcionalidade de avaliação em desenvolvimento', 'info');
      });
    });

    document.querySelectorAll('.schedule-again-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mentorId = btn.dataset.mentorId;
        window.location.hash = `#mentor/${mentorId}`;
      });
    });
  }

  renderCart() {
    if (!this.pageContent) return;

    const cart = dataManager.getCart();

    utils.fixCartIssues();

    this.pageContent.innerHTML = pageTemplates.cart(cart);

    this.setupCartItemListeners();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn && cart.length > 0) {
      checkoutBtn.addEventListener('click', () => {
        this.navigate('payment');
      });
    }
  }

  renderPayment() {
    if (!this.pageContent) return;

    const cart = dataManager.getCart();

    if (cart.length === 0) {
      this.navigate('cart');
      return;
    }

    this.pageContent.innerHTML = pageTemplates.payment(cart);

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const success = dataManager.processPurchase();
        if (success) {
          utils.showToast('Pagamento processado com sucesso!', 'success');

          setTimeout(() => {
            this.navigate('my-materials');
          }, 2000);
        } else {
          utils.showToast('Erro ao processar pagamento', 'error');
        }
      });

      const paymentMethodRadios = document.querySelectorAll('[name="payment-method"]');
      const creditCardFields = document.getElementById('credit-card-fields');
      const pixFields = document.getElementById('pix-fields');
      const boletoFields = document.getElementById('boleto-fields');
      const paymentMethodItems = document.querySelectorAll('.payment-method-item');

      paymentMethodItems.forEach(item => {
        item.addEventListener('click', () => {
          const radio = item.querySelector('input[type="radio"]');
          if (radio) {
            radio.checked = true;

            const event = new Event('change');
            radio.dispatchEvent(event);
          }
        });
      });

      paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          paymentMethodItems.forEach(item => {
            if (item.contains(radio)) {
              item.classList.add('selected');
            } else {
              item.classList.remove('selected');
            }
          });

          switch (radio.value) {
            case 'credit-card':
              creditCardFields.style.display = 'block';
              pixFields.style.display = 'none';
              boletoFields.style.display = 'none';

              document.querySelectorAll('#credit-card-fields input[required]').forEach(input => {
                input.setAttribute('required', 'required');
              });
              break;

            case 'pix':
              creditCardFields.style.display = 'none';
              pixFields.style.display = 'block';
              boletoFields.style.display = 'none';

              document.querySelectorAll('#credit-card-fields input[required]').forEach(input => {
                input.removeAttribute('required');
              });
              break;

            case 'boleto':
              creditCardFields.style.display = 'none';
              pixFields.style.display = 'none';
              boletoFields.style.display = 'block';

              document.querySelectorAll('#credit-card-fields input[required]').forEach(input => {
                input.removeAttribute('required');
              });
              break;
          }
        });
      });

      const generateBoletoBtn = document.getElementById('generate-boleto-btn');
      if (generateBoletoBtn) {
        generateBoletoBtn.addEventListener('click', () => {
          utils.showToast('Boleto gerado com sucesso!', 'success');
        });
      }
    }
  }

  renderProfile() {
    if (!this.pageContent) return;

    const user = dataManager.getCurrentUser();

    this.pageContent.innerHTML = pageTemplates.profile(user);
  }

  renderLoading() {
    if (!this.pageContent) return;

    this.pageContent.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Carregando...</p>
      </div>
    `;
  }

  renderError() {
    if (!this.pageContent) return;

    this.pageContent.innerHTML = `
      <div class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h2 class="error-title">Algo deu errado!</h2>
        <p class="error-message">
          Não foi possível carregar o conteúdo da página.
        </p>
        <button class="btn btn-primary" onclick="window.location.reload()">
          <i class="fas fa-sync-alt"></i> Tentar novamente
        </button>
      </div>
    `;
  }

  renderNotFound() {
    if (!this.pageContent) return;

    this.pageContent.innerHTML = `
      <div class="error-container">
        <div class="error-icon">
          <i class="fas fa-search"></i>
        </div>
        <h2 class="error-title">Página não encontrada</h2>
        <p class="error-message">
          A página que você está procurando não existe ou foi removida.
        </p>
        <a href="#home" class="btn btn-primary">
          <i class="fas fa-home"></i> Voltar para a página inicial
        </a>
      </div>
    `;
  }

  setupMaterialCardListeners() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const materialId = parseInt(btn.getAttribute('data-id'));
        const material = dataManager.getMaterialById(materialId);

        if (material) {
          const cart = dataManager.getCart();
          const exists = cart.some(item => item.id === materialId && item.type === 'material');

          if (exists) {
            utils.showToast('Este material já está no carrinho', 'warning');
          } else {
            const success = dataManager.addToCart({
              ...material,
              type: 'material'
            });

            if (success) {
              utils.showToast('Material adicionado ao carrinho', 'success');
              utils.updateCartCount();

              btn.textContent = 'Adicionado';
              btn.disabled = true;

              setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
                btn.disabled = false;
              }, 2000);
            }
          }
        }
      });
    });
  }

  setupMaterialFilters() {
    const searchInput = document.getElementById('material-search');
    const categorySelect = document.getElementById('material-category');
    const applyFilterBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');

    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categorySelect ? categorySelect.value : '';

        const materialCards = document.querySelectorAll('.material-card');

        materialCards.forEach(card => {
          const title = card.querySelector('.material-title').textContent.toLowerCase();
          const cardCategory = card.querySelector('.badge-primary').textContent;

          const matchesSearch = !searchTerm || title.includes(searchTerm);
          const matchesCategory = !category || cardCategory === category;

          if (matchesSearch && matchesCategory) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';

        document.querySelectorAll('.material-card').forEach(card => {
          card.style.display = '';
        });
      });
    }
  }

  setupMentorCardListeners() {
  }

  setupMentorFilters() {
    const searchInput = document.getElementById('mentor-search');
    const specialtySelect = document.getElementById('mentor-specialty');
    const applyFilterBtn = document.getElementById('apply-mentor-filters');
    const clearFiltersBtn = document.getElementById('clear-mentor-filters');

    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const specialty = specialtySelect ? specialtySelect.value : '';

        const mentorCards = document.querySelectorAll('.mentor-card');

        mentorCards.forEach(card => {
          const name = card.querySelector('.mentor-name').textContent.toLowerCase();
          const mentorSpecialty = card.querySelector('.mentor-specialty').textContent;

          const matchesSearch = !searchTerm || name.includes(searchTerm);
          const matchesSpecialty = !specialty || mentorSpecialty.includes(specialty);

          if (matchesSearch && matchesSpecialty) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (specialtySelect) specialtySelect.value = '';

        document.querySelectorAll('.mentor-card').forEach(card => {
          card.style.display = '';
        });
      });
    }
  }

  setupCartItemListeners() {
    const removeButtons = document.querySelectorAll('.remove-from-cart-btn');

    removeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt(btn.getAttribute('data-id'));
        const itemType = btn.getAttribute('data-type');

        const success = dataManager.removeFromCart(itemId, itemType);

        if (success) {
          const cartItem = btn.closest('.cart-item');
          if (cartItem) {
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-30px)';

            setTimeout(() => {
              cartItem.remove();

              utils.updateCartCount();

              const cart = dataManager.getCart();
              if (cart.length === 0) {
                this.renderCart();
              } else {
                this.updateCartSummary();
              }

              utils.showToast('Item removido do carrinho', 'info');
            }, 300);
          }
        }
      });
    });
  }

  updateCartSummary() {
    const cart = dataManager.getCart();
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxesElement = document.getElementById('cart-taxes');
    const totalElement = document.getElementById('cart-total');

    if (subtotalElement && taxesElement && totalElement) {
      const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

      const taxes = subtotal * 0.1;

      subtotalElement.textContent = utils.formatCurrency(subtotal);
      taxesElement.textContent = utils.formatCurrency(taxes);
      totalElement.textContent = utils.formatCurrency(subtotal + taxes);
    }
  }

  showSchedulingModal(mentor) {
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      modalContainer.className = 'modal-overlay';
      document.body.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Agendar Mentoria</h2>
          <button class="modal-close" id="close-modal">&times;</button>
        </div>
        <div class="modal-content">
          ${pageTemplates.schedulingModal(mentor)}
        </div>
      </div>
    `;

    setTimeout(() => {
      modalContainer.classList.add('active');
    }, 10);

    const closeBtn = document.getElementById('close-modal');
    const modalEl = modalContainer.querySelector('.modal');

    closeBtn.addEventListener('click', () => {
      modalContainer.classList.remove('active');
    });

    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        modalContainer.classList.remove('active');
      }
    });

    const cancelBtn = document.getElementById('schedule-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        modalContainer.classList.remove('active');
      });
    }

    mentorScheduling.init(mentor);
  }
}

window.Router = Router;