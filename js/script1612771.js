var cat = 'Công nghệ';
var tags=['#công nghệ','#kinh doanh','#giải trí','#thế giới'];
var tilte = 'Đây là cái tiêu đề';
var date = '29 th3 2019';
var tomTat = 'Gia đình em gồm bốn người: bố mẹ em, chị gái em và em. Bố em đã ngoài năm mươi là một kỹ sư chế tạo máy, hiện đang công tác ở thành phố Hồ Chí Minh. Mẹ em là một bác sĩ nha khoa công tác ở bệnh viện tỉnh Bến Tre. Chị gái em hiện là sinh viên năm thứ ba ngành quản trị kinh doanh. Còn em, đứa con út trong gia đình đang học lớp Hai trường thị xã.';
var nameAuthor = 'Trường Nguyễn'
var imgs = ["images/post_1.jpg", "images/author_1.jpg"];
var alt ='Đây là ảnh thiết bị apple'

$(document).ready(function(){
  $(".post").append(`<div class="col-lg-5">
  <div class="post_image"><img src="../`+ imgs[0] +`" alt="`+ alt +`">
  </div>
</div>
<div class="col-lg-7">
  <div class="post_content">
    <div class="btn-accept-deny">
      <div class="post_category cat_world"><a href="../category.html">`+ cat +`</a></div>
    </div>
    <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
      <div class="tag"><a href="../category.html">`+ tags[0]+`</a></div>
      <div class="tag"><a href="../category.html">`+ tags[1]+`</a></div>
      <div class="tag"><a href="../category.html">`+ tags[2]+`</a></div>
      <div class="tag"><a href="../category.html">`+ tags[3]+`</a></div>
    </div>
    <div class="post_title"><a href="../single.html">`+ tilte +`</a></div>
    <div class="post_info d-flex flex-row align-items-center justify-content-start">
      <div class="post_author d-flex flex-row align-items-center justify-content-start">
        <div>
          <div class="post_author_image"><img src="../`+ imgs[1] +`" alt=""></div>
        </div>
        <div class="post_author_name"><a href="#">`+ nameAuthor +`</a></div>
      </div>
      <div class="post_date"><a href="#">`+date+`</a></div>
    </div>
    <div class="post_text">
      <p>`+ tomTat +`</p>
    </div>
  </div>
</div>`);
});
$(document).ready(function(){
  $(".post1").append(`<div class="col-lg-5">
  <div class="post_image"><img src="../`+ imgs[0] +`" alt="`+ alt +`">
  </div>
</div>
<div class="col-lg-7">
  <div class="post_content">
    <div>
      <div class="post_category cat_world"><a href="category.html">`+ cat +`</a></div>
    </div>
    <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
      <div class="tag"><a href="category.html">`+ tags[0]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[1]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[2]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[3]+`</a></div>
    </div>
    <div class="post_title"><a href="single.html">`+ tilte +`</a></div>
    <div class="post_info d-flex flex-row align-items-center justify-content-start">
      <div class="post_author d-flex flex-row align-items-center justify-content-start">
        <div>
          <div class="post_author_image"><img src="../`+ imgs[1] +`" alt=""></div>
        </div>
        <div class="post_author_name"><a href="#">`+ nameAuthor +`</a></div>
      </div>
      <div class="post_date"><a href="#">`+date+`</a></div>
    </div>
    <div class="post_text">
      <p>`+ tomTat +`</p>
    </div>
  </div>
</div>`);
});
$(document).ready(function(){
  $(".post2").append(`<div class="col-lg-5">
  <div class="post_image"><img src="../`+ imgs[0] +`" alt="`+ alt +`">
  </div>
</div>
<div class="col-lg-7">
  <div class="post_content">
    <div class="btn-edit">
      <div class="post_category cat_world"><a href="category.html">`+ cat +`</a></div>
    </div>
    <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
      <div class="tag"><a href="category.html">`+ tags[0]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[1]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[2]+`</a></div>
      <div class="tag"><a href="category.html">`+ tags[3]+`</a></div>
    </div>
    <div class="post_title"><a href="single.html">`+ tilte +`</a></div>
    <div class="post_info d-flex flex-row align-items-center justify-content-start">
      <div class="post_author d-flex flex-row align-items-center justify-content-start">
        <div>
          <div class="post_author_image"><img src="../`+ imgs[1] +`" alt=""></div>
        </div>
        <div class="post_author_name"><a href="#">`+ nameAuthor +`</a></div>
      </div>
      <div class="post_date"><a href="#">`+date+`</a></div>
    </div>
    <div class="post_text">
      <p>`+ tomTat +`</p>
    </div>
  </div>
</div>`);
});
$(document).ready(function(){
    // Append all paragraphs on document ready
    $(".btn-accept-deny").append('<div class="pull-right">                                      '+
    '<button class="btn btn-success" data-toggle="modal" data-target="#modalAccept">             '+
    '  <span class="icon text-white-50">                                                         '+
    '    <i class="fas fa-check"></i>                                                            '+
    '  </span>                                                                                   '+
    '  <span class="text">Duyệt</span>                                                           '+
    '</button>                                                                                   '+
    '<button class="btn btn-danger" data-toggle="modal" data-target="#modalDeny">                '+
    '  <span class="icon text-white-50">                                                         '+
    '    <i class="fas fa-times"></i>                                                            '+
    '  </span>                                                                                   '+
    '  <span class="text">Từ chối</span>                                                         '+
    '</button>                                                                                   '+
  '</div>');
});
$(document).ready(function(){
    // Append all paragraphs on document ready
    $(".btn-edit").append('<button class="btn btn-info pull-right" data-toggle="modal" data-target="#modalAccept">     '+
    '<span class="icon text-white-50">                                                                                  '+
    '  <i class="fas fa-edit"></i>                                                                                      '+
    '</span>                                                                                                            '+
    '<span class="text"><a href="text_editor.html" style="color:white" >Chỉnh sửa</a></span>                                                                                '+
	'</button>');
});
