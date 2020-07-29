//initia the materialize side nav bar
M.Sidenav.init(document.querySelector('.sidenav'))
//initialize the Form selection public/private
M.FormSelect.init(document.querySelector('.status'))
//replace the textarea of CK editor
CKEDITOR.replace('content',{
    //what you see is what you get area
    plugins:'wysiwygarea, toolbar,basicstyles,link' 
})

