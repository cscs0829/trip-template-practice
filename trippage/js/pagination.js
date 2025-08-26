
function renderPagination(paginationId, current, total, loadFunction) {
    const pag = document.getElementById(paginationId);
    if (!pag) return;
    pag.innerHTML = '';

    function addPage(label, pageNum, disabled = false, active = false) {
        const a = document.createElement('a');
        a.href = '#';
        a.className = active ? 'pagin-number active' : (label === 'prev' || label === 'next' ? 'pagination-arrow' : 'pagin-number');
        if (label === 'prev') a.classList.add('arrow-left');
        if (label === 'next') a.classList.add('arrow-right');
        a.innerHTML = label === 'prev' ? '<span class="ion-ios-arrow-back"></span>' : (label === 'next' ? '<span class="ion-ios-arrow-forward"></span>' : String(pageNum));
        if (disabled) a.style.pointerEvents = 'none';
        a.addEventListener('click', function(e){ e.preventDefault(); if (!disabled) loadFunction(pageNum); });
        pag.appendChild(a);
    }

    addPage('prev', Math.max(1, current - 1), current === 1);
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let p = start; p <= end; p++) {
        addPage(null, p, false, p === current);
    }
    addPage('next', Math.min(total, current + 1), current === total);
}
