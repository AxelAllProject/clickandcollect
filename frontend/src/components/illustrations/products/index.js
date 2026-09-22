import BreadArt from './BreadArt';
import CheeseArt from './CheeseArt';
import CoffeeArt from './CoffeeArt';
import CroissantArt from './CroissantArt';
import DrinkArt from './DrinkArt';
import EclairArt from './EclairArt';
import FruitArt from './FruitArt';
import GroceryBagArt from './GroceryBagArt';
import QuicheArt from './QuicheArt';
import SaladArt from './SaladArt';
import SandwichArt from './SandwichArt';
import TartArt from './TartArt';

/**
 * Chaque produit du catalogue n'a pas forcément de photo : plutôt qu'une icône
 * grise, on lui associe une illustration maison choisie d'après son nom (puis,
 * à défaut, sa description). Les mots-clés sont écrits sans accent, la
 * comparaison se faisant sur une chaîne normalisée.
 */
const ART_RULES = [
    { art: CroissantArt, keywords: ['croissant', 'viennoiserie', 'pain au chocolat', 'chocolatine', 'brioche', 'chausson'] },
    { art: BreadArt, keywords: ['pain', 'baguette', 'miche', 'levain', 'campagne', 'ficelle', 'boule'] },
    { art: TartArt, keywords: ['tarte', 'tartelette', 'flan', 'clafoutis', 'crumble', 'gateau', 'galette'] },
    { art: QuicheArt, keywords: ['quiche', 'tourte', 'feuillete', 'pizza', 'croque', 'gratin', 'lasagne'] },
    { art: SaladArt, keywords: ['salade', 'crudite', 'bowl', 'taboule', 'cesar', 'verrine'] },
    { art: EclairArt, keywords: ['eclair', 'chocolat', 'patisserie', 'choux', 'religieuse', 'millefeuille', 'macaron', 'dessert'] },
    { art: SandwichArt, keywords: ['sandwich', 'wrap', 'panini', 'burger', 'baguette garnie', 'club'] },
    { art: DrinkArt, keywords: ['jus', 'boisson', 'limonade', 'smoothie', 'soda', 'eau', 'cidre', 'biere', 'vin'] },
    { art: CoffeeArt, keywords: ['cafe', 'the', 'chocolat chaud', 'capuccino', 'cappuccino', 'expresso', 'infusion', 'latte'] },
    { art: CheeseArt, keywords: ['fromage', 'chevre', 'comte', 'brie', 'camembert', 'yaourt', 'crememerie', 'beurre'] },
    { art: FruitArt, keywords: ['fruit', 'legume', 'pomme', 'poire', 'carotte', 'panier', 'saison', 'tomate', 'primeur'] },
];

const normalize = (value = '') =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');

const findArt = (text) => {
    if (!text) return null;
    const haystack = normalize(text);
    const rule = ART_RULES.find(({ keywords }) => keywords.some((keyword) => haystack.includes(keyword)));
    return rule ? rule.art : null;
};

/** Illustration la plus cohérente pour un produit, sac kraft par défaut. */
export const pickProductArt = (name, description) =>
    findArt(name) || findArt(description) || GroceryBagArt;

export {
    BreadArt,
    CheeseArt,
    CoffeeArt,
    CroissantArt,
    DrinkArt,
    EclairArt,
    FruitArt,
    GroceryBagArt,
    QuicheArt,
    SaladArt,
    SandwichArt,
    TartArt,
};
