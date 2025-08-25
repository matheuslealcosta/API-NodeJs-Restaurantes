import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpa dados existentes (cuidado em produção!)
    if (process.env.NODE_ENV !== 'production') {
      await prisma.pedido.deleteMany({});
      await prisma.produto.deleteMany({});
      await prisma.restaurante.deleteMany({});
      console.log('🗑️  Dados existentes removidos');
    }

    // Hash para senhas
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    // Cria restaurantes de exemplo
    const restaurantes = await Promise.all([
      prisma.restaurante.create({
        data: {
          nome: 'Pizzaria do Mario',
          email: 'contato@pizzariadomario.com',
          senha: hashedPassword,
          categoria: 'Pizzaria',
          cidade: 'São Paulo',
          endereco: 'Rua Augusta, 1234 - Consolação',
          telefone: '+5511999999001',
        },
      }),
      prisma.restaurante.create({
        data: {
          nome: 'Burguer Station',
          email: 'pedidos@burguerstation.com',
          senha: hashedPassword,
          categoria: 'Hamburgueria',
          cidade: 'Rio de Janeiro',
          endereco: 'Av. Copacabana, 567 - Copacabana',
          telefone: '+5521888888002',
        },
      }),
      prisma.restaurante.create({
        data: {
          nome: 'Sushi Zen',
          email: 'sac@sushizen.com',
          senha: hashedPassword,
          categoria: 'Japonesa',
          cidade: 'São Paulo',
          endereco: 'Rua Oscar Freire, 890 - Jardins',
          telefone: '+5511777777003',
        },
      }),
      prisma.restaurante.create({
        data: {
          nome: 'Cantina da Nonna',
          email: 'nonna@cantina.com',
          senha: hashedPassword,
          categoria: 'Italiana',
          cidade: 'Belo Horizonte',
          endereco: 'Av. Afonso Pena, 2100 - Centro',
          telefone: '+5531666666004',
        },
      }),
      prisma.restaurante.create({
        data: {
          nome: 'Taco Loco',
          email: 'hola@tacoloco.com',
          senha: hashedPassword,
          categoria: 'Mexicana',
          cidade: 'Salvador',
          endereco: 'Rua Chile, 45 - Pelourinho',
          telefone: '+5571555555005',
        },
      }),
    ]);

    console.log(`✅ ${restaurantes.length} restaurantes criados`);

    // Cria produtos para cada restaurante
    const produtos = [];

    // Produtos da Pizzaria do Mario
    const pizzariaProdutos = await Promise.all([
      prisma.produto.create({
        data: {
          nome: 'Pizza Margherita',
          descricao: 'Pizza clássica com molho de tomate, muçarela e manjericão fresco',
          quantidade: '1',
          preco: '32.90',
          categoria: 'Pizza',
          RestauranteId: restaurantes[0].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Pizza Calabresa',
          descricao: 'Pizza com molho, muçarela, calabresa e cebola',
          quantidade: '1',
          preco: '35.90',
          categoria: 'Pizza',
          RestauranteId: restaurantes[0].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Lasanha Bolognesa',
          descricao: 'Lasanha tradicional com molho bolognesa e queijo gratinado',
          quantidade: '1',
          preco: '28.90',
          categoria: 'Massa',
          RestauranteId: restaurantes[0].id,
        },
      }),
    ]);

    // Produtos do Burguer Station
    const burguerProdutos = await Promise.all([
      prisma.produto.create({
        data: {
          nome: 'X-Bacon',
          descricao: 'Hambúrguer com bacon crocante, queijo, alface e tomate',
          quantidade: '1',
          preco: '24.90',
          categoria: 'Hambúrguer',
          RestauranteId: restaurantes[1].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Double Burguer',
          descricao: 'Dois hambúrgueres, queijo duplo, alface, tomate e molho especial',
          quantidade: '1',
          preco: '29.90',
          categoria: 'Hambúrguer',
          RestauranteId: restaurantes[1].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Batata Frita G',
          descricao: 'Porção grande de batata frita crocante',
          quantidade: '1',
          preco: '12.90',
          categoria: 'Acompanhamento',
          RestauranteId: restaurantes[1].id,
        },
      }),
    ]);

    // Produtos do Sushi Zen
    const sushiProdutos = await Promise.all([
      prisma.produto.create({
        data: {
          nome: 'Combo Salmão',
          descricao: '10 peças de sushi e sashimi de salmão fresco',
          quantidade: '10',
          preco: '42.90',
          categoria: 'Combo',
          RestauranteId: restaurantes[2].id,
        },
      }),
      prisma.produto.create({
        data: {
          nome: 'Hot Roll Filadélfia',
          descricao: 'Hot roll com salmão, cream cheese e cebolinha',
          quantidade: '8',
          preco: '38.90',
          categoria: 'Hot Roll',
          RestauranteId: restaurantes[2].id,
        },
      }),
    ]);

    produtos.push(...pizzariaProdutos, ...burguerProdutos, ...sushiProdutos);

    console.log(`✅ ${produtos.length} produtos criados`);

    // Cria alguns pedidos de exemplo
    const pedidos = await Promise.all([
      prisma.pedido.create({
        data: {
          valor_total: '61.80',
          nome_cliente: 'João Silva',
          cidade_cliente: 'São Paulo',
          endereco_cliente: 'Rua das Flores, 123 - Vila Madalena',
          telefone_cliente: '+5511987654321',
          RestauranteId: restaurantes[0].id,
          produtos: {
            connect: [
              { id: pizzariaProdutos[0].id },
              { id: pizzariaProdutos[1].id },
            ],
          },
        },
      }),
      prisma.pedido.create({
        data: {
          valor_total: '37.80',
          nome_cliente: 'Maria Oliveira',
          cidade_cliente: 'Rio de Janeiro',
          endereco_cliente: 'Av. Atlântica, 456 - Copacabana',
          telefone_cliente: '+5521987654322',
          RestauranteId: restaurantes[1].id,
          produtos: {
            connect: [
              { id: burguerProdutos[0].id },
              { id: burguerProdutos[2].id },
            ],
          },
        },
      }),
      prisma.pedido.create({
        data: {
          valor_total: '42.90',
          nome_cliente: 'Carlos Santos',
          cidade_cliente: 'São Paulo',
          endereco_cliente: 'Rua Oscar Freire, 789 - Jardins',
          telefone_cliente: '+5511987654323',
          RestauranteId: restaurantes[2].id,
          produtos: {
            connect: [{ id: sushiProdutos[0].id }],
          },
        },
      }),
    ]);

    console.log(`✅ ${pedidos.length} pedidos criados`);

    console.log(`
🎉 Seed concluído com sucesso!

📊 Resumo:
- ${restaurantes.length} restaurantes
- ${produtos.length} produtos  
- ${pedidos.length} pedidos

🔐 Login de teste:
Email: contato@pizzariadomario.com
Senha: 123456

🌐 Acesse:
- API: http://localhost:3000
- Docs: http://localhost:3000/api-docs
- Health: http://localhost:3000/health
    `);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Falha no seed:', e);
    process.exit(1);
  });
