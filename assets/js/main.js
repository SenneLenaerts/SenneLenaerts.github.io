/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner');

	// Breakpoints.
		breakpoints({
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (browser.name == 'ie' || browser.name == 'edge' || browser.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			breakpoints.on('<=medium', off);
			breakpoints.on('>medium', on);

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Clear transitioning state on unload/hide.
		$window.on('unload pagehide', function() {
			window.setTimeout(function() {
				$('.is-transitioning').removeClass('is-transitioning');
			}, 250);
		});

	// Fix: Enable IE-only tweaks.
		if (browser.name == 'ie' || browser.name == 'edge')
			$body.addClass('is-ie');

	// Scrolly.
		$('.scrolly').scrolly({
			offset: function() {
				return $header.height() - 2;
			}
		});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() {
				$window.trigger('scroll');
			});

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.height() + 10,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

				window.setTimeout(function() {
					$window.triggerHandler('scroll');
				}, 100);

			});

		}

	// Banner.
		$banner.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img');

			// Parallax.
				$this._parallax(0.275);

			// Image.
				if ($image.length > 0) {

					// Set image.
						$this.css('background-image', 'url(' + $img.attr('src') + ')');

					// Hide original.
						$image.hide();

				}

		});

	// Menu.
		var $menu = $('#menu'),
			$menuInner;

		$menu.wrapInner('<div class="inner"></div>');
		$menuInner = $menu.children('.inner');
		$menu._locked = false;

		$menu._lock = function() {

			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {

			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {

			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {

			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menuInner
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {

				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					window.setTimeout(function() {
						window.location.href = href;
					}, 250);

			});

		$menu
			.appendTo($body)
			.on('click', function(event) {

				event.stopPropagation();
				event.preventDefault();

				$body.removeClass('is-menu-visible');

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {

				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {

				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {

				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});

	$('[data-carousel]').each(function() {

		var $carousel = $(this),
			$slides = $carousel.find('.carousel-slide'),
			$previous = $carousel.find('[data-carousel-previous]'),
			$next = $carousel.find('[data-carousel-next]'),
			$status = $carousel.find('[data-carousel-status]'),
			showPreviews = $carousel.is('[data-carousel-preview]'),
			autoplayInterval = parseInt($carousel.attr('data-carousel-interval'), 10),
			autoplayTimer,
			index = 0,
			total = $slides.length;

		if (total < 2)
			return;

		var showSlide = function() {

			if (showPreviews) {

				var previousIndex = (index + total - 1) % total,
					nextIndex = (index + 1) % total;

				$slides.each(function(i) {
					var $slide = $(this),
						isPrevious = i == previousIndex,
						isCurrent = i == index,
						isNext = i == nextIndex,
						isVisible = isPrevious || isCurrent || isNext;

					$slide
						.prop('hidden', !isVisible)
						.attr('aria-hidden', isCurrent ? 'false' : 'true')
						.attr('aria-label', (i + 1) + ' of ' + total)
						.toggleClass('is-previous', isPrevious)
						.toggleClass('is-current', isCurrent)
						.toggleClass('is-next', isNext);
				});

			}

			else {

				$slides.each(function(i) {
					$(this)
						.prop('hidden', i != index)
						.attr('aria-label', (i + 1) + ' of ' + total);
				});

			}

			$status.text((index + 1) + ' / ' + total);

		};

		$previous.on('click', function() {
			index = (index + total - 1) % total;
			showSlide();
		});

		$next.on('click', function() {
			index = (index + 1) % total;
			showSlide();
		});

		if (autoplayInterval > 0) {
			var stopAutoplay = function() {
				window.clearInterval(autoplayTimer);
			};

			var startAutoplay = function() {
				stopAutoplay();

				if (document.hidden || $carousel.is(':hover') || $carousel.find(':focus').length)
					return;

				autoplayTimer = window.setInterval(function() {
					index = (index + 1) % total;
					showSlide();
				}, autoplayInterval);
			};

			$carousel.on('mouseenter focusin', stopAutoplay);
			$carousel.on('mouseleave', startAutoplay);
			$carousel.on('focusout', function() {
				window.setTimeout(startAutoplay, 0);
			});
			$(document).on('visibilitychange', function() {
				if (document.hidden)
					stopAutoplay();
				else
					startAutoplay();
			});

			startAutoplay();
		}

		showSlide();

	});

	$('[data-showcase-dialog]').each(function() {

		var $trigger = $(this),
			dialog = document.getElementById($trigger.attr('data-showcase-dialog'));

		$trigger.on('click', function() {
			dialog.showModal();
		});

		$(dialog).find('.showcase-dialog-close').on('click', function() {
			dialog.close();
		});

		$(dialog).on('click', function(event) {
			if (event.target === dialog)
				dialog.close();
		});

	});

})(jQuery);
