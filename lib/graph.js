var _ = require('lodash');
var graph = {};
graph.DirectedGraph = function() {
	this.vertices = {};
}

graph.DirectedGraph.prototype.edges = function() {
	var edges = [];
	_.forEach(this.vertices,function(values, key){
		values.forEach(function(eachValue){
			edges.push([key,eachValue]);
		});
	});
	return edges;
}

graph.DirectedGraph.prototype.addVertex = function(vertex) {
	this.vertices[vertex] = [];
}

graph.DirectedGraph.prototype.addEdge = function(vertex1, vertex2) {
		this.vertices[vertex1].push(vertex2);
}

graph.DirectedGraph.prototype.hasEdgeBetween = function(vertex1, vertex2) {
	return this.vertices[vertex1].indexOf(vertex2)!= -1;
}

graph.DirectedGraph.prototype.order = function(vertex) {
	return Object.keys(this.vertices).length;
}

graph.DirectedGraph.prototype.size = function() {
	return this.edges().length;
}

var isNotFound = function(visited,toMatchWith) {
	return (visited[visited.length-1] != toMatchWith)
}

graph.DirectedGraph.prototype.pathBetween = function(vertex1, vertex2, visitValue){
	var visited = visitValue || [];
	var notVisitedEdge = this.vertices[vertex1].filter(function(each){return visited.indexOf(each)==-1})
	if(this.vertices[vertex1].indexOf(vertex2) != -1) return visited.concat(vertex1, vertex2)
	for(var i=0; i<notVisitedEdge.length; i++){
		visited = this.pathBetween(notVisitedEdge[i], vertex2, visited.concat(vertex1));
		if(isNotFound(visited,vertex2)) visited.pop();
	}
	return visited;
}

graph.DirectedGraph.prototype.farthestVertex = function(vertex) {
	var allPaths=[];
	for(eachVertex in this.vertices){
		allPaths.push(this.pathBetween(vertex, eachVertex));
	}
	var longestPath = allPaths.reduce(function(pre,curr){
		return pre.length > curr.length ? pre : curr; 
	});
	return longestPath[longestPath.length-1];
}

graph.DirectedGraph.prototype.allPaths = function(vertex1, vertex2, visitValue, allPath){
	var allPaths = allPath || [];
	var visited = visitValue || [];
	if(vertex1 == vertex2)
		return visited.concat(vertex1);
	var notVisitedEdge = this.vertices[vertex1].filter(function(each){return visited.indexOf(each)==-1 })
	for(var i=0; i<notVisitedEdge.length; i++) {
		if(visited.indexOf(vertex1) ==-1)
			var paths = (this.allPaths(notVisitedEdge[i], vertex2, visited.concat(vertex1), allPaths));
		if(paths && paths.slice(-1) == vertex2)
			allPaths.push(paths);
	}
	return allPaths;
}

graph.UndirectedGraph = function() {
	this.vertices = {};
}

graph.UndirectedGraph.prototype.addVertex = function(vertex) {
	this.vertices[vertex] = [];
}

graph.UndirectedGraph.prototype.addEdge = function(vertex1, vertex2) {
	this.vertices[vertex1].push(vertex2);
	this.vertices[vertex2].push(vertex1);
}

graph.UndirectedGraph.prototype.hasEdgeBetween = function(vertex1, vertex2) {
	return this.vertices[vertex1].indexOf(vertex2)!= -1;
}

graph.UndirectedGraph.prototype.order = function(vertex) {
	return Object.keys(this.vertices).length;
}

graph.UndirectedGraph.prototype.edges = function() {
	var edges = [];
	_.forEach(this.vertices,function(values, key){
		values.forEach(function(eachValue){
			edges.push([key,eachValue]);
		});
	});
	return edges;
}

graph.UndirectedGraph.prototype.size = function() {
	return (this.edges().length)/2;
}

graph.UndirectedGraph.prototype.pathBetween = function(vertex1, vertex2, visitValue) {
	var visited = visitValue || [];
	if(vertex1 == vertex2)
		return visited.concat(vertex2);
	var notVisitedEdge = this.vertices[vertex1].filter(function(each){return visited.indexOf(each)==-1 })
	for(var i=0; i<notVisitedEdge.length; i++) {
		visited = this.pathBetween(notVisitedEdge[i], vertex2, visited.concat(vertex1));
		if(visited.slice(-1) != vertex2){
			visited.pop()
		}
	}
	return visited;
}

graph.UndirectedGraph.prototype.farthestVertex = function(vertex) {
	var allPaths=[];
	for(eachVertex in this.vertices){
		allPaths.push(this.pathBetween(vertex, eachVertex));
	}
	var longestPath = allPaths.reduce(function(pre,curr){
		return pre.length > curr.length ? pre : curr; 
	});
	return longestPath[longestPath.length-1];
}

graph.UndirectedGraph.prototype.allPaths = function(vertex1, vertex2, visitValue, path) {
	var visited = visitValue || [];
	var allPaths = path || [];
	if(vertex1 == vertex2)
		return visited.concat(vertex2);
	var notVisitedEdge = this.vertices[vertex1].filter(function(each){return visited.indexOf(each)==-1 })
	for(var i=0; i<notVisitedEdge.length; i++) {
		var paths = this.allPaths(notVisitedEdge[i], vertex2, visited.concat(vertex1), allPaths);
		if(paths && paths.slice(-1) == vertex2)
			allPaths.push(paths);
	}
	return allPaths;
}


module.exports = graph;