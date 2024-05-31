/// <reference types="vite/client" />
type Credentials = {
    email: string;
    password: string;
}

interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    tenant: Tenant
}

interface Tenant {
    id: number,
    name: string,
    address: string
}

interface ErrorResponse {
    errors: {
        location: string;
        message: string;
        path: string;
        type: string;
    }[];
}

interface FilterValues {
    search?: string;
    role?: string;
    tenantId?: string;
    orderStatus?: string;
}
interface ProductAttribute {
    name: string;
    value: string | boolean;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    image: string;
    categoryId: string;
    tenantId: string;
    priceConfiguration: PriceConfigration;
    attributes: ProductAttribute[];
}

interface Category {
    _id: string;
    name: string;
    priceConfiguration: PriceConfigration;
    attributes: Attribute[];
}

interface CreateCategory {
    name: string;
    priceConfiguration: PriceConfigration;
    attributes: Attribute[];
}

interface PriceConfigration {
    [key: string]: {
        priceType: "base" | "aditional";
        availableOptions: string[];
    };
}

interface Attribute {
    name: string;
    widgetType: "radio" | "switch";
    defaultValue: string;
    availableOptions: string[];
}

interface Topping {
    _id: string;
    name: string;
    price: number;
    image: string;
    tenantId: string;
}

interface Coupon {
    _id: string;
    couponCode: string;
    discount: number;
}

interface AddressType {
    _id: string;
    name: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    pincode: string;
    city: string;
    state: string;
    userId?: string;
}

interface OrderItemType {
    _id: string;
    qty: number;
    totalPrice: number;
    hash: string;
    image: string;
    name: string;
    chosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedToppings: Topping[];
    };
    priceConfiguration: {
        [key: string]: {
            priceType: 'base' | 'aditional';
            availableOptions: {
                [key: string]: number;
            };
        };
    };
}

