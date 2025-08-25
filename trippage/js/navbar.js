// Reusable Navbar Renderer
(function(){
  function renderNavbar(pageType){
    // pageType: 'index' | 'gallery' | 'destination' | 'news'
    var navbarClassMap = {
      index: 'navbar',
      gallery: 'navbar gallery-navbar',
      destination: 'navbar destination-navbar',
      news: 'navbar news-navbar'
    };
    var klass = navbarClassMap[pageType] || 'navbar';

    var navHtml = ''+
    '<nav class="'+klass+'">\n'
    +'\t<div class="container">\n'
    +'\t\t<div class="navbar-bars">\n'
    +'\t\t\t<a href="#" class="navbar-title sidebar-toggle" style="padding: 0;"><i class="ion-navicon-round"></i></a>\n'
    +'\t\t\t<a href="index.html" class="navbar-title">트립페이지</a>\n'
    +'\t\t</div>\n'
    +'\t\t<div class="navbar-item">\n'
    +'\t\t\t<a href="index.html" class="navbar-title">트립페이지</a>\n'
    +'\t\t\t<ul>\n'
    +'\t\t\t\t<li><a href="destination.html">해외여행지</a></li>\n'
    +'\t\t\t\t<li><a href="gallery.html">갤러리</a></li>\n'
    +'\t\t\t\t<li><a href="index.html#discover">상품소개</a></li>\n'
    +'\t\t\t\t<li><a href="board.html">게시판</a></li>\n'
    +'\t\t\t\t<li><button class="btn-login" id="openLogin">로그인</button></li>\n'
    +'\t\t\t\t<li class="user-menu" id="userMenu">\n'
    +'\t\t\t\t\t<div class="user-trigger" id="userTrigger">\n'
    +'\t\t\t\t\t\t<span class="user-name" id="userName"></span>\n'
    +'\t\t\t\t\t\t<i class="ion-chevron-down"></i>\n'
    +'\t\t\t\t\t</div>\n'
    +'\t\t\t\t\t<div class="user-dropdown" id="userDropdown">\n'
    +'\t\t\t\t\t\t<div class="dropdown-header">\n'
    +'\t\t\t\t\t\t\t<span class="dropdown-email" id="dropdownEmail"></span>\n'
    +'\t\t\t\t\t\t</div>\n'
    +'\t\t\t\t\t\t<div class="dropdown-actions">\n'
    +'\t\t\t\t\t\t\t<button class="dropdown-btn profile-btn" id="openProfileModal">\n'
    +'\t\t\t\t\t\t\t\t<i class="ion-person"></i>\n'
    +'\t\t\t\t\t\t\t\t내 정보 수정\n'
    +'\t\t\t\t\t\t\t</button>\n'
    +'\t\t\t\t\t\t\t<button class="dropdown-btn logout-btn" id="logoutBtn">\n'
    +'\t\t\t\t\t\t\t\t<i class="ion-log-out"></i>\n'
    +'\t\t\t\t\t\t\t\t로그아웃\n'
    +'\t\t\t\t\t\t\t</button>\n'
    +'\t\t\t\t\t\t</div>\n'
    +'\t\t\t\t\t</div>\n'
    +'\t\t\t\t</li>\n'
    +'\t\t\t\t<li class="admin-badge" id="adminBadge"><span class="admin-label">관리자</span></li>\n'
    +'\t\t\t</ul>\n'
    +'\t\t</div>\n'
    +'\t</div>\n'
    +'</nav>';

    var sidebarHtml = ''+
    '<div class="sidebar">\n'
    +'<ul class="sidebar-list">\n'
    +'\t<li><a href="" class="close"><span class="ion-android-close"></span></a></li>\n'
    +'\t<li class="sidebar-list-hover"><a href="index.html">홈</a></li>\n'
    +'\t<li class="sidebar-list-hover"><a href="destination.html">해외여행지</a></li>\n'
    +'\t<li class="sidebar-list-hover"><a href="gallery.html">갤러리</a></li>\n'
    +'\t<li class="sidebar-list-hover"><a href="index.html#discover">상품소개</a></li>\n'
    +'\t<li class="sidebar-list-hover"><a href="board.html">게시판</a></li>\n'
    +'\t<li><button class="btn btn-orange btn-round" id="openLoginSidebar">로그인</button></li>\n'
    +'\t<li class="user-menu-sidebar" id="userMenuSidebar">\n'
    +'\t\t<div class="user-info-sidebar">\n'
    +'\t\t\t<span id="userNameSidebar"></span>\n'
    +'\t\t\t<button class="btn btn-profile" id="openProfileModalSidebar">내정보 수정</button>\n'
    +'\t\t\t<button class="btn btn-logout" id="logoutBtnSidebar">로그아웃</button>\n'
    +'\t\t</div>\n'
    +'\t</li>\n'
    +'\t<li class="admin-badge-sidebar" id="adminBadgeSidebar"><span class="admin-label">관리자</span></li>\n'
    +'</ul>\n'
    +'</div>\n'
    +'<section class="sidebar-overlay"></section>';

    // inject at top of body
    var target = document.body;
    target.insertAdjacentHTML('afterbegin', sidebarHtml);
    target.insertAdjacentHTML('afterbegin', navHtml);

    // Wire sidebar open/close
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (toggle && sidebar && overlay){
      toggle.addEventListener('click', function(e){ e.preventDefault(); sidebar.classList.add('active'); overlay.style.visibility='visible'; });
      var close = document.querySelector('.sidebar .close');
      if (close) close.addEventListener('click', function(e){ e.preventDefault(); sidebar.classList.remove('active'); overlay.style.visibility='hidden'; });
      overlay.addEventListener('click', function(){ sidebar.classList.remove('active'); overlay.style.visibility='hidden'; });
    }

    // Wire user dropdown functionality
    var userTrigger = document.getElementById('userTrigger');
    var userDropdown = document.getElementById('userDropdown');
    if (userTrigger && userDropdown) {
      userTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        userDropdown.classList.toggle('show');
      });
      
      // Prevent dropdown from closing when clicking inside dropdown buttons
      var dropdownButtons = userDropdown.querySelectorAll('.dropdown-btn');
      dropdownButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          // Don't close dropdown immediately, let the button action handle it
        });
      });
      
      // 직접 이벤트 리스너 연결
      var profileBtn = userDropdown.querySelector('#openProfileModal');
      var logoutBtn = userDropdown.querySelector('#logoutBtn');
      
      if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 프로필 모달 열기
          var profileModal = document.getElementById('profileModal');
          if (profileModal) {
            profileModal.style.display = 'block';
            // 드롭다운 닫기
            userDropdown.classList.remove('show');
          }
        });
      }
      
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // 로그아웃 실행
          if (typeof logout === 'function') {
            logout();
          } else {
            // main.js의 logout 함수가 없는 경우 직접 실행
            localStorage.removeItem('currentUser');
            localStorage.removeItem('tossAuthEmail');
            localStorage.removeItem('tossAuthStep');
            localStorage.removeItem('tossAuthToken');
            
            // 페이지 새로고침
            location.reload();
          }
        });
      }
      
      // Click outside to close dropdown
      document.addEventListener('click', function(e) {
        if (!userTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.remove('show');
        }
      });
      
      // Close dropdown when pressing Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          userDropdown.classList.remove('show');
        }
      });
    }

    // Update login state if helper exists
    if (window.updateLoginStatus) { try { window.updateLoginStatus(); } catch(e){} }
  }

  window.renderNavbar = renderNavbar;
})();


