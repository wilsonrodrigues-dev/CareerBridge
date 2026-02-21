const feedContainer = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");
const topAlumniContainer = document.getElementById("topAlumni");
const trendingSkillsContainer = document.getElementById("trendingSkills");

loadFromStorage();

/* =========================
   RENDER FEED
========================= */

function renderFeed(filteredData = alumniData) {

  feedContainer.innerHTML = "";

  if(filteredData.length === 0){
    feedContainer.innerHTML = `
      <div class="bg-white p-6 rounded-xl border text-center text-gray-500">
        No results found.
      </div>
    `;
    return;
  }

  filteredData.forEach(alumni => {

    alumni.posts.forEach(post => {

      const liked = post.liked ? "text-indigo-600 font-semibold" : "text-gray-600";

      const postCard = document.createElement("div");
      postCard.className = "bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition";

      postCard.innerHTML = `
        <div class="flex justify-between items-center">

          <div>
            <h4 class="font-semibold text-gray-800">
              ${alumni.name}
            </h4>
            <p class="text-sm text-gray-500">
              ${alumni.role} at ${alumni.company}
            </p>
          </div>

          <span class="text-xs text-gray-400">
            ${new Date(post.id).toLocaleDateString()}
          </span>

        </div>

        <p class="mt-4 text-gray-700 text-sm leading-relaxed">
          ${post.content}
        </p>

        <div class="flex gap-8 mt-4 border-t pt-3 text-sm">

          <button class="${liked}"
            onclick="toggleLike(${alumni.id}, ${post.id})">
            👍 Like (${post.likes})
          </button>

          <button class="text-gray-600"
            onclick="toggleCommentBox(${post.id})">
            💬 Comment (${post.comments.length})
          </button>

          <button class="text-gray-600"
            onclick="deletePost(${alumni.id}, ${post.id})">
            🗑 Delete
          </button>

        </div>

        <div id="commentBox-${post.id}" class="mt-4 hidden">

          <input type="text"
            id="commentInput-${post.id}"
            class="w-full bg-gray-100 p-2 rounded-lg"
            placeholder="Write a comment...">

          <button onclick="addComment(${alumni.id}, ${post.id})"
            class="mt-2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
            Add Comment
          </button>

          <div class="mt-3 space-y-1 text-sm text-gray-700">
            ${post.comments.map(c => `<p>• ${c}</p>`).join("")}
          </div>

        </div>
      `;

      feedContainer.appendChild(postCard);

    });

  });

  renderTopContributors();
  renderTrendingSkills();
}

/* =========================
   LIKE SYSTEM
========================= */

function toggleLike(alumniId, postId){
  const alumni = alumniData.find(a => a.id === alumniId);
  const post = alumni.posts.find(p => p.id === postId);

  if(post.liked){
    post.likes--;
    post.liked = false;
  } else {
    post.likes++;
    post.liked = true;
  }

  saveToStorage();
  renderFeed();
}

/* =========================
   COMMENTS
========================= */

function toggleCommentBox(postId){
  const box = document.getElementById(`commentBox-${postId}`);
  box.classList.toggle("hidden");
}

function addComment(alumniId, postId){
  const input = document.getElementById(`commentInput-${postId}`);
  const text = input.value.trim();
  if(!text) return;

  const alumni = alumniData.find(a => a.id === alumniId);
  const post = alumni.posts.find(p => p.id === postId);

  post.comments.push(text);
  input.value = "";

  saveToStorage();
  renderFeed();
}

/* =========================
   CREATE POST
========================= */

function createPost(){
  const content = document.getElementById("newPostContent").value.trim();
  if(!content) return;

  alumniData[0].posts.unshift({
    id: Date.now(),
    content,
    likes: 0,
    liked: false,
    comments: []
  });

  document.getElementById("newPostContent").value = "";

  saveToStorage();
  renderFeed();
}

/* =========================
   DELETE POST
========================= */

function deletePost(alumniId, postId){
  const alumni = alumniData.find(a => a.id === alumniId);
  alumni.posts = alumni.posts.filter(p => p.id !== postId);

  saveToStorage();
  renderFeed();
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", function(){
  const value = this.value.toLowerCase();
  const filtered = alumniData.filter(a =>
    a.name.toLowerCase().includes(value) ||
    a.company.toLowerCase().includes(value)
  );
  renderFeed(filtered);
});

/* =========================
   SIDEBAR SYSTEMS
========================= */

function renderTopContributors(){
  topAlumniContainer.innerHTML = "";

  alumniData.forEach(a => {
    const totalLikes = a.posts.reduce((sum, p) => sum + p.likes, 0);

    if(totalLikes > 0){
      topAlumniContainer.innerHTML += `
        <div class="flex justify-between text-sm">
          <span>${a.name}</span>
          <span class="text-indigo-600 font-semibold">
            ${totalLikes} Likes
          </span>
        </div>
      `;
    }
  });
}

function renderTrendingSkills(){
  const skills = {};

  alumniData.forEach(a => {
    a.skills.forEach(skill => {
      skills[skill] = (skills[skill] || 0) + 1;
    });
  });

  trendingSkillsContainer.innerHTML = "";

  Object.keys(skills).forEach(skill => {
    trendingSkillsContainer.innerHTML += `
      <span class="bg-gray-100 px-3 py-1 rounded-full text-sm">
        ${skill}
      </span>
    `;
  });
}

/* =========================
   STORAGE
========================= */

function saveToStorage(){
  localStorage.setItem("alumniData", JSON.stringify(alumniData));
}

function loadFromStorage(){
  const stored = localStorage.getItem("alumniData");
  if(stored){
    const parsed = JSON.parse(stored);
    parsed.forEach((a, i) => alumniData[i] = a);
  }
}

renderFeed();

navigate("feed");
updateNotificationUI();