// Confix Variables
    let env_submit_host = 'https://gov011mcrmda501.mieog.state.mi.us';
    let env_app_name = 'gov-recognition-forms';


// OnLoad Run
window.addEventListener('load', function() {
    InitNavigationMenu();

    switch (window.location.pathname.toLowerCase().replace('/' + env_app_name, '')) {
        case '/':
        case '/index.html':
            break;

        case '/flag-form.html':
                InitFormListeners();
                SetupFormFieldMasks('form-flag');
                FlagChangeWatcher();
            break;

        case '/recognition-form.html':
                InitFormListeners();
                SetupFormFieldMasks('form-recognition');
                SetReferenceListeners();
            break;

        case '/event-form.html':
                InitFormListeners();
                SetupFormFieldMasks('form-event');
                SetReferenceListeners();
            break;

        case '/tribute-form.html':
                InitFormListeners();
                SetupFormFieldMasks('form-tribute');
                SetReferenceListeners();
            break;

        case '/proclamation-form.html':
                InitFormListeners();
                SetupFormFieldMasks('form-proclamation');
                SetReferenceListeners();
            break;

        default:
            break;
    }
});

function InitNavigationMenu() {
    let nav_toggler = document.querySelector('.navbar-toggler');
    let nav_popup = document.querySelector('.navbar-popup');

    nav_toggler.addEventListener('click', function() {
        if (nav_popup.classList.contains('navbar-popup-show')) {
            nav_toggler.classList.remove('navbar-toggler-expand');
            nav_popup.classList.remove('navbar-popup-show');
        }
        else {
            nav_toggler.classList.add('navbar-toggler-expand');
            nav_popup.classList.add('navbar-popup-show');
        }
    });

    // close menu popup on mousedown outside of menu popup
    document.addEventListener('mousedown', function(event) {
        if (nav_popup.classList.contains('navbar-popup-show')) {
            contains_login_popup = false;
            node = event.target;

            // check event.target parents for menu popup and menu toggler
            while (node !== null) {
                if (node === nav_popup || node === nav_toggler) {
                    contains_login_popup = true;
                }
                node = node.parentElement;
            }

            // if outside of menu popup, close menu popup and flip chevron
            if (!contains_login_popup) {
                nav_toggler.classList.remove('navbar-toggler-expand');
                nav_popup.classList.remove('navbar-popup-show');
            }
        }
    });
}

function FlagChangeWatcher() {
    var field_mi_flag_qty = document.querySelector('#michigan_flag_qty');
    var field_us_flag_qty = document.querySelector('#us_flag_qty');
    var field_flag_total = document.querySelector('#flag_total');


    field_mi_flag_qty.addEventListener('change', (event) => {
        field_flag_total.value = '$' + GetTotalFlagCost();
    });

    field_us_flag_qty.addEventListener('change', (event) => {
        field_flag_total.value = '$' + GetTotalFlagCost();
    });
}

function GetTotalFlagCost() {
    var mi_flag_cost = 45.00;
    var us_flag_cost = 25.00;
    var field_mi_flag_qty = parseInt(document.querySelector('#michigan_flag_qty').value);
    var field_us_flag_qty = parseInt(document.querySelector('#us_flag_qty').value);
    var cost_total = 0;

    cost_total = cost_total + (mi_flag_cost * field_mi_flag_qty);
    cost_total = cost_total + (us_flag_cost * field_us_flag_qty);

    return parseInt(cost_total);
}

// Forms related functions
function SetupFormFieldMasks(form_id) {
    var form = document.querySelector('#' + form_id);

    if (form) {
        var fields_to_mask = form.querySelectorAll('[data-mask]');
    
        if (fields_to_mask.length > 0) {
            Array.from(fields_to_mask).forEach((field) => {
                switch (field.getAttribute('data-mask')) {
                    case 'tel':
                        IMask(
                            field, {
                                mask: '(000) 000-0000'
                            }
                        );
                        break;
                
                    default:
                        console.log('Mask was not specified for:', field)
                        break;
                }
            });
        }
    }
    else {
        console.log('Cannot apply field masking, "' + form_id + '" form not found.')
    }
}

// Cookie management
function CreateCookie(values) {
    var date = new Date();
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    document.cookie = values + '; expires=' + midnight.toGMTString();
}

function GetCookie(cookie_name) {
    var name = cookie_name + '=';
    var decoded_cookie = decodeURIComponent(document.cookie);
    var ca = decoded_cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function CountCurrentCookies() {
    var cookie_total = 0;

    if (GetCookie('form_submitted_once') !== '') {
        cookie_total = cookie_total + 1;
    }
    if (GetCookie('form_submitted_twice') !== '') {
        cookie_total = cookie_total + 1;
    }

    return cookie_total;
}

function UpdateCookieSubCount() {
    if (GetCookie('form_submitted_once') === '') {
        CreateCookie('form_submitted_once=success');
    }
    else {
        if (GetCookie('form_submitted_twice') === '') {
            CreateCookie('form_submitted_twice=success');
        }
    }
}

function InitFormListeners() {
    if (document.querySelectorAll('[data-form-submit-target]').length) {
        Array.from(document.querySelectorAll('[data-form-submit-target]')).forEach(function(submit_buttom) {
            let form_submit_button = document.querySelector('[data-form-submit-target]');
            let form = document.querySelector('#' + form_submit_button.getAttribute('data-form-submit-target'));
            let form_inputs = document.querySelectorAll('#' + form.getAttribute('id') + ' input, ' + '#' + form.getAttribute('id') + ' textarea, ' + '#' + form.getAttribute('id') + ' select');
            let form_file_inputs = document.querySelectorAll('[type="file"]');

            SetupInputListeners(form_inputs);

            SetupFileInputConverters(form_file_inputs);

            submit_buttom.addEventListener('click', function(event) {
                EvaluateFormSubmit(form, form_inputs);
            });
        });
    }
    else {
        return;
    }
}

function SetupFileInputConverters(form_file_inputs) {
    Array.from(form_file_inputs).forEach((file_input) => {
        var file_base64_input = document.querySelector('#' + file_input.getAttribute('id') + '_base64');

        if (file_base64_input) {
            file_input.addEventListener('change', function() {
                SetFileEncodedValueToField(file_input, file_base64_input);
            });
        }
        else {
            console.log('"#' + file_input.getAttribute('id') + '" does not have a base64 hidden input.');
        }
    });
}

function SetupInputListeners(form_inputs) {
    Array.from(form_inputs).forEach(function(input) {
        if (input.parentElement.classList.contains('input-set-required') || input.hasAttribute('data-regex-check')) {
            input.addEventListener('change', function(event) {
                if (input.value !== '') {
                    input.parentElement.classList.remove('input-set-failed');
                }
                else {
                    if (input.hasAttribute('data-regex-check') && !input.parentElement.classList.contains('input-set-required')) {
                        if (input.value === '') {
                            input.parentElement.classList.remove('input-set-failed');
                        }
                    }
                }
            });
        }
    });
}

function EvaluateFormSubmit(form, form_inputs) {
    let form_inputs_evaluated = SortFormFields(form_inputs);

    ProcessFormFields(form_inputs_evaluated[0], form_inputs_evaluated[1]);

    if (form_inputs_evaluated[0].length === 0) {
        let form_submit_json_string = BuildFormSubmitJson(form_inputs);
        ProcessFormSubmit(form, form_submit_json_string);
    }
}

function SortFormFields(form_inputs) {
    let failed_inputs = [];
    let passed_inputs = [];

    Array.from(form_inputs).forEach(function(input) {
        if (input.parentElement.classList.contains('input-set-required')) {
            if (input.value !== '') {
                if (input.hasAttribute('data-regex-check')) {
                    if (CheckFieldValueFormat(input, input.getAttribute('data-regex-check'))) {
                        passed_inputs.push(input);
                    }
                    else {
                        failed_inputs.push(input);
                    }
                }
                else {
                    passed_inputs.push(input);
                }
            }
            else {
                failed_inputs.push(input);
            }
        }
        else {
            if (input.hasAttribute('data-regex-check')) {
                if (input.value !== '') {
                    if (CheckFieldValueFormat(input, input.getAttribute('data-regex-check'))) {
                        passed_inputs.push(input);
                    }
                    else {
                        failed_inputs.push(input);
                    }
                }
                else {
                    passed_inputs.push(input);
                }
            }
        }
    });

    return [failed_inputs, passed_inputs];
}

function CheckFieldValueFormat(field, eval_as) {
    let regex_email_check = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    let regex_phone_check = RegExp(/^.{14}$/);

    switch (eval_as) {
        case 'email':
            if (regex_email_check.test(field.value)) {
                return true;
            }
            else {
                return false;
            }
            break;

        case 'tel':
            if (regex_phone_check.test(field.value)) {
                return true;
            }
            else {
                return false;
            }
            break;
    
        default:
            return true;
            break;
    }
}

function ProcessFormFields(failed_inputs, passed_inputs) {
    if (failed_inputs.length > 0) {
        failed_inputs[0].focus();
    }

    Array.from(failed_inputs).forEach(function(failed) {
        failed.parentElement.classList.add('input-set-failed');
    });

    Array.from(passed_inputs).forEach(function(passed) {
        passed.parentElement.classList.remove('input-set-failed');
    });
}

function BuildFormSubmitJson(form_inputs) {
    let form_value_json = {};

    Array.from(form_inputs).forEach(function(input) {
        if (input.hasAttribute('data-db-field-name')) {
            switch (input.type) {
                case 'checkbox':
                    form_value_json[input.getAttribute('data-db-field-name')] = input.checked;
                    break;

                default:
                    form_value_json[input.getAttribute('data-db-field-name')] = ReplaceBadUrlParamCharacters(input.value);
                    break;
            }
        }
    });

    return JSON.stringify(form_value_json);
}

function SetFileEncodedValueToField(field, field_base64) {
    var files = field.files;
    var file = files[0];

    if (files && file) {
        var reader = new FileReader();

        reader.onload = function(reader_field) {
            var binary_string = reader_field.target.result;
            field_base64.value = btoa(binary_string);
            field_base64.value = '';
        };

        reader.readAsBinaryString(file);
    }
}

function ReplaceBadUrlParamCharacters(fix_string) {
    let bad_chars = ['&', '#'];
    let char_rep_with = ['and', '_pound_'];

    bad_chars.forEach((char, index) => {
        var char_all = new RegExp(char, 'g');
        fix_string = fix_string.replace(char_all, char_rep_with[index]);
    });

    return fix_string;
}

function ProcessFormSubmit(form, form_submit_json_string) {
    let url = env_submit_host + '/GovUI/SaveJsonAndFileData?JsonLogData=' + encodeURI(form_submit_json_string);

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            var status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                UpdateFormDisplay(form, 'success');
            }
            else {
                UpdateFormDisplay(form, 'error');
            }
        }
    };

    // Code for working with file attachments
    // (Not clean, in later versions build info form processing pipeline)
    // Also currently limits each form to one attachment
    var form_data = new FormData();
    var file_field = document.querySelector('input[type=file]');

    if (file_field) {
        form_data.append('file', file_field.files[0]);
    }

    request.open('POST', url, true);
    request.send(form_data);

    UpdateFormDisplay(form, 'loading');
}

function UpdateFormDisplay(form, request_status_code) {
    if (request_status_code === 'loading') {
        Array.from(document.querySelectorAll('[data-hide-on-submit]')).forEach(function(element) {
            element.setAttribute('hidden', 'true');
        });

        document.querySelector('[data-form-loading-target=' + form.getAttribute('id') + ']').classList.add('form-loading-show');
    }
    else {
        document.querySelector('[data-form-loading-target=' + form.getAttribute('id') + ']').classList.remove('form-loading-show');

        if (request_status_code === 'success') {
            form.setAttribute('hidden', 'true');

            document.querySelector('[data-form-results-target=' + form.getAttribute('id') + ']').classList.add('form-results-show');
            document.querySelector('[data-form-results-target=' + form.getAttribute('id') + '] .results-success').focus();
        }

        if (request_status_code === 'error') {
            Array.from(document.querySelectorAll('[data-hide-on-submit]')).forEach(function(element) {
                element.removeAttribute('hidden');
            });

            console.error('There was an error in processing your request. Please try again later.');
            alert('There was an error in processing your request. Please try again later.');
        }
    }
}









// Necessary attributes described below:
//	data-target					:	id|name of the element that you're checking the value of. use id for all except for radios, use name for radios.
//	data-target-type			:	is optional unless if the target is checkbox or radio. by default will evaluate as text.
//	data-target-pass			:	a pseudo-array containing the target values that will take positive action. separate values by |. can be * if you want to always pass.
//	data-target-add				:	is optional. contains class to add|remove based on pass value. if data-target-add|data-target-remove|data-target-set-required not found, by default will toggle display block|none.
//	data-target-remove			:	is optional. contains class to add|remove based on pass value. if data-target-add|data-target-remove|data-target-set-required not found, by default will toggle display block|none.
//	data-target-set-required	:	is optional. will add or remove 'required' attribute based on pass value. if data-target-add|data-target-remove|data-target-set-required not found, by default will toggle display block|none.

function SetReferenceListeners() {
	Array.from(document.querySelectorAll('[data-target-pass]')).forEach(function(src_element) {
		switch (src_element.getAttribute('data-target-type')) {
			case 'radio':
				Array.from(document.querySelectorAll("[name=" + src_element.getAttribute('data-target') + "]")).forEach(function(radio_element) {
					radio_element.addEventListener('change', function(event) {
						var trgt_element = document.querySelector("[name=" + src_element.getAttribute('data-target') + "]:checked");

						if (src_element.getAttribute('data-target-pass').split('|').indexOf(trgt_element.value) !== -1 || src_element.getAttribute('data-target-pass').split('|').indexOf('*') !== -1) {
							if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
								if (src_element.hasAttribute('data-target-add')) {
									src_element.classList.add(src_element.getAttribute('data-target-add'));
								}
								if (src_element.hasAttribute('data-target-remove')) {
									src_element.classList.remove(src_element.getAttribute('data-target-remove'));
								}
								if (src_element.hasAttribute('data-target-set-required')) {
									src_element.setAttribute('required', true);
								}
							}
							else {
								src_element.style.display = '';
                            }
                            MassSetRequiredStatus('add', src_element);
                            SetupInputListeners(src_element.querySelectorAll('input, textarea, select'));
						}
						else {
							if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
								if (src_element.hasAttribute('data-target-add')) {
									src_element.classList.remove(src_element.getAttribute('data-target-add'));
								}
								if (src_element.hasAttribute('data-target-remove')) {
									src_element.classList.add(src_element.getAttribute('data-target-remove'));
								}
								if (src_element.hasAttribute('data-target-set-required')) {
									src_element.removeAttribute('required');
								}
							}
							else {
								src_element.style.display = 'none';
                            }
                            MassSetRequiredStatus('remove', src_element);
                            MassClearFieldValues(src_element);
						}
					});
				});
				break;

			case 'checkbox':
				document.getElementById(src_element.getAttribute('data-target')).addEventListener('change', function(event) {
					var trgt_element = event.target;

					if (src_element.getAttribute('data-target-pass').split('|').indexOf(trgt_element.checked.toString()) !== -1 || src_element.getAttribute('data-target-pass').split('|').indexOf('*') !== -1) {
						if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
							if (src_element.hasAttribute('data-target-add')) {
								src_element.classList.add(src_element.getAttribute('data-target-add'));
							}
							if (src_element.hasAttribute('data-target-remove')) {
								src_element.classList.remove(src_element.getAttribute('data-target-remove'));
							}
							if (src_element.hasAttribute('data-target-set-required')) {
								src_element.setAttribute('required', true);
							}
						}
						else {
							src_element.style.display = '';
                        }
                        MassSetRequiredStatus('add', src_element);
                        SetupInputListeners(src_element.querySelectorAll('input, textarea, select'));
					}
					else {
						if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
							if (src_element.hasAttribute('data-target-add')) {
								src_element.classList.remove(src_element.getAttribute('data-target-add'));
							}
							if (src_element.hasAttribute('data-target-remove')) {
								src_element.classList.add(src_element.getAttribute('data-target-remove'));
							}
							if (src_element.hasAttribute('data-target-set-required')) {
								src_element.removeAttribute('required');
							}
						}
						else {
							src_element.style.display = 'none';
                        }
                        MassSetRequiredStatus('remove', src_element);
                        MassClearFieldValues(src_element);
					}
				});
				break;

			default:
				document.getElementById(src_element.getAttribute('data-target')).addEventListener('change', function(event) {
                    var trgt_element = event.target;

					if (src_element.getAttribute('data-target-pass').split('|').indexOf(trgt_element.value.toString()) !== -1 || src_element.getAttribute('data-target-pass').split('|').indexOf('*') !== -1) {
						if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
							if (src_element.hasAttribute('data-target-add')) {
								src_element.classList.add(src_element.getAttribute('data-target-add'));
							}
							if (src_element.hasAttribute('data-target-remove')) {
								src_element.classList.remove(src_element.getAttribute('data-target-remove'));
							}
							if (src_element.hasAttribute('data-target-set-required')) {
								src_element.setAttribute('required', true);
							}
						}
						else {
							src_element.style.display = '';
                        }
                        MassSetRequiredStatus('add', src_element);
                        SetupInputListeners(src_element.querySelectorAll('input, textarea, select'));
					}
					else {
						if (src_element.hasAttribute('data-target-add') || src_element.hasAttribute('data-target-remove') || src_element.hasAttribute('data-target-set-required')) {
							if (src_element.hasAttribute('data-target-add')) {
								src_element.classList.remove(src_element.getAttribute('data-target-add'));
							}
							if (src_element.hasAttribute('data-target-remove')) {
								src_element.classList.add(src_element.getAttribute('data-target-remove'));
							}
							if (src_element.hasAttribute('data-target-set-required')) {
								src_element.removeAttribute('required');
							}
						}
						else {
							src_element.style.display = 'none';
                        }
                        MassSetRequiredStatus('remove', src_element);
                        MassClearFieldValues(src_element);
					}
				});
				break;
		}
	});
}

function MassSetRequiredStatus(action, element) {
    if (action === 'add') {
        Array.from(element.querySelectorAll('.input-set-required-nocheck')).forEach((elm) => {
            elm.classList.remove('input-set-required-nocheck');
            elm.classList.add('input-set-required');
        });

        Array.from(element.querySelectorAll('[data-required-nocheck]')).forEach((elm) => {
            elm.removeAttribute('data-required-nocheck');
            elm.setAttribute('required', 'true');
        });
    }
    else if (action === 'remove') {
        Array.from(element.querySelectorAll('.input-set-failed')).forEach((elm) => {
            elm.classList.remove('input-set-failed');
        });

        Array.from(element.querySelectorAll('.input-set-required')).forEach((elm) => {
            elm.classList.remove('input-set-required');
            elm.classList.add('input-set-required-nocheck');
        });

        Array.from(element.querySelectorAll('[required]')).forEach((elm) => {
            elm.removeAttribute('required');
            elm.setAttribute('data-required-nocheck', 'true');
        });
    }
}

function MassClearFieldValues(element) {
    // Clear radio inputs
    Array.from(element.querySelectorAll('input[type="radio"]:checked')).forEach((elm) => {
        elm.removeAttribute('checked');
    });

    // Clear checkbox inputs
    Array.from(element.querySelectorAll('input[type="checkbox"]')).forEach((elm) => {
        elm.checked = false;
    });

    // Clear text inputs, textareas, and selects
    Array.from(element.querySelectorAll('input, textarea, select')).forEach((elm) => {
        elm.value = '';
    });
}