export const stableSort = (
    array: any[],
    comparator: (a: any, b: any) => number,
) => {
    const stabilizedArray = array.map((el: any, index: number) => [el, index]);

    stabilizedArray.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        return order === 0 ? a[1] - b[1] : order;
    });

    return stabilizedArray.map(el => el[0]);
};
