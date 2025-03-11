// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // References to screens
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const birthdayInputScreen = document.getElementById('birthday-input-screen');
    const fireworksScreen = document.getElementById('fireworks-screen');
    const cakeScreen = document.getElementById('cake-screen');
    const wishScreen = document.getElementById('wish-screen');
    const albumScreen = document.getElementById('album-screen');
    
    // References to other elements
    const backBtn = document.getElementById('back-btn');
    const giftBox = document.querySelector('.gift-box');
    const birthdayInput = document.getElementById('birthday-date');
    const submitBirthdayBtn = document.getElementById('submit-birthday');
    const birthdayPersonName = document.getElementById('birthday-person-name');
    const cake = document.querySelector('.cake-container');
    const flame = document.querySelector('.flame');
    const toWishBtn = document.getElementById('to-wish-btn');
    const toAlbumBtn = document.getElementById('to-album-btn');
    const blowOverlay = document.querySelector('.blow-overlay');
    const darkModeToggle = document.querySelector('.dark-mode');
    const playMusicBtn = document.getElementById('play-music');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');
    const toast = document.querySelector('.toast');
    const popup = document.querySelector('.popup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const closePopup = document.querySelector('.close-popup');
    
    // Variables
    let currentSlide = 0;
    let birthdayMusic = new Audio('https://example.com/birthday-song.mp3'); // Replace with actual path
    birthdayMusic.loop = true;
    
    // Simulate loading and show start screen
    setTimeout(function() {
        showScreen(loadingScreen, startScreen);
    }, 3000);
    
    // Event listeners
    backBtn.addEventListener('click', goBack);
    giftBox.addEventListener('click', openGift);
    submitBirthdayBtn.addEventListener('click', submitBirthday);
    cake.addEventListener('click', showBlowOverlay);
    toWishBtn.addEventListener('click', showWishes);
    toAlbumBtn.addEventListener('click', showAlbum);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    playMusicBtn.addEventListener('click', toggleMusic);
    prevBtn.addEventListener('click', () => navigateSlide(-1));
    nextBtn.addEventListener('click', () => navigateSlide(1));
    closePopup.addEventListener('click', closePopupFunc);
    popupOverlay.addEventListener('click', closePopupFunc);
    
    // Dot navigation for slideshow
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentSlide = parseInt(this.getAttribute('data-index'));
            showSlide(currentSlide);
        });
    });
    
    // Simulate microphone detection for blowing candle
    blowOverlay.addEventListener('click', function() {
        blowOutCandle();
        blowOverlay.classList.remove('show');
    });
    
    // Functions
    function showScreen(fromScreen, toScreen) {
        fromScreen.classList.add('screen-out');
        fromScreen.classList.remove('screen-in');
        
        setTimeout(function() {
            fromScreen.classList.add('hidden');
            toScreen.classList.remove('hidden');
            
            setTimeout(function() {
                toScreen.classList.add('screen-in');
                
                // Show back button except on start screen
                backBtn.classList.toggle('hidden', toScreen === startScreen);
            }, 50);
        }, 500);
    }
    
    function goBack() {
        let currentScreen = document.querySelector('.screen:not(.hidden)');
        
        if (currentScreen === birthdayInputScreen) {
            showScreen(birthdayInputScreen, startScreen);
        } else if (currentScreen === fireworksScreen) {
            showScreen(fireworksScreen, birthdayInputScreen);
        } else if (currentScreen === cakeScreen) {
            showScreen(cakeScreen, fireworksScreen);
        } else if (currentScreen === wishScreen) {
            showScreen(wishScreen, cakeScreen);
        } else if (currentScreen === albumScreen) {
            showScreen(albumScreen, wishScreen);
        }
    }
    
    function openGift() {
        giftBox.classList.add('shake');
        
        setTimeout(function() {
            showScreen(startScreen, birthdayInputScreen);
            giftBox.classList.remove('shake');
        }, 1000);
    }
    
    function submitBirthday() {
        const birthdayValue = birthdayInput.value;
        
        if (!birthdayValue) {
            showToast('Vui lòng nhập ngày sinh nhật của bạn!');
            return;
        }
        
        // Extract name from input (in a real app, you'd have a separate field)
        const name = "Người Đặc Biệt"; // Replace with actual name input
        birthdayPersonName.textContent = name;
        
        showScreen(birthdayInputScreen, fireworksScreen);
        startFireworks();
        
        // Automatically proceed to cake screen after fireworks
        setTimeout(function() {
            showScreen(fireworksScreen, cakeScreen);
        }, 8000);
    }
    
    function startFireworks() {
        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Simple firework implementation (in a real app, use a proper library)
        function createFirework() {
            const x = Math.random() * canvas.width;
            const y = canvas.height;
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            
            // Animate firework going up
            let vy = -15 - Math.random() * 5;
            let targetY = canvas.height * (0.1 + Math.random() * 0.3);
            
            function animateUp() {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                y += vy;
                
                if (y > targetY) {
                    requestAnimationFrame(animateUp);
                } else {
                    explode(x, y, color);
                }
            }
            
            animateUp();
        }
        
        function explode(x, y, color) {
            const particles = [];
            const particleCount = 50 + Math.floor(Math.random() * 50);
            
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3;
                
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color: color
                });
            }
            
            function animateParticles() {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'lighter';
                
                let stillActive = false;
                
                particles.forEach(p => {
                    if (p.alpha > 0.01) {
                        stillActive = true;
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vy += 0.05; // gravity
                        p.alpha *= 0.98;
                        
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                if (stillActive) {
                    requestAnimationFrame(animateParticles);
                }
            }
            
            animateParticles();
        }
        
        // Launch multiple fireworks
        let fireworksInterval = setInterval(createFirework, 300);
        
        // Stop creating new fireworks after 7 seconds
        setTimeout(() => {
            clearInterval(fireworksInterval);
        }, 7000);
    }
    
    function showBlowOverlay() {
        blowOverlay.classList.add('show');
        
        // Simulate sound detection with mic
        simulateBlowDetection();
    }
    
    function simulateBlowDetection() {
        // In a real app, you'd use the Web Audio API to detect blowing
        const soundBars = document.querySelectorAll('.sound-bar');
        
        // Animate sound bars randomly
        function animateBars() {
            soundBars.forEach(bar => {
                const height = 5 + Math.random() * 45;
                bar.style.height = `${height}px`;
            });
        }
        
        let barAnimation = setInterval(animateBars, 100);
        
        // Automatically detect "blow" after 3 seconds
        setTimeout(() => {
            clearInterval(barAnimation);
            blowOutCandle();
            blowOverlay.classList.remove('show');
        }, 3000);
    }
    
    function blowOutCandle() {
        // Remove flame and show confetti
        flame.style.opacity = '0';
        createConfetti();
        
        // Show button to proceed to wishes
        setTimeout(() => {
            toWishBtn.classList.remove('hidden');
            toWishBtn.classList.add('pulse-btn');
        }, 1000);
    }
    
    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        const colors = ['#ff4081', '#f48fb1', '#ec407a', '#e91e63', '#c2185b'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = `${5 + Math.random() * 5}px`;
            confetti.style.height = `${7 + Math.random() * 15}px`;
            confetti.style.animationDuration = `${1 + Math.random() * 3}s`;
            confetti.style.animationDelay = `${Math.random()}s`;
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 4000);
    }
    
    function showWishes() {
        showScreen(cakeScreen, wishScreen);
    }
    
    function showAlbum() {
        showScreen(wishScreen, albumScreen);
        showSlide(0);
    }
    
    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        
        const icon = darkModeToggle.querySelector('i');
        if (document.body.classList.contains('dark')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    function toggleMusic() {
        const icon = playMusicBtn.querySelector('i');
        
        if (birthdayMusic.paused) {
            birthdayMusic.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            
            // Animate progress bar
            animateProgressBar();
        } else {
            birthdayMusic.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }
    
    function animateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        
        // Update progress bar based on current time
        function updateProgress() {
            if (!birthdayMusic.paused) {
                const percentage = (birthdayMusic.currentTime / birthdayMusic.duration) * 100;
                progressFill.style.width = `${percentage}%`;
                requestAnimationFrame(updateProgress);
            }
        }
        
        updateProgress();
    }
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Deactivate all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Ensure n is within bounds
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }
        
        // Show current slide and activate dot
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }
    
    function navigateSlide(direction) {
        showSlide(currentSlide + direction);
    }
    
    function showToast(message) {
        const toastMessage = document.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function showPopup(title, message) {
        const popupTitle = document.querySelector('.popup h2');
        const popupMessage = document.querySelector('.popup p');
        
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        
        popup.classList.add('show');
        popupOverlay.classList.add('show');
    }
    
    function closePopupFunc() {
        popup.classList.remove('show');
        popupOverlay.classList.remove('show');
    }
    
    // Create sparkle effect when hovering over elements
    function addSparkleEffect() {
        const elements = document.querySelectorAll('.fancy-title, .btn-primary, .gift-box, .cake');
        
        elements.forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const sparkle = document.createElement('div');
                sparkle.classList.add('sparkle');
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.width = `${Math.random() * 10 + 5}px`;
                sparkle.style.height = sparkle.style.width;
                sparkle.style.animation = `sparkle-animation ${Math.random() * 0.5 + 0.5}s forwards`;
                
                this.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            });
        });
    }
    
    // Initialize sparkle effect
    addSparkleEffect();
    
    // Show intro message
    setTimeout(() => {
        showToast('Chạm vào hộp quà để bắt đầu!');
    }, 4000);
});
const player = require('play-sound')();
// Thay đổi tên người đặc biệt trong phần fireworks
function setBirthdayPersonName(name) {
    // Cập nhật tên người đặc biệt trong phần tử có id "birthday-person-name"
    document.getElementById('birthday-person-name').textContent = name;
}

// Thay đổi tên người đặc biệt trong phần fireworks
function setBirthdayPersonName(name) {
    document.getElementById('birthday-person-name').textContent = name;
}

// Hàm để chuyển qua màn hình tiếp theo khi nhấn nút "Chuyển Tiếp"
function nextScreen() {
    document.getElementById('fireworks-screen').classList.add('hidden');
    // Nếu bạn có màn hình tiếp theo, hãy hiển thị nó
    // document.getElementById('next-screen').classList.remove('hidden');
}

// Thay đổi tên người đặc biệt khi trang tải xong (ví dụ: "Bé Quỳnh Trang")
setBirthdayPersonName("Bé Quỳnh Trang");
let slideIndex = 0; // Khởi tạo chỉ mục slide

// Hàm để hiển thị slideshow
function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  // Ẩn tất cả các slide
    }
    slideIndex++;  // Tăng chỉ mục slide
    if (slideIndex > slides.length) {slideIndex = 1} // Quay lại đầu nếu đã qua slide cuối cùng
    slides[slideIndex - 1].style.display = "block"; // Hiển thị slide hiện tại
    setTimeout(showSlides, 3000); // Mỗi 3 giây, chuyển sang slide tiếp theo
}

// Hàm để chuyển slide khi bấm nút "next"
function nextSlide() {
    slideIndex++;
    if (slideIndex > document.getElementsByClassName("slide").length) {slideIndex = 1}
    showCurrentSlide(slideIndex);
}

// Hàm để chuyển slide khi bấm nút "prev"
function prevSlide() {
    slideIndex--;
    if (slideIndex < 1) {slideIndex = document.getElementsByClassName("slide").length}
    showCurrentSlide(slideIndex);
}

// Hiển thị slide hiện tại
function showCurrentSlide(n) {
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  // Ẩn tất cả các slide
    }
    slides[slideIndex - 1].style.display = "block"; // Hiển thị slide hiện tại
}

document.querySelector(".next").addEventListener("click", nextSlide);  // Khi nhấn next
document.querySelector(".prev").addEventListener("click", prevSlide);  // Khi nhấn prev

showSlides(); // Bắt đầu slideshow khi trang được tải


