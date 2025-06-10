const mentorScheduling = {
  currentDate: new Date(),
  selectedDate: null,
  selectedTime: null,
  currentMentor: null,

  init(mentor) {
    this.currentMentor = mentor;
    this.selectedDate = null;
    this.selectedTime = null;

    this.renderCalendar();

    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('prev-month').addEventListener('click', () => {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      this.renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      this.renderCalendar();
    });

    const calendarDays = document.getElementById('calendar-days-container');
    calendarDays.addEventListener('click', (e) => {
      const dayEl = e.target.closest('.calendar-day');

      if (dayEl && !dayEl.classList.contains('disabled')) {
        document.querySelectorAll('.calendar-day').forEach(day => {
          day.classList.remove('active');
        });

        dayEl.classList.add('active');

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const day = parseInt(dayEl.textContent, 10);
        this.selectedDate = new Date(year, month, day);

        this.renderTimeSlots();
      }
    });

    const timeSlotsContainer = document.getElementById('time-slots-container');
    timeSlotsContainer.addEventListener('click', (e) => {
      const slotEl = e.target.closest('.time-slot');

      if (slotEl && !slotEl.classList.contains('disabled')) {
        document.querySelectorAll('.time-slot').forEach(slot => {
          slot.classList.remove('active');
        });

        slotEl.classList.add('active');

        this.selectedTime = slotEl.dataset.time;

        this.updateSummary();
      }
    });

    const confirmBtn = document.getElementById('schedule-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirmScheduling());
    }
  },

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;

    const calendarDays = document.getElementById('calendar-days-container');
    calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = day;

      const currentDate = new Date(year, month, day);
      if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        dayEl.classList.add('disabled');
      }

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasAvailability = this.checkDateAvailability(dateStr);

      if (!hasAvailability) {
        dayEl.classList.add('disabled');
      }

      calendarDays.appendChild(dayEl);
    }
  },

  checkDateAvailability(dateStr) {
    if (!this.currentMentor.availability) {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay();
      return dayOfWeek > 0 && dayOfWeek < 6;
    }

    return this.currentMentor.availability.some(slot => slot.date === dateStr);
  },

  getAvailableTimeSlots() {
    if (!this.selectedDate) return [];

    const dateStr = this.selectedDate.toISOString().split('T')[0];

    if (!this.currentMentor.availability) {
      const dayOfWeek = this.selectedDate.getDay();

      const demoSlots = [];

      if (dayOfWeek === 1 || dayOfWeek === 3) {
        demoSlots.push({ time: '10:00', duration: 60 });
        demoSlots.push({ time: '14:00', duration: 60 });
      } else if (dayOfWeek === 2 || dayOfWeek === 4) {
        demoSlots.push({ time: '11:00', duration: 60 });
        demoSlots.push({ time: '15:00', duration: 60 });
      } else if (dayOfWeek === 5) {
        demoSlots.push({ time: '10:00', duration: 60 });
        demoSlots.push({ time: '14:00', duration: 60 });
      }

      return demoSlots;
    }

    return this.currentMentor.availability.filter(slot => slot.date === dateStr);
  },

  renderTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots-container');
    timeSlotsContainer.innerHTML = '';

    const availableSlots = this.getAvailableTimeSlots();

    if (availableSlots.length === 0) {
      timeSlotsContainer.innerHTML = `
        <div class="time-slot-empty">
          Nenhum horário disponível na data selecionada
        </div>
      `;
      return;
    }

    availableSlots.forEach(slot => {
      const slotEl = document.createElement('div');
      slotEl.className = 'time-slot';
      slotEl.dataset.time = slot.time;
      slotEl.innerHTML = `
        <span class="time-slot-time">${utils.formatTime(slot.time)}</span>
        <span class="time-slot-duration">${slot.duration} min</span>
      `;
      timeSlotsContainer.appendChild(slotEl);
    });
  },

  updateSummary() {
    if (!this.selectedDate || !this.selectedTime) return;

    const summaryEl = document.getElementById('schedule-summary');
    summaryEl.style.display = 'block';

    document.getElementById('summary-date').textContent = this.selectedDate.toLocaleDateString('pt-BR');
    document.getElementById('summary-time').textContent = utils.formatTime(this.selectedTime);

    const confirmBtn = document.getElementById('schedule-confirm-btn');
    if (confirmBtn) {
      confirmBtn.disabled = false;
    }
  },

  confirmScheduling() {
    if (!this.selectedDate || !this.selectedTime) {
      utils.showToast('Selecione data e horário para continuar', 'error');
      return;
    }

    const appointment = {
      mentorId: this.currentMentor.id,
      mentorName: this.currentMentor.name,
      date: this.selectedDate.toISOString().split('T')[0],
      time: this.selectedTime,
      userId: 1,
      status: 'scheduled'
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    document.getElementById('modal-container').classList.remove('active');

    utils.showToast('Mentoria agendada com sucesso!', 'success');

    setTimeout(() => {
      window.location.hash = '#my-schedule';
    }, 1500);
  }
};

window.mentorScheduling = mentorScheduling;