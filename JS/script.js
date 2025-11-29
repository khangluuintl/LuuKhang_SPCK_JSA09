// ============================================
// MAIN APPLICATION SCRIPT
// Uses CarAPI for all data operations
// ============================================

// Global state
let allCars = [];
let filteredCars = [];
let currentUser = null;

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

/**
 * Check if user is logged in
 */
function checkAuthStatus() {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    currentUser = JSON.parse(userStr);
    updateAuthUI();
    return true;
  }
  return false;
}

function updateAuthUI() {
  const loginBtn = document.querySelector('button[onclick*="login.html"]');
  
  if (currentUser && loginBtn) {
    loginBtn.outerHTML = `
      <div class="relative">
        <button id="user-menu-btn" class="flex items-center space-x-2 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>${currentUser.username}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <a href="bookings.html" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Bookings</a>
          <button onclick="logout()" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
        </div>
      </div>
    `;

    // Add event listener for user menu
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (userMenuBtn && userMenu) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
      });

      // Close menu when clicking outside
      document.addEventListener('click', () => {
        userMenu.classList.add('hidden');
      });
    }
  }
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  window.location.href = 'index.html';
}

// ============================================
// CAR DATA FUNCTIONS (Using CarAPI)
// ============================================

async function loadCars() {
  try {
    showLoading();
    const response = await CarAPI.getAllCars();
    
    if (response.success) {
      allCars = response.data;
      filteredCars = [...allCars];
      displayCars(filteredCars);
      updateResultCount(filteredCars.length);
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError('Failed to load cars. Please try again later.');
    console.error('Error loading cars:', error);
  } finally {
    hideLoading();
  }
}

async function searchCars(query) {
  if (!query.trim()) {
    filteredCars = [...allCars];
    displayCars(filteredCars);
    updateResultCount(filteredCars.length);
    return;
  }

  try {
    showLoading();
    const response = await CarAPI.searchCars(query);
    
    if (response.success) {
      filteredCars = response.data;
      displayCars(filteredCars);
      updateResultCount(filteredCars.length);
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError('Search failed. Please try again.');
    console.error('Error searching cars:', error);
  } finally {
    hideLoading();
  }
}

function displayCars(cars) {
  const carsGrid = document.getElementById('cars-grid');
  if (!carsGrid) return;

  if (cars.length === 0) {
    carsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No cars found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
    `;
    return;
  }

  carsGrid.innerHTML = cars.map(car => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <img src="${car.image}" alt="${car.name}" class="w-full h-48 object-cover">
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-gray-900">${car.name}</h3>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">${car.category}</span>
        </div>
        <p class="text-gray-600 text-sm mb-4">${car.supplier}</p>
        
        <div class="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            ${car.seats} Seats
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            ${car.fuel}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            ${car.transmission}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            ${car.rating}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-primary">$${car.price}</span>
            <span class="text-gray-600 text-sm">/day</span>
          </div>
          <button onclick="openBookingModal(${car.id})" class="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function applyFilters() {
  let filtered = [...allCars];

  const categoryBtns = document.querySelectorAll('[data-category]');
  const activeCategories = Array.from(categoryBtns)
    .filter(btn => btn.classList.contains('bg-primary'))
    .map(btn => btn.dataset.category);
  
  if (activeCategories.length > 0) {
    filtered = filtered.filter(car => activeCategories.includes(car.category));
  }

  const transmissionBtns = document.querySelectorAll('[data-transmission]');
  const activeTransmissions = Array.from(transmissionBtns)
    .filter(btn => btn.classList.contains('bg-primary'))
    .map(btn => btn.dataset.transmission);
  
  if (activeTransmissions.length > 0) {
    filtered = filtered.filter(car => activeTransmissions.includes(car.transmission));
  }

  const fuelBtns = document.querySelectorAll('[data-fuel]');
  const activeFuels = Array.from(fuelBtns)
    .filter(btn => btn.classList.contains('bg-primary'))
    .map(btn => btn.dataset.fuel);
  
  if (activeFuels.length > 0) {
    filtered = filtered.filter(car => activeFuels.includes(car.fuel));
  }

  const priceSlider = document.getElementById('price-slider');
  if (priceSlider) {
    const maxPrice = parseInt(priceSlider.value);
    filtered = filtered.filter(car => car.price <= maxPrice);
  }

  filteredCars = filtered;
  displayCars(filteredCars);
  updateResultCount(filteredCars.length);
}

function sortCars(sortBy) {
  switch (sortBy) {
    case 'price-low':
      filteredCars.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredCars.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredCars.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      filteredCars.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  displayCars(filteredCars);
}

function updateResultCount(count) {
  const resultCount = document.getElementById('result-count');
  if (resultCount) {
    resultCount.textContent = `${count} car${count !== 1 ? 's' : ''} available`;
  }
}

// ============================================
// BOOKING FUNCTIONS (Using CarAPI)
// ============================================

async function openBookingModal(carId) {
  if (!currentUser) {
    alert('Please login to book a car');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await CarAPI.getCarById(carId);
    
    if (!response.success) {
      alert(response.message);
      return;
    }

    const car = response.data;
    const modal = document.getElementById('booking-modal');
    const modalContent = document.getElementById('modal-car-details');

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="w-full h-48 object-cover rounded-lg mb-4">
      <h3 class="text-2xl font-bold text-gray-900 mb-2">${car.name}</h3>
      <p class="text-gray-600 mb-4">${car.category} • ${car.supplier}</p>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex items-center text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          ${car.seats} Seats
        </div>
        <div class="flex items-center text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          ${car.fuel}
        </div>
        <div class="flex items-center text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
          ${car.transmission}
        </div>
        <div class="flex items-center text-gray-700">
          <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          ${car.rating} Rating
        </div>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <p class="text-3xl font-bold text-primary">$${car.price} <span class="text-lg font-normal text-gray-600">/day</span></p>
      </div>
    `;

    modal.dataset.carId = carId;
    modal.classList.remove('hidden');

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickup-date').min = today;
    document.getElementById('return-date').min = today;
  } catch (error) {
    alert('Failed to load car details. Please try again.');
    console.error('Error opening booking modal:', error);
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('booking-form').reset();
  }
}

function calculatePrice() {
  const pickupDate = document.getElementById('pickup-date').value;
  const returnDate = document.getElementById('return-date').value;
  const modal = document.getElementById('booking-modal');
  const carId = parseInt(modal.dataset.carId);

  if (!pickupDate || !returnDate) return;

  const car = allCars.find(c => c.id === carId);
  if (!car) return;

  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

  if (days > 0) {
    const totalPrice = car.price * days;
    const priceDisplay = document.getElementById('total-price');
    if (priceDisplay) {
      priceDisplay.innerHTML = `
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Total for ${days} day${days !== 1 ? 's' : ''}</p>
          <p class="text-3xl font-bold text-green-600">$${totalPrice.toFixed(2)}</p>
        </div>
      `;
    }
  }
}

async function submitBooking(event) {
  event.preventDefault();

  const modal = document.getElementById('booking-modal');
  const carId = parseInt(modal.dataset.carId);
  const pickupDate = document.getElementById('pickup-date').value;
  const returnDate = document.getElementById('return-date').value;
  const pickupLocation = document.getElementById('pickup-location').value;
  const specialRequests = document.getElementById('special-requests').value;

  // Validate dates
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  
  if (returnD <= pickup) {
    alert('Return date must be after pickup date');
    return;
  }

  const car = allCars.find(c => c.id === carId);
  if (!car) {
    alert('Car not found');
    return;
  }

  const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
  const totalPrice = car.price * days;

  const bookingData = {
    carId: carId,
    carName: car.name,
    carImage: car.image,
    userId: currentUser.email,
    userName: currentUser.username,
    pickupDate: pickupDate,
    returnDate: returnDate,
    pickupLocation: pickupLocation,
    specialRequests: specialRequests,
    days: days,
    pricePerDay: car.price,
    totalPrice: totalPrice
  };

  try {
    showLoading();
    const response = await CarAPI.createBooking(bookingData);
    
    // Note for me: The booking is saved in localStorage.
    if (response.success) {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(response.data);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      closeBookingModal();
      
      if (confirm(`Booking confirmed!\n\nBooking Number: ${response.data.bookingNumber}\nTotal: $${totalPrice.toFixed(2)}\n\nWould you like to view your bookings?`)) {
        window.location.href = 'bookings.html';
      }
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Booking failed. Please try again.');
    console.error('Error submitting booking:', error);
  } finally {
    hideLoading();
  }
}

// This function loads the bookings.
async function loadUserBookings() {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  try {
    showLoading();
    const response = await CarAPI.getUserBookings(currentUser.email);
    
    if (response.success) {
      displayBookings(response.data);
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError('Failed to load bookings. Please try again.');
    console.error('Error loading bookings:', error);
  } finally {
    hideLoading();
  }
}

function displayBookings(bookings) {
  const container = document.getElementById('bookings-container');
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start by browsing our available cars.</p>
        <div class="mt-6">
          <a href="cars.html" class="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Browse Cars
          </a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map(booking => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <div class="md:flex">
        <div class="md:w-1/3">
          <img src="${booking.carImage}" alt="${booking.carName}" class="w-full h-48 md:h-full object-cover">
        </div>
        <div class="p-6 md:w-2/3">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900">${booking.carName}</h3>
              <p class="text-sm text-gray-600">Booking #${booking.bookingNumber}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-sm font-semibold ${
              booking.status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }">
              ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-sm text-gray-600">Pickup Date</p>
              <p class="font-semibold">${new Date(booking.pickupDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Return Date</p>
              <p class="font-semibold">${new Date(booking.returnDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Duration</p>
              <p class="font-semibold">${booking.days} day${booking.days !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Pickup Location</p>
              <p class="font-semibold">${booking.pickupLocation}</p>
            </div>
          </div>

          ${booking.specialRequests ? `
            <div class="mb-4">
              <p class="text-sm text-gray-600">Special Requests</p>
              <p class="text-sm">${booking.specialRequests}</p>
            </div>
          ` : ''}

          <div class="flex justify-between items-center pt-4 border-t">
            <div>
              <p class="text-sm text-gray-600">Total Price</p>
              <p class="text-2xl font-bold text-primary">$${booking.totalPrice.toFixed(2)}</p>
            </div>
            ${booking.status === 'confirmed' ? `
              <button onclick="cancelBooking(${booking.id})" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Cancel Booking
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Cancel booking using API
 */
async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }

  try {
    showLoading();
    const response = await CarAPI.cancelBooking(bookingId);
    
    if (response.success) {
      alert('Booking cancelled successfully');
      loadUserBookings(); // Reload bookings
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Failed to cancel booking. Please try again.');
    console.error('Error cancelling booking:', error);
  } finally {
    hideLoading();
  }
}



// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication status
  checkAuthStatus();

  // Cars page initialization
  if (document.getElementById('cars-grid')) {
    loadCars();

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchCars(e.target.value);
      });
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortCars(e.target.value);
      });
    }

    // Category filters
    const categoryBtns = document.querySelectorAll('[data-category]');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('bg-primary');
        btn.classList.toggle('text-white');
        btn.classList.toggle('bg-gray-200');
        btn.classList.toggle('text-gray-700');
        applyFilters();
      });
    });

    // Transmission filters
    const transmissionBtns = document.querySelectorAll('[data-transmission]');
    transmissionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('bg-primary');
        btn.classList.toggle('text-white');
        btn.classList.toggle('bg-gray-200');
        btn.classList.toggle('text-gray-700');
        applyFilters();
      });
    });

    // Fuel filters
    const fuelBtns = document.querySelectorAll('[data-fuel]');
    fuelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('bg-primary');
        btn.classList.toggle('text-white');
        btn.classList.toggle('bg-gray-200');
        btn.classList.toggle('text-gray-700');
        applyFilters();
      });
    });

    // Price slider
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    if (priceSlider && priceValue) {
      priceSlider.addEventListener('input', (e) => {
        priceValue.textContent = `$${e.target.value}`;
        applyFilters();
      });
    }

    // Mobile filter toggle
    const filterToggle = document.getElementById('filter-toggle');
    const filtersSection = document.getElementById('filters-section');
    if (filterToggle && filtersSection) {
      filterToggle.addEventListener('click', () => {
        filtersSection.classList.toggle('hidden');
      });
    }
  }

  // Booking modal
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', submitBooking);

    // Date change listeners for price calculation
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    if (pickupDate && returnDate) {
      pickupDate.addEventListener('change', calculatePrice);
      returnDate.addEventListener('change', calculatePrice);
    }
  }

  // Close modal button
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeBookingModal);
  }

  // Close modal on outside click
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Bookings page initialization
  if (document.getElementById('bookings-container')) {
    loadUserBookings();
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showLoading() {
  const resultCount = document.getElementById('result-count');
  if (resultCount) {
    resultCount.textContent = 'Loading cars...';
  }
}

function hideLoading() {
  // Loading state is cleared by updateResultCount
}

function showError(message) {
  const resultCount = document.getElementById('result-count');
  if (resultCount) {
    resultCount.textContent = message;
    resultCount.classList.add('text-red-600');
  }
  console.error(message);
}

// Make functions globally accessible
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.cancelBooking = cancelBooking;
window.logout = logout;
