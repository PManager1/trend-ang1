/*
 * Snapshot an example website
 * remove all robots *  signs , just the sitemap. 
 *  more info here: https://github.com/localnerve/html-snapshots/issues/31#issuecomment-65005107
 *
 * Use sitemap.xml to snapshot the entire site.
 * Use a customFilter to update the output before the snapshots are written.
 * 
 */
var path = require("path");
var util = require("util");
var assert = require("assert");
var htmlSnapshots = require("html-snapshots");

htmlSnapshots.run({
  input: "sitemap",
  source: "http://localhost:9000/sitemap.xml",
  outputDir: path.join(__dirname, "./tmp"),
  outputDirClean: true,
  selector: ".trendli",
  snapshotScript: {
    script: "customFilter",
    module: path.join(__dirname, "myFilter.js")
  },
  timeout: 35000
}, function(err, completed) {  

  console.log("completed snapshots:");
  console.log(util.inspect(completed));

  // throw if there was an error
  assert.ifError(err);
});