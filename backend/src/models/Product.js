const { Timestamp } = require('firebase-admin/firestore');

class Product {
  constructor({
    name,
    activePrinciple,
    description = '',
    category,
    subcategory = '',
    manufacturer,
    price,
    originalPrice,
    discount = 0,
    stock = 0,
    images = [],
    barcode = '',
    requiresPrescription = false,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.name = name;
    this.activePrinciple = activePrinciple;
    this.description = description;
    this.category = category;
    this.subcategory = subcategory;
    this.manufacturer = manufacturer;
    this.price = price;
    this.originalPrice = originalPrice || price;
    this.discount = discount;
    this.stock = stock;
    this.images = images;
    this.barcode = barcode;
    this.requiresPrescription = requiresPrescription;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toFirestore() {
    return {
      name: this.name,
      activePrinciple: this.activePrinciple,
      description: this.description,
      category: this.category,
      subcategory: this.subcategory,
      manufacturer: this.manufacturer,
      price: Number(this.price),
      originalPrice: Number(this.originalPrice),
      discount: Number(this.discount),
      stock: Number(this.stock),
      images: this.images,
      barcode: this.barcode,
      requiresPrescription: Boolean(this.requiresPrescription),
      isActive: Boolean(this.isActive),
      createdAt: Timestamp.fromDate(new Date(this.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(this.updatedAt))
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Product({
      id: doc.id,
      name: data.name,
      activePrinciple: data.activePrinciple,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      manufacturer: data.manufacturer,
      price: data.price,
      originalPrice: data.originalPrice,
      discount: data.discount,
      stock: data.stock,
      images: data.images,
      barcode: data.barcode,
      requiresPrescription: data.requiresPrescription,
      isActive: data.isActive,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    });
  }

  // Método para calcular preço com desconto
  get finalPrice() {
    return this.originalPrice * (1 - this.discount / 100);
  }

  // Método para verificar disponibilidade
  isAvailable() {
    return this.isActive && this.stock > 0;
  }
}

module.exports = Product;