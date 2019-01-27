export function stableSort<T>(
    array: T[],
    comparator: (a: any, b: any) => number,
): T[] {
    const stabilizedArray = array.map(
        (el: T, index: number): [T, number] => [el, index],
    );

    stabilizedArray.sort((a: [T, number], b: [T, number]) => {
        const order = comparator(a[0], b[0]);
        return order === 0 ? a[1] - b[1] : order;
    });

    return stabilizedArray.map(el => el[0]);
}
