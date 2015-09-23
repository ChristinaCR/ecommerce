console.log('loading item.js');

function Item(props){
		
	for(var key in props){		
		this[key] = props[key];		
	};
	
	this.display = function(){		
			var itemTemplate = $('#itemTemplate').html(); 
			var compiled = Handlebars.compile(itemTemplate);
			var html = compiled(this);		  
	   		$('#outlet').append(html);	   	
	};	
}