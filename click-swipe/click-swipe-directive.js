'use strict';

/* Directives */

angular.module('clickSwipeDirective', ['ionic'])

/*****************************************************************************/
/**************************    DIRECTIVE    **********************************/
/*****************************************************************************/
/***
 * click-swipe is an attribute directive which can enables open close on click
 *
 * @usage
 *
 * ```html
 *   <ion-item click-swipe>
 *     <ion-option-button class="button-assertive" ng-click="edit(item)">
 *       Edit
 *     </ion-option-button>
 *   </ion-item>
 * ```
 *
 * ### Known issues:
 *
 */
.directive('clickSwipe', function($ionicGesture) {
  return {
    restrict: 'A',
    require:  '^ionItem',
    link: function(scope, element, attr, itemCtrl) {
			var left = itemCtrl.itemSwipeLeft ? itemCtrl.itemSwipeLeft : null;
			var right = itemCtrl.itemSwipeRight ? itemCtrl.itemSwipeRight: null;
		
		  $ionicGesture.on('tap', function(e){
 				// Grab the content
				var content = element[0].querySelector('.item-content');		
	  		if (!left && !right) return;
				// Grab the buttons and their width
				var isLeft;
				if (left && !right) isLeft=true;
				else if (!left && right) isLeft=false;
				else isLeft = e.gesture.srcEvent.clientX>=content.clientWidth/2;
		  	var buttons = isLeft ? left[0] : right[0]; //ToDo better left right selectiong

				var buttonsWidth = buttons.offsetWidth;
				ionic.requestAnimationFrame(function() {
					content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

					if (!buttons.classList.contains('invisible')) {
						content.style[ionic.CSS.TRANSFORM] = '';
						setTimeout(function() {
							buttons.classList.add('invisible');
						}, 250);				
					} else {
						buttons.classList.remove('invisible');
						content.style[ionic.CSS.TRANSFORM] = 'translate3d(' +
							(isLeft ? '-' : '' )  + buttonsWidth + 'px, 0, 0)';
					}
				});		

			}, element);
			
    } // link
  }; // return
}) // can-swipe directive
