
$(function() {

//============= Header animation and fade in =======================
	$('header').click(function(){
		$('.logoHeader').css({'transition': '0.3s', 'opacity': '0'});
		$('header').addClass('hideHeader');
		$('main').addClass('openMain');
	});

	$('.background').addClass('scaleImage');
	$('.logoHeader').addClass('transformLogo');


//=============  Toggle side menus on-screen   =======================

	$('.toggleMenu').click(function(){
		$('.navMenu').toggleClass('showMenu');
		$('nav').toggleClass('moveRight');
		$('.overlay').toggleClass('active');
		$('.overlayBtn').toggleClass('moveRight');
	});
	$('.bagOpen').click(function(){
		$('.bagOpen').css('visibility', 'hidden');
		$('.navBag').toggleClass('showBag');
		$('nav').toggleClass('moveLeft');
		$('.overlay').toggleClass('active');
	});
	$('.bagClose').click(function(){
		$('.bagOpen').css('visibility', 'visible');
		$('.navBag').toggleClass('showBag');
		$('nav').toggleClass('moveLeft');
		$('.overlay').toggleClass('active');
	});

//============ Change qnt of items displayed  ====================

	$('#filter1').on('click', function(){
		$('.catalog').removeClass('catalog2');
		$('.catalog').toggleClass('catalog1');
	});
	$('#filter2').on('click', function(){
		$('.catalog').removeClass('catalog1');
		$('.catalog').removeClass('catalog2');
	});
	$('#filter3').on('click', function(){
		$('.catalog').removeClass('catalog1');
		$('.catalog').toggleClass('catalog2');
	});
	$('.product a').on('click', function(){
		$('.catalog').removeClass('catalog2');
		$('.catalog').addClass('catalog1');
	})
	$('#filters').on('click', function(){
		$('.extraFilters').addClass('toggleFilters');
	})
	$('#hideFilters').on('click', function(){
		$('.extraFilters').removeClass('toggleFilters');
	})

//============= Filter items by price ==========================

	function filterByPrice(){
		$('[data-filter]').on('click', function(){
			var filter = $(this).data('filter');
			$('.price li').removeClass('selectedFilter');
			$(this).addClass('selectedFilter');
			if (filter === 'all'){
				$('.product').removeClass('hideProduct');
			} else {
				$('.product').addClass('hideProduct');
				$('.' + filter).removeClass('hideProduct');
			}
		});
	}

	filterByPrice()
	
// ====== Prevent Body Scrolling when on fixed elements 'FAIL!!!!!' ==================

	// var fixed = document.getElementsByClassName('fixed');
	
	// for (var i = 0; i < fixed.length; i++) {
	// 	fixed[i].addEventListener('touchmove', function(e) {

	//         	e.preventDefault();

	// 	}, false);		
	// }

// ============ Use the jquery.visible.js plug-in to animate products ================
// ============ Copyright (c) 2012 Digital Fusion, http://teamdf.com/ ================

	var win = $(window);

	var allMods = $(".product");

	allMods.each(function(i, el) {
	    
	  if ($(el).visible(true)) {
	    $(el).addClass("deactivate"); 
	  }
	  
	});

	win.scroll(function(event) {
	  
	  allMods.each(function(i, el) {
	    
	    var el = $(el);
	    
	    if (el.visible(true)) {
	      el.addClass("activate"); 
	    } else {
	      el.removeClass("activate deactivate");
	    }
	    
	  });
	  
	});

// ==============================================================================
// ============ Selection and CheckOut script!!! ================================	

// CheckOut Controller
var checkOutController = (function(){

	var data = {
		itemName: [],
		itemPrice: [],
		totalPrice: 0,
		itemQnt: 0
	};

	return {
		addItem: function(val, str) {
			var newItem, itemName;

			newItem = val;
			itemName = str;

			data.itemName.push(itemName);
			data.itemPrice.push(newItem);
			data.itemQnt += 1;
			data.totalPrice += val;
		},

		deleteItems: function(){
			data.itemPrice = [];
			data.totalPrice = 0;
			data.itemQnt = 0;
		},

		totals: function() {
			return data;
		}
	}

})();




// UI Controller
var UIController = (function(){

	var DOMstrings = {
		inputBtn: '.catalog',
		itemQuantity: 'itemQnt',
		bagTotal: 'bagTotal',
		checkoutBag: '.navBag',
		emptyBag: '#emptyBag',
		newItems: '.newItem'
	};
	return {

		changeTotals: function(obj) {
			var qnt, tot;
			
			qnt = DOMstrings.itemQuantity;
			document.getElementsByClassName(qnt)[0].innerHTML = obj.itemQnt;
			document.getElementsByClassName(qnt)[1].innerHTML = obj.itemQnt;

			tot = DOMstrings.bagTotal;
			document.getElementById(tot).innerHTML = '$' + obj.totalPrice + '.00';
		},

		addListItem: function(obj) {
			var html, bag;

			html = '<div class="newItem"><span id="itemName">%Name%</span><span id="itemPrice">%price%</span></div>'

			newHtml = html.replace('%price%', '$' + obj.itemPrice.slice(-1)[0] + '.00');
			newHtml = newHtml.replace('%Name%', obj.itemName.slice(-1)[0]);

			bag = DOMstrings.checkoutBag;
			document.querySelector(bag).insertAdjacentHTML('afterbegin', newHtml);
		},

		deleteListItems: function(obj) {
			var newItems, el;

			newItems = DOMstrings.newItems;

			el = document.querySelectorAll(newItems);
			el.forEach(function(element){
				element.parentNode.removeChild(element);				
			});

		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();




// Global APP Controller
var controller = (function(checkOutCtrl, UICtrl){

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.querySelector(DOM.emptyBag).addEventListener('click', ctrlDeleteItems);

	};

	var ctrlAddItem = function(event){
		var item, price, totals, name, nameLength;

		item = event.target.parentNode.parentNode.childNodes[1].innerHTML;
		splitItem = item.split('$');
		price = parseFloat(splitItem[1]);

		name =event.target.parentNode.parentNode.childNodes[3].innerHTML;
		nameLength = event.target.parentNode.parentNode.childNodes[3].innerHTML.length;

		if (price > 0 && nameLength < 10) {
			
			//add item to checkout data
			checkOutCtrl.addItem(price, name);
			
			//add item to the UI
			totals = checkOutCtrl.totals();
			UICtrl.addListItem(totals);
			UICtrl.changeTotals(totals);
		};

	};

	var ctrlDeleteItems = function() {
		var totals;

		checkOutCtrl.deleteItems();
		
		totals = checkOutCtrl.totals();
		UICtrl.deleteListItems(totals);
		UICtrl.changeTotals(totals);
	};

	return {
		init: function() {
			setupEventListeners();
		}
	}

})(checkOutController, UIController);

controller.init();

});

