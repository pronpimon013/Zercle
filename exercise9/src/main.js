document.addEventListener('DOMContentLoaded', function() {
    const randomQuoteElement = document.getElementById('random-quote');
    const randomAuthorElement = document.getElementById('random-author');
    const refreshQuoteButton = document.getElementById('refresh-quote');
    const quotesContainer = document.getElementById('quotes-container');
    const paginationContainer = document.getElementById('pagination');
    const itemsPerPageSelect = document.getElementById('items-per-page');

    let allQuotes = [];
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value);

    // API URLs
    const QUOTES_API_URL = 'https://dummyjson.com/quotes';
    const RANDOM_QUOTE_API_URL = 'https://dummyjson.com/quotes/random';

    // Fetch and display random quote
    async function fetchRandomQuote() {
        try {
            const response = await fetch(RANDOM_QUOTE_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayRandomQuote(data);
        } catch (error) {
            console.error('Error fetching random quote:', error);
            randomQuoteElement.textContent = 'Failed to load quote. Please try again.';
            randomAuthorElement.textContent = '';
        }
    }

    // Display random quote
    function displayRandomQuote(quoteData) {
        randomQuoteElement.textContent = `"${quoteData.quote}"`;
        randomAuthorElement.textContent = `by ${quoteData.author}`;
    }

    // Fetch all quotes
    async function fetchAllQuotes() {
        try {
            const response = await fetch(QUOTES_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            allQuotes = data.quotes;
            displayQuotes();
            createPagination();
        } catch (error) {
            console.error('Error fetching quotes:', error);
            quotesContainer.innerHTML = '<div class="col-span-2 text-center text-white">Failed to load quotes. Please refresh the page.</div>';
        }
    }

    // Display quotes for current page
    function displayQuotes() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentQuotes = allQuotes.slice(startIndex, endIndex);

        quotesContainer.innerHTML = '';

        currentQuotes.forEach(quote => {
            const quoteCard = document.createElement('div');
            quoteCard.className = 'bg-white p-4 rounded-xl shadow-md';
            quoteCard.innerHTML = `
                <p class="mb-3">"${quote.quote}"</p>
                <p class="text-right text-gray-600">by ${quote.author}</p>
            `;
            quotesContainer.appendChild(quoteCard);
        });
    }

    // Create pagination buttons
    function createPagination() {
        const totalPages = Math.ceil(allQuotes.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        // Previous button
        const prevButton = createPaginationButton('«', currentPage > 1);
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePage();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page number buttons
        const maxButtons = 5; // Show at most 5 numbered buttons
        const startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxButtons - 1);

        for (let i = startPage; i <= endPage; i++) {
            const button = createPaginationButton(i.toString(), true, i === currentPage);
            button.addEventListener('click', () => {
                currentPage = i;
                updatePage();
            });
            paginationContainer.appendChild(button);
        }

        // Next button
        const nextButton = createPaginationButton('»', currentPage < totalPages);
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePage();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Create a pagination button element
    function createPaginationButton(text, enabled, isActive = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'px-4 py-2 rounded-md';

        if (isActive) {
            button.classList.add('bg-blue-500', 'text-white');
        } else if (enabled) {
            button.classList.add('bg-white', 'text-gray-800', 'hover:bg-gray-200');
        } else {
            button.classList.add('bg-gray-200', 'text-gray-400', 'cursor-not-allowed');
        }

        return button;
    }

    function updatePage() {
        displayQuotes();
        createPagination();
        window.scrollTo(0, 0);
    }

    // Event Listeners
    refreshQuoteButton.addEventListener('click', fetchRandomQuote);

    itemsPerPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        updatePage();
    });

    fetchRandomQuote();
    fetchAllQuotes();
});