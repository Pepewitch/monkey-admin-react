// ##############################
// // // Tasks for TasksCard - see Dashboard view
// #############################
var bugs = ['Sign contract for "What are conference organizers afraid of?"','Lines From Great Russian Literature? Or E-mails From My Boss?','Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit','Create 4 Invisible User Experiences you Never Knew About'];
var website = ['Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit','Sign contract for "What are conference organizers afraid of?"'];
var server = ['Lines From Great Russian Literature? Or E-mails From My Boss?','Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit','Sign contract for "What are conference organizers afraid of?"'];
var global = {
    postlink : 'https://www.monkey-monkey.com',
    subject : {
        M:'Math',
        P:'Physics',
        C:'Chemistry',
        E:'English',
        B:'Bio'
    } , 
    keySubject : ['','Math','Physics','Chemistry','English','Bio']
}
var serialize = function (obj, prefix) {
    var str = [], p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}
module.exports = {
    // these 3 are used to create the tasks lists in TasksCard - Dashboard view
    bugs,
    website,
    server,
    global,
    serialize,
    
}
