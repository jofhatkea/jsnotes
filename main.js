const database = firebase.database();
const headerEl = document.querySelector("#form_header");
const descriptionEl = document.querySelector("#form_description");
const form = document.querySelector("form");
const template = document.querySelector("#noteTemplate").content;
const app = document.querySelector("#app");

// add new notes
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    
    database.ref("notes/").push({
        header: headerEl.value,
        description: descriptionEl.value
    });
    //clear out form
    headerEl.value="";
    descriptionEl.value="";
});

//listen for new data
database.ref("notes/").on("child_added", (snapshot)=>{
    const key = snapshot.key;
    const data = snapshot.val();
    //console.log(key, data);
    const clone = template.cloneNode(true);
    clone.querySelector("article").dataset.key=key;
    clone.querySelector("h1").textContent = data.header;
    clone.querySelector("div.description").textContent = data.description;
    clone.querySelector("button.delete").addEventListener("click", e=>{
        database.ref("notes/"+key).remove();
    });
    clone.querySelector("button.edit").addEventListener("click", e=>{
        const tempTemplate = document.querySelector("#editFormTemplate").content;
        const formClone = tempTemplate.cloneNode(true);
        const theArticle = e.target.parentElement.parentElement;
        const theDiv = theArticle.querySelector("div").textContent;
        const theHeader = theArticle.querySelector("h1").textContent;
        const theKey = theArticle.dataset.key;
        console.log(theDiv, theHeader, theKey);
        formClone.querySelector("input").value=theHeader;
        formClone.querySelector("textarea").value=theDiv;
        formClone.querySelector("form").addEventListener("submit",e=>{
            e.preventDefault();
            let lastForm = document.querySelector("footer+form");
            console.log(lastForm)
            database.ref("notes/"+theKey).set({
                header: lastForm.querySelector("input").value,
                description: lastForm.querySelector("textarea").value
            });
            
            theArticle.querySelector("h1").textContent=lastForm.querySelector("input").value;
            theArticle.querySelector("div").textContent=lastForm.querySelector("textarea").value;
            lastForm.remove()
            //window.location="" // works, not nice
            //we should prob use child_changed

        });
        theArticle.appendChild(formClone);
    });
    app.appendChild(clone);

});

//listen for removal of data child_removed
database.ref("notes/").on("child_removed", snapshot=>{
    const key = snapshot.key;
    let el = document.querySelector(`article[data-key=${key}]`);
    el.remove();
});
