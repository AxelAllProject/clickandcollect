import React from 'react';
import { pickProductArt } from '../illustrations/products';

/**
 * Visuel d'un produit du catalogue : la photo renseignée par l'admin si elle
 * existe, sinon une illustration de la charte choisie d'après le nom du
 * produit. Remplit toujours son conteneur (les deux rendus sont en cover).
 */
const ProductImage = ({ product = {}, className = '', imageClassName = '' }) => {
    const { name, productName, description, imageUrl, productImageUrl } = product;
    const label = name || productName || 'Produit';
    const url = imageUrl || productImageUrl;

    if (url) {
        return <img src={url} alt={label} className={`w-full h-full object-cover ${className} ${imageClassName}`} />;
    }

    const Art = pickProductArt(label, description);
    return <Art className={`w-full h-full object-cover ${className}`} />;
};

export default ProductImage;
