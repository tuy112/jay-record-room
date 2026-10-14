export const getTodayDate = () => {
    const today = new Date();

    return today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })  .replace(/\./g, '-')    .replace(/\s/g, '')    .slice(0, -1);
};