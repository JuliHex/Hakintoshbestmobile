(() => {
    const laptops = LaptopDB.all();
    document.getElementById('laptop-count').textContent = laptops.length;
    document.getElementById('top-laptops').innerHTML = laptops
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(laptop => UI.laptopCard(laptop))
        .join('');
})();
