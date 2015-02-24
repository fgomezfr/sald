# simple blender export script
# prints vertices and triangles of a mesh to console
# triangles are indexes into the vertex list
# duplicate vertices are consolidated in the vertex list

import bpy
import math
import sys
import operator

modelname = None
for i in range(0, len(sys.argv)):
	if sys.argv[i] == '--':
		if len(sys.argv) == i + 2:
			modelname = sys.argv[i+1]

if modelname == None:
	print("Please pass '-- <model>' after the script name", file=sys.stderr)
	bpy.ops.wm.quit_blender()

for obj in bpy.data.objects:
	if obj.type == 'MESH' and obj.name == modelname:
		print("found mesh \"" + modelname + "\"")
	else: continue

	bpy.ops.object.mode_set(mode='OBJECT')
	obj.data = obj.data.copy() #"make single user" (?)
	bpy.context.scene.layers = obj.layers
	#First, triangulate the mesh:
	bpy.ops.object.select_all(action='DESELECT')
	obj.select = True
	bpy.context.scene.objects.active = obj
	bpy.ops.object.mode_set(mode='EDIT')
	bpy.ops.mesh.select_all(action='SELECT')
	#use_beauty went away in 2.70, now use:
	bpy.ops.mesh.quads_convert_to_tris(quad_method='BEAUTY', ngon_method='BEAUTY')
	bpy.ops.object.mode_set(mode='OBJECT')

	verts = {}
	tris = []
	vertex_count = 0;
	for poly in obj.data.polygons:
		assert(len(poly.vertices) == 3)
		tri = []
		for vi in poly.vertices:
			xf = obj.data.vertices[vi].co
			v = (xf[0], xf[1], xf[2])
			if v in verts:
				tri.append( verts[v] )
			else:
				tri.append( vertex_count )
				verts[v] = vertex_count
				vertex_count += 1
		assert(len(tri) == 3)
		tris.append( (tri[0], tri[1], tri[2]) )

	print("Vertices: " + str(vertex_count))
	sorted_verts = sorted(verts.items(), key=operator.itemgetter(1))
	vs = [ p for (p,i) in sorted_verts]
	print(vs)
	print("Triangles: " + str(len(tris)))
	print(tris)