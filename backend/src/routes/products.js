const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');

// GET /api/products - Listar produtos com paginação e filtros
router.get('/', async (req, res) => {
  console.log('🌐 Recebida requisição GET /api/products');
  console.log('📋 Query parameters:', req.query);
  
  try {
    const { 
      page = 1, 
      limit = 20,
      category,
      manufacturer,
      minPrice,
      maxPrice,
      requiresPrescription,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Calcular offset para paginação
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Buscar produtos com filtros
    const products = await productRepository.findAll({
      category,
      manufacturer,
      minPrice,
      maxPrice,
      requiresPrescription,
      sortBy,
      sortOrder
    }, parseInt(limit), offset);

    // Contar total para paginação
    const totalCount = await productRepository.countWithFilters({
      category,
      manufacturer,
      minPrice,
      maxPrice,
      requiresPrescription
    });

    console.log('✅ Sucesso! Retornando', products.length, 'produtos de', totalCount, 'encontrados');
    
    // Calcular totais para paginação
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const currentPage = parseInt(page);

    res.json({
      success: true,
      data: products,
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
        manufacturer: manufacturer || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        requiresPrescription: requiresPrescription || null,
        sortBy,
        sortOrder
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

// GET /api/products/search - Busca por texto (mantida para compatibilidade)
router.get('/search', async (req, res) => {
  try {
    const { 
      q: searchTerm, 
      page = 1, 
      limit = 20 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const products = await productRepository.search(searchTerm, parseInt(limit), offset);
    const totalCount = await productRepository.searchCount(searchTerm);

    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const currentPage = parseInt(page);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      },
      filters: {
        search: searchTerm
      }
    });

  } catch (error) {
    console.error('Erro na busca de produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor na busca'
    });
  }
});
*/

module.exports = router;