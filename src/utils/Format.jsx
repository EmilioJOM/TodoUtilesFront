export const currency = (v) => {
    const n = Number(v);
    if (isNaN(n) || v == null) return "$0.00";
    return `$${n.toFixed(2)}`;
};