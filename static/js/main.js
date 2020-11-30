

// OnLoad Run
window.addEventListener('load', function() {
    InitNavigationMenu();

    switch (window.location.pathname.replace('/gov-recognition-forms', '').toLowerCase()) {
        case '/form-long.html':
            // InitFormProgressMarkers();
            InitFormProgressDisplay();
            // InitFormListeners();
            break;

        case '/form-short.html':
            InitFormPreSelector();
            InitFormDemoFunc();
            break;

        case '/self-help.html':
            InitSelfHelpMenu();
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

function InitFormProgressDisplay() {
    let progress_module = document.querySelector('.progress-bar-module');
    let progress_module_display = progress_module.querySelector('.progress-display');
    let progress_display_toggler = progress_module.querySelector('.display-toggle');

    if (progress_module) {
        progress_module.querySelector('.display-toggle').addEventListener('click', function() {
            if (progress_module_display.classList.contains('progress-display-open')) {
                progress_module_display.classList.remove('progress-display-open');
            }
            else {
                progress_module_display.classList.add('progress-display-open');
            }
        });
    }

    // close progress popup on mousedown outside of progress popup
    document.addEventListener('mousedown', function(event) {
        if (progress_module_display.classList.contains('progress-display-open')) {
            contains_progress_popup = false;
            node = event.target;

            // check event.target parents for progress popup and progress toggler
            while (node !== null) {
                if (node === progress_module_display || node === progress_display_toggler) {
                    contains_progress_popup = true;
                }
                node = node.parentElement;
            }

            // if outside of progress popup, close progress popup and flip chevron
            if (!contains_progress_popup) {
                progress_module_display.classList.remove('progress-display-open');
            }
        }
    });
}

function InitFormProgressMarkers() {
    Array.from(document.querySelectorAll('.progress-module .step-text')).forEach(function(element) {
        element.addEventListener('click', function(event) {
            if (element.parentElement.classList.length === 1) {
                element.parentElement.classList.add('step-pending');
            }
            else {
                if (element.parentElement.classList.contains('step-pending')) {
                    element.parentElement.classList.remove('step-pending');
                    element.parentElement.classList.add('step-complete');
                }
                else if (element.parentElement.classList.contains('step-complete')) {
                    element.parentElement.classList.remove('step-complete');
                    element.parentElement.classList.add('step-fail');
                }
                else if (element.parentElement.classList.contains('step-fail')) {
                    element.parentElement.classList.remove('step-fail');
                    element.parentElement.classList.add('step-error');
                }
                else if (element.parentElement.classList.contains('step-error')) {
                    element.parentElement.classList.remove('step-error');
                }
            }
        });
    });
}

function InitSelfHelpMenu() {
    Array.from(document.querySelectorAll('.help-topic .topic-header')).forEach((selected_topic) => {
        selected_topic.addEventListener('click', (event) => {
            var open_topic = document.querySelector('.help-topic-expanded');
            if (open_topic) {
                open_topic.classList.remove('help-topic-expanded');
            }

            if (open_topic !== selected_topic.parentElement) {
                selected_topic.parentElement.classList.add('help-topic-expanded');
            }
        });
    });
}

function InitFormPreSelector() {
    Array.from(document.querySelectorAll('.select-card')).forEach((card) => {
        card.addEventListener('click', (event) => {
            document.querySelector('.form-select-module').setAttribute('hidden', 'true');
            document.querySelector('.form-module').removeAttribute('hidden');
            window.scrollTo(0, 0);
        });
    });

    document.querySelector('.form-back-button').addEventListener('click', () => {
        document.querySelector('.form-module').setAttribute('hidden', 'true');
        document.querySelector('.form-select-module').removeAttribute('hidden');
        window.scrollTo(0, 0);
    });
}

function InitFormDemoFunc() {
    var type_selector = document.querySelector('#type');
    var type_sections = document.querySelectorAll('[data-type-select]');
    var type_section_birthday = document.querySelector('[data-type-select="birthday"]');
    var type_section_military = document.querySelector('[data-type-select="military"]');

    type_selector.addEventListener('change', (event) => {
        Array.from(type_sections).forEach((section) => {
            section.setAttribute('hidden', 'true');
        });

        switch (type_selector.value) {
            case 'military':
                type_section_military.removeAttribute('hidden');
                break;

            case 'birthday':
                type_section_birthday.removeAttribute('hidden');
                break;

            default:
                break;
        }
        document.querySelector('.form-select-module').setAttribute('hidden', 'true');
        document.querySelector('.form-module').removeAttribute('hidden');
    });

    document.querySelector('.form-back-button').addEventListener('click', () => {
        document.querySelector('.form-module').setAttribute('hidden', 'true');
        document.querySelector('.form-select-module').removeAttribute('hidden');
    });
}

// Forms related functions
function SetupFormFieldMasks() {
    var mask_phone = IMask(
        document.getElementById('phone'), {
            mask: '(000) 000-0000'
        }
    );
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

            SetupInputListeners(form_inputs);

            submit_buttom.addEventListener('click', function(event) {
                EvaluateFormSubmit(form, form_inputs);
            });
        });
    }
    else {
        return;
    }
}

function SetupInputListeners(form_inputs) {
    Array.from(form_inputs).forEach(function(input) {
        if (input.parentElement.classList.contains('input-set-required') || input.hasAttribute('data-regex-check')) {
            input.addEventListener('change', function(event) {
                if (input.value !== '') {
                    input.parentElement.classList.remove('input-set-failed');
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
        if (input.type === 'checkbox') {
            form_value_json[input.getAttribute('data-db-field-name')] = input.checked;
        }
        else {
            form_value_json[input.getAttribute('data-db-field-name')] = ReplaceBadUrlParamCharacters(input.value);
        }
    });

    return JSON.stringify(form_value_json);
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
    let url = 'https://gov011mcrmda501.mieog.state.mi.us/GovUI/SaveJsonLog?JsonLogData=' + encodeURI(form_submit_json_string);

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            var status = request.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                UpdateFormDisplay(form, 'success');
                UpdateCookieSubCount();
            }
            else {
                UpdateFormDisplay(form, 'error');
            }
        }
    };

    request.open('POST', url);
    request.send();

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
        if (request_status_code === 'max_submission') {
            form.setAttribute('hidden', 'true');
        }
    }
}