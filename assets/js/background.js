document.addEventListener('DOMContentLoaded', function() {
    var images = [
        '/assets/images/background/bg1.jpg',
        '/assets/images/background/bg2.jpg'
    ];
    var chosen = images[Math.floor(Math.random() * images.length)];
    document.body.style.backgroundImage = 'url(' + chosen + ')';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
});