-- Insert sample categories
insert into public.categories (name, slug, description) values
  ('Eau de Parfum', 'eau-de-parfum', 'Long-lasting luxury fragrances with high concentration'),
  ('Eau de Toilette', 'eau-de-toilette', 'Fresh and light daily fragrances'),
  ('Oud Collection', 'oud-collection', 'Premium oriental oud fragrances'),
  ('Unisex', 'unisex', 'Versatile fragrances for everyone');

-- Insert sample products
insert into public.products (name, slug, description, price, category_id, stock, featured, notes, size) values
  (
    'Royal Oud Essence',
    'royal-oud-essence',
    'A luxurious blend of aged oud wood with hints of rose and amber. This signature fragrance captures the essence of Middle Eastern luxury.',
    15999.00,
    (select id from public.categories where slug = 'oud-collection'),
    50,
    true,
    ARRAY['Bergamot, Saffron', 'Rose, Oud Wood', 'Amber, Musk'],
    '100ml'
  ),
  (
    'Midnight Noir',
    'midnight-noir',
    'An enigmatic evening fragrance with deep notes of black pepper, leather, and vanilla. Perfect for special occasions.',
    12999.00,
    (select id from public.categories where slug = 'eau-de-parfum'),
    40,
    true,
    ARRAY['Black Pepper, Lavender', 'Leather, Iris', 'Vanilla, Tonka Bean'],
    '50ml'
  ),
  (
    'Citrus Dawn',
    'citrus-dawn',
    'A refreshing morning scent featuring bright citrus notes and fresh herbs. Ideal for daily wear.',
    8999.00,
    (select id from public.categories where slug = 'eau-de-toilette'),
    75,
    true,
    ARRAY['Lemon, Bergamot, Mint', 'Rosemary, Basil', 'Cedar, White Musk'],
    '100ml'
  ),
  (
    'Desert Rose',
    'desert-rose',
    'A sophisticated unisex fragrance combining rich rose with warm spices and woody undertones.',
    13999.00,
    (select id from public.categories where slug = 'unisex'),
    30,
    false,
    ARRAY['Pink Pepper, Cardamom', 'Rose, Geranium', 'Sandalwood, Patchouli'],
    '75ml'
  ),
  (
    'Velvet Musk',
    'velvet-musk',
    'A soft, sensual musk fragrance with powdery iris and warm amber. Timeless elegance in a bottle.',
    11999.00,
    (select id from public.categories where slug = 'eau-de-parfum'),
    60,
    false,
    ARRAY['Neroli, Iris', 'White Musk, Ylang-Ylang', 'Amber, Vanilla'],
    '50ml'
  ),
  (
    'Spice Route',
    'spice-route',
    'An exotic journey through oriental spices, woods, and resins. Bold and captivating.',
    14999.00,
    (select id from public.categories where slug = 'oud-collection'),
    25,
    false,
    ARRAY['Cinnamon, Nutmeg', 'Incense, Myrrh, Oud', 'Benzoin, Amber'],
    '100ml'
  );
