'use strict';

/* Directives */

angular.module('longSwipeDirective', ['ionic'])

/*****************************************************************************/
/**************************    DIRECTIVE    **********************************/
/*****************************************************************************/
/***
 * long-swipe is an attribute directive which can be used to detect long swipe
 * functionality of an individual ion-item element.
 * Possible values is detection range in pixes
 * Default offset = 100 (pixels)
 * 
 * @usage
 *
 * ```html
 *   <ion-item long-swipe="100" >
 *     <ion-option-button class="button-assertive" ng-click="edit(item)">
 *       Edit
 *     </ion-option-button>
 *   </ion-item>
 * ```
 *
 * ### Known issues:
 *
 */
.directive('longSwipe', function($ionicGesture,$parse,$timeout,$ionicListDelegate) {
  return {
    restrict: 'A',
		require:  '^ionItem',
    link: function(scope, element, attr, itemCtrl) {
			var offset=100;
			var max_width=999999;
			if (!isNaN(parseFloat(attr.longSwipe)) && isFinite(attr.longSwipe)) {	
				offset=Math.max(parseFloat(attr.longSwipe),25);
			}
	    var left = itemCtrl.itemSwipeLeft ? itemCtrl.itemSwipeLeft : null;
			var right = itemCtrl.itemSwipeRight ? itemCtrl.itemSwipeRight: null;
			var elB=null,elW,elS,olW=max_width;
			
				
			$ionicGesture.on('drag release', function(ev){	
				//TODO: begin drag, the hidden detecteren
				var dir = ev.gesture.deltaX<0 ? -1: 1;
				var el = ev.gesture.deltaX<0 ? left : right;
				var visible = el && !el.hasClass('invisible');
				if (!visible) return;
				var deltaX = Math.abs(ev.gesture.deltaX)-Math.min(el[0].clientWidth,olW);
				if (ev.type=='drag'){
			      if (deltaX>0 && olW==max_width) {
							elB=null;
							//Caclulated the size of elements we are going to drag
							if (el && dir <0 ) {
								for (var i=el[0].children[0].children.length-1;i>=0;i--){
				          elB=el[0].children[0].children[i];
									if (!angular.element(elB).hasClass('ng-hide')) break;
									elB=null;
								}
							}
							if (el && dir >0){
								for (var i=0;i<el[0].children[0].children.length;i++){
				          elB=el[0].children[0].children[i];
									if (!angular.element(elB).hasClass('ng-hide')) break;
									elB=null;
							  }
							}
							if (elB){
								elS=elB.style.width;
								elW=elB.clientWidth;
								olW=el[0].clientWidth;
							}
						}
					  if (deltaX>0 && elB){
							elB.style.width=(elW+deltaX)+'px';	//Resize the button
						} else if (deltaX< 0) {
					    if (elB) { //Restore the style
								elB.style.width=elS;
								elB=null;
							}
							olW=max_width;
					 }
				} else { //Release	
				  if (elB){
						elB.style.width=elW; //Restore original Width	
						if (deltaX>offset) {
							$timeout(function(){
							  $ionicListDelegate.closeOptionButtons();
							},50);
							$timeout(function(){
							 angular.element(elB).triggerHandler('click');
							},250);//Click after close
						}
					}
					olW=max_width;
				}
			},element);
			
    } // link
  }; // return
}) // can-swipe directive
