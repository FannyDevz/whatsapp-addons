function simulateShiftEnter(targetElement) {
    const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13, 
        charCode: 13, 
        shiftKey: true, 
        bubbles: true, 
        cancelable: true 
    });

    targetElement.dispatchEvent(event);
}
function cleanPhoneNumber(text) {
    return text.trim().replace(/[+\t.,\- ]/g, "");
}
function addCopyButton() {
    let main = document.getElementById('main');
    if (!main || document.querySelector("#copy-number-btn")) {
        return;
    }
    let header = main.querySelector("header");
    if (!header) return;

    let phoneElement = header.querySelector('span[class*="x"][dir="auto"]');
    let buttonElement = header.querySelector('div[role="button"]');
    if (phoneElement && buttonElement) {
        let copyButton = document.createElement("button");
        copyButton.innerText = "📋 Salin Nomor";
        copyButton.id = "copy-number-btn";
        copyButton.style.cssText = "margin-left:10px; margin-right:10px; padding:5px; border:none; background:#25D366; color:white; cursor:pointer; border-radius:5px;";
        let phoneNumber = phoneElement.textContent.trim().replace(/[\t.,\- ]/g, "");
        copyButton.onclick = () => {
            buttonElement.click();  
            setTimeout(() => {
                let section = document.querySelector('section')
                let nameEl = section.querySelector('h2')?.querySelector('span[class*="x"][dir="auto"]');
                let phoneEl = section.querySelector('h2 + div')?.querySelector('span[class*="x"][dir="auto"]');
                let number = ""; 
                if (nameEl && phoneEl) {
                    if (nameEl.textContent.trim().startsWith("+")) {
                        number = cleanPhoneNumber(nameEl.textContent);
                    } else { 
                        number = cleanPhoneNumber(phoneEl.textContent);
                    }
                } else if (nameEl && !phoneEl) {
                    number = cleanPhoneNumber(nameEl.textContent);
                } else {
                    let divs = section.querySelectorAll('div');
                    let targetDiv = null;
                    
                    divs.forEach(div => {
                        if (div.textContent.includes("About and phone number")) {
                            targetDiv = div;
                        }
                        if (targetDiv && div.querySelector('span') && div.querySelector('span').textContent.match(/\+?\d[\d -]{8,12}\d/g)) {
                            const phoneText = div.querySelector('span').textContent;
                            number =  cleanPhoneNumber(phoneText);; 
                            
                        }
                    });
                }
                navigator.clipboard.writeText(number).then(() => {
                    copyButton.innerText = "✅ Disalin! ";
                    setTimeout(() => (copyButton.innerText = "📋 Salin Nomor"), 1000);
                });
            }, 1000);

        };
        
        header.appendChild(copyButton);   
        
    } else {
        console.log("Nomor telepon tidak ditemukan");
    }
}

function addSignature() {
    let main = document.getElementById('main');
    if (!main) return;

    let footer = main.querySelector("footer");
    if (!footer) return;

    let inputText = footer.querySelector('[contenteditable="true"]');

    if (!inputText) return;

    if (inputText.dataset?.signatureAdded) return;

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
        chrome?.storage?.sync?.get("signatureText", function (data) {
            if (data.signatureText) {
                const signature = ` - ${data.signatureText}`;
                inputText.dataset.signatureAdded = "true"; 
                if (!inputText.innerText.includes(signature)) {
                    inputText.focus();
                    simulateShiftEnter(inputText);
                    document.execCommand('insertText', false, signature);
                    
                };
                const selection = window.getSelection();
                const range = document.createRange();
                range.setStart(inputText, 0);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            };
        });
    } else {
        console.error("chrome.storage.sync tidak tersedia atau ekstensi tidak valid.");
    }
    
};

let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            addCopyButton();
            addSignature();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('load', () => {
    setTimeout(() => {
        addCopyButton();
        addSignature();
    }, 2000);
});