// var mongoose = require('mongoose');

// var TrendSchema = new mongoose.Schema({
//   body: String,
//   votes: {type: Number, default: 0},  
//   comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Trend' }
// });

// //add an upvote() method to the Posts schema
// TrendSchema.methods.upvote = function (cb) {
//   console.log( ' reaching in the Trends mongo db ');
//     this.votes += 1;
//     this.save(cb);
// };

// TrendSchema.methods.downvote = function (cb) {
//     this.votes -= 1;
//     this.save(cb);
// };

// mongoose.model('Trend', TrendSchema);