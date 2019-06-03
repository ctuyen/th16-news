var cat = 'Công nghệ';
var tags=['#công nghệ','#kinh doanh','#giải trí','#thế giới'];
var tilte = 'Đây là cái tiêu đề';
var date = '29 th3 2019';
var comment = 3;
var tomTat = 'Gia đình em gồm bốn người: bố mẹ em, chị gái em và em. Bố em đã ngoài năm mươi là một kỹ sư chế tạo máy, hiện đang công tác ở thành phố Hồ Chí Minh. Mẹ em là một bác sĩ nha khoa công tác ở bệnh viện tỉnh Bến Tre. Chị gái em hiện là sinh viên năm thứ ba ngành quản trị kinh doanh. Còn em, đứa con út trong gia đình đang học lớp Hai trường thị xã.';
var name = 'Trường Nguyễn'
var imgs = ["images/post_1.jpg", "images/author_1.jpg","https://img.icons8.com/color/48/000000/best-seller.png"];

$(document).ready(function(){
    $(".post01").html(`<div class="post_image"><a href="single.html"><img src="`+imgs[0]+`" alt="ảnh nền"></a></div>
    <div class="post_content">
        <div class="post_category cat_technology"><a href="category.html">`+cat+`</a></div> <span style="float: right"><img src="`+imgs[2]+`" alt=""></span>
        <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
            <div class="tag"><a href="category.html">`+tags[0]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[1]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[2]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[3]+`</a></div>            
        </div>
        <div class="post_title"><a href="single.html">`+tilte+`</a></div>
        <div class="post_info d-flex flex-row align-items-center justify-content-start">
            <div class="post_author d-flex flex-row align-items-center justify-content-start">
                <div><div class="post_author_image"><img src="`+imgs[1]+`" alt=""></div></div>
                <div class="post_author_name"><a href="#">`+name+`</a></div>
            </div>
            <div class="post_date"><a href="#">`+date+`</a></div>
            <div class="post_comments ml-auto"><a href="#">`+comment+` Bình luận </a></div>
        </div>
        <div class="post_text">
            <p>`+tomTat+`</p>
        </div>
    </div>
</div>`);

});

$(document).ready(function(){
    $(".post02").html(`<div class="post_image"><a href="single.html"><img src="`+imgs[0]+`" alt="ảnh nền"></a></div>
    <div class="post_content">
        <div class="post_category cat_technology"><a href="category.html">`+cat+`</a></div>
        <span style="float: right"><img src="`+imgs[2]+`"></span>
        <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
            <div class="tag"><a href="category.html">`+tags[0]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[1]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[2]+`</a></div>
            <div class="tag"><a href="category.html">`+tags[3]+`</a></div>     
            
        </div>
        <div class="post_title"><a href="single.html">`+tilte+`</a></div>
        <div class="post_info d-flex flex-row align-items-center justify-content-start">
            <div class="post_author d-flex flex-row align-items-center justify-content-start">
                <div><div class="post_author_image"><img src="`+imgs[1]+`" alt=""></div></div>
                <div class="post_author_name"><a href="#">`+name+`</a></div>
            </div>
            <div class="post_date"><a href="#">`+date+`</a></div>
        </div>
    </div>`);
    $(".post03").html(`<div class="row">
        <div class="col-lg-5">
            <div class="post_image"><a href="single.html"><img src="`+imgs[0]+`" alt="ảnh nền"></a></div>
        </div>
        <div class="col-lg-7">
            <div class="post_content">
            <div class="post_category cat_technology"><a href="category.html">`+cat+`</a></div>
            <div class="myA tags_content d-flex flex-row align-items-start justify-content-start flex-wrap">
                <div class="tag"><a href="category.html">`+tags[0]+`</a></div>
                <div class="tag"><a href="category.html">`+tags[1]+`</a></div>
                <div class="tag"><a href="category.html">`+tags[2]+`</a></div>
                <div class="tag"><a href="category.html">`+tags[3]+`</a></div>            
            </div>
                <div class="post_title"><a href="single.html">`+tilte+`</a></div>
                <div class="post_info d-flex flex-row align-items-center justify-content-start">
                    <div class="post_author d-flex flex-row align-items-center justify-content-start">
                        <div><div class="post_author_image"><img src="`+imgs[1]+`" alt=""></div></div>
                        <div class="post_author_name"><a href="#">`+name+`</a></div>
                    </div>
                    <div class="post_date"><a href="#">`+date+`</a></div>
                    <div class="post_comments ml-auto"><a href="#">`+comment+` bình luận</a></div>
                </div>
                <div class="post_text">
                    <p>`+tomTat+`</p>
                </div>
            </div>
        </div>
    </div>`);

    $(".post05").html(`<div class="d-flex flex-row align-items-start justify-content-start">
    <div><div class="latest_post_image"><a href="single.html"><img src="images/latest_4.jpg" alt="https://unsplash.com/@juja_han"></a></div></div>
    <div class="latest_post_content">
        <div class="post_category_small cat_technology"><a href="category.html">tech</a></div>
        <div class="latest_post_title"><a href="single.html">New tech development</a></div>
        <div class="latest_post_date">March 12, 2018</div>
    </div>
</div>`);
})