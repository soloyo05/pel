
//   #############   COLORES DEL CONTROL REMOTO

// Control remoto - teclas de color
window.addEventListener('keydown', (event) => {
  const keyCode = event.keyCode;

  switch (keyCode) {
    case 403: // Rojo
      document.getElementById('homeButton')?.focus();
      break;
    case 404: // Verde
      const help = document.getElementById('helpOverlay');
      if (help) help.style.display = help.style.display === 'none' ? 'block' : 'none';
      break;
    case 405: // Amarillo
      document.getElementById('searchInput')?.focus();
      break;
    case 406: // Azul
      document.body.classList.toggle('light-mode');
      break;
  }
});


//   #############   BUSCADOR
document.getElementById('searchInput').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const items = document.querySelectorAll('.menu-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'inline-block' : 'none';
  });
});

//   #############   BOTON INICIO
document.getElementById('searchInput').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const items = document.querySelectorAll('.menu-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'inline-block' : 'none';
  });
});



// ##############  Aquí puedes incluir la lógica para navegación con flechas
  // Detectar el botón rojo (keyCode 403)
  document.addEventListener("keydown", function (event) {
    // LG WebOS usa keyCode 403 para el botón rojo
    if (event.keyCode === 403) {
      const homeBtn = document.getElementById("homeButton");
      if (homeBtn) {
        homeBtn.focus();
      }
    }

    // También aseguramos que al presionar Enter en el botón enfocado, se navegue al enlace
    if (document.activeElement.id === "homeButton" && (event.key === "Enter" || event.keyCode === 13)) {
      window.location.href = document.getElementById("homeButton").href;
    }
  });






document.addEventListener("DOMContentLoaded", () => {
  const itemsPerPage = 35;
  const allItems = Array.from(document.querySelectorAll(".menu-item"));
  const totalItems = allItems.length;
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const pageNumbersContainer = document.getElementById("pageNumbers");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  function createPagination() {
    if (!pageNumbersContainer.childElementCount) {
      for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("a");
        pageLink.href = `?page=${i}`;
        pageLink.textContent = i;
        pageLink.classList.add("pageNumber");
        pageLink.setAttribute("tabindex", "0");
        if (i === currentPage) pageLink.classList.add("active");

        pageLink.addEventListener("click", (e) => {
          e.preventDefault();
          if (currentPage !== i) {
            currentPage = i;
            showCurrentPage();
            history.pushState({}, "", `?page=${currentPage}`);
            focusIndex((currentPage - 1) * itemsPerPage);
          }
        });

        pageNumbersContainer.appendChild(pageLink);
      }
    }
  }

  function updatePaginationUI() {
    document.querySelectorAll(".pageNumber").forEach(p => p.classList.remove("active"));
    const active = document.querySelector(`.pageNumber[href="?page=${currentPage}"]`);
    if (active) active.classList.add("active");

    prevBtn.classList.toggle("disabled", currentPage === 1);
    nextBtn.classList.toggle("disabled", currentPage === totalPages);
  }

  function showCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    for (let i = 0; i < totalItems; i++) {
      allItems[i].style.display = (i >= start && i < end) ? "inline-block" : "none";
    }
    updatePaginationUI();
  }

  function focusIndex(i) {
    requestAnimationFrame(() => {
      if (allItems[i]) {
        allItems[i].focus();
        localStorage.setItem("lastFocusIndex", i);
      }
    });
  }

  createPagination();
  showCurrentPage();

const lastIndex = parseInt(localStorage.getItem("lastFocusIndex"));
const start = (currentPage - 1) * itemsPerPage;
const end = start + itemsPerPage;

setTimeout(() => {
  requestAnimationFrame(() => {
    if (!isNaN(lastIndex) && allItems[lastIndex] && lastIndex >= start && lastIndex < end) {
      allItems[lastIndex].focus();
    } else if (allItems[start]) {
      allItems[start].focus(); // enfoca el primero de la página si no es válido
    }
  });
}, 200); // espera más para asegurar que todo está cargado


  document.addEventListener("keydown", e => {
    const focused = document.activeElement;
    const currentRect = focused?.getBoundingClientRect?.() || {};

    function findClosestItem(direction) {
      let minDistance = Infinity;
      let target = null;

      for (let item of allItems) {
        if (item.offsetParent === null) continue;
        const rect = item.getBoundingClientRect();
        let valid = false;
        let distance = Infinity;

        if (direction === "ArrowRight" && rect.left > currentRect.right) {
          distance = Math.abs(rect.top - currentRect.top) + (rect.left - currentRect.right);
          valid = true;
        }
        if (direction === "ArrowLeft" && rect.right < currentRect.left) {
          distance = Math.abs(rect.top - currentRect.top) + (currentRect.left - rect.right);
          valid = true;
        }
        if (direction === "ArrowDown" && rect.top > currentRect.bottom) {
          distance = Math.abs(rect.left - currentRect.left) + (rect.top - currentRect.bottom);
          valid = true;
        }
        if (direction === "ArrowUp" && rect.bottom < currentRect.top) {
          distance = Math.abs(rect.left - currentRect.left) + (currentRect.top - rect.bottom);
          valid = true;
        }

        if (valid && distance < minDistance) {
          minDistance = distance;
          target = item;
        }
      }
      return target;
    }

    switch (e.key) {
      case "ArrowRight":
      case "ArrowLeft":
      case "ArrowDown":
      case "ArrowUp": {
        const next = findClosestItem(e.key);
        if (next) {
          next.focus();
          localStorage.setItem("lastFocusIndex", allItems.indexOf(next));
        }
        break;
      }
      case "Enter": {
        const link = focused?.querySelector("a");
        if (link) link.click();
        break;
      }
      case "ChannelUp":
      case "MediaTrackPrevious":
      case "PageUp": {
        const prev = currentPage > 1 ? currentPage - 1 : totalPages;
        if (currentPage !== prev) {
          currentPage = prev;
          showCurrentPage();
          history.pushState({}, "", `?page=${currentPage}`);
          focusIndex((currentPage - 1) * itemsPerPage);
        }
        break;
      }
      case "ChannelDown":
      case "MediaTrackNext":
      case "PageDown": {
        const next = currentPage < totalPages ? currentPage + 1 : 1;
        if (currentPage !== next) {
          currentPage = next;
          showCurrentPage();
          history.pushState({}, "", `?page=${currentPage}`);
          focusIndex((currentPage - 1) * itemsPerPage);
        }
        break;
      }
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;
  let lastSwipeTime = 0;

  document.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    const now = Date.now();
    if (now - lastSwipeTime > 400) {
      handleSwipe();
      lastSwipeTime = now;
    }
  });

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) < 50) return;

    const newPage = deltaX < 0
      ? (currentPage < totalPages ? currentPage + 1 : 1)
      : (currentPage > 1 ? currentPage - 1 : totalPages);

    if (newPage !== currentPage) {
      currentPage = newPage;
      showCurrentPage();
      history.pushState({}, "", `?page=${currentPage}`);
      focusIndex((currentPage - 1) * itemsPerPage);
    }
  }

allItems.forEach((item, i) => {
  item.addEventListener("focus", () => {
    localStorage.setItem("lastFocusIndex", i);
  });
});


  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const prev = currentPage > 1 ? currentPage - 1 : totalPages;
    if (prev !== currentPage) {
      currentPage = prev;
      showCurrentPage();
      history.pushState({}, "", `?page=${currentPage}`);
      focusIndex((currentPage - 1) * itemsPerPage);
    }
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const next = currentPage < totalPages ? currentPage + 1 : 1;
    if (next !== currentPage) {
      currentPage = next;
      showCurrentPage();
      history.pushState({}, "", `?page=${currentPage}`);
      focusIndex((currentPage - 1) * itemsPerPage);
    }
  });
});

document.addEventListener("blur", (e) => {
  const lastIndex = parseInt(localStorage.getItem("lastFocusIndex"));
  if (!isNaN(lastIndex) && allItems[lastIndex]) {
    setTimeout(() => allItems[lastIndex].focus(), 100);
  }
}, true);



