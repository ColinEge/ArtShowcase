//
// Gallery carousel
//

const gallery = document.getElementById('gallery');
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
        gallery.classList.add('grabbing');
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
        gallery.classList.remove('grabbing');
    };

    // Add event listeners for desktop and mobile
    gallery.addEventListener('mousedown', touchStart);
    gallery.addEventListener('touchstart', touchStart);
    gallery.addEventListener('mousemove', touchMove);
    gallery.addEventListener('touchmove', touchMove);
    gallery.addEventListener('mouseup', touchEnd);
    gallery.addEventListener('touchend', touchEnd);
    gallery.addEventListener('mouseleave', touchEnd);
    gallery.addEventListener('touchcancel', touchEnd);

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
// Create DOM elements
//

!function () {
    galleryContent.forEach((collection, c) => {
        // Create circle
        const collectionItem = document.createElement("div");
        collectionItem.classList.add("collection-item");

        const collectionPreviewContainer = document.createElement("div");
        collectionPreviewContainer.classList.add("collection-preview-container");
        collectionItem.appendChild(collectionPreviewContainer);

        const collectionTitle = document.createElement("p");
        collectionTitle.classList.add("collection-title", "not-selectable");
        collectionTitle.textContent = collection.name;
        collectionItem.appendChild(collectionTitle);

        if (!collection.useImagesAsPreview) {
            // Create circle image
            const previewImage = document.createElement("img");
            previewImage.classList.add("not-selectable");
            previewImage.src = collection.previewImage;
            previewImage.alt = collection.name;
            collectionPreviewContainer.appendChild(previewImage);
        } else {
            collection.images.forEach((image, i) => {
                // Create circle image
                const previewImage = document.createElement("img");
                previewImage.classList.add("fade", "not-selectable");
                previewImage.style.animationDelay = `-${(i * 4) - (c * 0.1)}s`;
                previewImage.src = image;
                collectionPreviewContainer.appendChild(previewImage);
            });
        }

        // Make it clickable
        collectionPreviewContainer.addEventListener("click", () => {
            clearCollectionContent();
            addCollectionContent(collection.images);
        });
        gallery.appendChild(collectionItem);
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
    var wrapper = document.querySelector('.container'),
        shadowLeft = document.querySelector('.shadow--left'),
        shadowRight = document.querySelector('.shadow--right'),
        contentScrollHeight = gallery.scrollWidth - wrapper.offsetWidth;

    if (contentScrollHeight > 0) {
        gallery.addEventListener('scroll', function () {
            var currentScroll = this.scrollLeft / (contentScrollHeight);
            shadowLeft.style.opacity = currentScroll;
            shadowRight.style.opacity = 1 - currentScroll;
        });
    } else {
        shadowLeft.style.opacity = 0;
        shadowRight.style.opacity = 0;
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