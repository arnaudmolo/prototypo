'use strict';

angular.module('prototypo.glyphFilters', [])
	.filter('contours', function( _ ) {
		// FIXME: this filter is executed four or five times !?!
		return function( segments ) {
			var d = [];

			_( segments ).each(function( segment ) {
				if ( segment[0] !== '*' ) {
					d.push( segment.toString() );
				}
			});

			return d.join(' ');
		};
	})
	.filter('points', function( _ ) {
		return function( segments ) {
			var d = [];

			_( segments ).each(function( segment ) {

				var l = segment.length,
					isRelative = /[a-z]/.test( segment[0] );

				if ( l < 3 ) {
					return;
				}

				// move to point
				d.push([
					isRelative ? 'm' : 'M',
					segment[l-2],
					segment[l-1]
				].join(' '));

				// draw debug shape and move back to point
				d.push(
					'm 0 2' +
					'h 2' +
					'v -4' +
					'h -4' +
					'v 4' +
					'z' +
					'm 0 -2'
				);
			});

			return d.join(' ');
		};
	})
	.filter('anchors', function( _ ) {
		return function( segments ) {
			var d = ['M 0,0'];

			_( segments ).each(function( segment ) {

				var l = segment.length,
					isRelative = /[a-z]/.test( segment[0] );

				if ( l > 3 ) {
					// line to 1st anchor and back to point
					d.push([
						isRelative ? 'l' : 'L',
						segment[1],
						segment[2],
						'z'
					].join(' '));
				}

				if ( l < 3 ) {
					return;
				}

				// move to next point
				d.push([
					isRelative ? 'm' : 'M',
					segment[l-2],
					segment[l-1]
				].join(' '));

				if ( l > 5 ) {
					// line to 2nd anchor and back to point
					d.push([
						isRelative ? 'l' : 'L',
						segment[3] - ( isRelative ? -segment[l-2] : 0 ),
						segment[4] - ( isRelative ? -segment[l-1] : 0 ),
						'z'
					].join(' '));
				}
			});

			return d.join(' ');
		};
	});
