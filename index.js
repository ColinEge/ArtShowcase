//
// Carousel
//

const carousel = document.getElementById('collections');
!function () {
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Track start mouse or finger horizontal position
    const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;

    // Request refreshes more often to prevent jitter
    const animation = () => {
        if (isDragging) requestAnimationFrame(animation);
    };

    // Keep track of where touch/mouse started
    const touchStart = (event) => {
        isDragging = true;
        startPos = getPositionX(event);
        animationID = requestAnimationFrame(animation);
        carousel.classList.add('grabbing');
    };

    // TranslateX based on mouse position difference
    const touchMove = (event) => {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    };

    // Stop moving things when touch ends
    const touchEnd = () => {
        isDragging = false;
        cancelAnimationFrame(animationID);
        prevTranslate = currentTranslate;
        carousel.classList.remove('grabbing');
    };

    // Add event listeners for desktop and mobile
    carousel.addEventListener('mousedown', touchStart);
    carousel.addEventListener('touchstart', touchStart);
    carousel.addEventListener('mousemove', touchMove);
    carousel.addEventListener('touchmove', touchMove);
    carousel.addEventListener('mouseup', touchEnd);
    carousel.addEventListener('touchend', touchEnd);
    carousel.addEventListener('mouseleave', touchEnd);
    carousel.addEventListener('touchcancel', touchEnd);

}();

//
// Modal
//

const modal = document.getElementById('imageModal');
!function () {
    const modalClose = document.querySelector('.modal-close');

    // Close modal when clicking the close button
    modalClose.addEventListener('click', () => {
        modal.classList.remove('is-active');
    });

    // Close modal when clicking on the modal background
    modal.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-background')) {
            modal.classList.remove('is-active');
        }
    });
}();

//
// Load animation
//

!function () {
    imageCollections.forEach((collection, c) => {
        // Create circle
        const carouselCircle = document.createElement("div");
        carouselCircle.classList.add("story-item");

        if (!collection.useImagesAsPreview) {
            // Create circle image
            const itemImage = document.createElement("img");
            itemImage.classList.add("not-selectable");
            itemImage.src = collection.previewImage;
            itemImage.alt = collection.name;
            carouselCircle.appendChild(itemImage);
        } else {
            collection.images.forEach((image, i) => {
                // Create circle image
                const itemImage = document.createElement("img");
                itemImage.classList.add("not-selectable", "fade");
                itemImage.style.animationDelay = `-${(i * 4) - (c * 0.1)}s`;
                itemImage.src = image;
                carouselCircle.appendChild(itemImage);
            });
        }

        // Make it clickable
        carouselCircle.addEventListener("click", () => {
            clearCollectionContent();
            addCollectionContent(collection.images);
        });
        carousel.appendChild(carouselCircle);
    });
}();

function clearCollectionContent() {
    const columnsSection = document.getElementById("collection-content");
    columnsSection.innerHTML = "";
}

function addCollectionContent(images) {
    images.forEach((image) => {
        const column = document.createElement("div");
        column.classList.add("column", "is-4");

        const card = document.createElement("div");
        card.classList.add("card", "large");
        addModalOnClick(card);
        column.appendChild(card);

        const cardImage = document.createElement("div");
        cardImage.classList.add("card-image");
        card.appendChild(cardImage);

        const figure = document.createElement("figure");
        figure.classList.add("image", "is-4by5");
        cardImage.appendChild(figure);

        const img = document.createElement("img");
        img.src = image;
        img.alt = "Image";
        figure.appendChild(img);

        document.getElementById("collection-content").appendChild(column);
    });
}

function addModalOnClick(element) {
    const modalImage = document.getElementById('modalImage');

    element.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            modalImage.src = event.target.src;
            modal.classList.add('is-active');
        }
    });
}

// 
// Carousel Shadow
// 

!function () {
    var content = document.querySelector('.story-carousel'),
        wrapper = document.querySelector('.container'),
        shadowTop = document.querySelector('.shadow--top'),
        shadowBottom = document.querySelector('.shadow--bottom'),
        contentScrollHeight = content.scrollWidth - wrapper.offsetWidth;

    if (contentScrollHeight > 0) {
        content.addEventListener('scroll', function () {
            var currentScroll = this.scrollLeft / (contentScrollHeight);
            shadowTop.style.opacity = currentScroll;
            shadowBottom.style.opacity = 1 - currentScroll;
        });
    } else {
        shadowTop.style.opacity = 0;
        shadowBottom.style.opacity = 0;
    }
}();

function copyText() {
    var copyText = document.getElementById("email");
    navigator.clipboard.writeText(copyText.innerText);

    var tooltip = document.getElementById("tooltiptext");
    tooltip.innerHTML = "Copied: " + copyText.innerText;
}

function outFunc() {
    var tooltip = document.getElementById("tooltiptext");
    tooltip.innerHTML = "Copy to clipboard";
}