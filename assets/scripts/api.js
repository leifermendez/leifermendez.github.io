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
    const about_me = document.querySelector('#my_profile_about_me');
    const repos = document.querySelector('#my_profile_my_repos');
    const avatar = document.querySelector('#my_profile_avatar');
    const linkedin = document.querySelector('#my_profile_linkedin');
    const medium = document.querySelector('#my_profile_medium');

    fetch('https://api.github.com/users/leifermendez')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            name.innerHTML = myJson.name
            about_me.innerHTML = myJson.bio
            repos.innerHTML = `<a href="${myJson.html_url}" target="_blank">${myJson.html_url}</a>`
            linkedin.innerHTML = `<a href="https://www.linkedin.com/in/leifermendez/" target="_blank">https://www.linkedin.com/in/leifermendez/</a>`
            medium.innerHTML = `<a href="https://medium.com/@leifer33" target="_blank">https://medium.com/@leifer33</a>`
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

getOrganization = () => {
    const company = document.querySelector('#my_profile_company');
    fetch('https://api.github.com/users/leifermendez/orgs')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            company.innerHTML =`<a href="https://github.com/${myJson[0].login}" target="_blank">@${myJson[0].login}</a>`
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
getOrganization();
