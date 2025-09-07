const { db } = require('../config/firebase');
// const Product = require('../models/Product'); // 🔇 Comentado temporariamente

class ProductRepository {
  constructor() {
    this.collection = db.collection('products');
  }

  /*
  // 🔇 Métodos comentados para teste - descomente depois

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
  */

  // ✅ Listar todos os produtos ativos - COM FILTROS AVANÇADOS
  async findAll(filters = {}, limit = 20, offset = 0) {
    try {
      console.log('🔄 Buscando produtos com filtros:', filters);
      
      let query = this.collection.where('isActive', '==', true);

      // Aplicar filtros
      if (filters.category) {
        query = query.where('category', '==', filters.category);
        console.log('✅ Filtro categoria:', filters.category);
      }
      if (filters.manufacturer) {
        query = query.where('manufacturer', '==', filters.manufacturer);
        console.log('✅ Filtro fabricante:', filters.manufacturer);
      }
      if (filters.minPrice !== undefined) {
        query = query.where('price', '>=', parseFloat(filters.minPrice));
        console.log('✅ Filtro preço mínimo:', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.where('price', '<=', parseFloat(filters.maxPrice));
        console.log('✅ Filtro preço máximo:', filters.maxPrice);
      }
      if (filters.requiresPrescription !== undefined) {
        const requiresRx = filters.requiresPrescription === 'true';
        query = query.where('requiresPrescription', '==', requiresRx);
        console.log('✅ Filtro receita médica:', requiresRx);
      }

      // Ordenação
      const orderByField = filters.sortBy || 'name';
      const orderDirection = filters.sortOrder === 'desc' ? 'desc' : 'asc';
      query = query.orderBy(orderByField, orderDirection);
      console.log('✅ Ordenação:', orderByField, orderDirection);

      query = query.limit(limit);

      const snapshot = await query.get();
      
      console.log('✅ Snapshot obtido com', snapshot.size, 'documentos');
      
      if (snapshot.empty) {
        console.log('ℹ️  Nenhum produto encontrado com os filtros aplicados');
        return [];
      }

      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log('🎉 Produtos processados:', products.length);
      return products;

    } catch (error) {
      console.error('💥 ERRO no findAll com filtros:', error);
      console.error('📋 Stack:', error.stack);
      throw error;
    }
  }

  // ✅ Buscar produtos por termo de busca - MELHORADO
  async search(searchTerm, limit = 20, offset = 0) {
    try {
      console.log('🔍 Buscando produtos por termo:', searchTerm);
      
      // Busca simples - versão temporária para desenvolvimento
      const snapshot = await this.collection
        .where('isActive', '==', true)
        .get();

      if (snapshot.empty) {
        console.log('ℹ️  Nenhum produto encontrado na busca');
        return [];
      }

      const allProducts = [];
      snapshot.forEach(doc => {
        allProducts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Filtra localmente (para desenvolvimento)
      const filteredProducts = allProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.activePrinciple && product.activePrinciple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log('✅ Resultados da busca:', filteredProducts.length, 'produtos encontrados');

      // Paginação manual
      return filteredProducts.slice(offset, offset + limit);

    } catch (error) {
      console.error('💥 ERRO na busca de produtos:', error);
      console.error('📋 Stack:', error.stack);
      throw new Error(`Erro na busca de produtos: ${error.message}`);
    }
  }

  // ✅ Contagem para busca (para paginação)
  async searchCount(searchTerm) {
    try {
      const products = await this.search(searchTerm, 1000, 0); // Busca todos para contar
      return products.length;
    } catch (error) {
      console.error('💥 ERRO ao contar resultados da busca:', error);
      return 0;
    }
  }

  // ✅ Contar total de produtos com filtros
  async countWithFilters(filters = {}) {
    try {
      const products = await this.findAll(filters, 1000, 0); // Busca todos para contar
      return products.length;
    } catch (error) {
      console.error('💥 ERRO ao contar com filtros:', error);
      return 0;
    }
  }
}

module.exports = new ProductRepository();