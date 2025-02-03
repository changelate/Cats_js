document.addEventListener("DOMContentLoaded", () => {
    const catContainer = document.getElementById("catContainer");
    const allCatsBtn = document.getElementById("allCatsBtn");
    const favCatsBtn = document.getElementById("favCatsBtn");
    const loadingText = document.getElementById("loadingText");

    let cats = [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let view = "all";
    let page = 1;
    let loading = false;

    async function fetchCats() {
        if (loading) return;
        loading = true;
        loadingText.style.display = "block";

        try {
            const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10&page=${page}`);
            const data = await response.json();
            cats = [...cats, ...data];
            renderCats();
        } catch (error) {
            console.error("Ошибка загрузки котиков:", error);
        } finally {
            loading = false;
            loadingText.style.display = "none";
        }
    }

    function renderCats() {
        catContainer.innerHTML = "";
        const displayedCats = view === "all" ? cats : favorites;

        displayedCats.forEach(cat => {
            const isFavorite = favorites.some(fav => fav.id === cat.id);
            const catCard = document.createElement("div");
            catCard.classList.add("cat-card");

            const img = document.createElement("img");
            img.src = cat.url;
            img.alt = "Cat";

            const favButton = document.createElement("button");
            favButton.classList.add("favorite");
            favButton.innerHTML = isFavorite
                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="red" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="gray" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/></svg>`;

            favButton.addEventListener("click", () => toggleFavorite(cat));
            img.addEventListener("click", () => toggleFavorite(cat)); // Добавил клик на изображение

            catCard.appendChild(img);
            catCard.appendChild(favButton);
            catContainer.appendChild(catCard);
        });
    }

    function toggleFavorite(cat) {
        const isFavorite = favorites.some(fav => fav.id === cat.id);
        if (isFavorite) {
            favorites = favorites.filter(fav => fav.id !== cat.id);
        } else {
            favorites.push(cat);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderCats();
    }

    function changeView(newView) {
        view = newView;
        allCatsBtn.classList.toggle("active", view === "all");
        favCatsBtn.classList.toggle("active", view === "favorites");
        renderCats();
    }

    allCatsBtn.addEventListener("click", () => changeView("all"));
    favCatsBtn.addEventListener("click", () => changeView("favorites"));

    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && view === "all" && !loading) {
            page++;
            fetchCats();
        }
    });

    fetchCats();
});
