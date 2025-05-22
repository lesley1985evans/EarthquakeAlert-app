document.addEventListener("DOMContentLoaded", () => {
  const locationEl = document.getElementById("location");
  const statusEl = document.getElementById("alertStatus");
  const simulateBtn = document.getElementById("simulateBtn");
  const alertSound = document.getElementById("alertSound");
  const safeBtn = document.getElementById("safeBtn");
  const safeStatus = document.getElementById("safeStatus");

  // 📍 Get user's actual location using reverse geocoding
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude.toFixed(5);
        const lon = position.coords.longitude.toFixed(5);

        locationEl.textContent = `Getting location for coordinates: ${lat}, ${lon}...`;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(response => response.json())
          .then(data => {
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || "";
              const region = data.address.state || "";
              const country = data.address.country || "";
              locationEl.textContent = `📍 ${city}, ${region}, ${country}`;
            } else {
              locationEl.textContent = `Coordinates: ${lat}, ${lon} (Location not found)`;
            }
          })
          .catch(() => {
            locationEl.textContent = `Coordinates: ${lat}, ${lon} (Unable to resolve address)`;
          });
      },
      () => {
        locationEl.textContent = "Unable to retrieve location.";
      }
    );
  } else {
    locationEl.textContent = "Geolocation not supported by this browser.";
  }

  // 🚨 Simulate earthquake alert
  simulateBtn.addEventListener("click", () => {
    statusEl.textContent = "EARTHQUAKE WARNING: Seek shelter now!";
    statusEl.classList.remove("safe");
    statusEl.classList.add("alert");

    // Play alert sound
    alertSound.play().catch(() => {
      console.log("Audio play blocked until user interacts.");
    });

    // Trigger vibration if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 300, 500]);
    }

    // Enable "Mark Safe" button
    safeBtn.disabled = false;
    safeStatus.hidden = true;

    // Reset alert after 10 seconds (for demo purposes)
    setTimeout(() => {
      statusEl.textContent = "No current alerts";
      statusEl.classList.remove("alert");
      statusEl.classList.add("safe");
      safeBtn.disabled = true;
    }, 10000);
  });

  // ✅ Mark user safe
  safeBtn.addEventListener("click", () => {
    const time = new Date().toLocaleTimeString();
    safeStatus.textContent = `✅ You marked yourself safe at ${time}`;
    safeStatus.className = "status safe-marked";
    safeStatus.hidden = false;
  });
});
