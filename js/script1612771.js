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
    '<span class="text">Chỉnh sửa</span>                                                                                '+
	'</button>');
});
