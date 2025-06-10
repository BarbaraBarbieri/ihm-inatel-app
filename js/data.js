class DataManager {
  constructor() {
    this.materials = [];
    this.mentors = [];
    this.users = [];
    this.reviews = [];
    this.cart = [];
    this.schedule = [];

    this.currentUser = { id: 1 };

    this.dataLoaded = false;
  }

  async init() {
    try {
      await this.loadData();
      this.loadCartFromStorage();
      return true;
    } catch (error) {
      console.error('Error loading data:', error);
      this.initSampleData();
      return false;
    }
  }

  async loadData() {
    const loadFile = async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    };

    try {
      const [materials, mentors, users, reviews, schedule] = await Promise.all([
        loadFile('data/materials.json'),
        loadFile('data/mentors.json'),
        loadFile('data/users.json'),
        loadFile('data/reviews.json'),
        loadFile('data/schedule.json')
      ]);

      this.materials = materials;
      this.mentors = mentors;
      this.users = users;
      this.reviews = reviews;
      this.schedule = schedule;
      this.dataLoaded = true;

      // Process reviews
      this.processReviews();

      return true;
    } catch (error) {
      console.error('Error loading data files:', error);
      throw error;
    }
  }

  initSampleData() {
    this.materials = [
      {
        id: 1,
        title: 'Introdução à Programação',
        author: 'Prof. Carlos Silva',
        description: 'Material introdutório sobre conceitos básicos de programação e algoritmos',
        price: 29.90,
        category: 'Programação',
        subject: 'Ciência da Computação',
        type: 'PDF',
        rating: 4.5,
        reviews: 10,
        featured: true
      },
      {
        id: 2,
        title: 'Cálculo Avançado',
        author: 'Profa. Ana Oliveira',
        description: 'Material completo sobre cálculo diferencial e integral para cursos avançados',
        price: 39.90,
        category: 'Matemática',
        subject: 'Cálculo',
        type: 'PDF',
        rating: 4.8,
        reviews: 15,
        featured: true
      }
    ];

    this.mentors = [
      {
        id: 1,
        name: 'Dr. Ricardo Martins',
        specialty: 'Programação e Algoritmos',
        bio: 'Professor de Ciência da Computação com mais de 10 anos de experiência',
        hourlyRate: 80.00,
        rating: 4.9,
        reviews: 25,
        subjects: ['Programação', 'Algoritmos', 'Estruturas de Dados'],
        featured: true
      },
      {
        id: 2,
        name: 'Dra. Juliana Costa',
        specialty: 'Matemática Aplicada',
        bio: 'Pesquisadora e professora de Matemática com doutorado em Matemática Aplicada',
        hourlyRate: 75.00,
        rating: 4.7,
        reviews: 18,
        subjects: ['Cálculo', 'Álgebra Linear', 'Estatística'],
        featured: true
      }
    ];

    this.users = [
      {
        id: 1,
        name: 'Usuário de Teste',
        email: 'usuario@teste.com',
        role: 'student'
      }
    ];

    this.reviews = [];
    this.schedule = [];
    this.dataLoaded = true;
  }

  processReviews() {
    const materialReviews = {};
    const mentorReviews = {};

    this.reviews.forEach(review => {
      if (review.materialId) {
        if (!materialReviews[review.materialId]) {
          materialReviews[review.materialId] = [];
        }
        materialReviews[review.materialId].push(review);
      } else if (review.mentorId) {
        if (!mentorReviews[review.mentorId]) {
          mentorReviews[review.mentorId] = [];
        }
        mentorReviews[review.mentorId].push(review);
      }
    });

    this.materials.forEach(material => {
      const reviews = materialReviews[material.id] || [];
      material.reviewsCount = reviews.length;

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        material.rating = parseFloat((totalRating / reviews.length).toFixed(1));
      } else {
        material.rating = 0;
      }
    });

    this.mentors.forEach(mentor => {
      const reviews = mentorReviews[mentor.id] || [];
      mentor.reviewsCount = reviews.length;

      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        mentor.rating = parseFloat((totalRating / reviews.length).toFixed(1));
      } else {
        mentor.rating = 0;
      }
    });
  }

  getMaterials() {
    return this.materials;
  }

  getFeaturedMaterials(limit = 4) {
    return this.materials
      .filter(material => material.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getMaterialById(id) {
    return this.materials.find(material => material.id === parseInt(id)) || null;
  }

  getMentors() {
    return this.mentors;
  }

  getFeaturedMentors(limit = 4) {
    return this.mentors
      .filter(mentor => mentor.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getMentorById(id) {
    return this.mentors.find(mentor => mentor.id === parseInt(id)) || null;
  }

  getUserSchedule(userId) {
    return this.schedule.filter(session => session.userId === userId);
  }

  getMentorAvailability(mentorId) {
    const mentor = this.getMentorById(mentorId);
    if (!mentor || !mentor.availability) return [];
    return mentor.availability;
  }

  getCart() {
    return this.cart;
  }

  addToCart(item) {
    const exists = this.cart.some(cartItem =>
      cartItem.id === item.id &&
      cartItem.type === item.type
    );

    if (exists) {
      return false;
    }

    this.cart.push(item);
    this.saveCartToStorage();
    return true;
  }

  removeFromCart(id, type) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item =>
      !(item.id === id && item.type === type)
    );

    this.saveCartToStorage();
    return this.cart.length < initialLength;
  }

  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
  }

  setCart(cart) {
    this.cart = cart;
    this.saveCartToStorage();
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('academicHub_cart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('academicHub_cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getPurchasedMaterials(userId) {
    try {
      const savedMaterials = localStorage.getItem(`academicHub_materials_${userId}`);
      if (savedMaterials) {
        return JSON.parse(savedMaterials);
      }
    } catch (error) {
      console.error('Error loading purchased materials from storage:', error);
    }

    return [];
  }

  loadPurchasedMaterialsFromStorage(userId) {
    try {
      const savedMaterials = localStorage.getItem(`academicHub_materials_${userId}`);
      if (savedMaterials) {
        const purchasedMaterials = JSON.parse(savedMaterials);
        return purchasedMaterials;
      }
    } catch (error) {
      console.error('Error loading purchased materials from storage:', error);
    }

    return [];
  }

  savePurchasedMaterialsToStorage(userId, materials) {
    try {
      localStorage.setItem(`academicHub_materials_${userId}`, JSON.stringify(materials));
    } catch (error) {
      console.error('Error saving purchased materials to storage:', error);
    }
  }

  processPurchase() {
    try {
      const user = this.getCurrentUser();
      const purchasedMaterials = this.getPurchasedMaterials(user.id) || [];

      const materialItems = this.cart.filter(item => item.type === 'material');

      const newPurchasedMaterials = [
        ...purchasedMaterials,
        ...materialItems.map(item => ({
          ...item,
          purchasedAt: new Date().toISOString()
        }))
      ];

      this.savePurchasedMaterialsToStorage(user.id, newPurchasedMaterials);

      this.clearCart();

      return true;
    } catch (error) {
      console.error('Error processing purchase:', error);
      return false;
    }
  }

  scheduleMentorship(mentorId, date, time) {
    try {
      const user = this.getCurrentUser();
      const mentor = this.getMentorById(mentorId);

      if (!mentor) return false;

      const session = {
        id: Date.now(),
        userId: user.id,
        mentorId: mentor.id,
        mentorName: mentor.name,
        date,
        time,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      this.schedule.push(session);

      localStorage.setItem('academicHub_schedule', JSON.stringify(this.schedule));

      return true;
    } catch (error) {
      console.error('Error scheduling mentorship:', error);
      return false;
    }
  }
}

window.dataManager = new DataManager();