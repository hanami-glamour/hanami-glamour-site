'use client';

import { useMemo, useState } from 'react';

type Product = { name: string; price: number };
type Category = {
  title: string;
  description: string;
  price: string;
  promotion: string;
  gift: string;
  items: Product[];
};
type CartItem = Product & { category: string; quantity: number };

type Order = {
  id: string;
  customer: string;
  status: string;
  total: string;
  payment: string;
};

const initialCategories: Category[] = [
  {
    title: 'Cosméticos – Adulto',
    description: 'Maquiagem, cuidados com a pele, perfumes e kits de beleza para mulheres.',
    price: 'R$ 29,90',
    promotion: 'Ganhe desconto em kits selecionados.',
    gift: 'Mini mimo em compras participantes.',
    items: [
      { name: 'Kit Beauty Glow', price: 29.9 },
      { name: 'Gloss Shine', price: 18.9 },
      { name: 'Perfume Floral', price: 49.9 },
    ],
  },
  {
    title: 'Cosméticos – Infantil',
    description: 'Produtos delicados para o universo infantil, com visual suave e divertido.',
    price: 'R$ 19,90',
    promotion: 'Kits infantis com valores promocionais.',
    gift: 'Brinde surpresa em compras selecionadas.',
    items: [
      { name: 'Kit Infantil Charm', price: 24.9 },
      { name: 'Brilho Labial Kids', price: 12.9 },
      { name: 'Mini Estojo Fashion', price: 19.9 },
    ],
  },
  {
    title: 'Acessórios Femininos',
    description: 'Presilhas, bolsas, brincos e acessórios elegantes para mulheres.',
    price: 'R$ 15,90',
    promotion: 'Leve 2 acessórios e ganhe desconto especial.',
    gift: 'Laço especial em campanhas selecionadas.',
    items: [
      { name: 'Necessaire Glamour', price: 22.9 },
      { name: 'Brinco Delicado', price: 16.9 },
      { name: 'Presilha Elegance', price: 14.9 },
    ],
  },
  {
    title: 'Acessórios Infantis',
    description: 'Laços, tiaras e acessórios fofos para meninas.',
    price: 'R$ 12,90',
    promotion: 'Monte kits de laços com preço promocional.',
    gift: 'Mimo para pedidos infantis selecionados.',
    items: [
      { name: 'Laço Sakura', price: 11.9 },
      { name: 'Tiara Hanami', price: 13.9 },
      { name: 'Kit Presilhas Kids', price: 17.9 },
    ],
  },
];

const sampleOrders: Order[] = [
  { id: 'HG-001', customer: 'Cliente exemplo', status: 'Novo', total: 'R$ 89,90', payment: 'PIX' },
  { id: 'HG-002', customer: 'Cliente catálogo', status: 'Em separação', total: 'R$ 54,00', payment: 'Crédito' },
];

const promoBlocks = [
  {
    title: 'Promoção da semana',
    description: 'Destaque ofertas especiais para aumentar as vendas.',
    gift: 'Brinde opcional em compras participantes.',
  },
  {
    title: 'Kit especial',
    description: 'Monte kits promocionais para presentear com charme.',
    gift: 'Mimo surpresa para a cliente.',
  },
  {
    title: 'Oferta relâmpago',
    description: 'Campanhas com tempo limitado para incentivar a compra.',
    gift: 'Brinde em pedidos acima de determinado valor.',
  },
];

export default function Page() {
  const whatsappNumber = '5511954238243';
  const [storeName, setStoreName] = useState('Hanami Glamour');
  const [storeAddress, setStoreAddress] = useState('Rua Mogi das Cruzes – Gopoúva');
  const [storeHours, setStoreHours] = useState('08:00 às 18:00');
  const [instagram, setInstagram] = useState('@hanamiglamour');
  const [storePixKey, setStorePixKey] = useState('hanamiglamour@pix.com');
  const [deliveryFee, setDeliveryFee] = useState('R$ 12,00');
  const [deliveryTime, setDeliveryTime] = useState('Até 2 dias úteis');
  const [catalogCards, setCatalogCards] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Débito' | 'Crédito'>('PIX');
  const [blossomPoints] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [adminTab, setAdminTab] = useState<'catalogo' | 'pedidos' | 'entrega' | 'pagamentos' | 'loja'>('catalogo');

  const selectedCategory = catalogCards[selectedCategoryIndex];
  const supportMessage = encodeURIComponent('Olá! Vim pelo site da Hanami Glamour e quero atendimento.');
  const supportLink = `https://wa.me/${whatsappNumber}?text=${supportMessage}`;

  const addToCart = (category: string, product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name && item.category === category);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name && item.category === category
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, category, quantity: 1 }];
    });
  };

  const changeQuantity = (category: string, name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.category === category && item.name === name
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (category: string, name: string) => {
    setCart((prev) => prev.filter((item) => !(item.category === category && item.name === name)));
  };

  const updateCategoryField = (index: number, field: keyof Category, value: string) => {
    setCatalogCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card)),
    );
  };

  const addProductToCategory = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) return;
    const parsed = Number(newProductPrice.replace(',', '.'));
    if (Number.isNaN(parsed)) return;

    setCatalogCards((prev) =>
      prev.map((card, i) =>
        i === selectedCategoryIndex
          ? { ...card, items: [...card.items, { name: newProductName.trim(), price: parsed }] }
          : card,
      ),
    );
    setNewProductName('');
    setNewProductPrice('');
  };

  const removeProductFromCategory = (index: number, productName: string) => {
    setCatalogCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, items: card.items.filter((item) => item.name !== productName) } : card,
      ),
    );
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const earnedBlossoms = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalProducts = useMemo(
    () => catalogCards.reduce((sum, category) => sum + category.items.length, 0),
    [catalogCards],
  );

  const checkoutLink = useMemo(() => {
    const itemsText =
      cart.length > 0
        ? cart
            .map(
              (item) =>
                `- ${item.name} (${item.category}) x${item.quantity} = R$ ${(item.price * item.quantity)
                  .toFixed(2)
                  .replace('.', ',')}`,
            )
            .join('%0A')
        : '- Nenhum item selecionado';

    const text =
      `Olá! Quero fazer este pedido:%0A${itemsText}` +
      `%0ATotal: R$ ${cartTotal.toFixed(2).replace('.', ',')}` +
      `%0AForma de pagamento: ${paymentMethod}` +
      (orderNotes ? `%0AObservações: ${encodeURIComponent(orderNotes)}` : '');

    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }, [cart, cartTotal, orderNotes, paymentMethod]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (email && password) setIsLoggedIn(true);
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-block">
            <img src="/logo-hanami-glamour.jpeg" alt="Hanami Glamour" className="brand-logo" />
            <div>
              <h1 className="brand-title">{storeName}</h1>
              <p className="brand-subtitle">Cosméticos e acessórios femininos e infantis</p>
            </div>
          </div>
          <a href={supportLink} className="button button-primary">
            Atendimento no WhatsApp
          </a>
        </div>
      </header>

      <section className="hero container">
        <div>
          <span className="pill">Visual delicado inspirado no seu logo</span>
          <h2 className="hero-title">Catálogo fácil, carrinho e atendimento rápido</h2>
          <p className="hero-text">
            A cliente encontra cosméticos, acessórios, promoções e brindes, adiciona ao carrinho e
            finaliza o pedido pelo WhatsApp.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="button button-dark">
              Ver catálogo
            </a>
            <a href="#carrinho" className="button button-secondary">
              Ir para o carrinho
            </a>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-visual" />
        </div>
      </section>

      <section className="container grid-four info-grid">
        {catalogCards.map((section) => (
          <article key={section.title} className="card soft-card">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </article>
        ))}
      </section>

      <section className="container section" id="catalogo">
        <div className="section-head">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h3>Produtos separados por setor</h3>
          </div>
          <a href="#carrinho" className="button button-primary">
            Ver carrinho
          </a>
        </div>
        <div className="grid-two gap-lg">
          {catalogCards.map((card) => (
            <article key={card.title} className="card catalog-card">
              <h4>{card.title}</h4>
              <p>{card.description}</p>
              <div className="mini-panels">
                <div className="mini-panel rose">
                  <strong>Preço base</strong>
                  <span>{card.price}</span>
                </div>
                <div className="mini-panel pink">
                  <strong>Promoção</strong>
                  <span>{card.promotion}</span>
                </div>
                <div className="mini-panel lilac">
                  <strong>Brinde</strong>
                  <span>{card.gift}</span>
                </div>
              </div>
              <div className="product-list">
                {card.items.map((item) => (
                  <div key={item.name} className="product-row">
                    <div>
                      <strong>{item.name}</strong>
                      <small>R$ {item.price.toFixed(2).replace('.', ',')}</small>
                    </div>
                    <button className="button button-dark small" onClick={() => addToCart(card.title, item)}>
                      Adicionar
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="card loyalty-card">
          <p className="eyebrow">Programa fidelidade</p>
          <h3>Junte flores de cerejeira e troque por brindes</h3>
          <p className="muted">
            A cada compra, a cliente acumula flores de cerejeira como moeda de troca para brindes.
          </p>
          <div className="grid-three gap-md top-space">
            <div className="card rose-light">
              <p>Flores já acumuladas</p>
              <strong className="big-number">🌸 {blossomPoints}</strong>
            </div>
            <div className="card pink-light">
              <p>Flores nesta compra</p>
              <strong className="big-number">🌸 {earnedBlossoms}</strong>
            </div>
            <div className="card lilac-light">
              <p>Saldo após pedido</p>
              <strong className="big-number">🌸 {blossomPoints + earnedBlossoms}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="grid-three gap-md">
          {promoBlocks.map((promo) => (
            <article key={promo.title} className="card promo-card">
              <h4>{promo.title}</h4>
              <p>{promo.description}</p>
              <div className="mini-panel white-panel">
                <strong>Brinde</strong>
                <span>{promo.gift}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section" id="carrinho">
        <div className="card cart-card">
          <p className="eyebrow">Carrinho</p>
          <h3>Revise os produtos antes de enviar</h3>
          <p className="muted">A cliente pode remover itens e escrever observações como cor, modelo ou tamanho.</p>

          <div className="stack-md top-space">
            {cart.length === 0 ? (
              <div className="empty-box">Seu carrinho está vazio.</div>
            ) : (
              cart.map((item) => (
                <div key={`${item.category}-${item.name}`} className="cart-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.category}</p>
                    <small>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</small>
                  </div>
                  <div className="qty-actions">
                    <button className="qty-button" onClick={() => changeQuantity(item.category, item.name, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button className="qty-button" onClick={() => changeQuantity(item.category, item.name, 1)}>
                      +
                    </button>
                    <button className="button button-dark small" onClick={() => removeFromCart(item.category, item.name)}>
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="payment-grid top-space">
            {(['PIX', 'Débito', 'Crédito'] as const).map((method) => (
              <button
                key={method}
                className={`pay-option ${paymentMethod === method ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>

          <textarea
            className="textarea top-space"
            value={orderNotes}
            onChange={(event) => setOrderNotes(event.target.value)}
            placeholder="Exemplo: quero na cor rosa, tamanho infantil, modelo com brilho..."
          />

          <div className="grid-three gap-md top-space">
            <div className="card rose-light">
              <p>Total do carrinho</p>
              <strong className="big-number">R$ {cartTotal.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div className="card pink-light">
              <p>Flores ganhas</p>
              <strong className="big-number">🌸 {earnedBlossoms}</strong>
            </div>
            <div className="card lilac-light">
              <p>Saldo estimado</p>
              <strong className="big-number">🌸 {blossomPoints + earnedBlossoms}</strong>
            </div>
          </div>

          <div className="checkout-box top-space">
            <a href={checkoutLink} className="button button-primary full-width">
              Enviar pedido no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="card delivery-card">
          <p className="eyebrow">Entrega</p>
          <h3>Consulte taxa e prazo pelo CEP</h3>
          <p className="muted">Campos prontos para futura integração automática de entrega por CEP.</p>
          <div className="grid-three gap-md top-space">
            <input className="input" placeholder="Digite seu CEP" />
            <input className="input" placeholder={deliveryFee} />
            <input className="input" placeholder={deliveryTime} />
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="card login-card">
          <div className="section-head align-center">
            <div>
              <p className="eyebrow">Acesso ao site</p>
              <h3>Entrar com email e senha</h3>
              <p className="muted">Área administrativa demonstrativa para editar catálogo, promoções, brindes e dados da loja.</p>
            </div>
            <span className="status-pill">{isLoggedIn ? 'Acesso liberado' : 'Aguardando login'}</span>
          </div>
          <form onSubmit={handleLogin} className="login-grid top-space">
            <input className="input" type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="button button-primary" type="submit">
              Entrar
            </button>
          </form>
        </div>
      </section>

      {isLoggedIn && (
        <section className="container section">
          <div className="admin-tabs">
            {(['catalogo', 'pedidos', 'entrega', 'pagamentos', 'loja'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAdminTab(tab)}
                className={`tab-button ${adminTab === tab ? 'active' : ''}`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {adminTab === 'catalogo' && (
            <div className="admin-grid top-space">
              <aside className="card sidebar-card">
                <h4>Painel administrativo</h4>
                <div className="stack-sm top-space">
                  {catalogCards.map((card, index) => (
                    <button
                      key={card.title}
                      onClick={() => setSelectedCategoryIndex(index)}
                      className={`sidebar-button ${selectedCategoryIndex === index ? 'selected' : ''}`}
                    >
                      {card.title}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="stack-lg">
                <div className="card">
                  <h4>Editar categoria</h4>
                  <div className="form-grid top-space">
                    <div className="full-span">
                      <label>Título</label>
                      <input
                        className="input"
                        value={selectedCategory.title}
                        onChange={(e) => updateCategoryField(selectedCategoryIndex, 'title', e.target.value)}
                      />
                    </div>
                    <div className="full-span">
                      <label>Descrição</label>
                      <textarea
                        className="textarea"
                        value={selectedCategory.description}
                        onChange={(e) => updateCategoryField(selectedCategoryIndex, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Preço base</label>
                      <input
                        className="input"
                        value={selectedCategory.price}
                        onChange={(e) => updateCategoryField(selectedCategoryIndex, 'price', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Brinde</label>
                      <input
                        className="input"
                        value={selectedCategory.gift}
                        onChange={(e) => updateCategoryField(selectedCategoryIndex, 'gift', e.target.value)}
                      />
                    </div>
                    <div className="full-span">
                      <label>Promoção</label>
                      <textarea
                        className="textarea"
                        value={selectedCategory.promotion}
                        onChange={(e) => updateCategoryField(selectedCategoryIndex, 'promotion', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4>Adicionar produto</h4>
                  <div className="add-product-grid top-space">
                    <input
                      className="input"
                      placeholder="Nome do produto"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Preço"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                    />
                    <button className="button button-primary" onClick={addProductToCategory} type="button">
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h4>Produtos da categoria</h4>
                  <div className="stack-sm top-space">
                    {selectedCategory.items.map((item) => (
                      <div key={item.name} className="product-row admin-row">
                        <div>
                          <strong>{item.name}</strong>
                          <small>R$ {item.price.toFixed(2).replace('.', ',')}</small>
                        </div>
                        <button
                          className="button button-secondary small"
                          type="button"
                          onClick={() => removeProductFromCategory(selectedCategoryIndex, item.name)}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'pedidos' && (
            <div className="grid-two gap-lg top-space">
              <div className="card stack-sm">
                <h4>Pedidos recebidos</h4>
                {sampleOrders.map((order) => (
                  <div key={order.id} className="order-box">
                    <div className="order-head">
                      <div>
                        <strong>{order.id}</strong>
                        <p>{order.customer}</p>
                      </div>
                      <div className="order-tags">
                        <span className="tag filled">{order.status}</span>
                        <span className="tag outlined">{order.payment}</span>
                      </div>
                    </div>
                    <small>Total do pedido: {order.total}</small>
                  </div>
                ))}
              </div>
              <div className="card grid-three admin-summary">
                <div className="card pink-light">
                  <p>Pedidos novos</p>
                  <strong className="big-number">02</strong>
                </div>
                <div className="card rose-light">
                  <p>Produtos cadastrados</p>
                  <strong className="big-number">{totalProducts}</strong>
                </div>
                <div className="card lilac-light">
                  <p>Categorias ativas</p>
                  <strong className="big-number">{catalogCards.length}</strong>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'entrega' && (
            <div className="card top-space">
              <h4>Configurações de entrega</h4>
              <div className="grid-two gap-md top-space">
                <div>
                  <label>Taxa padrão</label>
                  <input className="input" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} />
                </div>
                <div>
                  <label>Prazo estimado</label>
                  <input className="input" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {adminTab === 'pagamentos' && (
            <div className="grid-two gap-lg top-space">
              <div className="card">
                <h4>Pagamentos online</h4>
                <div className="mini-panel rose top-space">
                  <strong>Métodos disponíveis</strong>
                  <span>PIX, débito e crédito já aparecem no site para a cliente.</span>
                </div>
                <div className="top-space">
                  <label>Chave PIX</label>
                  <input className="input" value={storePixKey} onChange={(e) => setStorePixKey(e.target.value)} />
                </div>
              </div>
              <div className="card stack-sm">
                <h4>Próximas integrações</h4>
                <div className="mini-panel pink">Gateway de pagamento para cartão online.</div>
                <div className="mini-panel rose">QR Code PIX automático.</div>
                <div className="mini-panel lilac">Confirmação automática de pagamento no painel.</div>
              </div>
            </div>
          )}

          {adminTab === 'loja' && (
            <div className="grid-two gap-lg top-space">
              <div className="card stack-sm">
                <h4>Informações da loja</h4>
                <div>
                  <label>Nome da loja</label>
                  <input className="input" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div>
                  <label>Endereço</label>
                  <input className="input" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                </div>
                <div>
                  <label>Horário</label>
                  <input className="input" value={storeHours} onChange={(e) => setStoreHours(e.target.value)} />
                </div>
                <div>
                  <label>Instagram</label>
                  <input className="input" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                </div>
              </div>
              <div className="card stack-sm">
                <h4>Status para publicação</h4>
                <div className="mini-panel white-panel success">Visual principal da loja pronto.</div>
                <div className="mini-panel white-panel success">Catálogo e carrinho configurados.</div>
                <div className="mini-panel white-panel warning">Falta conectar login real, banco de dados e pagamentos automáticos.</div>
                <div className="mini-panel white-panel warning">Falta integrar cálculo real de entrega por CEP.</div>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="container section feature-strip">
        <div className="grid-three gap-md">
          <article className="card">
            <p className="eyebrow">Compra segura</p>
            <h4>Atendimento humanizado</h4>
            <p className="muted">A cliente escolhe os produtos, envia detalhes e confirma o pedido com facilidade.</p>
          </article>
          <article className="card">
            <p className="eyebrow">Entrega</p>
            <h4>Consulta por CEP</h4>
            <p className="muted">Base pronta para mostrar taxa de entrega e prazo estimado para a cliente.</p>
          </article>
          <article className="card">
            <p className="eyebrow">Fidelidade</p>
            <h4>Flores de cerejeira</h4>
            <p className="muted">Programa de recompensa visualmente pronto para fortalecer recompra e brindes.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-box">
          <h3>{storeName}</h3>
          <p>
            Endereço: {storeAddress}
            <br />
            Horário: {storeHours}
            <br />
            Dúvidas? Chame no atendimento pelo WhatsApp ou no Instagram {instagram}.
          </p>
          <div className="hero-actions">
            <a href={supportLink} className="button button-light">
              Atendimento via WhatsApp
            </a>
            <a href="#catalogo" className="button button-outline-light">
              Ver catálogo
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
