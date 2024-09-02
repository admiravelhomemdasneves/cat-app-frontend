import ProductEntity from "../entities/productEntity";
import { ENDPOINTS } from "../util/Constants";
import apiClient from "../api/apiClient";

const ENDPOINT = ENDPOINTS.PRODUCTS;

export const getProducts = async () => {
    const response = await apiClient.get(ENDPOINT);

    const products = response.data.map(productData => {
        return new ProductEntity(
            productData.id_product,
            productData.name,
            productData.brand,
            productData.productType,
            productData.description
        );
    });

    return products;
}

export const getProductById = async (id) => {
    const response = await apiClient.get(`${ENDPOINT}/${id}`);

    const product = new ProductEntity(
        response.data.id_product,
        response.data.name,
        response.data.brand,
        response.data.productType,
        response.data.description,
    );

    return product;
}

export const postProduct = async (product) => {
    const productData = product.toObject();
    const response = await apiClient.post(ENDPOINT, productData);

    return response;
}

export const putProduct = async (product) => {
    const productData = product.toObject();
    const response = await apiClient.put(ENDPOINT, productData);

    return response;
}

export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`${ENDPOINT}/${id}`);

    return response;
};