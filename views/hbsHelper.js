const moment = require('moment');

function formatDate(date,format){
    return moment(date).format(format);
}

function preView(str, len)
{
    if(str.length>len)
    {
        let short_str=str+' ';
        short_str = str.substr(0,len);
        short_str+='...';
        return short_str;

    }
    return str;
}

function removeHTML(str)
{
    //remove any HTML element using regular expression
    return str.replace(/<(?:.|\n)*?>/gm,'');
}

function editBtn(blogOwner,loginUser)
{
    //visitor's mode
    if(!loginUser)
        return false;
    return blogOwner._id.toString()==loginUser._id.toString();
}


module.exports.formatDate = formatDate;
module.exports.preView=preView;
module.exports.removeHTML=removeHTML;
module.exports.checkEdit=editBtn;