import apiClient from "./client";

const DELIVERY_TOKEN_KEY = "delivery_token";

export function getDeliveryToken() {
  return localStorage.getItem(DELIVERY_TOKEN_KEY);
}

export function setDeliveryToken(token) {
  localStorage.setItem(DELIVERY_TOKEN_KEY, token);
}

export function clearDeliverySession() {
  localStorage.removeItem(DELIVERY_TOKEN_KEY);
  localStorage.removeItem("delivery_user");
}

export const deliveryApiClient = apiClient;
