const components = {
  materialsCarousel: (materials = []) => {
    if (!materials.length) return '';

    return `
      <div class="carousel-container" id="materials-carousel">
        <div class="carousel-controls">
          <button class="carousel-control prev" id="carousel-prev" aria-label="Anterior">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-control next" id="carousel-next" aria-label="Próximo">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="carousel-track">
          ${materials.map((material, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
              ${components.materialCard(material)}
            </div>
          `).join('')}
        </div>
        <div class="carousel-indicators">
          ${materials.map((_, index) => `
            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
              data-slide="${index}" aria-label="Slide ${index + 1}"></button>
          `).join('')}
        </div>
      </div>
    `;
  },

  mentorList: (mentors = []) => {
    if (!mentors.length) return '';

    return `
      <div class="mentor-list-container">
        <div class="mentor-list-scroll">
          ${mentors.map(mentor => `
            <div class="mentor-list-item">
              <div class="mentor-list-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="mentor-list-info">
                <h3 class="mentor-list-name">${mentor.name}</h3>
                <p class="mentor-list-specialty">${mentor.specialty}</p>
                <div class="rating small">
                  ${Array.from(
      { length: 5 },
      (_, i) =>
        `<i class="fas fa-star rating-star ${i < Math.floor(mentor.rating) ? "" : "empty"}"></i>`
    ).join("")}
                </div>
              </div>
              <a href="#mentor/${mentor.id}" class="btn btn-outline btn-sm mentor-list-btn">Ver perfil</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  materialCard: (material) => `
    <div class="material-card">
      <div class="material-image">
        <i class="fas fa-book"></i>
      </div>
      <div class="material-content">
        <h3 class="material-title">${material.title}</h3>
        <p class="material-author">por ${material.author}</p>
        <p class="material-description">${material.description}</p>
        <div class="material-meta">
          <div class="rating">
            ${Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fas fa-star rating-star ${i < Math.floor(material.rating) ? "" : "empty"}"></i>`
  ).join("")}
            <span>(${material.reviews || 0})</span>
          </div>
          <span class="badge badge-primary">${material.category}</span>
        </div>
        <div class="material-meta">
          <span class="material-price">${utils.formatCurrency(material.price)}</span>
          <span class="badge badge-secondary">${material.type}</span>
        </div>
        <div class="material-actions">
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${material.id}">
            <i class="fas fa-cart-plus"></i> Adicionar
          </button>
          <a href="#material/${material.id}" class="btn btn-outline btn-sm">
            <i class="fas fa-eye"></i> Ver
          </a>
        </div>
      </div>
    </div>
  `,

  mentorCard: (mentor) => `
    <div class="mentor-card">
      <div class="mentor-avatar">
        <i class="fas fa-user"></i>
      </div>
      <div class="mentor-content">
        <h3 class="mentor-name">${mentor.name}</h3>
        <p class="mentor-specialty">${mentor.specialty}</p>
        <p class="mentor-bio">${mentor.bio}</p>
        <div class="mentor-meta">
          <div class="rating">
            ${Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fas fa-star rating-star ${i < Math.floor(mentor.rating) ? "" : "empty"}"></i>`
  ).join("")}
            <span>(${mentor.reviews || 0})</span>
          </div>
          <span class="badge badge-primary">${mentor.subjects[0] || "Geral"}</span>
        </div>
        <div class="mentor-meta">
          <span class="mentor-rate">${utils.formatCurrency(mentor.hourlyRate)}/hora</span>
          <span>${mentor.subjects.length} assuntos</span>
        </div>
        <div class="mentor-actions">
          <a href="#mentor/${mentor.id}" class="btn btn-primary btn-sm">
            <i class="fas fa-calendar-alt"></i> Agendar
          </a>
          <a href="#mentor/${mentor.id}" class="btn btn-outline btn-sm">
            <i class="fas fa-eye"></i> Ver perfil
          </a>
        </div>
      </div>
    </div>
  `,

  cartItem: (item) => `
    <div class="cart-item">
      <div class="cart-info">
        <div class="cart-image">
          <i class="fas ${item.type === 'material' ? 'fa-book' : 'fa-user-clock'}"></i>
        </div>
        <div class="cart-details">
          <h3 class="cart-title">${item.title || item.name}</h3>
          <span class="cart-type">${item.type === 'material'
      ? `${item.type} - ${item.category}`
      : `Mentoria - ${item.specialty}`
    }</span>
          <div class="cart-price">${utils.formatCurrency(item.price || item.hourlyRate)}</div>
        </div>
      </div>
      <div class="cart-actions">
        <button class="btn btn-danger btn-sm remove-from-cart-btn" data-id="${item.id}" data-type="${item.type}">
          <i class="fas fa-trash"></i> Remover
        </button>
      </div>
    </div>
  `,

  myMaterialItem: (material) => `
    <div class="my-materials-item">
      <div class="my-materials-header">
        <h3 class="my-materials-title">${material.title}</h3>
        <span class="badge badge-secondary">${material.type}</span>
      </div>
      <p class="my-materials-meta">
        <span class="material-author">por ${material.author}</span>
        ${material.purchasedAt ?
      `<span class="material-purchased-date">Adquirido em ${utils.formatDate(material.purchasedAt)}</span>`
      : ''}
      </p>
      <div class="my-materials-actions">
        <button class="btn btn-primary btn-sm download-material-btn" data-id="${material.id}">
          <i class="fas fa-download"></i> Baixar
        </button>
        <button class="btn btn-outline btn-sm view-material-btn" data-id="${material.id}">
          <i class="fas fa-eye"></i> Visualizar
        </button>
      </div>
    </div>
  `,

  scheduleItem: (session) => `
    <div class="schedule-item">
      <div class="schedule-header">
        <h3 class="schedule-title">Mentoria com ${session.mentorName}</h3>
        <span class="badge ${session.status === 'scheduled' ? 'badge-primary' :
      session.status === 'completed' ? 'badge-secondary' : 'badge-warning'
    }">${session.status === 'scheduled' ? 'Agendado' :
      session.status === 'completed' ? 'Concluído' : 'Pendente'
    }</span>
      </div>
      <p class="schedule-details">
        <i class="fas fa-calendar"></i> ${utils.formatDate(session.date)}
        <i class="fas fa-clock"></i> ${utils.formatTime(session.time)}
      </p>
      <div class="schedule-actions">
        ${session.status === 'scheduled' ? `
          <button class="btn btn-primary btn-sm join-session-btn" data-id="${session.id}">
            <i class="fas fa-video"></i> Entrar
          </button>
          <button class="btn btn-outline btn-sm reschedule-btn" data-id="${session.id}">
            <i class="fas fa-calendar-alt"></i> Reagendar
          </button>
        ` : session.status === 'completed' ? `
          <button class="btn btn-primary btn-sm review-btn" data-id="${session.id}">
            <i class="fas fa-star"></i> Avaliar
          </button>
          <button class="btn btn-outline btn-sm schedule-again-btn" data-mentor-id="${session.mentorId}">
            <i class="fas fa-calendar-plus"></i> Agendar novamente
          </button>
        ` : `
          <button class="btn btn-primary btn-sm confirm-btn" data-id="${session.id}">
            <i class="fas fa-check"></i> Confirmar
          </button>
          <button class="btn btn-outline btn-sm cancel-btn" data-id="${session.id}">
            <i class="fas fa-times"></i> Cancelar
          </button>
        `}
      </div>
    </div>
  `,

  createToast: (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    return toast;
  },

  createModal: (title, content, actions = []) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${actions.length > 0 ? `
          <div class="modal-footer">
            ${actions.map(action => `
              <button class="btn ${action.primary ? 'btn-primary' : 'btn-outline'} ${action.class || ''}" 
                data-action="${action.id}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');

      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });

    const actionBtns = modal.querySelectorAll('[data-action]');
    actionBtns.forEach(btn => {
      const actionId = btn.getAttribute('data-action');
      const action = actions.find(a => a.id === actionId);

      if (action && action.handler) {
        btn.addEventListener('click', () => {
          action.handler();

          if (action.closeOnClick !== false) {
            closeBtn.click();
          }
        });
      }
    });

    return modal;
  },

  showModal: (modal) => {
    document.body.appendChild(modal);

    modal.offsetHeight;
    modal.classList.add('active');
  },

  createConfirmModal: (title, message, onConfirm, onCancel) => {
    const content = `
      <div class="confirmation-modal">
        <div class="confirmation-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h4 class="confirmation-title">${title}</h4>
        <p class="confirmation-message">${message}</p>
      </div>
    `;

    const actions = [
      {
        id: 'cancel',
        label: 'Cancelar',
        primary: false,
        handler: onCancel || (() => { })
      },
      {
        id: 'confirm',
        label: 'Confirmar',
        primary: true,
        handler: onConfirm
      }
    ];

    return components.createModal('', content, actions);
  },

  schedulingModal: (mentor) => `
    <div class="schedule-modal">
      <h3 class="modal-subtitle">Agendar mentoria com ${mentor.name}</h3>
      
      <div class="schedule-layout">
        <div class="schedule-calendar">
          <div class="calendar-header">
            <div class="calendar-title">Selecione uma data</div>
            <div class="calendar-nav">
              <button class="calendar-nav-btn" id="prev-month" aria-label="Mês anterior">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="calendar-nav-btn" id="next-month" aria-label="Próximo mês">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div class="calendar-month-year" id="calendar-month-year">Junho 2025</div>
          
          <div class="calendar-days">
            <div class="calendar-day-header">D</div>
            <div class="calendar-day-header">S</div>
            <div class="calendar-day-header">T</div>
            <div class="calendar-day-header">Q</div>
            <div class="calendar-day-header">Q</div>
            <div class="calendar-day-header">S</div>
            <div class="calendar-day-header">S</div>
          </div>
          <div id="calendar-days-container"></div>
        </div>
        
        <div class="time-slots">
          <h4 class="time-slots-title">Horários disponíveis</h4>
          <div class="time-slots-grid" id="time-slots-container">
            <!-- Time slots will be filled dynamically -->
            <div class="time-slot-empty">Selecione uma data para ver horários disponíveis</div>
          </div>
        </div>
        
        <div class="schedule-summary" id="schedule-summary" style="display: none;">
          <h4 class="schedule-summary-title">Resumo do agendamento</h4>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Data:</span>
            <span class="schedule-summary-value" id="summary-date">-</span>
          </div>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Horário:</span>
            <span class="schedule-summary-value" id="summary-time">-</span>
          </div>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Valor:</span>
            <span class="schedule-summary-value">${utils.formatCurrency(mentor.hourlyRate)}</span>
          </div>
          
          <div class="schedule-actions">
            <button class="btn btn-secondary" id="schedule-cancel-btn">Cancelar</button>
            <button class="btn btn-primary" id="schedule-confirm-btn" disabled>Confirmar Agendamento</button>
          </div>
        </div>
      </div>
    </div>
  `,

  createToast: (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    return toast;
  },

  createModal: (title, content, actions = []) => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${actions.length > 0 ? `
          <div class="modal-footer">
            ${actions.map(action => `
              <button class="btn ${action.primary ? 'btn-primary' : 'btn-outline'} ${action.class || ''}" 
                data-action="${action.id}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');

      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });

    const actionBtns = modal.querySelectorAll('[data-action]');
    actionBtns.forEach(btn => {
      const actionId = btn.getAttribute('data-action');
      const action = actions.find(a => a.id === actionId);

      if (action && action.handler) {
        btn.addEventListener('click', () => {
          action.handler();

          if (action.closeOnClick !== false) {
            closeBtn.click();
          }
        });
      }
    });

    return modal;
  },

  showModal: (modal) => {
    document.body.appendChild(modal);

    modal.offsetHeight;
    modal.classList.add('active');
  },

  createConfirmModal: (title, message, onConfirm, onCancel) => {
    const content = `
      <div class="confirmation-modal">
        <div class="confirmation-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h4 class="confirmation-title">${title}</h4>
        <p class="confirmation-message">${message}</p>
      </div>
    `;

    const actions = [
      {
        id: 'cancel',
        label: 'Cancelar',
        primary: false,
        handler: onCancel || (() => { })
      },
      {
        id: 'confirm',
        label: 'Confirmar',
        primary: true,
        handler: onConfirm
      }
    ];

    return components.createModal('', content, actions);
  }
};

const pageTemplates = {
  home: (featuredMaterials = [], featuredMentors = []) => `
    <div class="hero-section">
      <h1 class="hero-title">Bem-vindo ao Academic Hub</h1>
      <p class="hero-subtitle">A plataforma que conecta estudantes para compartilhar conhecimento</p>
      <div class="hero-actions">
        <a href="#materials" class="btn btn-primary btn-lg">
          <i class="fas fa-book"></i> Explorar Materiais
        </a>
        <a href="#mentorships" class="btn btn-outline btn-lg" style="color: white; border-color: white;">
          <i class="fas fa-users"></i> Encontrar Mentores
        </a>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-book"></i>
        </div>
        <div class="stat-number">${featuredMaterials.length || 1234}</div>
        <div class="stat-label">Materiais Disponíveis</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-number">${featuredMentors.length || 567}</div>
        <div class="stat-label">Mentores Ativos</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="stat-number">8,901</div>
        <div class="stat-label">Estudantes Conectados</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-star"></i>
        </div>
        <div class="stat-number">4.8</div>
        <div class="stat-label">Avaliação Média</div>
      </div>
    </div>

    <div class="page-header">
      <h2 class="page-title">Materiais em Destaque</h2>
      <p class="page-subtitle">Os materiais mais bem avaliados da plataforma</p>
    </div>

    ${components.materialsCarousel(featuredMaterials)}

    <div class="page-header">
      <h2 class="page-title">Mentores em Destaque</h2>
      <p class="page-subtitle">Os mentores mais bem avaliados da plataforma</p>
    </div>

    ${components.mentorList(featuredMentors)}
  `,

  materials: (materials = []) => `
    <div class="page-header">
      <h2 class="page-title">Materiais Acadêmicos</h2>
      <p class="page-subtitle">Explore materiais compartilhados por outros estudantes</p>
    </div>

    <div class="filters-section">
      <h3 class="filters-title">Filtros</h3>
      <div class="filter-group">
        <label for="material-search" class="filter-label">Buscar por título ou autor:</label>
        <input type="text" id="material-search" class="filter-input" placeholder="Digite sua busca...">
      </div>
      <div class="filter-group">
        <label for="material-category" class="filter-label">Categoria:</label>
        <select id="material-category" class="filter-input">
          <option value="">Todas as categorias</option>
          <option value="Programação">Programação</option>
          <option value="Matemática">Matemática</option>
          <option value="Física">Física</option>
          <option value="Química">Química</option>
          <option value="Biologia">Biologia</option>
          <option value="História">História</option>
          <option value="Geografia">Geografia</option>
          <option value="Literatura">Literatura</option>
          <option value="Geral">Geral</option>
        </select>
      </div>
      <div class="filters-actions">
        <button id="clear-filters" class="btn btn-outline btn-sm">
          <i class="fas fa-times"></i> Limpar
        </button>
        <button id="apply-filters" class="btn btn-primary btn-sm">
          <i class="fas fa-filter"></i> Aplicar
        </button>
      </div>
    </div>

    <div class="grid">
      ${materials.map(material => components.materialCard(material)).join('')}
      ${materials.length === 0 ? `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>Nenhum material encontrado</h3>
          <p>Tente ajustar seus filtros ou busque por termos diferentes.</p>
        </div>
      ` : ''}
    </div>
  `,

  materialDetail: (material) => `
    <div class="material-detail">
      <div class="material-detail-header">
        <a href="#materials" class="material-detail-back">
          <i class="fas fa-arrow-left"></i>
        </a>
        <h1 class="material-detail-title">${material.title}</h1>
        <p class="material-detail-author">por ${material.author}</p>
        <div class="material-detail-meta">
          <div class="rating">
            ${Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fas fa-star rating-star ${i < Math.floor(material.rating) ? "" : "empty"}"></i>`
  ).join("")}
            <span>(${material.reviews || 0} avaliações)</span>
          </div>
          <div>
            <span class="badge badge-primary">${material.category}</span>
            <span class="badge badge-secondary">${material.type}</span>
          </div>
        </div>
      </div>

      <div class="material-detail-body">
        <div class="material-detail-section">
          <h2 class="material-detail-section-title">Descrição</h2>
          <p>${material.description}</p>
        </div>

        <div class="material-detail-section">
          <h2 class="material-detail-section-title">Detalhes</h2>
          <ul class="material-detail-list">
            <li><strong>Categoria:</strong> ${material.category}</li>
            <li><strong>Disciplina:</strong> ${material.subject}</li>
            <li><strong>Formato:</strong> ${material.type}</li>
            <li><strong>Preço:</strong> ${utils.formatCurrency(material.price)}</li>
          </ul>
        </div>
      </div>

      <div class="material-detail-actions">
        <button class="btn btn-primary" id="add-to-cart-btn" data-id="${material.id}">
          <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
        </button>
        <a href="#materials" class="btn btn-outline">
          <i class="fas fa-arrow-left"></i> Voltar
        </a>
      </div>
    </div>
  `,

  mentorships: (mentors = []) => `
    <div class="page-header">
      <h2 class="page-title">Mentores Disponíveis</h2>
      <p class="page-subtitle">Encontre mentores para auxiliar nos seus estudos</p>
    </div>

    <div class="filters-section">
      <h3 class="filters-title">Filtros</h3>
      <div class="filter-group">
        <label for="mentor-search" class="filter-label">Buscar por nome:</label>
        <input type="text" id="mentor-search" class="filter-input" placeholder="Digite sua busca...">
      </div>
      <div class="filter-group">
        <label for="mentor-specialty" class="filter-label">Especialidade:</label>
        <select id="mentor-specialty" class="filter-input">
          <option value="">Todas as especialidades</option>
          <option value="Programação">Programação</option>
          <option value="Matemática">Matemática</option>
          <option value="Física">Física</option>
          <option value="Química">Química</option>
          <option value="Biologia">Biologia</option>
          <option value="História">História</option>
          <option value="Literatura">Literatura</option>
        </select>
      </div>
      <div class="filters-actions">
        <button id="clear-mentor-filters" class="btn btn-outline btn-sm">
          <i class="fas fa-times"></i> Limpar
        </button>
        <button id="apply-mentor-filters" class="btn btn-primary btn-sm">
          <i class="fas fa-filter"></i> Aplicar
        </button>
      </div>
    </div>

    <div class="grid">
      ${mentors.map(mentor => components.mentorCard(mentor)).join('')}
      ${mentors.length === 0 ? `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>Nenhum mentor encontrado</h3>
          <p>Tente ajustar seus filtros ou busque por termos diferentes.</p>
        </div>
      ` : ''}
    </div>
  `,

  mentorDetail: (mentor) => `
    <div class="mentor-detail">
      <div class="mentor-detail-header">
        <a href="#mentorships" class="mentor-detail-back">
          <i class="fas fa-arrow-left"></i>
        </a>
        <div class="mentor-detail-avatar">
          <i class="fas fa-user"></i>
        </div>
        <h1 class="mentor-detail-name">${mentor.name}</h1>
        <p class="mentor-detail-specialty">${mentor.specialty}</p>
        <div class="mentor-detail-meta">
          <div class="rating">
            ${Array.from(
    { length: 5 },
    (_, i) =>
      `<i class="fas fa-star rating-star ${i < Math.floor(mentor.rating) ? "" : "empty"}"></i>`
  ).join("")}
            <span>(${mentor.reviews || 0} avaliações)</span>
          </div>
        </div>
      </div>

      <div class="mentor-detail-body">
        <div class="mentor-detail-section">
          <h2 class="mentor-detail-section-title">Biografia</h2>
          <p>${mentor.bio}</p>
        </div>

        <div class="mentor-detail-section">
          <h2 class="mentor-detail-section-title">Especialidades</h2>
          <div class="mentor-subjects">
            ${mentor.subjects.map(subject => `
              <span class="badge badge-primary">${subject}</span>
            `).join(' ')}
          </div>
        </div>

        <div class="mentor-detail-section">
          <h2 class="mentor-detail-section-title">Valor</h2>
          <p class="mentor-detail-rate">${utils.formatCurrency(mentor.hourlyRate)} por hora de mentoria</p>
        </div>

        <div class="mentor-detail-section">
          <h2 class="mentor-detail-section-title">Próximas disponibilidades</h2>
          <div class="mentor-schedule">
            ${mentor.availability ? mentor.availability.map((slot, index) => `
              <div class="schedule-slot available" data-date="${slot.date}" data-time="${slot.time}">
                ${utils.formatDate(slot.date).split(',')[0]}, ${utils.formatTime(slot.time)}
              </div>
            `).join('') : `
              <div class="schedule-slot">Seg, 14:00</div>
              <div class="schedule-slot">Ter, 10:00</div>
              <div class="schedule-slot">Qua, 14:00</div>
              <div class="schedule-slot">Qui, 16:00</div>
              <div class="schedule-slot available">Sex, 10:00</div>
              <div class="schedule-slot available">Sex, 14:00</div>
            `}
          </div>
        </div>
      </div>

      <div class="material-detail-actions">
        <button class="btn btn-primary" id="schedule-btn" data-id="${mentor.id}">
          <i class="fas fa-calendar-alt"></i> Agendar Mentoria
        </button>
        <a href="#mentorships" class="btn btn-outline">
          <i class="fas fa-arrow-left"></i> Voltar
        </a>
      </div>
    </div>
  `,

  schedulingModal: (mentor) => `
    <div class="schedule-modal">
      <h3 class="modal-subtitle">Agendar mentoria com ${mentor.name}</h3>
      
      <div class="schedule-layout">
        <div class="schedule-calendar">
          <div class="calendar-header">
            <div class="calendar-title">Selecione uma data</div>
            <div class="calendar-nav">
              <button class="calendar-nav-btn" id="prev-month" aria-label="Mês anterior">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="calendar-nav-btn" id="next-month" aria-label="Próximo mês">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div class="calendar-month-year" id="calendar-month-year">Junho 2025</div>
          
          <div class="calendar-days">
            <div class="calendar-day-header">D</div>
            <div class="calendar-day-header">S</div>
            <div class="calendar-day-header">T</div>
            <div class="calendar-day-header">Q</div>
            <div class="calendar-day-header">Q</div>
            <div class="calendar-day-header">S</div>
            <div class="calendar-day-header">S</div>
          </div>
          <div id="calendar-days-container"></div>
        </div>
        
        <div class="time-slots">
          <h4 class="time-slots-title">Horários disponíveis</h4>
          <div class="time-slots-grid" id="time-slots-container">
            <!-- Time slots will be filled dynamically -->
            <div class="time-slot-empty">Selecione uma data para ver horários disponíveis</div>
          </div>
        </div>
        
        <div class="schedule-summary" id="schedule-summary" style="display: none;">
          <h4 class="schedule-summary-title">Resumo do agendamento</h4>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Data:</span>
            <span class="schedule-summary-value" id="summary-date">-</span>
          </div>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Horário:</span>
            <span class="schedule-summary-value" id="summary-time">-</span>
          </div>
          <div class="schedule-summary-item">
            <span class="schedule-summary-label">Valor:</span>
            <span class="schedule-summary-value">${utils.formatCurrency(mentor.hourlyRate)}</span>
          </div>
          
          <div class="schedule-actions">
            <button class="btn btn-secondary" id="schedule-cancel-btn">Cancelar</button>
            <button class="btn btn-primary" id="schedule-confirm-btn" disabled>Confirmar Agendamento</button>
          </div>
        </div>
      </div>
    </div>
  `,

  myMaterials: (materials = []) => `
    <div class="page-header">
      <h2 class="page-title">Meus Materiais</h2>
      <p class="page-subtitle">Materiais adquiridos por você</p>
    </div>

    ${materials.length > 0 ? `
      ${materials.map(material => components.myMaterialItem(material)).join('')}
    ` : `
      <div class="my-materials-empty">
        <div class="my-materials-empty-icon">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3 class="my-materials-empty-title">Você ainda não possui materiais</h3>
        <p class="my-materials-empty-message">
          Adquira materiais para ter acesso a eles aqui.
        </p>
        <a href="#materials" class="btn btn-primary">
          <i class="fas fa-book"></i> Explorar Materiais
        </a>
      </div>
    `}
  `,

  mySchedule: (schedule = []) => `
    <div class="page-header">
      <h2 class="page-title">Minha Agenda</h2>
      <p class="page-subtitle">Mentorias agendadas</p>
    </div>

    ${schedule.length > 0 ? `
      ${schedule.map(session => components.scheduleItem(session)).join('')}
    ` : `
      <div class="my-materials-empty">
        <div class="my-materials-empty-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <h3 class="my-materials-empty-title">Sua agenda está vazia</h3>
        <p class="my-materials-empty-message">
          Agende mentorias para visualizá-las aqui.
        </p>
        <a href="#mentorships" class="btn btn-primary">
          <i class="fas fa-users"></i> Encontrar Mentores
        </a>
      </div>
    `}
  `,

  cart: (cart = []) => `
    <div class="page-header">
      <h2 class="page-title">Carrinho</h2>
      <p class="page-subtitle">Itens que você adicionou ao carrinho</p>
    </div>

    ${cart.length > 0 ? `
      <div class="cart-container">
        <div class="cart-items">
          ${cart.map(item => components.cartItem(item)).join('')}
        </div>
        <div class="cart-summary">
          <div class="cart-summary-line">
            <span>Subtotal</span>
            <span id="cart-subtotal">${utils.formatCurrency(
    cart.reduce((sum, item) => sum + (item.price || item.hourlyRate), 0)
  )}</span>
          </div>
          <div class="cart-summary-line">
            <span>Impostos</span>
            <span id="cart-taxes">${utils.formatCurrency(
    cart.reduce((sum, item) => sum + (item.price || item.hourlyRate), 0) * 0.1
  )}</span>
          </div>
          <div class="cart-total">
            <span>Total</span>
            <span id="cart-total">${utils.formatCurrency(
    cart.reduce((sum, item) => sum + (item.price || item.hourlyRate), 0) * 1.1
  )}</span>
          </div>
          <button id="checkout-btn" class="btn btn-primary btn-lg" style="width: 100%;">
            <i class="fas fa-credit-card"></i> Finalizar Compra
          </button>
        </div>
      </div>
    ` : `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h3 class="cart-empty-title">Seu carrinho está vazio</h3>
        <p class="cart-empty-message">
          Adicione itens ao seu carrinho para visualizá-los aqui.
        </p>
        <div>
          <a href="#materials" class="btn btn-primary">
            <i class="fas fa-book"></i> Explorar Materiais
          </a>
          <a href="#mentorships" class="btn btn-outline">
            <i class="fas fa-users"></i> Encontrar Mentores
          </a>
        </div>
      </div>
    `}
  `,

  payment: (cart = []) => `
    <div class="page-header">
      <h2 class="page-title">Finalizar Compra</h2>
      <p class="page-subtitle">Insira suas informações de pagamento</p>
    </div>

    <div class="payment-section">
      <div class="payment-summary">
        <h3 class="payment-summary-title">Resumo do Pedido</h3>
        <div class="payment-items">
          ${cart.map(item => `
            <div class="payment-item">
              <span class="payment-item-name">${item.title || item.name}</span>
              <span class="payment-item-price">${utils.formatCurrency(item.price || item.hourlyRate)}</span>
            </div>
          `).join('')}
        </div>
        <div class="payment-total">
          <span>Total</span>
          <span>${utils.formatCurrency(
    cart.reduce((sum, item) => sum + (item.price || item.hourlyRate), 0) * 1.1
  )}</span>
        </div>
      </div>

      <form id="payment-form" class="payment-form">
        <div class="form-group">
          <h3 class="form-section-title">Método de Pagamento</h3>
          <div class="payment-method-list">
            <div class="payment-method-item selected">
              <input type="radio" name="payment-method" id="credit-card" value="credit-card" class="payment-method-radio" checked>
              <div class="payment-method-icon">
                <i class="fas fa-credit-card"></i>
              </div>
              <div class="payment-method-details">
                <div class="payment-method-title">Cartão de Crédito</div>
                <div class="payment-method-description">Pague com Visa, Mastercard, ou outros cartões</div>
              </div>
            </div>
            <div class="payment-method-item">
              <input type="radio" name="payment-method" id="pix" value="pix" class="payment-method-radio">
              <div class="payment-method-icon">
                <i class="fas fa-qrcode"></i>
              </div>
              <div class="payment-method-details">
                <div class="payment-method-title">PIX</div>
                <div class="payment-method-description">Pague instantaneamente com PIX</div>
              </div>
            </div>
            <div class="payment-method-item">
              <input type="radio" name="payment-method" id="boleto" value="boleto" class="payment-method-radio">
              <div class="payment-method-icon">
                <i class="fas fa-barcode"></i>
              </div>
              <div class="payment-method-details">
                <div class="payment-method-title">Boleto Bancário</div>
                <div class="payment-method-description">Pague com boleto em qualquer banco</div>
              </div>
            </div>
          </div>
        </div>        <div class="form-group payment-method-fields" id="credit-card-fields">
          <h3 class="form-section-title">Informações do Cartão</h3>
          <div class="form-group">
            <label for="card-name">Nome no Cartão</label>
            <input type="text" id="card-name" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="card-number">Número do Cartão</label>
            <input type="text" id="card-number" class="form-control" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="card-expiry">Data de Expiração</label>
              <input type="text" id="card-expiry" class="form-control" placeholder="MM/AA" required>
            </div>
            <div class="form-group">
              <label for="card-cvv">CVV</label>
              <input type="text" id="card-cvv" class="form-control" required>
            </div>
          </div>
        </div>
        
        <div class="form-group payment-method-fields" id="pix-fields" style="display: none;">
          <h3 class="form-section-title">Pagamento com PIX</h3>
          <div class="pix-container">
            <div class="pix-qrcode">
              <i class="fas fa-qrcode pix-code-icon"></i>
            </div>
            <p class="pix-instructions">
              Escaneie o QR Code com o aplicativo do seu banco para pagar.
              <br>O pagamento será processado instantaneamente.
            </p>
          </div>
        </div>
        
        <div class="form-group payment-method-fields" id="boleto-fields" style="display: none;">
          <h3 class="form-section-title">Pagamento com Boleto</h3>
          <div class="boleto-container">
            <div class="boleto-barcode">
              <i class="fas fa-barcode boleto-code-icon"></i>
            </div>
            <p class="boleto-instructions">
              Clique no botão abaixo para gerar o boleto.
              <br>O pagamento será confirmado em até 3 dias úteis.
            </p>
            <button type="button" class="btn btn-outline" id="generate-boleto-btn">
              <i class="fas fa-file-pdf"></i> Gerar Boleto
            </button>
          </div>
        </div>

        <div class="payment-actions">
          <button type="button" class="btn btn-outline" onclick="window.history.back()">
            <i class="fas fa-arrow-left"></i> Voltar
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-lock"></i> Pagar com Segurança
          </button>
        </div>
      </form>
    </div>
  `,

  profile: (user) => `
    <div class="page-header">
      <h2 class="page-title">Meu Perfil</h2>
      <p class="page-subtitle">Gerencie suas informações e preferências</p>
    </div>

    <div class="profile-section">
      <div class="profile-card">
        <div class="profile-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="profile-info">
          <h3 class="profile-name">${user.name || 'Usuário'}</h3>
          <p class="profile-email">${user.email || 'usuario@exemplo.com'}</p>
          <button class="btn btn-outline btn-sm edit-profile-btn">
            <i class="fas fa-edit"></i> Editar Perfil
          </button>
        </div>
      </div>

      <div class="profile-actions">
        <a href="#my-materials" class="profile-action-item">
          <div class="profile-action-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="profile-action-details">
            <div class="profile-action-title">Meus Materiais</div>
            <div class="profile-action-description">Gerencie seus materiais adquiridos</div>
          </div>
          <div class="profile-action-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </a>
        <a href="#my-schedule" class="profile-action-item">
          <div class="profile-action-icon">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="profile-action-details">
            <div class="profile-action-title">Minha Agenda</div>
            <div class="profile-action-description">Visualize e gerencie suas mentorias agendadas</div>
          </div>
          <div class="profile-action-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </a>
        <button class="profile-action-item">
          <div class="profile-action-icon">
            <i class="fas fa-cog"></i>
          </div>
          <div class="profile-action-details">
            <div class="profile-action-title">Preferências</div>
            <div class="profile-action-description">Ajuste suas configurações</div>
          </div>
          <div class="profile-action-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </button>
        <button class="profile-action-item">
          <div class="profile-action-icon red">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <div class="profile-action-details">
            <div class="profile-action-title">Sair</div>
            <div class="profile-action-description">Encerrar sessão</div>
          </div>
          <div class="profile-action-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </button>
      </div>
    </div>
  `
};

window.components = components;
window.pageTemplates = pageTemplates;