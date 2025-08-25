(function(){
  function renderFooter(){
    var html = ''+
    '<section class="section-footer">\n'
    +'\t<div class="texture-handler-top"></div>\n'
    +'\t<div class="row">\n'
    +'\t\t<div class="col-left">\n'
    +'\t\t\t<p>Copyright &copy; 2024 트립페이지</p>\n'
    +'\t\t\t<p>서울특별시 강남구 테헤란로 123<br>\n'
    +'\t\t\t전화 : 02-1234-5678<br>\n'
    +'\t\t\t이메일 : info@trippage.co.kr</p>\n'
    +'\t\t\t<a href="#" target="_blank"><span class="ion-social-facebook icon-social"></span></a>\n'
    +'\t\t\t<a href="#" target="_blank"><span class="ion-social-instagram icon-social"></span></a>\n'
    +'\t\t\t<a href="#" target="_blank"><span class="ion-social-twitter icon-social"></span></a>\n'
    +'\t\t</div>\n'
    +'\t\t<div class="col-right">\n'
    +'\t\t\t<b>여행 경험</b>\n'
    +'\t\t\t<ul>\n'
    +'\t\t\t\t<li><a href="#">자연여행</a></li>\n'
    +'\t\t\t\t<li><a href="#">문화체험</a></li>\n'
    +'\t\t\t\t<li><a href="#">종교여행</a></li>\n'
    +'\t\t\t\t<li><a href="#">맛집투어</a></li>\n'
    +'\t\t\t\t<li><a href="#">모험여행</a></li>\n'
    +'\t\t\t</ul>\n'
    +'\t\t</div>\n'
    +'\t\t<div class="col-right">\n'
    +'\t\t\t<b>여행 가이드</b>\n'
    +'\t\t\t<ul>\n'
    +'\t\t\t\t<li><a href="#">여행 가이드</a></li>\n'
    +'\t\t\t\t<li><a href="#">여행 상담</a></li>\n'
    +'\t\t\t\t<li><a href="#">숙박 예약</a></li>\n'
    +'\t\t\t\t<li><a href="#">경제 여행</a></li>\n'
    +'\t\t\t</ul>\n'
    +'\t\t</div>\n'
    +'\t\t<div class="col-right">\n'
    +'\t\t\t<b>최신 소식</b>\n'
    +'\t\t\t<ul>\n'
    +'\t\t\t\t<li><a href="#">게시판</a></li>\n'
    +'\t\t\t\t<li><a href="#">이벤트</a></li>\n'
    +'\t\t\t\t<li><a href="#">여행 팁</a></li>\n'
    +'\t\t\t</ul>\n'
    +'\t\t</div>\n'
    +'\t</div>\n'
    +'\t<div class="footer-bottom">\n'
    +'\t\t<p><a href="#" rel="noreferer" target="_blank">트립페이지</a> - 고객의 꿈을 현실로 만드는 여행사</p>\n'
    +'\t</div>\n'
    +'</section>';

    var existing = document.querySelector('section.section-footer');
    if (existing) return; // avoid duplicates
    document.body.insertAdjacentHTML('beforeend', html);
  }

  window.renderFooter = renderFooter;
})();


