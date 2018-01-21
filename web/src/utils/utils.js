export const stableSort = (array, comparator) => {
    const stabilizedArray = array.map((el, index) => [el, index]);

    stabilizedArray.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    return stabilizedArray.map(el => el[0]);
};
