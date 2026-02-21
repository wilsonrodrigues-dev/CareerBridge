// ===========================
// EVENTS LOGIC
// ===========================

document.querySelectorAll(".join-btn").forEach(button => {

  button.addEventListener("click", function(){

    const card = button.closest(".event-card");
    const countSpan = card.querySelector(".attendee-count");

    if(button.classList.contains("joined")){
      return;
    }

    let count = parseInt(countSpan.textContent);
    count++;

    countSpan.textContent = count + " Joined";

    button.textContent = "Joined";
    button.classList.add("joined");

    alert("You have joined the event!");
  });

});


// ===========================
// MOCK BOOKING LOGIC
// ===========================

document.querySelectorAll(".book-btn").forEach(button => {

  button.addEventListener("click", function(){

    if(button.classList.contains("booked")){
      return;
    }

    button.textContent = "Booked";
    button.classList.add("booked");

    alert("Mock interview booked successfully!");
  });

});