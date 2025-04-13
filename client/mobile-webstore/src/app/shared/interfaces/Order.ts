export interface Order {
    uuid: string;
    user: string;
    contact: {
        email: string;
        phone: string;
    };
    products: string[];
    status: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        country: string;
        city: string;
        zip: string;
        street: string;
        houseNumber: string;
        isPo: boolean;
    };
    shippingMethod: string;
    shippingCost: number;
    billingAddress: {
        firstName: string;
        lastName: string;
        country: string;
        city: string;
        zip: string;
        street: string;
        houseNumber: string;
    };
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    tax: number;
    total: number;
    orderTime: string;
    paymentTime: string;
    transactionId: string;
    confirmationTime: string;
    estimatedDelivery: string;
    shippingTime: string;
    deliveryTime: string;
}
