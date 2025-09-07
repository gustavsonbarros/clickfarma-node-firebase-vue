const productRepository = require('../repositories/productRepository');

const sampleProducts = [
  {
    name: "Paracetamol 500mg",
    activePrinciple: "Paracetamol",
    description: "Analgésico e antitérmico",
    category: "Medicamentos",
    subcategory: "Analgésicos",
    manufacturer: "Neo Química",
    price: 8.90,
    originalPrice: 10.90,
    discount: 18,
    stock: 150,
    images: ["https://example.com/paracetamol.jpg"],
    barcode: "7891234567890",
    requiresPrescription: false
  },
  {
    name: "Dipirona Sódica 500mg",
    activePrinciple: "Dipirona Sódica",
    description: "Analgésico e antitérmico",
    category: "Medicamentos",
    subcategory: "Analgésicos",
    manufacturer: "EMS",
    price: 6.50,
    stock: 200,
    images: ["https://example.com/dipirona.jpg"],
    barcode: "7891234567891",
    requiresPrescription: false
  }
];

async function seedProducts() {
  try {
    console.log("Iniciando seed de produtos...");
    
    for (const productData of sampleProducts) {
      const product = await productRepository.create(productData);
      console.log(`Produto criado: ${product.name} (ID: ${product.id})`);
    }
    
    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro no seed:", error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;