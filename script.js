const movies = [
{
    id: 1,
    title: "Big Buck Bunny",
    category: "Animation",
    type: "popular",
    image: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    description: "An animated adventure featuring a friendly giant rabbit.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
},
{
    id: 2,
    title: "Elephant Dream",
    category: "Animation",
    type: "trending",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400",
    description: "Explore a mysterious animated world.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
},
{
    id: 3,
    title: "Sintel",
    category: "Fantasy",
    type: "popular",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
    description: "A fantasy adventure about friendship and courage.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
},
{
    id: 4,
    title: "Tears of Steel",
    category: "Sci-Fi",
    type: "trending",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400",
    description: "A science fiction adventure.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
},
{
    id: 5,
    title: "For Bigger Escape",
    category: "Adventure",
    type: "african",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
    description: "An exciting adventure sample.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
},
{
    id: 6,
    title: "For Bigger Fun",
    category: "Comedy",
    type: "series",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400",
    description: "Enjoy this entertaining video sample.",
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
}
];

let isSignup = false;

function createCard(movie) {
    return `
    <div class="movie-card" onclick="showMovie(${movie.id})">
        <img src="${movie.image}" alt="${movie.title}"
        onerror="this.src='https://placehold.co/300x450/222/fff?text=NOVA%2B'">
        <h3>${movie.title}</h3>
        <p>${movie.category}</p>
    </div>`;
}

function loadMovies() {
    document.getElementById("trendingMovies").innerHTML =
        movies.filter(m => m.type === "trending").map(createCard).join("");

    document.getElementById("popularMovies").innerHTML =
        movies.filter(m => m.type === "popular").map(createCard).join("");

    document.getElementById("africanMovies").innerHTML =
        movies.filter(m => m.type === "african").map(createCard).join("");

    document.getElementById("seriesMovies").innerHTML =
        movies.filter(m => m.type === "series" || m.category === "Animation").map(createCard).join("");

    const history = JSON.parse(localStorage.getItem("history") || "[]");

    document.getElementById("continueMovies").innerHTML =
        history.map(id => movies.find(m => m.id === id))
        .filter(Boolean).map(createCard).join("");
}

function hideAll() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("accountPage").classList.add("hidden");
    document.getElementById("playerPage").classList.add("hidden");
    document.getElementById("detailsPage").classList.add("hidden");
}

function showHome() {
    hideAll();
    document.getElementById("home").classList.remove("hidden");
    loadMovies();
}

function showAccount() {
    hideAll();
    document.getElementById("accountPage").classList.remove("hidden");
}

function toggleAccount() {
    isSignup = !isSignup;

    document.getElementById("accountTitle").innerText =
        isSignup ? "Create Account" : "Welcome to NOVA+";

    document.getElementById("accountMessage").innerText =
        isSignup ? "Join NOVA+ today." : "Sign in to your account.";

    document.getElementById("username").style.display =
        isSignup ? "block" : "none";

    document.getElementById("submitBtn").innerText =
        isSignup ? "Create Account" : "Sign In";

    document.getElementById("switchText").innerHTML =
        isSignup
        ? 'Already have an account? <a onclick="toggleAccount()">Sign In</a>'
        : 'New to NOVA+? <a onclick="toggleAccount()">Create Account</a>';
}

function submitAccount() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();

    if (!email || !password) {
        alert("Enter your email and password.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("novaUsers") || "{}");

    if (isSignup) {
        if (!username) {
            alert("Enter your username.");
            return;
        }

        if (users[email]) {
            alert("Account already exists.");
            return;
        }

        users[email] = { username, password };

        localStorage.setItem("novaUsers", JSON.stringify(users));

        alert("Account created! Please sign in.");

        toggleAccount();

    } else {
        if (!users[email] || users[email].password !== password) {
            alert("Incorrect email or password.");
            return;
        }

        localStorage.setItem("novaSession", email);

        updateAccountButton();

        showHome();
    }
}

function updateAccountButton() {
    const email = localStorage.getItem("novaSession");
    const btn = document.getElementById("accountBtn");

    if (email) {
        btn.innerText = "Sign Out";
        btn.onclick = logout;
    } else {
        btn.innerText = "Sign In";
        btn.onclick = showAccount;
    }
}

function logout() {
    localStorage.removeItem("novaSession");
    updateAccountButton();
    alert("You have signed out.");
    showHome();
}

function showMovie(id) {
    const movie = movies.find(m => m.id === id);

    if (!movie) return;

    hideAll();

    document.getElementById("detailsPage").classList.remove("hidden");

    document.getElementById("detailImage").src = movie.image;
    document.getElementById("detailTitle").innerText = movie.title;
    document.getElementById("detailDescription").innerText = movie.description;
    document.getElementById("detailCategory").innerText = movie.category;

    document.getElementById("detailPlay").onclick = () => playMovie(id);
}

function showFeatured() {
    showMovie(1);
}

function playFeatured() {
    playMovie(1);
}

function playMovie(id) {
    const email = localStorage.getItem("novaSession");

    if (!email) {
        alert("Please sign in before watching.");
        showAccount();
        return;
    }

    const movie = movies.find(m => m.id === id);

    hideAll();

    document.getElementById("playerPage").classList.remove("hidden");
    document.getElementById("playingTitle").innerText = movie.title;
    document.getElementById("playingDescription").innerText = movie.description;

    const player = document.getElementById("videoPlayer");

    player.src = movie.video;
    player.load();

    player.play().catch(() => {
        alert("Video could not start. Please check your internet connection.");
    });

    let history = JSON.parse(localStorage.getItem("history") || "[]");

    history = [id, ...history.filter(x => x !== id)].slice(0, 10);

    localStorage.setItem("history", JSON.stringify(history));
}

function closePlayer() {
    const player = document.getElementById("videoPlayer");

    player.pause();
    player.removeAttribute("src");
    player.load();

    showHome();
}

function searchMovies() {
    const query = document.getElementById("search").value.toLowerCase();

    hideAll();
    document.getElementById("home").classList.remove("hidden");

    document.querySelectorAll(".category").forEach(section => {
        section.classList.add("hidden");
    });

    document.querySelectorAll(".category").forEach(section => {
        const heading = section.querySelector("h2");

        if (heading && heading.innerText.includes("Trending")) {
            section.classList.remove("hidden");
        }
    });

    const results = movies.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
    );

    let section = document.getElementById("popularMovies");

    section.innerHTML = results.map(createCard).join("");

    section.parentElement.querySelector("h2").innerText = "Search Results";
    section.parentElement.classList.remove("hidden");
}

loadMovies();
updateAccountButton();
