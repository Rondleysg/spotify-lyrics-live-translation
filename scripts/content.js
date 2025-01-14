let lastSong = "";

function getLyrics() {
  const lyricsElements = document.querySelectorAll('[data-testid="fullscreen-lyric"]');
  const lyrics = Array.from(lyricsElements).map((element) => element.innerText);
  return lyrics;
}

function displayTranslation(translatedLyrics) {
  const lyricsElements = document.querySelectorAll('[data-testid="fullscreen-lyric"]');
  lyricsElements.forEach((element, index) => {
    const translationElement = document.createElement("div");
    translationElement.style.marginTop = "-20px";
    translationElement.style.fontSize = "0.5em";
    translationElement.style.opacity = "0.7";
    translationElement.innerText = translatedLyrics[index];
    element.appendChild(translationElement);
  });
}

async function translateLyrics(lyrics) {
  const url = "http://localhost:5000/translate";
  try {
    if (!lyrics || lyrics.length === 0) {
      console.error("Nenhuma letra encontrada para traduzir");
      return [];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: lyrics,
        source: "auto",
        target: "pt",
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na tradução: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.translatedText || !Array.isArray(data.translatedText)) {
      throw new Error("Resposta inesperada da API de tradução");
    }
    
    return data.translatedText;
  } catch (error) {
    console.error("Erro ao traduzir as letras:", error);
    return [];
  }
}

setInterval(async () => {
  const songTitleElement = document.querySelector('[data-testid="context-item-link"]');
  const currentSong = songTitleElement ? songTitleElement.innerText : "";

  if (currentSong === lastSong) {
    return;
  }

  lastSong = currentSong;

  const lyrics = getLyrics();

  if (lyrics.length === 0) {
    console.log("Nenhuma letra encontrada para traduzir");
    lastSong = "";
    return;
  }

  const translatedLyrics = await translateLyrics(lyrics);
  if (translatedLyrics.length > 0) {
    displayTranslation(translatedLyrics);
  }
}, 5000);
