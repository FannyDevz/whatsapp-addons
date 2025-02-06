document.addEventListener("DOMContentLoaded", function () {
    const inputText = document.getElementById("inputText");
    const saveBtn = document.getElementById("saveBtn");
    const status = document.getElementById("status");

    chrome.storage.sync.get("signatureText", function (data) {
        if (data.signatureText) {
            inputText.value = data.signatureText;
        }
    });

    saveBtn.addEventListener("click", function () {
        const text = inputText.value;
        chrome.storage.sync.set({ signatureText: text }, function () {
            if (chrome.runtime.lastError) {
                console.error("Gagal menyimpan:", chrome.runtime.lastError);
            } else {
                status.textContent = "Tersimpan!";
                setTimeout(() => (status.textContent = ""), 2000);
            }
        });
    });
    
});

