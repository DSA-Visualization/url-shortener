const hostUrl = window.location.origin+'/';

const qrCodeOption = {
    data:'Hello world!',
    backgroundColor:'#ffffffff',
    qrColor:'#000000ff',
    margin:1,
    width:200
}

const formSubmit = () => {
    const inputElement = document.getElementById('linkInput');
    if (inputElement.value) {
        fetch(`${hostUrl}shortUrl`, {
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
    linkElement.setAttribute("href", `${hostUrl}${shortUrl}`);

    qrCodeOption.data = `${hostUrl}${shortUrl}`;

    // Optional: Update the link text
    linkElement.textContent = `${hostUrl}${shortUrl}`;
    inputElement.value = null;
    const resultCardElement = document.getElementById('resultCard');
    resultCardElement.className = 'card mt-4 px-md-4 px-3 py-4'

}

const copyLink = () => {
    const linkCopyElement = document.getElementById('copyLink');
    const linkElement = document.getElementById("shortUrlElement");
    const linkToCopy = linkElement.href; // Replace with the link you want to copy

    // Create a temporary input element
    const inputElement = document.createElement('input');
    inputElement.value = linkToCopy;

    // Append the input element to the DOM
    document.body.appendChild(inputElement);

    // Select the input element's value
    inputElement.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the input element from the DOM
    document.body.removeChild(inputElement);
    linkCopyElement.className = 'tab d-none';
    setTimeout(() => {
        linkCopyElement.className = 'tab';
    }, 2000);
}

const setQrBackGroundColorValue = () => {
  const qrBgColorElement = document.getElementById('qrBackGroundColor');
  const qrBgShowElement = document.getElementById('showQrBgColor');
  const bgColorValue = qrBgColorElement.value;
  qrBgShowElement.style.background = bgColorValue;
  qrCodeOption.backgroundColor = bgColorValue;
  generateQrCode();
};
const setQrColorValue = () => {
    const qrColorElement = document.getElementById('qrColor');
    const qrColorShowElement = document.getElementById('showQrColor');
    const qrColorValue = qrColorElement.value;
    qrColorShowElement.style.background = qrColorValue;
    qrCodeOption.qrColor = qrColorValue; 
    generateQrCode();
};

const setQrMargin = (value) =>{
    qrCodeOption.margin = value;
    generateQrCode();
}

const createQRCode = () => {
    generateQrCode();
    const qrCodeELement = document.getElementById('resultQrCard');
    qrCodeELement.className = 'card mt-4 px-md-4 px-3 py-4'
}

const generateQrCode = () => {
    fetch(`${hostUrl}generateQrCode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(qrCodeOption),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Internal server error');
            }
            return response.json();
        })
        .then(data => {
            // Handle the JSON response data here
            setQrCodeView(data);
        })
        .catch(error => {
            // Handle any errors here
            console.error('There was a problem with the fetch operation:', error);
        });
}

const setQrCodeView = (data) => {
    const qrCodePreviewElement = document.getElementById('qrCodePreview');
    const qrCodeDownloadElement = document.getElementById('qrCodeDownloadLink');
    qrCodeDownloadElement.setAttribute('download', `${new Date()}.png`);
    qrCodePreviewElement.src = data.qrCode;
    qrCodeDownloadElement.href = data.qrCode;
}