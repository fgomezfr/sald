var fs = require('fs');
var path = require('path');

var transforms;

// process the javascript for a module
// find its dependencies and add them to the list
function processDependencies( blobs, cname, jstxt ){

	// Filter out comments in the jstext
	src = src.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '');

	// find dependencies in the jstxt
	// Match `require('*')` or `require("*")`
	var reqRegExp = /require\s*\((?:\s*"[^"]*"|'[^']*'\s*)\)\s*/gm;
	var reqs = src.match(reqRegExp);

	// extract dependency 'names'
	var stringRegExp = /"(.*)"|'(.*)'/;
	var dependencies = reqs.map(function(req) {
		var res = req.match(stringRegExp);
		var file = res[1] || res[2];
		if(!file) {
			var arg = req.match(/require\s*\(\s*(.*)\s*\)\s*;/);
			console.err(new Error("`" + arg[1] + "` is not a string literal."));
		}
		return res[1] || res[2];
	});
	
	// recursively process the dependencies
	for (var i = 0; i < dependencies.length; i ++)
	{
		var dependency = dependencies[i];

		// 1. identify type of dependency
		var is_literal = false;
		var deptype;
		var deptext;
		if (dependency.match(/\*:\*/))
		{
			var parts = dependency.split(':');
			deptype = parts[0] + ":";
			deptext = parts[1];
			is_literal = true;
		}
		else
		{
			deptype = path.extname(dependency);
			if (deptype === "")
			{
				console.err(new Error("Invalid argument to \"require\": ") + dependency + " in required object: " + cname);
				process.exit(1);
			}
			deptext = fs.readFileSync(dependency);
		}

		if (!transforms.hasOwnProperty(deptype))
		{
			console.err(new Error("Could not find a transform for dependency type: " + deptype));
			process.exit(1);
		}

		// 2. generate canonical name for dependency
		var depcname = transforms[deptype].canonicalFunc(dependency);

		// 3. replace argument to require() with canonical name
		var depRegEx = new RegExp("require\\s*\\(\\s*" + dependency + "\\s*\\)\\s*");
		jstxt.replace(depRegEx, "require(\" + depcname + "\")");

		// 4. if the canonical name exists in the dependcy list - skip it
		if (blobs.hasOwnProperty(depcname)) continue;

		// 5. perform transform to generate a jstxt for the dependency
		var depjs = transforms[deptype].transformFunc(deptext);

		// 6. recursively process its dependencies
		blobs[depcname] = ""; // prevent cyclical dependency
		processDependencies( blobs, depcname, depjs );
	}

	// add the jstxt with canonical name to blobs
	blobs[cname] = jstxt;
}

// top-level function - called by compiler
function top( entryfilename )
{
	if (path.extname(entryfilename) !== '.js'){
		print("Error - entry point must be a .js file!");
		return [];
	}

	var entryjs = fs.readFileSync(filename, {encoding:'utf8'});
	var blobs = {}	
	processDependencies( blobs, entryfilename, jstxt );
	return blobs;
}