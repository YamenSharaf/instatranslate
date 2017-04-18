//Prevent the page from reloading on submit
document.getElementById("mySearch").addEventListener("submit", function(event) {
  //Prevent the page from reloading
  event.preventDefault();


  // Start Operation
  collectParams();
});

//Implementing the clear button
document.getElementById('clearBtn').addEventListener("click", clearEverything);

//Collecting search parameters
function collectParams() {
  //Search field
  let field = document.getElementById('searchTerm').value;


  //language selector
  let langSelect = document.getElementById('langs').value;

  //assigning languages to their proper codes
  let lang = ''
  switch (langSelect) {
    case 'Arabic':
      lang = 'ar';
      break;
    case 'English':
      lang = 'en';
      break;
    case 'Spanish':
      lang = 'es';
      break;
    case 'French':
      lang = 'fr';
      break;
    case 'German':
      lang = 'de';
      break;
    case 'Italian':
      lang = 'it';
      break;
    case 'Russian':
      lang = 'ru';
      break;
    case 'Japanese':
      lang = 'ja';
      break;
    case 'Chinese':
      lang = 'zh';
      break;
    default:
      alert('Please select a valid language to translate to from the drop down menu!');
  }

  //Checking for errors
  if (field == '') {
    throwError('422');
  } else {
    //If no erroe procceed as usual
    //sending parameters to the next function to make the HTTP request
    translate.prepareRequest(field, lang);
  }


}

var translate = {

  prepareRequest: function(term, lang) {
    //Getting the provider from the DOM
    let provSelect = document.getElementById('provs').value;
    //Preparing parameters
    let request = '';
    let prov = ''
    // Distinguishing between providers and their http strings
    switch (provSelect) {
      //Google request params
      case 'Google':
        request = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + lang + '&dt=t&q=' + term;
        prov = 'google'
        //sending the request URL along to make the actual request
        this.makeRequest(request, prov);
        break;
      //Yandex request params
      case 'Yandex':
        request = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170410T063226Z.2ac369d2fa38150a.89201083f38398d1e833ed54603c34f7f62d01f1&text=' + term + '&lang=' + lang;
        prov = 'yandex';
        //sending the request URL along to make the actual request
        this.makeRequest(request, prov);
        break;
      default:
        alert('Please select a proper provider');

    }

  },

  makeRequest: function(request, provider) {
    //making the request and retrieving response
    axios.get(request)
      .then(function(response) {
        //In case of Google
        if (provider == 'google') {
          displayResult(response.data[0][0][0]);
          //In case of Yandex
        } else if (provider == 'yandex') {
          displayResult(response.data.text[0]);
        }
      })
      .catch(function(error) {
        console.log(error);
        throwError(error);
      });

  }

}

//Rendering the result by attaching it to an HTML element
function displayResult(translated) {
  document.getElementById('result').innerHTML = '<h1>' +
    translated +
    '</h1>';
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
  document.getElementById('result').innerHTML = '<h3>' +
    errVerb +
    '</h3>';
}

//Clearing the form and the result
function clearEverything() {
  // Reset form
  document.getElementById('mySearch').reset();
  // Reset the result
  document.getElementById('result').innerHTML = '';
}
