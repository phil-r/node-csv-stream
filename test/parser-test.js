/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	Parser = require('./../lib/parser');

var csvText = 'id,title,description\n'
			+ '1,title1,description1\n'
			+ '2,title2,description2\n';

describe('Parser',function(){
	describe('new Parser()',function(){
		it('should use , as delimiter by default',function(){
			var parser = new Parser();
			assert.equal(parser.delimiter,',');
		});
		it('should use ~ as delimiter if specified',function(){
			var parser = new Parser({ delimiter : '~'});
			assert.equal(parser.delimiter,'~');
		});
		it('should use \\n to notice the end of line by default',function(){
			var parser = new Parser();
			assert.equal(parser.endLine,'\n');
		});
		it('should use \\r  to notice the end of a line if specified',function(){
			var parser = new Parser({endLine : '\r'});
			assert.equal(parser.endLine,'\r');
		});
		it('should use no default columns by default',function(){
			var parser = new Parser();
			assert.isArray(parser.columns);
			assert.equal(parser.columns.length,0);
			assert.equal(parser._defaultColumns, false);
		});
		it('should use default columns if specified',function(){
			var parser = new Parser({ columns : ['di','eltit','noitpircdes']});
			assert.isArray(parser.columns);
			assert.deepEqual(parser.columns,['di','eltit','noitpircdes']);
			assert.equal(parser._defaultColumns, true);
		})
	})
	describe('#end()',function(){
		it('should terminate the parsing and emit the `end` event',function(done){
			var parser = new Parser();
			parser.on('end',function(){
				done();
			});
			parser.end();
		});
	});
	describe('#parse()',function(){
		it('should emit `data` events and `column` events',function(done){
			var parser = new Parser();
			var countDataEvents = 0;
			var countColumnEvents = 0;
			parser.on('data',function(data){
				countDataEvents++;
				assert.isObject(data);
			});
			parser.on('end',function(){
				assert.equal(countColumnEvents,6);
				assert.equal(countDataEvents,2);
				done();
			});
			parser.on('column',function(key,value){
				countColumnEvents++;
				assert.isString(key);
				assert.isString(value);
			});
			parser.parse(csvText);
			parser.end();
		});
		it('should emit `data` events with the right data',function(done){
			var parser = new Parser();
			var length = 0;
			parser.on('data',function(data){
				assert.isObject(data);
				if(length === 0) assert.deepEqual(data, {id : '1', title : 'title1', description : 'description1'});
				if(length === 1) assert.deepEqual(data, {id : '2', title : 'title2', description : 'description2'});
				length++;
			});
			parser.on('end',function(){
				assert.equal(length,2);
				done();
			});
			parser.parse(csvText);
			parser.end();
		});
		it('should emit `column` events with the right data',function(done){
			var parser = new Parser();
			var count = 0;
			parser.on('column',function(key,value){
				var pair = key + '=' + value;
				if(count === 0) assert.equal(pair,'id=1');
				if(count === 1) assert.equal(pair,'title=title1');
				if(count === 2) assert.equal(pair,'description=description1');
				if(count === 3) assert.equal(pair,'id=2');
				if(count === 4) assert.equal(pair,'title=title2');
				if(count === 5) assert.equal(pair,'description=description2');
				count++;
			});
			parser.on('end',function(){
				assert.equal(count,6);
				done();
			});
			parser.parse(csvText);
			parser.end();
		});
		it('should emit `data` events with the right data with the specified colmuns',function(done){
			var parser = new Parser({ columns : ['cID','cTitle','cDescription']});
			var length = 0;
			parser.on('data',function(data){
				assert.isObject(data);
				if(length === 0) assert.deepEqual(data,{cID : 'id', cTitle : 'title', cDescription : 'description'})
				if(length === 1) assert.deepEqual(data, {cID : '1', cTitle : 'title1', cDescription : 'description1'});
				if(length === 2) assert.deepEqual(data, {cID : '2', cTitle : 'title2', cDescription : 'description2'});
				length++;
			});
			parser.on('end',function(){
				assert.equal(length,3);
				done();
			});
			parser.parse(csvText);
			parser.end();
		});
		it('should emit `column` events with the right data witht the specified columns',function(done){
			var parser = new Parser({ columns : ['cID','cTitle','cDescription']});
			var count = 0;
			parser.on('column',function(key,value){
				var pair = key + '=' + value;
				if(count === 0) assert.equal(pair,'cID=id');
				if(count === 1) assert.equal(pair,'cTitle=title');
				if(count === 2) assert.equal(pair,'cDescription=description');
				if(count === 3) assert.equal(pair,'cID=1');
				if(count === 4) assert.equal(pair,'cTitle=title1');
				if(count === 5) assert.equal(pair,'cDescription=description1');
				if(count === 6) assert.equal(pair,'cID=2');
				if(count === 7) assert.equal(pair,'cTitle=title2');
				if(count === 8) assert.equal(pair,'cDescription=description2');
				count++;
			});
			parser.on('end',function(){
				assert.equal(count,9);
				done();
			});
			parser.parse(csvText);
			parser.end();
		});
	});
})


