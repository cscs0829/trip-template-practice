// 토스 스타일 인증 시스템
let currentUser = null;
let currentEmail = '';
let signupData = {};

jQuery(document).ready(function() {
    console.log('토스 스타일 인증 시스템 로드됨');

    // 초기 로드 플래그 설정
    window.isInitialLoad = true;

    // 모든 페이지에서 동일 UI 사용: 컨테이너 자동 주입
    ensureTossAuthContainer();
    
    // 페이지 로드 시 로그인 상태 복원
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('저장된 로그인 상태 복원:', currentUser);
            // 초기 로드 시에는 updateLoginStatus 호출하지 않음 (토스트 알림 방지)
            // updateLoginStatus(currentUser);
        } catch (error) {
            console.error('저장된 사용자 정보 파싱 오류:', error);
            localStorage.removeItem('currentUser');
        }
    }
    
    // 초기 상태 설정
    initializeAuthUI();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 로드 완료 후 플래그 해제
    setTimeout(() => {
        window.isInitialLoad = false;
    }, 1000);
});

// 페이지에 인증 컨테이너가 없으면 동적으로 추가
function ensureTossAuthContainer() {
    if (document.querySelector('.toss-auth-container')) return;
    const container = document.createElement('div');
    container.className = 'toss-auth-container';
    container.innerHTML = [
        '<div class="skeleton-loading" id="skeletonLoading" style="display: none;">',
        '  <div class="skeleton-header"></div>',
        '  <div class="skeleton-input"></div>',
        '  <div class="skeleton-button"></div>',
        '</div>',
        '',
        '<div class="auth-step" id="emailStep">',
        '  <div class="auth-header">',
        '    <h1>안녕하세요!</h1>',
        '    <p>트립페이지에 오신 것을 환영합니다</p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="input-group">',
        '      <label for="emailInput">이메일</label>',
        '      <input type="email" id="emailInput" class="toss-input" placeholder="이메일을 입력해주세요">',
        '      <div class="error-message" id="emailError"></div>',
        '    </div>',
        '    <button class="toss-button" id="continueBtn" disabled>계속하기</button>',
        '  </div>',
        '</div>',
        '',
        '<div class="auth-step" id="passwordStep" style="display:none;">',
        '  <div class="auth-header">',
        '    <button class="back-button" id="backToEmail">←</button>',
        '    <h1>비밀번호를 입력해주세요</h1>',
        '    <p id="userEmail"></p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="input-group">',
        '      <label for="passwordInput">비밀번호</label>',
        '      <input type="password" id="passwordInput" class="toss-input" placeholder="비밀번호를 입력해주세요">',
        '      <div class="error-message" id="passwordError"></div>',
        '    </div>',
        '    <button class="toss-button" id="loginBtn" disabled>로그인</button>',
        '  </div>',
        '</div>',
        '',
        '<div class="auth-step" id="signupStep" style="display:none;">',
        '  <div class="auth-header">',
        '    <button class="back-button" id="backToEmailFromSignup">←</button>',
        '    <h1 id="signupTitle">회원가입을 진행할게요</h1>',
        '    <p id="signupSubtitle">몇 가지 정보가 필요해요</p>',
        '  </div>',
        '  <div class="auth-body">',
        '    <div class="signup-field" id="phoneField">',
        '      <div class="input-group">',
        '        <label for="phoneInput">전화번호</label>',
        '        <input type="tel" id="phoneInput" class="toss-input" placeholder="010-1234-5678">',
        '        <div class="error-message" id="phoneError"></div>',
        '      </div>',
        '      <button class="toss-button" id="phoneNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="nameField" style="display:none;">',
        '      <div class="input-group">',
        '        <label for="nameInput">이름</label>',
        '        <input type="text" id="nameInput" class="toss-input" placeholder="이름을 입력해주세요">',
        '        <div class="error-message" id="nameError"></div>',
        '      </div>',
        '      <button class="toss-button" id="nameNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="ageField" style="display:none;">',
        '      <div class="input-group">',
        '        <label for="ageInput">나이</label>',
        '        <input type="number" id="ageInput" class="toss-input" placeholder="나이를 입력해주세요" min="14" max="100">',
        '        <div class="error-message" id="ageError"></div>',
        '      </div>',
        '      <button class="toss-button" id="ageNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="genderField" style="display:none;">',
        '      <div class="gender-group">',
        '        <label>성별</label>',
        '        <div class="gender-options">',
        '          <button type="button" class="gender-option" data-gender="male">남성</button>',
        '          <button type="button" class="gender-option" data-gender="female">여성</button>',
        '        </div>',
        '        <div class="error-message" id="genderError"></div>',
        '      </div>',
        '      <button class="toss-button" id="genderNextBtn" disabled>다음</button>',
        '    </div>',
        '    <div class="signup-field" id="signupPasswordField" style="display:none;">',
        '      <div class="input-group">',
        '        <label for="signupPasswordInput">비밀번호</label>',
        '        <input type="password" id="signupPasswordInput" class="toss-input" placeholder="비밀번호를 설정해주세요">',
        '        <div class="error-message" id="signupPasswordError"></div>',
        '        <div class="password-hint">6자 이상 입력해주세요</div>',
        '      </div>',
        '      <button class="toss-button" id="completeSignupBtn" disabled>가입 완료</button>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join('');

    // body 끝에 추가
    document.body.appendChild(container);
}

function initializeAuthUI() {
    // 사용자 메뉴 초기 상태
    $('#userMenu').hide();
    $('#userMenuSidebar').hide();
    $('#adminBadge').hide();
    $('#adminBadgeSidebar').hide();
}

function setupEventListeners() {
    // 로그인 버튼 클릭
    $('#openLogin, #openLoginSidebar').on('click', function() {
        showTossAuth();
    });
    

    
    // 모달 외부 클릭 시 닫기
    $('.toss-auth-container').on('click', function(e) {
        if (e.target === this) {
            hideTossAuth();
        }
    });
    
    // 1단계: 이메일 입력 및 계속하기
    setupEmailStep();
    
    // 2단계: 비밀번호 입력 (기존 회원)
    setupPasswordStep();
    
    // 3단계: 회원가입 (신규 회원)
    setupSignupStep();
}

function showTossAuth() {
    $('.toss-auth-container').addClass('show');
    resetAuthFlow();
    setTimeout(() => {
        $('#emailInput').focus();
    }, 100);
}

function hideTossAuth() {
    $('.toss-auth-container').removeClass('show');
    setTimeout(() => {
        resetAuthFlow();
    }, 300);
}

function resetAuthFlow() {
    // 모든 단계 숨기기
    $('.auth-step').hide();
    $('#skeletonLoading').hide();
    
    // 첫 번째 단계 보이기
    $('#emailStep').show();
    
    // 입력값 초기화
    $('.toss-input').val('');
    $('.error-message').removeClass('show').text('');
    $('.toss-button').prop('disabled', true);
    
    // 회원가입 데이터 초기화
    signupData = {};
    currentEmail = '';
}

function setupEmailStep() {
    const emailInput = $('#emailInput');
    const continueBtn = $('#continueBtn');
    const errorMessage = $('#emailError');
    
    // 실시간 이메일 중복 검증 설정
    setupRealTimeEmailValidation(emailInput, errorMessage);
    
    // 이메일 입력 시 실시간 검증
    emailInput.on('input', function() {
        const email = $(this).val().trim();
        
        if (email === '') {
            continueBtn.prop('disabled', true);
            hideError(errorMessage);
            return;
        }
        
        const isValid = isValidEmail(email);
        const isUnique = validateEmailUniqueness(email).isValid;
        
        continueBtn.prop('disabled', !isValid || !isUnique);
        
        if (!isValid) {
            showError(errorMessage, '올바른 이메일 형식을 입력해주세요');
        } else if (!isUnique) {
            showError(errorMessage, '이미 사용 중인 이메일입니다');
        } else {
            hideError(errorMessage);
        }
    });
    
    // 계속하기 버튼 클릭
    continueBtn.on('click', function() {
        const email = emailInput.val().trim();
        
        if (!isValidEmail(email)) {
            showError(errorMessage, '올바른 이메일 형식을 입력해주세요');
            return;
        }
        
        const emailValidation = validateEmailUniqueness(email);
        if (!emailValidation.isValid) {
            showError(errorMessage, emailValidation.message);
            return;
        }
        
        checkEmailExists(email);
    });
    
    // 엔터키 처리
    emailInput.on('keypress', function(e) {
        if (e.which === 13 && !continueBtn.prop('disabled')) {
            continueBtn.click();
        }
    });
}

function setupPasswordStep() {
    const passwordInput = $('#passwordInput');
    const loginBtn = $('#loginBtn');
    const errorMessage = $('#passwordError');
    const backBtn = $('#backToEmail');
    
    // 비밀번호 입력 시 버튼 활성화
    passwordInput.on('input', function() {
        const password = $(this).val().trim();
        loginBtn.prop('disabled', password === '');
        hideError(errorMessage);
    });
    
    // 로그인 버튼 클릭
    loginBtn.on('click', function() {
        const password = passwordInput.val().trim();
        
        if (password === '') {
            showError(errorMessage, '비밀번호를 입력해주세요');
            return;
        }
        
        performLogin(currentEmail, password);
    });
    
    // 뒤로가기 버튼
    backBtn.on('click', function() {
        showStep('emailStep');
        $('#emailInput').focus();
    });
    
    // 엔터키 처리
    passwordInput.on('keypress', function(e) {
        if (e.which === 13 && !loginBtn.prop('disabled')) {
            loginBtn.click();
        }
    });
}

function setupSignupStep() {
    const backBtn = $('#backToEmailFromSignup');
    
    // 뒤로가기 버튼
    backBtn.on('click', function() {
        showStep('emailStep');
        $('#emailInput').focus();
    });
    
    // 전화번호 단계
    setupPhoneField();
    
    // 이름 단계
    setupNameField();
    
    // 나이 단계
    setupAgeField();
    
    // 성별 단계
    setupGenderField();
    
    // 비밀번호 단계
    setupSignupPasswordField();
}

function setupPhoneField() {
    const phoneInput = $('#phoneInput');
    const phoneNextBtn = $('#phoneNextBtn');
    const phoneError = $('#phoneError');
    
    // 실시간 전화번호 중복 검증 설정
    setupRealTimePhoneValidation(phoneInput, phoneError);
    
    phoneInput.on('input', function() {
        const phone = $(this).val().trim();
        
        // 전화번호 형식 자동 변환
        const formattedPhone = formatPhoneNumber(phone);
        if (formattedPhone !== phone) {
            $(this).val(formattedPhone);
        }
        
        const isValid = isValidPhoneNumber(formattedPhone);
        const isUnique = validatePhoneUniqueness(formattedPhone).isValid;
        
        phoneNextBtn.prop('disabled', !isValid || !isUnique);
        
        if (phone && !isValid) {
            showError(phoneError, '올바른 전화번호 형식을 입력해주세요');
        } else if (phone && !isUnique) {
            showError(phoneError, '이미 사용 중인 전화번호입니다');
        } else {
            hideError(phoneError);
        }
    });
    
    phoneNextBtn.on('click', function() {
        const phone = phoneInput.val().trim();
        
        if (!isValidPhoneNumber(phone)) {
            showError(phoneError, '올바른 전화번호 형식을 입력해주세요');
            return;
        }
        
        const phoneValidation = validatePhoneUniqueness(phone);
        if (!phoneValidation.isValid) {
            showError(phoneError, phoneValidation.message);
            return;
        }
        
        signupData.phone = phone;
        showSignupField('nameField');
        $('#nameInput').focus();
    });
    
    phoneInput.on('keypress', function(e) {
        if (e.which === 13 && !phoneNextBtn.prop('disabled')) {
            phoneNextBtn.click();
        }
    });
}

function setupNameField() {
    const nameInput = $('#nameInput');
    const nameNextBtn = $('#nameNextBtn');
    const nameError = $('#nameError');
    
    nameInput.on('input', function() {
        const name = $(this).val().trim();
        const isValid = name.length >= 2;
        nameNextBtn.prop('disabled', !isValid);
        
        if (name && !isValid) {
            showError(nameError, '이름은 2자 이상 입력해주세요');
        } else {
            hideError(nameError);
        }
    });
    
    nameNextBtn.on('click', function() {
        const name = nameInput.val().trim();
        
        if (name.length < 2) {
            showError(nameError, '이름은 2자 이상 입력해주세요');
            return;
        }
        
        signupData.name = name;
        showSignupField('ageField');
        $('#ageInput').focus();
    });
    
    nameInput.on('keypress', function(e) {
        if (e.which === 13 && !nameNextBtn.prop('disabled')) {
            nameNextBtn.click();
        }
    });
}

function setupAgeField() {
    const ageInput = $('#ageInput');
    const ageNextBtn = $('#ageNextBtn');
    const ageError = $('#ageError');
    
    ageInput.on('input', function() {
        const age = parseInt($(this).val());
        const isValid = age >= 14 && age <= 100;
        ageNextBtn.prop('disabled', !isValid);
        
        if ($(this).val() && !isValid) {
            showError(ageError, '나이는 14세 이상 100세 이하로 입력해주세요');
        } else {
            hideError(ageError);
        }
    });
    
    ageNextBtn.on('click', function() {
        const age = parseInt(ageInput.val());
        
        if (age < 14 || age > 100) {
            showError(ageError, '나이는 14세 이상 100세 이하로 입력해주세요');
            return;
        }
        
        signupData.age = age;
        showSignupField('genderField');
    });
    
    ageInput.on('keypress', function(e) {
        if (e.which === 13 && !ageNextBtn.prop('disabled')) {
            ageNextBtn.click();
        }
    });
}

function setupGenderField() {
    const genderNextBtn = $('#genderNextBtn');
    const genderError = $('#genderError');
    
    $('.gender-option').on('click', function() {
        $('.gender-option').removeClass('selected');
        $(this).addClass('selected');
        
        const gender = $(this).data('gender');
        signupData.gender = gender;
        genderNextBtn.prop('disabled', false);
        hideError(genderError);
    });
    
    genderNextBtn.on('click', function() {
        if (!signupData.gender) {
            showError(genderError, '성별을 선택해주세요');
            return;
        }
        
        showSignupField('signupPasswordField');
        $('#signupPasswordInput').focus();
    });
}

function setupSignupPasswordField() {
    const passwordInput = $('#signupPasswordInput');
    const completeBtn = $('#completeSignupBtn');
    const passwordError = $('#signupPasswordError');
    
    passwordInput.on('input', function() {
        const password = $(this).val().trim();
        const isValid = password.length >= 6;
        completeBtn.prop('disabled', !isValid);
        
        if (password && !isValid) {
            showError(passwordError, '비밀번호는 6자 이상 입력해주세요');
        } else {
            hideError(passwordError);
        }
    });
    
    completeBtn.on('click', function() {
        const password = passwordInput.val().trim();
        
        if (password.length < 6) {
            showError(passwordError, '비밀번호는 6자 이상 입력해주세요');
            return;
        }
        
        signupData.password = password;
        signupData.email = currentEmail;
        
        performSignup(signupData);
    });
    
    passwordInput.on('keypress', function(e) {
        if (e.which === 13 && !completeBtn.prop('disabled')) {
            completeBtn.click();
        }
    });
}

// 이메일 존재 여부 확인
function checkEmailExists(email) {
    console.log('이메일 확인 API 호출 시작:', email);
    showSkeleton();
    currentEmail = email;
    
    // 로컬 스토리지에서 기존 사용자 확인 (데모용)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = existingUsers.find(user => user.email === email);
    
    hideSkeleton();
    
    if (existingUser) {
        // 기존 회원 - 비밀번호 입력
        console.log('기존 회원 - 비밀번호 단계로 이동');
        showPasswordStep(email);
    } else {
        // 신규 회원 - 회원가입
        console.log('신규 회원 - 회원가입 단계로 이동');
        showSignupStep(email);
    }
    
    // 실제 API 호출 시 사용할 코드 (현재는 주석 처리)
    /*
    $.ajax({
        url: '/api/auth/check-email',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email }),
        success: function(response) {
            console.log('이메일 확인 API 응답:', response);
            hideSkeleton();
            
            if (response.success) {
                if (response.isExistingUser) {
                    // 기존 회원 - 비밀번호 입력
                    console.log('기존 회원 - 비밀번호 단계로 이동');
                    showPasswordStep(email);
                } else {
                    // 신규 회원 - 회원가입
                    console.log('신규 회원 - 회원가입 단계로 이동');
                    showSignupStep(email);
                }
            } else {
                console.log('이메일 확인 실패:', response.message);
                showError($('#emailError'), response.message);
            }
        },
        error: function(xhr) {
            console.log('이메일 확인 API 오류:', xhr);
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#emailError'), response ? response.message : '서버 오류가 발생했습니다.');
        }
    });
    */
}

// 이메일 중복 검증 (토스 스타일)
function validateEmailUniqueness(email, currentUserId = null) {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicateUser = existingUsers.find(user => 
        user.email === email && user.id !== currentUserId
    );
    
    if (duplicateUser) {
        return {
            isValid: false,
            message: '이미 사용 중인 이메일입니다'
        };
    }
    
    return { isValid: true };
}

// 전화번호 중복 검증 (토스 스타일)
function validatePhoneUniqueness(phone, currentUserId = null) {
    if (!phone) return { isValid: true };
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicateUser = existingUsers.find(user => 
        user.phone === phone && user.id !== currentUserId
    );
    
    if (duplicateUser) {
        return {
            isValid: false,
            message: '이미 사용 중인 전화번호입니다'
        };
    }
    
    return { isValid: true };
}

// 실시간 이메일 중복 검증 (토스 스타일)
function setupRealTimeEmailValidation(inputElement, errorElement, currentUserId = null) {
    let validationTimeout;
    
    inputElement.on('input', function() {
        const email = $(this).val().trim();
        
        // 이전 타이머 클리어
        clearTimeout(validationTimeout);
        
        if (email === '') {
            hideError(errorElement);
            return;
        }
        
        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            showError(errorElement, '올바른 이메일 형식을 입력해주세요');
            return;
        }
        
        // 중복 검증은 사용자가 타이핑을 멈춘 후 500ms 후에 실행
        validationTimeout = setTimeout(() => {
            const validation = validateEmailUniqueness(email, currentUserId);
            
            if (!validation.isValid) {
                showError(errorElement, validation.message);
            } else {
                hideError(errorElement);
            }
        }, 500);
    });
}

// 실시간 전화번호 중복 검증 (토스 스타일)
function setupRealTimePhoneValidation(inputElement, errorElement, currentUserId = null) {
    let validationTimeout;
    
    inputElement.on('input', function() {
        const phone = $(this).val().trim();
        
        // 이전 타이머 클리어
        clearTimeout(validationTimeout);
        
        if (phone === '') {
            hideError(errorElement);
            return;
        }
        
        // 전화번호 형식 검증
        if (!isValidPhone(phone)) {
            showError(errorElement, '올바른 전화번호 형식을 입력해주세요');
            return;
        }
        
        // 중복 검증은 사용자가 타이핑을 멈춘 후 500ms 후에 실행
        validationTimeout = setTimeout(() => {
            const validation = validatePhoneUniqueness(phone, currentUserId);
            
            if (!validation.isValid) {
                showError(errorElement, validation.message);
            } else {
                hideError(errorElement);
            }
        }, 500);
    });
}

// 전화번호 형식 검증
function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
}

// 로그인 수행
function performLogin(email, password) {
    showSkeleton();
    
    $.ajax({
        url: '/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, password: password }),
        success: function(response) {
            hideSkeleton();
            
            if (response.success) {
                currentUser = response.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('로그인 성공, 사용자 정보:', currentUser);
                
                hideTossAuth();
                // 토스트 알림은 main.js에서 처리
                
                // main.js의 updateLoginStatus 호출 (초기 로드 시 제외)
                if (typeof updateLoginStatus === 'function' && !window.isInitialLoad) {
                    updateLoginStatus();
                }
            } else {
                showError($('#passwordError'), response.message);
            }
        },
        error: function(xhr) {
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#passwordError'), response ? response.message : '로그인 중 오류가 발생했습니다.');
        }
    });
}

// 회원가입 수행
function performSignup(data) {
    showSkeleton();
    
    $.ajax({
        url: '/api/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            hideSkeleton();
            
            if (response.success) {
                currentUser = response.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                hideTossAuth();
                // 회원가입 성공 시에만 토스트 알림 표시
                if (typeof showSuccessToast === 'function') {
                    showSuccessToast('회원가입이 완료되었습니다');
                }
                
                // main.js의 updateLoginStatus 호출 (초기 로드 시 제외)
                if (typeof updateLoginStatus === 'function' && !window.isInitialLoad) {
                    updateLoginStatus();
                }
            } else {
                showError($('#signupPasswordError'), response.message);
            }
        },
        error: function(xhr) {
            hideSkeleton();
            const response = xhr.responseJSON;
            showError($('#signupPasswordError'), response ? response.message : '회원가입 중 오류가 발생했습니다.');
        }
    });
}

// UI 헬퍼 함수들
function showStep(stepId) {
    $('.auth-step').hide();
    $(`#${stepId}`).show();
}

function showPasswordStep(email) {
    console.log('비밀번호 단계 표시:', email);
    $('#userEmail').text(email);
    showStep('passwordStep');
    setTimeout(() => {
        $('#passwordInput').focus();
    }, 100);
}

function showSignupStep(email) {
    console.log('회원가입 단계 표시:', email);
    showStep('signupStep');
    showSignupField('phoneField');
    setTimeout(() => {
        $('#phoneInput').focus();
    }, 100);
}

function showSignupField(fieldId) {
    $('.signup-field').hide().removeClass('active');
    $(`#${fieldId}`).show().addClass('active');
    
    // 제목 업데이트
    const titles = {
        'phoneField': '전화번호를 입력해주세요',
        'nameField': '이름을 입력해주세요', 
        'ageField': '나이를 입력해주세요',
        'genderField': '성별을 선택해주세요',
        'signupPasswordField': '비밀번호를 설정해주세요'
    };
    
    const subtitles = {
        'phoneField': '안전한 서비스 이용을 위해 필요해요',
        'nameField': '실명으로 입력해주세요',
        'ageField': '만 나이로 입력해주세요', 
        'genderField': '더 나은 서비스 제공을 위해 필요해요',
        'signupPasswordField': '안전한 비밀번호로 설정해주세요'
    };
    
    $('#signupTitle').text(titles[fieldId] || '회원가입을 진행할게요');
    $('#signupSubtitle').text(subtitles[fieldId] || '몇 가지 정보가 필요해요');
}

function showSkeleton() {
    // 인증 처리 중에는 전체 페이지 스켈레톤을 노출
    try {
        if (typeof window.showPageSkeleton === 'function') {
            window.showPageSkeleton();
        } else {
            // 폴백: 기존 미니 스켈레톤
            $('.auth-step').hide();
            $('#skeletonLoading').show();
        }
    } catch (e) {
        // 폴백 유지
        $('.auth-step').hide();
        $('#skeletonLoading').show();
    }
}

function hideSkeleton() {
    try {
        if (typeof window.hidePageSkeleton === 'function') {
            window.hidePageSkeleton();
        } else {
            $('#skeletonLoading').hide();
        }
    } catch (e) {
        $('#skeletonLoading').hide();
    }
}

function showError(errorElement, message) {
    errorElement.text(message).addClass('show');
}

function hideError(errorElement) {
    errorElement.removeClass('show');
}

// 토스트 알림은 main.js의 함수를 사용

// 검증 함수들
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
}

function formatPhoneNumber(phone) {
    // 숫자만 추출
    const numbers = phone.replace(/[^\d]/g, '');
    
    // 010으로 시작하는 11자리 숫자인 경우 자동 포맷팅
    if (numbers.length === 11 && numbers.startsWith('010')) {
        return `${numbers.substr(0, 3)}-${numbers.substr(3, 4)}-${numbers.substr(7, 4)}`;
    }
    
    return phone;
}

// 로그인 상태 업데이트는 main.js의 함수 사용

// 로그아웃은 main.js의 함수 사용

// 프로필 관련 함수들은 main.js에서 처리
