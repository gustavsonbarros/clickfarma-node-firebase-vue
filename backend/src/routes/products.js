const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');

// GET /api/products - Listar produtos com paginação
router.get('/', async (req, res) => {
  console.log('🌐 Recebida requisição GET /api/products');
  console.log('📋 Query parameters:', req.query);
  
  try {
    // ⚠️ Versão simplificada para teste - sem filtros complexos
    const products = await productRepository.findAll(10, 0);
    
    console.log('✅ Sucesso! Retornando', products.length, 'produtos');
    
    res.json({
      success: true,
      data: products,
      message: `Encontrados ${products.length} produtos`,
      // ⚠️ Paginação simplificada para teste
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: products.length,
        itemsPerPage: 10
      }
    });

  } catch (error) {
    console.error('💥 ERRO CRÍTICO em /api/products:');
    console.error('📌 Mensagem:', error.message);
    console.error('🔍 Código:', error.code);
    console.error('📋 Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Contate o administrador'
    });
  }
});

// GET /api/products/categories - Listar categorias disponíveis
router.get('/categories', async (req, res) => {
  try {
    console.log('🌐 Recebida requisição GET /api/products/categories');
    
    // Em produção, isso viria do Firestore
    const categories = [
      'Medicamentos',
      'Dermocosméticos',
      'Higiene Pessoal',
      'Vitaminas e Suplementos',
      'Maternidade e Bebê',
      'Saúde Sexual'
    ];

    console.log('✅ Retornando', categories.length, 'categorias');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('💥 ERRO em /api/products/categories:');
    console.error('📌 Mensagem:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao listar categorias'
    });
  }
});

/*
// 🔇 Rotas comentadas para teste - descomente depois

// GET /api/products - Listar produtos com paginação COMPLETA
router.get('/full', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search,
      minPrice,
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Calcular offset para paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Buscar produtos com filtros
    let products;
    let totalCount;

    if (category) {
      products = await productRepository.findByCategory(category, parseInt(limit), offset);
      totalCount = products.length;
    } else if (search) {
      products = await productRepository.search(search, parseInt(limit), offset);
      totalCount = products.length;
    } else {
      products = await productRepository.findAll(parseInt(limit), offset);
      totalCount = await productRepository.count();
    }

    // Aplicar filtros adicionais
    let filteredProducts = products;

    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        let valid = true;
        if (minPrice) valid = valid && product.price >= parseFloat(minPrice);
        if (maxPrice) valid = valid && product.price <= parseFloat(maxPrice);
        return valid;
      });
    }

    // Ordenação
    filteredProducts.sort((a, b) => {
      let valueA = a[sortBy] || 0;
      let valueB = b[sortBy] || 0;

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (sortOrder === 'desc') {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const currentPage = parseInt(page);

    res.json({
      success: true,
      data: filteredProducts,
      pagination: {
        currentPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      },
      filters: {
        category: category || null,
        search: search || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao listar produtos'
    });
  }
});
*/

module.exports = router;