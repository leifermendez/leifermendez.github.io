syntaxHighlight = (json) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

getMyData = () => {
    const name = document.querySelector('#my_profile_name');
    const company = document.querySelector('#my_profile_company');
    const about_me = document.querySelector('#my_profile_about_me');
    const repos = document.querySelector('#my_profile_my_repos');
    const avatar = document.querySelector('#my_profile_avatar');
    const linkedin = document.querySelector('#my_profile_linkedin');

    fetch('https://api.github.com/users/leifermendez')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            name.innerHTML = myJson.name
            company.innerHTML = myJson.company
            about_me.innerHTML = myJson.bio
            repos.innerHTML = myJson.html_url
            linkedin.innerHTML = 'https://www.linkedin.com/in/leifermendez/'
            avatar.src = myJson.avatar_url
            console.log(myJson);
        });
};

getMyRepos = () => {

    fetch('https://api.github.com/users/leifermendez/repos')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
        });
}

getMyGits = () => new Promise((resolve, reject) => {
    fetch('https://api.github.com/users/leifermendez/gists')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const file = myJson.find(a => a.description === 'profile-contact-data.json');
            const objectFile = Object.keys(file.files);
            const fileRaw = file.files[objectFile[0]];
            resolve(fileRaw.raw_url);
        });
})

getSecretData = () => {
    getMyGits().then(file => {
        fetch(file)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                const output_console = document.querySelector('#output_console');
                output_console.innerHTML = syntaxHighlight(JSON.stringify(myJson))
                jQuery('#card_output').fadeIn("slow");
                return myJson
            });
        return 'Success';
    })

};

getExtraData = () => {

}

getData = (opt = 'data') => {
    if (opt === 'data') {
        getSecretData()
        return 'Loading Data..!'
    } else if ('extra') {
        getExtraData()
        return 'Loading Data..!'
    }

};

getMyData();
getMyRepos();
