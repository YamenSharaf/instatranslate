//Prevent the page from reloading on submit
document.getElementById("mySearch").addEventListener("submit", function(event){
  event.preventDefault();
});

//Implementing the clear button
document.getElementById('clearBtn').addEventListener("click", clearEverything);

//==========GLOBAL TEST AREA==========

var listArr = [];

//Collecting search parameters
function sendData(){
  //Search field
  let field = document.getElementById('searchTerm').value;
  //language selector
  let langSelect = document.getElementById('langs').value;
  //assigning languages to their proper codes
  let lang = ''
  switch (langSelect) {
    case 'Arabic': lang = 'ar';
      break;
    case 'English': lang = 'en';
      break;
    case 'Spanish': lang = 'es';
      break;
    case 'French': lang = 'fr';
      break;
    case 'Russian': lang = 'ru';
      break;
    default: alert('Please select a valid language to translate to from the drop down menu!');
  }
  //sending parameters to the next function to make the HTTP request
  makeRequest (field, lang);
}
//Making the HTTP request using the Axios plugin
function makeRequest(term, sentLang) {
  //parameters
  //@request: HTTP request header
  let request = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
  //@key: API key
  let key = 'key=trnsl.1.1.20170410T063226Z.2ac369d2fa38150a.89201083f38398d1e833ed54603c34f7f62d01f1&';
  //@language codes
  let from = 'en'+'-', to = sentLang;
  //making the request and retrieving response
  axios.get(request+key+'&text='+term+'&'+'lang='+to)
  .then(function (response) {
    //Specific translation object passed to the next function to display on screen
    displayResult(response.data.text[0]);
  })
  .catch(function (error) {
    console.log(error);
    throwError(error);
  });
}
//Rendering the result by attaching it to an HTML element
function displayResult(translated) {
  document.getElementById('result').innerHTML='<h1>'
                                               + translated
                                               + '</h1>';
  saveHistory(translated);
}

//Validating forms and throwing errors
function throwError(err) {
  let errString = String(err);
  let errVerb = '';
  if (errString.includes('400') || errString.includes('422')) {
    errVerb = "Please enter a valid word!";
  } else if (errString.includes('Network Error')) {
    errVerb = "Please check your internet connection!";
  } else {
    errVerb = "Unknown error. Please check your log!";
  }
  document.getElementById('result').innerHTML='<h3 style="color:white">'
                                              + errVerb
                                              + '</h3>';
}

//Clearing the form and the result
function clearEverything() {
  // Reset form
  document.getElementById('mySearch').reset();
  // Reset the result
  document.getElementById('result').innerHTML='';
}

//Local storage stuff

function saveHistory(listEntry) {
  let field = document.getElementById('searchTerm').value;

  listArr.push(listEntry);
  let dummyArr = listArr.slice();
  getListItem (dummyArr);

}
function getListItem (fullList) {
  let lastItem  = fullList.pop();
  renderList(lastItem);
}

function renderList(li) {
  let history = document.getElementById('history');
  history.insertAdjacentHTML('afterend',
                                       '<li>'
                                        + li
                                        + '</li>'
                                      );
}
