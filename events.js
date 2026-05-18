/**
 * Events management with role-based access control
 * Ensures data consistency across all user dashboards
 */
let events = JSON.parse(localStorage.getItem("events")) || [];

const Events = (function() {
    // Event change listeners for real-time updates
    const eventChangeListeners = [];
    
    // Register event change listener
    function registerEventChangeListener(callback) {
        eventChangeListeners.push(callback);
    }
    
    // Notify all listeners about event changes
    function notifyEventChange(eventData, changeType) {
        eventChangeListeners.forEach(listener => {
            listener(eventData, changeType);
        });
    }
    // Mock event data
    const events = [
        {
            id: 1,
            title: "Tech Symposium 2026",
            description: "Annual technology conference featuring the latest innovations and cutting-edge research. Join us for workshops, keynote speeches, and networking opportunities with industry leaders. This event is perfect for students interested in technology careers and innovation.",
            date: "July 15, 2026",
            time: "9:00 AM",
            category: "Technology",
            image: "photos/Tech Symposium.png",
            createdBy: 1, // Admin ID
            participants: [3, 4, 5], // Student IDs
            restricted: false,
            fee: 500, // Fee in INR
            location: "Main Auditorium"
        },
        {
            id: 2,
            title: "Cultural Festival",
            description: "Celebrate diversity with performances, food, and art from various cultures around the world. Experience traditional dances, music performances, and culinary delights. This annual festival brings together students from all backgrounds to share their heritage.",
            date: "June 10, 2026",
            time: "11:00 AM",
            category: "Culture",
            image: "photos/Cultural Festival.png",
            createdBy: 2, // Teacher ID
            participants: [3, 4],
            restricted: false,
            fee: 300, // Fee in INR
            location: "College Grounds"
        },
        {
            id: 3,
            title: "Annual Career Fair",
            description: "Connect with top employers and explore career opportunities across various industries. Bring your resume and meet recruiters from leading companies. This event includes resume workshops, mock interviews, and career counseling sessions to help you prepare for your professional journey.",
            date: "August 20, 2026",
            time: "10:00 AM",
            category: "Career",
            image: "photos/Career Fair.png",
            createdBy: 1, // Admin ID
            participants: [3, 4, 5],
            restricted: true, // Restricted event
            fee: 200, // Fee in INR
            location: "College Convention Center"
        }
    ];

    // Get all events
    function getAllEvents() {
        return events;
    }

    // Get event by ID
    function getEventById(id) {
        return events.find(event => event.id === id);
    }

    // Get events created by a specific user
    function getEventsByCreator(userId) {
        return events.filter(event => event.createdBy === userId);
    }

    // Get events a user is participating in
    function getEventsByParticipant(userId) {
        return events.filter(event => event.participants.includes(userId));
    }

    // Create a new event
    function createEvent(eventData) {
        // Check if user has permission to create events
        if (!Auth.hasPermission('create')) {
            console.error('Permission denied: Cannot create event');
            return { success: false, message: 'Permission denied' };
        }

        const newEvent = {
            id: events.length + 1,
            ...eventData,
            createdBy: Auth.getCurrentUser().id,
            participants: []
        };

        events.push(newEvent);
        return { success: true, event: newEvent };
    }

    // Update an event
    function updateEvent(id, eventData) {
        const eventIndex = events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return { success: false, message: 'Event not found' };
        }

        const event = events[eventIndex];
        const currentUser = Auth.getCurrentUser();

        // Check if user has permission to update this event
        if (!(Auth.hasPermission('update') && 
            (event.createdBy === currentUser.id || Auth.hasPermission('manage_events')))) {
            return { success: false, message: 'Permission denied' };
        }

        events[eventIndex] = { ...event, ...eventData };
        return { success: true, event: events[eventIndex] };
    }

    // Delete an event
    function deleteEvent(id) {
        const eventIndex = events.findIndex(event => event.id === id);
        if (eventIndex === -1) {
            return { success: false, message: 'Event not found' };
        }

        const event = events[eventIndex];
        const currentUser = Auth.getCurrentUser();

        // Check if user has permission to delete this event
        if (!(Auth.hasPermission('delete') && 
            (event.createdBy === currentUser.id || Auth.hasPermission('manage_events')))) {
            return { success: false, message: 'Permission denied' };
        }
        
        // Store event before deletion for notification
        const deletedEvent = events[eventIndex];
        
        events.splice(eventIndex, 1);
        
        // Notify listeners about the deleted event
        notifyEventChange(deletedEvent, 'delete');
        
        return { success: true };
    }
function createEvent(title, date, time) {
    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        participants: []
    };

    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
}
function addEvent() {
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const time = document.getElementById("event-time").value;

    createEvent(title, date, time);

    alert("Event Created 🔥");
}
function loadEvents() {
    const container = document.getElementById("event-list");
    const events = JSON.parse(localStorage.getItem("events")) || [];

    container.innerHTML = "";

    events.forEach(event => {
        container.innerHTML += `
            <div>
                <h3>${event.title}</h3>
                <p>${event.date} - ${event.time}</p>
                <button onclick="joinEvent(${event.id})">Join</button>
            </div>
        `;
    });
}
function joinEvent(eventId) {
    let events = JSON.parse(localStorage.getItem("events"));

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const event = events.find(e => e.id === eventId);

    if (!event.participants.includes(user.email)) {
        event.participants.push(user.email);
    }

    localStorage.setItem("events", JSON.stringify(events));

    alert("Joined Event 🎉");
}
    // Register a user for an event
    function registerForEvent(eventId, userId) {
        const event = getEventById(eventId);
        if (!event) {
            return { success: false, message: 'Event not found' };
        }

        // Check if user has permission to participate
        if (!Auth.hasPermission('participate')) {
            return { success: false, message: 'Permission denied' };
        }

        // Check if user is already registered
        if (event.participants.includes(userId)) {
            return { success: false, message: 'Already registered' };
        }

        event.participants.push(userId);
        return { success: true };
    }

    // Get participants for an event
    function getEventParticipants(eventId) {
        const event = getEventById(eventId);
        if (!event) {
            return { success: false, message: 'Event not found' };
        }

        // Check if user has permission to view participants
        const currentUser = Auth.getCurrentUser();
        if (!(event.createdBy === currentUser.id || Auth.hasPermission('manage_events'))) {
            return { success: false, message: 'Permission denied' };
        }

        return { 
            success: true, 
            participants: event.participants.map(id => Auth.getUserById(id))
        };
    }

    // Initialize events with role-based access
    function initEvents() {
        // Display events in the events section
        const eventsContainer = document.querySelector('.events-grid');
        if (eventsContainer) {
            // Clear existing events
            eventsContainer.innerHTML = '';
            
            // Get current user role
            const currentUser = Auth.getCurrentUser();
            const userRole = currentUser ? currentUser.role : null;
            
            // Filter events based on user role and permissions
            const filteredEvents = events.filter(event => {
                if (!event.restricted) return true;
                if (!currentUser) return false;
                
                // Admin can see all events
                if (userRole === 'admin') return true;
                
                // Teachers can see events they created
                if (userRole === 'teacher' && event.createdBy === currentUser.id) return true;
                
                // Students can see events they're participating in
                if (userRole === 'student' && event.participants.includes(currentUser.id)) return true;
                
                return false;
            });
            
            // Create event cards
            filteredEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.setAttribute('data-event-id', event.id);
                eventCard.innerHTML = `
                    <div class="event-image">
                        <img src="${event.image || 'photos/default-event.png'}" alt="${event.title}">
                        <div class="event-category">${event.category}</div>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p>${event.description.substring(0, 100)}...</p>
                        <div class="event-meta">
                            <span><i class="far fa-calendar"></i> ${event.date}</span>
                            <span><i class="far fa-clock"></i> ${event.time}</span>
                            <span><i class="fas fa-rupee-sign"></i> ₹${event.fee}</span>
                        </div>
                    </div>
                `;
                
                eventsContainer.appendChild(eventCard);
                
                // Add action buttons based on user role
                if (currentUser) {
                    const eventActions = document.createElement('div');
                    eventActions.className = 'event-actions';
                    
                    // Different actions based on role
                    if (Auth.hasPermission('manage_events') || event.createdBy === currentUser.id) {
                        eventActions.innerHTML = `
                            <button class="btn btn-sm edit-event" data-event-id="${event.id}">Edit</button>
                            <button class="btn btn-sm view-participants" data-event-id="${event.id}">Participants</button>
                            <button class="btn btn-sm view-details" data-event-id="${event.id}">View Details</button>
                        `;
                    } else if (Auth.hasPermission('participate')) {
                        const isRegistered = event.participants.includes(currentUser.id);
                        eventActions.innerHTML = `
                            <button class="btn btn-sm ${isRegistered ? 'registered' : 'register-event'}" 
                                data-event-id="${event.id}">
                                ${isRegistered ? 'Registered' : 'Register'}
                            </button>
                            <button class="btn btn-sm view-details" data-event-id="${event.id}">View Details</button>
                        `;
                    }
                    
                    eventCard.querySelector('.event-details').appendChild(eventActions);
                } else {
                    // For non-logged in users, just show view details
                    const eventActions = document.createElement('div');
                    eventActions.className = 'event-actions';
                    eventActions.innerHTML = `
                        <button class="btn btn-sm view-details" data-event-id="${event.id}">View Details</button>
                    `;
                    eventCard.querySelector('.event-details').appendChild(eventActions);
                }
            });
        }
        
        // Add event IDs to existing event cards
        document.querySelectorAll('.event-card:not([data-event-id])').forEach((card, index) => {
            if (index < events.length) {
                card.setAttribute('data-event-id', events[index].id);
            }
        });
        
        // Add event listeners
        document.addEventListener('click', function(e) {
            // Edit event button
            if (e.target.classList.contains('edit-event')) {
                const eventId = parseInt(e.target.dataset.eventId);
                showEditEventModal(eventId);
            }
            
            // View participants button
            if (e.target.classList.contains('view-participants')) {
                const eventId = parseInt(e.target.dataset.eventId);
                showParticipantsModal(eventId);
            }
            
            // Register for event button
            if (e.target.classList.contains('register-event')) {
                const eventId = parseInt(e.target.dataset.eventId);
                const currentUser = Auth.getCurrentUser();
                if (currentUser) {
                    const result = registerForEvent(eventId, currentUser.id);
                    if (result.success) {
                        e.target.classList.remove('register-event');
                        e.target.classList.add('registered');
                        e.target.textContent = 'Registered';
                    } else {
                        alert(result.message);
                    }
                }
            }
        });
    }

    // Show edit event modal
    function showEditEventModal(eventId) {
        const event = getEventById(eventId);
        if (!event) return;
        
        // Create modal HTML
        const modalHTML = `
            <div id="edit-event-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Edit Event</h2>
                    <form id="edit-event-form">
                        <input type="hidden" id="edit-event-id" value="${event.id}">
                        <div class="form-group">
                            <label for="edit-event-title">Title</label>
                            <input type="text" id="edit-event-title" value="${event.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-event-description">Description</label>
                            <textarea id="edit-event-description" rows="3" required>${event.description}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-event-date">Date</label>
                            <input type="text" id="edit-event-date" value="${event.date}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-event-time">Time</label>
                            <input type="text" id="edit-event-time" value="${event.time}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-event-category">Category</label>
                            <input type="text" id="edit-event-category" value="${event.category}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-event-restricted">Restricted Access</label>
                            <select id="edit-event-restricted">
                                <option value="false" ${!event.restricted ? 'selected' : ''}>No</option>
                                <option value="true" ${event.restricted ? 'selected' : ''}>Yes</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Show modal
        const modal = document.getElementById('edit-event-modal');
        modal.style.display = 'block';
        
        // Close modal on X click
        modal.querySelector('.close').addEventListener('click', function() {
            modal.style.display = 'none';
            modal.remove();
        });
        
        // Handle form submission
        document.getElementById('edit-event-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updatedEvent = {
                title: document.getElementById('edit-event-title').value,
                description: document.getElementById('edit-event-description').value,
                date: document.getElementById('edit-event-date').value,
                time: document.getElementById('edit-event-time').value,
                category: document.getElementById('edit-event-category').value,
                restricted: document.getElementById('edit-event-restricted').value === 'true'
            };
            
            const result = updateEvent(eventId, updatedEvent);
            if (result.success) {
                // Update UI
                const eventCard = document.querySelector(`.event-card[data-event-id="${eventId}"]`);
                if (eventCard) {
                    eventCard.querySelector('h3').textContent = updatedEvent.title;
                    eventCard.querySelector('p').textContent = updatedEvent.description;
                    const metaSpans = eventCard.querySelectorAll('.event-meta span');
                    metaSpans[0].innerHTML = `<i class="far fa-calendar"></i> ${updatedEvent.date}`;
                    metaSpans[1].innerHTML = `<i class="far fa-clock"></i> ${updatedEvent.time}`;
                    eventCard.querySelector('.event-category').textContent = updatedEvent.category;
                }
                
                // Close modal
                modal.style.display = 'none';
                modal.remove();
            } else {
                alert(result.message);
            }
        });
    }

    // Show participants modal
    function showParticipantsModal(eventId) {
        const result = getEventParticipants(eventId);
        if (!result.success) {
            alert(result.message);
            return;
        }
        
        const event = getEventById(eventId);
        const participants = result.participants;
        
        // Create modal HTML
        const modalHTML = `
            <div id="participants-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Participants - ${event.title}</h2>
                    <div class="participants-list">
                        ${participants.length === 0 ? '<p>No participants yet</p>' : ''}
                        <ul>
                            ${participants.map(user => `
                                <li>
                                    <div class="participant-info">
                                        <span class="participant-name">${user.name}</span>
                                        <span class="participant-email">${user.email}</span>
                                        <span class="user-role ${user.role}-role">${user.role}</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Show modal
        const modal = document.getElementById('participants-modal');
        modal.style.display = 'block';
        
        // Close modal on X click
        modal.querySelector('.close').addEventListener('click', function() {
            modal.style.display = 'none';
            modal.remove();
        });
    }
    
    // Show event details modal
    function showEventDetailsModal(eventId) {
        const event = getEventById(eventId);
        if (!event) return;
        
        const currentUser = Auth.getCurrentUser();
        const isRegistered = currentUser && event.participants.includes(currentUser.id);
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal-content event-details-content">
                <span class="close-modal">&times;</span>
                <div class="event-header" style="background-image: url('${event.image || 'photos/default-event.png'}')">
                    <div class="event-header-overlay">
                        <h2>${event.title}</h2>
                        <div class="event-category-badge">${event.category}</div>
                    </div>
                </div>
                <div class="event-body">
                    <div class="event-info">
                        <div class="event-meta-details">
                            <div class="event-meta-item">
                                <i class="far fa-calendar"></i>
                                <span>${event.date}</span>
                            </div>
                            <div class="event-meta-item">
                                <i class="far fa-clock"></i>
                                <span>${event.time}</span>
                            </div>
                            <div class="event-meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="event-meta-item">
                                <i class="fas fa-rupee-sign"></i>
                                <span>₹${event.fee}</span>
                            </div>
                        </div>
                        <div class="event-description">
                            <h3>About This Event</h3>
                            <p>${event.description}</p>
                        </div>
                        ${currentUser && !isRegistered ? `
                            <button class="btn btn-primary participate-btn" data-event-id="${event.id}" data-fee="${event.fee}">
                                Register Now
                            </button>
                        ` : ''}
                        ${isRegistered ? `
                            <div class="registration-badge">
                                <i class="fas fa-check-circle"></i> You are registered for this event
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal event-details-modal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal on click
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Add participate button functionality
        const participateBtn = modal.querySelector('.participate-btn');
        if (participateBtn) {
            participateBtn.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                const fee = this.getAttribute('data-fee');
                initiatePayment(eventId, fee);
            });
        }
    }
    
    // Payment gateway integration
    function initiatePayment(eventId, fee) {
        const event = getEventById(eventId);
        if (!event) return;
        
        // Create payment modal
        const paymentModalHTML = `
            <div class="payment-modal-content">
                <span class="close-modal">&times;</span>
                <div class="payment-modal-header">
                    <h2>Secure Payment</h2>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-details">
                        <h3>Event: ${event.title}</h3>
                        <p><strong>Amount:</strong> ₹${fee}</p>
                        
                        <div class="payment-form">
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiry-date">Expiry Date</label>
                                    <input type="text" id="expiry-date" placeholder="MM/YY" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="cvv">CVV</label>
                                    <input type="text" id="cvv" placeholder="123" maxlength="3">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="card-name">Name on Card</label>
                                <input type="text" id="card-name" placeholder="John Doe">
                            </div>
                            <button class="btn btn-primary process-payment-btn">Pay ₹${fee}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create modal
        const paymentModal = document.createElement('div');
        paymentModal.className = 'modal payment-modal';
        paymentModal.innerHTML = paymentModalHTML;
        document.body.appendChild(paymentModal);
        
        // Show modal
        setTimeout(() => {
            paymentModal.classList.add('show');
        }, 10);
        
        // Close modal on click
        paymentModal.querySelector('.close-modal').addEventListener('click', function() {
            paymentModal.classList.remove('show');
            setTimeout(() => {
                paymentModal.remove();
            }, 300);
        });
        
        // Process payment
        paymentModal.querySelector('.process-payment-btn').addEventListener('click', function() {
            // Simulate payment processing
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                // Show success message
                paymentModal.querySelector('.payment-modal-body').innerHTML = `
                    <div class="payment-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Payment Successful!</h3>
                        <p>You have successfully registered for ${event.title}.</p>
                        <p>A confirmation email has been sent to your registered email address.</p>
                        <button class="btn btn-primary close-payment-btn">Close</button>
                    </div>
                `;
                
                // Close on button click
                paymentModal.querySelector('.close-payment-btn').addEventListener('click', function() {
                    paymentModal.classList.remove('show');
                    setTimeout(() => {
                        paymentModal.remove();
                    }, 300);
                });
            }, 2000);
        });
    }

    // Create a new event
    function createEvent(eventData) {
        // Validate required fields
        if (!eventData.title || !eventData.date || !eventData.createdBy) {
            return { success: false, message: 'Missing required fields' };
        }

        // Add event to events array
        events.push(eventData);
        
        // Notify listeners about the new event
        notifyEventChange(eventData, 'create');
        
        return { success: true, event: eventData };
    }

    // Update existing event with enhanced data consistency
    function updateEvent(eventData) {
        const index = events.findIndex(e => e.id == eventData.id);
        if (index === -1) {
            return { success: false, message: 'Event not found' };
        }

        // Update event data
        events[index] = { ...events[index], ...eventData };
        
        // Notify listeners about the updated event
        notifyEventChange(events[index], 'update');
        
        return { success: true, event: events[index] };
    }

    // Public API
    return {
        getAllEvents,
        getEventById,
        getEventsByCreator,
        getEventsByParticipant,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        getEventParticipants,
        initEvents,
        registerEventChangeListener
    };
})();

// Initialize events when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Auth module to load
    if (typeof Auth !== 'undefined') {
        Events.initEvents();
        loadEvents(); // Load events for student dashboard
    } else {
        // If Auth is not loaded yet, wait for it
        window.addEventListener('auth_initialized', Events.initEvents);
    }
});