
document.addEventListener("DOMContentLoaded", function () {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    document.getElementById("facebookShare").href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    document.getElementById("twitterShare").href = `https://x.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    document.getElementById("linkedinShare").href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    document.getElementById("whatsappShare").href = `https://api.whatsapp.com/send?text=${pageTitle} - ${pageUrl}`;

    document.getElementById("shareBtn").addEventListener("click", function () {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).catch(err => console.log("Sharing failed", err));
        } else {
            alert("Your browser does not support the Web Share API.");
        }
    });
});