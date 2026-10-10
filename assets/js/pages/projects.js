	// Project and prototype image galleries.
		document.querySelectorAll('.project-image-trigger').forEach(function(imageButton) {
			var dialog = document.getElementById(imageButton.dataset.showcaseDialog);

			imageButton.addEventListener('click', function() {
				dialog.showModal();
			});

			dialog.querySelector('.showcase-dialog-close').addEventListener('click', function() {
				dialog.close();
			});

			dialog.addEventListener('click', function(event) {
				if (event.target === dialog)
					dialog.close();
			});
		});

		var lightbox = document.querySelector('.showcase-lightbox');

		if (lightbox) {
			var lightboxStage = lightbox.querySelector('.showcase-lightbox-stage');
			var lightboxCount = lightbox.querySelector('.showcase-lightbox-count');
			var previousButton = lightbox.querySelector('.showcase-lightbox-previous');
			var nextButton = lightbox.querySelector('.showcase-lightbox-next');
			var activeImages = [];
			var activeIndex = 0;

			var showLightboxImage = function(index) {
				activeIndex = (index + activeImages.length) % activeImages.length;
				var selectedButton = activeImages[activeIndex];
				var imageContent = selectedButton.querySelector('.showcase-image-placeholder, img');
				var enlargedImage = imageContent.cloneNode(true);

				lightboxStage.replaceChildren(enlargedImage);
				enlargedImage.classList.add('showcase-lightbox-image');
				lightboxCount.textContent = (activeIndex + 1) + ' of ' + activeImages.length;
				lightbox.setAttribute('aria-label', selectedButton.getAttribute('aria-label'));
				previousButton.hidden = activeImages.length < 2;
				nextButton.hidden = activeImages.length < 2;
			};

			var openLightbox = function(images, index) {
				activeImages = images;
				showLightboxImage(index);
				lightbox.showModal();
			};

			document.querySelectorAll('[data-showcase-gallery]').forEach(function(gallery) {
				var images = Array.from(gallery.querySelectorAll('[data-gallery-image]'));
				var moreIndicator = gallery.querySelector('[data-gallery-more]');
				var strip = gallery.querySelector('.showcase-image-strip');
				var extraCount = Math.max(0, images.length - 3);

				images.forEach(function(button, index) {
					button.hidden = index > 2;
					button.setAttribute('aria-label', 'Zoom image ' + (index + 1));
					button.addEventListener('click', function() {
						openLightbox(images, index);
					});
				});

				if (moreIndicator) {
					var extraLabel = extraCount === 1 ? 'more image' : 'more images';

					moreIndicator.hidden = extraCount === 0;
					moreIndicator.textContent = '+' + extraCount + ' ' + extraLabel;
					moreIndicator.setAttribute('aria-label', extraCount + ' ' + extraLabel + '. Open image viewer.');
					strip.classList.toggle('has-more', extraCount > 0);

					var openMoreImages = function() {
						if (extraCount > 0)
							openLightbox(images, 3);
					};

					moreIndicator.addEventListener('click', openMoreImages);
				}
			});

			previousButton.addEventListener('click', function() {
				showLightboxImage(activeIndex - 1);
			});
			nextButton.addEventListener('click', function() {
				showLightboxImage(activeIndex + 1);
			});
			lightbox.querySelector('.showcase-lightbox-close').addEventListener('click', function() {
				lightbox.close();
			});
			lightbox.addEventListener('click', function(event) {
				if (event.target === lightbox)
					lightbox.close();
			});
			lightbox.addEventListener('keydown', function(event) {
				if (event.key === 'ArrowLeft') {
					event.preventDefault();
					showLightboxImage(activeIndex - 1);
				}
				else if (event.key === 'ArrowRight') {
					event.preventDefault();
					showLightboxImage(activeIndex + 1);
				}
			});
		}

