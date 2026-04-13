/**
 * Cuisine groups for the pre-search filter.
 * Each group maps to Google Places API types.
 * When ALL groups are enabled, we use broad parent types for max coverage.
 * When specific groups are selected, we send their exact types as `includedTypes`.
 */

const CUISINE_GROUPS = [
  {
    id: 'american',
    label: 'American',
    emoji: '🍔',
    types: [
      'american_restaurant', 'hamburger_restaurant', 'steak_house',
      'barbecue_restaurant', 'chicken_restaurant', 'chicken_wings_restaurant',
      'cajun_restaurant', 'californian_restaurant', 'soul_food_restaurant',
      'southwestern_us_restaurant', 'diner', 'family_restaurant',
      'hot_dog_restaurant', 'hot_dog_stand',
    ],
  },
  {
    id: 'asian',
    label: 'Asian',
    emoji: '🍜',
    types: [
      'asian_restaurant', 'asian_fusion_restaurant', 'chinese_restaurant',
      'chinese_noodle_restaurant', 'cantonese_restaurant', 'dim_sum_restaurant',
      'dumpling_restaurant', 'hot_pot_restaurant', 'japanese_restaurant',
      'japanese_curry_restaurant', 'japanese_izakaya_restaurant', 'ramen_restaurant',
      'sushi_restaurant', 'tonkatsu_restaurant', 'yakiniku_restaurant',
      'yakitori_restaurant', 'korean_restaurant', 'korean_barbecue_restaurant',
      'thai_restaurant', 'vietnamese_restaurant', 'noodle_shop',
      'taiwanese_restaurant', 'fusion_restaurant',
    ],
  },
  {
    id: 'south_asian',
    label: 'South Asian',
    emoji: '🍛',
    types: [
      'indian_restaurant', 'north_indian_restaurant', 'south_indian_restaurant',
      'pakistani_restaurant', 'bangladeshi_restaurant', 'sri_lankan_restaurant',
      'tibetan_restaurant', 'burmese_restaurant',
    ],
  },
  {
    id: 'southeast_asian',
    label: 'Southeast Asian',
    emoji: '🥘',
    types: [
      'indonesian_restaurant', 'malaysian_restaurant', 'filipino_restaurant',
      'cambodian_restaurant',
    ],
  },
  {
    id: 'european',
    label: 'European',
    emoji: '🍝',
    types: [
      'european_restaurant', 'italian_restaurant', 'french_restaurant',
      'spanish_restaurant', 'tapas_restaurant', 'greek_restaurant',
      'german_restaurant', 'bavarian_restaurant', 'british_restaurant',
      'irish_restaurant', 'portuguese_restaurant', 'dutch_restaurant',
      'belgian_restaurant', 'swiss_restaurant', 'austrian_restaurant',
      'scandinavian_restaurant', 'danish_restaurant', 'polish_restaurant',
      'czech_restaurant', 'hungarian_restaurant', 'romanian_restaurant',
      'russian_restaurant', 'ukrainian_restaurant', 'croatian_restaurant',
      'eastern_european_restaurant', 'basque_restaurant', 'fondue_restaurant',
    ],
  },
  {
    id: 'latin_american',
    label: 'Latin American',
    emoji: '🌮',
    types: [
      'mexican_restaurant', 'tex_mex_restaurant', 'taco_restaurant',
      'burrito_restaurant', 'brazilian_restaurant', 'argentinian_restaurant',
      'peruvian_restaurant', 'colombian_restaurant', 'cuban_restaurant',
      'chilean_restaurant', 'caribbean_restaurant', 'latin_american_restaurant',
      'south_american_restaurant',
    ],
  },
  {
    id: 'middle_eastern',
    label: 'Middle Eastern',
    emoji: '🧆',
    types: [
      'middle_eastern_restaurant', 'lebanese_restaurant', 'turkish_restaurant',
      'persian_restaurant', 'israeli_restaurant', 'falafel_restaurant',
      'kebab_shop', 'shawarma_restaurant', 'gyro_restaurant',
      'halal_restaurant', 'afghani_restaurant', 'mongolian_barbecue_restaurant',
    ],
  },
  {
    id: 'african',
    label: 'African',
    emoji: '🍲',
    types: [
      'african_restaurant', 'ethiopian_restaurant', 'moroccan_restaurant',
      'australian_restaurant',
    ],
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    emoji: '🫒',
    types: [
      'mediterranean_restaurant', 'seafood_restaurant', 'oyster_bar_restaurant',
      'fish_and_chips_restaurant',
    ],
  },
  {
    id: 'fast_food',
    label: 'Fast Food',
    emoji: '🍟',
    types: [
      'fast_food_restaurant', 'pizza_restaurant', 'pizza_delivery',
      'sandwich_shop', 'food_court', 'snack_bar', 'buffet_restaurant',
      'meal_takeaway', 'meal_delivery',
    ],
  },
  {
    id: 'breakfast',
    label: 'Breakfast & Brunch',
    emoji: '🥞',
    types: [
      'breakfast_restaurant', 'brunch_restaurant', 'bagel_shop',
      'deli', 'cafeteria',
    ],
  },
  {
    id: 'coffee_tea',
    label: 'Coffee & Tea',
    emoji: '☕',
    types: [
      'cafe', 'coffee_shop', 'coffee_roastery', 'coffee_stand',
      'tea_house', 'cat_cafe', 'dog_cafe',
    ],
  },
  {
    id: 'bakery_desserts',
    label: 'Bakery & Desserts',
    emoji: '🧁',
    types: [
      'bakery', 'pastry_shop', 'cake_shop', 'donut_shop',
      'ice_cream_shop', 'dessert_restaurant', 'dessert_shop',
      'chocolate_shop', 'chocolate_factory', 'confectionery',
      'candy_store', 'acai_shop',
    ],
  },
  {
    id: 'bars_pubs',
    label: 'Bars & Pubs',
    emoji: '🍺',
    types: [
      'bar', 'bar_and_grill', 'pub', 'irish_pub', 'sports_bar',
      'wine_bar', 'cocktail_bar', 'lounge_bar', 'hookah_bar',
      'beer_garden', 'brewery', 'brewpub', 'winery', 'gastropub',
    ],
  },
  {
    id: 'fine_dining',
    label: 'Fine Dining',
    emoji: '🍽️',
    types: [
      'fine_dining_restaurant', 'bistro', 'western_restaurant',
      'restaurant',
    ],
  },
  {
    id: 'healthy',
    label: 'Healthy & Veggie',
    emoji: '🥗',
    types: [
      'vegan_restaurant', 'vegetarian_restaurant', 'salad_shop',
      'juice_shop', 'soup_restaurant', 'hawaiian_restaurant',
    ],
  },
];

// Broad parent types used when all groups are enabled (catches everything)
export const ALL_FOOD_TYPES = [
  'restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery',
  'bar', 'coffee_shop',
];

export default CUISINE_GROUPS;
