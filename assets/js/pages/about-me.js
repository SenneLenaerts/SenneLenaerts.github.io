(function($) {

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


})(jQuery);
