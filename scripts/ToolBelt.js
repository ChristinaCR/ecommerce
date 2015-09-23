var addTemplate = $('#addTemplate').html();
Handlebars.registerPartial('addButton', addTemplate);

var removeTemplate = $('#removeTemplate').html();
Handlebars.registerPartial('removeButton', removeTemplate);

var ToolBelt = {
	curView: '',
	items : [],
	load : function(callback) {

		var apiKey = '1GC4c6u5GAPzoNysJjOKegc17gBhvF5Go6XyETBYrdHg';
		var googleUrl = 'https://spreadsheets.google.com/feeds/list/@apiKey/od6/public/values?alt=json-in-script';
		var finishedUrl = googleUrl.replace('@apiKey', apiKey);

		function parseGoogleData(data){
	    	var retArray = [];
			_.each(data, function(val){ //array loop
			var tempObj = {};
				_.each(val, function(val, key){ //each property loop
					if(key.match(/gsx\$/)){
						var propName = key.slice(4);	
						var ourVal = val.$t;
						tempObj[propName] = ourVal;
					}
				});
				var item = new Item(tempObj);
				retArray.push(item);
			});
			return retArray;
		}

		$.ajax({
		    	url : finishedUrl,
				type : 'GET',
				dataType : 'jsonp',
		      	success : function(data){
		      		var dataString = parseGoogleData(data.feed.entry);
					ToolBelt.items = dataString;
					ToolBelt.getCart();		        	
		        	callback();
		      	}
		    });
	 },

	addItem : function() {
		var id = ToolBelt.items.length + 1;
		var oil = $('#oil').val();
    	var brand = $('#brand').val();
   	 	var size = $('#size').val();
   	 	var tagline = $('#tagline').val();
    	var botanical = $('#botanical').val();
   	 	var origin = $('#origin').val();
   	 	var aroma = $('#aroma').val();
    	
    	var oilProps = {
	    	id: id + '',
      		oil : oil,
			brand : brand,
			size : size,
			tagline : tagline,
			botanical : botanical,
			origin : origin,
			aroma : aroma
    	};
		
    	var item = new Item(oilProps);
    	ToolBelt.items.push(item);
		ToolBelt.clearInputs();
	},

	clearInputs : function() {

		$('#oil').val("");
    	$('#brand').val("");
   	 	$('#size').val("");
   	 	$('#tagline').val("");
    	$('#botanical').val("");
   	 	$('#origin').val("");
   	 	$('#aroma').val(""); 	 	
	},

	cartAction : function(id) {
		
		_.each(ToolBelt.items, function(element){
			if(element.id === id)
      			element.inCart = !element.inCart;
		})
		ToolBelt.reload();
		ToolBelt.saveCart();
	},

	showAll : function() {
		
		ToolBelt.curView = 'all';
		$('#outlet').empty();
	  	_.each(ToolBelt.items, function(val){
	    	val.display();
    	});
	},

	showCart : function() {
		
		ToolBelt.curView = 'cart';
		var outlet = $('#outlet').empty();
		_.each(ToolBelt.items, function(val){
	    	if(val.inCart){
	    	val.display(val.id);
		    } 
		});    	  
	},

	showAdmin : function() {
		
		ToolBelt.curView = 'admin';
		var outlet = $('#outlet').empty();		 
	    var template = $('#adminTemplate').html();
	    var compiled = Handlebars.compile(template);
	    var html = compiled();    
		$('#outlet').append(html);
	},

	reload : function() {
		
		switch(ToolBelt.curView){
			case 'all':
				ToolBelt.showAll();
				break;
			case 'cart':
				ToolBelt.showCart();
				break;	
			case 'admin':
				ToolBelt.showAdmin();
				break;
		}
	},

	saveCart : function() {
		
		var cartArray = [];
		_.each(ToolBelt.items, function(element){
			if(element.inCart){
				cartArray.push(element.id);
			}								
		});
		var cartArrayString = JSON.stringify(cartArray);
		window.localStorage.cart = cartArrayString;
	},

	getCart : function() {
		
		if(!window.localStorage.cart){
			return; 	
		}

		var localCart = JSON.parse(window.localStorage.cart);
		_.each(ToolBelt.items, function(element){
			if(_.contains(localCart, element.id)){
				element.inCart = true;
			}
		});
	}, 

	emptyCart : function() {
		
		_.each(ToolBelt.items, function(element){
			element.inCart = false;
		});
		
		ToolBelt.saveCart();
		ToolBelt.reload();		
	}
}