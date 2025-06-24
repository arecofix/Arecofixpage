document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const whatsappNumber = '5491123456789'; // REEMPLAZA CON TU NÚMERO (código de país + número sin +)
    const availableHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    
    // Elementos del DOM
    const elements = {
        currentMonth: document.getElementById('current-month'),
        calendarDays: document.getElementById('calendar-days'),
        prevMonthBtn: document.getElementById('prev-month'),
        nextMonthBtn: document.getElementById('next-month'),
        timeSelection: document.getElementById('time-selection'),
        timeSlots: document.getElementById('time-slots'),
        selectedInfo: document.getElementById('selected-info'),
        selectedDateText: document.getElementById('selected-date-text'),
        selectedTimeText: document.getElementById('selected-time-text'),
        requestQuoteBtn: document.getElementById('request-quote')
    };
    
    // Estado de la aplicación
    let state = {
        currentDate: new Date(),
        selectedDate: null,
        selectedTime: null
    };
    
    // Inicialización
    function init() {
        renderCalendar();
        setupEventListeners();
    }
    
    // Renderizar el calendario
    function renderCalendar() {
        // Limpiar días anteriores
        elements.calendarDays.innerHTML = '';
        
        // Configurar fecha actual
        const year = state.currentDate.getFullYear();
        const month = state.currentDate.getMonth();
        
        // Actualizar el título del mes
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        elements.currentMonth.textContent = `${monthNames[month]} ${year}`;
        
        // Obtener primer y último día del mes
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Obtener día de la semana del primer día (0=Domingo, 1=Lunes, etc.)
        const firstDayOfWeek = firstDay.getDay();
        
        // Ajustar para que la semana empiece en Lunes
        const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Agregar días vacíos para alinear el primer día
        for (let i = 0; i < startOffset; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'h-10';
            elements.calendarDays.appendChild(emptyDay);
        }
        
        // Agregar días del mes
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('button');
            dayElement.className = 'h-10 w-full text-white text-sm font-medium hover:bg-gray-700 rounded-full';
            
            // Resaltar día actual
            const today = new Date();
            if (date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Resaltar día seleccionado
            if (state.selectedDate && 
                date.getDate() === state.selectedDate.getDate() && 
                date.getMonth() === state.selectedDate.getMonth() && 
                date.getFullYear() === state.selectedDate.getFullYear()) {
                dayElement.classList.add('selected-day');
            }
            
            dayElement.textContent = day;
            
            dayElement.addEventListener('click', () => selectDate(date));
            
            elements.calendarDays.appendChild(dayElement);
        }
    }
    
    // Seleccionar una fecha
    function selectDate(date) {
        state.selectedDate = date;
        state.selectedTime = null;
        
        // Actualizar UI
        renderCalendar();
        renderTimeSlots();
        
        // Mostrar selección de hora
        elements.timeSelection.classList.remove('hidden');
        elements.selectedInfo.classList.add('hidden');
        
        // Deshabilitar botón hasta seleccionar hora
        elements.requestQuoteBtn.disabled = true;
    }
    
    // Renderizar horarios disponibles
    function renderTimeSlots() {
        elements.timeSlots.innerHTML = '';
        
        availableHours.forEach(time => {
            const timeSlot = document.createElement('button');
            timeSlot.className = 'py-2 px-3 text-sm font-medium text-white hover:bg-gray-700 rounded-full';
            
            if (state.selectedTime === time) {
                timeSlot.classList.add('selected-time');
            }
            
            timeSlot.textContent = time;
            
            timeSlot.addEventListener('click', () => selectTime(time));
            
            elements.timeSlots.appendChild(timeSlot);
        });
    }
    
    // Seleccionar una hora
    function selectTime(time) {
        state.selectedTime = time;
        
        // Actualizar UI
        renderTimeSlots();
        
        // Mostrar información seleccionada
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = state.selectedDate.toLocaleDateString('es-ES', options);
        
        elements.selectedDateText.textContent = formattedDate;
        elements.selectedTimeText.textContent = time;
        elements.selectedInfo.classList.remove('hidden');
        
        // Habilitar botón de cotización
        elements.requestQuoteBtn.disabled = false;
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Navegación entre meses
        elements.prevMonthBtn.addEventListener('click', () => {
            state.currentDate = new Date(
                state.currentDate.getFullYear(),
                state.currentDate.getMonth() - 1,
                1
            );
            resetSelection();
            renderCalendar();
        });
        
        elements.nextMonthBtn.addEventListener('click', () => {
            state.currentDate = new Date(
                state.currentDate.getFullYear(),
                state.currentDate.getMonth() + 1,
                1
            );
            resetSelection();
            renderCalendar();
        });
        
        // Botón de cotización
        elements.requestQuoteBtn.addEventListener('click', sendWhatsAppMessage);
    }
    
    // Resetear selección al cambiar de mes
    function resetSelection() {
        state.selectedDate = null;
        state.selectedTime = null;
        elements.timeSelection.classList.add('hidden');
        elements.selectedInfo.classList.add('hidden');
        elements.requestQuoteBtn.disabled = true;
    }
    
    // Enviar mensaje por WhatsApp
    function sendWhatsAppMessage() {
        if (!state.selectedDate || !state.selectedTime) return;
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = state.selectedDate.toLocaleDateString('es-ES', options);
        
        const message = `¡Hola! Quiero reservar una cita para el ${formattedDate} a las ${state.selectedTime} horas. Por favor, envíenme más información.`;
        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/${541125960900}?text=${encodedMessage}`, '_blank');
    }
    
    // Iniciar la aplicación
    init();
});