import api from "./axios";

/**
 * Place a new order
 */
export async function createOrder(orderData) {
  return api.post("/orders", orderData);
}

/**
 * Fetch orders for the logged-in customer
 */
export async function getMyOrders() {
  return api.get("/orders/my-orders");
}

/**
 * Track an order by orderId or id
 */
export async function trackOrder(orderId) {
  return api.get(`/orders/track/${orderId}`);
}

/**
 * Initialize SSLCommerz Payment Session
 */
export async function initSSLCommerzPayment(orderId) {
  return api.post(`/orders/init-payment/${orderId}`);
}
