export const goToRef = (ref, topMargin = 77) => {
    window.scroll({
        top: 0,
        behavior: 'auto'
    });

    window.scroll({
        top: topMargin,
        behavior: 'auto'
    });

    window.scroll({
        top: (ref.getBoundingClientRect().top),
        behavior: 'auto'
    })
};

export const formatDate = (date) => {
    const objDate = new Date(date);
    return `${objDate.toLocaleString('en', {month: 'long'})} ` +
        `${objDate.toLocaleString('en', {day: 'numeric'})}, ` +
        `${objDate.toLocaleString('en', {year: 'numeric'})}`;
};