/**
 * @author: grischaandreew <grischa@compuccino.com>
 * @license: what ever you want
 *  
 * @use:
 *   $ ./mongo
 *   load('blog.js');
 *   setup();
 *   generate_more_testdata();
 *   tests();
 *   cleanup();
 */

// fetch db `blog_testing` into local variable
var testing = db.getSisterDB('blog_testing'), Times = {};

function cleanup(){
	testing.dropDatabase();
}

function start( id ) {
	Times[id] = new Date;
}

function end( id ) {
	if( !Times[id] ) return 0;
	var now = new Date,
			secs = now.getTime()-Times[id].getTime();
	print( "\t// " + id + ': ' + secs + " milliseconds" );
	return secs;
}

function setup(){
	start( 'title unique index' );
	testing.posts.ensureIndex( {
		title: 1
	}, {
		unique: true
	} );
	end( 'title unique index' );
	
	start( 'index all and make the quering faster' )
	// index all and make the quering faster 
	testing.posts.ensureIndex( {
		title: 1,
		body: 1,
		tags: 1,
		created: 1,
		updated: 1
	} );
	end( 'index all and make the quering faster' )
	
}

function savePost( postobj ) {
	/**
	 * @var postobj {
	 *	'title': String,
	 *	'body': String,
	 *	'tags': Array,
	 *	'created': Date,
	 *	'updated': Date,
	 * }
	 */
	
	if( typeof postobj !== "object" ) return false;
	var df = {
			'title': null,
			'body': null,
			'tags': [],
			'created': new Date
		},
		k,
		oldPost = findPost( { title: postobj.title } );
	
	for( k in df ) {
		if( postobj[k] == undefined ) postobj[k] = df[k];
	}
	postobj['updated'] = new Date;
	if( oldPost ) {
		postobj['_id'] = oldPost['_id'];
	}
	return testing.posts.save( postobj );
}

function findPost( obj ) {
	if( obj == undefined ) return testing.posts.findOne( );
	if( typeof obj != "object" )
		obj['title'] = obj;
	return testing.posts.findOne( obj );
}

function findPosts( obj ) {
	if( obj == undefined ) return testing.posts.find();
	if( typeof obj != "object" )
		obj['title'] = obj;
	return testing.posts.find( obj );
}

function escape_regexp( re ) {
	var specials = [
		'/', '.', '*', '+', '?', '|',
		'(', ')', '[', ']', '{', '}', '\\'
	];
	return re.replace( new RegExp( '(\\' + specials.join('|\\') + ')', 'g' ), '\\$1' );
}

function searchPosts( q ) {
	if( q == undefined ) return testing.find();
	var qr = new RegExp( '.*'+escape_regexp(q)+'.*','ig'),
			qb = {
				'title': qr,
			};
	return testing.posts.find( qb );
}

// clean testing db
//print( "\n-- clean testing db --" )
//cleanup();
// setup indexes and so on
//print( "\n-- setup indexes and so on --" )
//setup();

function tests(){
	
	// get all blogs with tag geospatial
	print( "\n-- find Blogposts over tag `geospatial` and print the first 5 --" );
	start( 'find Blogposts over tag `geospatial` and print the first 5' );
	printjson( findPosts( {
		tags: 'geospatial'
	} ).limit(5).toArray() )
	end( 'find Blogposts over tag `geospatial` and print the first 5' );



	// search all blogs with `sharding` in title
	print( "\n-- search in Blogposts titles with query `sharding` and print the first 5 --" );
	start( 'search in Blogposts titles with query `sharding` and print the first 5' );
	printjson( searchPosts( 'sharding' ).limit(5).toArray() )
	end( 'search in Blogposts titles with query `sharding` and print the first 5' );


		
	// fetch all Blogposts with tag `sharding`
	print( "\n-- fetch all Blogposts with tag `sharding` and print the first 5 --" );
	start( 'fetch all Blogposts with tag `sharding` and print the first 5' );
	printjson( findPosts( {
		tags: 'sharding'
	} ).limit(5).toArray() )
	end( 'fetch all Blogposts with tag `sharding` and print the first 5' );



	// fetch all Blogposts with tag `geospatial`
	print( "\n-- fetch all Blogposts with tag `geospatial` and print the first 5 --" );
	start( 'fetch all Blogposts with tag `geospatial` and print the first 5' );
	printjson( findPosts( {
			tags: 'geospatial'
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts with tag `geospatial` and print the first 5' );
	
	// fetch all Blogposts with tag `geospatial`
	print( "\n-- fetch all Blogposts without tag `geospatial` and print the first 5 --" );
	start( 'fetch all Blogposts without tag `geospatial` and print the first 5' );
	printjson( findPosts( {
			tags: {
				$ne: 'geospatial'
			}
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts without tag `geospatial` and print the first 5' );


	
	// fetch all Blogposts with tags `geospatial` and `mongodb`
	print( "\n-- fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5 --" );
	start( 'fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5' );
	printjson( findPosts( {
			tags: {
				$all: [ 'geospatial', 'mongodb' ]
			}
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5' );
	
	// fetch all Blogposts without tags
	print( "\n-- fetch all Blogposts without tags and print the first 5 --" );
	start( 'fetch all Blogposts without tags and print the first 5' );
	printjson( findPosts( {
			tags: {
				$size: 0
			}
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts without tags and print the first 5' );
	
	
	// fetch all Blogposts with tags `geospatial` and `mongodb`
	print( "\n-- fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5 --" );
	start( 'fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5' );
	printjson( findPosts( {
			tags: {
				$all: [ 'geospatial', 'mongodb' ]
			}
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts with tags `geospatial` and `mongodb` and print the first 5' );
	
	// fetch all Blogposts without tags `geospatial` and `mongodb`
	print( "\n-- fetch all Blogposts without tags `geospatial` and `mongodb` and print the first 5 --" );
	start( 'fetch all Blogposts without tags `geospatial` and `mongodb` and print the first 5' );
	printjson( findPosts( {
			tags: {
				$nin: [ 'geospatial', 'mongodb' ]
			}
	} ).limit(5).toArray() );
	end( 'fetch all Blogposts without tags `geospatial` and `mongodb` and print the first 5' );



	// fetch all Blogposts ordered by updated Desc
	print( "\n-- fetch all Blogposts ordered by updated Desc and print the first 5 --" );
	start( 'fetch all Blogposts ordered by updated Desc and print the first 5' );
	printjson( findPosts( ).sort( {updated:-1} ).limit(5).toArray() );
	end( 'fetch all Blogposts ordered by updated Desc and print the first 5' );
	
	// fetch the 2 latest Blogposts ordered by created Desc
	print( "\n--  fetch the 2 latest Blogposts ordered by created Desc --" );
	start( ' fetch the 2 latest Blogposts ordered by created Desc' );
	printjson( findPosts( ).limit(2).sort( {created:-1} ).toArray() );
	end( ' fetch the 2 latest Blogposts ordered by created Desc' );
	
	
	// search with regex over post titles
	print( "\n-- search with regex over post titles and print the first 3 results --" );
	start( ' search with regex over post titles and print the first 3 results' );
	printjson( searchPosts( '1'  ).limit(3).toArray() );
	end( ' search with regex over post titles and print the first 3 results' );

	// map reduce over tags
	print( "\n-- map reduce over tags --" );
	function tag_map(){
		var i;
		for( i=0;i<this.tags.length;i++ ){
			emit(this.tags[i], 1 ); 	
		}
	}
	function tag_reduce( key, values ){
		return Array.sum(values);
	}
	start( 'generate collections from map reduce over tags sorted by posts per tag' );
	testing.posts.mapReduce( tag_map, tag_reduce, {out:'posts.tags'});
	end( 'generate collections from map reduce over tags' );
	printjson( testing.posts.tags.find().sort({value:-1}).limit(10).toArray() );



	// map reduce over created
	print( "\n-- map reduce how much posts we have in the months sorted by posts per month --" );
	function month_map(){
		var m = String(this.created.getMonth()+1);
		if(m.length==1) m = "0"+m;
		emit( this.created.getFullYear()+"-"+m, 1 );
	}
	function month_reduce( key, values ){
		return Array.sum(values);
	}
	start( 'generate collections from map reduce over post created dates' );
	testing.posts.mapReduce( month_map, month_reduce, {out:'posts.dates'});
	end( 'generate collections from map reduce over post created dates' );
	printjson( testing.posts.dates.find().sort( {value: -1} ).toArray() );
}



function generate_testdata(){
	var d = new Date;
	// get an error
	print( "\n-- get an error --" );
	start( 'get an error' );
	print( savePost() );
	end( 'get an error' );



	// save a blogpost
	print( "\n-- save a blogpost --" );
	start( 'save a blogpost' );
	print( savePost( {
		title: 'Mongodb test x1',
		body: 'Mongodb test x1 body text',
		tags: [ 'mongodb', 'GridFS', 'sharding', 'humongous', 'c++' ]
	} ) );
	end( 'save a blogpost' );



	// save another blogpost
	print( "\n-- save another blogpost --" );
	start( 'save another blogpost' );
	print( savePost( {
		title: 'Mongodb test x2',
		body: 'Mongodb test x2 body text',
		tags: [ 'mongodb', 'geospatial', 'sharding', 'humongous' ],
		created: new Date( d.setMonth( 3 ) )
	} ) );
	end( 'save another blogpost' );



	// save another blogpost
	print( "\n-- save another blogpost --" );
	start( 'save another blogpost' );
	print( savePost( {
		title: 'Mongodb test x3',
		body: 'Mongodb test x3 body text',
		tags: [ 'geospatial', 'scalable', 'replication' ],
		created: new Date( d.setMonth( 3 ) )
	} ) );
	end( 'save another blogpost' );



	// save a blogpost
	print( "\n-- save a blogpost --" );
	start( 'save another blogpost' );
	print( savePost( {
		title: 'Mongodb test x4',
		body: 'Mongodb test x4 body text',
		tags: [ 'mongodb', 'sharding', 'geospatial' ],
		created: new Date( d.setMonth( 4 ) )
	} ) );
	end( 'save another blogpost' );
}

function generate_more_testdata( limit ){
	var i,
			d = new Date,
			tags = [ 'mongodb', 'location', 'sharding', 'geospatial', 'storage', 'replication', 'Fast In-Place Updates', 'GridFS', 'humongous', 'document-oriented', 'scalable', 'high-performance', 'c++', 'javascript' ],
			tagLength,
			tmp_tags,
			ti,
			td;
	limit = limit || 1000;
	// generate 1000 blogposts
	print( "\n-- generate "+limit+" blogposts --" );
	start( 'generate '+limit+' blogposts' );
	for( i=0; i < 1000; i++ ) {
		td = new Date;
		tmp_tags = [];
		tagLength = Math.ceil(Math.random()*tags.length-1);
		for( ti=0;ti<tagLength;ti++ ) {
			tmp_tags.push( tags[ti] )
		}
		savePost( {
			title: 'Mongodb ' + td.toString() + ' ' + i,
			body: 'Mongodb body text ' + td.toString() + ' ' + i,
			tags: tmp_tags,
			created: new Date( d.setMonth( Math.floor(Math.random()*11) ) )
		} );
	}
	end( 'generate '+limit+' blogposts' );
}

function generate_much_more_testdata( limit ) {
	limit = limit || 100000;
	generate_more_testdata(limit);
}
