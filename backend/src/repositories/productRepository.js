const { db } = require('../config/firebase');
const Product = require('../models/Product');

class ProductRepository {
  constructor() {
    this.collection = db.collection('products');
  }

  // Criar novo produto
  async create(productData) {
    try {
      const product = new Product(productData);
      const docRef = await this.collection.add(product.toFirestore());
      
      return {
        id: docRef.id,
        ...product.toFirestore()
      };
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  // Buscar produto por ID
  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      
      return Product.fromFirestore(doc);
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  // Listar todos os produtos ativos
  async findAll(limit = 20, offset = 0) {
    try {
      const snapshot = await this.collection
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map(doc => Product.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao listar produtos: ${error.message}`);
    }
  }

  // Buscar produtos por categoria
  async findByCategory(category, limit = 20, offset = 0) {
    try {
      const snapshot = await this.collection
        .where('category', '==', category)
        .where('isActive', '==', true)
        .orderBy('name')
        .limit(limit)
        .offset(offset)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map(doc => Product.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Erro ao buscar por categoria: ${error.message}`);
    }
  }

  // Atualizar produto
  async update(id, updateData) {
    try {
      updateData.updatedAt = new Date();
      await this.collection.doc(id).update(updateData);
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  // Deletar produto (soft delete)
  async delete(id) {
    try {
      return await this.update(id, { isActive: false });
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  // Contar total de produtos ativos
  async count() {
    try {
      const snapshot = await this.collection
        .where('isActive', '==', true)
        .count()
        .get();

      return snapshot.data().count;
    } catch (error) {
      throw new Error(`Erro ao contar produtos: ${error.message}`);
    }
  }
}

module.exports = new ProductRepository();