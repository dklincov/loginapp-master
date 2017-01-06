/**
 * Created by Lepediuss on 04.01.2017.
 */
var mongoose = require('mongoose');

// Project Schema
var projectSchema = mongoose.Schema({
    Title: {
        type: String,
        index:true
    },
    Img: {
        type: String
    },
    Architects: {
        type: String
    },
    Location: {
        type: String
    },
    Area: {
        type: String
    },
    ProjectYear: {
        type: String
    },
    Link: {
        type: String
    }
});

var Project = module.exports = mongoose.model('project', projectSchema);

module.exports.getProjectByTitle = function(ProjectTitle, callback){
    var query = {Title: ProjectTitle};
    Project.findOne(query, callback);
}

module.exports.getProject = function(callback){
    console.log("Project");
    Project.find(callback);

}

module.exports.getProjectByLocation = function(ProjectLocation, callback){
    var query = {Location: { "$in" : [ProjectLocation]} };
    Project.find(query, callback);
}

module.exports.getProjectByArea = function(ProjectArea, callback){
    var query = {Area: ProjectArea};
    Project.findOne(query, callback);
}

module.exports.getProjectByYear = function(ProjectYear, callback){
    var query = {ProjectYear: ProjectYear};
    Project.find(query, callback);
}


