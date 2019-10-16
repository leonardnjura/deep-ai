deepai.setApiKey('8011831a-8564-4113-9773-605a769cf2d9');
const host = `https://lno-deepai.herokuapp.com`;
const defaultTestInput = `https://user-images.githubusercontent.com/39657549/66860707-616a4c80-ef96-11e9-8d9f-70ce9bf7ca67.jpg`;
const testButton = document.querySelector('#test-button');

testButton.onclick = function() {
  const imageUrl = $('#image-url').val();
  if (validURL(imageUrl)) {
    analyzeImage(imageUrl);
    logTest();
  } else {
    analyzeImage();
    logTest();
  }
};

$('#preview').click(function() {
  $('#imageUpload').trigger('click');
});

async function analyzeImage(imageUrl = '') {
  $('#rpt').html(
    '<i class="mdi mdi-chart-donut-variant mdi-48px mdi-spin"></i> Working..'
  );
  if (!imageUrl) {
    // alert('No [valid] image url, checking local upload..');
    if (!imageUpload.files[0]) {
      alert('Please select local upload..');
      $('#rpt').html('🤔 You astound me..');
      return;
    } else {
      var result = await deepai.callStandardApi('content-moderation', {
        image: document.getElementById('imageUpload')
      });
    }
  } else {
    // alert('Good url [syntax]..');
    var result = await deepai.callStandardApi('content-moderation', {
      image: imageUrl
    });
  }
  await deepai.renderResultIntoElement(result, document.getElementById('rpt'));
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#preview').attr('src', e.target.result);
      $('#rpt').html(
        '<h5>File ready</h5><small>Click analyze to detect NSFW noodz!</small>'
      );
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#imageUpload').change(function() {
  readURL(this);
});

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

async function getUser(id) {
  const url = `${host}/api/auth/users/${id}`;
  try {
    const response = await axios.get(url);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function postBed(data) {
  const url = `${host}/api/beds`;
  try {
    const response = await axios.post(url, data);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function logTest(selector = 'iframe', time = 3000) {
  if (document.querySelector(selector) != null) {
    // alert('item of interest [element] ready..');
    var innerDoc = $(selector)
      .contents()
      .find('img')
      .attr('src');
    const agent = $('#agent').text();
    const agent_id = $('#agent-id').val();
    const input = innerDoc;
    const bedTest = { agent, agent_id, input };
    // console.log(bedTest);
    postBed(bedTest);
    return;
  } else {
    setTimeout(function() {
      logTest(selector, time);
    }, time);
  }
}
