# Pranav Bakes & Snacks — OneOs Pos test catalog

Source: https://www.zomato.com/coimbatore/pranav-bakes-snacks-periyanaikanpalayam/order

Captured: 2026-09-01

Restaurant details shown by Zomato:

- Address: 7/1-25, SDM Complex, Narasimhanaickenpalayam, Periyanaikanpalayam, Coimbatore
- Phone: +91 95669 43737
- Cuisines: Sandwich, Street Food, Bakery, Fast Food, Pizza, Chinese, Shake
- FSSAI licence: 12425003001659
- Categories: 12
- Products: 107

Zomato does not expose individual selling prices on its desktop order page. Confirm prices from the restaurant owner or Zomato mobile app before entering production prices. Do not use invented prices.

For every OneOs Pos menu item, capture: title, description, selling price, net price, category, applicable tax, food type, variants/add-ons, and whether inventory should be tracked.

## Snacks (12)

- Veg Cutlet [2 Pieces]
- Veg Nuggets [5 Pieces]
- Potato Balls [5 Pieces]
- Veg Puffs
- Paneer Puffs
- Mushroom Puffs
- French Fries
- Bread Omelette
- Egg Puffs
- Chicken Cutlet [1 piece]
- Chicken Pops [5 Pieces]
- Chicken Nuggets [5 Pieces]

## Starters (4)

- Gobi Chilli
- Paneer Chilli
- Mushroom Chilli
- Chicken Chilli

## Fried Rice and Noodles (10)

- Veg Fried Rice
- Mushroom Fried Rice
- Paneer Fried Rice
- Egg Fried Rice
- Chicken Fried Rice
- Veg Noodles
- Mushroom Noodles
- Paneer Noodles
- Egg Noodles
- Chicken Noodles

## Pizza (3)

- Veg Pizza [4 Inches]
- Gobi Chilli Pizza [4 Inches]
- Chicken Pizza [4 Inches]

## Burgers and Sandwiches (10)

- Veg Sandwich
- Paneer Sandwich
- Mushroom Sandwich
- Corn Cheese Sandwich
- Egg Sandwich
- Chicken Sandwich
- Cheese Burger
- Veg Burger
- Chicken Burger
- Chicken Cheese Burger

## Chaat (7)

- Pani Puri [7 Pieces]
- Bhel Puri
- Masala Puri
- Dahi Puri [7 pieces]
- Sev Puri [7 pieces]
- Bhel Puri + Lemon Sarbath [250 ml]
- Bhel Puri + Lime Juice [250 ml]

## Wraps (6)

- Veg Wrap
- Paneer Wrap
- Gobi Chilli Wrap
- Mushroom Chilli Wrap
- Egg Wrap
- Chicken Wrap

## Rolls (6)

- Veg Roll
- Paneer Roll
- Gobi Chilli Roll
- Mushroom Chilli Roll
- Egg Roll
- Chicken Roll

## Pastries (8)

- Butterscotch Pastry
- Black Forest Pastry
- White Forest Pastry
- Choco Truffle Pastry
- Strawberry Pastry
- Mango Pastry
- Blueberry Pastry
- Black Forest Cake [500 g]

## Drinks (Beverages) (33)

- Lime Juice [250 ml]
- Apple Juice [250 ml]
- Mosambi Juice [250 ml]
- Orange Juice [250 ml]
- Pineapple Juice [250 ml]
- Pomegranate Juice [250 ml]
- Muskmelon Juice [250 ml]
- Watermelon Juice [250 ml]
- Vanilla Milkshake [250 ml]
- Butterscotch Milkshake [250 ml]
- Pineapple Milkshake [250 ml]
- Strawberry Milkshake [250 ml]
- Mango Milkshake [250 ml]
- Oreo Milkshake [250 ml]
- Chocolate Milkshake [250 ml]
- Cold Coffee [250 ml]
- Badam Milk [250 ml]
- Rose Milk [250 ml]
- Sarbath [250 ml]
- Soda Sarbath [250 ml]
- Lemon Sarbath [250 ml]
- Masala Sarbath [250 ml]
- Mint Lemon Soda [250 ml]
- Virgin Mojito [250 ml]
- Lemon Mint Mojito [250 ml]
- Blue Curacao Mojito [250 ml]
- Chilli Mojito [250 ml]
- Cotton Candy Mojito [250 ml]
- Plain Lassi [250 ml]
- Choco Lassi [250 ml]
- Strawberry Lassi [250 ml]
- Pineapple Lassi [250 ml]
- Mango Lassi [250 ml]

## Manchurian Varieties (5)

- Tofu Manchurian
- Mushroom Manchurian
- Gobi Manchurian
- Chicken Manchurian
- Paneer Manchurian

## Desserts (3)

- Brownie
- Choco Lava
- Honey Cake

## Recommended minimal end-to-end test set

Enter these first so every main POS path can be tested without loading all 107 products:

1. Veg Puffs — Snacks — piece-based inventory
2. Chicken Puffs — Snacks — piece-based inventory (not currently listed on Zomato; already present in OneOs Pos inventory)
3. Veg Fried Rice — Fried Rice and Noodles — non-inventory menu item
4. Chicken Burger — Burgers and Sandwiches — non-inventory menu item
5. Black Forest Pastry — Pastries — piece-based inventory
6. Lime Juice [250 ml] — Drinks (Beverages) — non-inventory menu item

Before saving test menu items, create the categories, taxes, payment types, and at least one store table. Use prices confirmed by the client.
