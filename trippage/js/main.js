jQuery(document).ready(function() {
	
	// jQuery 로딩 확인
	console.log('jQuery 버전:', jQuery.fn.jquery);
	console.log('DOM 로딩 완료');
	
	/* Swipe JS */
	window.mySwipe = $('#mySwipe').Swipe().data('Swipe');

	/* Scroll to class */
	$('a[data-slide="slides"]').click(function(e) {
		e.preventDefault();
		$('.sidebar-overlay').trigger('click');
		var target = $(this).data('slide-target');
        $("html, body").animate({
           scrollTop: $(target).offset().top - 13
        }, 600)
	});

	/* Dinamic Scrolled Navbar */
	function hasScrolled() {
		var navbar = $('.navbar');
		if (window.scrollY > 100) {
			navbar.addClass('scrolled');
		} else {
			navbar.removeClass('scrolled');
		}
	}

	/* Button To Top */
	function btnTop() {
		var btn = $('.btn-top');
		if (window.scrollY > 130) {
			btn.fadeIn();
		} else {
			btn.fadeOut();
		}
	}

	/* Call Function top and scroll */

	$(window).scroll(function() {
		hasScrolled();
		btnTop();
	});
	$(window).resize(function() {
		hasScrolled();
		btnTop();
	});
	hasScrolled();
	btnTop();

	/* Sidebar Trigger */
	$('.sidebar-toggle').click(function(e) {
		e.preventDefault();
		$('.sidebar').addClass('active');
		$('.sidebar-overlay').css('visibility', 'visible');
	});
	$('.sidebar-overlay, .close').click(function(e) {
		e.preventDefault();
		$('.sidebar').removeClass('active');
		$('.sidebar-overlay').css('visibility', 'hidden');
	});

	/* Login Form */

	$('#openLogin').click(function() {
		console.log('로그인 버튼 클릭됨'); // 디버깅용
		// 먼저 로그인 폼을 표시
		showLoginForm();
		// 오버레이 표시
		$('.login-overlay').fadeIn();
		// 모달 강제 표시 (transition 비활성화 후 활성화)
		$('.login-form').css('transition', 'none');
		$('.login-form').attr('style', 'visibility: visible !important; opacity: 1 !important; transition: none !important; display: flex !important;');
		// 잠시 후 transition 다시 활성화
		setTimeout(function() {
			$('.login-form').css('transition', '0.5s ease-in-out');
		}, 100);
	});
	
	$('.close').click(function(){
		$('.login-form').attr('style', 'visibility: hidden !important; opacity: 0 !important;');
		$('.login-overlay').fadeOut(1000);
		// 폼 초기화
		resetForms();
	});

	/* Login/Signup Form Toggle */
	
	// 회원가입 폼으로 전환 (더 안전한 이벤트 바인딩)
	$(document).on('click', '#switchToSignup', function(e) {
		e.preventDefault();
		console.log('회원가입 링크 클릭됨'); // 디버깅용
		showSignupForm();
	});
	
	// 로그인 폼으로 전환 (더 안전한 이벤트 바인딩)
	$(document).on('click', '#switchToLogin', function(e) {
		e.preventDefault();
		console.log('로그인 링크 클릭됨'); // 디버깅용
		showLoginForm();
	});
	
	// 로그인 폼 표시 함수
	function showLoginForm() {
		console.log('로그인 폼 표시'); // 디버깅용
		$('#loginForm').show().fadeIn(300);
		$('#signupForm').hide();
	}
	
	// 회원가입 폼 표시 함수
	function showSignupForm() {
		console.log('회원가입 폼 표시'); // 디버깅용
		$('#loginForm').hide();
		$('#signupForm').show().fadeIn(300);
	}
	
	// 폼 초기화 함수
	function resetForms() {
		// 로그인 폼의 모든 input 요소 초기화
		$('#loginForm input').val('');
		// 회원가입 폼의 모든 input 요소 초기화
		$('#signupForm input').val('');
		showLoginForm(); // 다음에 열 때 로그인 폼이 기본으로 표시되도록
	}



	// Tambah Animasi
	$(window).scroll(function() {
        $(".slides").each(function(){
            var pos = $(this).offset().top;

            var winTop = $(window).scrollTop();
            if (pos < winTop + 500) {
            	$(this).addClass("slideanim");
            }
        });
    });

});