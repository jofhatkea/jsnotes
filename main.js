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
    console.log(snapshot);
    const key = snapshot.key;
    const data = snapshot.val();
    //console.log(key, data);
    const clone = template.cloneNode(true);
    clone.querySelector("h1").textContent = data.header;
    clone.querySelector("div.description").textContent = data.description;
    app.appendChild(clone);

});

