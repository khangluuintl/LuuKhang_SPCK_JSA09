const CarAPI = {
  config: {
    timeout: 2000 // Làm cho chậm phản hồi để mô phỏng độ trễ mạng 
  },

// The promise is probably to represent the eventual completion or failure of the API synchronization (could be wrong)
  _simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, this.config.timeout));
  },

  database: [
    {
      id: 1,
      name: 'Toyota Camry',
      category: 'Sedan',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 5,
      price: 75,
      rating: 4.5,
      image: 'https://www.topgear.com/sites/default/files/2024/06/2025_Camry_XLE_AWD_OceanGem_100_1.jpg?w=1784&h=1004',
      supplier: 'AutoEx Rentals',
      features: ['Air Conditioning', 'Bluetooth', 'USB Port'],
      available: true,
      location: 'Tan Son Nhat Airport Terminal 2'
    },
    {
      id: 2,
      name: 'Honda CR-V',
      category: 'SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 7,
      price: 50,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
      supplier: 'AutoEx Rentals VN',
      features: ['Air Conditioning', 'GPS', 'Bluetooth', 'Backup Camera'],
      available: true,
      location: 'Vincom Center Basement 2'
    },
    {
      id: 3,
      name: 'Tesla Model 3',
      category: 'Electric',
      transmission: 'Automatic',
      fuel: 'Electric',
      seats: 5,
      price: 85,
      rating: 4.9,
      image: 'https://cdn.motor1.com/images/mgl/rK4wYx/s1/2024-tesla-model-3-us.jpg',
      supplier: 'AutoEx Rentals EV',
      features: ['Autopilot', 'Premium Sound', 'Supercharging'],
      available: true,
      location: 'Landmark 81 Basement 3'
    },
    {
      id: 4,
      name: 'Ford Mustang',
      category: 'Sports',
      transmission: 'Manual',
      fuel: 'Gasoline',
      seats: 4,
      price: 105,
      rating: 4.6,
      image: 'https://quatrorodas.abril.com.br/wp-content/uploads/2022/09/Ford-Mustang-2024-1.jpg',
      supplier: 'AutoEx Rentals Sports',
      features: ['Sport Mode', 'Premium Audio', 'Leather Seats'],
      available: true,
      location: 'Saigon Royal Novaland Basement 2'
    },
    {
      id: 5,
      name: 'Volkswagen Golf',
      category: 'Compact',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      price: 55,
      rating: 4.3,
      image: 'https://m.atcdn.co.uk/ect/media/%7Bresize%7D/48eb2e32f54d470e999842c5b95d64de.jpg',
      supplier: 'SIXT',
      features: ['Air Conditioning', 'Bluetooth'],
      available: true,
      location: 'Ben Thanh Metro Station Parking Lot'
    },
    {
      id: 6,
      name: 'BMW X5',
      category: 'Luxury SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 7,
      price: 135,
      rating: 4.8,
      image: 'https://www.motortrend.com/uploads/2024/04/4-2025-BMW-X5-Competition-front-view.jpg',
      supplier: 'SIXT Luxury',
      features: ['Panoramic Roof', 'Premium Sound', 'Heated Seats', 'GPS'],
      available: true,
      location: 'Saigon Center Basement 3'
    },
    {
      id: 7,
      name: 'Nissan Leaf',
      category: 'Electric',
      transmission: 'Automatic',
      fuel: 'Electric',
      seats: 5,
      price: 55,
      rating: 4.4,
      image: 'https://cdn.arstechnica.net/wp-content/uploads/2025/06/250308_All-new_Nissan_LEAF_Dynamic_Pictures_02.jpg',
      supplier: 'AutoEx Rentals EV',
      features: ['Eco Mode', 'Fast Charging', 'Bluetooth'],
      available: true,
      location: 'Landmark 81 Basement 2'
    },
    {
      id: 8,
      name: 'Chevrolet Suburban',
      category: 'Large SUV',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 9,
      price: 75,
      rating: 4.5,
      image: 'https://www.motortrend.com/uploads/2023/10/MY25_Chevrolet_Suburban_HC.jpg',
      supplier: 'Hertz',
      features: ['Third Row', 'Towing Package', 'Entertainment System'],
      available: true,
      location: 'Tan Son Nhat Airport Terminal 1'
    },
    {
      id: 9,
      name: 'Mini Cooper',
      category: 'Compact',
      transmission: 'Manual',
      fuel: 'Gasoline',
      seats: 4,
      price: 90,
      rating: 4.2,
      image: 'https://www.topgear.com/sites/default/files/images/news-article/carousel/2018/01/1ca7ff64f05d88984f6ddfa4ac125336/p90289438_highres_mini-cooper-s-3-door.jpg',
      supplier: 'Budget',
      features: ['Sport Mode', 'Bluetooth', 'USB Port'],
      available: true,
      location: 'Vincom Center Basement 1'
    },
    {
      id: 10,
      name: 'Mercedes-Benz S-Class',
      category: 'Luxury Sedan',
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 5,
      price: 175,
      rating: 4.9,
      image: 'https://th.bing.com/th/id/R.d19e01cec38d4c9c7afbf2b6b00c08b8?rik=5Xl4CqApppWfEw&pid=ImgRaw&r=0',
      supplier: 'SIXT',
      features: ['Massage Seats', 'Premium Sound', 'Ambient Lighting', 'Chauffeur Available'],
      available: true,
      location: 'The Opera Residence Basement 4'
    }
  ],

  // If I don't have this, the API will fail to fetch data for some reason.
  _createResponse(success, data, message = '') {
    return {
      success,
      data,
      message,
      timestamp: new Date().toISOString(),
      apiVersion: '1.0.0'
    };
  },

// Async normally returns a new promise, await makes it wait for the promise to resolve
  async getAllCars(filters = {}) {
    await this._simulateDelay();

    try {
      let cars = [...this.database];

      if (filters.category) {
        cars = cars.filter(car => car.category === filters.category);
      }
      if (filters.transmission) {
        cars = cars.filter(car => car.transmission === filters.transmission);
      }
      if (filters.fuel) {
        cars = cars.filter(car => car.fuel === filters.fuel);
      }
      if (filters.maxPrice) {
        cars = cars.filter(car => car.price <= filters.maxPrice);
      }
      if (filters.minSeats) {
        cars = cars.filter(car => car.seats >= filters.minSeats);
      }
      if (filters.available !== undefined) {
        cars = cars.filter(car => car.available === filters.available);
      }

      return this._createResponse(true, cars, 'Cars fetched successfully');
    } catch (error) {
      return this._createResponse(false, [], `Error fetching cars: ${error.message}`);
    }
  },

  /** // AI gợi ý thêm vào
   * GET /cars/:id - Fetch a specific car by ID
   * @param {number} carId - The car ID
   * @returns {Promise} API response with car data
   */
  async getCarById(carId) {
    await this._simulateDelay();

    try {
      const car = this.database.find(c => c.id === carId);
      
      if (!car) {
        return this._createResponse(false, null, `Car with ID ${carId} not found`);
      }

      return this._createResponse(true, car, 'Car fetched successfully');
    } catch (error) {
      return this._createResponse(false, null, `Error fetching car: ${error.message}`);
    }
  },

  /**
   * GET /cars/search - Search cars by query
   * @param {string} query - Search query
   * @returns {Promise} API response with matching cars
   */
  async searchCars(query) {
    await this._simulateDelay();

    try {
      const lowerQuery = query.toLowerCase();
      const cars = this.database.filter(car => 
        car.name.toLowerCase().includes(lowerQuery) ||
        car.category.toLowerCase().includes(lowerQuery) ||
        car.supplier.toLowerCase().includes(lowerQuery) ||
        car.features.some(f => f.toLowerCase().includes(lowerQuery))
      );

      return this._createResponse(true, cars, `Found ${cars.length} matching cars`);
    } catch (error) {
      return this._createResponse(false, [], `Error searching cars: ${error.message}`);
    }
  },

  /**
   * GET /categories - Get all unique car categories
   * @returns {Promise} API response with categories
   */
  async getCategories() {
    await this._simulateDelay();

    try {
      const categories = [...new Set(this.database.map(car => car.category))];
      return this._createResponse(true, categories, 'Categories fetched successfully');
    } catch (error) {
      return this._createResponse(false, [], `Error fetching categories: ${error.message}`);
    }
  },

  /**
   * GET /suppliers - Get all unique suppliers
   * @returns {Promise} API response with suppliers
   */
  async getSuppliers() {
    await this._simulateDelay();

    try {
      const suppliers = [...new Set(this.database.map(car => car.supplier))];
      return this._createResponse(true, suppliers, 'Suppliers fetched successfully');
    } catch (error) {
      return this._createResponse(false, [], `Error fetching suppliers: ${error.message}`);
    }
  },

  /**
   * POST /bookings - Create a new booking
   * @param {Object} bookingData - Booking information
   * @returns {Promise} API response with booking confirmation
   */
  async createBooking(bookingData) {
    await this._simulateDelay();

    try {
      if (!bookingData.carId || !bookingData.userId || !bookingData.pickupDate || !bookingData.returnDate) {
        return this._createResponse(false, null, 'Missing required booking information');
      }

      const car = this.database.find(c => c.id === bookingData.carId);
      if (!car) {
        return this._createResponse(false, null, 'Car not found');
      }
      if (!car.available) {
        return this._createResponse(false, null, 'Car is not available');
      }

      const booking = {
        id: Date.now(),
        bookingNumber: `BK${Date.now()}`,
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      return this._createResponse(true, booking, 'Booking created successfully');
    } catch (error) {
      return this._createResponse(false, null, `Error creating booking: ${error.message}`);
    }
  },

  /**
   * GET /bookings/:userId - Get all bookings for a user
   * @param {string} userId - User ID (email)
   * @returns {Promise} API response with user bookings
   */
  async getUserBookings(userId) {
    await this._simulateDelay();

    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const userBookings = bookings.filter(b => b.userId === userId);

      return this._createResponse(true, userBookings, `Found ${userBookings.length} bookings`);
    } catch (error) {
      return this._createResponse(false, [], `Error fetching bookings: ${error.message}`);
    }
  },

  /**
   * PUT /bookings/:id/cancel - Cancel a booking
   * @param {number} bookingId - Booking ID
   * @returns {Promise} API response with cancellation confirmation
   */
  async cancelBooking(bookingId) {
    await this._simulateDelay();

    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);

      if (bookingIndex === -1) {
        return this._createResponse(false, null, 'Booking not found');
      }

      bookings[bookingIndex].status = 'cancelled';
      bookings[bookingIndex].cancelledAt = new Date().toISOString();
      localStorage.setItem('bookings', JSON.stringify(bookings));

      return this._createResponse(true, bookings[bookingIndex], 'Booking cancelled successfully');
    } catch (error) {
      return this._createResponse(false, null, `Error cancelling booking: ${error.message}`);
    }
  },

  /**
   * GET /stats - Get API statistics
   * @returns {Promise} API response with statistics
   */
  async getStats() {
    await this._simulateDelay();

    try {
      const stats = {
        totalCars: this.database.length,
        availableCars: this.database.filter(c => c.available).length,
        categories: [...new Set(this.database.map(c => c.category))].length,
        suppliers: [...new Set(this.database.map(c => c.supplier))].length,
        averagePrice: (this.database.reduce((sum, c) => sum + c.price, 0) / this.database.length).toFixed(2),
        averageRating: (this.database.reduce((sum, c) => sum + c.rating, 0) / this.database.length).toFixed(2)
      };

      return this._createResponse(true, stats, 'Statistics fetched successfully');
    } catch (error) {
      return this._createResponse(false, null, `Error fetching stats: ${error.message}`);
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CarAPI;
}
