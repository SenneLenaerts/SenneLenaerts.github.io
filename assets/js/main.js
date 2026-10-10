/*
	Forty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
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

	// Tiles.
		var $tiles = $('.tiles > article');

		$tiles.each(function() {

			var $this = $(this),
				$image = $this.find('.image'), $img = $image.find('img'),
				$link = $this.find('.link'),
				x;

			// Image.

				// Set image.
					$this.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide original.
					$image.hide();

			// Link.
				if ($link.length > 0) {

					$x = $link.clone()
						.text('')
						.addClass('primary')
						.appendTo($this);

					$link = $link.add($x);

					$link.on('click', function(event) {

						var href = $link.attr('href');

						// Prevent default.
							event.stopPropagation();
							event.preventDefault();

						// Target blank?
							if ($link.attr('target') == '_blank') {

								// Open in new tab.
									window.open(href);

							}

						// Otherwise ...
							else {

								// Start transitioning.
									$this.addClass('is-transitioning');
									$wrapper.addClass('is-transitioning');

								// Redirect.
									window.setTimeout(function() {
										location.href = href;
									}, 500);

							}

					});

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

	// About page carousels.
		$('.gaming-showcase').each(function() {

			var $showcase = $(this),
				$gameTiles = $showcase.find('[data-game-select]'),
				$detailPanel = $showcase.find('.gaming-detail-panel'),
				$detailTitle = $detailPanel.find('[data-game-detail-title]'),
				$detailMaker = $detailPanel.find('[data-game-detail-maker]'),
				$detailOpinion = $detailPanel.find('[data-game-detail-opinion]'),
				$close = $detailPanel.find('[data-game-close]'),
				$selectedTile = $();

			if ($gameTiles.length == 0 || $detailPanel.length == 0)
				return;

			var closeDetails = function() {

				$detailPanel
					.removeClass('is-open')
					.attr('aria-hidden', 'true');
				$showcase.removeClass('is-detail-open');
				$showcase.find('.gaming-showcase-content').removeClass('is-detail-open');

				$gameTiles.attr('aria-expanded', 'false');

			};

			$gameTiles.on('click', function() {

				var $tile = $(this);

				if ($selectedTile.is($tile) && $detailPanel.hasClass('is-open')) {
					closeDetails();
					return;
				}

				$selectedTile = $tile;
				$detailTitle.text($tile.attr('data-game-title'));
				$detailMaker.text($tile.attr('data-game-maker'));
				$detailOpinion.text($tile.attr('data-game-opinion'));
				$gameTiles.attr('aria-expanded', 'false');
				$tile.attr('aria-expanded', 'true');
				$showcase.addClass('is-detail-open');
				$showcase.find('.gaming-showcase-content').addClass('is-detail-open');
				$detailPanel
					.attr('aria-hidden', 'false')
					.addClass('is-open');

			});

			$close.on('click', function() {
				closeDetails();
				$selectedTile.trigger('focus');
			});

		});

		$('[data-about-carousel]').each(function() {

			var $carousel = $(this),
				$cards = $carousel.find('.about-carousel-card'),
				$previous = $carousel.find('[data-carousel-previous]'),
				$next = $carousel.find('[data-carousel-next]'),
				$status = $carousel.find('[data-carousel-status]'),
				showPreviews = $carousel.is('[data-carousel-preview]'),
				index = 0,
				total = $cards.length;

			if (total < 2)
				return;

			var showCard = function() {

				if (showPreviews) {

					var previousIndex = (index + total - 1) % total,
						nextIndex = (index + 1) % total;

					$cards.each(function(i) {
						var $card = $(this),
							isPrevious = i == previousIndex,
							isCurrent = i == index,
							isNext = i == nextIndex,
							isVisible = isPrevious || isCurrent || isNext;

						$card
							.prop('hidden', !isVisible)
							.attr('aria-hidden', isCurrent ? 'false' : 'true')
							.attr('aria-label', (i + 1) + ' of ' + total)
							.toggleClass('is-previous', isPrevious)
							.toggleClass('is-current', isCurrent)
							.toggleClass('is-next', isNext);
					});

				}

				else {

					$cards.each(function(i) {
						$(this)
							.prop('hidden', i != index)
							.attr('aria-label', (i + 1) + ' of ' + total);
					});

				}

				$status.text((index + 1) + ' / ' + total);

			};

			$previous.on('click', function() {
				index = (index + total - 1) % total;
				showCard();
			});

			$next.on('click', function() {
				index = (index + 1) % total;
				showCard();
			});

			showCard();

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

})(jQuery);