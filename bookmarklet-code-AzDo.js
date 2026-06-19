javascript:(function () {
    const contextEl = document.querySelector(".work-item-form-page");
    const ticketNrEl = contextEl.querySelector(".work-item-form-header a.bolt-link");
    const titleEl = contextEl.querySelector(".work-item-title-textfield > input");

    function showMessage(message) {
        const el = document.createElement('div');
        el.innerHTML = message;
        el.style = "position:fixed; top: 0; right: 0; left: 0; padding: 10px; text-align: center; background-color: rgba(0,0,0,0.7); color: white; z-index: 9999;";
        document.body.appendChild(el);
        setTimeout(() => {
            document.body.removeChild(el);
        }, 3000);
    }

    if (!ticketNrEl || !titleEl) {
        showMessage("Something went wrong. Do you have an open Azure devlops ticket on the page?");
        return;
    }

    const titleDashedLowercase = titleEl.value.replace(/[^a-zA-Z0-9 ]/g , '').replace(/[\s\(\)\'\"\:]+/g, '-').toLowerCase();
    const ticketNr = ticketNrEl.innerText.substring(ticketNrEl.innerText.lastIndexOf(' ')).trim();

    let branchPrefix = '';
    if (ticketNrEl.innerText.startsWith('BUG')
      || ticketNrEl.innerText.startsWith('TEST FINDING')
      || ticketNrEl.innerText.startsWith('INCIDENT')) {
        branchPrefix = 'fix';
    } else {
        branchPrefix = 'feature';
    }

    const branchName = `${branchPrefix}/${ticketNr}-${titleDashedLowercase}`;
    const createBranchString =
      `git checkout -b ${branchName} \ngit push -u origin ${branchName}\n`;

    navigator.clipboard.writeText(createBranchString)
      .then(() => showMessage(`Copied:\n ${createBranchString}`))
      .catch((error) => {
          alert(`Copying failed. ${error}`)
      })
})();