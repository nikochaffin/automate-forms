var newGuid = require('./newGuid');

function getOrCreateSubmissionGuid(node) {
  var submissionField;
  if (!node.querySelector('input[name="_submission_guid"]')) {
    var submitGuid = newGuid();
    var guidInput = document.createElement('input');
    guidInput.setAttribute('type', 'hidden');
    guidInput.setAttribute('name', '_submission_guid');
    guidInput.value = submitGuid;
    node.appendChild(guidInput);
    submissionField = guidInput;
  } else {
    submissionField = node.querySelector('input[name="_submission_guid"]');
  }
  return submissionField;
}

module.exports = getOrCreateSubmissionGuid;
