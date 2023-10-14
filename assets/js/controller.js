const formSubmit = () => {
    const inputElement = document.getElementById('linkInput');
    if (inputElement.value) {
        fetch('http://localhost:5000/shortUrl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: inputElement.value }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Internal server error');
                }
                return response.json();
            })
            .then(data => {
                // Handle the JSON response data here
                contentUpdate(inputElement, data.shortUrl);
            })
            .catch(error => {
                // Handle any errors here
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

const contentUpdate = (inputElement, shortUrl) => {
    const longUrlElement = document.getElementById('longUrlElement');
    longUrlElement.textContent = inputElement.value;
    // Get the anchor element by its ID
    const linkElement = document.getElementById('shortUrlElement');

    // Set the new href value
    linkElement.setAttribute("href", `http://localhost:5000/${shortUrl}`);

    // Optional: Update the link text
    linkElement.textContent = `http://localhost:5000/${shortUrl}`;
    inputElement.value = null;
    const resultCardElement = document.getElementById('resultCard');
    resultCardElement.className = 'card mt-4 px-md-4 px-3 py-4'

}