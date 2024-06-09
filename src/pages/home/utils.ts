export const getTagColor = (status: string) => {

    if (status === 'Ordered') {
        return "blue"
    }
    if (status === 'Prepared') {
        return "purple"
    }
    if (status === 'Out for delivery') {
        return "orange"
    }
    if (status === 'Delivered') {
        return "green"
    }
    if (status === 'Cancelled') {
        return "red"
    }


}