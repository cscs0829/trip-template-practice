jQuery(document).ready(function() {
	
	// jQuery 로딩 확인
	console.log('jQuery 버전:', jQuery.fn.jquery);
	console.log('DOM 로딩 완료');

	// 페이지 로드 시 로그인 상태 확인 및 업데이트
	updateLoginStatus();

	/* Swipe JS */
	var swipeEl = $('#mySwipe');
	if (swipeEl.length && typeof swipeEl.Swipe === 'function') {
		window.mySwipe = swipeEl.Swipe().data('Swipe');
	}

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

	// 로그인 상태 업데이트 함수
	function updateLoginStatus() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		
		if (currentUser) {
			// 로그인 상태일 때
			$('.btn-login, #openLoginSidebar').hide();
			$('.user-menu, .user-menu-sidebar').addClass('logged-in').show();
			
			// 상단 네비게이션: 사용자 이름 표시
			var displayName = (currentUser.name || currentUser.email || '').trim();
			$('#userName').text(displayName);
			
			// 드롭다운에 이메일 표시
			$('#dropdownEmail').text(currentUser.email || '');
			
			// 사이드바에는 전체 이름 노출
			$('#userNameSidebar').text(displayName);
			
			// 관리자 계정인지 확인
			if (currentUser.email === 'admin@trippage.com') {
				$('.admin-badge, .admin-badge-sidebar').show();
			} else {
				$('.admin-badge, .admin-badge-sidebar').hide();
			}
		} else {
			// 로그아웃 상태일 때
			$('.btn-login, #openLoginSidebar').show();
			$('.user-menu, .user-menu-sidebar').removeClass('logged-in').hide();
			$('.admin-badge, .admin-badge-sidebar').hide();
			
			// 드롭다운 내용 초기화
			$('#dropdownEmail').text('');
		}
	}

	// 전역 함수로 등록 (다른 스크립트에서 호출 가능)
	window.updateLoginStatus = updateLoginStatus;

	// ===== Skeleton Utilities =====
	function ensurePageSkeleton() {
		if (document.querySelector('.page-skeleton')) return;
		const overlay = document.createElement('div');
		overlay.className = 'page-skeleton';
		overlay.innerHTML = '<div class="inner">\
			<div class="skeleton skel-header"></div>\
			<div class="skeleton skel-subheader"></div>\
			<div class="skel-grid">\
				<div class="skeleton skel-card"></div>\
				<div class="skeleton skel-card"></div>\
				<div class="skeleton skel-card"></div>\
			</div>\
		</div>';
		document.body.appendChild(overlay);
	}

	function showPageSkeleton() {
		ensurePageSkeleton();
		const overlay = document.querySelector('.page-skeleton');
		if (!overlay) return;
		overlay.classList.add('active');
		// 스크롤 잠금 및 접근성 표시
		document.body.classList.add('skeleton-lock');
		document.body.setAttribute('aria-busy', 'true');
	}

	function hidePageSkeleton() {
		const el = document.querySelector('.page-skeleton');
		if (el) el.classList.remove('active');
		document.body.classList.remove('skeleton-lock');
		document.body.removeAttribute('aria-busy');
	}

	// 노출
	window.showPageSkeleton = showPageSkeleton;
	window.hidePageSkeleton = hidePageSkeleton;

			// 로그아웃 함수
		function logout() {
			localStorage.removeItem('currentUser');
			
			// toss-auth.js 관련 상태도 정리
			localStorage.removeItem('tossAuthEmail');
			localStorage.removeItem('tossAuthStep');
			localStorage.removeItem('tossAuthToken');
			
			updateLoginStatus();
			// 드롭다운 닫기
			$('#userDropdown').removeClass('show');
			
			// 토스트 알림 표시
			showSuccessToast('로그아웃되었습니다.');
			
			// 페이지 새로고침으로 완전한 로그아웃 상태 적용
			setTimeout(() => {
				location.reload();
			}, 1000);
		}

	// 전역 함수로 등록
	window.logout = logout;

	// 로그아웃 버튼 이벤트 리스너
	$(document).on('click', '#logoutBtn, #logoutBtnSidebar', function() {
		logout();
	});

	// 프로필 모달 열기
	$(document).on('click', '#openProfileModal, #openProfileModalSidebar', function() {
		$('#profileModal').show();
		// 드롭다운 닫기
		$('#userDropdown').removeClass('show');
	});

	// 프로필 모달 닫기
	$(document).on('click', '#closeProfileModal, #cancelProfileEdit', function() {
		$('#profileModal').hide();
	});

	// 프로필 폼 제출
	$(document).on('submit', '#profileForm', function(e) {
		e.preventDefault();
		
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (!currentUser) {
			showWarningToast('로그인이 필요합니다.');
			return;
		}

		const formData = {
			name: $('#profileName').val(),
			email: $('#profileEmail').val(),
			phone: $('#profilePhone').val(),
			password: $('#profilePassword').val() || null,
			passwordConfirm: $('#profilePasswordConfirm').val() || null
		};

		// 비밀번호 확인
		if (formData.password && formData.password !== formData.passwordConfirm) {
			showErrorToast('비밀번호가 일치하지 않습니다.');
			return;
		}

		// API 호출하여 프로필 업데이트
		$.ajax({
			url: '/api/auth/profile',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(formData),
			success: function(response) {
				if (response.success) {
					// 로컬 스토리지 업데이트
					const updatedUser = { ...currentUser, ...formData };
					if (formData.password) {
						delete updatedUser.password;
						delete updatedUser.passwordConfirm;
					}
					localStorage.setItem('currentUser', JSON.stringify(updatedUser));
					
					// UI 업데이트
					updateLoginStatus();
					$('#profileModal').hide();
					showSuccessToast('프로필이 성공적으로 업데이트되었습니다.');
					
					// 폼 초기화
					$('#profileForm')[0].reset();
				} else {
					showErrorToast('프로필 업데이트에 실패했습니다: ' + response.message);
				}
			},
			error: function() {
				showErrorToast('프로필 업데이트 중 오류가 발생했습니다.');
			}
		});
	});

	// 페이지 로드 시 프로필 폼 초기화
	if ($('#profileModal').length > 0) {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (currentUser) {
			$('#profileName').val(currentUser.name);
			$('#profileEmail').val(currentUser.email);
			$('#profilePhone').val(currentUser.phone);
		}
	}
});

// Toss-style Toast Notification Functions
function createToastContainer() {
	if (!document.getElementById('toastContainer')) {
		const toastContainer = document.createElement('div');
		toastContainer.id = 'toastContainer';
		toastContainer.className = 'toast-container';
		document.body.appendChild(toastContainer);
	}
}

function showToast(type, title, message, duration = 4000) {
	const toastContainer = document.getElementById('toastContainer');
	if (!toastContainer) {
		createToastContainer();
	}
	
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;
	
	// 아이콘 설정
	let icon = '';
	switch(type) {
		case 'success':
			icon = '✓';
			break;
		case 'error':
			icon = '✕';
			break;
		case 'warning':
			icon = '⚠';
			break;
		case 'info':
			icon = 'ℹ';
			break;
		default:
			icon = 'ℹ';
	}
	
	toast.innerHTML = `
		<div class="toast-icon">${icon}</div>
		<div class="toast-content">
			<div class="toast-title">${title}</div>
			<div class="toast-message">${message}</div>
		</div>
		<button class="toast-close" onclick="this.parentElement.remove()">×</button>
	`;
	
	toastContainer.appendChild(toast);
	
	// 애니메이션 시작
	setTimeout(() => {
		toast.classList.add('show');
	}, 100);
	
	// 자동 제거
	setTimeout(() => {
		if (toast.parentElement) {
			toast.classList.remove('show');
			setTimeout(() => {
				if (toast.parentElement) {
					toast.remove();
				}
			}, 300);
		}
	}, duration);
}

// 기존 alert 함수를 토스트로 대체
function showSuccessToast(message) {
	showToast('success', '성공', message);
}

function showErrorToast(message) {
	showToast('error', '오류', message);
}

function showInfoToast(message) {
	showToast('info', '알림', message);
}

function showWarningToast(message) {
	showToast('warning', '경고', message);
}