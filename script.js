// Movie submission and voting system
let movieList = [];
let currentVoter = null;
let votes = {};
let voterHistory = {};

// Goofy name generator
const goofyNames = [
    "Captain Popcorn", "Movie Ninja", "Sir Snacksalot", "The Reel Deal", 
    "Blockbuster Betty", "Cinema Sam", "Flick Master", "Screen Queen",
    "Plot Twist Pete", "Drama Llama", "Comedy Gold", "Action Jackson",
    "Snack Attack", "Ticket Stub", "Remote Control", "Couch Potato Pro",
    "Binge Watcher", "Spoiler Alert", "Credits Roller", "Trailer Trash",
    "Box Office Bob", "Oscar Wilde", "Emmy Winner", "Tony Baloney",
    "Netflix Nick", "Hulu Hero", "Prime Time", "Disney Dork",
    "Marvel Fan", "DC Defender", "Star Wars Steve", "Trek Master",
    "Horror Hound", "Rom Com Rob", "Sci-Fi Sally", "Western Will"
];

function generateGoofyName() {
    const randomName = goofyNames[Math.floor(Math.random() * goofyNames.length)];
    document.getElementById('voter-name').value = randomName;
}

function addMovie() {
    const movieInput = document.getElementById('movie-input');
    const movie = movieInput.value.trim();
    
    if (!movie) {
        alert('Please enter a movie title!');
        return;
    }
    
    if (movieList.includes(movie)) {
        alert('This movie is already in the list!');
        return;
    }
    
    movieList.push(movie);
    votes[movie] = [];
    voterHistory[movie] = [];
    movieInput.value = '';
    
    displayMovieList();
}

function removeMovie(movie) {
    const index = movieList.indexOf(movie);
    if (index > -1) {
        movieList.splice(index, 1);
        delete votes[movie];
        delete voterHistory[movie];
        displayMovieList();
    }
}

function displayMovieList() {
    const display = document.getElementById('movie-list-display');
    
    if (movieList.length === 0) {
        display.innerHTML = '<p style="color: #718096; text-align: center; padding: 20px;">No movies added yet. Start by adding some movie titles above!</p>';
        return;
    }
    
    let html = `
        <div class="movie-list">
            <h3 style="margin-top: 0; color: #2d3748;">📽️ Movie List (${movieList.length} movies)</h3>
    `;
    
    movieList.forEach(movie => {
        html += `
            <div class="movie-item-display">
                <span>${movie}</span>
                <button class="remove-btn" onclick="removeMovie('${movie}')">Remove</button>
            </div>
        `;
    });
    
    html += '</div>';
    display.innerHTML = html;
}

function switchToVoting() {
    if (movieList.length === 0) {
        alert('Please add some movies first!');
        return;
    }
    
    document.getElementById('submission-phase').classList.add('hidden');
    document.getElementById('voting-phase').classList.remove('hidden');
}

function switchToSubmission() {
    document.getElementById('voting-phase').classList.add('hidden');
    document.getElementById('submission-phase').classList.remove('hidden');
}

function setVoter() {
    const voterName = document.getElementById('voter-name').value.trim();
    if (!voterName) {
        alert('Please enter your goofy anonymous name!');
        return;
    }
    
    currentVoter = voterName;
    document.getElementById('current-voter-display').innerHTML = `
        <div class="current-voter">
            🎭 Voting as: <strong>${currentVoter}</strong>
        </div>
    `;
    
    displayMovies();
}

function displayMovies() {
    const votingArea = document.getElementById('voting-area');
    
    if (!currentVoter) {
        votingArea.innerHTML = `
            <div class="no-voter-message">
                👆 Please choose your goofy name above to start voting
            </div>
        `;
        return;
    }

    if (movieList.length === 0) {
        votingArea.innerHTML = `
            <div class="no-voter-message">
                📽️ No movies to vote on yet! Go back and add some movies first.
            </div>
        `;
        return;
    }

    let html = `
        <div class="movies-section">
            <h3 class="movies-title">🍿 Click to Vote for Movies</h3>
            <div class="movies-grid">
    `;
    
    movieList.forEach(movie => {
        const voteCount = votes[movie].length;
        const hasVoted = voterHistory[movie].includes(currentVoter);
        const votedClass = hasVoted ? 'voted' : '';
        
        html += `
            <div class="movie-item ${votedClass}" onclick="voteForMovie('${movie}')">
                <div class="movie-title">${movie}</div>
                <div class="vote-count">${voteCount} votes</div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    votingArea.innerHTML = html;
    displayResults();
}

function voteForMovie(movie) {
    if (!currentVoter) {
        alert('Please enter your goofy name first!');
        return;
    }

    if (voterHistory[movie].includes(currentVoter)) {
        alert('You have already voted for this movie!');
        return;
    }

    votes[movie].push({
        voter: currentVoter,
        timestamp: new Date().toISOString()
    });
    
    voterHistory[movie].push(currentVoter);
    displayMovies();
}

function displayResults() {
    const resultsArea = document.getElementById('results-area');
    
    const sortedResults = movieList
        .map(movie => ({
            movie: movie,
            voteCount: votes[movie].length
        }))
        .sort((a, b) => b.voteCount - a.voteCount)
        .filter(item => item.voteCount > 0);

    if (sortedResults.length === 0) {
        resultsArea.innerHTML = '';
        return;
    }

    let html = `
        <div class="results-section">
            <h3 class="results-title">🏆 Live Results</h3>
    `;

    const totalVotes = sortedResults.reduce((sum, item) => sum + item.voteCount, 0);
    const uniqueVoters = new Set();
    Object.values(voterHistory).forEach(voters => {
        voters.forEach(voter => uniqueVoters.add(voter));
    });

    html += `<div class="vote-stats">${totalVotes} total votes from ${uniqueVoters.size} goofy voters</div>`;

    if (sortedResults[0].voteCount > 0) {
        html += `
            <div class="winner-announcement">
                🥇 Current Winner: ${sortedResults[0].movie}
                <br><small>${sortedResults[0].voteCount} votes</small>
            </div>
        `;
    }

    if (sortedResults.length >= 2) {
        html += `
            <div class="top-two">
                🔥 Top Two: ${sortedResults[0].movie} & ${sortedResults[1].movie}
            </div>
        `;
    }

    html += '<ol class="ranking-list">';
    sortedResults.forEach((item, index) => {
        let rankClass = '';
        let medal = '';
        
        if (index === 0) {
            rankClass = 'first';
            medal = '🥇';
        } else if (index === 1) {
            rankClass = 'second'; 
            medal = '🥈';
        } else if (index === 2) {
            rankClass = 'third';
            medal = '🥉';
        }
        
        html += `
            <li class="ranking-item">
                <div class="rank-display">
                    <span class="rank-number ${rankClass}">${index + 1}</span>
                    <span>${medal} ${item.movie}</span>
                </div>
                <span><strong>${item.voteCount}</strong> votes</span>
            </li>
        `;
    });
    html += '</ol></div>';

    resultsArea.innerHTML = html;
}

// Allow Enter key for inputs
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('movie-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMovie();
        }
    });

    document.getElementById('voter-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setVoter();
        }
    });
});
