const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const attr = e.target.querySelector('#domoAttr').value;

    if(!name || !age || !attr){
        helper.handleError('All fields are required');
        return false;
    }
    helper.sendPost(e.target.action, {name, age, attr}, e.target.method, onDomoAdded);
    //console.log("sent!");
    return false;
}

const deleteDomo = (e, onDomoDelete) => {
    const id = e.target.value;
    helper.sendPost("/maker", {id}, 'DELETE', onDomoDelete);
    return false;
}

const sortDomos = (domos, type) => {

    let tempDomos = domos.sort(function (a,b){
        if(a[type] < b[type]){
            return -1;
        }
        if(a[type] > b[type]) {
            return 1;
        }
        return 0;
    });

    return tempDomos;
}

const DomoForm = (props) => {
    return(
        <form id = "domoForm"
            onSubmit = {(e) => handleDomo(e, props.triggerReload)}
            name = "domoForm"
            action = "/maker"
            method = "POST"
            className = "domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id = "domoName" type = "text" name = "name" placeholder = "Domo Name" />
            <label htmlFor = "age">Age: </label>
            <input id = "domoAge" type = "number" min = "0" name = "age" />
            <label htmlFor = "attr">Attribute: </label>
            <input id = "domoAttr" type = "text" name = "attr" />
            <input className = "makeDomoSubmit" type = "submit" value = "Make Domo"/>
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);
    //console.log(domos);
    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            
            setDomos(data.domos);
        };
        loadDomosFromServer();

    }, [props.reloadDomos]);

    const changeFilter = (type) => {
        setDomos(sortDomos(domos, type));
        //console.log(domos);
        //props.triggerReload;
    }

    if(domos.length === 0){
        return (
            <div className = "domoList">
                <h3 className = "emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    let domoNodes = domos.map(domo => {
        return (
            <div key = {domo.id} className = "domo">
                <img src = "/assets/img/domoface.jpeg" alt = "domo face" className = "domoFace" />
                <h3 className = "domoName">Name: {domo.name}</h3>
                <h3 className = "domoAge"> Age: {domo.age}</h3>
                <h3 className = "domoAttr"> Attribute: {domo.attr}</h3>
                <button onClick = {(e) => deleteDomo(e, props.triggerReload)} class = "domoId" id = "domo._id" value = {domo._id}>Delete</button>
            </div>
        );
    });

    return (
        <div id = "main">
            <div id = "filters">
                <input onChange = {(e) => changeFilter(e.target.value, props.triggerReload)} name = "filters" type = "radio" id = "filterName" value = "name"/>
                <label for = "filterName">Name</label>
                <input onChange = {(e) => changeFilter(e.target.value, props.triggerReload)} type = "radio" name = "filters" id = "filterAge" value = "age"/>
                <label for = "filterAge">Age</label>
                <input onChange = {(e) => changeFilter(e.target.value, props.triggerReload)} type = "radio" name = "filters" id = "filterAttr" value = "attr"/>
                <label for = "filterAttr">Attr</label>
            </div>
            <div className = "domoList">
                {domoNodes}
            </div>
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id = "makeDomo">
                <DomoForm triggerReload = {() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id = "domos">
                <DomoList domos = {[]} reloadDomos = {reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;