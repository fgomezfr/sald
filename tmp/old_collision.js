/*
 * circle = { center : {x, y}, radius } @ensures radius > 0
 * box = { min : {x, y}, max : {x, y} } @ensures min.x < max.x, min.y < max.y
 * poly = { points[] : {x, y} } @ensures convex, counterclockwise
 * ray = { dir : {x, y}, origin } @ensures ||dir|| = 1
 */

var circleCircle = function(c1, c2){
	var o.x = c2.center.x - c1.center.x;
	var o.y = c2.center.y - c1.center.y;
	return (o.x * o.x + o.y * o.y) <= (c1.radius * c1.radius + c2.radius * c2.radius);
}

var boxBox = function(b1, b2){
	return r1.min.x < r2.max.x && r2.min.x < r1.max.x
	    && r1.min.y < r2.max.y && r2.min.y < r1.max.y;
}

// neat algo at wm.ite.pl/articles/convex-polygon-intersection/article.html
var polyPoly = function(p1, p2){

	var iprev = length(p1.points) - 1;
	for (var i = 0; i < length(p1.points); i++)
	{
		var inext = (i + 1) % length(p1.points);
		var jprev = length(p2.points) - 1;
		for (var j = 0; j < length(p2.points); j++)
		{
			var jnext = (j + 1) % length(p2.points);


			var dx = p2.points[j].x - p1.points[i].x;
			var dy = p2.points[j].y - p1.points[i].y;
			var b = (dx * p1.points[i].y - dy * p1.points[i].x);
			// line side test: f(p) = dy*x - dx*y + b

			var si0 = dy * p1.points[iprev].x - dx * p1.points[iprev].y + b;
			var si1 = dy * p1.points[inext].x - dx * p1.points[inext].y + b;

			if (si0 * si1 < 0)
				continue;

			var si = (si0 === 0) ? si1 : si0;

			var sj0 = dy * p1.points[jprev].x - dx * p1.points[jprev].y + b;
			var sj1 = dy * p1.points[jnext].x - dx * p1.points[jnext].y + b;
		
			if (sj0 * sj1 < 0)
				continue;

			var sj = (sj0 === 0) ? sj1 : sj0;

			if (si * sj < 0)
				return false;

			var jprev = j;
		}
		var iprev = i;
	}
	return true;
}

var rayCircle = function(r, c){
	var L = {x: c.center.x - r.origin.x,
	         y: c.center.y - r.origin.y};

	var h = x: L.x * r.dir.x + y: L.y * r.dir.y;

	var p = {x: r.origin.x + h * r.dir.x,
	         y: r.origin.y + h * r.dir.y};

	var dx = p.x - c.center.x;
	var dy = p.y - c.center.y;
	return (dx * dx + dy * dy) <= (c.radius * c.radius);
}

var rayBox = function(r, b){
	var divx = 1 / r.dir.x;
	var divy = 1 / r.dir.y;
	var txmin, txmax, tymin, tymax;

	if (divx >= 0)
	{
		txmin = (b.min.x - r.origin.x) * divx;
		txmax = (b.max.x - r.origin.x) * divx;
	}
	else
	{
		txmin = (b.max.x - r.origin.x) * divx;
		txmax = (b.min.x - r.origin.x) * divx;
	}

	if (divy >= 0)
	{
		tymin = (b.min.y - r.origin.y) * divy;
		tymax = (b.max.y - r.origin.y) * divy;
	}
	else
	{
		tymin = (b.max.y - r.origin.y) * divy;
		tymax = (b.min.y - r.origin.y) * divy;
	}

	return (txmin < tymax) && (tymin < txmax);
}

var rayPoly = function(r, p){

	// note: could use a cross product here
	var n = {x: r.dir.y, y: -r.dir.x};
	var pp = [];
	// project each vertex onto the ray
	for (var i = 0; i < length(p.points); i++)
	{
		var dx = (p.points[i].x - r.origin.x);
		var dy = (p.points[i].y - r.origin.y);
		var fb =  dx * r.dir.x +  dy * r.dir.y;
		var lr = dx * n.x + dy * n.y;
		pp.add({f: fb, s: lr});
	}

	var edges = [];
	// look for edges that cross the ray
	for (var i = 0; i < length(pp); i++)
	{
		var j = (i + 1) % length(pp);
		// please use 32 bit IEEE floats :3
		if ( (pp[i].s & 0x10000000) != (pp[j].s & 0x10000000) )
		{
			edges.add({idx0: i, idx1: j});
		}
	}

	// accept only edges that cross in front of the ray origin!
	for (var i = 0; i < length(edges); i++)
	{
		var edge = edges[i];
		if (pp[edge.idx0].f > 0 || pp[edge.idx1].f > 0)
		{
			return true;
		}
	}

	return false;
}