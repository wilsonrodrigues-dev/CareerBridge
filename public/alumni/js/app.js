const app = document.getElementById("app");
const notificationPanel = document.getElementById("notificationPanel");
const badge = document.getElementById("notificationBadge");

/* =========================
   ROUTER
========================= */

function navigate(view, id = null){
  state.currentView = view;
  state.selectedProfileId = id;

  if(view === "feed") renderFeed();
  if(view === "profile") renderProfile(id);
  if(view === "connections") renderConnections();
  if(view === "events") renderEvents();
if(view === "mockBooking") renderMockBooking(id);
}

/* =========================
   FEED VIEW
========================= */

function renderFeed(){

  app.innerHTML = `
   <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

<!-- LEFT SIDEBAR -->
<div class="lg:col-span-4 space-y-6">

  <!-- My Profile Card -->
  <div class="bg-white rounded-xl border shadow-sm p-5">

    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
        R
      </div>
      <div>
        <h3 class="font-semibold">Rahul Sharma</h3>
        <p class="text-sm text-gray-500">SDE-2 at Google</p>
      </div>
      
    </div>

    <div class="border-t mt-4 pt-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Connections</span>
        <span class="font-semibold">34</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Profile Views</span>
        <span class="font-semibold">127</span>
      </div>
    </div>
 <button onclick="navigate('connections')" 
    class="text-indigo-600 text-sm font-semibold">
    View Connection Requests
  </button>
    <button onclick="navigate('profile', 1)"
      class="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
      View Profile
    </button>

  </div>

  <!-- Trending Skills -->
  <div class="bg-white rounded-xl border shadow-sm p-5">
    <h3 class="font-semibold mb-3">Trending Skills</h3>
    <div class="flex flex-wrap gap-2">
      ${getTrendingSkills()}
    </div>
  </div>

  <!-- Top Profiles -->
  <div class="bg-white rounded-xl border shadow-sm p-5">
    <h3 class="font-semibold mb-3">Top Alumni</h3>

    ${alumniData.map(a => `
      <div onclick="navigate('profile', ${a.id})"
        class="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">

        <div class="w-10 h-10 rounded-full bg-indigo-400 text-white flex items-center justify-center font-semibold text-sm">
          ${a.name.charAt(0)}
        </div>

        <div>
          <p class="text-sm font-medium">${a.name}</p>
          <p class="text-xs text-gray-500">${a.company}</p>
        </div>

      </div>
    `).join("")}

  </div>
      </div>

      <!-- CENTER -->
      <div class="lg:col-span-7 space-y-6">
        ${renderCreatePostBox()}

        ${renderPosts()}

      </div>
<div class="hidden lg:block lg:col-span-1"></div>
      
      </div>
</div>


  `;
}

function renderCreatePostBox(){
  return `
    <div class="bg-indigo-300 p-5 rounded-xl border shadow-sm">
      <textarea id="newPost"
        class="w-full bg-gray p-3 rounded-lg"
        placeholder="Share a referral..."></textarea>

      <div class="flex justify-end mt-3">
        <button onclick="createPost()"
          class="bg-indigo-600 text-white px-6 py-2 rounded-full">
          Post
        </button>
      </div>
    </div>
    <h2 class="text-xl text-gray-500 font-semibold mt-5 flex items-center justify-center">-------ALUMNI REFERAL POSTS-------</h2>
  `;
}

function renderPosts(){

  return alumniData.map(alumni => 
    alumni.posts.map(post => `
      
      <div class="bg-white p-5 rounded-xl border shadow-sm">
      
        <div class="flex justify-between">
          <div>
            <h4 class="font-semibold cursor-pointer text-indigo-600"
              onclick="navigate('profile', ${alumni.id})">
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

        <p class="mt-4 text-gray-700 text-sm">
          ${post.content}
        </p>

        <div class="flex gap-6 mt-4 text-sm border-t pt-3">

          <button onclick="toggleLike(${alumni.id}, ${post.id})"
            class="${post.likedByCurrentUser ? 'text-indigo-600 font-semibold' : ''}">
            👍 Like (${post.likes})
          </button>

          <button onclick="toggleComment(${post.id})">
            💬 Comment (${post.comments.length})
          </button>

          <button onclick="requestReferral(${alumni.id})">
            🎯 Request Referral
          </button>
        <button onclick="toggleBookmark(${alumni.id}, ${post.id})">
  🔖 Save
</button>
        </div>

        <div id="comment-${post.id}" class="hidden mt-3">
          <input type="text"
            id="commentInput-${post.id}"
            class="w-full bg-gray-100 p-2 rounded"
            placeholder="Write a comment...">
          <button onclick="addComment(${alumni.id}, ${post.id})"
            class="mt-2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
            Add
          </button>
        </div>

      </div>
    `).join("")
  ).join("");
}
function toggleBookmark(alumniId, postId){
  const alumni = alumniData.find(a => a.id === alumniId);
  const post = alumni.posts.find(p => p.id === postId);

  const user = alumniData.find(a => a.id === state.currentUserId);

  if(post.savedBy.includes(user.id)){
    post.savedBy = post.savedBy.filter(id => id !== user.id);
  } else {
    post.savedBy.push(user.id);
  }

  navigate("feed");
}
/* =========================
   INTERACTIONS
========================= */

function createPost(){
  const content = document.getElementById("newPost").value.trim();
  if(!content) return;

  const user = alumniData.find(a => a.id === state.currentUserId);

  user.posts.unshift({
    id: Date.now(),
    content,
    likes: 0,
    likedByCurrentUser: false,
    comments: []
  });

  navigate("feed");
}

function toggleLike(alumniId, postId){
  const alumni = alumniData.find(a => a.id === alumniId);
  const post = alumni.posts.find(p => p.id === postId);

  if(post.likedByCurrentUser){
    post.likes--;
    post.likedByCurrentUser = false;
  } else {
    post.likes++;
    post.likedByCurrentUser = true;
  }

  navigate("feed");
}

function toggleComment(id){
  document.getElementById(`comment-${id}`).classList.toggle("hidden");
}

function addComment(alumniId, postId){
  const input = document.getElementById(`commentInput-${postId}`);
  if(!input.value) return;

  const alumni = alumniData.find(a => a.id === alumniId);
  const post = alumni.posts.find(p => p.id === postId);

  post.comments.push(input.value);
  navigate("feed");
}

function requestReferral(id){
  state.notifications.push({
    message: "Referral request sent successfully!"
  });
  updateNotifications();
}

/* =========================
   PROFILE VIEW
========================= */

function renderProfile(id){

  const alumni = alumniData.find(a => a.id === id);
  const currentUser = alumniData.find(a => a.id === state.currentUserId);

  const isConnected = currentUser.connections.includes(id);

  app.innerHTML = `
  <div class="space-y-6">

    <button onclick="navigate('feed')" 
      class="text-indigo-600 font-semibold">
      ← Back to Feed
    </button>
    <div class="bg-white rounded-xl border shadow-sm p-6">

      <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">

        <div class="w-28 h-28 rounded-full bg-indigo-600 text-white text-4xl flex items-center justify-center font-bold shadow-lg">
          ${alumni.name.charAt(0)}
        </div>

        <div class="flex-1 text-center md:text-left">
          <h2 class="text-2xl font-bold">${alumni.name}</h2>
          <p class="text-gray-600">${alumni.role} at ${alumni.company}</p>
          <p class="text-sm text-gray-500">${alumni.location}</p>

          <div class="flex flex-wrap gap-2 mt-3">
            ${alumni.skills.map(skill =>
              `<span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                ${skill}
              </span>`
            ).join("")}
          </div>

          <div class="flex gap-4 mt-5 justify-center md:justify-start">
            <button onclick="connect(${id})"
              class="px-6 py-2 rounded-full transition-all
              ${isConnected ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}">
              ${isConnected ? 'Connected' : 'Connect'}
            </button>

            <button onclick="requestReferral(${id})"
              class="px-6 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              Request Referral
            </button>
            <button onclick="navigate('mockBooking', ${id})"
  class="px-6 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50">
  Book Mock
</button>
          </div>
        </div>

      </div>
<span class="
  ${alumni.availability === "Available" ? "text-green-600" :
    alumni.availability === "Busy" ? "text-yellow-600" :
    "text-red-600"}
  font-semibold text-sm">
  ${alumni.availability}
</span>
      <div class="border-t mt-6 pt-6">
        <h3 class="font-semibold mb-2">About</h3>
        <p class="text-gray-700 text-sm">${alumni.about}</p>
      </div>

    </div>

    <!-- Activity Section -->
    <div class="bg-white rounded-xl border shadow-sm p-6">
      <h3 class="font-semibold mb-4">Recent Activity</h3>

      ${alumni.posts.map(post => `
        <div class="border-b pb-4 mb-4">
          <p class="text-sm text-gray-700">${post.content}</p>
          <p class="text-xs text-gray-400 mt-2">${post.likes} Likes</p>
        </div>
      `).join("")}
    </div>

    <button onclick="navigate('feed')" 
      class="text-indigo-600 font-semibold">
      ← Back to Feed
    </button>

  </div>
`;
}

function connect(id){
  const currentUser = alumniData.find(a => a.id === state.currentUserId);
  const target = alumniData.find(a => a.id === id);

  if(!currentUser.connections.includes(id)){
    currentUser.connections.push(id);
    target.connectionRequests.push(state.currentUserId);

    state.notifications.push({
      message: "Connection request sent!"
    });

    updateNotifications();
  }

  navigate("profile", id);
}

/* =========================
   CONNECTIONS VIEW
========================= */

function renderConnections(){
  const user = alumniData.find(a => a.id === state.currentUserId);

  app.innerHTML = `
    <div class="bg-white p-6 rounded-xl border shadow-sm">

      <h2 class="text-xl font-bold mb-4">Connection Requests</h2>

      ${user.connectionRequests.map(id => {
        const req = alumniData.find(a => a.id === id);
        return `
          <div class="flex justify-between mb-3">
            <span>${req.name}</span>
            <button onclick="accept(${id})"
              class="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
              Accept
            </button>
          </div>
        `;
      }).join("")}

      <button onclick="navigate('feed')"
        class="mt-4 text-indigo-600">
        ← Back
      </button>

    </div>
  `;
}

function accept(id){
  const user = alumniData.find(a => a.id === state.currentUserId);
  const target = alumniData.find(a => a.id === id);

  user.connections.push(id);
  user.connectionRequests = user.connectionRequests.filter(r => r !== id);
  target.connections.push(state.currentUserId);

  navigate("connections");
}

/* =========================
   NOTIFICATIONS
========================= */

function updateNotifications(){
  if(state.notifications.length > 0){
    badge.classList.remove("hidden");
    badge.textContent = state.notifications.length;
  }
}

function toggleNotifications(){
  notificationPanel.classList.toggle("hidden");

  notificationPanel.innerHTML =
    state.notifications.map(n =>
      `<div class="border-b py-2 text-sm">${n.message}</div>`
    ).join("");
}

/* =========================
   UTIL
========================= */

function getTrendingSkills(){
  const skills = {};
  alumniData.forEach(a => 
    a.skills.forEach(s => skills[s] = (skills[s]||0)+1)
  );
  return Object.keys(skills)
    .map(s => `<span class="bg-gray-100 px-3 py-1 rounded-full">${s}</span>`)
    .join("");
}
function initSearch(){
  const input = document.getElementById("searchInput");

  input.addEventListener("input", function(){
    const value = input.value.toLowerCase();

    const filtered = alumniData.filter(a =>
      a.name.toLowerCase().includes(value) ||
      a.company.toLowerCase().includes(value) ||
      a.skills.some(skill => skill.toLowerCase().includes(value))
    );

    renderFilteredFeed(filtered);
  });
}

function renderEvents(){

  app.innerHTML = `
    <div class="space-y-6">

      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">Upcoming Events</h2>
      </div>

      ${eventsData.map(event => {

        const host = alumniData.find(a => a.id === event.hostId);
        const joined = event.attendees.includes(state.currentUserId);

        return `
          <div class="bg-white p-6 rounded-xl border shadow-sm">

            <div class="flex justify-between items-start">

              <div>
                <h3 class="font-semibold text-lg">${event.title}</h3>
                <p class="text-sm text-gray-500">${event.description}</p>
                <p class="text-sm mt-2">
                  Hosted by 
                  <span class="text-indigo-600 cursor-pointer"
                    onclick="navigate('profile', ${host.id})">
                    ${host.name}
                  </span>
                </p>
                <p class="text-sm text-gray-400 mt-1">
                  📅 ${event.date}
                </p>
              </div>

              <div class="text-right">
                <p class="text-sm font-semibold">
                  ${event.attendees.length} Joined
                </p>

                <button onclick="joinEvent(${event.id})"
                  class="mt-2 px-4 py-2 rounded-full text-sm
                  ${joined ? 'bg-gray-400' : 'bg-indigo-600 text-white'}">
                  ${joined ? 'Joined' : 'Join Event'}
                </button>
              </div>

            </div>

          </div>
        `;
      }).join("")}

      <button onclick="navigate('feed')"
        class="text-indigo-600 font-semibold">
        ← Back
      </button>

    </div>
  `;
}

function joinEvent(eventId){

  const event = eventsData.find(e => e.id === eventId);

  if(!event.attendees.includes(state.currentUserId)){
    event.attendees.push(state.currentUserId);

    state.notifications.push({
      message: "Successfully joined event!"
    });

    updateNotifications();
  }

  navigate("events");
}

function renderMockBooking(alumniId){

  const alumni = alumniData.find(a => a.id === alumniId);

  app.innerHTML = `
    <div class="space-y-6">

      <h2 class="text-xl font-bold">
        Book Mock Interview with ${alumni.name}
      </h2>

      ${alumni.mockSlots.map(slot => `
        <div class="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">

          <div>
            <p class="font-semibold">${slot.date}</p>
            <p class="text-sm text-gray-500">${slot.time}</p>
          </div>

          <button onclick="bookSlot(${alumniId}, ${slot.id})"
            class="px-4 py-2 rounded-full text-sm
            ${slot.bookedBy ? 'bg-gray-400' : 'bg-indigo-600 text-white'}">
            ${slot.bookedBy ? 'Booked' : 'Book'}
          </button>

        </div>
      `).join("")}

      <button onclick="navigate('profile', ${alumniId})"
        class="text-indigo-600 font-semibold">
        ← Back
      </button>

    </div>
  `;
}
function bookSlot(alumniId, slotId){

  const alumni = alumniData.find(a => a.id === alumniId);
  const slot = alumni.mockSlots.find(s => s.id === slotId);

  if(!slot.bookedBy){
    slot.bookedBy = state.currentUserId;

    state.notifications.push({
      message: "Mock Interview booked successfully!"
    });

    updateNotifications();
  }

  navigate("mockBooking", alumniId);
}
navigate("feed");
updateNotifications();
initSearch();