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