//Prevent the page from reloading on submit
document.getElementById("mySearch").addEventListener("submit", function(event){
  event.preventDefault();
});

//Implementing the clear button
document.getElementById('clearBtn').addEventListener("click", clearEverything);

//Collecting search parameters
function sendData(){
  //Search field
  let field = document.getElementById('searchTerm').value;
  //validating field for empty string
  //if (field === "") {throwError()}
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
    default: alert('Please select a valid language!');
  }
  //sending parameters to the next function to make the HTTP request
  makeRequest (field, lang);
}
//Makeing the HTTP request using the Axios plugin
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
  document.getElementById('result').innerHTML='<h1 style="color:blue">'
                                               + translated
                                               + '</h1>';
  // Reset form
  // document.getElementById('mySearch').reset();
}

//Displaying an error
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
  document.getElementById('result').innerHTML='<h3 style="color:red">'
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
