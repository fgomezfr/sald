
/* Circle vs Circle
 * INPUT: two circles specified by position and radius:
 *  c1 = {x:, y:, r:}, c2 = {x:, y:, r:}
 * RETURN VALUE:
 *  false if c1 and c2 do not intersect
 *  true if c1 and c2 do intersect
 */
function circleCircle(c1,c2) {
	var dx = c2.x - c1.x;
	var dy = c2.y - c1.y;
	var dr = c1.r + c2.r;
	return (dx * dx + dy * dy) <= (dr * dr);
}

/* Rectangle vs Rectangle
 * INPUT: rectangles specified by their minimum and maximum extents:
 *  r = {min:{x:, y:}, max:{x:, y:}}
 * RETURN VALUE:
 *  false if r1 and r2 do not intersect
 *  true if r1 and r2 do intersect
 */
function rectangleRectangle(r1, r2) {
	return r1.min.x < r2.max.x && r2.min.x < r1.max.x
	    && r1.min.y < r2.max.y && r2.min.y < r1.max.y;
}

/* Convex vs Convex
 * INPUT: convex polygons as lists of vertices in CCW order
 *  p = [{x:,y:}, ..., {x:, y:}]
 * RETURN VALUE:
 *  false if p1 and p2 do not intersect
 *  true if p1 and p2 do intersect
 */
function convexConvex(p1, p2) {
	//TODO
	return false;
}

/* Rav vs Circle
 * INPUT: ray specified as a start and end point, circle as above.
 *  ray = {start:{x:, y:}, end:{x:, y:}}
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayCircle(r, c) {

	var e = {x: r.end.x - r.start.x, y: r.end.y - r.start.y};
	var a = e.x * e.x + e.y * e.y;;
	if (a === 0) return null;

	var cdotc = c.x * c.x + c.y * c.y;
	var sdots = r.start.x * r.start.x + r.start.y * r.start.y;
	var sdotc = r.start.x * c.x + r.start.y * c.y;
	var sdote = r.start.x * e.x + r.start.y * e.y;
	var cdote = c.x * e.x + c.y * e.y;

	var b = 2 * (sdote - cdote);
	var c = cdotc + sdots + 2 * sdotc - c.r * c.r;

	var det = b * b - 4 * a * c;
	if (det < 0) return null;

	var root = sqrt(det);
	var aa = 2 * a;
	var t0 = (-b - root) / aa;
	var t1 = (b + root) / aa;

	if (t0 > 0 && t0 < 1) return {t: t0}
	else return {t: t1};
}

/* Rav vs Rectangle
 * INPUT: ray as above, rectangle as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayRectangle(r, b) {
	var divx = 1 / (r.end.x - r.start.x);
	var divy = 1 / (r.end.y - r.start.y);
	var tmin = 0;
	var tmax = 1;

	var xmin, xmax;
	if (divx >= 0)
	{
		xmin = (b.min.x - r.start.x) * divx;
		xmax = (b.max.x - r.start.x) * divx;
	}
	else
	{
		xmin = (b.max.x - r.start.x) * divx;
		xmax = (b.min.x - r.start.x) * divx;
	}
	tmin = xmin > tmin ? xmin : tmin;
	tmax = xmax < tmax ? xmax : tmax;

	var ymin, ymax;
	if (divy >= 0)
	{
		ymin = (b.min.y - r.start.y) * divy;
		ymax = (b.max.y - r.start.y) * divy;
	}
	else
	{
		ymin = (b.max.y - r.start.y) * divy;
		ymax = (b.min.y - r.start.y) * divy;
	}
	tmin = ymin > tmin ? ymin : tmin;
	tmax = ymax < tmax ? ymax : tmax;

	if (tmin < tmax) return {t: tmin}
	else return null;
}

/* Rav vs Convex
 * INPUT: ray as above, convex polygon as above.
 * RETURN VALUE:
 *  null if no intersection
 *  {t:} if intersection
 *    -- NOTE: 0.0 <= t <= 1.0 gives the position of the first intersection
 */
function rayConvex(r, p) {
	//TODO
	return null;
}


module.exports = {
	circleCircle: circleCircle,
	rectangleRectangle: rectangleRectangle,
	convexConvex: convexConvex,
	rayCircle: rayCircle,
	rayRectangle: rayRectangle,
	rayConvex: rayConvex
};
