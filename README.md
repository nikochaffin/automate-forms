# automate-forms

A solution for simpler forms with [Bixly Automate](https://bixly.com/automate).

This is a work in progress for now, as it's going to require some preexisting
models on the Automate instance in question.

--------

## Future ToDos

### Feature ToDos

- Generate the following field types from a `config` object:
  - [ ] String
  - [ ] Email
  - [ ] Number
  - [ ] Checkbox
  - [ ] Radio Button Set
  - [ ] Select
- [ ] Retrieve necessary fields and configuration from an API Script on a Bixly Automate instance
- [ ] Optional Material-esque styling for fields
- [ ] Loading spinners on submit button after submission and before form loads
- [ ] Asynchronous form submission to API script on a Bixly Automate instance
- [ ] Update client-side markup based on result of form submission
- Generate the following *(advanced)* field types from a `config` object:
  - [ ] File
  - [ ] Lists
  - [ ] Dictionaries
- [ ] Fields visible dependent on the validation of another field

### Development ToDos

- [ ] Documentation generation
- [ ] Babel + Uglify for splitting sources
