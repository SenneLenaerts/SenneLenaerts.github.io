(function($) {

	// Game selection showcase.
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

})(jQuery);
