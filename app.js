const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-box input");
const searchResult = document.querySelector(".search-result");
const singleLyrics = document.querySelector(".single-lyrics");


//Getting input by button click or pressing enter key

searchBtn.addEventListener("click", getSearchResult);
searchInput.addEventListener("keypress", (e) => {
	if(e.keyCode === 13) {
		getSearchResult()
	}
});


// Getting search results by API

function getSearchResult() {
	const songTitle = searchInput.value;
	const ovhAPI = `https://api.lyrics.ovh/suggest/${songTitle}`;
	if (songTitle) {
		fetch(ovhAPI)
			.then((res) => res.json())
			.then((data) => {
				const apiData = data.data;
				const songsData = apiData.map((item) => item).slice(0, 10);

				if (!songsData.length) {
					searchResult.innerHTML = `<h3 class="text-center">Sorry! no songs found.</h3>`;
				} else {
					searchResult.innerHTML = "";
					songsData.map((item) => {
						searchResult.innerHTML += `
                        <!-- Single result -->
                        <div class="single-result d-flex align-items-center justify-content-between my-3 p-3">
                            <div>
                            <a href="${item.link}" target="_blank">
                                <img src="${item.album.cover}" alt="cover of ${item.album.title}">
                            </a>
                            </div>
                            <div>
                                <h3 class="lyrics-name">
                                    <a href="${item.link}" target="_blank">${item.title}</a>
                                </h3>
                                <p class="author lead">${item.album.title} by <span style="font-style: italic;" >${item.artist.name}</span>
                                </p>
                            </div>
                            <div class="text-md-right text-center">
                                <button class="btn btn-success" onclick="getLyrics('${item.artist.name}', '${item.title}', '${item.title}', '${item.artist.name}')">Get Lyrics </button>
                            </div>
                        </div>
                        <!-- ./ single result -->
                        `;
					});
				}

				searchInput.value = "";
			});
	} else {
		alert("Please write a valid song name");
	}
}


// Getting lyrics from API

function getLyrics(artist, title, songTitle, artistName) {
	const ovhAPI = `https://api.lyrics.ovh/v1/${artist}/${title}`;

	fetch(ovhAPI)
		.then((res) => res.json())
		.then((data) => {
			singleLyrics.innerHTML = `
                <button class="btn go-back" onclick="goBack()">&lsaquo; go back</button>
                <h2 class="text-success mb-4">${artistName} - ${songTitle}</h2>
                <pre class="lyric text-white">${
					!data.lyrics ? data.error : data.lyrics
				}</pre>
            `;
			searchResult.style.display = "none";
		});
}


// Back to search results

function goBack() {
	searchResult.style.display = "block";
	singleLyrics.innerHTML = "";
}
