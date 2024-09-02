import { toContactEntity } from "../entities/contactEntity";
import { ENDPOINTS } from "../util/Constants";
import apiClient from "../api/apiClient";

const ENDPOINT = ENDPOINTS.CONTACT;

export const getContact = async () => {
    const response = await apiClient.get(ENDPOINT);

    const result = response.data.map(data => {
        return toContactEntity(data);
    });

    return result;
}

export const getContactById = async (id) => {
    const response = await apiClient.get(`${ENDPOINT}/${id}`);

    const result = toContactEntity(response.data);

    return result;
}

export const postContact = async (obj) => {
    const data = obj.toObject();
    const response = await apiClient.post(ENDPOINT, data);

    return response;
}

export const putContact = async (obj) => {
    const data = obj.toObject();
    const response = await apiClient.put(ENDPOINT, data);

    return response;
}

export const deleteContact = async (id) => {
    const response = await apiClient.delete(`${ENDPOINT}/${id}`);

    return response;
};