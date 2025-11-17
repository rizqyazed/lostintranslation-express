var counter = 2;
var poemCounter = 0;
let poemList = [];
var INTERVAL = 10000;

async function loadPoems() {
  const res = await fetch("translations.json");
  poemList = await res.json();
  console.log("Loaded", poemList.length, "poems");

  setInterval(() => {
    if (counter > 15) {
      counter = 1; // Reset counter when reaching the end
    }

    (async () => {
      try {
        const container = document.createElement("div");
        container.className = "card";

        // Display the poem lines
        poemList[poemCounter].forEach((line) => {
          const lineDiv = document.createElement("div");
          lineDiv.textContent = line;
          container.appendChild(lineDiv);
        });

        if (document.getElementById(counter).firstChild) {
          document.getElementById(counter).children[0].replaceWith(container);
        } else {
          document.getElementById(counter).appendChild(container);
        }

        counter += 1;
        poemCounter += 1;

        console.log(
          `Generated poem ${counter - 2}, list size: ${
            poemList.length
          }, Counter: ${counter}`,
        );
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    })();
  }, INTERVAL);
}

loadPoems();
