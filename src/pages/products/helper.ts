
export type ImageField = {
    file: File;
}

export type CreateProduct = Product & {
    image: ImageField;
}

export const convertToFormData = (data: CreateProduct) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'image') {
            formData.append(key, value.file);
        }
        else if (key === 'priceConfiguration') {
            formData.append(key, JSON.stringify(value));
        }
        else if (key === 'attributes') {
            formData.append(key, JSON.stringify(value));
        }
        else {
            formData.append(key, value);
        }
    });
    return formData;
}