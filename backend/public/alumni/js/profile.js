function renderProfileView(id){

  const alumni = alumniData.find(a => a.id === id);
  const currentUser = alumniData.find(a => a.id === state.currentUserId);

  const isConnected = currentUser.connections.includes(id);

  app.innerHTML = `
    <div class="bg-white p-6 rounded-xl border shadow-sm">

      <h2 class="text-2xl font-bold">${alumni.name}</h2>
      <p class="text-gray-600">${alumni.role} at ${alumni.company}</p>
<div class="flex gap-2 mt-2">
  ${alumni.badges.map(b =>
    `<span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
      🏆 ${b}
    </span>`
  ).join("")}
</div>
<div class="mt-4">
  <p class="text-sm font-semibold">
    Profile Strength: ${calculateProfileStrength(alumni)}%
  </p>
  <div class="w-full bg-gray-200 h-2 rounded-full mt-1">
    <div class="bg-indigo-600 h-2 rounded-full"
      style="width:${calculateProfileStrength(alumni)}%">
    </div>
  </div>
</div>

      <button onclick="sendConnectionRequest(${id})"
        class="mt-4 px-6 py-2 rounded-full
        ${isConnected ? "bg-gray-400" : "bg-indigo-600 text-white"}">
        ${isConnected ? "Connected" : "Connect"}
      </button>

      <button onclick="navigate('feed')"
        class="ml-4 text-indigo-600">
        ← Back
      </button>

    </div>
  `;
}

function calculateProfileStrength(alumni){
  let score = 0;

  if(alumni.about) score += 20;
  if(alumni.skills.length >= 3) score += 20;
  if(alumni.posts.length >= 1) score += 20;
  if(alumni.connections.length >= 3) score += 20;
  if(alumni.badges.length >= 1) score += 20;

  return score;
}